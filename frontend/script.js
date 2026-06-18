// ========================================
// script.js - Logique de l'application (VERSION CORRIGÉE)
// ========================================

let monthlySalary = 0;
let miniJob = 0;
let expenses = [];
let savingsGoal = 0;
let expenseChart = null;
let yearProgressChart = null;

// Variables pour la navigation mensuelle
let currentViewDate = new Date();
let isViewingHistory = false;

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

// ============ FONCTIONS UTILITAIRES ============

function getElement(id) {
    const el = document.getElementById(id);
    if (!el) {
        console.warn(`⚠️ Élément "${id}" non trouvé dans le DOM`);
    }
    return el;
}

function setTextContent(id, value) {
    const el = getElement(id);
    if (el) el.textContent = value;
}

function setInnerHTML(id, html) {
    const el = getElement(id);
    if (el) el.innerHTML = html;
}

// ============ FONCTIONS PRINCIPALES ============

function updatePreviewAmount() {
    const previewSpan = getElement('previewAmount');
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
    
    setTextContent('totalIncomeDisplay', totalIncome.toFixed(2) + ' €');
    setTextContent('totalExpensesDisplay', totalExpenses.toFixed(2) + ' €');
    setTextContent('savingsGoalDisplay', savingsGoal.toFixed(2) + ' €');
    setTextContent('actualSavingsDisplay', actualSavings.toFixed(2) + ' €');
    setTextContent('leftDisplay', leftToSpend.toFixed(2) + ' €');
    
    const savingsProgress = getElement('savingsProgress');
    if (savingsProgress) {
        if (savingsGoal > 0) {
            const progress = Math.min(100, Math.max(0, (actualSavings / savingsGoal) * 100));
            if (progress >= 100) {
                savingsProgress.innerHTML = '🎉 Objectif atteint ! 🎉';
                savingsProgress.style.color = '#4CAF50';
            } else {
                savingsProgress.innerHTML = `📈 ${progress.toFixed(1)}% de l'objectif`;
                savingsProgress.style.color = '#B5DAF9';
            }
        } else {
            savingsProgress.innerHTML = '💰 Fixe un objectif !';
            savingsProgress.style.color = '#B5DAF9';
        }
    }
    
    const leftWarning = getElement('leftWarning');
    if (leftWarning) {
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
    }
    
    updateMotivationMessage(actualSavings, savingsGoal, leftToSpend);
}

function updateMotivationMessage(actualSavings, savingsGoal, leftToSpend) {
    const messageDiv = getElement('motivationMessage');
    if (!messageDiv) return;
    
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
    const container = getElement('expensesList');
    if (!container) return;
    
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
                <button class="delete-expense" onclick="deleteExpense('${exp.id}')">🗑️</button>
            </div>
        `;
    }).join('');
}

function updateChartForExpenses(expensesData) {
    const canvas = getElement('expenseChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
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
        const legendDiv = getElement('chartLegend');
        if (legendDiv) {
            legendDiv.innerHTML = '<div style="text-align:center; color:#B5DAF9;">💵 Pas encore de dépenses 💵</div>';
        }
    }
}

function updateLegend(categoryTotals) {
    const legendDiv = getElement('chartLegend');
    if (!legendDiv) return;
    
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
    
    const canvas = getElement('yearProgressChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
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
    
    const yearStats = getElement('yearStats');
    if (yearStats) {
        yearStats.innerHTML = `
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
}

