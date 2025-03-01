import pg from "pg";

import { config } from "dotenv";

config();

const SQL = `database schema here`;

// this script should be ran ONCE with npx tsx populateDb.ts

async function populateDb() {
  console.log("seeding...");

  const client = new pg.Client({
    connectionString: process.env.DB_CONNECTION_STRING,
  });

  await client.connect();
  await client.query(SQL);
  await client.end();

  console.log("done");
}

populateDb();
