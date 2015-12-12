# Sentry

> A RFID doorlock application that integrates with Cobot using Particle Photons.

**Note: we are currently under active development. This project is not yet ready to use. Stay tuned!**

![screenshot](http://cl.ly/e4y0/Screen%20Shot%202015-12-12%20at%202.33.19%20PM.png)

## Overview

Sentry is a doorlock access control system using RFID cards, Particle Photons (WIFI connected Arduinos) and Cobot (a co-working space management system).

Sentry consists of two parts:

- The server
- The door lock(s)

### The server

The brains of Sentry is a Node.js server that

- Connects to Cobot, getting an updated list of memberships and logging checkins
- Connects to Particle's API to send and receive messages from the Photons
- Displays a list of memberships and their current status
- Displays all connected door lock devices and allows manual syncronization
- Manual and automatic syncing (a redis job running every 5 minutes) of membership information from Cobot
- Secured behind HTTP basic authentication (set `ADMIN_USERNAME` and `ADMIN_PASSWORD`)
- Fully deployable to cloud hosts like Heroku or Docker
- All memberships and checkins are stored in MongoDB so they can be retrieved and logged independently of a connection with Cobot (if Cobot goes down, your system will still work, at least in a limited capacity)

The server supports the concept of "unlimited" plans which are not limited by day passes as well as "staff" plans which allow unlimited access. See the `src/config/config.js` file for environment configs that control these properties.

Code for the server is located in `src/` and the tests live in `test/`

Static assets (css, js, images) are located in `public/`. `src/assets` contains SCSS and ES2015/6/7 JavaScript that will get compiled/transpiled to plain CSS/ES5.


### The door locks

The door locks, powered by [Particle Photons](https://store.particle.io/):

- Read a scanned RFID card (from a 125khz RFID card using a standard RFID reader)
- Authenticate the card against a local list of access tokens retrieved from the Node.js server
- Log checkins into the space locally (who, what time, what door and if it succeeded or not)
- Periodically syncronize with the Node.js server by sending any recent checkins and then receiving an updated list of access tokens.
- Uses various means to open the door including an electronic door latch, a servo or some other means yet to be devised.
- Works with or without WIFI and can have an optional battery backup (syncing of course won't work without WIFI but the local cards will still read properly)
- Supports writing a display messager to a display including support for color coded messages (green for success, blue for "ready" and red for errors)

The door receives a list of all members within a Cobot account so that it can display a relevant message to a user like:

> Hello John, sorry but you're out of day passes. Go to https://chimera.cobot.me to buy more!

Or:

> Welcome in Jane, make something awesome today!

These messages are customizable via the admin so you can personalize things to fit your space and community.

Code for the door locks lives in `firmware/`


## Setup

Dependencies:

- Node v5.x
- MongoDB

The following should get you setup:

```shell
# Install nvm to manage your node versions (optional)
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.29.0/install.sh | bash

# Install the proper node version (looking at the ".nvmrc" file)
nvm install
nvm use

# Install dependencies
npm install
```


## Developing

- Run the dev server: `npm run watch`
- Run the tests: `npm test`
- Watch tests: `npm run watch-test`
- Wipe and seed the database with sample data: `npm run seed`


### Cobot Integration

To integrate with Cobot, you will need to create an Oauth2 client, update your local configuration and then serve your application. See below for details.

First, copy over the same environment config file:

```shell
cp .env.example .env
```

Now, [create an OAuth2 application on Cobot](https://www.cobot.me/oauth2_clients/new) with the following info (tweak as desired):

- Name: `My Doorlock`
- Main Application URL: `http://my-doorlock-app.ngrok.io`
- Redirect URL: `http://my-doorlock-app.ngrok.io/auth/cobot/callback`
- Scope: `checkin, checkin_tokens, read, read_check_ins, read_memberships, and write`

Next, copy your client ID and secret to `COBOT_CLIENT_ID` and `COBOT_CLIENT_SECRET` respectively into your `.env` file. Then set `APP_URL` to your ngrok address (e.g. `http://my-doorlock-app.ngrok.io`).

Finally, you will need to serve the application locally using something like [ngrok](http://ngrok.io) so that you can forward external requests to your local machine:

```shell
# In one tab:
npm run watch

# In another tab:
ngrok http --subdomain my-doorlock-app 5555
```


## Production

You can run the application with `npm start` or using foreman `foreman start`.


### Deploy

Deploying to something like Heroku:

- Push to Heroku
- Setup a MongoDB host (e.g. MongoLab or similar)
- Set your environment configs (e.g. `heroku config:set ...`)


## Screenshots

Memberships list:

![memberships](http://cl.ly/e4y0/Screen%20Shot%202015-12-12%20at%202.33.19%20PM.png)

Device list:

![devices](http://cl.ly/e4lt/Screen%20Shot%202015-12-12%20at%202.35.10%20PM.png)

Login with Particle:

![Particle login](http://cl.ly/e4BS/Screen%20Shot%202015-12-12%20at%202.36.14%20PM.png)


## Credits

Developed by [Dana Woodman](http://danawoodman.com) and [Alex Wayne](http://beautifulpixel.com) of [BIG](http://builtbybig.com) for [Chimera Art Space](http://chimeraarts.org), the first (and coolest) makerspace in Sonoma County, California.

See `credits.md` for a full list of the awesome people and groups that made this project possible.


## License

Copyright &copy; 2015 Built By BIG LLC.

Licensed under an MIT license. See `license.md`.
