import pg from "pg";

let host = `${process.env.DBHOST}:${process.env.DBPORT}`;
// for production add ?ssl=true
let conString = `postgresql://${process.env.DBUSER}:${process.env.DBPWD}@${host}/${process.env.DBNAME}?ssl=${process.env.NODE_ENV === "prd"}`;

let client = new pg.Client({ connectionString: conString });

client.connect( error => {
  if(error) {
    throw new Error(error);
  }

});

module.exports = client;
