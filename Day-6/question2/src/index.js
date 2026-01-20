const express = require("express");
const usersRouter = require("./routes/users.routes");

const app = express();

// JSON middleware (for non-multipart routes)
app.use(express.json());

// Routes
app.use("/users", usersRouter);

// Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
