# Payments Microservice

## Description

Microservice for managing payments in a store system. Built for learning and experimentation.

## Project setup

```bash
$ npm install
```

## Set environment variable

Create a file `.env` from `.env.template` and fill the variables with right values

## Forward webhook from Hookdeck to localhost

Run the following command to start the local server and forward Stripe events from Hookdeck to your machine:

```bash
hookdeck listen 3003 stripe-to-localhost
```

You can monitor and inspect the forwarded events directly in the [Hookdeck Dashboard](https://dashboard.hookdeck.com/events)

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Stay in touch

- Author - [Roberto Granda Ruiz](https://www.linkedin.com/in/roberto-granda-ruiz-37214b128/)

## License

This project is licensed under the [MIT License](./LICENSE).