// Mettre à jour l'affichage selon le mois sélectionné
async function updateDisplayForMonth() {
    const year = currentViewDate.getFullYear();
    const month = currentViewDate.getMonth() + 1;
    const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    
    const expensesList = getElement('expensesList');
    if (expensesList) {
        expensesList.innerHTML = '<div class="loading">Chargement...</div>';
    }
    
    await loadDataFromAPI();
    
    const monthExpenses = expenses;
    const monthTotalExpenses = getTotalExpenses();
    const monthIncome = getTotalIncome();
    const monthSavings = getActualSavings();
    const monthLeft = getLeftToSpend();
    
    const monthDisplay = isViewingHistory ? `${monthNames[month-1]} ${year}` : `${monthNames[month-1]} ${year} (Mois en cours)`;
    
    const currentMonthDisplay = getElement('currentMonthDisplay');
    if (currentMonthDisplay) {
        currentMonthDisplay.innerHTML = `<span class="month-icon">📅</span> ${monthDisplay}`;
    }
    
    const viewBadge = getElement('viewBadge');
    if (viewBadge) {
        if (isViewingHistory) {
            viewBadge.innerHTML = `📊 Vue: ${monthNames[month-1]} ${year}`;
            viewBadge.style.background = '#FFF1C2';
        } else {
            viewBadge.innerHTML = `📊 Vue: Mois en cours - ${monthNames[month-1]} ${year}`;
            viewBadge.style.background = 'rgba(255, 255, 255, 0.9)';
        }
    }
    
    const expensesTitle = getElement('expensesSectionTitle');
    if (expensesTitle) {
        if (isViewingHistory) {
            expensesTitle.innerHTML = `📋 Dépenses du ${monthNames[month-1]} ${year}`;
        } else {
            expensesTitle.innerHTML = `📝 Ajouter une dépense 📝`;
        }
    }
    
    // 🔥 LE BOUTON EST TOUJOURS ACTIF - ON PEUT AJOUTER DES DÉPENSES POUR N'IMPORTE QUEL MOIS
    const addBtn = getElement('addExpenseBtn');
    if (addBtn) {
        addBtn.disabled = false;
        addBtn.style.opacity = '1';
        addBtn.style.cursor = 'pointer';
        // Changer le texte pour indiquer le mois
        if (isViewingHistory) {
            addBtn.textContent = `💵 Ajouter une dépense pour ${monthNames[month-1]} ${year}`;
        } else {
            addBtn.textContent = '💵 Ajouter la dépense 💵';
        }
    }
    
    setTextContent('totalIncomeDisplay', monthIncome.toFixed(2) + ' €');
    setTextContent('totalExpensesDisplay', monthTotalExpenses.toFixed(2) + ' €');
    setTextContent('savingsGoalDisplay', savingsGoal.toFixed(2) + ' €');
    setTextContent('actualSavingsDisplay', monthSavings.toFixed(2) + ' €');
    setTextContent('leftDisplay', monthLeft.toFixed(2) + ' €');
    
    displayExpenses();
    updateChartForExpenses(monthExpenses);
    updateDashboard();
}

// Charger les données depuis l'API
async function loadDataFromAPI() {
    const year = currentViewDate.getFullYear();
    const month = currentViewDate.getMonth() + 1;
    
    try {
        const incomes = await fetchIncomes(currentUserId, month, year);
        monthlySalary = incomes.monthly_salary || 0;
        miniJob = incomes.mini_job || 0;
        
        const monthlySalaryEl = getElement('monthlySalary');
        const miniJobEl = getElement('miniJob');
        if (monthlySalaryEl) monthlySalaryEl.value = monthlySalary;
        if (miniJobEl) miniJobEl.value = miniJob;
        
        expenses = await fetchExpenses(currentUserId, month, year);
        
        const goal = await fetchSavingsGoal(currentUserId, month, year);
        savingsGoal = goal.goal_amount || 0;
        
        const savingsGoalEl = getElement('savingsGoal');
        if (savingsGoalEl) savingsGoalEl.value = savingsGoal;
        updatePreviewAmount();
    } catch (error) {
        console.error('Erreur chargement des données:', error);
    }
}

function goToPreviousMonth() {
    currentViewDate.setMonth(currentViewDate.getMonth() - 1);
    isViewingHistory = true;
    updateDisplayForMonth();
}

