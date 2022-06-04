import dotenv from "dotenv";
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const MYSQL = {
  host: process.env.HOST,
  database: process.env.DATABASE,
  user: process.env.USER,
  pass: process.env.PASS,
};

const SERVER = {
  hostname: process.env.HOST,
  port: process.env.PORT,
};

const config = {
  mysql: MYSQL,
  server: SERVER,
};

export default config;
