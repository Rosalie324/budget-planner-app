let monthlySalary = 0;
let miniJob = 0;
let expenses = [];
let savingsGoal = 0;
let expenseChart = null;
let yearProgressChart = null;

let currentViewDate = new Date();
let isViewingHistory = false;


const pastelColors = ['#FFB7B2','#FFD6A5','#FDFFB6','#CAFFBF','#9BF6FF','#A0C4FF','#BDB2FF','#FFC6FF','#C4E3CB','#FFD1BA','#E0BBE4','#FEC8D8','#FFF5BA','#B5EAD7','#C7CEEA'];

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

function updatePreviewAmount() {
    const preview = document.getElementById('previewAmount');
    if (preview) preview.textContent = savingsGoal.toFixed(2) + ' €';
}

function getTotalIncome() { return monthlySalary + miniJob; }
function getTotalExpenses() { return expenses.reduce((sum, exp) => sum + exp.amount, 0); }
function getActualSavings() { return getTotalIncome() - getTotalExpenses(); }
function getLeftToSpend() { return Math.max(0, getTotalIncome() - getTotalExpenses() - savingsGoal); }

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
    
    if (savingsGoal > 0) {
        const progress = Math.min(100, Math.max(0, (actualSavings / savingsGoal) * 100));
        document.getElementById('savingsProgress').innerHTML = progress >= 100 ? '🎉 Objectif atteint ! 🎉' : `📈 ${progress.toFixed(1)}% de l'objectif`;
        document.getElementById('savingsProgress').style.color = progress >= 100 ? '#4CAF50' : '#B5DAF9';
    } else {
        document.getElementById('savingsProgress').innerHTML = '💰 Fixe un objectif !';
        document.getElementById('savingsProgress').style.color = '#B5DAF9';
    }
    
    const leftWarning = document.getElementById('leftWarning');
    if (leftToSpend < 0) { leftWarning.innerHTML = '⚠️ Budget dépassé ! ⚠️'; leftWarning.style.color = '#FFB7B2'; }
    else if (leftToSpend < 50) { leftWarning.innerHTML = '🍀 Fais attention !'; leftWarning.style.color = '#FFD6A5'; }
    else { leftWarning.innerHTML = '✨ Tu gères bien ! ✨'; leftWarning.style.color = '#B5DAF9'; }
    
    const msg = document.getElementById('motivationMessage');
    if (savingsGoal > 0 && actualSavings >= savingsGoal) msg.textContent = '🎉✨ OBJECTIF D\'ÉPARGNE ATTEINT ! Tu es une star ! ✨🎉';
    else if (savingsGoal > 0 && actualSavings > 0) msg.textContent = `💪💵 Bravo ! Il te reste ${(savingsGoal - actualSavings).toFixed(2)} € à économiser ! 💵💪`;
    else if (leftToSpend > 200) msg.textContent = '💰✨ Tu as de la marge ! Pense à ton épargne ! ✨💰';
    else if (leftToSpend > 0) msg.textContent = '🍀💰 Tout va bien ! Continue comme ça ! 💰🍀';
    else if (leftToSpend === 0) msg.textContent = '⚖️💵 Budget équilibré ! Parfait ! 💵⚖️';
    else msg.textContent = '⚠️💰 Attention ! Réduis tes dépenses ! 💰⚠️';
}

