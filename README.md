## Slack Futbol

### Database Configuration

This boot uses postgres.

#### Create Tables

    $ psql -f db/tables.sql

### Configure Environment Variables

Set the following variables to run the app (.env):

```
PBOT_APITOKEN=yourToken
DBNAME=gronpola
DBUSER=user
DBPWD=
DBPORT=5432
DBHOST=localhost
```

### Run the bot:

    $ npm start

### Test:

Add the file "test_env" into spec folder with the environment variables for testing.

#### Run the tests:

    $ npm test
