/* eslint-disable @typescript-eslint/no-explicit-any */
import { sign } from "jsonwebtoken";
import db from "../../config/db";
import { QueryError } from "mysql2";
import { Response } from "express";
import { IUser, ITodo } from "../../interface";

export function viewAllUsers(res: Response): void {
  db.query(
    "SELECT * FROM user",
    (err: QueryError | null, results: IUser[]): void => {
      if (err) {
        res.status(500).json({ msg: "Internal server error" });
        return;
      }
      const updatedResults: IUser = { ...results[0] };
      updatedResults.id = updatedResults.id.toString();
      updatedResults.created_at = new Date(updatedResults.created_at)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      res.status(200).json(updatedResults);
    }
  );
}

export function viewAllUserTodos(res: Response, id: string): void {
  db.query(
    "SELECT * FROM todo WHERE user_id = ?",
    [id],
    (err: QueryError | null, results: ITodo[]): void => {
      if (err) {
        res.status(500).json({ msg: "Internal server error" });
        return;
      }
      const updatedResults: ITodo[] = [];
      for (let i = 0; i < results.length; i += 1) {
        updatedResults[i] = results[i];
        updatedResults[i].id = updatedResults[i].id.toString();
        updatedResults[i].due_time = new Date(updatedResults[i].due_time)
          .toISOString()
          .slice(0, 19)
          .replace("T", " ");
      }
      res.status(200).json(updatedResults);
    }
  );
}

export function registerUser(
  res: Response,
  email: string,
  password: string,
  name: string,
  firstname: string
): void {
  db.execute(
    "INSERT INTO user (email, password, name, firstname) VALUES (?, ?, ?, ?)",
    [email, password, name, firstname],
    (err: QueryError | null): void => {
      if (err) {
        res.status(500).json({
          error: "Internal server error",
        });
        return;
      }
      if (process.env.SECRET === undefined) {
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      const token: string = sign({ email, password }, process.env.SECRET, {
        expiresIn: "1h",
      });
      res.status(200).json({ token });
    }
  );
}

export const viewUserByEmail = function viewUserIdByEmail(
  res: Response,
  email: string
): void {
  db.execute(
    "SELECT * FROM user WHERE email = ?",
    [email],
    (err: QueryError | null, results: IUser[]): void => {
      if (err) {
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      if (results.length === 0) {
        res.status(404).json({ msg: "Not found" });
        return;
      }
      const updatedResults: IUser = { ...results[0] };
      updatedResults.id = updatedResults.id.toString();
      updatedResults.created_at = new Date(updatedResults.created_at)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      res.status(200).json(updatedResults);
    }
  );
};

export const viewUserById = function viewUserEmailById(
  res: Response,
  id: string
): void {
  db.execute(
    "SELECT * FROM user WHERE id = ?",
    [id],
    (err: QueryError | null, results: IUser[]): void => {
      if (err) {
        res.status(500).json({ msg: "Internal server error" });
        return;
      }
      if (results.length === 0) {
        res.status(404).json({ msg: "Not found" });
        return;
      }
      const updatedResults: IUser = { ...results[0] };
      updatedResults.id = updatedResults.id.toString();
      updatedResults.created_at = new Date(updatedResults.created_at)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      res.status(200).json(updatedResults);
    }
  );
};

export function deleteUserById(res: Response, id: string): void {
  db.execute(
    "DELETE FROM user WHERE id = ?",
    [id],
    (err: QueryError | null, results: any): void => {
      if (err) {
        res.status(500).json({ msg: "Internal server error" });
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).json({ msg: "Not found" });
        return;
      }
      res
        .status(204)
        .json({ msg: `Successfully deleted record number: ${id}` });
    }
  );
}

export function updateUserById(
  res: Response,
  id: string,
  email: string,
  password: string,
  name: string,
  firstname: string
): void {
  db.execute(
    "UPDATE user SET email = ?, password = ?, name = ?, firstname = ? WHERE id = ?",
    [email, password, name, firstname, id],
    (): void => {
      db.execute(
        "SELECT id, email, password, created_at, firstname, name FROM user WHERE id = ?",
        [id],
        (err: QueryError | null, results: IUser[]): void => {
          if (err) {
            res.status(500).json({ msg: "Internal server error" });
            return;
          }
          if (results.length === 0) {
            res.status(404).json({ msg: "Not found" });
            return;
          }
          const updatedResults = { ...results[0] };
          updatedResults.id = updatedResults.id.toString();
          updatedResults.created_at = new Date(updatedResults.created_at)
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");
          res.status(200).json(updatedResults);
        }
      );
    }
  );
}

export function checkAccountMail(
  _res: Response,
  email: string,
  callback: (callback: number) => void
): void {
  db.execute(
    "SELECT * FROM user WHERE email = ?",
    [email],
    (_err: QueryError | null, results: IUser[]): void => {
      if (results.length > 0) {
        callback(84);
      } else {
        callback(0);
      }
    }
  );
}

export function getMailAccount(
  res: Response,
  email: string,
  password: string,
  bcrypt: typeof import("bcryptjs"),
  callback: (errorCode: number) => void
): void {
  db.execute(
    "SELECT password, id FROM user WHERE email = ?",
    [email],
    (err: QueryError | null, results: IUser[]): void => {
      if (err) {
        console.error(err);
        res.status(500).json({
          error: "Internal server error",
        });
        return;
      }

      if (results.length === 0) {
        callback(84);
        return;
      }
      const password2: string = results[0].password;
      if (!bcrypt.compareSync(password, password2)) {
        callback(84);
        return;
      }
      if (process.env.SECRET === undefined) {
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      const token: string = sign({ email, password }, process.env.SECRET, {
        expiresIn: "1h",
      });
      res.json({ token });
      callback(0);
    }
  );
}
