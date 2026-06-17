let monthlySalary = 0;
let miniJob = 0;
let expenses = [];
let savingsGoal = 0;
let expenseChart = null;
let yearProgressChart = null;

// Variables pour la navigation mensuelle
let currentViewDate = new Date();
let isViewingHistory = false;
let currentUserId = null;

// Palette de couleurs pastel
const pastelColors = [
    '#FFB7B2', '#FFD6A5', '#FDFFB6', '#CAFFBF', '#9BF6FF',
    '#A0C4FF', '#BDB2FF', '#FFC6FF', '#C4E3CB', '#FFD1BA',
    '#E0BBE4', '#FEC8D8', '#FFF5BA', '#B5EAD7', '#C7CEEA'
];

// Catégories
const categories = {
    'transport-gas': { name: 'Gas', icon: '⛽' },
    'transport-insurance': { name: 'Car Insurance', icon: '🚗' },
    'transport-carwash': { name: 'Car Wash', icon: '🧼' },
    'transport-parking': { name: 'Parking', icon: '🅿️' },
    'transport-taxes': { name: 'Taxes', icon: '📄' },
    'transport-repair': { name: 'Repair', icon: '🔧' },
    'sub-youtube': { name: 'Youtube', icon: '🎬' },
    'sub-icloud': { name: 'Icloud', icon: '☁️' },
    'sub-snapchat': { name: 'Snapchat', icon: '👻' },
    'sub-notability': { name: 'Notability', icon: '📝' },
    'health-insurance': { name: 'Health Insurance', icon: '🏥' },
    'health-prescription': { name: 'Prescription', icon: '💊' },
    'shopping-clothes': { name: 'Clothes', icon: '👗' },
    'shopping-shoes': { name: 'Shoes', icon: '👠' },
    'shopping-makeup': { name: 'Makeup', icon: '💄' },
    'shopping-books': { name: 'Books', icon: '📚' },
    'shopping-shithappens': { name: 'Shit happens', icon: '🤷🏽‍♀️' },
    'rec-gym': { name: 'Gym', icon: '💪' },
    'rec-gymoutfit': { name: 'Gym outfit', icon: '🎽' },
    'daily-groceries': { name: 'Groceries', icon: '🛒' },
    'daily-dining': { name: 'Dinning out', icon: '🍽️' },
    'daily-bougie': { name: 'Felt bougie', icon: '✨' },
    'resp-car': { name: 'Car payment', icon: '🚙' },
    'resp-phone': { name: 'Phone bill', icon: '📱' },
    'resp-rent': { name: 'Rent', icon: '🏠' },
    'resp-debt': { name: 'Debt', icon: '💳' },
    'resp-housebill': { name: 'House bill', icon: '💡' }
};

// ============ FUNCTIONS ============

function updatePreviewAmount() {
    const previewSpan = document.getElementById('previewAmount');
    if (previewSpan) {
        previewSpan.textContent = savingsGoal.toFixed(2) + ' €';
    }
}

function getTotalIncome() {
    return monthlySalary + miniJob;
}

function getTotalExpenses() {
    return expenses.reduce((sum, exp) => sum + exp.amount, 0);
}

function getActualSavings() {
    return getTotalIncome() - getTotalExpenses();
}

function getLeftToSpend() {
    const income = getTotalIncome();
    const expensesTotal = getTotalExpenses();
    return Math.max(0, income - expensesTotal - savingsGoal);
}

// Mettre à jour l'affichage
function updateDashboard() {
    const totalIncome = getTotalIncome();
    const totalExpenses = getTotalExpenses();
    const actualSavings = getActualSavings();
    const leftToSpend = getLeftToSpend();
    
    document.getElementById('totalIncomeDisplay').textContent = totalIncome.toFixed(2) + ' €';
    document.getElementById('totalExpensesDisplay').textContent = totalExpenses.toFixed(2) + ' €';
    document.getElementById('savingsGoalDisplay').textContent = savingsGoal.toFixed(2) + ' €';
    document.getElementById('actualSavingsDisplay').textContent = actualSavings.toFixed(2) + ' €';
    document.getElementById('leftDisplay').textContent = leftToSpend.toFixed(2) + ' €';
    
    // Progression épargne
    if (savingsGoal > 0) {
        const progress = Math.min(100, Math.max(0, (actualSavings / savingsGoal) * 100));
        if (progress >= 100) {
            document.getElementById('savingsProgress').innerHTML = '🎉 Objectif atteint ! 🎉';
            document.getElementById('savingsProgress').style.color = '#4CAF50';
        } else {
            document.getElementById('savingsProgress').innerHTML = `📈 ${progress.toFixed(1)}% de l'objectif`;
            document.getElementById('savingsProgress').style.color = '#B5DAF9';
        }
    } else {
        document.getElementById('savingsProgress').innerHTML = '💰 Fixe un objectif !';
        document.getElementById('savingsProgress').style.color = '#B5DAF9';
    }
    
    // Avertissement
    const leftWarning = document.getElementById('leftWarning');
    if (leftToSpend < 0) {
        leftWarning.innerHTML = '⚠️ Budget dépassé ! ⚠️';
        leftWarning.style.color = '#FFB7B2';
    } else if (leftToSpend < 50) {
        leftWarning.innerHTML = '🍀 Fais attention !';
        leftWarning.style.color = '#FFD6A5';
    } else {
        leftWarning.innerHTML = '✨ Tu gères bien ! ✨';
        leftWarning.style.color = '#B5DAF9';
    }
    
    updateMotivationMessage(actualSavings, savingsGoal, leftToSpend);
}

