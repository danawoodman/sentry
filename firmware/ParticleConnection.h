#ifndef ParticleConnection_h
#define ParticleConnection_h

class ParticleConnection {
  public:

    // Init
    ParticleConnection();

    bool connected;
    bool connecting;

    bool didConnect();
    bool didStartConnecting();

};

#endif
