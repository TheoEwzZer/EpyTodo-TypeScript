import { QueryError, createConnection } from "mysql2";

const config = {
  database: process.env.MYSQL_DATABASE,
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_ROOT_PASSWORD,
};

const connection = createConnection(config);

connection.connect((err: QueryError | null): void => {
  if (err) {
    console.error(`error: ${err.message}`);
    return;
  }
  console.log("Connected to the MySQL server");
});

export default connection;
