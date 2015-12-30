#ifndef Store_h
#define Store_h

class Store {
  public:

    // Init
    Store();

    void appendCards(const char *csv);
    void appendCard(int code, bool allow, char* greeting1, char* greeting2);
    void wipeCards();

    bool allowCard(int code, char line1[17], char line2[17]);

};

#endif
