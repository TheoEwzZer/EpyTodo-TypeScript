# EpyTodo

```text
language : Node.js
```

The project idea is to build a Todo List. Thanks to it, you’ll be able to handle all the tasks you need to do easily! We will mainly focus on the “backend” side of the project, but feel free to show us what you can by building a “frontend” to your project as a bonus.
Within this project, you’ll have to develop:

1. your MySQL database.
2. A web server using Node.js

## MYSQL DATABASE

Into your database, you’ll have to manage various users and their respective tasks (todos).

```text
Pay attention to the instructions below
```

Create a file named `epytodo.sql`.
You have to write into it your whole database scheme. You can also use external tools to build your Database and export it as a `.sql` file later.
The database’s name **must** be `epytodo`.
It **must** contain 2 tables:

1. user
2. todo

Here are the description of the fields each table must contain:

1. user table
    - `id` (mandatory, not null, auto-increments)
    - `email` (mandatory, not null, unique)
    - `password` (mandatory not null)
    - `name` (mandatory not null)
    - `firstname` (mandatory not null)
    - `created_at` (set to the current datetime by default)

2. todo table
    - `id` (mandatory not null, auto-increments)
    - `title` (mandatory not null)
    - `description` (mandatory not null)
    - `created_at` (set to the current datetime by default)
    - `due_time` (mandatory, not null, datetime)
    - `status` ( **not started** by default / **todo** / **in progress** / **done** )
    - `user_id` (mandatory, unsigned, reference to the id of the user that get assigned to the task)

```text
Think about the last one: why do you need this?
Maybe it has to do with relationships, foreign keys...
```

```text
Choose the type of each field carefully,
depending on what it’s going to be used for.
```

Once your scheme is created, import your file into your MySQL server.

```text
∼/B-WEB-200> cat epytodo.sql | mysql -u root -p
```

```text
Your SQL file has to be placed in the root folder when turned in.
Do not insert any records into this file.
```

## WEB SERVER

Unlike other programming languages, Node and express let you build things your own way, meaning that
you can do the same thing in tons of different ways. This also means that your file structure can get quite
messy, so try to keep your code and your architecture as clean as possible if you don’t want to get lost.
Here’s how your repository’s structure should look like:

```text
.
├── .env
├── package.json
└── src
    ├── config
    │   └── db.ts
    ├── index.ts
    ├── middleware
    │   ├── auth.ts
    │   └── notFound.ts
    └── routes
        ├── auth
        │   └── auth.ts
        ├── todos
        │   ├── todos.ts
        │   └── todos.query.ts
        └── user
            ├── user.ts
            └── user.query.ts
```

More explanations about what each folder/file is for :

- `src`: your main folder.
- `package.json`: your app package file
- `config`: contains the files that deal with the connection to the database.
- `index.ts`: The main file, the one that starts everything (it calls and runs the app).
- `middleware`: contains all the middlewares created
- `routes`: contains all the subfolders that contain the routes needed for the project.

The `.env` file must contain all the configuration variables that will be necessary for the Project.

```text
You should have a node_modules folder at the root of your project.
If you look closely, it is not listed on the tree above,
that’s because we DO NOT PUSH this folder. Check out gitignore
```

Here are the required ones :

- MYSQL_DATABASE
- MYSQL_HOST
- MYSQL_USER
- MYSQL_ROOT_PASSWORD
- SECRET //used for the JSON Web Token (JWT).

## API

