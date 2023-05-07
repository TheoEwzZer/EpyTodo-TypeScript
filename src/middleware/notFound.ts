import db from "../config/db";
import { Request, Response, NextFunction } from "express";
import { QueryError, RowDataPacket } from "mysql2";

export default (req: Request, res: Response, next: NextFunction): void => {
  const { id } = req.params;

  if (!id || parseInt(id, 10).toString() !== id) {
    res.status(500).json({ msg: "Internal server error" });
    return;
  }

  db.execute(
    "SELECT * FROM todo WHERE id = ?",
    [id],
    (_err: QueryError | null, results: RowDataPacket[]) => {
      if (results.length > 0) {
        next();
      } else {
        res.status(404).json({ msg: "Not found" });
      }
    }
  );
};
