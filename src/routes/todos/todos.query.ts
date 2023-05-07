/* eslint-disable @typescript-eslint/no-explicit-any */
import db from "../../config/db";
import { Response } from "express";
import { QueryError } from "mysql2";
import { IUser, ITodo } from "../../interface";

export function viewAllTodos(res: Response): void {
  db.query(
    "SELECT * FROM todo",
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

export function viewTodoById(res: Response, id: string): void {
  db.query(
    "SELECT * FROM todo WHERE id = ?",
    [id],
    (err: QueryError | null, results: ITodo[]): void => {
      if (err) {
        res.status(500).json({ msg: "Internal server error" });
        return;
      }
      if (results.length === 0) {
        res.status(404).json({ msg: "Not found" });
        return;
      }
      const updatedResults: ITodo = { ...results[0] };
      updatedResults.id = updatedResults.id.toString();
      updatedResults.user_id = updatedResults.user_id.toString();
      updatedResults.created_at = new Date(updatedResults.created_at)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      updatedResults.due_time = new Date(updatedResults.due_time)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      res.status(200).json(updatedResults);
    }
  );
}

export function createTodo(
  res: Response,
  title: string,
  description: string,
  due_time: string,
  user_id: string,
  status: string
): void {
  db.execute(
    "SELECT id FROM user WHERE id = ?",
    [user_id],
    (err: QueryError | null, results: IUser[]): void => {
      if (err) {
        res.status(500).json({ msg: "Internal server error" });
        return;
      }
      if (results.length === 0) {
        res.status(404).json({ msg: "Not found" });
        return;
      }
      db.execute(
        "INSERT INTO todo (title, description, due_time, user_id, status) VALUES (?, ?, ?, ?, ?)",
        [title, description, due_time, user_id, status],
        (err2: QueryError | null, row: any): void => {
          if (err2) {
            res.status(500).json({ msg: "Internal server error" });
            return;
          }
          const id: number = row.insertId;
          if (id) {
            db.execute(
              "SELECT id, title, description, created_at, due_time, user_id, status FROM todo WHERE id = ?",
              [id],
              (err3: QueryError | null, results3: IUser[]): void => {
                if (err3) {
                  res.status(500).json({ msg: "Internal server error" });
                  return;
                }
                if (results3.length === 0) {
                  res.status(404).json({ msg: "Not found" });
                  return;
                }
                const updatedResults = { ...results3[0] };
                updatedResults.id = updatedResults.id.toString();
                updatedResults.user_id = updatedResults.user_id.toString();
                updatedResults.created_at = new Date(updatedResults.created_at)
                  .toISOString()
                  .slice(0, 19)
                  .replace("T", " ");
                updatedResults.due_time = new Date(updatedResults.due_time)
                  .toISOString()
                  .slice(0, 19)
                  .replace("T", " ");
                res.status(200).json(updatedResults);
              }
            );
          }
        }
      );
    }
  );
}

export function updateTodoById(
  res: Response,
  title: string,
  description: string,
  due_time: string,
  status: string,
  id: string
): void {
  db.execute(
    "UPDATE todo SET title = ?, description = ?, due_time = ?, status = ? WHERE id = ?",
    [title, description, due_time, status, id],
    (): void => {
      db.execute(
        "SELECT title, description, due_time, user_id, status FROM todo WHERE id = ?",
        [id],
        (err: QueryError | null, results: ITodo[]): void => {
          if (err) {
            res.status(500).json({ msg: "Internal server error" });
            return;
          }
          if (results.length === 0) {
            res.status(404).json({ msg: "Not found" });
            return;
          }
          const updatedResults: ITodo = { ...results[0] };
          updatedResults.user_id = updatedResults.user_id.toString();
          updatedResults.due_time = new Date(updatedResults.due_time)
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");
          res.status(200).json(updatedResults);
        }
      );
    }
  );
}

export function deleteTodoById(res: Response, id: string): void {
  db.execute(
    "DELETE FROM todo WHERE id = ?",
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
        .status(200)
        .json({ msg: `Successfully deleted record number: ${id}` });
    }
  );
}
