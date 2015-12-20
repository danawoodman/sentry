#include "application.h"
#include "ParticleConnection.h"

ParticleConnection::ParticleConnection() {
  connected = false;
  connecting = false;
}

bool ParticleConnection::didStartConnecting() {
  if (!Particle.connected() && !connecting) {
    Particle.connect();
    connected = false;
    connecting = true;
    return true;
  } else {
    return false;
  }
}

bool ParticleConnection::didConnect() {
  if (!connected && Particle.connected()) {
    connected = true;
    return true;
  } else {
    return false;
  }
}

// void monitor() {
//   // Connected, last we knew.
//   if (connected) {
//
//     // Process particle events.
//     Particle.process();
//
//     // If we were connecting, we are aren't anymore.
//     if (connecting) {
//       connecting = false;
//     }
//
//     // If we are no longer connected, record that state.
//     if (!Particle.connected()) {
//       connected = false;
//       connecting = false;
//       lcd.clear();
//       lcd.print("Connecting...");
//     }
//
//   // Not connected, last we knew.
//   } else {
//
//     // Does Partcile say we're connected? record that state.
//     if (Particle.connected()) {
//       connected = true;
//       connecting = false;
//       Particle.publish("sentry/request-members");
//       resetLCD();
//
//     // Not connected, and not connecting, so lets try to connect.
//     } else if (!connecting) {
//       Particle.connect();
//       connecting = true;
//       lcd.clear();
//       lcd.print("Connecting...");
//     }
//   }
// }
