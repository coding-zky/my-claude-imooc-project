/* ============================================================
   记账本 — 数据层
   localStorage 持久化 + sessionStorage 会话管理
   ============================================================ */

const STORAGE_KEY = 'finance_tracker';

const DEFAULT_CATEGORIES = [
  { id: 'cat_food',       name: '餐饮',   icon: '🍔', type: 'expense', isDefault: true, sortOrder: 1 },
  { id: 'cat_transport',  name: '交通',   icon: '🚇', type: 'expense', isDefault: true, sortOrder: 2 },
  { id: 'cat_shopping',   name: '购物',   icon: '🛒', type: 'expense', isDefault: true, sortOrder: 3 },
  { id: 'cat_entertain',  name: '娱乐',   icon: '🎮', type: 'expense', isDefault: true, sortOrder: 4 },
  { id: 'cat_housing',    name: '住房',   icon: '🏠', type: 'expense', isDefault: true, sortOrder: 5 },
  { id: 'cat_phone',      name: '通讯',   icon: '📱', type: 'expense', isDefault: true, sortOrder: 6 },
  { id: 'cat_medical',    name: '医疗',   icon: '💊', type: 'expense', isDefault: true, sortOrder: 7 },
  { id: 'cat_education',  name: '教育',   icon: '📚', type: 'expense', isDefault: true, sortOrder: 8 },
  { id: 'cat_social',     name: '人情',   icon: '🎁', type: 'expense', isDefault: true, sortOrder: 9 },
  { id: 'cat_other_exp',  name: '其他支出', icon: '💸', type: 'expense', isDefault: true, sortOrder: 10 },
  { id: 'cat_salary',     name: '工资',   icon: '💼', type: 'income', isDefault: true, sortOrder: 11 },
  { id: 'cat_parttime',   name: '兼职',   icon: '💰', type: 'income', isDefault: true, sortOrder: 12 },
  { id: 'cat_invest',     name: '理财',   icon: '📈', type: 'income', isDefault: true, sortOrder: 13 },
  { id: 'cat_refund',     name: '退款',   icon: '↩️', type: 'income', isDefault: true, sortOrder: 14 },
  { id: 'cat_other_inc',  name: '其他收入', icon: '💵', type: 'income', isDefault: true, sortOrder: 15 },
];

/* 生成模拟数据 */
function _generateId(prefix) {
  return prefix + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
}

function _generateCatId() {
  return 'cat_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
}

function _initSampleData() {
  const transactions = [];
  const today = new Date();
  const expCats = DEFAULT_CATEGORIES.filter(c => c.type === 'expense');
  const incCats = DEFAULT_CATEGORIES.filter(c => c.type === 'income');
  const amounts = [3.5, 5, 6, 8, 12, 15, 18, 22, 25, 28, 30, 35, 42, 48, 55, 68, 75, 88, 120, 158, 200, 350];

  for (let i = 30; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    const numExp = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < numExp; j++) {
      const cat = expCats[Math.floor(Math.random() * expCats.length)];
      const amount = amounts[Math.floor(Math.random() * amounts.length)];
      transactions.push({
        id: _generateId('tx_'),
        type: 'expense',
        amount,
        categoryId: cat.id,
        date: dateStr,
        note: ['', '午餐', '地铁通勤', '超市购物', '咖啡', '外卖', '打车', '文具', '水果', '电影票'][Math.floor(Math.random() * 10)],
        createdAt: dateStr + 'T10:00:00',
        updatedAt: dateStr + 'T10:00:00',
      });
    }

    if (i === 0 || i === 15 || i === 28) {
      const cat = incCats[Math.floor(Math.random() * incCats.length)];
      transactions.push({
        id: _generateId('tx_'),
        type: 'income',
        amount: [500, 15000, 2000][Math.floor(Math.random() * 3)],
        categoryId: cat.id,
        date: dateStr,
        note: '',
        createdAt: dateStr + 'T09:00:00',
        updatedAt: dateStr + 'T09:00:00',
      });
    }
  }

  return transactions;
}

/* 内存存储 */
let _data = null;
let _userProfile = null;

function _load() {
  if (_data) return _data;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) { _data = JSON.parse(raw); return _data; }
  } catch (e) { /* ignore */ }
  _data = {
    transactions: _initSampleData(),
    categories: JSON.parse(JSON.stringify(DEFAULT_CATEGORIES)),
    budget: null,
  };
  _save();
  return _data;
}

function _save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(_data));
  } catch (e) { /* ignore */ }
}

/* ---- 会话管理（sessionStorage 跨页面持久） ---- */
function isLoggedIn() {
  return sessionStorage.getItem('finance_session') === 'active';
}

