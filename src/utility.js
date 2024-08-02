const fs = require("node:fs/promises");
const axios = require("axios");
const Database = require("better-sqlite3");

const dbFileName = `foobar-${Date.now()}.db`;

const db = new Database(dbFileName);
db.pragma('journal_mode = WAL');

db.prepare(`
    create table test (
        val1 integer,
        val2 text
    ) strict;
`).run();

const makeRequest = async () => {
  try {
    await axios({
      method: "post",
      url: "http://localhost:3000"
    });

    console.log("First request worked");

    const statement = db.prepare(`
        insert into test (val1, val2)
        values (42, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.');
    `);

    for (let i = 0; i < 500_000; i++) {
      statement.run();
    }

    // Enable the following line and it will work:
    // await new Promise((resolve) => setTimeout(resolve, 10));

    await axios({
      method: "post",
      url: "http://localhost:3000"
    });

    console.log("It crashes before it gets here");
  } catch (err) {
    console.error(err);
  } finally {
    db.close();
    await fs.rm(dbFileName);
  }
};

makeRequest();
