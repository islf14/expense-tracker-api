# Expense Tracker API

JavaScript solution for [Expense Tracker API](https://roadmap.sh/projects/expense-tracker-api) from [roadmap.sh](https://roadmap.sh/).

## Requirements

- Node.js must be installed.
- MongoDB must be installed.

## How to run

Perform the following steps:

- To install dependencies, run in console:

```bash
npm install
```

- To start the project, run in console:

```bash
npm start
```

- Open in your browser.

```bash
http://localhost:3000/
```

## Routes

### User Registration

```bash
POST /register
{
  "name": "John Doe",
  "email": "john@doe.com",
  "password": "password"
}
```

### User Login

```bash
POST /login
{
  "email": "john@doe.com",
  "password": "password"
}
```

### Create a To-Do Item

```bash
POST /expense
{
  "amount": 6,
  "description": "cookies",
  "category": "Groceries"
}
```

### Update a To-Do Item

```bash
PUT /expense/4b710947-45a3-4fcf-8949-547c6bc9f9e3
{
  "amount": 5,
  "description": "Fruits and vegetables",
  "category": "Groceries"
}
```

### Delete a To-Do Item

```bash
DELETE /expense/4b710947-45a3-4fcf-8949-547c6bc9f9e3
```

### Get To-Do Items

- Get all.

```bash
GET /expense
```

- Get with page and limit (default is page=1 and limit=20).

```bash
GET /expense?page=1&limit=10
```

- Past week (pw).

```bash
GET /expense?filter=pw
```

- Past month (pm).

```bash
GET /expense?filter=pm
```

- Last 3 months (3m).

```bash
GET /expense?filter=3m
```

- Custom (to specify a start and end date of your choosing).

```bash
GET /expense?start=2025-06-25&end=2025-06-26
```

- When there is a start and end , the filter does not work.

```bash
GET /expense?start=2025-06-25&end=2025-06-25&filter=3m
```
