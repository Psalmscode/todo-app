// Select elements
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const errorMsg = document.querySelector(".error-msg");
const filterButtons = document.querySelectorAll(".filter-btn");
const searchInput = document.getElementById("searchInput");
const taskCounter = document.querySelector(".task-counter");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// 🧩 Render Tasks
function renderTasks() {
  taskList.innerHTML = "";
  const filteredTasks = getFilteredTasks();
  const searchTerm = searchInput.value.toLowerCase();

  const visibleTasks = filteredTasks.filter(task =>
    task.text.toLowerCase().includes(searchTerm)
  );

  visibleTasks.forEach((task, index) => {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    li.innerHTML = `
      <span class="check-icon" onclick="toggleTask(${index})">
        ${task.completed ? "✔️" : "⬜"}
      </span>
      <span class="task-text" contenteditable="false">${task.text}</span>
      <div class="actions">
        <button class="edit-btn" onclick="editTask(${index})">Edit</button>
        <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
      </div>
    `;

    taskList.appendChild(li);
  });

  updateCounter();
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// 🧮 Update Task Counter
function updateCounter() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  taskCounter.textContent = `Total: ${total} | Completed: ${completed}`;
}

// 🟢 Add Task
addTaskBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();

  if (!text) {
    showError("Task cannot be empty!");
    return;
  }

  if (tasks.some(task => task.text.toLowerCase() === text.toLowerCase())) {
    showError("Duplicate task not allowed!");
    return;
  }

  tasks.push({ text, completed: false });
  taskInput.value = "";
  hideError();
  renderTasks();
});

// ⚙️ Edit Task
function editTask(index) {
  const li = taskList.children[index];
  const textSpan = li.querySelector(".task-text");

  if (textSpan.isContentEditable) {
    const newText = textSpan.textContent.trim();

    if (!newText) {
      showError("Task cannot be empty!");
      return;
    }

    if (
      tasks.some(
        (task, i) =>
          i !== index && task.text.toLowerCase() === newText.toLowerCase()
      )
    ) {
      showError("Duplicate task not allowed!");
      return;
    }

    tasks[index].text = newText;
    textSpan.contentEditable = false;
    textSpan.classList.remove("editable");
    hideError();
    renderTasks();
  } else {
    textSpan.contentEditable = true;
    textSpan.classList.add("editable");
    textSpan.focus();
  }
}

// 🗑️ Delete Task
function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

// ✅ Toggle Completion
function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  renderTasks();
}

// 🧭 Filtering
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

function getFilteredTasks() {
  if (currentFilter === "completed")
    return tasks.filter(task => task.completed);
  if (currentFilter === "pending")
    return tasks.filter(task => !task.completed);
  return tasks;
}

// 🔍 Live Search
searchInput.addEventListener("input", renderTasks);

// ⚠️ Error Handling
function showError(message) {
  errorMsg.textContent = message;
  errorMsg.style.display = "block";
}

function hideError() {
  errorMsg.style.display = "none";
}

// 💾 Initial Render
renderTasks();
