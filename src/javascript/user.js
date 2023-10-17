document.addEventListener('DOMContentLoaded', function () {
    const loggedInUser = localStorage.getItem('loggedInUser');
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    const logoutButton = document.getElementById('logout-button');

    if (!loggedInUser) {
        alert('Você precisa fazer login para acessar esta área!');
        window.location.href = 'login.html';
    }

    // Adição de um evento 'clique' no botão de logout
    logoutButton.addEventListener('click', function () {
        localStorage.removeItem('loggedInUser');
        window.location.href = '../../index.html'; 
        // Redirecione para a página inicial (index.html)
    });

    // Adição de um evento 'clique' no botão de editar tarefa
    taskList.addEventListener('click', function (event) {
        if (event.target.tagName === 'BUTTON' && event.target.classList.contains('edit-button')) {
            const taskId = event.target.getAttribute('data-id');
            editTask(taskId);
        }
    });

    // Adição de um evento 'clique' no botão de salvar edição de tarefa
    taskList.addEventListener('click', function (event) {
        if (event.target.tagName === 'BUTTON' && event.target.classList.contains('save-button')) {
            const taskId = event.target.getAttribute('data-id');
            saveTask(taskId);
        }
    });

    // Adicione um evento de clique ao botão de excluir tarefa
    taskList.addEventListener('click', function (event) {
        if (event.target.tagName === 'BUTTON' && event.target.classList.contains('delete-button')) {
            const taskId = event.target.getAttribute('data-id');
            deleteTask(taskId);
        }
    });

    function editTask(taskId) {
        const userTasks = JSON.parse(localStorage.getItem(loggedInUser)) || [];
        const taskItem = userTasks[taskId];

        // Criação de elementos para editar a tarefa
        const editTaskName = document.createElement('input');
        editTaskName.value = taskItem.name;
        const editTaskDescription = document.createElement('input');
        editTaskDescription.value = taskItem.description;
        const editTaskDueDate = document.createElement('input');
        editTaskDueDate.type = 'date';
        editTaskDueDate.value = taskItem.dueDate;

        // Alteração do item da lista depois edição
        const listItem = taskList.children[taskId];
        listItem.innerHTML = '';
        listItem.appendChild(editTaskName);
        listItem.appendChild(editTaskDescription);
        listItem.appendChild(editTaskDueDate);

        // Adição de botões para salvar ou cancelar a edição
        const saveButton = document.createElement('button');
        saveButton.classList.add('save-button');
        saveButton.setAttribute('data-id', taskId);
        saveButton.textContent = 'Salvar';
        const cancelButton = document.createElement('button');
        cancelButton.classList.add('cancel-button');
        cancelButton.setAttribute('data-id', taskId);
        cancelButton.textContent = 'Cancelar';

        listItem.appendChild(saveButton);
        listItem.appendChild(cancelButton);
    }

    function saveTask(taskId) {
        const userTasks = JSON.parse(localStorage.getItem(loggedInUser)) || [];
        const listItem = taskList.children[taskId];
        const editedTaskName = listItem.querySelector('input:nth-child(1)').value;
        const editedTaskDescription = listItem.querySelector('input:nth-child(2)').value;
        const editedTaskDueDate = listItem.querySelector('input:nth-child(3)').value;

        userTasks[taskId].name = editedTaskName;
        userTasks[taskId].description = editedTaskDescription;
        userTasks[taskId].dueDate = editedTaskDueDate;

        localStorage.setItem(loggedInUser, JSON.stringify(userTasks));
        loadTasks(); // Atualiza a lista de tarefas
    }

    function deleteTask(taskId) {
        const userTasks = JSON.parse(localStorage.getItem(loggedInUser)) || [];
        userTasks.splice(taskId, 1); // Remova a tarefa pelo índice
        localStorage.setItem(loggedInUser, JSON.stringify(userTasks));
        loadTasks(); // Atualiza a lista de tarefas
    }

    function clearTaskForm() {
        document.getElementById('task-name').value = '';
        document.getElementById('task-description').value = '';
        document.getElementById('task-due-date').value = '';
    }

    function loadTasks() {
        taskList.innerHTML = ''; // Limpa a lista de tarefas
        const userTasks = JSON.parse(localStorage.getItem(loggedInUser)) || [];

        // Ordena as tarefas por prazo
        userTasks.sort((a, b) => (a.dueDate > b.dueDate) ? 1 : -1);

        userTasks.forEach((task, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <strong>Nome:</strong> ${task.name}<br>
                <strong>Descrição:</strong> ${task.description}<br>
                <strong>Prazo:</strong> ${task.dueDate}<br>
                <button data-id="${index}" class="edit-button">Editar</button>
                <button data-id="${index}" class="delete-button">Excluir</button>
            `;
            taskList.appendChild(listItem);
        });
    }

    taskForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const taskName = document.getElementById('task-name').value;
        const taskDescription = document.getElementById('task-description').value;
        const taskDueDate = document.getElementById('task-due-date').value;

        if (!taskName || !taskDueDate) {
            alert('Nome da Tarefa e Prazo são campos obrigatórios!');
            return;
        }

        const userTasks = JSON.parse(localStorage.getItem(loggedInUser)) || [];
        const newTask = {
            name: taskName,
            description: taskDescription,
            dueDate: taskDueDate,
        };
        userTasks.push(newTask);
        localStorage.setItem(loggedInUser, JSON.stringify(userTasks));

        clearTaskForm();
        loadTasks();
    });

    loadTasks(); // Carregua as tarefas iniciais
});
