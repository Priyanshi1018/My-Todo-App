const input = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const list = document.getElementById("todo-list");
const settingsBtn = document.getElementById("settings-btn");
const settings = document.getElementById("settings");
const overlay = document.getElementById("overlay");

const fontSelect = document.getElementById("font-select");
const sizeSelect = document.getElementById("size-select");
const colorPicker = document.getElementById("color-picker");

const filterAll = document.getElementById("filter-all");
const filterPending = document.getElementById("filter-pending");
const filterDone = document.getElementById("filter-done");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "all";

const doneMessages = [
  "You did it ✨",
  "So proud of you 💖",
  "Another win 🌸",
  "Keep going 💪",
  "Look at you go 🌱",
  "Small step, big progress 🚀",
  "Task completed 🎉",
  "Way to crush it! 💥",
  "You're on fire! 🔥",
  "Victory dance time! 💃🕺"
];

// ⚙️ SETTINGS TOGGLE
settingsBtn.onclick = () => {
  settings.classList.add("open");
  overlay.classList.remove("hidden");
};

overlay.onclick = () => {
  settings.classList.remove("open");
  overlay.classList.add("hidden");
};

// 🎨 THEMES
document.querySelectorAll("[data-theme]").forEach(btn => {
  btn.onclick = () => {
    document.body.className = document.body.className.replace(/theme-\w+/g, "");
    document.body.classList.add(`theme-${btn.dataset.theme}`);
  };
});

// 🔤 FONT FAMILY
fontSelect.onchange = () => {
  document.body.className = document.body.className.replace(/font-\w+/g, "");
  document.body.classList.add(`font-${fontSelect.value}`);
};

// 🔠 FONT SIZE
sizeSelect.onchange = () => {
  document.body.className = document.body.className.replace(/size-\w+/g, "");
  document.body.classList.add(`size-${sizeSelect.value}`);
};

// 🎨 FONT COLOR
colorPicker.oninput = () => {
  document.body.style.color = colorPicker.value;
};

// 📋 FILTERS
filterAll.onclick = () => { currentFilter = "all"; render(); };
filterPending.onclick = () => { currentFilter = "pending"; render(); };
filterDone.onclick = () => { currentFilter = "done"; render(); };

// 💾 SAVE
function save() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// ➕ ADD TODO (✅ FIXED)
addBtn.onclick = () => {
  const text = input.value.trim();
  if (!text) return;

  const date = prompt(
    "What’s the last date to complete this task? 📅\n(YYYY-MM-DD)"
  );

  const newTodo = {
    text: text,
    date: date || "",
    done: false,
    reminded: false
  };

  todos.push(newTodo);   // ✅ properly added
  input.value = "";

  save();
  render();              // ✅ now list updates immediately
};

// 🖨️ RENDER TODOS (✅ FIXED)
function render() {
  list.innerHTML = "";

  const filteredTodos = todos.filter(t => {
    if (currentFilter === "pending") return !t.done;
    if (currentFilter === "done") return t.done;
    return true;
  });

  filteredTodos.forEach(t => {
    const li = document.createElement("li");
    if (t.done) li.classList.add("done");

    const content = document.createElement("div");
    content.innerHTML = `<strong>${t.text}</strong>`;

    // 📅 DATE UNDER TODO
    if (t.date) {
      const small = document.createElement("small");
      small.textContent = `finish by ${t.date}`;
      content.appendChild(small);
    }

    li.appendChild(content);

    // ✅ DONE BUTTON (only if pending)
    if (!t.done) {
      const doneBtn = document.createElement("button");
      doneBtn.textContent = "Done";
      doneBtn.onclick = () => {
        t.done = true;
        alert(doneMessages[Math.floor(Math.random() * doneMessages.length)]);
        save();
        render();
      };
      li.appendChild(doneBtn);
    }

    // 🗑️ DELETE BUTTON (only in done filter)
    if (t.done && currentFilter === "done") {
      const delBtn = document.createElement("button");
      delBtn.textContent = "Delete";
      delBtn.className = "delete-btn";
      delBtn.onclick = () => {
        todos = todos.filter(todo => todo !== t);
        save();
        render();
      };
      li.appendChild(delBtn);
    }

    list.appendChild(li);
  });

  checkPending();
}

// ⏰ PENDING REMINDER
function checkPending() {
  const today = new Date().toISOString().split("T")[0];

  todos.forEach(t => {
    if (!t.done && t.date && t.date < today && !t.reminded) {
      t.reminded = true;
      alert(`⏰ "${t.text}" is still pending 🌸`);
    }
  });

  save();
}

// 🚀 INITIAL LOAD
render();
