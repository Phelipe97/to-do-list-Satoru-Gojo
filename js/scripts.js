// Seleção de elementos
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const editForm = document.getElementById('edit-form');
const editInput = document.getElementById('edit-input');
const cancelEditBtn = document.getElementById('cancel-edit-btn');
const searchInput = document.getElementById('search-input');
const eraseBtn = document.getElementById('erase-button');
const filterBtn = document.querySelector('#filter-select');

let oldInputValue;

//Funções
const saveTodo = (text, done = 0, save = 1) => {
    const todo = document.createElement("div");
    todo.classList.add("todo");

    const todoTitle = document.createElement("h3");
    todoTitle.innerText = text;
    todo.appendChild(todoTitle);

    const doneBtn = document.createElement("button");
    doneBtn.classList.add("finish-todo");
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    todo.appendChild(doneBtn);

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-todo");
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    todo.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("remove-todo");
    deleteBtn.innerHTML = '<i class="fa-solid fa-x"></i>';
    todo.appendChild(deleteBtn);

    // Utlizando dados da localStorage

    if (done) {
        todo.classList.add("done")
    }

    if (save) {
        saveTodoLocalStorage({ text, done })
    }

    todoList.appendChild(todo);

    todoInput.value = "";
    todoInput.focus();


}

const toggleForms = () => {
    editForm.classList.toggle("hide")
    todoForm.classList.toggle("hide")
    todoList.classList.toggle("hide")
}

const updateTodo = (text) => {
    const todos = document.querySelectorAll(".todo")

    todos.forEach((todo) => {

        let todoTitle = todo.querySelector("h3")

        if (todoTitle.innerText === oldInputValue) {
            todoTitle.innerText = text

            updateTodoLocalStorage(oldInputValue,text)
        }
    })
}

const getSearchedTodos = (search) => {
    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) => {
        let todoTitle = todo.querySelector("h3").innerText.toLowerCase();

        todo.style.display = "flex";

        const normalizeSearch = search.toLowerCase()

        if (!todoTitle.includes(normalizeSearch)) {
            todo.style.display = "none";
        }
    })
}

const filterTodos = (filterValue) => {
    const todos = document.querySelectorAll(".todo");

    switch (filterValue) {
        case "all":
            todos.forEach((todo) => todo.style.display = "flex")
            break;
        case "done":
            todos.forEach((todo) => todo.classList.contains("done")
                ? todo.style.display = "flex"
                : todo.style.display = "none")
            break;
        case "todo":
            todos.forEach((todo) => !todo.classList.contains("done")
                ? todo.style.display = "flex"
                : todo.style.display = "none")
            break;
        default:
            break;
    }
}

//Eventos
todoForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const inputValue = todoInput.value;

    if (inputValue) {
        saveTodo(inputValue)
    }
});

document.addEventListener("click", (e) => {
    const targetEl = e.target;
    const parentEl = targetEl.closest("div")
    let todoTitle;

    if (parentEl && parentEl.querySelector("h3")) {
        todoTitle = parentEl.querySelector("h3").innerText;
    }

    if (targetEl.classList.contains("finish-todo")) {
        parentEl.classList.toggle("done")

        updateTodoStatusLocalStorage(todoTitle)
    }

    if (targetEl.classList.contains("edit-todo")) {
        toggleForms()

        editInput.value = todoTitle
        oldInputValue = todoTitle
    }

    if (targetEl.classList.contains("remove-todo")) {
        parentEl.remove();

        removeTodoLocalStorage(todoTitle)
    }

})

cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault()

    toggleForms()
})

editForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const editInputValue = editInput.value

    if (editInputValue) {
        updateTodo(editInputValue)
    }
    toggleForms()
})

searchInput.addEventListener("keyup", (e) => {
    const search = e.target.value

    getSearchedTodos(search);
})

eraseBtn.addEventListener("click", (e) => {
    e.preventDefault()

    searchInput.value = ""

    searchInput.dispatchEvent(new Event('keyup'))
})

filterBtn.addEventListener("change", (e) => {
    const filterValue = e.target.value

    filterTodos(filterValue)
})

//local storage
const getTodosLocalStorage = () => {
    const todos = JSON.parse(localStorage.getItem("todos")) || []

    return todos
}

const loadTodos = () => {
    const todos = getTodosLocalStorage()

    todos.forEach((todo) => {
        saveTodo(todo.text, todo.done, 0)
    })
}

const saveTodoLocalStorage = (todo) => {
    const todos = getTodosLocalStorage()

    todos.push(todo)

    localStorage.setItem("todos",JSON.stringify(todos))
}

const removeTodoLocalStorage = (todoText) =>{
    const todos = getTodosLocalStorage()

    const filteredTodos = todos.filter((todo) => todo.text !== todoText)

    localStorage.setItem("todos",JSON.stringify(filteredTodos))

}
const updateTodoStatusLocalStorage = (todoText) =>{
    const todos = getTodosLocalStorage()

    todos.map((todo) => 
        todo.text === todoText ? (todo.done = !todo.done) : null)

    localStorage.setItem("todos",JSON.stringify(todos))
}
const updateTodoLocalStorage = (todoOldText,todoNewText) =>{

    todo.text === todoOldText ? (todo.done = todoNewText) : null

    localStorage.setItem("todos",JSON.stringify(todos))

}
loadTodos()
