import auth from "../../middleware/auth";
import { Express, Request, Response } from "express";

import {
  viewAllUserTodos,
  viewAllUsers,
  viewUserByEmail,
  viewUserById,
  updateUserById,
  deleteUserById,
} from "./user.query";

export default function userRoutes(
  app: Express,
  bcrypt: typeof import("bcryptjs")
): void {
  app.get("/user", auth, (_req: Request, res: Response): void => {
    try {
      viewAllUsers(res);
    } catch (error) {
      res.status(500).json({ msg: "Internal server error" });
    }
  });

  app.get("/user/todos", auth, (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      viewAllUserTodos(res, id);
    } catch (error) {
      res.status(500).json({ msg: "Internal server error" });
    }
  });

  app.get("/users/:data", auth, (req: Request, res: Response): void => {
    try {
      const { data } = req.params;
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (parseInt(data, 10).toString() === data) {
        viewUserById(res, data);
        return;
      }
      if (emailRegex.test(data)) {
        viewUserByEmail(res, data);
        return;
      }
      res.status(400).json({ msg: "Bad parameter" });
      return;
    } catch (error) {
      res.status(500).json({ msg: "Internal server error" });
    }
  });

  app.put("/users/:id", auth, (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      const { email, name, firstname } = req.body;
      let { password } = req.body;
      if (
        !id ||
        !email ||
        !password ||
        !name ||
        !firstname ||
        parseInt(id, 10).toString() !== id
      ) {
        res.status(400).json({ msg: "Bad parameter" });
        return;
      }
      password = bcrypt.hashSync(password, 10);
      updateUserById(res, id, email, password, name, firstname);
    } catch (error) {
      res.status(500).json({ msg: "Internal server error" });
    }
  });

  app.delete("/users/:id", auth, (req: Request, res: Response): void => {
    try {
      const { id } = req.params;
      if (parseInt(id, 10).toString() !== id) {
        res.status(400).json({ msg: "Bad parameter" });
        return;
      }
      deleteUserById(res, id);
    } catch (error) {
      res.status(400).json({ msg: "Internal server error" });
    }
  });
}
