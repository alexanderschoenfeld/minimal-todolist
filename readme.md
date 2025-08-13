# Minimal-Todo-App: Übersicht & Navigation

<p align="center">
  <a href="#voraussetzungen--installation">Voraussetzungen & Installation</a> |
  <a href="#projekt-anlegen">Projekt anlegen</a> |
  <a href="#speicher-varianten-schritt-für-schritt">Speicher-Varianten</a> |
  <a href="#trouble-shooting">Trouble Shooting</a>
</p>

In dieser Übung erstellen wir eine minimalistische Todo-App mit Node.js und Express. 

Schritt für Schritt lernst du, wie du ein neues Projekt aufsetzt, die grundlegende Backend-Logik entwickelst und ein einfaches Frontend implementierst. 

Ziel ist es, Todos zu speichern, zu bearbeiten und zu löschen – ideal für den Einstieg in die Webentwicklung mit JavaScript. 

Der Code enthält bereits drei Varianten, wie die eingegebenen Todos gespeichert werden. 

**Ziel:** Wir sehen, wie dynamisch Daten (die Todos) am Frontend abgerufen werden können und gespeichert werden, ... 
- im *"runtime Memory"* des Browsers
- im *lokalen Speicer (local storage)* 
- in einer Datei, *die im Backend des Servers* liegt.

Aber zuerst bauen wir alles zusammen und laden die nötigen Libraries herunter.

---

# Voraussetzungen & Installation

<p align="center">
  <a href="#voraussetzungen--installation">Voraussetzungen & Installation</a> |
  <a href="#projekt-anlegen">Projekt anlegen</a> |
  <a href="#speicher-varianten-schritt-für-schritt">Speicher-Varianten</a> |
  <a href="#trouble-shooting">Trouble Shooting</a>
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

# Projekt von Anfang an manuell anlegen *(wenn Du es nicht einfach schon geclonet hast)* 

<p align="center">
  <a href="#voraussetzungen--installation">Voraussetzungen & Installation</a> |
  <a href="#projekt-anlegen">Projekt anlegen</a> |
  <a href="#speicher-varianten-schritt-für-schritt">Speicher-Varianten</a> |
  <a href="#trouble-shooting">Trouble Shooting</a>
</p>

Hier wird Schritt für Schritt erklärt, wie du das Projekt bis Punkt 5 anlegst.

1. Neues Verzeichnis erstellen
2. Installiere Express
3. Erstelle die Ordnerstruktur
4. Starte den Server

**Beachte:** *Wenn Du das Projekt nicht von Github geclont hast, dann starte so:*
## 1) Neues Projekt anlegen:
Mit den Befehlen unten kreierst Du: 
1. Deinen Projektordner namens minimal-todolist
2. springst in diesen Ordner hinein
3. initialisierst Node.js - was die Dateien package.json und package-lock.json kreiert
4. installierst die Bibliotheken express (Deiner Backend Server) und fs-extra (Hilfsbibliothek für das Dateimanagement)
5. du kreierst die server.js Datei. Hier schreibst Du im Anschluss den Code für Deinen Server rein
6. Du kreierst einen Ordner namens public und springst direkt danach hinein
7. Du kreierst zwei Dateien namens index.html und app.js

```bash
mkdir minimal-todolist
cd minimal-todolist
npm init -y
npm install express fs-extra
type nul > server.js //kreiert die Datei server.js
mkdir public & cd public
type nul > index.html & type nul > app.js //kreiert zwei Dateien gleichzeitig

```

So sollte Deine Dateistruktur jetzt aussehen:
```
todo-minimal/
├─ package.json
├─ server.js
└─ public/
   ├─ index.html
   └─ app.js
```

In **package.json** musst Du Startskript ergänzen:

```json
{
  "name": "todo-minimal",
  "version": "1.0.0",
  "main": "server.js",
  "type": "commonjs",
  "scripts": {
    "start": "node server.js" //diese Zeile unter Scripts hinzufügen
  },
  "dependencies": {
    "express": "^4.19.2"
  }
}
```

## 2) Backend (Express) – `server.js`

In die Datei **server.js** kopierst Du diesen Code:
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

