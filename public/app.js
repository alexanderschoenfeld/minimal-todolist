const API = "/api/todos";
const listEl = document.querySelector("#list");
const formEl = document.querySelector("#createForm");
const inputEl = document.querySelector("#todoInput");

async function fetchTodos() {
  const res = await fetch(API);
  const data = await res.json();
  render(data);
}

function render(todos) {
  listEl.innerHTML = "";
  todos.forEach(t => {
    const li = document.createElement("li");
    if (t.done) li.classList.add("done");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = t.done;
    checkbox.addEventListener("change", () => toggleDone(t.id, checkbox.checked));

    const span = document.createElement("span");
    span.className = "text";
    span.textContent = t.text;

    const editBtn = document.createElement("button");
    editBtn.textContent = "Bearb.";
    editBtn.className = "ghost";
    editBtn.addEventListener("click", async () => {
      const neu = prompt("Neuer Text:", t.text);
      if (neu && neu.trim()) await updateText(t.id, neu.trim());
    });

    const delBtn = document.createElement("button");
    delBtn.textContent = "Löschen";
    delBtn.addEventListener("click", () => delTodo(t.id));

    li.append(checkbox, span, editBtn, delBtn);
    listEl.appendChild(li);
  });
}

formEl.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = inputEl.value.trim();
  if (!text) return;
  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });
  inputEl.value = "";
  fetchTodos();
});

async function toggleDone(id, done) {
  await fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ done })
  });
  fetchTodos();
}

async function updateText(id, text) {
  await fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });
  fetchTodos();
}

async function delTodo(id) {
  await fetch(`${API}/${id}`, { method: "DELETE" });
  fetchTodos();
}

fetchTodos();