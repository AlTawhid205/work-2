app.get('/api/categories', (req, res) => {
  res.json([...new Set(foods.map(f => f.category))]);
});

app.get('/api/foods/:id', (req, res) => {
  const food = foods.find(f => f.id === Number(req.params.id));
  if (!food) return res.status(404).json({ error: 'Food not found' });
  res.json(food);
});

app.post('/api/foods', (req, res) => {
  const food = {
    id: nextId++,
    vitamins: [],
    minerals: [],
    benefits: [],
    sideEffects: [],
    ...req.body
  };
  foods.push(food);
  res.status(201).json(food);
});

app.put('/api/foods/:id', (req, res) => {
  const idx = foods.findIndex(f => f.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Food not found' });

  foods[idx] = {
    ...foods[idx],
    ...req.body,
    id: foods[idx].id
  };

  res.json(foods[idx]);
});

app.delete('/api/foods/:id', (req, res) => {
  const idx = foods.findIndex(f => f.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Food not found' });

  const removed = foods.splice(idx, 1)[0];
  favorites = favorites.filter(id => id !== removed.id);

  res.json({ success: true, removed });
});

// ---------------------------------------------------------------------------
// Compare API
// ---------------------------------------------------------------------------
app.get('/api/compare', (req, res) => {
  const ids = (req.query.ids || '').split(',').map(Number).filter(Boolean);
  const items = foods.filter(f => ids.includes(f.id));
  res.json(items);
});

// ---------------------------------------------------------------------------
// Favorites API
// ---------------------------------------------------------------------------
app.get('/api/favorites', (req, res) => {
  res.json(foods.filter(f => favorites.includes(f.id)));
});

app.post('/api/favorites/:id', (req, res) => {
  const id = Number(req.params.id);

  if (!foods.some(f => f.id === id)) {
    return res.status(404).json({ error: 'Food not found' });
  }

  if (!favorites.includes(id)) {
    favorites.push(id);
  }

  res.json({ success: true, favorites });
});

app.delete('/api/favorites/:id', (req, res) => {
  const id = Number(req.params.id);
  favorites = favorites.filter(f => f !== id);
  res.json({ success: true, favorites });
});

// ---------------------------------------------------------------------------
// Daily Vitamin Calculator API
// ---------------------------------------------------------------------------
app.post('/api/vitamin-calculator', (req, res) => {
  const age = Number(req.body.age) || 0;
  const gender = (req.body.gender || 'Male').toLowerCase();
  const weight = Number(req.body.weight) || 0;

  if (!age || !weight) {
    return res.status(400).json({ error: 'Age and weight are required.' });
  }

  const base = gender === 'female'
    ? { vitaminA: 700, vitaminC: 75, vitaminD: 15, iron: 18, calcium: 1000 }
    : { vitaminA: 900, vitaminC: 90, vitaminD: 15, iron: 8, calcium: 1000 };

  let ageFactor = 1;

  if (age < 13) ageFactor = 0.6;
  else if (age > 60) ageFactor = 1.1;

  const recommended = Object.fromEntries(
    Object.entries(base).map(([k, v]) => [k, Math.round(v * ageFactor)])
  );

  const estimatedIntakePercent = Math.min(
    100,
    Math.round((weight / (age + weight)) * 120)
  );

  res.json({
    age,
    gender,
    weight,
    recommended,
    estimatedIntakePercent
  });
});

// ---------------------------------------------------------------------------
// Auth API
// ---------------------------------------------------------------------------
app.post('/api/login', (req, res) => {
  const { email, password } = req.body || {};

  const user = users.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  res.json({
    success: true,
    token: `demo-token-${user.id}`,
    user: {
      id: user.id,
      email: user.email,
      role: user.role
    }
  });
});

// ---------------------------------------------------------------------------
// Admin Stats API
// ---------------------------------------------------------------------------
app.get('/api/stats', (req, res) => {
  const categories = new Set(foods.map(f => f.category));

  res.json({
    foods: foods.length,
    users: users.length,
    categories: categories.size
  });
});

// Export app for Vercel
module.exports = app;

// Run locally only
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`NutriVerse server running on http://localhost:${PORT}`);
  });
}