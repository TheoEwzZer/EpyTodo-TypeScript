import express, {
  Express,
  Request,
  Response,
  json,
  raw,
  urlencoded,
} from "express";
import authRoutes from "./routes/auth/auth";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import todosRoutes from "./routes/todos/todos";
import userRoutes from "./routes/user/user";

dotenv.config();

const app: Express = express();

const port: string | 3000 = process.env.PORT || 3000;

app.use(json());
app.use(raw());
app.use(urlencoded({ extended: true }));

authRoutes(app, bcrypt);
todosRoutes(app);
userRoutes(app, bcrypt);

app.listen(port, (): void => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.get("/", (_req: Request, res: Response): void => {
  res.status(200).json({ msg: "Welcome to EpyTodo" });
});

app.use((_req: Request, res: Response): void => {
  res.status(404).json({ msg: "Not Found" });
});
