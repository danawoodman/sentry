# Sentry

> A RFID doorlock application that integrates with Cobot

This is the server component of the RFID doorlock system known as Sentry.


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


## Credits

Developed by [Dana Woodman](http://danawoodman.com) for [Chimera Art Space](http://chimeraarts.org), the first (and coolest) makerspace in Sonoma County, California.

See `credits.md` for a full list of the awesome people and groups that made this project possible.


## License

Copyright &copy; Dana Woodman 2015

Licensed under an MIT license. See `license.md`.
