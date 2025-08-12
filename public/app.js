// Minimal-Todo-App: Speicher-Varianten
// -------------------------------------
// 1. Standard: Nur Memory (Array todos)
// 2. Local Storage: Auskommentiert, kann aktiviert werden
// 3. API/Datei: Auskommentiert, kann aktiviert werden

// ---- 1. Nur Memory ----
let todos = [];

// //---- 2. Local Storage Functions ----
// // Funktion zum Speichern im Local Storage
// function saveTodosToLocalStorage(todos) {
//   localStorage.setItem('todos', JSON.stringify(todos));
// }
// // Funktion zum Laden aus Local Storage
// function loadTodosFromLocalStorage() {
//   const todos = localStorage.getItem('todos');
//   return todos ? JSON.parse(todos) : [];
// }


// //---- 3. API/Datei Functions----
// // API-Endpunkt für die Todo-Liste
// const API = "/api/todos";
// async function fetchTodosFromApi() {
//   const res = await fetch(API);
//   const data = await res.json();
//   todos = data;
//   render(todos);
// }
// // Schritt 3 API-Funktionen für POST, PATCH, DELETE
// async function addTodoApi(text) {
//   await fetch(API, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ text })
//   });
//   fetchTodosFromApi();
// }
// async function updateTodoApi(id, text) {
//   await fetch(`${API}/${id}`, {
//     method: "PATCH",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ text })
//   });
//   fetchTodosFromApi();
// }
// async function toggleDoneApi(id, done) {
//   await fetch(`${API}/${id}`, {
//     method: "PATCH",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ done })
//   });
//   fetchTodosFromApi();
// }
// async function delTodoApi(id) {
//   await fetch(`${API}/${id}`, {
//     method: "DELETE"
//   });
//   fetchTodosFromApi();
// }


const listEl = document.querySelector("#list");
const formEl = document.querySelector("#createForm");
const inputEl = document.querySelector("#todoInput");

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
      if (neu && neu.trim()) updateText(t.id, neu.trim());
    });

    const delBtn = document.createElement("button");
    delBtn.textContent = "Löschen";
    delBtn.addEventListener("click", () => delTodo(t.id));

    li.append(checkbox, span, editBtn, delBtn);
    listEl.appendChild(li);
  });
}

formEl.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = inputEl.value.trim();
  if (!text) return;
  todos.push({ id: Date.now(), text, done: false });
  inputEl.value = "";

  // // Schritt 2: aktivieren für Local Storage
  // saveTodosToLocalStorage(todos); 

  // // Schritt 3: API-Aufruf für POST
  // addTodoApi(text);
  
  
  render(todos);
});

function toggleDone(id, done) {
  const todo = todos.find(t => t.id === id);
  if (todo) todo.done = done;

//   //Schritt 2: aktivieren für Local Storage
//   saveTodosToLocalStorage(todos);

// // Schritt 3: API-Aufruf für PATCH
//   toggleDoneApi(id, done);
  
  
  render(todos);
}

function updateText(id, text) {
  const todo = todos.find(t => t.id === id);
  if (todo) todo.text = text;
  
  // //Schritt 2: aktivieren für Local Storage
  // saveTodosToLocalStorage(todos);

  // //Schritt 3: API-Aufruf für PATCH
  // updateTodoApi(id, text);
  
  
  render(todos);
}

function delTodo(id) {
  todos = todos.filter(t => t.id !== id);

  // // Schritt 2: aktivieren für Local Storage
  // saveTodosToLocalStorage(todos); 
  
  // // Schritt 3: API-Aufruf für DELETE
  // delTodoApi(id);


  render(todos);
}



// // Schritt 2: Local Storage aktivieren
// todos = loadTodosFromLocalStorage();

// // Schritt 3: API aktivieren
// fetchTodosFromApi();


// Schritt 1: Nur Memory
render(todos);