function login() {
  sessionStorage.setItem('finance_session', 'active');
}

function logout() {
  sessionStorage.removeItem('finance_session');
}

/* ---- 用户档案 ---- */
function getUserProfile() {
  if (_userProfile) return _userProfile;
  try {
    const raw = localStorage.getItem('finance_user');
    if (raw) { _userProfile = JSON.parse(raw); return _userProfile; }
  } catch (e) { /* ignore */ }
  return null;
}

function saveUserProfile(profile) {
  _userProfile = profile;
  localStorage.setItem('finance_user', JSON.stringify(profile));
}

/* ---- 交易查询 ---- */
function getTransactionsByMonth(year, month) {
  const prefix = `${year}-${String(month).padStart(2, '0')}`;
  return _load().transactions
    .filter(t => t.date.startsWith(prefix))
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
}

function getTodayTransactions() {
  const today = new Date().toISOString().split('T')[0];
  return _load().transactions
    .filter(t => t.date === today)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

function getTodaySummary() {
  const txs = getTodayTransactions();
  return {
    expense: txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
    income: txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
  };
}

function getMonthSummary(year, month) {
  const txs = getTransactionsByMonth(year, month);
  return {
    expense: txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
    income: txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
    count: txs.length,
  };
}

function getCategoryStats(year, month) {
  const txs = getTransactionsByMonth(year, month);
  const categories = _load().categories;
  const map = {};
  for (const tx of txs) {
    if (tx.type !== 'expense') continue;
    map[tx.categoryId] = (map[tx.categoryId] || 0) + tx.amount;
  }
  return Object.entries(map)
    .map(([catId, amount]) => {
      const cat = categories.find(c => c.id === catId);
      return cat ? { categoryId: catId, name: cat.name, icon: cat.icon, amount } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.amount - a.amount);
}

function getTransactionsGroupedByDate(year, month) {
  const txs = getTransactionsByMonth(year, month);
  const categories = _load().categories;
  const groups = {};
  for (const tx of txs) {
    if (!groups[tx.date]) groups[tx.date] = [];
    const cat = categories.find(c => c.id === tx.categoryId);
    groups[tx.date].push({ ...tx, category: cat });
  }
  return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
}

/* ---- 分类 ---- */
function getCategories(type) {
  let cats = _load().categories;
  if (type) cats = cats.filter(c => c.type === type);
  return cats.sort((a, b) => a.sortOrder - b.sortOrder);
}

function addCategory(name, icon, type) {
  const data = _load();
  const cat = {
    id: _generateCatId(),
    name,
    icon: icon || (type === 'expense' ? '💸' : '💵'),
    type,
    isDefault: false,
    sortOrder: data.categories.length + 1,
  };
  data.categories.push(cat);
  _save();
  return cat;
}

function deleteCategory(id) {
  const data = _load();
  const cat = data.categories.find(c => c.id === id);
  if (!cat || cat.isDefault) return false;
  data.categories = data.categories.filter(c => c.id !== id);
  const fallbackId = cat.type === 'expense' ? 'cat_other_exp' : 'cat_other_inc';
  data.transactions.forEach(t => {
    if (t.categoryId === id) t.categoryId = fallbackId;
  });
  _save();
  return true;
}

/* ---- 交易 CRUD ---- */
function addTransaction(type, amount, categoryId, date, note) {
  const data = _load();
  const now = new Date().toISOString();
  const tx = {
    id: _generateId('tx_'),
    type,
    amount: parseFloat(amount),
    categoryId,
    date: date || new Date().toISOString().split('T')[0],
    note: note || '',
    createdAt: now,
    updatedAt: now,
  };
  data.transactions.unshift(tx);
  _save();
  return tx;
}

function updateTransaction(id, updates) {
  const data = _load();
  const idx = data.transactions.findIndex(t => t.id === id);
  if (idx === -1) return null;
  data.transactions[idx] = { ...data.transactions[idx], ...updates, updatedAt: new Date().toISOString() };
  _save();
  return data.transactions[idx];
}

function deleteTransaction(id) {
  const data = _load();
  data.transactions = data.transactions.filter(t => t.id !== id);
  _save();
}

/* ---- 预算 ---- */
function getBudget(year, month) {
  const b = _load().budget;
  return (b && b.year === year && b.month === month) ? b : null;
}

function setBudget(year, month, amount) {
  const data = _load();
  data.budget = { id: data.budget?.id || _generateId('budget_'), year, month, amount: parseFloat(amount) };
  _save();
  return data.budget;
}
