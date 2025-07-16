let todoItems = JSON.parse(localStorage.getItem('todos')) || [];
const addBtn = document.getElementById('todo-addBtn');
const todoList = document.getElementById('todo-list');
const todoInput = document.getElementById('todo-input');
let isInputActive = false;
renderItemsInTodo(todoItems, todoList);

addBtn.addEventListener('click', () => {
    const text = todoInput.value.trim();
    if (text !== '' && !isInputActive) {
        isInputActive = true;
        todoInput.value = '';
        addTodoItem(text);
        isInputActive = false;
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
    if (text !== '') {
        const newTodo = {
            id: Date.now(),
            content: text,
            completed: false,
            subTodos: [],
            depth: 0
        }
        todoItems.push(newTodo);
        localStorage.setItem('todos', JSON.stringify(todoItems));
        renderItemsInTodo(todoItems, todoList);
    }
    todoInput.value = '';
}

function addSubTodoItem(parentElement, text) {
    if (text !== '') {
        const newTodo = {
            id: Date.now(),
            content: text,
            completed: false,
            subTodos: [],
            depth: parentElement.depth + 1
        }
        parentElement.subTodos.push(newTodo);
    }
}

function renderItemsInTodo(itemArray, parentElement) {
    if (parentElement == todoList) {
        parentElement.innerHTML = '';
    }
    itemArray.forEach(todo => {
        const todoItem = document.createElement('li');
        todoItem.textContent = todo.content;
        if(todo.completed === true) {
            todoItem.classList.add('completed');
        }

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'X';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if(isInputActive) {
                return;
            }
            todoItem.remove();
            const index = itemArray.findIndex(item => item.id === todo.id)
            if (index > -1) {
                itemArray.splice(index, 1);
            }
            localStorage.setItem('todos', JSON.stringify(todoItems));
            renderItemsInTodo(todoItems, todoList);
        });

        const completeBtn = document.createElement('button');
        completeBtn.textContent = '✓';
        completeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if(isInputActive) {
                return;
            }
            todo.completed = !todo.completed;
            localStorage.setItem('todos', JSON.stringify(todoItems));
            renderItemsInTodo(todoItems, todoList);
        });
        
        const addSubBtn = document.createElement('button');
        addSubBtn.textContent = '+';
        addSubBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if(isInputActive) {
                return;
            }
            isInputActive = true;
            const temInput = document.createElement('input');
            const temBtn = document.createElement('button');
            temInput.placeholder = "세부 목표를 입력하세요."
            temBtn.textContent = "추가"
            parentElement.appendChild(temInput);
            parentElement.appendChild(temBtn);
            temInput.focus();
            temBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const text = temInput.value.trim();
                if(text === '') {
                    return;
                }
                addSubTodoItem(todo, text);
                temInput.remove();
                localStorage.setItem('todos', JSON.stringify(todoItems));
                renderItemsInTodo(todoItems, todoList);
                isInputActive = false;
                temBtn.remove();
            })
            temInput.addEventListener('keydown', (e) => {
                if(e.key === 'Enter'){
                    e.stopPropagation();
                    const text = temInput.value.trim();
                    if(text === '') {
                        return;
                    }
                    addSubTodoItem(todo, text);
                    temInput.remove();
                    localStorage.setItem('todos', JSON.stringify(todoItems));
                    renderItemsInTodo(todoItems, todoList);
                    isInputActive = false;
                    temBtn.remove();
                }
            })
        });

        parentElement.appendChild(todoItem);
        todoItem.appendChild(deleteBtn);
        todoItem.appendChild(completeBtn);
        todoItem.appendChild(addSubBtn);
        if(todo.subTodos.length > 0) {
            renderItemsInTodo(todo.subTodos, todoItem);
        }
        if(todo.depth != 0) {
            todoItem.style.marginLeft = `${20}px`;
        }
    });
}