function goToNextMonth() {
    const today = new Date();
    const nextMonth = new Date(currentViewDate);
    nextMonth.setMonth(currentViewDate.getMonth() + 1);
    
    // On peut aller jusqu'au mois en cours, pas au-delà
    if (nextMonth > today) {
        // Si on essaie d'aller au-delà du mois en cours, on revient au mois en cours
        goToCurrentMonth();
        return;
    }
    
    currentViewDate.setMonth(currentViewDate.getMonth() + 1);
    isViewingHistory = true;
    updateDisplayForMonth();
}

function goToCurrentMonth() {
    currentViewDate = new Date();
    isViewingHistory = false;
    updateDisplayForMonth();
}

function toggleSavingsSection() {
    const content = getElement('savingsGoalContent');
    const icon = getElement('collapseIcon');
    
    if (content) content.classList.toggle('collapsed');
    if (icon) icon.classList.toggle('collapsed');
}

// 🔥 NOUVELLE VERSION - AJOUTER UNE DÉPENSE POUR N'IMPORTE QUEL MOIS
async function addExpense(event) {
    event.preventDefault();
    
    const categoryEl = getElement('category');
    const nameEl = getElement('itemName');
    const amountEl = getElement('amount');
    const dateEl = getElement('date');
    
    if (!categoryEl || !nameEl || !amountEl || !dateEl) return;
    
    const category = categoryEl.value;
    const name = nameEl.value;
    const amount = parseFloat(amountEl.value);
    let date = dateEl.value;
    
    if (!category || !name || !amount || !date) return;
    
    // Si on est en mode historique, la date est déjà celle du mois affiché
    // Mais on vérifie que la date correspond bien au mois affiché
    const selectedDate = new Date(date);
    const viewYear = currentViewDate.getFullYear();
    const viewMonth = currentViewDate.getMonth();
    
    // Si la date ne correspond pas au mois affiché, on la force
    if (selectedDate.getFullYear() !== viewYear || selectedDate.getMonth() !== viewMonth) {
        // On crée une date avec le mois affiché
        const correctedDate = new Date(viewYear, viewMonth, 1);
        // On garde le jour si possible, sinon on met le 1er
        const day = Math.min(selectedDate.getDate(), new Date(viewYear, viewMonth + 1, 0).getDate());
        correctedDate.setDate(day);
        date = correctedDate.toISOString().split('T')[0];
        dateEl.value = date;
    }
    
    try {
        await addExpenseAPI(currentUserId, category, name, amount, date);
        await updateDisplayForMonth();
        await updateYearProgressChart();
        
        const form = getElement('expenseForm');
        if (form) form.reset();
        setDefaultDate();
        
        // Afficher un message de confirmation
        const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
        alert(`✅ Dépense ajoutée pour ${monthNames[currentViewDate.getMonth()]} ${currentViewDate.getFullYear()} !`);
    } catch (error) {
        alert('Erreur lors de l\'ajout de la dépense. Vérifiez que le backend est accessible.');
        console.error(error);
    }
}

// Supprimer une dépense
async function deleteExpense(id) {
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
    
    const monthlySalaryEl = getElement('monthlySalary');
    const miniJobEl = getElement('miniJob');
    
    if (monthlySalaryEl) monthlySalary = parseFloat(monthlySalaryEl.value) || 0;
    if (miniJobEl) miniJob = parseFloat(miniJobEl.value) || 0;
    
    try {
        await saveIncomes(currentUserId, monthlySalary, miniJob, month, year);
        await updateDisplayForMonth();
        await updateYearProgressChart();
        
        const btn = getElement('updateIncomeBtn');
        if (btn) {
            const originalText = btn.textContent;
            btn.textContent = '✅ Mis à jour ! ✅';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 1500);
        }
    } catch (error) {
        alert('Erreur lors de la mise à jour des revenus.');
    }
}

