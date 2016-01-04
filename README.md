## Slack Futbol

[![Build Status](https://travis-ci.org/pola88/slack_futbol.svg)](https://travis-ci.org/pola88/slack_futbol)

### Database Configuration

This boot uses postgres.

#### Create Tables

    $ psql -f db/tables.sql

### Configure Environment Variables

Set the following variables to run the app (.env):

```
PBOT_APITOKEN=yourToken
SLACK_API=https://slack.com/api
PBOT_ID=U089DHV6J
DBNAME=gronpola
DBUSER=user
DBPWD=
DBPORT=5432
DBHOST=localhost
TELEGRAM_KEY=yourKey
```

### Run the bot:

    $ npm start

### Test:

Add the file "test_env" into spec folder with the environment variables for testing.

#### Run the tests:

    $ npm test
