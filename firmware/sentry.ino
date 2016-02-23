//
// To flash your device:
//   particle flash <your-device-name> firmware/sentry.ino
//
// Test event command:
//   particle publish sentry/wipe-members
//   particle publish sentry/append-members $'0000000001\t1\tWelcome,\tAlex\n0000000002\t0\tGet lost,\tJoker'

#include "LiquidCrystal.h"
#include "RFID.h"
#include "ParticleConnection.h"
#include "Store.h"

#define LCD_RS D6
#define LCD_EN D5
#define LCD_DB4 D4
#define LCD_DB5 D3
#define LCD_DB6 D2
#define LCD_DB7 D1

#define LCD_BL_R A0
#define LCD_BL_G A1
#define LCD_BL_B A2

#define LOCK_SERVO_PIN D0

// Dont demand wifi before our code starts running.
SYSTEM_MODE(MANUAL);

// The display and how it's wired.
LiquidCrystal lcd(LCD_RS, LCD_EN, LCD_DB4, LCD_DB5, LCD_DB6, LCD_DB7);

// RFID Reader Interface
RFID rfid = RFID();

// Number of cards in memory right now.
uint numCards = 0;

// Are we connected to the Particle cloud.
ParticleConnection cloud = ParticleConnection();

// SD card that we use for storage.
Store store = Store();

// This servo controls the door lock.
Servo lockServo;

// Minumum amount of milliseconds that it will lock out an already scanned card.
#define CODE_RESCAN_DELAY 10000

// The code of the last card read.
int lastCode;

// When that last card read is allowed ot be read again.
unsigned long lastCodeCanRescanAt;

bool connected = false;
bool connecting = false;

void setup() {
  Serial.begin(9600);
  rfid.begin();

  lockServo.attach(LOCK_SERVO_PIN);

  pinMode(LCD_BL_R, OUTPUT);
  pinMode(LCD_BL_G, OUTPUT);
  pinMode(LCD_BL_B, OUTPUT);

  digitalWrite(LCD_BL_R, HIGH);
  digitalWrite(LCD_BL_G, HIGH);
  digitalWrite(LCD_BL_B, LOW);

  Particle.subscribe("sentry/wipe-members", wipeMembers);
  Particle.subscribe("sentry/append-members", appendMembers);

  lcd.begin(16, 2);
  lcd.print("Connecting...");

  lockDoor();
}

void loop() {
  if (rfid.checkCardReader()) {
    checkCode(rfid.code);
  }
  manageParticleConnection();
}

void manageParticleConnection() {
  if (cloud.connected) {
    Particle.process();
  }

  if (cloud.didConnect()) {
    resetLCD();
    Particle.publish("sentry/request-members");
  } else if (cloud.didStartConnecting()) {
    lcd.clear();
    lcd.print("  Connecting... ");
  }
}

void resetLCD() {
  lcd.clear();
  lcd.print("S  E  N  T  R  Y");
  lcd.setCursor(0, 1);
  lcd.print(" Chimera Makers ");

  setBacklight(0, 0, 1);
}

void setBacklight(bool r, bool g, bool b) {
  digitalWrite(LCD_BL_R, r ? LOW : HIGH);
  digitalWrite(LCD_BL_G, g ? LOW : HIGH);
  digitalWrite(LCD_BL_B, b ? LOW : HIGH);
}

// Reset the card counter to zero, meaning we have no cards in memory.
void wipeMembers(const char *event, const char *data) {
  store.wipeCards();
}

void appendMembers(const char *event, const char *data) {
  store.appendCards(data);
}

void checkCode(int code) {
  char line1[17];
  char line2[17];

  // Prevent double scans by ignoring the same card within a short period.
  if ((code == lastCode) && (millis() < lastCodeCanRescanAt)) {
    return;
  }

  Particle.publish("sentry/card-scanned", String(code));

  if (store.allowCard(code, line1, line2)) {
    lastCode = code;
    lastCodeCanRescanAt = millis() + CODE_RESCAN_DELAY;
    allowCard(line1, line2);
  } else {
    denyCard(line1, line2);
  }
}

void allowCard(char* line1, char* line2) {
  lcd.clear();
  lcd.print(line1);
  lcd.setCursor(0, 1);
  lcd.print(line2);

  setBacklight(0, 1, 0);
  unlockDoor();
  delay(6000);
  lockDoor();

  resetLCD();
}

void denyCard(char* line1, char* line2) {
  lcd.clear();
  lcd.print(line1);
  lcd.setCursor(0, 1);
  lcd.print(line2);

  setBacklight(1, 0, 0);

  delay(2000);
  resetLCD();
}

void denyUnknownCard() {
  lcd.clear();
  lcd.print(" ACCESS  DENIED ");
  setBacklight(1, 0, 0);

  delay(2000);
  resetLCD();
}

void unlockDoor() {
  lockServo.write(125);
}

void lockDoor() {
  lockServo.write(50);
}
