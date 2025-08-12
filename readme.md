# Minimal-Todo-App: Übersicht & Navigation

<p align="center">
  <a href="#voraussetzungen--installation">Voraussetzungen & Installation</a> |
  <a href="#projekt-anlegen">Projekt anlegen</a> |
  <a href="#speicher-varianten-schritt-fur-schritt">Speicher-Varianten</a> |
  <a href="#persistenz-in-local-storage">Persistenz in Local Storage</a> |
  <a href="#persistenz-in-datei">Persistenz in Datei</a> |
  <a href="#cheat-sheet--trouble-shooting">Cheat-Sheet & Trouble Shooting</a>
</p>

In dieser Übung erstellen wir eine minimalistische Todo-App mit Node.js und Express. Schritt für Schritt lernst du, wie du ein neues Projekt aufsetzt, die grundlegende Backend-Logik entwickelst und ein einfaches Frontend implementierst. Ziel ist es, Aufgaben zu erfassen, zu bearbeiten und zu verwalten – ideal für den Einstieg in die Webentwicklung mit JavaScript. 

---

# Voraussetzungen & Installation

<p align="center">
  <a href="#voraussetzungen--installation">Voraussetzungen & Installation</a> |
  <a href="#projekt-anlegen">Projekt anlegen</a> |
  <a href="#speicher-varianten-schritt-fur-schritt">Speicher-Varianten</a> |
  <a href="#persistenz-in-local-storage">Persistenz in Local Storage</a> |
  <a href="#persistenz-in-datei">Persistenz in Datei</a> |
  <a href="#cheat-sheet--trouble-shooting">Cheat-Sheet & Trouble Shooting</a>
</p>

## 1. Visual Studio Code installieren

