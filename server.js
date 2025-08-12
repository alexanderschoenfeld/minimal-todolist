// server.js
const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public")); // Frontend bereitstellen

let todos = []; // { id:number, text:string, done:boolean }
let nextId = 1;

app.get("/api/todos", (req, res) => {
  res.json(todos);
});

app.post("/api/todos", (req, res) => {
  const text = (req.body?.text || "").trim();
  if (!text) return res.status(400).json({ error: "text is required" });
  const todo = { id: nextId++, text, done: false };
  todos.push(todo);
  res.status(201).json(todo);
});

app.patch("/api/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const todo = todos.find(t => t.id === id);
  if (!todo) return res.status(404).json({ error: "not found" });

  if (typeof req.body.done === "boolean") todo.done = req.body.done;
  if (typeof req.body.text === "string") {
    const t = req.body.text.trim();
    if (t) todo.text = t;
  }
  res.json(todo);
});

app.delete("/api/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const before = todos.length;
  todos = todos.filter(t => t.id !== id);
  if (todos.length === before) return res.status(404).json({ error: "not found" });
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`✅ Server läuft auf http://localhost:${PORT}`);
});