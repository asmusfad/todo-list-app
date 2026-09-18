"use strict";

const STORAGE_KEY = "simple-todo-list-v1";

const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const list = document.querySelector("#task-list");
const emptyState = document.querySelector("#empty-state");
const count = document.querySelector("#task-count");
const clearButton = document.querySelector("#clear-completed");
const filters = [...document.querySelectorAll("[data-filter]")];
const notice = document.querySelector("#storage-notice");

let nextId = 0;
let currentFilter = "all";
let editingId = null;

function makeId() {
  return "task-" + Date.now().toString(36) + "-" + nextId++;
}

function showStorageNotice(message) {
  notice.textContent = message;
  notice.hidden = false;
}

function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved === null) return [];

    const data = JSON.parse(saved);

    if (!Array.isArray(data)) {
      throw new Error("Invalid saved list");
    }

    return data
      .filter(task =>
        task &&
        typeof task.title === "string" &&
        task.title.trim() &&
        typeof task.completed === "boolean"
      )
      .map(task => ({
        id: makeId(),
        title: task.title.trim().slice(0, 200),
        completed: task.completed
      }));
  } catch {
    showStorageNotice(
      "Saved tasks could not be loaded in this browser."
    );
    return [];
  }
}

let tasks = loadTasks();

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    notice.hidden = true;
  } catch {
    showStorageNotice(
      "Your tasks cannot be saved in this browser. " +
      "Keep this page open to retain them."
    );
  }
}

function createButton(text, className, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = text;
  button.addEventListener("click", onClick);
  return button;
}

function render() {
  list.replaceChildren();

  const visibleTasks = tasks.filter(task =>
    currentFilter === "all" ||
    (currentFilter === "active" && !task.completed) ||
    (currentFilter === "completed" && task.completed)
  );

  visibleTasks.forEach(task => {
    const item = document.createElement("li");
    item.className = "task" + (task.completed ? " is-completed" : "");

    if (editingId === task.id) {
      const editForm = document.createElement("form");
      editForm.className = "edit-form";

      const editInput = document.createElement("input");
      editInput.type = "text";
      editInput.className = "edit-input";
      editInput.id = "edit-" + task.id;
      editInput.value = task.title;
      editInput.maxLength = 200;
      editInput.required = true;
      editInput.setAttribute("aria-label", "Edit task");

      const actions = document.createElement("div");
      actions.className = "task-actions";

      const save = document.createElement("button");
      save.type = "submit";
      save.className = "save-button";
      save.textContent = "Save";

      actions.append(
        save,
        createButton("Cancel", "text-button", () => {
          editingId = null;
          render();
          document.getElementById("edit-button-" + task.id)?.focus();
        })
      );

      editInput.addEventListener("input", () => {
        editInput.setCustomValidity("");
      });

      editInput.addEventListener("keydown", event => {
        if (event.key === "Escape") {
          event.preventDefault();
          editingId = null;
          render();
          document.getElementById("edit-button-" + task.id)?.focus();
        }
      });

      editForm.addEventListener("submit", event => {
        event.preventDefault();

        const title = editInput.value.trim();

        if (!title) {
          editInput.setCustomValidity("Please enter a task.");
          editInput.reportValidity();
          return;
        }

        task.title = title;
        editingId = null;
        saveTasks();
        render();
        document.getElementById("edit-button-" + task.id)?.focus();
      });

      editForm.append(editInput, actions);
      item.append(editForm);
    } else {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "task-checkbox";
      checkbox.id = task.id;
      checkbox.checked = task.completed;

      checkbox.addEventListener("change", () => {
        task.completed = checkbox.checked;
        saveTasks();
        render();

        const remainingCheckbox = document.getElementById(task.id);

        if (remainingCheckbox) {
          remainingCheckbox.focus();
        } else {
          input.focus();
        }
      });

      const label = document.createElement("label");
      label.className = "task-title";
      label.htmlFor = task.id;

      // Treat task titles as text, never as HTML.
      label.textContent = task.title;

      const actions = document.createElement("div");
      actions.className = "task-actions";

      const edit = createButton("Edit", "text-button", () => {
        editingId = task.id;
        render();

        const editor = document.getElementById("edit-" + task.id);
        editor.focus();
        editor.select();
      });

      edit.id = "edit-button-" + task.id;
      edit.setAttribute("aria-label", "Edit task: " + task.title);

      const remove = createButton(
        "Delete",
        "text-button delete-button",
        () => {
          tasks = tasks.filter(other => other.id !== task.id);

          if (editingId === task.id) {
            editingId = null;
          }

          saveTasks();
          render();
          input.focus();
        }
      );

      remove.setAttribute("aria-label", "Delete task: " + task.title);

      actions.append(edit, remove);
      item.append(checkbox, label, actions);
    }

    list.append(item);
  });

  const active = tasks.filter(task => !task.completed).length;

  count.textContent = active + (
    active === 1 ? " task left" : " tasks left"
  );

  clearButton.disabled = !tasks.some(task => task.completed);
  emptyState.hidden = visibleTasks.length > 0;

  emptyState.textContent = tasks.length === 0
    ? "Your list is empty. Add your first task above."
    : currentFilter === "active"
      ? "All done! You have no active tasks."
      : "No completed tasks yet.";

  filters.forEach(button => {
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.filter === currentFilter)
    );
  });
}

form.addEventListener("submit", event => {
  event.preventDefault();

  const title = input.value.trim();

  if (!title) {
    input.setCustomValidity("Please enter a task.");
    input.reportValidity();
    return;
  }

  tasks.unshift({
    id: makeId(),
    title,
    completed: false
  });

  editingId = null;
  currentFilter = "all";
  input.value = "";

  saveTasks();
  render();
  input.focus();
});

input.addEventListener("input", () => {
  input.setCustomValidity("");
});

filters.forEach(button => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    editingId = null;
    render();
  });
});

clearButton.addEventListener("click", () => {
  tasks = tasks.filter(task => !task.completed);
  editingId = null;
  saveTasks();
  render();
  input.focus();
});

render();