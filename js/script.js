// Variabel untuk melacak todo yang sedang diedit
let currentEditId = null;

// Function to generate a unique ID
function generateId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

// Function to format the timestamp
function formatTimestamp(dateString) {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Function to add a new todo or update an existing one
function addTodo() {
  const pekerjaan = document.getElementById('todoPekerjaan').value;
  const deadline = document.getElementById('todoDeadline').value;
  const status = document.getElementById('todoStatus').value;

  const todos = getTodos();
  const timestamp = new Date().toISOString();

  if (currentEditId) {
    // Update existing todo
    const updatedTodos = todos.map(todo => {
      if (todo.id === currentEditId) {
        return { ...todo, pekerjaan, deadline, status, timestamp };
      }
      return todo;
    });
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
    console.log('Todo updated:', currentEditId);
    alert('Todo telah diupdate!');
    currentEditId = null;
  } else {
    // Add new todo
    const id = generateId();
    const newTodo = {
      id,
      pekerjaan,
      timestamp,
      deadline,
      status,
    };
    todos.push(newTodo);
    localStorage.setItem('todos', JSON.stringify(todos));
    console.log('Todo added:', newTodo);
  }

  renderTodos();
}

// Function to get all todos
function getTodos() {
  return JSON.parse(localStorage.getItem('todos')) || [];
}

// Function to update the status of a todo by id
function updateTodoStatus(id, newStatus) {
  const todos = getTodos();
  const updatedTodos = todos.map(todo => {
    if (todo.id === id) {
      return { ...todo, status: newStatus };
    }
    return todo;
  });
  localStorage.setItem('todos', JSON.stringify(updatedTodos));
  console.log('Todo status updated:', id, newStatus);
  alert('Anda berhasil mengubah status tugas');
  renderTodos();
}

// Function to delete a todo by id
function deleteTodo(id) {
  const isConfirmed = confirm('Yakin ingin menghapus tugas ini?');
  if (isConfirmed) {
    let todos = getTodos();
    todos = todos.filter(todo => todo.id !== id);
    localStorage.setItem('todos', JSON.stringify(todos));
    console.log('Todo deleted:', id);
    renderTodos();
  }
}

// Function to clear all todos
function clearTodos() {
  const isConfirmed = confirm('Yakin ingin menghapus semua tugas?');
  if (isConfirmed) {
    localStorage.removeItem('todos');
    console.log('All todos cleared');
    renderTodos();
  }
}

// Function to clear completed todos
function clearCompletedTodos() {
  const isConfirmed = confirm('Yakin ingin menghapus semua tugas yang telah selesai?');
  if (isConfirmed) {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    const filteredTodos = todos.filter(todo => todo.status !== 'completed');
    localStorage.setItem('todos', JSON.stringify(filteredTodos));
    console.log('Completed todos cleared');
    renderTodos();
  }
}


// Function to render all todos
function renderTodos() {
  const todos = getTodos();
  const pendingTodosDiv = document.getElementById('pendingTodos');
  const completedTodosDiv = document.getElementById('completedTodos');

  pendingTodosDiv.innerHTML = '';
  completedTodosDiv.innerHTML = '';

  todos.forEach(todo => {
    const todoRow = document.createElement('tr');
    todoRow.innerHTML = `
      <td>${todo.pekerjaan}</td>
      <td>${formatTimestamp(todo.timestamp)}</td>
      <td>${formatTimestamp(todo.deadline)}</td>
      <td>${todo.status === 'pending' ? 'Berjalan' : 'Selesai'}</td>
      <td class="btn-group btn-group" role="group" aria-label="Small button group">
        <button class=" btn btn-primary" onclick="updateTodoStatus('${todo.id}', '${todo.status === 'pending' ? 'completed' : 'pending'}')">${todo.status === 'pending' ? 'Done' : 'Undo'}</button>
        <button class=" btn btn-warning" onclick="editTodo('${todo.id}')">Edit</button>
        <button class=" btn btn-danger" onclick="deleteTodo('${todo.id}')">Delete</button>
      </td>
    `;
    if (todo.status === 'pending') {
      pendingTodosDiv.appendChild(todoRow);
    } else {
      completedTodosDiv.appendChild(todoRow);
    }
  });
}

// Function to edit a todo by id
function editTodo(id) {
  const todos = getTodos();
  const todo = todos.find(todo => todo.id === id);
  if (todo) {
    document.getElementById('todoPekerjaan').value = todo.pekerjaan;
    document.getElementById('todoDeadline').value = todo.deadline;
    document.getElementById('todoStatus').value = todo.status;
    currentEditId = id;
    alert('Anda akan mengedit');
    window.scrollTo(0, 0);
  }
}

// Initial render
document.addEventListener('DOMContentLoaded', () => {
  renderTodos();
});
