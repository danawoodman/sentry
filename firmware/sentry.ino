#define LED_PIN D7
#define MAX_CARDS
int state = 0;

typedef struct {
  char* rfid;
  bool allow;
  char* greeting;
} Card;

Card cards[1000];
int numCards = 0;

void setup() {
  numCards = 2;

  cards[0].rfid = "0000000001";
  cards[0].allow = true;
  cards[0].greeting = "Welcome, Batman.";

  cards[1].rfid = "0000000002";
  cards[1].allow = false;
  cards[1].greeting = "No way, Joker!";

  pinMode(LED_PIN, OUTPUT);
}
void loop() {
  digitalWrite(LED_PIN, (state) ? HIGH : LOW);

  //invert the state
  state = !state;

  //wait half a second
  delay(1000);
}
