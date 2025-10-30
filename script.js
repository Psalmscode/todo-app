const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const errorMsg = document.getElementById("errorMsg");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");
const totalCount = document.getElementById("totalCount");
const completedCount = document.getElementById("completedCount");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function showTasks() {
  taskList.innerHTML = "";
  let filteredTasks = tasks.filter(task => {
    if (currentFilter === "completed") return task.completed;
    if (currentFilter === "pending") return !task.completed;
    return true;
  });

  const searchTerm = searchInput.value.toLowerCase();
  filteredTasks = filteredTasks.filter(task =>
    task.text.toLowerCase().includes(searchTerm)
  );

  filteredTasks.forEach((task, i) => {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    const check = document.createElement("span");
    check.className = "material-icons check-icon";
    check.textContent = "check_circle";
    check.onclick = () => toggleComplete(i);

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    const actions = document.createElement("div");
    actions.className = "actions";

    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.textContent = "Edit";
    editBtn.onclick = () => editTask(text, i, editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () => deleteTask(i);

    actions.append(editBtn, deleteBtn);
    li.append(check, text, actions);
    taskList.appendChild(li);
  });

  updateCounters();
}

function addTask() {
  const newTask = taskInput.value.trim();
  errorMsg.textContent = "";

  if (!newTask) {
    errorMsg.textContent = "Task cannot be empty!";
    return;
  }
  if (tasks.some(t => t.text.toLowerCase() === newTask.toLowerCase())) {
    errorMsg.textContent = "Task already exists!";
    return;
  }

  tasks.push({ text: newTask, completed: false });
  saveTasks();
  showTasks();
  taskInput.value = "";
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  showTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  showTasks();
}

function editTask(textElement, index, editButton) {
  textElement.contentEditable = true;
  textElement.classList.add("editable");
  textElement.focus();

  editButton.textContent = "Save";
  editButton.style.backgroundColor = "#28a745";
  editButton.style.color = "white";

  editButton.onclick = function () {
    const updatedText = textElement.textContent.trim();
    if (!updatedText) {
      errorMsg.textContent = "Task cannot be empty!";
      return;
    }
    tasks[index].text = updatedText;
    saveTasks();
    showTasks();
  };
}

function updateCounters() {
  totalCount.textContent = tasks.length;
  completedCount.textContent = tasks.filter(t => t.completed).length;
}

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    showTasks();
  });
});

searchInput.addEventListener("input", showTasks);

taskInput.addEventListener("keypress", e => {
  if (e.key === "Enter") addTask();
});

addBtn.addEventListener("click", addTask);

showTasks();
