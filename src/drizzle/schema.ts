import { pgTableCreator } from "drizzle-orm/pg-core";

const createTable = pgTableCreator((name) => `narudo_${name}`);

//  ||--------------------------------------------------------------------------------||
//  ||                                schemas below...                                ||
//  ||--------------------------------------------------------------------------------||
