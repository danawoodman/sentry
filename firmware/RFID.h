#ifndef RFID_h
#define RFID_h

class RFID {
  public:

    // Init
    RFID();

    // Starts listening and Serial1 for data from the RFID reader
    void begin();

    // Returns true if we have card scan data, and sets the RFID
    // code to `code`.
    bool checkCardReader();

    // The last scanned RFID code.
    int code;
};

#endif
