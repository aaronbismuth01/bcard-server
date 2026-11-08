# BCard Server – Business Cards REST API

Server side of a content management system that lets business users publish, edit and delete business cards. Built with **Node.js**, **Express** and **MongoDB** (Mongoose).

## Features

- User registration and login with **JWT** authentication (`x-auth-token` header)
- Passwords hashed with **bcryptjs**
- Request validation with **Joi** (clear 400 errors)
- Role-based authorization: guest, registered user, business user, admin
- Two environments: **local MongoDB** (development) and **MongoDB Atlas** (production)
- Request logger with **morgan** (time, method, URL, status, response time)
- **CORS** restricted to a list of allowed origins
- Initial data: 3 users (regular, business, admin) and 3 cards created on first run

### Bonuses

- **bizNumber** – an admin can change a card's business number if it is not taken
- **File logger** – every response with status 400+ is written to `logs/YYYY-MM-DD.log` (date, status code, error message)
- **User blocking** – after 3 consecutive failed logins with the same email the user is blocked for 24 hours

## Installation

```bash
git clone <your-repo-url>
cd bcard-server
npm install
```

Copy `.env.example` to `.env` and fill in the values:

| Variable | Description |
| --- | --- |
| `PORT` | Server port (default 8181) |
| `MONGO_LOCAL_URI` | Local MongoDB connection string |
| `MONGO_ATLAS_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret used to sign tokens |
| `ALLOWED_ORIGINS` | Comma-separated origins allowed by CORS |

## Running

```bash
npm run dev   # development – local MongoDB, auto-restart with nodemon
npm start     # production – MongoDB Atlas
```

## Initial users

All passwords are `Aa1234!`

| Email | Type |
| --- | --- |
| regular@gmail.com | Regular user |
| business@gmail.com | Business user (owns the 3 initial cards) |
| admin@gmail.com | Admin |

## API

Protected routes need the header `x-auth-token: <token from login>`.

### Users

| # | Method | URL | Authorization | Action |
| --- | --- | --- | --- | --- |
| 1 | POST | `/users` | all | Register user (email must be unique) |
| 2 | POST | `/users/login` | all | Login, returns a token |
| 3 | GET | `/users` | admin | Get all users |
| 4 | GET | `/users/:id` | the user or admin | Get user |
| 5 | PUT | `/users/:id` | the user | Edit user (name, phone, address, image) |
| 6 | PATCH | `/users/:id` | the user | Toggle `isBusiness` |
| 7 | DELETE | `/users/:id` | the user or admin | Delete user |

### Cards

| # | Method | URL | Authorization | Action |
| --- | --- | --- | --- | --- |
| 1 | GET | `/cards` | all | Get all cards |
| 2 | GET | `/cards/my-cards` | registered user | Get the user's cards |
| 3 | GET | `/cards/:id` | all | Get card |
| 4 | POST | `/cards` | business user | Create card |
| 5 | PUT | `/cards/:id` | card creator | Edit card |
| 6 | PATCH | `/cards/:id` | registered user | Like / unlike card |
| 7 | DELETE | `/cards/:id` | card creator or admin | Delete card |
| ★ | PATCH | `/cards/biz-number/:id` | admin | Change bizNumber (body: `{ "bizNumber": 1234567 }`) |

### Request examples

Register (`POST /users`):

```json
{
  "name": { "first": "first", "middle": "", "last": "user" },
  "isBusiness": true,
  "phone": "050-0000000",
  "email": "first@gmail.com",
  "password": "Aa1234!",
  "address": { "state": "", "country": "israel", "city": "tel-aviv", "street": "magnive", "houseNumber": 5 },
  "image": { "url": "", "alt": "" }
}
```

Create card (`POST /cards`):

```json
{
  "title": "test123",
  "subtitle": "testing",
  "description": "testing 123",
  "phone": "050-0000000",
  "email": "testing@gmail.com",
  "web": "https://www.test.co.il",
  "image": { "url": "", "alt": "" },
  "address": { "state": "", "country": "test", "city": "test", "street": "test", "houseNumber": 3, "zip": 0 }
}
```

Password rules: 7–20 characters with at least one uppercase letter, one lowercase letter, one digit and one of `!@#$%^&*-_`.

## Error responses

Errors are returned as plain text with the matching status:
`400` validation error · `401` not logged in / bad credentials · `403` not allowed or user blocked · `404` not found · `409` email or bizNumber already taken · `500` server error.

## Project structure

```
app.js                  entry point
config/db.js            local / Atlas connection
router/router.js        mounts /users and /cards
middlewares/            auth, cors, morgan logger, file logger
utils/                  errors, bcrypt, jwt, validation helpers
models/common/          shared schemas (name, image, address) and regex
users/                  model, Joi validation, service, routes
cards/                  model, Joi validation, service, routes, bizNumber generator
initialData/            seed users and cards
```
