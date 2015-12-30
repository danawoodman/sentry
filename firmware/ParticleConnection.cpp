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
