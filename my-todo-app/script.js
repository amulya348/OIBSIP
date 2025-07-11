document.addEventListener('DOMContentLoaded', () => {
    const taskTitleInput = document.getElementById('taskTitle');
    const taskDescriptionInput = document.getElementById('taskDescription');
    const saveTaskBtn = document.getElementById('saveTaskBtn');
    const pendingTaskList = document.getElementById('pendingTaskList');
    const completedTaskList = document.getElementById('completedTaskList');
    const tabButtons = document.querySelectorAll('.tab-btn');

    let tasks = loadTasks(); // Load tasks from local storage

    // Initial render of tasks
    renderTasks();

    // Event listener for adding a new task
    saveTaskBtn.addEventListener('click', () => {
        const title = taskTitleInput.value.trim();
        const description = taskDescriptionInput.value.trim();

        if (title) {
            const newTask = {
                id: Date.now(), // Unique ID for the task
                title: title,
                description: description,
                completed: false,
                timestamp: new Date().toLocaleString()
            };
            tasks.push(newTask);
            saveTasks();
            renderTasks(); // Re-render all tasks
            taskTitleInput.value = ''; // Clear input fields
            taskDescriptionInput.value = '';
        } else {
            // Optional: Add a more user-friendly validation message here
            alert('Task title cannot be empty!');
        }
    });

    // Event listener for task actions (complete/delete) using event delegation
    // We attach listeners to the ULs because LIs are added dynamically
    pendingTaskList.addEventListener('click', handleTaskActions);
    completedTaskList.addEventListener('click', handleTaskActions);

    function handleTaskActions(event) {
        const target = event.target;
        // Find the closest parent <li> with class 'task-item'
        const listItem = target.closest('.task-item');

        if (!listItem) return; // If click wasn't on a task item or its children

        const taskId = parseInt(listItem.dataset.id); // Get task ID from data-id attribute

        if (target.classList.contains('btn-complete') || target.closest('.btn-complete')) {
            toggleTaskCompletion(taskId);
        } else if (target.classList.contains('btn-delete') || target.closest('.btn-delete')) {
            deleteTask(taskId);
        }
    }

    // Event listeners for tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;

            // Remove active class from all tabs and add to clicked one
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Hide all task lists and show the active one
            document.querySelectorAll('.task-list').forEach(list => list.classList.remove('active-list'));
            document.getElementById(`${targetTab}TaskList`).classList.add('active-list');
        });
    });

    // Function to render/re-render all tasks
    function renderTasks() {
        pendingTaskList.innerHTML = ''; // Clear current lists
        completedTaskList.innerHTML = '';

        // Add empty messages first, then populate if tasks exist
        pendingTaskList.innerHTML = '<li class="empty-message" style="display:none;">No pending tasks! Add a new one.</li>';
        completedTaskList.innerHTML = '<li class="empty-message" style="display:none;">No completed tasks yet.</li>';


        let hasPendingTasks = false;
        let hasCompletedTasks = false;

        tasks.forEach(task => {
            const listItem = document.createElement('li');
            listItem.classList.add('task-item');
            listItem.dataset.id = task.id; // Store ID on the element

            let actionsHtml = `
                <button class="btn btn-delete" title="Delete Task"><i class="fas fa-trash-alt"></i></button>
            `;
            let completedClass = '';

            if (task.completed) {
                completedClass = 'completed';
                hasCompletedTasks = true;
                // For completed tasks, we don't include the 'complete' button, only delete
            } else {
                hasPendingTasks = true;
                actionsHtml = `
                    <button class="btn btn-complete" title="Mark Complete"><i class="fas fa-check"></i></button>
                    ${actionsHtml} `;
            }

            // FIX: Only add the class if 'completedClass' is not an empty string
            if (completedClass) {
                listItem.classList.add(completedClass);
            }

            listItem.innerHTML = `
                <span class="task-details">
                    <span class="task-title">${task.title}</span>
                    <span class="task-description">${task.description}</span>
                </span>
                <div class="task-actions">
                    ${actionsHtml}
                </div>
            `;

            if (task.completed) {
                completedTaskList.appendChild(listItem);
            } else {
                pendingTaskList.appendChild(listItem);
            }
        });

        // Show/hide empty messages based on whether tasks were added
        if (!hasPendingTasks) {
            pendingTaskList.querySelector('.empty-message').style.display = 'block';
        }
        if (!hasCompletedTasks) {
            completedTaskList.querySelector('.empty-message').style.display = 'block';
        }
    }

    // Function to toggle task completion status
    function toggleTaskCompletion(id) {
        tasks = tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        saveTasks();
        renderTasks();
    }

    // Function to delete a task
    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    }

    // Local Storage Functions
    function saveTasks() {
        localStorage.setItem('todoTasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const storedTasks = localStorage.getItem('todoTasks');
        try {
            return storedTasks ? JSON.parse(storedTasks) : [];
        } catch (e) {
            console.error("Error parsing tasks from localStorage:", e);
            localStorage.removeItem('todoTasks'); // Clear bad data
            return [];
        }
    }
});