- [Download VS Code](https://code.visualstudio.com/)
- Standardoptionen beibehalten
- Empfohlene Extensions: ESLint, Prettier

## 2. Node.js + npm installieren

- [Download Node.js (LTS)](https://nodejs.org/)
- Installation ausführen
- npm wird automatisch mitinstalliert

**Versionen testen:**

```bash
node -v
npm -v
```

---

# Projekt anlegen

<p align="center">
  <a href="#voraussetzungen--installation">Voraussetzungen & Installation</a> |
  <a href="#projekt-anlegen">Projekt anlegen</a> |
  <a href="#speicher-varianten-schritt-fur-schritt">Speicher-Varianten</a> |
  <a href="#persistenz-in-local-storage">Persistenz in Local Storage</a> |
  <a href="#persistenz-in-datei">Persistenz in Datei</a> |
  <a href="#cheat-sheet--trouble-shooting">Cheat-Sheet & Trouble Shooting</a>
</p>

Hier wird Schritt für Schritt erklärt, wie du das Projekt bis Punkt 5 anlegst.

1. Neues Verzeichnis erstellen
2. Installiere Express
3. Erstelle die Ordnerstruktur
4. Starte den Server

## 1) Neues Projekt anlegen

```bash
mkdir todo-minimal
cd todo-minimal
npm init -y
npm install express fs-extra
mkdir public
```

Dateistruktur:

```
todo-minimal/
├─ package.json
├─ server.js
└─ public/
   ├─ index.html
   └─ app.js
```

In **package.json** Startskript ergänzen:

```json
{
  "name": "todo-minimal",
  "version": "1.0.0",
  "main": "server.js",
  "type": "commonjs",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.19.2"
  }
}
```

## 2) Backend (Express) – `server.js`

```js
// server.js
const fse = require("fs-extra");
const DB_FILE = "./todos.json";

// Laden beim Start
async function load() {
  try { return await fse.readJson(DB_FILE); } catch { return []; }
}
async function save(arr) {
  await fse.writeJson(DB_FILE, arr, { spaces: 2 });
}

(async () => {
  todos = await load();
  nextId = todos.reduce((m, t) => Math.max(m, t.id), 0) + 1;
})();
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
  save(todos);
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
  save(todos);
  res.json(todo);
});

app.delete("/api/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const before = todos.length;
  todos = todos.filter(t => t.id !== id);
  save(todos);
  if (todos.length === before) return res.status(404).json({ error: "not found" });
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`✅ Server läuft auf http://localhost:${PORT}`);
});
```

## 3) Frontend – `public/index.html`

Minimaler Aufbau + sehr simples Styling.

```html
<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Todo – Super Minimal</title>
  <style>
    :root { font-family: system-ui, sans-serif; }
    body { max-width: 560px; margin: 40px auto; padding: 0 16px; }
    h1 { font-size: 1.4rem; }
    form { display: flex; gap: 8px; margin: 12px 0; }
    input[type=text] { flex: 1; padding: 8px; border: 1px solid #ccc; border-radius: 6px; }
    button { padding: 8px 12px; border: 1px solid #222; background: #222; color: #fff; border-radius: 6px; cursor: pointer; }
    ul { list-style: none; padding: 0; margin: 16px 0; }
    li { display: flex; align-items: center; gap: 8px; padding: 8px; border: 1px solid #eee; border-radius: 6px; margin-bottom: 8px; }
    li.done .text { text-decoration: line-through; color: #777; }
    .text { flex: 1; }
    .ghost { background:#f8f8f8; color:#222; border-color:#ddd; }
  </style>
</head>
<body>
  <h1>Meine Todos</h1>

  <form id="createForm">
    <input id="todoInput" type="text" placeholder="Was steht an?" required />
    <button type="submit">Hinzufügen</button>
  </form>

  <ul id="list"></ul>

  <script src="./app.js"></script>
</body>
</html>
```

## 4) Frontend-Logik – `public/app.js`

Plain Fetch + DOM, keine Frameworks.

```js
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
```

## 5) Starten & Testen

```bash
npm start
```

Öffne im Browser: **[http://localhost:3000](http://localhost:3000)**

* Todo hinzufügen, abhaken, bearbeiten (Prompt), löschen.

---

# Speicher-Varianten Schritt für Schritt

<p align="center">
  <a href="#voraussetzungen--installation">Voraussetzungen & Installation</a> |
  <a href="#projekt-anlegen">Projekt anlegen</a> |
  <a href="#speicher-varianten-schritt-fur-schritt">Speicher-Varianten</a> |
  <a href="#persistenz-in-local-storage">Persistenz in Local Storage</a> |
  <a href="#persistenz-in-datei">Persistenz in Datei</a> |
  <a href="#cheat-sheet--trouble-shooting">Cheat-Sheet & Trouble Shooting</a>
</p>

## Ziel der Übung

Du lernst, wie die Aufgaben (Todos) in drei Varianten gespeichert werden können:
1. Nur im Arbeitsspeicher (Memory)
2. Im Local Storage des Browsers
3. Im Backend (Datei/Server, über die API)

Alle Varianten sind im Code von `public/app.js` bereits vorbereitet und auskommentiert. Du aktivierst sie Schritt für Schritt, indem du die entsprechenden Zeilen einkommentierst.

---

### Schritt 1: Nur Memory (Standard)

- Die Todos werden nur im Array `todos` gehalten.
- Änderungen (Hinzufügen, Löschen, Bearbeiten, Status ändern) wirken sich nur auf das Array aus.
- Nach jedem Schritt wird `render(todos)` aufgerufen.
- Es wird nichts dauerhaft gespeichert – nach einem Neuladen der Seite sind alle Todos weg.

**Code-Ausschnitt:**
```js
let todos = [];
render(todos);
```

---

### Schritt 2: Local Storage aktivieren

- Kommentiere die Funktionen und Aufrufe für Local Storage ein:
  - `saveTodosToLocalStorage(todos)` nach jeder Änderung an `todos`
  - `todos = loadTodosFromLocalStorage();` beim Laden der Seite
- Jetzt werden die Todos im Browser gespeichert und bleiben nach einem Neuladen erhalten.

**Code-Ausschnitt:**
```js
// Funktion zum Speichern
function saveTodosToLocalStorage(todos) {
  localStorage.setItem('todos', JSON.stringify(todos));
}
// Funktion zum Laden
function loadTodosFromLocalStorage() {
  const todos = localStorage.getItem('todos');
  return todos ? JSON.parse(todos) : [];
}
// ...
// todos = loadTodosFromLocalStorage();
// render(todos);
// ...
// saveTodosToLocalStorage(todos); // nach jeder Änderung
```

---

### Schritt 3: API/Datei aktivieren

- Kommentiere die API-Funktionen und -Aufrufe ein:
  - `fetchTodosFromApi()` zum Laden der Todos vom Server
  - API-Aufrufe für Hinzufügen, Bearbeiten, Löschen, Status ändern
- Jetzt werden die Todos im Backend (z.B. in einer Datei) gespeichert und sind für alle Nutzer verfügbar.

**Code-Ausschnitt:**
```js
const API = "/api/todos";
async function fetchTodosFromApi() {
  const res = await fetch(API);
  const data = await res.json();
  todos = data;
  render(todos);
}
// ...
// fetchTodosFromApi(); // beim Laden der Seite
// ...
// API-Aufrufe für POST, PATCH, DELETE
```

---

**Didaktischer Tipp:**
- Die Schüler können die Varianten direkt im Code erleben, indem sie die jeweiligen Zeilen aktivieren.
- So wird klar, wie sich die Speicherung im Speicher, im Browser und im Backend unterscheidet.

Die Navigation und die Installationsanleitung bleiben wie gehabt am Anfang der Readme erhalten.

---

# Persistenz in Local Storage

<p align="center">
  <a href="#voraussetzungen--installation">Voraussetzungen & Installation</a> |
  <a href="#projekt-anlegen">Projekt anlegen</a> |
  <a href="#speicher-varianten-schritt-fur-schritt">Speicher-Varianten</a> |
  <a href="#persistenz-in-local-storage">Persistenz in Local Storage</a> |
  <a href="#persistenz-in-datei">Persistenz in Datei</a> |
  <a href="#cheat-sheet--trouble-shooting">Cheat-Sheet & Trouble Shooting</a>
</p>

Hier lernst du, wie du die Aufgaben im Local Storage des Browsers speicherst.

**Wo kommt der Code hin?**
> Füge den folgenden Code in die Datei `public/app.js` ein – am besten ganz oben, bevor die Funktionen zum Rendern und Bearbeiten der Todos kommen.

```js
// Beispiel: Aufgaben im Local Storage speichern
function saveTodosToLocalStorage(todos) {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodosFromLocalStorage() {
  const todos = localStorage.getItem('todos');
  return todos ? JSON.parse(todos) : [];
}
```

**Wie werden die Funktionen verwendet?**

1. **Todos beim Laden der Seite aus Local Storage holen:**
   ```js
   let todos = loadTodosFromLocalStorage();
   render(todos);
   ```
   → Diesen Aufruf am Ende von `app.js` platzieren, damit die Aufgaben beim Start angezeigt werden.

2. **Todos nach jeder Änderung speichern:**
   Füge den Aufruf `saveTodosToLocalStorage(todos);` jeweils in die passende Funktion ein:

   - **Hinzufügen:** In der Funktion
     ```js
     formEl.addEventListener("submit", async (e) => {
       // ...
       inputEl.value = "";
       saveTodosToLocalStorage(todos); // <-- direkt nach dem Hinzufügen, vor render/fetchTodos
       fetchTodos();
     });
     ```

   - **Löschen:** In der Funktion
     ```js
     async function delTodo(id) {
       // ...
       saveTodosToLocalStorage(todos); // <-- direkt nach dem Entfernen, vor render/fetchTodos
       fetchTodos();
     }
     ```

   - **Bearbeiten:** In der Funktion
     ```js
     async function updateText(id, text) {
       // ...
       saveTodosToLocalStorage(todos); // <-- direkt nach der Änderung, vor render/fetchTodos
       fetchTodos();
     }
     ```

   - **Status ändern (abgehakt):** In der Funktion
     ```js
     async function toggleDone(id, done) {
       // ...
       saveTodosToLocalStorage(todos); // <-- direkt nach der Änderung, vor render/fetchTodos
       fetchTodos();
     }
     ```

> **Tipp:** Immer direkt nach der Änderung an der `todos`-Liste und vor dem erneuten Rendern speichern!

So stellst du sicher, dass die Aufgaben immer im Local Storage gespeichert und beim nächsten Laden der Seite wieder angezeigt werden.

---

# Persistenz in Datei

<p align="center">
  <a href="#voraussetzungen--installation">Voraussetzungen & Installation</a> |
  <a href="#projekt-anlegen">Projekt anlegen</a> |
  <a href="#speicher-varianten-schritt-fur-schritt">Speicher-Varianten</a> |
  <a href="#persistenz-in-local-storage">Persistenz in Local Storage</a> |
  <a href="#persistenz-in-datei">Persistenz in Datei</a> |
  <a href="#cheat-sheet--trouble-shooting">Cheat-Sheet & Trouble Shooting</a>
</p>

Hier wird gezeigt, wie die Aufgaben serverseitig in einer Datei gespeichert werden (Punkt 7).

```bash
npm install fs-extra
```

Ergänzung in `server.js` (oben):

```js
const fse = require("fs-extra");
const DB_FILE = "./todos.json";

async function load() {
  try { return await fse.readJson(DB_FILE); } catch { return []; }
}
async function save(arr) {
  await fse.writeJson(DB_FILE, arr, { spaces: 2 });
}

(async () => {
  todos = await load();
  nextId = todos.reduce((m,t) => Math.max(m,t.id), 0) + 1;
})();
```

Nach jedem Ändern/Löschen/Speichern:

```js
save(todos);
```

---

# Cheat-Sheet & Trouble Shooting

<p align="center">
  <a href="#voraussetzungen--installation">Voraussetzungen & Installation</a> |
  <a href="#projekt-anlegen">Projekt anlegen</a> |
  <a href="#speicher-varianten-schritt-fur-schritt">Speicher-Varianten</a> |
  <a href="#persistenz-in-local-storage">Persistenz in Local Storage</a> |
  <a href="#persistenz-in-datei">Persistenz in Datei</a> |
  <a href="#cheat-sheet--trouble-shooting">Cheat-Sheet & Trouble Shooting</a>
</p>

Hier findest du eine Übersicht der wichtigsten Befehle und häufige Fehlerquellen.

## Cheat-Sheet
- `npm start` – Startet den Server
- `node server.js` – Startet den Server manuell
- `npm install <paket>` – Installiert ein Paket

## Trouble Shooting
- **Fehler: Port belegt** – Prüfe, ob ein anderer Server läuft und beende ihn
- **Fehler: Modul nicht gefunden** – Stelle sicher, dass alle Pakete installiert sind (`npm install`)
- **Browser zeigt keine Seite** – Prüfe, ob der Server läuft und die richtige Adresse verwendet wird

---

### 0.3 Windows Firewall-Hinweis bei `npm start`

Wenn Windows beim Starten von `npm start` meldet, dass die „Windows-Firewall einige Funktionen von Node.js in allen öffentlichen und privaten Netzwerken blockiert hat“ und fragt, ob Sie zulassen möchten, bedeutet das:

* **Private Netzwerke** = Heim- oder Firmennetze, die Sie als vertrauenswürdig markiert haben (z. B. Ihr WLAN zu Hause).
* **Öffentliche Netzwerke** = Unbekannte/vermutlich unsichere Netze (z. B. Café, Hotel, Flughafen-Hotspot).

**Warum passiert das?**
Node.js startet Ihren Express‑Server auf einem Port (z. B. 3000) und lauscht auf eingehende Verbindungen. Windows-Firewall erkennt dies als „Anwendung lauscht auf Verbindungen“ und fragt, ob es Verbindungen zulassen soll.

**Empfehlung im Schulungskontext:**

* Für rein lokale Entwicklung reicht es, **nur private Netzwerke zuzulassen**. Dann kann Ihr Server über `http://localhost:3000` im eigenen Rechner genutzt werden.
* Öffentliche Netzwerke nur zulassen, wenn andere Geräte im gleichen Netz auf den Server zugreifen sollen (z. B. Test vom Smartphone im gleichen WLAN).

---

## 6) Didaktischer Ablauf (für Trainer\:innen)

1. **Hello Express:** `server.js` anlegen, `console.log` zeigen, Startskript ausführen.
2. **GET /api/todos:** Route erstellen, im Browser testen (JSON sichtbar).
3. **POST /api/todos:** Formular sendet per Fetch → Erfolg im UI.
4. **PATCH/DELETE:** Statuswechsel & Entfernen zeigen.
5. **CSS:** Klassenschalter `.done` demonstrieren.
6. **Fehlerfälle:** Leerer Text → `400 Bad Request` (mit DevTools Network zeigen).

---

## 9) Nächste Schritte (Erweiterungen)

* Sortierung (neueste oben), Tastatur-Enter-Handling, Doppelklick zum Editieren.
* Lokale Persistenz per `localStorage` als Alternative.
* Unit-Tests (Jest) und Linting (ESLint) hinzufügen.

---

## 10) Kurz-Cheat‑Sheet (Commands)

```bash
# Projekt anlegen
mkdir todo-minimal && cd todo-minimal
npm init -y && npm i express && mkdir public

# Starten
npm start

---

### 0.3 Windows Firewall-Hinweis bei `npm start`

Wenn Windows beim Starten von `npm start` meldet, dass die „Windows-Firewall einige Funktionen von Node.js in allen öffentlichen und privaten Netzwerken blockiert hat“ und fragt, ob Sie zulassen möchten, bedeutet das:

* **Private Netzwerke** = Heim- oder Firmennetze, die Sie als vertrauenswürdig markiert haben (z. B. Ihr WLAN zu Hause).
* **Öffentliche Netzwerke** = Unbekannte/vermutlich unsichere Netze (z. B. Café, Hotel, Flughafen-Hotspot).

**Warum passiert das?**
Node.js startet Ihren Express‑Server auf einem Port (z. B. 3000) und lauscht auf eingehende Verbindungen. Windows-Firewall erkennt dies als „Anwendung lauscht auf Verbindungen“ und fragt, ob es Verbindungen zulassen soll.

**Empfehlung im Schulungskontext:**

* Für rein lokale Entwicklung reicht es, **nur private Netzwerke zuzulassen**. Dann kann Ihr Server über `http://localhost:3000` im eigenen Rechner genutzt werden.
* Öffentliche Netzwerke nur zulassen, wenn andere Geräte im gleichen Netz auf den Server zugreifen sollen (z. B. Test vom Smartphone im gleichen WLAN).

---

# Prüfen
node -v && npm -v
```

## 11) Laufenden Server anzeigen

**CMD (Windows):**

```cmd
tasklist | find "node"
```

**PowerShell (Windows):**

```powershell
Get-Process -Name node
```

**Linux/macOS:**

```bash
ps aux | grep node
```

Oder Port-basiert:

```bash
lsof -i :3000
```

Damit sieht man, ob Node auf Port 3000 läuft und welche Prozess-ID er hat.
