# Minimal-Todo-App: Übersicht & Navigation

<p align="center">
  <a href="#readme">Readme</a> |
  <a href="#projekt-anlegen">Projekt anlegen</a> |
  <a href="#persistenz-in-local-storage">Persistenz in Local Storage</a> |
  <a href="#persistenz-in-datei">Persistenz in Datei</a> |
  <a href="#cheat-sheet--trouble-shooting">Cheat-Sheet & Trouble Shooting</a>
</p>

---

# Readme

<p align="center">
  <a href="#readme">Readme</a> |
  <a href="#projekt-anlegen">Projekt anlegen</a> |
  <a href="#persistenz-in-local-storage">Persistenz in Local Storage</a> |
  <a href="#persistenz-in-datei">Persistenz in Datei</a> |
  <a href="#cheat-sheet--trouble-shooting">Cheat-Sheet & Trouble Shooting</a>
</p>

Willkommen zum Minimal-Todo-Projekt! Diese Anleitung ist für Anfänger gedacht und führt dich Schritt für Schritt durch die wichtigsten Themen. Nutze die Navigation oben, um direkt zu den gewünschten Abschnitten zu springen.

---

# Voraussetzungen

## 0) Voraussetzungen & Installation

### 0.1 Node.js + npm installieren

> **Hinweis:** npm wird automatisch mit Node.js installiert.

**Windows (empfohlen: LTS-Version)**

1. Öffne [https://nodejs.org/](https://nodejs.org/) und lade die **LTS**-Version ("Recommended for Most Users") als **.msi** herunter.
2. Installer starten → Standardoptionen beibehalten → Fertigstellen.
3. **CMD/PowerShell** öffnen und prüfen:

   ```bash
   node -v
   npm -v
   ```

**macOS**

1. Öffne [https://nodejs.org/](https://nodejs.org/) und lade die **LTS**-Version als **.pkg** herunter.
2. Installer ausführen → Standardoptionen.
3. Prüfen im **Terminal**:

   ```bash
   node -v
   npm -v
   ```

**Linux (Ubuntu/Debian, Einsteigerweg)**

```bash
sudo apt update
sudo apt install -y nodejs npm
node -v
npm -v
```

> Alternative (aktuellere Versionen): NodeSource oder nvm verwenden (für Fortgeschrittene).

---

### 0.2 Visual Studio Code (VS Code) installieren

**Windows/macOS/Linux**

1. Öffne [https://code.visualstudio.com/](https://code.visualstudio.com/) → **Download** für dein System.
2. Installer ausführen → Standardoptionen.
3. **Empfohlene Extensions:**

   * **ESLint** (dbaeumer.vscode-eslint)
   * **Prettier** (esbenp.prettier-vscode)

**VS Code Terminal öffnen:**

* Menü **View → Terminal** oder ``Ctrl+` `` (Backtick).


---

# Projekt anlegen {#projekt-anlegen}

<p align="center">
  <a href="#readme">Readme</a> |
  <a href="#projekt-anlegen">Projekt anlegen</a> |
  <a href="#persistenz-in-local-storage">Persistenz in Local Storage</a> |
  <a href="#persistenz-in-datei">Persistenz in Datei</a> |
  <a href="#cheat-sheet--trouble-shooting">Cheat-Sheet & Trouble Shooting</a>
</p>

Hier wird Schritt für Schritt erklärt, wie du das Projekt bis Punkt 5 anlegst.

1. Neues Verzeichnis erstellen
2. Initialisiere npm
3. Installiere Express
4. Erstelle die Ordnerstruktur
5. Starte den Server

## 1) Neues Projekt anlegen

```bash
mkdir todo-minimal
cd todo-minimal
npm init -y
npm install express
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
const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

let todos = [];
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
```

## 5) Starten & Testen

```bash
npm start
```

Öffne im Browser: **[http://localhost:3000](http://localhost:3000)**

* Todo hinzufügen, abhaken, bearbeiten (Prompt), löschen.

---

# Persistenz in Local Storage {#persistenz-in-local-storage}

<p align="center">
  <a href="#readme">Readme</a> |
  <a href="#projekt-anlegen">Projekt anlegen</a> |
  <a href="#persistenz-in-local-storage">Persistenz in Local Storage</a> |
  <a href="#persistenz-in-datei">Persistenz in Datei</a> |
  <a href="#cheat-sheet--trouble-shooting">Cheat-Sheet & Trouble Shooting</a>
</p>

Hier lernst du, wie du die Aufgaben im Local Storage des Browsers speicherst.

**Code-Ergänzungen für Local Storage:**

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

---

# Persistenz in Datei {#persistenz-in-datei}

<p align="center">
  <a href="#readme">Readme</a> |
  <a href="#projekt-anlegen">Projekt anlegen</a> |
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

# Cheat-Sheet & Trouble Shooting {#cheat-sheet-und-trouble-shooting}

<p align="center">
  <a href="#readme">Readme</a> |
  <a href="#projekt-anlegen">Projekt anlegen</a> |
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
