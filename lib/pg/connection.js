import pg from "pg";

let host = `${process.env.DBHOST}:${process.env.DBPORT}`;
// for production add ?ssl=true
let conString = `postgres://${process.env.DBUSER}:${process.env.DBPWD}@${host}/${process.env.DBNAME}`;

let client = new pg.Client(conString);

client.connect( error => {
  if(error) {
    throw new Error(error);
  }

});

module.exports = client;