Füge den HTML-Code in die Datei **index.html** ein.
Dies ist eine sehr simple gestylte HTML Seite, über die Du Deine Todos einpflegen wirst.

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

Füge diesen Code in Deine **app.js** ein.
Diese Code enthält 3 verschiedene Programmierungen zur Veranschaulichung. Diese Varianten aktivieren wir Schritt-für-Schritt in dieser Übung: <a href="#speicher-varianten-schritt-für-schritt">Speicher-Varianten</a> weiter unten auf dieser Seite.

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
  <a href="#speicher-varianten-schritt-für-schritt">Speicher-Varianten</a> |
  <a href="#trouble-shooting">Trouble Shooting</a>
</p>

## Ziel der Übung

Du lernst, wie die Aufgaben (Todos) in drei Varianten gespeichert werden können:
1. Nur im Arbeitsspeicher (Memory)
2. Im Local Storage des Browsers
3. Im Backend (Datei/Server, über die API)

Alle Varianten sind im Code von `public/app.js` bereits vorbereitet und *auskommentiert*. Du aktivierst sie Schritt für Schritt, indem du die entsprechenden Zeilen wieder *einkommentierst*.

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

- Suche im Code nach allen Kommentarzeilen, die mit `// Schritt 2:` beginnen (z.B. `// Schritt 2: aktivieren für Local Storage`).
- Entferne die Kommentarzeichen (`//`) vor diesen Zeilen, um die Local Storage-Funktionalität zu aktivieren.
- Jetzt werden die Todos im Browser gespeichert und bleiben nach einem Neuladen erhalten.

---

### Schritt 3: API/Datei aktivieren

- Suche im Code nach allen Kommentarzeilen, die mit `// Schritt 3:` beginnen (z.B. `// Schritt 3: aktivieren für API`).
- Entferne die Kommentarzeichen (`//`) vor diesen Zeilen, um die API/Datei-Funktionalität zu aktivieren.
- Jetzt werden die Todos im Backend (z.B. in einer Datei) gespeichert und sind für alle Nutzer verfügbar.


# Trouble Shooting
<p align="center">
  <a href="#voraussetzungen--installation">Voraussetzungen & Installation</a> |
  <a href="#projekt-anlegen">Projekt anlegen</a> |
  <a href="#speicher-varianten-schritt-für-schritt">Speicher-Varianten</a> |
  <a href="#trouble-shooting">Trouble Shooting</a>
</p>

- **Fehler: Port belegt** – Prüfe, ob ein anderer Server läuft und beende ihn
- **Fehler: Modul nicht gefunden** – Stelle sicher, dass alle Pakete installiert sind (`npm install`)
- **Browser zeigt keine Seite** – Prüfe, ob der Server läuft und die richtige Adresse verwendet wird

- **Windows Firewall-Hinweis nach** `npm start`
Wenn Windows beim Starten von `npm start` meldet, dass die „Windows-Firewall einige Funktionen von Node.js in allen öffentlichen und privaten Netzwerken blockiert hat“ und fragt, ob Sie zulassen möchten, bedeutet das:
**Private Netzwerke** = Heim- oder Firmennetze, die Sie als vertrauenswürdig markiert haben (z. B. Ihr WLAN zu Hause).
**Öffentliche Netzwerke** = Unbekannte/vermutlich unsichere Netze (z. B. Café, Hotel, Flughafen-Hotspot).

**Warum passiert das?**
Node.js startet Ihren Express‑Server auf einem Port (z. B. 3000) und lauscht auf eingehende Verbindungen. Windows-Firewall erkennt dies als „Anwendung lauscht auf Verbindungen“ und fragt, ob es Verbindungen zulassen soll.

---

## 6) Laufenden Server anzeigen

**CMD (Windows):**

```cmd
tasklist | find "node"
```

**PowerShell (Windows):**

```powershell
Get-Process -Name node
```

**Linux/macOS**
*(nur einsetzbar, wenn der Server auch tatsächlich in einer Linux Umgebung läuft!):*

```bash
ps aux | grep node
```

Oder Port-basiert:

```bash
lsof -i :3000
```

Damit sieht man, ob Node auf Port 3000 läuft und welche Prozess-ID er hat.