function updateMotivationMessage(actualSavings, savingsGoal, leftToSpend) {
    const messageDiv = document.getElementById('motivationMessage');
    let message = '';
    
    if (savingsGoal > 0 && actualSavings >= savingsGoal) {
        message = '🎉✨ OBJECTIF D\'ÉPARGNE ATTEINT ! Tu es une star ! Continue à faire des BAGS ! ✨🎉';
    } else if (savingsGoal > 0 && actualSavings > 0) {
        const remaining = savingsGoal - actualSavings;
        message = `💪💵 Bravo ! Il te reste ${remaining.toFixed(2)} € à économiser pour atteindre ton objectif. Tu peux le faire ! 💵💪`;
    } else if (leftToSpend > 200) {
        message = '💰✨ Tu as de la marge ! Pense à ton objectif d\'épargne pour faire encore plus de BAGS ! ✨💰';
    } else if (leftToSpend > 0) {
        message = '🍀💰 Tout va bien ! Continue comme ça et n\'oublie pas ton épargne ! 💰🍀';
    } else if (leftToSpend === 0) {
        message = '⚖️💵 Budget équilibré ! Parfait pour atteindre tes objectifs ! 💵⚖️';
    } else {
        message = '⚠️💰 Attention ! Réduis tes dépenses pour protéger ton épargne ! 💰⚠️';
    }
    
    messageDiv.textContent = message;
}

function displayExpenses() {
    const container = document.getElementById('expensesList');
    const sorted = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (sorted.length === 0) {
        container.innerHTML = '<div class="empty-state">💵 Pas encore de dépenses pour ce mois ! 💵</div>';
        return;
    }
    
    container.innerHTML = sorted.map(exp => {
        const catInfo = categories[exp.category];
        const catDisplay = catInfo ? `${catInfo.icon} ${catInfo.name}` : exp.category;
        
        return `
            <div class="expense-item">
                <div class="expense-info">
                    <div class="expense-name">${escapeHtml(exp.name)}</div>
                    <div class="expense-category">${catDisplay}</div>
                    <div class="expense-date">${formatDate(exp.date)}</div>
                </div>
                <div class="expense-amount">${exp.amount.toFixed(2)} €</div>
                ${!isViewingHistory ? `<button class="delete-expense" onclick="deleteExpense('${exp.id}')">🗑️</button>` : ''}
            </div>
        `;
    }).join('');
}

function updateChartForExpenses(expensesData) {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    
    const categoryTotals = {};
    let colorIndex = 0;
    
    expensesData.forEach(expense => {
        const catInfo = categories[expense.category];
        const displayName = catInfo ? `${catInfo.icon} ${catInfo.name}` : expense.category;
        
        if (!categoryTotals[displayName]) {
            categoryTotals[displayName] = {
                total: 0,
                color: pastelColors[colorIndex % pastelColors.length]
            };
            colorIndex++;
        }
        categoryTotals[displayName].total += expense.amount;
    });
    
    const labels = Object.keys(categoryTotals);
    const data = labels.map(l => categoryTotals[l].total);
    const colors = labels.map(l => categoryTotals[l].color);
    
    if (expenseChart) {
        expenseChart.destroy();
    }
    
    if (data.length > 0 && data.some(d => d > 0)) {
        expenseChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors,
                    borderWidth: 0,
                    hoverOffset: 15
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.raw / total) * 100).toFixed(1);
                                return `${context.label}: ${context.raw.toFixed(2)} € (${percentage}%)`;
                            }
                        }
                    }
                },
                cutout: '60%'
            }
        });
        updateLegend(categoryTotals);
    } else {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.font = '16px Quicksand';
        ctx.fillStyle = '#FBB1D3';
        ctx.textAlign = 'center';
        ctx.fillText('💰 Ajoute des dépenses pour voir ton camembert 💰', ctx.canvas.width/2, ctx.canvas.height/2);
        document.getElementById('chartLegend').innerHTML = '<div style="text-align:center; color:#B5DAF9;">💵 Pas encore de dépenses 💵</div>';
    }
}

