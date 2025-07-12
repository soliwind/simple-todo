let todoItems = JSON.parse(localStorage.getItem('todos')) || [];
const addBtn = document.getElementById('todo-addBtn');
const todoList = document.getElementById('todo-list');
const todoInput = document.getElementById('todo-input');
renderItemsInTodo(todoItems);

addBtn.addEventListener('click', () => {
    const text = todoInput.value.trim();
    if (text !== '') {
        todoInput.value = '';
        addTodoItem(text);
    }
});

todoInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const text = todoInput.value.trim();
        if (text !== '') {
            todoInput.value = '';
            addTodoItem(text);
        }
    }
})

function addTodoItem(text) {
    if(text !== '') {
        const newTodo = {
            id: Date.now(),
            content: text,
            completed: false,
        }
        todoItems.push(newTodo);
        localStorage.setItem('todos', JSON.stringify(todoItems));
        renderItemsInTodo(todoItems);
    }
    todoInput.value = '';
    todoInput.focus();
}

function renderItemsInTodo(itemArray) {
    todoList.innerHTML = '';

    itemArray.forEach(todo => {
        const todoItem = document.createElement('li');
        todoItem.textContent = todo.content;
    
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'X';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            todoItem.remove();
            todoItems = todoItems.filter(item => item.id !== todo.id);
            localStorage.setItem('todos', JSON.stringify(todoItems));
            renderItemsInTodo(todoItems);
        });

        todoList.appendChild(todoItem);
        todoItem.appendChild(deleteBtn);
    });
}