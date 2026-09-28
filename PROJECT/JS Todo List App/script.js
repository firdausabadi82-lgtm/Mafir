const todoForm = document.querySelector('#todo-form');
const taskInput = document.querySelector('#taskInput');
const taskCount = document.querySelector('#taskCount');
const todoList = document.querySelector('#todoList');
const clearCompletedBtn = document.querySelector('#clearCompletedBtn');
const filterBtns = document.querySelectorAll('.filter-btn');


let currentFilter = 'all';

const STORAGE_KEY = 'todo-list-data';

let tasks =[];

function saveToStorage(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadFromStorage(){
  const dataString =localStorage.getItem(STORAGE_KEY);

  if(dataString){
    return JSON.parse(dataString);
  } else {
    return [
      { id: 1, text:'belajar DOM manipulation', completed: false  },
      { id: 2 , text:'buat to-do list inferaktif', completed: false },
      { id: 3, text:'latihan querySelector & addEventListener', completed: true },
    ];

  }

  }


function render() {
  const filtered = tasks.filter(task => {
    if (currentFilter === 'active') {
      return !task.completed;
    }
    if (currentFilter === 'completed') {
      return task.completed;
    }
    return true;
  });
  

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
    const htmlString = filtered.map(task => {
      return `
        <li class="todo-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
          <div class="left">
            <input type="checkbox" ${task.completed ? 'checked' : ''} 
              data-action="toggle" data-id="${task.id}"/>
              <span class="task-text">${task.text}</span>
          </div>
          <button class="delete-btn" data-action="delete" data-id="${task.id}">🗑️</button>
        </li>
      `;
    }).join('');

    todoList.innerHTML = htmlString;
  }
const activeCount = tasks.reduce((count, task) => {
  return task.completed ? count : count + 1;
}, 0);
taskCount.textContent = activeCount;
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
  saveToStorage();
  render();
  return true;
}

function toggleTask(id) {
  tasks = tasks.map(task => {
    if (task.id === id) {
      return {
        ...task, completed: !task.completed };
    }
    return task;
  });
  saveToStorage();
  render();
}
function deleteTask(id){
  tasks = tasks.filter(task => task.id !== id);
  saveToStorage();
  render();
}

function clearCompleted() {

  const hasCompleted = tasks.some(task => task.completed);

if(!hasCompleted) {
  alert('tidak ada tugas yang selesai.');
  return;
}

if(confirm('yakin ingin menghapus semua tugas yang sudah selesai')) {
tasks = tasks.filter(task => !task.completed);
saveToStorage();
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

todoList.addEventListener('change', function(e) {
  const target = e.target;

  if (target.dataset.action === 'toggle') {
    const id = Number(target.dataset.id);
    toggleTask(id);
  }

});

todoList.addEventListener('click', function(e) {
  if(e.target.dataset.action === 'delete') {
    deleteTask(Number(e.target.dataset.id));
  }
});

todoForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const value = taskInput.value;
  const success = addTask(value);

  if (success) {
    taskInput.value ='';
    taskInput.focus();
  }
});

clearCompletedBtn.addEventListener('click', clearCompleted);

filterBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    setFilter(this.dataset.filter);
  });
});

tasks = loadFromStorage();
render();