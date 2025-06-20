import { saveToLocalStorage, loadTaskFromLS } from "./storage.js";

export class TaskManager {
  constructor(localKey = "tasks") {
    this.storageKey = localKey;
    this.tasks = loadTaskFromLS(this.storageKey);
  }

  addTask(text) {
    console.log(text);
    this.tasks.push({ id: Date.now(), text, completed: false });
    console.log(this.tasks);
    this.save();
  }

  editTask(id, newText) {
    const task = this.tasks.find((task) => task.id === id);
    if (task) {
      task.text = newText;
      this.save();
    }
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    this.save();
  }

  toggleCompletion(id, completed) {
    console.log(completed)
    this.tasks = this.tasks.map(task =>
      task.id === id ? { ...task, completed } : task
    );
    console.log(this.tasks)
    this.save();
  }

  getTasks() {
    return this.tasks;
  }
  save() {
    saveToLocalStorage(this.storageKey, this.tasks);
  }
}
