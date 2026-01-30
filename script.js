const todoInput = document.getElementById('todo-input');
const todoDate = document.getElementById('todo-date');
const todoTime = document.getElementById('todo-time');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');

const todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

// Apply theme
const theme = localStorage.getItem('theme');
if (theme) document.body.classList.add(theme);

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function createTodo(todo, index) {
  const li = document.createElement('li');

  const span = document.createElement('span');
  span.textContent = `${todo.text} ⏰ ${todo.date || ''} ${todo.time || ''}`;
  if (todo.completed) span.style.textDecoration = 'line-through';

  span.onclick = () => {
    todo.completed = !todo.completed;
    saveTodos();
    render();
  };

  const del = document.createElement('button');
  del.textContent = '✖';
  del.onclick = () => {
    todos.splice(index, 1);
    saveTodos();
    render();
  };

  li.appendChild(span);
  li.appendChild(del);
  return li;
}

function render() {
  todoList.innerHTML = '';
  let list = todos;

  if (currentFilter === 'completed') list = todos.filter(t => t.completed);
  if (currentFilter === 'pending') list = todos.filter(t => !t.completed);

  list.forEach((todo, i) => todoList.appendChild(createTodo(todo, i)));
}

addBtn.onclick = () => {
  if (!todoInput.value.trim()) return;

  todos.push({
    text: todoInput.value,
    date: todoDate.value,
    time: todoTime.value,
    completed: false
  });

  todoInput.value = '';
  todoDate.value = '';
  todoTime.value = '';

  saveTodos();
  render();
};

function filterTodos(type) {
  currentFilter = type;
  render();
}

// Reminder
setInterval(() => {
  const now = new Date();
  const d = now.toISOString().split('T')[0];
  const t = now.toTimeString().slice(0,5);

  todos.forEach(todo => {
    if (todo.date === d && todo.time === t && !todo.completed) {
      alert(`⏰ Reminder: ${todo.text}`);
      todo.completed = true;
      saveTodos();
      render();
    }
  });
}, 60000);

render();
