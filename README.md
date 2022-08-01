## How to run this <3

# .env files
You want to create 2 different files (.env.dev && .env.test). Write "PGDATABASE=nc_news" for the dev file and add "_test" for the test file. After that, run "npm run setup-dbs" to initialize both databases.
Last but not least:
- if you want to run the tests do -> "npm test"
- if you want to deal with the dev database do -> "npm run seed" to re-seed the database everytime
