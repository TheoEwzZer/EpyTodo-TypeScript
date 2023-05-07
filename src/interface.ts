import { RowDataPacket } from "mysql2";

export interface IUser extends RowDataPacket {
  id: string;
  email: string;
  password: string;
  name: string;
  firstname: string;
  created_at: string;
}

export interface ITodo extends RowDataPacket {
  id: string;
  title: string;
  description: string;
  created_at: string;
  due_time: string;
  status: "not started" | "todo" | "in progress" | "done";
  user_id: string;
}
