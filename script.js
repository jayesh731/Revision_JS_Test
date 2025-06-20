import { TaskManager } from "./TaskManager.js";

const inputEl = document.getElementById("input");
const emailBtn = document.getElementById("emailBtn");
const inputTask = document.getElementById("inputTask");
const taskBtn = document.getElementById("taskBtn");
const taskContainer = document.getElementById("taskContainer");
const taskEl = document.getElementById("task");
const taskText = document.getElementById("taskText");
const fetchContainer = document.getElementById("fetchContainer");
const fetchBtn = document.getElementById("fetchBtn");
const loading = document.getElementById("loading");
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const btn = document.getElementById("toggleBtn");
const timer = document.getElementById("timer");

let tasks = [];

const taskManager = new TaskManager();

// loadTaskFromLS();
displayTask();

function handelError(msg, el) {
  el.textContent = msg;
  el.style.color = "red";
}
function success(msg, el) {
  el.textContent = msg;
  el.style.color = "green";
}

function handelSubmit(e) {
  console.log("callign");
  e.preventDefault();
  const input = inputEl.value;
  const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

  if (regex.test(input)) {
    const err1 = document.getElementById("error1");
    success("Email Verified", err1);
  } else {
    const err1 = document.getElementById("error1");
    handelError("Email is not valid", err1);
  }
}

function displayTask() {
  // loadTaskFromLS();
  taskContainer.textContent = "";

  taskManager.getTasks().forEach((task) => {
    const li = document.createElement("li");
    const taskElement = `
      <div
        id="${task.id}"
        class="todo flex items-center justify-center max-w-md mx-auto bg-white shadow-md rounded-xl p-3 space-x-4 border border-gray-200"
      >
        <input type="checkbox" class="mt-1 accent-blue-600 w-5 h-5" />
        <div class="flex-1">
          <p class="task-text text-sm text-gray-500">
            ${task.text}
          </p>
        </div>
        <button class="edit text-blue-600 hover:text-blue-800 transition-colors">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button class="delete text-gray-400 hover:text-red-500 transition duration-200">
          ✕
        </button>
      </div>`;
    li.innerHTML = taskElement;
    taskContainer.appendChild(li);
    console.log(tasks);
  });
}

function addTask() {
  const err2 = document.getElementById("error2");

  if (inputTask.value) {
    err2.style.display = "none";
    taskManager.addTask(inputTask.value);
    displayTask();
  } else {
    handelError("Enter Task", err2);
  }
}

function displayQuates({ quote }) {
  const p = document.createElement("p");
  p.textContent = quote;
  p.classList.add("quote");
  fetchContainer.appendChild(p);
  loading.textContent = "";
}

async function fetchApi() {
  loading.textContent = "Loading...";
  fetchContainer.innerHTML = "";
  const id = Math.ceil(Math.random() * 10);
  console.log(id);
  try {
    const response = await fetch(`https://dummyjson.com/quotes/${id}`);
    const data = await response.json();
    console.log(data);
    displayQuates(data);
  } catch (error) {
    handelError("Error While Fetching Quates", loading);
  }
}

let isRed = true;

function drawSquare(color) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = color;
  ctx.fillRect(50, 50, 100, 100);
}

// Initial draw
drawSquare("red");

// timers
function timerFn() {
  let sec = 0;
  setInterval(() => {
    sec += 1;
    timer.textContent = `Since Page Load ${sec} Seconds`;
  }, 1000);
}
timerFn();

// event listners
emailBtn.addEventListener("click", handelSubmit);
taskBtn.addEventListener("click", addTask);

taskContainer.addEventListener("click", (e) => {
  const todoDiv = e.target.closest(".todo");
  const id = Number(todoDiv.id);

  if (e.target.closest('input[type="checkbox"]')) {
    const todoDiv = e.target.closest(".todo");
    const checkbox = e.target;
    const taskText = todoDiv.querySelector(".task-text");
    const editBtn = todoDiv.querySelector(".edit");
    taskManager.toggleCompletion(id, checkbox.checked);
    taskText.classList.toggle("line-through", checkbox.checked);
    editBtn.classList.toggle("hidden", checkbox.checked);
  } else if (e.target.closest(".delete")) {
    taskManager.deleteTask(id);
    displayTask();
  } else if (e.target.closest(".edit")) {
    const taskToEdit = taskManager.getTasks().find((task) => task.id === id);
    const newText = prompt("Edit your task:", taskToEdit.text);

    if (newText && newText.trim() !== "") {
      taskManager.editTask(id, newText);
      displayTask();
    }
  }
});

// fetch api
fetchBtn.addEventListener("click", fetchApi);

// canvas
btn.addEventListener("click", () => {
  isRed = !isRed;
  const newColor = isRed ? "red" : "blue";
  drawSquare(newColor);
});
