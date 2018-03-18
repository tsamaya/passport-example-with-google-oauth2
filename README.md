# passport-example-with-google-oauth2

This repository is a [Passport](http://www.passportjs.org/) example using an [Express](http://expressjs.com/) application with an authentication using Google-OAuth2 authorization.

## Usage

#### Create an OAuth 2.0 client ID

First, create a project at [console.developers.google.com](https://console.developers.google.com)

*Create authorization credentials*

1. Open the [Credentials page](https://console.developers.google.com/apis/credentials) in the API Console.
1. Fill the form for in the _Oauth consent screen_ tab, only the *Product name shown to users* is mandatory
1. Back in _Credentials_ tab,  Click *Create credentials > OAuth client ID*.
1. Complete the form. Set the application type to Web application. Fill the *Authorized redirect URIs*, here with our local server use `http://127.0.0.1:3000/auth/google/callback`.
1. click *Create*

*Enable Google+ Library*

1. Open the [Library page](https://console.developers.google.com/apis/library) in the API console.
1. Search for *Google+ API*
1. Enable this API


#### Configure Strategy

create a `.env` file with:
```
CLIENT_ID=YOUR-CLIENT-ID
CLIENT_SECRET=YOUR-CLIENT-SECRET
```

#### Install dependencies

```sh
$ npm install
```

or

```sh
$ yarn
```

#### Run

```sh
$ npm start
```

or

```sh
$ yarn start
```

open your browser on [localhost:3000](http://localhost:3000)

## Licensing
Licensed under the MIT License

A copy of the license is available in the repository's [LICENSE](LICENSE) file.
