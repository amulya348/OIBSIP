document.addEventListener('DOMContentLoaded', () => {
    // Get references to HTML elements
    const registerSection = document.getElementById('register-section');
    const loginSection = document.getElementById('login-section');
    const securedSection = document.getElementById('secured-section');

    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logoutBtn');

    const showLoginLink = document.getElementById('showLogin');
    const showRegisterLink = document.getElementById('showRegister');

    const messageArea = document.getElementById('message-area');

    // --- Helper Functions ---

    // Function to display messages to the user
    function displayMessage(message, type = 'success') {
        messageArea.textContent = message;
        messageArea.className = 'message-area show ' + type; // Reset classes and add show/type
        setTimeout(() => {
            messageArea.classList.remove('show');
            messageArea.textContent = ''; // Clear message
        }, 3000); // Hide after 3 seconds
    }

    // Function to toggle between forms (register/login)
    function showSection(sectionToShow) {
        registerSection.classList.add('hidden');
        loginSection.classList.add('hidden');
        securedSection.classList.add('hidden');

        sectionToShow.classList.remove('hidden');
        sectionToShow.classList.add('active'); // Add active class for styling if needed
    }

    // Function to check if a user is "logged in" (has a stored session)
    function checkAuthStatus() {
        // In a real app, this would involve checking a token or session on the server.
        // Here, we just check if a 'loggedInUser' exists in localStorage.
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (loggedInUser) {
            showSection(securedSection);
            displayMessage(`Welcome back, ${loggedInUser}!`, 'success');
        } else {
            showSection(loginSection); // Default to login if not authenticated
        }
    }

    // --- Event Listeners ---

    // Initial check on page load
    checkAuthStatus();

    // Show Login form link handler
    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(loginSection);
    });

    // Show Register form link handler
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(registerSection);
    });

    // Register Form Submission
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent default form submission

        const username = document.getElementById('regUsername').value.trim();
        const password = document.getElementById('regPassword').value.trim();

        if (!username || !password) {
            displayMessage('Username and password cannot be empty.', 'error');
            return;
        }

        // In a real app: Send data to backend to create user in database
        // For this demo: Store user in localStorage
        let users = JSON.parse(localStorage.getItem('users')) || {};

        if (users[username]) {
            displayMessage('Username already exists. Please choose another.', 'error');
            return;
        }

        users[username] = password; // Store username and password (insecurely for demo)
        localStorage.setItem('users', JSON.stringify(users));

        displayMessage('Registration successful! Please log in.', 'success');
        registerForm.reset(); // Clear form fields
        showSection(loginSection); // Redirect to login form
    });

    // Login Form Submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent default form submission

        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value.trim();

        if (!username || !password) {
            displayMessage('Please enter both username and password.', 'error');
            return;
        }

        // In a real app: Send credentials to backend for verification
        // For this demo: Check against stored users in localStorage
        let users = JSON.parse(localStorage.getItem('users')) || {};

        if (users[username] && users[username] === password) {
            // Successful login
            localStorage.setItem('loggedInUser', username); // Store session (insecurely for demo)
            displayMessage(`Login successful! Welcome, ${username}.`, 'success');
            loginForm.reset(); // Clear form fields
            showSection(securedSection); // Show secured content
        } else {
            displayMessage('Invalid username or password.', 'error');
        }
    });

    // Logout Button
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('loggedInUser'); // Clear session
        displayMessage('You have been logged out.', 'success');
        showSection(loginSection); // Go back to login form
    });
});