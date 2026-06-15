// Configuration API
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3001/api' 
    : 'https://votre-backend.onrender.com/api';
app.use(express.static('.')); // Sert les fichiers HTML/CSS/JS

let currentUserId = null;

// Récupérer ou créer un utilisateur
async function getOrCreateUser(email) {
    const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    });
    const user = await response.json();
    currentUserId = user.id;
    localStorage.setItem('userId', currentUserId);
    localStorage.setItem('userEmail', email);
    return user;
}

// Récupérer les revenus
async function fetchIncomes(userId, month, year) {
    const response = await fetch(`${API_URL}/incomes/${userId}/${month}/${year}`);
    return await response.json();
}

// Sauvegarder les revenus
async function saveIncomes(userId, monthlySalary, miniJob, month, year) {
    const response = await fetch(`${API_URL}/incomes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, monthly_salary: monthlySalary, mini_job: miniJob, month, year })
    });
    return await response.json();
}

// Récupérer les dépenses
async function fetchExpenses(userId, month, year) {
    const url = month && year ? `${API_URL}/expenses/${userId}?month=${month}&year=${year}` : `${API_URL}/expenses/${userId}`;
    const response = await fetch(url);
    return await response.json();
}

// Ajouter une dépense
async function addExpenseAPI(userId, category, name, amount, date) {
    const response = await fetch(`${API_URL}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, category, name, amount, date })
    });
    return await response.json();
}

// Supprimer une dépense
async function deleteExpenseAPI(expenseId) {
    const response = await fetch(`${API_URL}/expenses/${expenseId}`, {
        method: 'DELETE'
    });
    return await response.json();
}

// Récupérer l'objectif d'épargne
async function fetchSavingsGoal(userId, month, year) {
    const response = await fetch(`${API_URL}/savings-goal/${userId}/${month}/${year}`);
    return await response.json();
}

// Sauvegarder l'objectif d'épargne
async function saveSavingsGoal(userId, goalAmount, month, year) {
    const response = await fetch(`${API_URL}/savings-goal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, goal_amount: goalAmount, month, year })
    });
    return await response.json();
    
}
