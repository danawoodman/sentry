//
// To flash your device:
//   particle flash <your-device-name> firmware/sentry.ino
//
// Test event command:
//   particle publish sentry/update-members $'0000000001\t1\tWelcome\n0000000002\t0\tGet lost, Joker'

#include "LiquidCrystal.h"

#define LCD_RS D6
#define LCD_EN D5
#define LCD_DB4 D1
#define LCD_DB5 D2
#define LCD_DB6 D3
#define LCD_DB7 D4

#define LCD_BL_R A0
#define LCD_BL_G A2
#define LCD_BL_B A1

#define LED_PIN D7
#define MAX_CARDS 1000

// Dont demand wifi before our code starts running.
SYSTEM_MODE(MANUAL);

// Represents a card, including how to identify it and what to do when it's scanned.
typedef struct {
  int rfid; // the code from the reader
  bool allow; // true if allowed in, false if not
  char* greeting; // Text that will be shown the card owner when scanned
} Card;

// Array of cards.
Card cards[MAX_CARDS];

// The display and how it's wired.
LiquidCrystal lcd(LCD_RS, LCD_EN, LCD_DB4, LCD_DB5, LCD_DB6, LCD_DB7);

// Number of cards in memory right now.
uint numCards = 0;

// Are we connected to the Particle cloud.
bool connected = false;
bool connecting = false;

void setup() {
  Serial.begin(9600);
  Serial1.begin(9600);

  pinMode(LED_PIN, OUTPUT);
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

  // resetLCD();
}

void loop() {
  checkCardReader();
  manageParticleConnection();
}

void checkCardReader() {
  uint8_t i = 0;
  char hexcode[9];
  int result;

  if (Serial1.available() > 0) {
    delay(20); // Let the buffer fil up for a jif

    while (Serial1.available() > 0) {
      // First three bytes are the header, last 3 bytes are the footer.
      if (i < 3 || i >= 11) {
        Serial1.read();

      // 8 bytes of meat.
      } else {
        hexcode[i-3] = Serial1.read();
      }

      // Next byte.
      i++;
    }

    // Convert hex string to an integer.
    result = (int)strtol(hexcode, NULL, 16);

    // Take actions based on the card scanned.
    checkCode(result);
  }
}

void manageParticleConnection() {
  // Connected, last we knew.
  if (connected) {

    // Process particle events.
    Particle.process();

    // If we were connecting, we are aren't anymore.
    if (connecting) {
      connecting = false;
    }

    // If we are no longer connected, record that state.
    if (!Particle.connected()) {
      connected = false;
      connecting = false;
      lcd.clear();
      lcd.print("Connecting...");
    }

  // Not connected, last we knew.
  } else {

    // Does Partcile say we're connected? record that state.
    if (Particle.connected()) {
      connected = true;
      connecting = false;
      resetLCD();

    // Not connected, and not connecting, so lets try to connect.
    } else if (!connecting) {
      Particle.connect();
      connecting = true;
      lcd.clear();
      lcd.print("Connecting...");
    }
  }
}

void resetLCD() {
  lcd.clear();
  lcd.print("SENTRY");
  lcd.setCursor(0, 1);
  lcd.print("  online");

  digitalWrite(LCD_BL_R, HIGH);
  digitalWrite(LCD_BL_G, HIGH);
  digitalWrite(LCD_BL_B, LOW);
}

// Accept data in tab delineated CSV format, where each row is:
//
//     rfid, allow, greeting
//
// Example:
//
//     1234567890   1   Welcome home, Tony Stark.
//     1357913579   0   I'm sorry Dave, I can't do that.
//
// * rfid: string rfid code. Max 32 characters.
// * allow: 1 if the card access, 0 if it does not.
// * greeting: string that will be shown when the card is scanned. Max 32 characters.
void appendMembers(const char *event, const char *data) {

  // Split the data on tabs and new lines, since we know each row has 3 fields.
  const char delim[3] = "\t\n";

  // Loop this from 0 to 2 so we know which of the 3 card fields we're processing.
  int fieldIdx = 0;

  // Get the first token.
  char* token = strtok((char*)data, delim);

  // Loop until we are out of tokens.
  while (token != NULL) {
    if      (fieldIdx == 0) cards[numCards].rfid = atoi(token);
    else if (fieldIdx == 1) cards[numCards].allow = (strcmp(token, "1") == 0);
    else if (fieldIdx == 2) cards[numCards].greeting = token;

    // Get the next token.
    token = strtok(NULL, delim);

    // Advance to the next field.
    fieldIdx++;

    // If we are past the thrid field, start a new card.
    if (fieldIdx > 2) {
      fieldIdx = 0;
      numCards++;
    }
  }

  // flashDebugLEDs();
  showUpdatedMembersOnLCD();
}

void wipeMembers(const char *event, const char *data) {
  numCards = 0;
}

void checkCode(int code) {
  Card card;

  lcd.clear();

  for (int i = 0; i < numCards; i++) {
    card = cards[i];
    if (card.rfid == code) {
      lcd.print(card.greeting);

      digitalWrite(LCD_BL_R, HIGH);
      digitalWrite(LCD_BL_G, LOW);
      digitalWrite(LCD_BL_B, HIGH);

      delay(3000);
      resetLCD();
      return;
    }
  }

  lcd.print(" ACCESS  DENIED ");
  digitalWrite(LCD_BL_R, LOW);
  digitalWrite(LCD_BL_G, HIGH);
  digitalWrite(LCD_BL_B, HIGH);
  delay(3000);

  resetLCD();
}

// TEMP
//
void showUpdatedMembersOnLCD() {
  lcd.clear();
  lcd.print("UPDATE!");
  lcd.setCursor(0, 1);
  lcd.print("Has");
  lcd.print(numCards);
  lcd.print(" cards.");
  delay(500);

  resetLCD();
}

void flashDebugLEDs() {
  for (int i = 0; i < numCards; i++) {
    digitalWrite(LED_PIN, HIGH);
    delay(800);
    digitalWrite(LED_PIN, LOW);
    delay(200);
  }

  delay(1000);

  for (int i = 0; i < strlen(cards[1].greeting); i++) {
    digitalWrite(LED_PIN, HIGH);
    delay(100);
    digitalWrite(LED_PIN, LOW);
    delay(300);
  }
}
