const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ---------------------------------------------------------------------------
// In-memory "database"
// All %DV (daily value) figures are simplified demo estimates for UI
// purposes only — not verified clinical nutrition data.
// ---------------------------------------------------------------------------
let nextId = 9;

let foods = [
  {
    id: 1, name: 'Mango', bnName: 'আম', emoji: '🥭', category: 'Fruit',
    calories: 60, protein: 0.8, fat: 0.4, carbs: 15, fiber: 1.6, sugar: 14, sodium: 1,
    vitaminC: 36, vitaminDDV: 0, calciumDV: 1, ironDV: 1, potassiumDV: 6,
    vitamins: ['Vitamin A', 'Vitamin C', 'Vitamin E', 'Vitamin B6', 'Vitamin K'],
    minerals: ['Potassium', 'Magnesium', 'Calcium', 'Iron', 'Zinc'],
    benefits: ['Boosts immunity', 'Good for eyesight', 'Supports digestion', 'Rich in antioxidants'],
    sideEffects: ['Too much may increase sugar intake.', 'May cause allergy in sensitive people.'],
    howToEat: 'Fresh, smoothie, salad, yogurt, juice.'
  },
  {
    id: 2, name: 'Carrot', bnName: 'গাজর', emoji: '🥕', category: 'Vegetable',
    calories: 41, protein: 0.9, fat: 0.2, carbs: 10, fiber: 2.8, sugar: 4.7, sodium: 69,
    vitaminC: 10, vitaminDDV: 0, calciumDV: 3, ironDV: 2, potassiumDV: 9,
    vitamins: ['Vitamin A', 'Vitamin K', 'Vitamin B6'],
    minerals: ['Potassium', 'Calcium'],
    benefits: ['Good for eyesight', 'Supports skin health', 'Rich in antioxidants'],
    sideEffects: ['Excess intake may cause carotenemia (yellowish skin).'],
    howToEat: 'Raw, salad, juice, cooked as a side dish.'
  },
  {
    id: 3, name: 'Spinach', bnName: 'পালং শাক', emoji: '🥬', category: 'Vegetable',
    calories: 23, protein: 2.9, fat: 0.4, carbs: 3.6, fiber: 2.2, sugar: 0.4, sodium: 79,
    vitaminC: 28, vitaminDDV: 0, calciumDV: 10, ironDV: 15, potassiumDV: 16,
    vitamins: ['Vitamin K', 'Vitamin A', 'Vitamin C', 'Folate'],
    minerals: ['Iron', 'Magnesium', 'Calcium', 'Potassium'],
    benefits: ['Boosts iron levels', 'Supports bone health', 'Good for eyesight'],
    sideEffects: ['High oxalate content may affect kidney stone risk.'],
    howToEat: 'Cooked, sauteed, in soups, smoothies.'
  },
  {
    id: 4, name: 'Orange', bnName: 'কমলা', emoji: '🍊', category: 'Fruit',
    calories: 47, protein: 0.9, fat: 0.1, carbs: 12, fiber: 2.4, sugar: 9, sodium: 0,
    vitaminC: 89, vitaminDDV: 0, calciumDV: 4, ironDV: 1, potassiumDV: 5,
    vitamins: ['Vitamin C', 'Vitamin A', 'Folate'],
    minerals: ['Potassium', 'Calcium'],
    benefits: ['Boosts immunity', 'Supports skin health', 'Rich in antioxidants'],
    sideEffects: ['May cause acidity in sensitive people.'],
    howToEat: 'Fresh, juice, salad.'
  },
  {
    id: 5, name: 'Banana', bnName: 'কলা', emoji: '🍌', category: 'Fruit',
    calories: 89, protein: 1.1, fat: 0.3, carbs: 23, fiber: 2.6, sugar: 12, sodium: 1,
    vitaminC: 15, vitaminDDV: 0, calciumDV: 1, ironDV: 1, potassiumDV: 10,
    vitamins: ['Vitamin C', 'Vitamin B6', 'Folate'],
    minerals: ['Potassium', 'Magnesium'],
    benefits: ['Supports heart health', 'Good pre-workout energy', 'Aids digestion'],
    sideEffects: ['High in natural sugar — moderate for diabetics.'],
    howToEat: 'Fresh, smoothie, oatmeal topping, baking.'
  },
  {
    id: 6, name: 'Apple', bnName: 'আপেল', emoji: '🍎', category: 'Fruit',
    calories: 52, protein: 0.3, fat: 0.2, carbs: 14, fiber: 2.4, sugar: 10, sodium: 1,
    vitaminC: 8, vitaminDDV: 0, calciumDV: 1, ironDV: 1, potassiumDV: 2,
    vitamins: ['Vitamin C', 'Vitamin K'],
    minerals: ['Potassium'],
    benefits: ['Supports heart health', 'Aids digestion', 'Rich in fiber'],
    sideEffects: ['Seeds contain trace cyanide compounds — avoid chewing seeds.'],
    howToEat: 'Fresh, salad, baked, juice.'
  },
  {
    id: 7, name: 'Broccoli', bnName: 'ব্রকলি', emoji: '🥦', category: 'Vegetable',
    calories: 34, protein: 2.8, fat: 0.4, carbs: 7, fiber: 2.6, sugar: 1.7, sodium: 33,
    vitaminC: 135, vitaminDDV: 0, calciumDV: 5, ironDV: 4, potassiumDV: 8,
    vitamins: ['Vitamin C', 'Vitamin K', 'Folate'],
    minerals: ['Potassium', 'Iron', 'Calcium'],
    benefits: ['Supports immunity', 'Rich in antioxidants', 'Supports bone health'],
    sideEffects: ['May cause bloating in large amounts.'],
    howToEat: 'Steamed, roasted, stir-fried, salad.'
  },
  {
    id: 8, name: 'Almond', bnName: 'কাঠবাদাম', emoji: '🌰', category: 'Nut',
    calories: 579, protein: 21, fat: 50, carbs: 22, fiber: 12.5, sugar: 4.4, sodium: 1,
    vitaminC: 0, vitaminDDV: 0, calciumDV: 27, ironDV: 20, potassiumDV: 17,
    vitamins: ['Vitamin E', 'Vitamin B2'],
    minerals: ['Calcium', 'Iron', 'Magnesium', 'Potassium'],
    benefits: ['Supports heart health', 'Good for skin', 'Rich in healthy fats'],
    sideEffects: ['High calorie density — watch portion size.', 'Tree nut allergy risk.'],
    howToEat: 'Raw, roasted, almond milk, snacks.'
  }
];

