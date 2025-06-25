const Database =require ('better-sqlite3');
const { createTables } = require ('./schema.js');

const db = new Database('focusflow.db');
createTables(db);

module.exports=db;