function displayExpenses() {
    const container = document.getElementById('expensesList');
    const sorted = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
    if (sorted.length === 0) { container.innerHTML = '<div class="empty-state">💵 Pas encore de dépenses ! 💵</div>'; return; }
    container.innerHTML = sorted.map(exp => {
        const catInfo = categories[exp.category];
        const catDisplay = catInfo ? `${catInfo.icon} ${catInfo.name}` : exp.category;
        return `
            <div class="expense-item">
                <div class="expense-info">
                    <div class="expense-name">${exp.name}</div>
                    <div class="expense-category">${catDisplay}</div>
                    <div class="expense-date">${new Date(exp.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
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
    expensesData.forEach(exp => {
        const catInfo = categories[exp.category];
        const name = catInfo ? `${catInfo.icon} ${catInfo.name}` : exp.category;
        if (!categoryTotals[name]) { categoryTotals[name] = { total: 0, color: pastelColors[colorIndex % pastelColors.length] }; colorIndex++; }
        categoryTotals[name].total += exp.amount;
    });
    const labels = Object.keys(categoryTotals);
    const data = labels.map(l => categoryTotals[l].total);
    const colors = labels.map(l => categoryTotals[l].color);
    if (expenseChart) expenseChart.destroy();
    if (data.length > 0 && data.some(d => d > 0)) {
        expenseChart = new Chart(ctx, {
            type: 'doughnut',
            data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 0, hoverOffset: 15 }] },
            options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { display: false }, tooltip: { callbacks: { label: function(ctx) { const total = ctx.dataset.data.reduce((a,b) => a+b, 0); return `${ctx.label}: ${ctx.raw.toFixed(2)} € (${((ctx.raw/total)*100).toFixed(1)}%)`; } } } }, cutout: '60%' }
        });
        const legendDiv = document.getElementById('chartLegend');
        const total = Object.values(categoryTotals).reduce((s, cat) => s + cat.total, 0);
        legendDiv.innerHTML = Object.entries(categoryTotals).map(([name, data]) => `<div class="legend-item"><div class="legend-color" style="background:${data.color}"></div><span>${name}</span><span style="font-weight:600;">${((data.total/total)*100).toFixed(1)}%</span></div>`).join('');
    } else {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.font = '16px Quicksand'; ctx.fillStyle = '#FBB1D3'; ctx.textAlign = 'center';
        ctx.fillText('💰 Ajoute des dépenses pour voir ton camembert 💰', ctx.canvas.width/2, ctx.canvas.height/2);
        document.getElementById('chartLegend').innerHTML = '<div style="text-align:center; color:#B5DAF9;">💵 Pas encore de dépenses 💵</div>';
    }
}

async function updateYearProgressChart() {
    const year = new Date().getFullYear();
    const months = ['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Aoû','Sep','Oct','Nov','Déc'];
    const totals = [], incomes = [], savings = [];
    for (let i = 1; i <= 12; i++) {
        const exp = await fetchExpenses(currentUserId, i, year);
        const inc = await fetchIncomes(currentUserId, i, year);
        const total = exp.reduce((s, e) => s + e.amount, 0);
        const income = (inc.monthly_salary || 0) + (inc.mini_job || 0);
        totals.push(total); incomes.push(income); savings.push(income - total);
    }
    const ctx = document.getElementById('yearProgressChart').getContext('2d');
    if (yearProgressChart) yearProgressChart.destroy();
    yearProgressChart = new Chart(ctx, {
        type: 'bar',
        data: { labels: months, datasets: [
            { label: 'Dépenses', data: totals, backgroundColor: '#FBB1D3', borderRadius: 10, borderSkipped: false },
            { label: 'Revenus', data: incomes, backgroundColor: '#B5DAF9', borderRadius: 10, borderSkipped: false },
            { label: 'Épargne', data: savings, backgroundColor: '#CAFFBF', borderRadius: 10, borderSkipped: false }
        ] },
        options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { position: 'top', labels: { font: { family: 'Quicksand', size: 12 }, usePointStyle: true, boxWidth: 10 } } }, scales: { y: { beginAtZero: true, grid: { color: '#FED8EC' }, ticks: { callback: v => v + ' €' } }, x: { grid: { display: false } } } }
    });
    const totalYearExpenses = totals.reduce((a,b) => a+b, 0);
    const totalYearIncome = incomes.reduce((a,b) => a+b, 0);
    document.getElementById('yearStats').innerHTML = `
        <div class="year-stat-card"><div class="stat-label">📊 Total dépenses annuelles</div><div class="stat-number">${totalYearExpenses.toFixed(2)} €</div></div>
        <div class="year-stat-card"><div class="stat-label">💰 Total revenus annuels</div><div class="stat-number">${totalYearIncome.toFixed(2)} €</div></div>
        <div class="year-stat-card"><div class="stat-label">🐷 Épargne annuelle</div><div class="stat-number">${(totalYearIncome - totalYearExpenses).toFixed(2)} €</div></div>
        <div class="year-stat-card"><div class="stat-label">📈 Moyenne mensuelle</div><div class="stat-number">${(totalYearExpenses / 12).toFixed(2)} €</div></div>
    `;
}

async function loadDataFromAPI() {
    const year = currentViewDate.getFullYear();
    const month = currentViewDate.getMonth() + 1;
    try {
        const incomes = await fetchIncomes(currentUserId, month, year);
        monthlySalary = incomes.monthly_salary || 0;
        miniJob = incomes.mini_job || 0;
        document.getElementById('monthlySalary').value = monthlySalary;
        document.getElementById('miniJob').value = miniJob;
        expenses = await fetchExpenses(currentUserId, month, year);
        const goal = await fetchSavingsGoal(currentUserId, month, year);
        savingsGoal = goal.goal_amount || 0;
        document.getElementById('savingsGoal').value = savingsGoal;
        updatePreviewAmount();
    } catch(e) { console.error(e); }
}

async function updateDisplayForMonth() {
    const year = currentViewDate.getFullYear();
    const month = currentViewDate.getMonth() + 1;
    const monthNames = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
    document.getElementById('expensesList').innerHTML = '<div class="loading">Chargement...</div>';
    await loadDataFromAPI();
    const monthDisplay = isViewingHistory ? `${monthNames[month-1]} ${year}` : `${monthNames[month-1]} ${year} (Mois en cours)`;
    document.getElementById('currentMonthDisplay').innerHTML = `<span class="month-icon">📅</span> ${monthDisplay}`;
    const badge = document.getElementById('viewBadge');
    if (isViewingHistory) {
        badge.innerHTML = `📊 Vue: ${monthNames[month-1]} ${year}`;
        badge.style.background = '#FFF1C2';
        document.getElementById('expensesSectionTitle').innerHTML = `📋 Dépenses du ${monthNames[month-1]} ${year}`;
        document.getElementById('addExpenseBtn').disabled = true;
        document.getElementById('addExpenseBtn').style.opacity = '0.5';
        document.getElementById('addExpenseBtn').style.cursor = 'not-allowed';
    } else {
        badge.innerHTML = `📊 Vue: Mois en cours - ${monthNames[month-1]} ${year}`;
        badge.style.background = 'rgba(255,255,255,0.9)';
        document.getElementById('expensesSectionTitle').innerHTML = `📝 Ajouter une dépense 📝`;
        document.getElementById('addExpenseBtn').disabled = false;
        document.getElementById('addExpenseBtn').style.opacity = '1';
        document.getElementById('addExpenseBtn').style.cursor = 'pointer';
    }
    document.getElementById('totalIncomeDisplay').textContent = getTotalIncome().toFixed(2) + ' €';
    document.getElementById('totalExpensesDisplay').textContent = getTotalExpenses().toFixed(2) + ' €';
    document.getElementById('savingsGoalDisplay').textContent = savingsGoal.toFixed(2) + ' €';
    document.getElementById('actualSavingsDisplay').textContent = getActualSavings().toFixed(2) + ' €';
    document.getElementById('leftDisplay').textContent = getLeftToSpend().toFixed(2) + ' €';
    displayExpenses();
    updateChartForExpenses(expenses);
    updateDashboard();
}

function goToPreviousMonth() { currentViewDate.setMonth(currentViewDate.getMonth() - 1); isViewingHistory = true; updateDisplayForMonth(); }
function goToNextMonth() {
    const today = new Date();
    const nextMonth = new Date(currentViewDate);
    nextMonth.setMonth(currentViewDate.getMonth() + 1);
    if (nextMonth > today && isViewingHistory) return;
    currentViewDate.setMonth(currentViewDate.getMonth() + 1);
    if (currentViewDate > today) goToCurrentMonth();
    else { isViewingHistory = true; updateDisplayForMonth(); }
}
function goToCurrentMonth() { currentViewDate = new Date(); isViewingHistory = false; updateDisplayForMonth(); }
function toggleSavingsSection() {
    document.getElementById('savingsGoalContent').classList.toggle('collapsed');
    document.getElementById('collapseIcon').classList.toggle('collapsed');
}

async function addExpense(e) {
    e.preventDefault();
    if (isViewingHistory) { alert('📅 Reviens au mois en cours pour ajouter des dépenses.'); return; }
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
        document.getElementById('date').value = new Date().toISOString().split('T')[0];
    } catch(e) { alert('Erreur lors de l\'ajout.'); }
}

async function deleteExpense(id) {
    if (isViewingHistory) { alert('📅 Reviens au mois en cours pour modifier.'); return; }
    if (confirm('Supprimer cette dépense ?')) {
        try { await deleteExpenseAPI(id); await updateDisplayForMonth(); await updateYearProgressChart(); }
        catch(e) { alert('Erreur lors de la suppression.'); }
    }
}

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
        btn.textContent = '✅ Mis à jour ! ✅';
        setTimeout(() => btn.textContent = '💵 Mettre à jour mes revenus 💵', 1500);
    } catch(e) { alert('Erreur de mise à jour.'); }
}

async function updateSavingsGoal() {
    const year = currentViewDate.getFullYear();
    const month = currentViewDate.getMonth() + 1;
    savingsGoal = parseFloat(document.getElementById('savingsGoal').value) || 0;
    try {
        await saveSavingsGoal(currentUserId, savingsGoal, month, year);
        await updateDisplayForMonth();
        updatePreviewAmount();
        const btn = document.getElementById('updateSavingsGoalBtn');
        btn.textContent = '🎯 Objectif enregistré ! 🎯';
        setTimeout(() => btn.textContent = '🎯 Valider mon objectif 🎯', 1500);
    } catch(e) { alert('Erreur de mise à jour.'); }
}

async function handleLogin() {
    const email = document.getElementById('userEmail').value;
    if (!email) { alert('Veuillez entrer votre email'); return; }
    try {
        const btn = document.getElementById('loginBtn');
        btn.textContent = '⏳ Connexion...';
        btn.disabled = true;
        await getOrCreateUser(email);
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('appContent').style.display = 'block';
        await updateDisplayForMonth();
        await updateYearProgressChart();
    } catch(e) {
        alert('Erreur de connexion. Vérifiez le backend.');
        document.getElementById('loginBtn').textContent = '🚀 Commencer 🚀';
        document.getElementById('loginBtn').disabled = false;
    }
}

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

function init() {
    document.getElementById('date').value = new Date().toISOString().split('T')[0];
    document.addEventListener('DOMContentLoaded', function() {
        document.getElementById('updateIncomeBtn').addEventListener('click', updateIncome);
        document.getElementById('updateSavingsGoalBtn').addEventListener('click', updateSavingsGoal);
        document.getElementById('expenseForm').addEventListener('submit', addExpense);
        document.getElementById('savingsGoalHeader').addEventListener('click', toggleSavingsSection);
        document.getElementById('prevMonthBtn').addEventListener('click', goToPreviousMonth);
        document.getElementById('nextMonthBtn').addEventListener('click', goToNextMonth);
        document.getElementById('currentMonthBtn').addEventListener('click', goToCurrentMonth);
        document.getElementById('loginBtn').addEventListener('click', handleLogin);
        document.getElementById('userEmail').addEventListener('keypress', (e) => { if (e.key === 'Enter') handleLogin(); });
        checkExistingUser();
    });
}

init();