function updateLegend(categoryTotals) {
    const legendDiv = document.getElementById('chartLegend');
    const total = Object.values(categoryTotals).reduce((sum, cat) => sum + cat.total, 0);
    
    if (total === 0) {
        legendDiv.innerHTML = '<div style="text-align:center; color:#B5DAF9;">💵 Ajoute des dépenses 💵</div>';
        return;
    }
    
    legendDiv.innerHTML = Object.entries(categoryTotals).map(([name, data]) => {
        const percent = ((data.total / total) * 100).toFixed(1);
        return `
            <div class="legend-item">
                <div class="legend-color" style="background: ${data.color}"></div>
                <span>${name}</span>
                <span style="font-weight:600;">${percent}%</span>
            </div>
        `;
    }).join('');
}

async function updateYearProgressChart() {
    const currentYear = new Date().getFullYear();
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    const monthlyTotals = [];
    const monthlyIncomes = [];
    const monthlySavings = [];
    
    for (let i = 1; i <= 12; i++) {
        const expensesData = await fetchExpenses(currentUserId, i, currentYear);
        const monthTotal = expensesData.reduce((sum, exp) => sum + exp.amount, 0);
        const incomesData = await fetchIncomes(currentUserId, i, currentYear);
        const monthIncome = (incomesData.monthly_salary || 0) + (incomesData.mini_job || 0);
        
        monthlyTotals.push(monthTotal);
        monthlyIncomes.push(monthIncome);
        monthlySavings.push(monthIncome - monthTotal);
    }
    
    const ctx = document.getElementById('yearProgressChart').getContext('2d');
    
    if (yearProgressChart) {
        yearProgressChart.destroy();
    }
    
    yearProgressChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'Dépenses',
                    data: monthlyTotals,
                    backgroundColor: '#FBB1D3',
                    borderRadius: 10,
                    borderSkipped: false
                },
                {
                    label: 'Revenus',
                    data: monthlyIncomes,
                    backgroundColor: '#B5DAF9',
                    borderRadius: 10,
                    borderSkipped: false
                },
                {
                    label: 'Épargne',
                    data: monthlySavings,
                    backgroundColor: '#CAFFBF',
                    borderRadius: 10,
                    borderSkipped: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: { family: 'Quicksand', size: 12 },
                        usePointStyle: true,
                        boxWidth: 10
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.raw.toFixed(2)} €`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: '#FED8EC' },
                    ticks: { callback: (v) => v + ' €' }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
    
    const totalYearExpenses = monthlyTotals.reduce((a, b) => a + b, 0);
    const totalYearIncome = monthlyIncomes.reduce((a, b) => a + b, 0);
    const totalYearSavings = totalYearIncome - totalYearExpenses;
    const avgMonthlyExpense = totalYearExpenses / 12;
    
    document.getElementById('yearStats').innerHTML = `
        <div class="year-stat-card">
            <div class="stat-label">📊 Total dépenses annuelles</div>
            <div class="stat-number">${totalYearExpenses.toFixed(2)} €</div>
        </div>
        <div class="year-stat-card">
            <div class="stat-label">💰 Total revenus annuels</div>
            <div class="stat-number">${totalYearIncome.toFixed(2)} €</div>
        </div>
        <div class="year-stat-card">
            <div class="stat-label">🐷 Épargne annuelle</div>
            <div class="stat-number">${totalYearSavings.toFixed(2)} €</div>
        </div>
        <div class="year-stat-card">
            <div class="stat-label">📈 Moyenne mensuelle</div>
            <div class="stat-number">${avgMonthlyExpense.toFixed(2)} €</div>
        </div>
    `;
}

// Mettre à jour l'affichage selon le mois sélectionné
async function updateDisplayForMonth() {
    const year = currentViewDate.getFullYear();
    const month = currentViewDate.getMonth() + 1;
    const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    
    // Afficher le chargement
    document.getElementById('expensesList').innerHTML = '<div class="loading">Chargement...</div>';
    
    // Charger les données
    await loadDataFromAPI();
    
    const monthExpenses = expenses;
    const monthTotalExpenses = getTotalExpenses();
    const monthIncome = getTotalIncome();
    const monthSavings = getActualSavings();
    const monthLeft = getLeftToSpend();
    
    // Mettre à jour l'affichage du titre
    const monthDisplay = isViewingHistory ? `${monthNames[month-1]} ${year}` : `${monthNames[month-1]} ${year} (Mois en cours)`;
    document.getElementById('currentMonthDisplay').innerHTML = `<span class="month-icon">📅</span> ${monthDisplay}`;
    
    const viewBadge = document.getElementById('viewBadge');
    if (isViewingHistory) {
        viewBadge.innerHTML = `📊 Vue: ${monthNames[month-1]} ${year}`;
        viewBadge.style.background = '#FFF1C2';
        document.getElementById('expensesSectionTitle').innerHTML = `📋 Dépenses du ${monthNames[month-1]} ${year}`;
        document.getElementById('addExpenseBtn').disabled = true;
        document.getElementById('addExpenseBtn').style.opacity = '0.5';
        document.getElementById('addExpenseBtn').style.cursor = 'not-allowed';
    } else {
        viewBadge.innerHTML = `📊 Vue: Mois en cours - ${monthNames[month-1]} ${year}`;
        viewBadge.style.background = 'rgba(255, 255, 255, 0.9)';
        document.getElementById('expensesSectionTitle').innerHTML = `📝 Ajouter une dépense 📝`;
        document.getElementById('addExpenseBtn').disabled = false;
        document.getElementById('addExpenseBtn').style.opacity = '1';
        document.getElementById('addExpenseBtn').style.cursor = 'pointer';
    }
    
    // Mettre à jour les stats
    document.getElementById('totalIncomeDisplay').textContent = monthIncome.toFixed(2) + ' €';
    document.getElementById('totalExpensesDisplay').textContent = monthTotalExpenses.toFixed(2) + ' €';
    document.getElementById('savingsGoalDisplay').textContent = savingsGoal.toFixed(2) + ' €';
    document.getElementById('actualSavingsDisplay').textContent = monthSavings.toFixed(2) + ' €';
    document.getElementById('leftDisplay').textContent = monthLeft.toFixed(2) + ' €';
    
    // Afficher les dépenses
    displayExpenses();
    
    // Mettre à jour le camembert
    updateChartForExpenses(monthExpenses);
    
    // Mettre à jour le message
    updateDashboard();
}

// Charger les données depuis l'API
async function loadDataFromAPI() {
    const year = currentViewDate.getFullYear();
    const month = currentViewDate.getMonth() + 1;
    
    try {
        // Charger les revenus
        const incomes = await fetchIncomes(currentUserId, month, year);
        monthlySalary = incomes.monthly_salary || 0;
        miniJob = incomes.mini_job || 0;
        document.getElementById('monthlySalary').value = monthlySalary;
        document.getElementById('miniJob').value = miniJob;
        
        // Charger les dépenses du mois
        expenses = await fetchExpenses(currentUserId, month, year);
        
        // Charger l'objectif d'épargne
        const goal = await fetchSavingsGoal(currentUserId, month, year);
        savingsGoal = goal.goal_amount || 0;
        document.getElementById('savingsGoal').value = savingsGoal;
        updatePreviewAmount();
    } catch (error) {
        console.error('Erreur chargement des données:', error);
    }
}

// Navigation entre les mois
function goToPreviousMonth() {
    currentViewDate.setMonth(currentViewDate.getMonth() - 1);
    isViewingHistory = true;
    updateDisplayForMonth();
}

function goToNextMonth() {
    const today = new Date();
    const nextMonth = new Date(currentViewDate);
    nextMonth.setMonth(currentViewDate.getMonth() + 1);
    
    if (nextMonth > today && isViewingHistory) {
        return;
    }
    
    currentViewDate.setMonth(currentViewDate.getMonth() + 1);
    
    if (currentViewDate > today) {
        goToCurrentMonth();
    } else {
        isViewingHistory = true;
        updateDisplayForMonth();
    }
}

function goToCurrentMonth() {
    currentViewDate = new Date();
    isViewingHistory = false;
    updateDisplayForMonth();
}

function toggleSavingsSection() {
    const content = document.getElementById('savingsGoalContent');
    const icon = document.getElementById('collapseIcon');
    
    content.classList.toggle('collapsed');
    icon.classList.toggle('collapsed');
}

// Ajouter une dépense
async function addExpense(event) {
    event.preventDefault();
    
    if (isViewingHistory) {
        alert('📅 Tu es en mode historique ! Reviens au mois en cours pour ajouter des dépenses.');
        return;
    }
    
    const category = document.getElementById('category').value;
    const name = document.getElementById('itemName').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('date').value;
    
    if (!category || !name || !amount || !date) return;
    
    try {
        await addExpenseAPI(currentUserId, category, name, amount, date);
        await updateDisplayForMonth();
        await updateYearProgressChart();
        
        document.getElementById('expenseForm').reset();
        setDefaultDate();
    } catch (error) {
        alert('Erreur lors de l\'ajout de la dépense. Vérifiez que le backend est accessible.');
    }
}

// Supprimer une dépense
async function deleteExpense(id) {
    if (isViewingHistory) {
        alert('📅 Tu es en mode historique ! Reviens au mois en cours pour modifier des dépenses.');
        return;
    }
    
    if (confirm('Supprimer cette dépense ?')) {
        try {
            await deleteExpenseAPI(id);
            await updateDisplayForMonth();
            await updateYearProgressChart();
        } catch (error) {
            alert('Erreur lors de la suppression.');
        }
    }
}

// Mettre à jour les revenus
async function updateIncome() {
    const year = currentViewDate.getFullYear();
    const month = currentViewDate.getMonth() + 1;
    
    monthlySalary = parseFloat(document.getElementById('monthlySalary').value) || 0;
    miniJob = parseFloat(document.getElementById('miniJob').value) || 0;
    
    try {
        await saveIncomes(currentUserId, monthlySalary, miniJob, month, year);
        await updateDisplayForMonth();
        await updateYearProgressChart();
        
        const btn = document.getElementById('updateIncomeBtn');
        const originalText = btn.textContent;
        btn.textContent = '✅ Mis à jour ! ✅';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 1500);
    } catch (error) {
        alert('Erreur lors de la mise à jour des revenus.');
    }
}

// Mettre à jour l'objectif d'épargne
async function updateSavingsGoal() {
    const year = currentViewDate.getFullYear();
    const month = currentViewDate.getMonth() + 1;
    
    savingsGoal = parseFloat(document.getElementById('savingsGoal').value) || 0;
    
    try {
        await saveSavingsGoal(currentUserId, savingsGoal, month, year);
        await updateDisplayForMonth();
        updatePreviewAmount();
        
        const btn = document.getElementById('updateSavingsGoalBtn');
        const originalText = btn.textContent;
        btn.textContent = '🎯 Objectif enregistré ! 🎯';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 1500);
    } catch (error) {
        alert('Erreur lors de la mise à jour de l\'objectif.');
    }
}

// Login
async function handleLogin() {
    const email = document.getElementById('userEmail').value;
    if (!email) {
        alert('Veuillez entrer votre email');
        return;
    }
    
    try {
        // Afficher un message de chargement
        const btn = document.getElementById('loginBtn');
        const originalText = btn.textContent;
        btn.textContent = '⏳ Connexion...';
        btn.disabled = true;
        
        await getOrCreateUser(email);
        
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('appContent').style.display = 'block';
        
        await updateDisplayForMonth();
        await updateYearProgressChart();
    } catch (error) {
        alert('Erreur de connexion. Vérifiez que le backend est en ligne.');
        const btn = document.getElementById('loginBtn');
        btn.textContent = '🚀 Commencer 🚀';
        btn.disabled = false;
    }
}

// Utilitaires
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
}

// Vérifier si l'utilisateur est déjà connecté
async function checkExistingUser() {
    const savedUserId = localStorage.getItem('userId');
    const savedEmail = localStorage.getItem('userEmail');
    
    if (savedUserId && savedEmail) {
        currentUserId = savedUserId;
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('appContent').style.display = 'block';
        document.getElementById('userEmail').value = savedEmail;
        await updateDisplayForMonth();
        await updateYearProgressChart();
    }
}

// Initialisation
function init() {
    setDefaultDate();
    
    // Attendre que le DOM soit chargé
    document.addEventListener('DOMContentLoaded', function() {
        document.getElementById('updateIncomeBtn').addEventListener('click', updateIncome);
        document.getElementById('updateSavingsGoalBtn').addEventListener('click', updateSavingsGoal);
        document.getElementById('expenseForm').addEventListener('submit', addExpense);
        document.getElementById('savingsGoalHeader').addEventListener('click', toggleSavingsSection);
        document.getElementById('prevMonthBtn').addEventListener('click', goToPreviousMonth);
        document.getElementById('nextMonthBtn').addEventListener('click', goToNextMonth);
        document.getElementById('currentMonthBtn').addEventListener('click', goToCurrentMonth);
        document.getElementById('loginBtn').addEventListener('click', handleLogin);
        document.getElementById('userEmail').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleLogin();
        });
        
        checkExistingUser();
    });
}

// Démarrer l'application
init();
