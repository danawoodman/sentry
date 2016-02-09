#include "application.h"
#include "Store.h"
#include "SdFat.h"

#define SD_CS D7
#define SD_MOSI A5
#define SD_MISO A4
#define SD_CLK A3

#define MAX_LINE_SIZE 10   + 1  + 1  + 1 + 16       + 1 + 16
//                    rfid   \t   1/0  \t  greeting1  \t  greeting2

SdFat SD;

Store::Store() {
  // Initialize HARDWARE SPI with user defined chipSelect
  SD.begin(SD_CS);
}

// Accept data in tab delineated CSV format, where each row is:
//
//     rfid, allow, greetingLine1, greetingLine2
//
// * rfid: string rfid code. 10 numeric characters.
// * allow: 1 if the card access, 0 if it does not.
// * greetingLine1 & 2: up 16 character strings that will be shown when the card is scanned.
//
// Example:
//
//     1234567890   1   Welcome home,    Tony Stark.
//     1357913579   0   I'm sorry Dave,  I can't do that.
//
void Store::appendCards(const char *csv) {

  // Split the data on tabs and new lines, since we know each row has 4 fields.
  const char delim[3] = "\t\n";

  // Loop this from 0 to 3 so we know which of the 4 card fields we're processing.
  int fieldIdx = 0;

  // These hold data for each card parsed.
  int cardCode;
  bool cardAllowed;
  char* cardGreeting1;
  char* cardGreeting2;

  // Get the first token.
  char* token = strtok((char*)csv, delim);

  // Loop until we are out of tokens.
  while (token != NULL) {
    switch (fieldIdx) {
      case 0:
        // "0001234567" -> 1234567
        cardCode = atoi(token);
        break;

      case 1:
        // "0" -> false
        // "1" -> true
        cardAllowed = (strcmp(token, "1") == 0);
        break;

      case 2:
        cardGreeting1 = token;
        break;

      case 3:
        cardGreeting2 = token;
    }

    // Get the next token.
    token = strtok(NULL, delim);

    // Advance to the next field.
    fieldIdx++;

    // If we are past the fourth field, save this card and prep a new card.
    if (fieldIdx > 3) {
      appendCard(cardCode, cardAllowed, cardGreeting1, cardGreeting2);
      fieldIdx = 0;
    }
  }
}

void Store::appendCard(int code, bool allow, char* greeting1, char* greeting2) {
  char codeChars[] = "0000000000";
  sprintf(codeChars, "%010d", code);

  File cards = SD.open("cards.csv", FILE_WRITE);
  cards.print(codeChars);
  cards.print("\t");
  cards.print(allow ? "1" : "0");
  cards.print("\t");
  cards.print(greeting1);
  cards.print("\t");
  cards.print(greeting2);
  cards.print("\n");

  cards.close();
}

void Store::wipeCards() {
  SD.remove("cards.csv");
}

bool Store::allowCard(int code, char line1[17], char line2[17]) {
  const char delim[2] = "\t";
  char* token;
  char character;
  char buf[MAX_LINE_SIZE];

  bool allowedIn;

  File cards = SD.open("cards.csv");
  uint i = 0;
  if (cards) {
    while (cards.available()) {
      character = cards.read();

      // Process the buffer on a newline.
      if (character == '\n') {

        // See if the first token on the line is the code we want.
        token = strtok((char*)buf, delim);

        if (atoi(token) == code) {
          // This is code we are looking for!

          // See if the code we found is allowed in.
          token = strtok(NULL, delim);
          allowedIn = (atoi(token) == 1);

          // copy the message lines into the strings buffers.
          token = strtok(NULL, delim);
          strncpy(line1, token, 16);

          token = strtok(NULL, delim);
          strncpy(line2, token, 16);

          // Return true if we allow you in.
          return allowedIn;
        }

        // Reset the character counter.
        i = 0;

      // Fill the buffer
      } else {
        buf[i++] = character;
      }
    }
  }

  return false;
}

// atoi(token);
