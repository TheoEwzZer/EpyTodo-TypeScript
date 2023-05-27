import { Done } from "mocha";
import request, { Response } from "supertest";
import { getUserIdByEmail } from "../src/routes/user/user.query";

const app = "http://localhost:3000";

const email: string = "theo.fabiano.new@epitech.eu";
let token: string = "";
let id: string = "";

describe("POST /register", function (): void {
  it("Register user", async function (): Promise<void> {
    await request(app)
      .post("/register")
      .send({
        email: email,
        name: "Theo",
        firstname: "Fabiano",
        password: "Epitech",
      })
      .expect(200);
    id = await getUserIdByEmail(email);
  });
});

describe("POST /login", function (): void {
  it("Login user", function (done: Done): void {
    request(app)
      .post("/login")
      .send({ email: email, password: "Epitech" })
      .expect(200)
      .end((err: Error, res: Response): void => {
        if (err) {
          return done(err);
        }
        token = res.body.token;
        done();
      });
  });
});

describe("GET /user", function (): void {
  it("List all users", function (done: Done): void {
    request(app)
      .get("/user")
      .set("Authorization", `Bearer ${token}`)
      .expect(200, done);
  });
});

describe("GET /users/:email", function (): void {
  it("Get user by email", function (done: Done): void {
    request(app)
      .get(`/users/${email}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200, done);
  });
});

describe("GET /users/:id", function (): void {
  it("Get user by id", function (done: Done): void {
    request(app)
      .get(`/users/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200, done);
  });
});

describe("POST /todos", function (): void {
  it("Create todo", function (done: Done): void {
    request(app)
      .post("/todos")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "title",
        description: "desc",
        due_time: "2021-03-06 19:24:00",
        user_id: id,
        status: "todo",
      })
      .expect(200, done);
  });
});

describe("GET user/todos", function (): void {
  it("List all user todos", function (done: Done): void {
    request(app)
      .get("/user/todos")
      .set("Authorization", `Bearer ${token}`)
      .expect(200, done);
  });
});

describe("PUT user/:id", function (): void {
  it("Update user", function (done: Done): void {
    request(app)
      .put(`/users/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: email,
        name: "Theo2",
        firstname: "Fabiano",
        password: "Epitech",
      })
      .expect(200, done);
  });
});

describe("GET /todo", function (): void {
  it("List all todos", function (done: Done): void {
    request(app)
      .get("/todos")
      .set("Authorization", `Bearer ${token}`)
      .expect(200, done);
  });
});

describe("DELETE /users", function (): void {
  it("Delete user", function (done: Done): void {
    request(app)
      .delete(`/users/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204, done);
  });
});
