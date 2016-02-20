Particle Pub/Sub Events
=======================

Publishes: `sentry/request-members`
----------------------------------

When the device boots up and connects to the internet, it will publish this event. No response is expected, but the server should then publish a set of wipe/append events so the device can be up to date as soon as possible.

Subscribes: `sentry/wipe-members`
---------------------------------

This event will remove _all_ cards from the SD storage.

Subscribes: `sentry/append-members`
-----------------------------------

This event will add a set of RFID cards to the SD storage. It expects `data` pushed with the event that is a tab delimited CSV of cards to add.

CSV Format:

    RfidCode AllowAccess GreetingLine1 GreetingLine2

* RfidCode: the 10 digits that that are on the face of each card.
* AllowAccess: "1" means allow access, "0" means do not.
* GreetingLine1: Exactly 16 characters (padded with spaces) shown on the first line of the LCD this card is scanned.
* GreetingLine2: Exactly 16 characters (padded with spaces) shown on the second line of the LCD this card is scanned.

Example:

    1234567890\t1\tACCESS GRANTED  \tWelcome, Alex   \n
    9876543210\t1\tACCESS DENIED   \t      :(        
