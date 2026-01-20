const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const dbPath = path.join(__dirname, "../db.json");

// Helper functions
const readDB = () => {
  return JSON.parse(fs.readFileSync(dbPath, "utf-8"));
};

const writeDB = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// CREATE User
router.post("/add", (req, res) => {
  const db = readDB();
  const newUser = { id: Date.now(), ...req.body };

  db.users.push(newUser);
  writeDB(db);

  res.status(201).json(newUser);
});

// GET All Users
router.get("/", (req, res) => {
  const db = readDB();
  res.status(200).json(db.users);
});

// GET Single User
router.get("/:userId", (req, res) => {
  const db = readDB();
  const userId = Number(req.params.userId);

  const user = db.users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(user);
});

// UPDATE User
router.put("/update/:userId", (req, res) => {
  const db = readDB();
  const userId = Number(req.params.userId);

  const index = db.users.findIndex((u) => u.id === userId);

  if (index === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  db.users[index] = { ...db.users[index], ...req.body };
  writeDB(db);

  res.status(200).json(db.users[index]);
});

// DELETE User
router.delete("/delete/:userId", (req, res) => {
  const db = readDB();
  const userId = Number(req.params.userId);

  const index = db.users.findIndex((u) => u.id === userId);

  if (index === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  const deletedUser = db.users.splice(index, 1);
  writeDB(db);

  res.status(200).json(deletedUser[0]);
});

module.exports = router;
