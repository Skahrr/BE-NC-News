
# .env files
You want to create 2 different files (.env.dev && .env.test). Write "PGDATABASE=nc_news" for the dev file and add "_test" for the test file. After that, run "npm run setup-dbs" to initialize both databases.
Last but not least:
- if you want to run the tests do -> "npm test"
- if you want to deal with the dev database do -> "npm run seed" to re-seed the database everytime


# Northcoders News Project

## About

Northcoders news is an API designed as the backend for a news app. The API interacts with data and allows for the following functionality:

- GET requests for users, topics, articles and their comments
- GET requests for articles by an identifier
- PATCH requests to add or remove votes
- POST new comments
- DELETE comments
- Articles can be filtered by topic and sorted in specified orders.

## Hosted Version

Northcoders News is hosted on Heroku, you can find it here:

https://be-nc-news-aaron.herokuapp.com


# Installation

This project was made using Node.js version 16.14.2 and Postgres version 14. It is recommended that at least these versions are installed.

To get everything ready to go, clone the repo on your local machine and use *npm i* to install all the dependancies this repo has. (You can have a look at them on the package.json)


## 1. Environment Variables & Database Set up

You want to create 2 different files (.env.dev && .env.test). Write "PGDATABASE=nc_news" for the dev file and add "_test" for the test file. After that, run "npm run setup-dbs" to initialize both databases.
Last but not least:
- if you want to deal with the dev database do -> "npm run seed" to re-seed the database everytime
- if you want to run the tests check the next step



## 2. Testing

The tests for this API are located in the `__tests__` folder. To run the tests, please run this command:

```
npm test app.test
```