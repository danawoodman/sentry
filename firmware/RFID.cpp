#include "application.h"
#include "RFID.h"

RFID::RFID() {
  code = 0;
}

void RFID::begin() {
  Serial1.begin(9600);
}

bool RFID::checkCardReader() {
  uint8_t i = 0;
  char hexcode[9];

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
    code = (int)strtol(hexcode, NULL, 16);

    // Take actions based on the card scanned.
    return true;
  }

  // No card found, move along.
  return false;
}