It’s not the most fun part, but take some time to read about [API](https://en.wikipedia.org/wiki/API).
Here, we’re using a [REST API](https://en.wikipedia.org/wiki/Representational_state_transfer) to create our CRUD system.
All data will transit into JSON format.

During your research, you will face a lot of packages and entities that will help you build your app. Some
of them are good and some are evil. For this project, you will only be authorized to use the packages listed
below. Every other package will be forbidden or needs to be authorized by the pedagogical team.

- [Express](https://expressjs.com/)
- [mysql2](https://www.npmjs.com/package/mysql2)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- [body-parser](https://www.npmjs.com/package/body-parser) This one is optional, find out why.

## ROUTES

Here is a listing of all the routes we expect for this project.

| route                | method | protected |         description       |
| :------------------- | :----: | :-------: | :-----------------------: |
| /register            |  POST  |    no     | register a new user       |
| /login               |  POST  |    no     | connect a user            |
| /user                |  GET   |    yes    | view all user information |
| /user/todos          |  GET   |    yes    | view all user tasks       |
| /users/:id or :email |  GET   |    yes    | view user information     |
| /users/:id           |  PUT   |    yes    | update user information   |
| /users/:id           | DELETE |    yes    | delete user               |
| /todos               |  GET   |    yes    | view all the todos        |
| /todos/:id           |  GET   |    yes    | view the todo             |
| /todos               |  POST  |    yes    | create a todo             |
| /todos/:id           |  PUT   |    yes    | update a todo             |
| /todos/:id           | DELETE |    yes    | delete a todo             |

In this project, we expect you to protect your route and only make them accessible to logged-in users. to
do so, the protected routes should receive a valid JWT (JSON Web Token) in the header.

```text
JWT and jsonwebtoken.
```

## DEFINITIONS OF FORMAT

Every route can have multiple methods, parameters or responses.
Everything you need will be explained in this documentation

### DEFAULTS

By default, each error will be treated as follows.
If there are more details, that will be explained in the related part.
For occurring common errors we suggest you build a custom error handler middleware and simply send the error instead of dealing with it in every route.

If the user is not logged in :

```json
{
  "msg": "No token , authorization denied"
}
```

If the user sends an invalid Token :

```json
{
  "msg": "Token is not valid"
}
```

If the task or user does not exist :

```json
{
  "msg": "Not found"
}
```

If user give bad parameters :

```json
{
  "msg": "Bad parameter"
}
```

If there’s another error :

```json
{
  "msg": "Internal server error"
}

```

### REGISTER

#### POST /register

Request body:

```json
{
  "email ": "value",
  "name": "value",
  "firstname ": "value",
  "password ": "value"
}
```

Response:

```json
{
  "token ": Token of the newly registered user
}
```

Response, if the account already exists:

```json
{
  "msg": "Account already exists"
}
```

```text
The password should not be stored as plain text! You have to hash it
before inserting it into your database. Check the packages listed above.
```

#### POST /login

Request body:

```json
{
  "email" : "_username",
  "password" : "_password"
}
```

Response body:

```json
{
  "token ": Token of the newly logged in user
}
```

Response body, if the credentials are incorrect:

```json
{
  "msg": "Invalid Credentials"
}
```

### USERS

#### GET /user

Response body:

```json
{
  "id" : "1",
  "email" : "email@test.eu",
  "password" : "hashed password",
  "created_at" : "2023-03-03 19:24:00" ,
  "firstname" : "test",
  "name" : "test"
}
```

#### GET /user/todos

Response body:

```json
[
  {
    "id" : "1",
    "title" : "title",
    "description" : "desc",
    "created_at" : "2023-03-03 19:24:00" ,
    "due_time" : "2023 -03 -04 19:24:00" ,
    "user_id" : "3",
    "status" : "done"
  },
  {
    "id" : "2",
    "title" : "title",
    "description" : "desc",
    "created_at" : "2023 -03 -05 19:24:00" ,
    "due_time" : "2023 -03 -06 19:24:00" ,
    "user_id" : "3",
    "status" : "in progress"
  }
]
```

#### GET /users/:id AND /users/:email

Response body:

```json
{
  "id" : "1",
  "email" : "email@test.eu",
  "password" : "hashed password",
  "created_at" : "2023-03-03 19:24:00" ,
  "firstname" : "test",
  "name" : "test"
}
```

#### PUT /users/:id

Request body:

```json
{
  "email" : "updated_email@test.eu",
  "password" : "updated_password",
  "firstname" : "updated_test",
  "name" : "updated_test"
}
```

Response body:

```json
{
  "id" : "1",
  "email" : "updatedemail@test.eu",
  "password" : "hashed password",
  "created_at" : "2023-03-03 19:24:00" ,
  "firstname" : "test",
  "name" : "test"
}
```

#### DELETE /users/:id

Response body:

```json
{
  "msg" : "Successfully deleted record number: ${id}"
}
```

### TODOS

#### GET /todos

Response body:

```json
[
  {
    "id" : "1",
    "title" : "title",
    "description" : "desc",
    "created_at" : "2023-03-03 19:24:00" ,
    "due_time" : "2023 -03 -04 19:24:00" ,
    "user_id" : "1",
    "status" : "done"
  },
  {
    "id" : "2",
    "title" : "title",
    "description" : "desc",
    "created_at" : "2023 -03 -05 19:24:00" ,
    "due_time" : "2023 -03 -06 19:24:00" ,
    "user_id" : "2",
    "status" : "in progress"
  }
]
```

#### GET /todos/:id

Response body:

```json
{
  "id" : "2",
  "title" : "title",
  "description" : "desc",
  "created_at" : "2023 -03 -05 19:24:00" ,
  "due_time" : "2023 -03 -06 19:24:00" ,
  "user_id" : "3",
  "status" : "in progress"
}
```

#### POST /TODOS

Request body:

```json
{
  "title" : "title",
  "description" : "desc",
  "due_time" : "2023 -03 -06 19:24:00" ,
  "user_id" : "3",
  "status" : "todo"
}
```

Response body: the created todo (just like the GET todo route).

#### PUT /todos/:id

Request and response body:

```json
{
  "title" : "Updated title",
  "description" : "Updated desc",
  "due_time" : "2023 -03 -07 19:24:00" ,
  "user_id" : "1",
  "status" : "in progress"
}
```

#### DELETE /todos/:id

```json
{
  "msg" : "Successfully deleted record number: ${id}"
}
```

```text
Each response must use an appropriate HTTP.
```

## FINAL MARK

### Mark: 22 / 22 (100%)

- Preliminaries (2 / 2)
- Web Server (5 / 5)
- Routes (does it exists) (3 / 3)
- Routes (Is it well done) (3 / 3)
- Password (1 / 1)
- Token (3 / 3)
- SQL DB (5 / 5)
