import dotenv from "dotenv";
import { QueryError, createConnection, Connection } from "mysql2";

dotenv.config();

interface Config {
  database: string | undefined;
  host: string | undefined;
  user: string | undefined;
  password: string | undefined;
}

const config: Config = {
  database: process.env.MYSQL_DATABASE,
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_ROOT_PASSWORD,
};

const connection: Connection = createConnection(config);

connection.connect((err: QueryError | null): void => {
  if (err) {
    console.error(`error: ${err.message}`);
    return;
  }
  console.log("Connected to the MySQL server");
});

export default connection;