// Mettre à jour l'objectif d'épargne
async function updateSavingsGoal() {
    const year = currentViewDate.getFullYear();
    const month = currentViewDate.getMonth() + 1;
    
    const savingsGoalEl = getElement('savingsGoal');
    if (savingsGoalEl) {
        savingsGoal = parseFloat(savingsGoalEl.value) || 0;
    }
    
    try {
        await saveSavingsGoal(currentUserId, savingsGoal, month, year);
        await updateDisplayForMonth();
        updatePreviewAmount();
        
        const btn = getElement('updateSavingsGoalBtn');
        if (btn) {
            const originalText = btn.textContent;
            btn.textContent = '🎯 Objectif enregistré ! 🎯';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 1500);
        }
    } catch (error) {
        alert('Erreur lors de la mise à jour de l\'objectif.');
    }
}

// Login
async function handleLogin() {
    const userEmailEl = getElement('userEmail');
    if (!userEmailEl) return;
    
    const email = userEmailEl.value;
    if (!email) {
        alert('Veuillez entrer votre email');
        return;
    }
    
    try {
        const btn = getElement('loginBtn');
        if (btn) {
            btn.textContent = '⏳ Connexion...';
            btn.disabled = true;
        }
        
        await getOrCreateUser(email);
        
        const loginSection = getElement('loginSection');
        const appContent = getElement('appContent');
        
        if (loginSection) loginSection.style.display = 'none';
        if (appContent) appContent.style.display = 'block';
        
        await updateDisplayForMonth();
        await updateYearProgressChart();
    } catch (error) {
        alert('Erreur de connexion. Vérifiez que le backend est en ligne.');
        const btn = getElement('loginBtn');
        if (btn) {
            btn.textContent = '🚀 Commencer 🚀';
            btn.disabled = false;
        }
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
    const dateInput = getElement('date');
    if (dateInput) {
        // Par défaut, on met la date du mois affiché
        const year = currentViewDate.getFullYear();
        const month = String(currentViewDate.getMonth() + 1).padStart(2, '0');
        const day = '01'; // Premier jour du mois
        dateInput.value = `${year}-${month}-${day}`;
    }
}

// Vérifier si l'utilisateur est déjà connecté
async function checkExistingUser() {
    const savedUserId = localStorage.getItem('userId');
    const savedEmail = localStorage.getItem('userEmail');
    
    if (savedUserId && savedEmail) {
        currentUserId = savedUserId;
        
        const loginSection = getElement('loginSection');
        const appContent = getElement('appContent');
        const userEmail = getElement('userEmail');
        
        if (loginSection) loginSection.style.display = 'none';
        if (appContent) appContent.style.display = 'block';
        if (userEmail) userEmail.value = savedEmail;
        
        await updateDisplayForMonth();
        await updateYearProgressChart();
    }
}

// Initialisation
function init() {
    document.addEventListener('DOMContentLoaded', function() {
        setDefaultDate();
        
        // Liste des éléments à attacher
        const events = [
            { id: 'updateIncomeBtn', event: 'click', handler: updateIncome },
            { id: 'updateSavingsGoalBtn', event: 'click', handler: updateSavingsGoal },
            { id: 'expenseForm', event: 'submit', handler: addExpense },
            { id: 'savingsGoalHeader', event: 'click', handler: toggleSavingsSection },
            { id: 'prevMonthBtn', event: 'click', handler: goToPreviousMonth },
            { id: 'nextMonthBtn', event: 'click', handler: goToNextMonth },
            { id: 'currentMonthBtn', event: 'click', handler: goToCurrentMonth },
            { id: 'loginBtn', event: 'click', handler: handleLogin }
        ];
        
        for (const { id, event, handler } of events) {
            const el = getElement(id);
            if (el) {
                el.addEventListener(event, handler);
            }
        }
        
        const userEmail = getElement('userEmail');
        if (userEmail) {
            userEmail.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') handleLogin();
            });
        }
        
        checkExistingUser();
    });
}

// Démarrer l'application
init();
