import {
  registerUser,
  checkAccountMail,
  getMailAccount,
} from "../user/user.query";
import { Express, Request, Response } from "express";

export default function auth(
  app: Express,
  bcrypt: typeof import("bcryptjs")
): void {
  app.post("/register", (req: Request, res: Response): void => {
    const { email, name, firstname } = req.body;
    let { password } = req.body;

    if (!email || !password || !name || !firstname) {
      res.status(400).json({ msg: "Bad parameter" });
      return;
    }
    password = bcrypt.hashSync(password, 10);
    checkAccountMail(res, email, (callback: number): void => {
      if (callback === 84) {
        res.status(409).json({ msg: "Account already exists" });
      } else if (callback === 0) {
        registerUser(res, email, password, name, firstname);
      } else {
        res.status(500).json({ msg: "Internal server error" });
      }
    });
  });

  app.post("/login", (req: Request, res: Response): void => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ msg: "Bad parameter" });
      return;
    }
    getMailAccount(res, email, password, bcrypt, (callback: number): void => {
      if (callback === 84) {
        res.status(401).json({ msg: "Invalid Credentials" });
      }
    });
  });
}
