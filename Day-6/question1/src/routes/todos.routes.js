const express = require("express");
const fs = require("fs");
const path = require("path");
const rateLimiter = require("../middleware/rateLimiter.middleware");
const validateTodo = require("../middleware/validateTodo.middleware");

const router = express.Router();
const dbPath = path.join(__dirname, "../db.json");

// Helper functions
const readDB = () => JSON.parse(fs.readFileSync(dbPath, "utf-8"));
const writeDB = (data) =>
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

// CREATE Todo
router.post("/add", validateTodo, (req, res) => {
  const db = readDB();
  const newTodo = {
    id: Date.now(),
    title: req.body.title
  };

  db.todos.push(newTodo);
  writeDB(db);

  res.status(201).json(newTodo);
});

// GET All Todos (Rate Limited)
router.get("/", rateLimiter, (req, res) => {
  const db = readDB();
  res.status(200).json(db.todos);
});

// GET Single Todo
router.get("/:todoId", (req, res) => {
  const db = readDB();
  const todoId = Number(req.params.todoId);

  const todo = db.todos.find((t) => t.id === todoId);

  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }

  res.status(200).json(todo);
});

// UPDATE Todo
router.put("/update/:todoId", (req, res) => {
  const db = readDB();
  const todoId = Number(req.params.todoId);

  const index = db.todos.findIndex((t) => t.id === todoId);

  if (index === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }

  db.todos[index] = { ...db.todos[index], ...req.body };
  writeDB(db);

  res.status(200).json(db.todos[index]);
});

// DELETE Todo
router.delete("/delete/:todoId", (req, res) => {
  const db = readDB();
  const todoId = Number(req.params.todoId);

  const index = db.todos.findIndex((t) => t.id === todoId);

  if (index === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }

  const deletedTodo = db.todos.splice(index, 1);
  writeDB(db);

  res.status(200).json(deletedTodo[0]);
});

module.exports = router;
