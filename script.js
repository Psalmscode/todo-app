const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function showTasks() {
  taskList.innerHTML = ""; 

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];

    const li = document.createElement("li");
    if (task.completed) {
      li.classList.add("completed");
    }

    const check = document.createElement("span");
    check.className = "material-icons check-icon";
    check.textContent = "check_circle";
    check.onclick = function () {
      toggleComplete(i);
    };

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    const actions = document.createElement("div");
    actions.className = "actions";

    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.textContent = "Edit";
    editBtn.onclick = function () {
      editTask(text, i, editBtn);
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = function () {
      deleteTask(i);
    };

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    li.appendChild(check);
    li.appendChild(text);
    li.appendChild(actions);
    taskList.appendChild(li);
  }
}

function addTask() {
  const newTask = taskInput.value;
  if (newTask === "" || newTask === " ") {
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
    textElement.contentEditable = false;
    textElement.classList.remove("editable");
    tasks[index].text = textElement.textContent;
    saveTasks();
    showTasks();
  };
}

addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});

showTasks();
