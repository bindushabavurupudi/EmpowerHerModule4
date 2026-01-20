const express = require("express");
const todoRouter = require("./routes/todos.routes");
const loggerMiddleware = require("./middleware/logger.middleware");

const app = express();

// JSON middleware
app.use(express.json());

// App-level middleware (Logger)
app.use(loggerMiddleware);

// Todo routes
app.use("/todos", todoRouter);

// Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
