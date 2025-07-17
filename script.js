let todoItems = JSON.parse(localStorage.getItem('todos')) || [];
const addBtn = document.getElementById('todo-addBtn');
const todoList = document.getElementById('todo-list');
const todoInput = document.getElementById('todo-input');
let isInputActive = false;
const tab = 30;
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
        const itemContainer = document.createElement('div');
        itemContainer.classList.add('item-container');

        const todoItem = document.createElement('li');
        todoItem.textContent = todo.content;
        if(todo.completed === true) {
            todoItem.classList.add('completed');
        }

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'X';
        deleteBtn.classList.add('button-gray');
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
        completeBtn.classList.add('button-gray');
        completeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if(isInputActive) {
                return;
            }
            if(todo.depth == 0 || !isRealParentCompleted(todoItem))
            {
                propagateCompleted(todo, !todo.completed);
                localStorage.setItem('todos', JSON.stringify(todoItems));
                renderItemsInTodo(todoItems, todoList);
            }
        });
        
        const addSubBtn = document.createElement('button');
        addSubBtn.textContent = '+';
        addSubBtn.classList.add('button-light-blue');
        addSubBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if(isInputActive) {
                return;
            }
            isInputActive = true;
            const temInput = document.createElement('input');
            const temBtn = document.createElement('button');
            const temCancelBtn = document.createElement('button');
            const inputContainer = document.createElement('div');
            temInput.placeholder = "세부 목표를 입력하세요.";
            temBtn.textContent = "추가";
            temCancelBtn.textContent = "취소";
            temInput.id = 'tem-input';
            temBtn.id = 'tem-addBtn';
            temCancelBtn.id = 'tem-cancelBtn';
            inputContainer.id = 'tem-container'
            temBtn.classList.add('button-blue');
            temCancelBtn.classList.add('button-gray');
            parentElement.insertBefore(inputContainer, itemContainer.nextSibling.nextSibling);
            inputContainer.appendChild(temInput);
            inputContainer.appendChild(temBtn);
            inputContainer.appendChild(temCancelBtn);
            inputContainer.style.marginLeft = `${tab}px`;
            temInput.focus();
            temCancelBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                temBtn.remove();
                temInput.remove();
                isInputActive = false;
                temCancelBtn.remove();
            });
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
            });
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
            });
        });

        parentElement.appendChild(itemContainer);
        itemContainer.appendChild(todoItem);
        const subTodoList = document.createElement("ul");
        buttonContainer.appendChild(deleteBtn);
        buttonContainer.appendChild(completeBtn);
        buttonContainer.appendChild(addSubBtn);
        itemContainer.appendChild(buttonContainer);
        parentElement.appendChild(subTodoList);
        if(todo.completed == true){
            const buttons = Array.from(buttonContainer.children);
            buttons.forEach(btn => {
                btn.classList.add('completed-button');
            });
        }
        if(todo.subTodos.length > 0) {
            renderItemsInTodo(todo.subTodos, subTodoList);
        }
        { //if(todo.depth != 0) 
            subTodoList.style.marginLeft = `${tab}px`;
        }
    });
}

function propagateCompleted(todo, state) {
    todo.completed = state;
    todo.subTodos.forEach(subTodo => {
        propagateCompleted(subTodo, state);
    })
}

function isRealParentCompleted(element) {
    const realParent = element.parentElement.parentElement.previousSibling.firstChild;
    //alert(realParent.classList.contains('completed'));
    return realParent.classList.contains('completed');
}