let users = [
  { id: 1, email: 'admin@nutriverse.com', password: 'admin123', role: 'admin' }
];

let favorites = [1, 4];

// ---------------------------------------------------------------------------
// Foods API
// ---------------------------------------------------------------------------
app.get('/api/foods', (req, res) => {
  const q = (req.query.q || '').toLowerCase().trim();
  const category = (req.query.category || '').toLowerCase().trim();
  let result = foods;
  if (q) result = result.filter(f => f.name.toLowerCase().includes(q) || f.bnName.includes(q));
  if (category && category !== 'all') result = result.filter(f => f.category.toLowerCase() === category);
  res.json(result);
});
}

module.exports = app;

app.get('/api/categories', (req, res) => {
  res.json([...new Set(foods.map(f => f.category))]);
});

app.get('/api/foods/:id', (req, res) => {
  const food = foods.find(f => f.id === Number(req.params.id));
  if (!food) return res.status(404).json({ error: 'Food not found' });
  res.json(food);
});

app.post('/api/foods', (req, res) => {
  const food = { id: nextId++, vitamins: [], minerals: [], benefits: [], sideEffects: [], ...req.body };
  foods.push(food);
  res.status(201).json(food);
});

app.put('/api/foods/:id', (req, res) => {
  const idx = foods.findIndex(f => f.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Food not found' });
  foods[idx] = { ...foods[idx], ...req.body, id: foods[idx].id };
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
  if (!foods.some(f => f.id === id)) return res.status(404).json({ error: 'Food not found' });
  if (!favorites.includes(id)) favorites.push(id);
  res.json({ success: true, favorites });
});

app.delete('/api/favorites/:id', (req, res) => {
  const id = Number(req.params.id);
  favorites = favorites.filter(f => f !== id);
  res.json({ success: true, favorites });
});

// ---------------------------------------------------------------------------
// Daily Vitamin Calculator API (simplified demo RDA logic)
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

  const estimatedIntakePercent = Math.min(100, Math.round((weight / (age + weight)) * 120));

  res.json({ age, gender, weight, recommended, estimatedIntakePercent });
});

// ---------------------------------------------------------------------------
// Auth API (demo only)
// ---------------------------------------------------------------------------
app.post('/api/login', (req, res) => {
  const { email, password } = req.body || {};
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid email or password' });
  res.json({ success: true, token: `demo-token-${user.id}`, user: { id: user.id, email: user.email, role: user.role } });
});

// ---------------------------------------------------------------------------
// Admin stats API
// ---------------------------------------------------------------------------
app.get('/api/stats', (req, res) => {
  const categories = new Set(foods.map(f => f.category));
  res.json({ foods: foods.length, users: users.length, categories: categories.size });
});

app.listen(PORT, () => console.log(`NutriVerse server running on http://localhost:${PORT}`));
