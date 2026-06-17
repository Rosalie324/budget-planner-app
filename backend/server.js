const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Servir les fichiers statiques du dossier frontend
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Initialisation Supabase
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

// ============ ROUTES API ============

// Récupérer les revenus
app.get('/api/incomes/:userId/:month/:year', async (req, res) => {
    const { userId, month, year } = req.params;
    
    const { data, error } = await supabase
        .from('incomes')
        .select('*')
        .eq('user_id', userId)
        .eq('month', parseInt(month))
        .eq('year', parseInt(year))
        .maybeSingle();
    
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    
    res.json(data || { monthly_salary: 0, mini_job: 0 });
});

// Mettre à jour les revenus
app.post('/api/incomes', async (req, res) => {
    const { user_id, monthly_salary, mini_job, month, year } = req.body;
    
    const { error } = await supabase
        .from('incomes')
        .upsert({
            user_id,
            monthly_salary,
            mini_job,
            month,
            year,
            updated_at: new Date()
        }, {
            onConflict: 'user_id,month,year'
        });
    
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    
    res.json({ success: true });
});

// Récupérer les dépenses
app.get('/api/expenses/:userId', async (req, res) => {
    const { userId } = req.params;
    const { month, year } = req.query;
    
    let query = supabase
        .from('expenses')
        .select('*')
        .eq('user_id', userId);
    
    if (month && year) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        query = query.gte('date', startDate.toISOString().split('T')[0])
                     .lte('date', endDate.toISOString().split('T')[0]);
    }
    
    const { data, error } = await query.order('date', { ascending: false });
    
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    
    res.json(data || []);
});

// Ajouter une dépense
app.post('/api/expenses', async (req, res) => {
    const { user_id, category, name, amount, date } = req.body;
    
    const { data, error } = await supabase
        .from('expenses')
        .insert([{ user_id, category, name, amount, date }])
        .select();
    
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    
    res.json(data[0]);
});

// Supprimer une dépense
app.delete('/api/expenses/:id', async (req, res) => {
    const { id } = req.params;
    
    const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);
    
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    
    res.json({ success: true });
});

// Récupérer l'objectif d'épargne
app.get('/api/savings-goal/:userId/:month/:year', async (req, res) => {
    const { userId, month, year } = req.params;
    
    const { data, error } = await supabase
        .from('savings_goals')
        .select('goal_amount')
        .eq('user_id', userId)
        .eq('month', parseInt(month))
        .eq('year', parseInt(year))
        .maybeSingle();
    
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    
    res.json({ goal_amount: data?.goal_amount || 0 });
});

// Mettre à jour l'objectif d'épargne
app.post('/api/savings-goal', async (req, res) => {
    const { user_id, goal_amount, month, year } = req.body;
    
    const { error } = await supabase
        .from('savings_goals')
        .upsert({
            user_id,
            goal_amount,
            month,
            year,
            updated_at: new Date()
        }, {
            onConflict: 'user_id,month,year'
        });
    
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    
    res.json({ success: true });
});

// Créer ou récupérer un utilisateur
app.post('/api/users', async (req, res) => {
    const { email } = req.body;
    
    let { data: existingUser, error: findError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle();
    
    if (existingUser) {
        return res.json(existingUser);
    }
    
    const { data, error } = await supabase
        .from('users')
        .insert([{ email }])
        .select()
        .single();
    
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    
    res.json(data);
});

// Route pour la racine - sert index.html du dossier frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// Route de test
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'API Budget Planner fonctionne !' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
