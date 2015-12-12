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

# Copy over and edit your local config:
cp .env.example .env
```

Make sure to [create an OAuth2 application on Cobot](https://www.cobot.me/oauth2_clients) and copy your client id and secret into the `.env` file.


## Developing

- Run the dev server: `npm run watch`
- Run the tests: `npm test`
- Watch tests: `npm run watch-test`


## Production

You can run the application with `npm start`.


### Deploy

Deploying to something like Heroku:

- Push to Heroku
- Setup a MongoDB host (e.g. MongoLab or similar)
- Set your environment configs (e.g. `heroku config:set ...`)


## Credits

Developed by [Dana Woodman](http://danawoodman.com) for [Chimera Art Space](http://chimeraarts.org), the first (and coolest) makerspace in Sonoma County, California.


## License

Copyright &copy; Dana Woodman 2015

Licensed under an MIT license. See `license.md`.
