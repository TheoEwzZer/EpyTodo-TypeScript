import express, {
  Express,
  Request,
  Response,
  urlencoded,
  json,
  raw,
} from "express";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();

const port: string | undefined = process.env.PORT;

app.use(urlencoded({ extended: true }));
app.use(json());
app.use(raw());

import userRoutes from "./routes/user/user";
import todosRoutes from "./routes/todos/todos";
import authRoutes from "./routes/auth/auth";

userRoutes(app, bcrypt);
todosRoutes(app);
authRoutes(app, bcrypt);

app.listen(port, (): void => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.get("/", (_req: Request, res: Response): void => {
  res.status(200).json({ msg: "Welcome to EpyTodo" });
});

app.use((_req: Request, res: Response): void => {
  res.status(404).json({ msg: "Not Found" });
});
