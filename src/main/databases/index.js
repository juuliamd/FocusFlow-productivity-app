import Database from 'better-sqlite3';
import { createTables } from './schema.js';

const db = new Database('focusflow.db');
createTables(db);

export default db;
