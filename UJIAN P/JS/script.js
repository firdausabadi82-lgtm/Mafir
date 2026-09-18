const todoForm = document.querySelector('#todo-form');
const taskInput = document.querySelector('#taskInput');
const taskCount = document.querySelector('#taskCount');
const todoList = document.querySelector('#todoList');
const clearCompletedBtn = document.querySelector('#clearCompletedBtn');
const filterBtns = document.querySelectorAll('.filter-btn');

let tasks = [];
let currentFilter = 'all';

function render() {
  let filtered = tasks;

  if (currentFilter === 'active') {
    filtered = tasks.filter(t => !t.completed);
  } else if (currentFilter === 'completed') {
    filtered = tasks.filter(t => t.completed);
  }

  taskCount.textContent = tasks.length;

  todoList.innerHTML = '';

  if (filtered.length === 0) {
    const emptyLi = document.createElement('li');
    emptyLi.className = 'empty-message';
    emptyLi.innerHTML = `
      <span>📭</span>
      ${tasks.length === 0
        ? 'Belum ada tugas. Yuk tambah!'
        : 'Tidak ada tugas dengan filter ini.'}
    `;
    todoList.appendChild(emptyLi);
  } else {
    filtered.forEach(task => {
      const li = document.createElement('li');
      li.className = `todo-item ${task.completed ? 'completed' : ''}`;
      li.dataset.id = task.id;

      const leftDiv = document.createElement('div');
      leftDiv.className = 'left';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.completed;
      checkbox.addEventListener('change', () => toggleTask(task.id));

      const textSpan = document.createElement('span');
      textSpan.className = 'task-text';
      textSpan.textContent = task.text;

      leftDiv.appendChild(checkbox);
      leftDiv.appendChild(textSpan);

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.innerHTML = 'x';
      deleteBtn.setAttribute('aria-label', 'Hapus tugas');
      deleteBtn.addEventListener('click', () => deleteTask(task.id));

      li.appendChild(leftDiv);
      li.appendChild(deleteBtn);
      todoList.appendChild(li);
    });
  }
}

function addTask(text) {
  const trimmed = text.trim();
  if (trimmed === '') return false;

  const newTask = {
    id: Date.now(),
    text: trimmed,
    completed: false,
  };

  tasks.push(newTask);
  render();
  return true;
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    render();
  }
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  render();
}

function clearCompletedTasks() {
  const hasCompleted = tasks.some(t => t.completed);
  if (!hasCompleted) {
    alert('Tidak ada tugas yang sudah selesai untuk dihapus.');
    return;
  }
  if (confirm('Apakah anda yakin ingin menghapus semua tugas yang sudah selesai?')) {
    tasks = tasks.filter(t => !t.completed);
    render();
  }
}

function setFilter(filter) {
  currentFilter = filter;
  filterBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
  render();
}

todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const value = taskInput.value;
  const success = addTask(value);
  if (success) {
    taskInput.value = '';
    taskInput.focus();
  }
});

filterBtns.forEach(btn => {
  btn.addEventListener('click', function () {
    setFilter(this.dataset.filter);
  });
});

clearCompletedBtn.addEventListener('click', clearCompletedTasks);

tasks = [
  { id: 1, text: 'Belajar DOM manipulation', completed: false },
  { id: 2, text: 'Buat to-do list interaktif', completed: false },
  { id: 3, text: 'Latihan querySelector & addEventListener', completed: true },
];

render();