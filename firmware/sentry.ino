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

#define LED_PIN D7
#define MAX_CARDS 1000

// Represents a card, including how to identify it and what to do when it's scanned.
typedef struct {
  char* rfid; // the code from the reader
  bool allow; // true if allowed in, false if not
  char* greeting; // Text that will be shown the card owner when scanned
} Card;

// Array of cards.
Card cards[MAX_CARDS];

// The display and how it's wired.
LiquidCrystal lcd(LCD_RS, LCD_EN, LCD_DB4, LCD_DB5, LCD_DB6, LCD_DB7);

// Number of cards in memory right now.
uint numCards = 0;

void setup() {
  pinMode(LED_PIN, OUTPUT);
  Particle.subscribe("sentry/update-members", updateMembers);
  lcd.begin(16, 2);
  resetLCD();
}

void loop() {
}

void resetLCD() {
  lcd.clear();
  lcd.print("SENTRY");
  lcd.setCursor(0, 1);
  lcd.print("  online");
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
void updateMembers(const char *event, const char *data) {

  // Split the data on tabs and new lines, since we know each row has 3 fields.
  const char delim[3] = "\t\n";

  // Reset the card count.
  numCards = 0;

  // Loop this from 0 to 2 so we know which of the 3 card fields we're processing.
  int fieldIdx = 0;

  // Get the first token.
  char* token = strtok((char*)data, delim);

  // Loop until we are out of tokens.
  while (token != NULL) {
    if      (fieldIdx == 0) cards[numCards].rfid = token;
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

  flashDebugLEDs();
  // showUpdatedMembersOnLCD();
}

// TEMP
//
void showUpdatedMembersOnLCD() {
  lcd.clear();
  lcd.print("UPDATE!");
  lcd.setCursor(0, 1);
  lcd.print("  Got ");
  lcd.print(numCards);
  lcd.print(" cards.");
  delay(3000);

  for (int i = 0; i < numCards; i++) {
    lcd.clear();
    lcd.print(cards[i].greeting);
    delay(3000);
  }

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
