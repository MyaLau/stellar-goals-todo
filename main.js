
let todoList = [];

// Declare the array first
// This stores all tasks as an array.Each task is an object with two properties: { text: "My Task", completed: false }



// Load tasks from localStorage when the page loads
document.addEventListener("DOMContentLoaded", function () {
    let savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
        todoList = JSON.parse(savedTasks); // Convert back to array

        // Loop through saved tasks and display them
        todoList.forEach(task => {
            addTaskToDOM(task.text, task.completed);
        });
    }
});

const addTask = document.getElementById("addTask");

// Add event listener for the "Add Task" button
addTask.addEventListener("click", addTodoItem);

function addTodoItem() {
    let item = document.getElementById("todoInput").value.trim();

    if (item === "") {
        alert("Task cannot be empty!");
        return;
    }

    todoList.push({ text: item, completed: false });
    localStorage.setItem("tasks", JSON.stringify(todoList));

    addTaskToDOM(item, false); // Display the new task in the UI

    document.getElementById("todoInput").value = ""; // Clear input field
}

function addTaskToDOM(itemText, isCompleted) {
    let list = document.getElementById("todoList");
    let listItem = document.createElement("div");
    listItem.className = "todoItem";

    // Create a label for the custom checkbox
let checkboxLabel = document.createElement("label");
checkboxLabel.classList.add("custom-checkbox");

// Create the checkbox (hidden)
let checkbox = document.createElement("input");
checkbox.type = "checkbox";
checkbox.checked = isCompleted;

// Create Font Awesome icons for unchecked & checked states
let uncheckedIcon = document.createElement("i");
uncheckedIcon.classList.add("fas", "fa-shuttle-space", "unchecked"); // Change icon if desired

let checkedIcon = document.createElement("i");
checkedIcon.classList.add("fas", "fa-shuttle-space", "checked");
checkedIcon.style.display = isCompleted ? "inline-block" : "none"; // Show only if completed

// Append everything to the label
checkboxLabel.appendChild(checkbox);
checkboxLabel.appendChild(uncheckedIcon);
checkboxLabel.appendChild(checkedIcon);

// Create task text
let itemTextElement = document.createElement("span");
itemTextElement.textContent = itemText;

// Apply strikethrough if completed
if (isCompleted) {
    itemTextElement.style.textDecoration = "line-through";
    listItem.classList.add("checked");
}

// Handle checkbox toggle
checkbox.onclick = function () {
    let index = todoList.findIndex(task => task.text === itemText);
    if (index !== -1) {
        todoList[index].completed = checkbox.checked;
        localStorage.setItem("tasks", JSON.stringify(todoList));
    }

    if (checkbox.checked) {
        itemTextElement.style.textDecoration = "line-through";
        listItem.classList.add("checked");

        uncheckedIcon.style.display = "none"; // Hide unchecked icon
        checkedIcon.style.display = "inline-block"; // Show checked icon
    } else {
        itemTextElement.style.textDecoration = "none";
        listItem.classList.remove("checked");

        uncheckedIcon.style.display = "inline-block"; // Show unchecked icon
        checkedIcon.style.display = "none"; // Hide checked icon
    }
};

// Append to the list item
listItem.appendChild(checkboxLabel);
listItem.appendChild(itemTextElement);




    // Buttons container
    let buttonsDiv = document.createElement("div");
    buttonsDiv.className = "buttons";

    // Edit button
    let editButton = document.createElement("button");
    editButton.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>';
    editButton.onclick = function () {
        itemTextElement.contentEditable = true;
        itemTextElement.focus();

        // Move cursor to the end
        let range = document.createRange();
        let selection = window.getSelection();
        range.selectNodeContents(itemTextElement);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
    };

    // Save updated text on blur
    itemTextElement.onblur = function () {
        itemTextElement.contentEditable = false;
        let index = todoList.findIndex(task => task.text === itemText);
        if (index !== -1) {
            todoList[index].text = itemTextElement.textContent; // Update text
            localStorage.setItem("tasks", JSON.stringify(todoList)); // Save updated tasks
        }
    };
    buttonsDiv.appendChild(editButton);

    // Delete button
    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    deleteButton.onclick = function () {
        list.removeChild(listItem);
        let index = todoList.findIndex(task => task.text === itemText);
        if (index !== -1) {
            todoList.splice(index, 1); // Remove task from array
            localStorage.setItem("tasks", JSON.stringify(todoList)); // Update localStorage
        }
    };
    buttonsDiv.appendChild(deleteButton);

    // Add buttons to task
    listItem.appendChild(buttonsDiv);
    list.appendChild(listItem);
}