---

## 7) Didaktischer Ablauf (für Trainer\:innen)

1. **Hello Express:** `server.js` anlegen, `console.log` zeigen, Startskript ausführen.
2. **GET /api/todos:** Route erstellen, im Browser testen (JSON sichtbar).
3. **POST /api/todos:** Formular sendet per Fetch → Erfolg im UI.
4. **PATCH/DELETE:** Statuswechsel & Entfernen zeigen.
5. **CSS:** Klassenschalter `.done` demonstrieren.
6. **Fehlerfälle:** Leerer Text → `400 Bad Request` (mit DevTools Network zeigen).

## Didaktischer Ablauf – ausführlich erklärt

### 7.1 Hello Express
- Ziel: Die Teilnehmer:innen sehen, wie ein Node.js-Server mit Express gestartet wird.
- Vorgehen:
  - `server.js` öffnen und die Zeile mit `console.log` zeigen.
  - Im Terminal mit `npm start` den Server starten.
  - Die Erfolgsmeldung im Terminal demonstrieren.

### 7.2 GET /api/todos
- Ziel: Die Teilnehmer:innen sehen, wie das Backend Daten als JSON bereitstellt.
- Vorgehen:
  - Die Route `app.get("/api/todos", ...)` im Code zeigen.
  - Im Browser `http://localhost:3000/api/todos` öffnen und das JSON betrachten.

### 7.3 POST /api/todos
- Ziel: Die Teilnehmer:innen lernen, wie neue Daten zum Backend gesendet werden.
- Vorgehen:
  - Im Frontend eine neue Todo hinzufügen und im DevTools-Netzwerk-Tab den POST-Request zeigen.
  - **Tipp:** Man kann POST auch direkt von der Kommandozeile mit `curl` testen:
    - **curl installieren:**
      - Windows: [Download curl](https://curl.se/windows/)
      - macOS/Linux: curl ist meist vorinstalliert
    - **Beispiel-Befehl:**
      ```sh
      curl -X POST http://localhost:3000/api/todos -H "Content-Type: application/json" -d "{\"text\":\"Test\"}"
      ```
    - Das Ergebnis wird direkt im Terminal angezeigt.

### 7.4 PATCH/DELETE
- Ziel: Die Teilnehmer:innen sehen, wie bestehende Daten geändert oder gelöscht werden.
- Vorgehen:
  - Im UI ein Todo abhaken, bearbeiten oder löschen und die entsprechenden Requests im DevTools-Netzwerk-Tab zeigen.
  - Optional: Auch mit curl testen:
    - PATCH:
      ```sh
      curl -X PATCH http://localhost:3000/api/todos/1 -H "Content-Type: application/json" -d "{\"done\":true}"
      ```
    - DELETE:
      ```sh
      curl -X DELETE http://localhost:3000/api/todos/1
      ```

### 7.5 CSS: Klassenschalter `.done`
- Ziel: Die Teilnehmer:innen verstehen, wie das Aussehen im Frontend gesteuert wird.
- Vorgehen:
  - Im UI zeigen, wie erledigte Todos durchgestrichen sind.
  - Im Code die CSS-Regel `li.done .text { ... }` zeigen.
  - **Erklärung:** CSS wirkt nur im Frontend und beeinflusst die Darstellung im Browser, nicht die Daten im Backend.

### 7.6 Fehlerfälle: Leerer Text → 400 Bad Request
- Ziel: Die Teilnehmer:innen sehen, wie das Backend Fehler behandelt.
- Vorgehen:
  - Im UI eine leere Todo absenden und im DevTools-Netzwerk-Tab den 400-Fehler zeigen.
  - Im Backend-Code die entsprechende Fehlerbehandlung zeigen.

---

### Zusatz: Frontend-Only (Local Storage/Memory)
- **Erklärung:** Wenn die Todos nur im Local Storage oder Memory gespeichert werden, arbeitet das Frontend unabhängig vom Backend. Das Backend wird entlastet, da keine Requests gesendet werden und alle Daten im Browser verarbeitet werden.
- Vorteil: Schnelle Reaktion, weniger Serverlast, aber keine Synchronisation zwischen verschiedenen Geräten.




