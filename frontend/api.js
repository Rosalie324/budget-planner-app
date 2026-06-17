// Configuration API
// 🔴 CHANGEZ cette URL par la vôtre si ce n'est pas déjà fait
const API_URL = 'https://budget-planner-app-5run.onrender.com/api';

let currentUserId = null;

// Récupérer ou créer un utilisateur
async function getOrCreateUser(email) {
    try {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const user = await response.json();
        currentUserId = user.id;
        localStorage.setItem('userId', currentUserId);
        localStorage.setItem('userEmail', email);
        return user;
    } catch (error) {
        console.error('Erreur utilisateur:', error);
        alert('Erreur de connexion. Vérifiez que le backend est en ligne.');
        throw error;
    }
}

// Récupérer les revenus
async function fetchIncomes(userId, month, year) {
    try {
        const response = await fetch(`${API_URL}/incomes/${userId}/${month}/${year}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Erreur chargement revenus:', error);
        return { monthly_salary: 0, mini_job: 0 };
    }
}

// Sauvegarder les revenus
async function saveIncomes(userId, monthlySalary, miniJob, month, year) {
    try {
        const response = await fetch(`${API_URL}/incomes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                user_id: userId, 
                monthly_salary: monthlySalary, 
                mini_job: miniJob, 
                month, 
                year 
            })
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Erreur sauvegarde revenus:', error);
        throw error;
    }
}

// Récupérer les dépenses
async function fetchExpenses(userId, month, year) {
    try {
        let url = `${API_URL}/expenses/${userId}`;
        if (month !== undefined && year !== undefined) {
            url += `?month=${month}&year=${year}`;
        }
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Erreur chargement dépenses:', error);
        return [];
    }
}

// Ajouter une dépense
async function addExpenseAPI(userId, category, name, amount, date) {
    try {
        const response = await fetch(`${API_URL}/expenses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, category, name, amount, date })
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Erreur ajout dépense:', error);
        throw error;
    }
}

// Supprimer une dépense
async function deleteExpenseAPI(expenseId) {
    try {
        const response = await fetch(`${API_URL}/expenses/${expenseId}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Erreur suppression dépense:', error);
        throw error;
    }
}

// Récupérer l'objectif d'épargne
async function fetchSavingsGoal(userId, month, year) {
    try {
        const response = await fetch(`${API_URL}/savings-goal/${userId}/${month}/${year}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Erreur chargement objectif:', error);
        return { goal_amount: 0 };
    }
}

// Sauvegarder l'objectif d'épargne
async function saveSavingsGoal(userId, goalAmount, month, year) {
    try {
        const response = await fetch(`${API_URL}/savings-goal`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, goal_amount: goalAmount, month, year })
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Erreur sauvegarde objectif:', error);
        throw error;
    }
}
