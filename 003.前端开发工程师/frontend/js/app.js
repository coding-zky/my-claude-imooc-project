/* ============================================================
   记账本 — 应用层
   多页面共享逻辑：导航 / 记账弹窗 / 渲染 / 交互 / 认证
   每个页面通过 <body data-page="..."> 标识自身
   ============================================================ */

const App = {
  state: {
    page: null,
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth() + 1,
    editingTxId: null,
    selectedCatId: null,
    txType: 'expense',
    pinInput: '',
    pinAttempts: 0,
    pinLockedUntil: null,
  },

  /* ---- 初始化入口 ---- */
  init() {
    this.state.page = document.body.dataset.page;

    if (this.state.page === 'register') {
      this.createToast();
      this.bindRegisterForm();
      return;
    }

    if (this.state.page === 'login') {
      this.createToast();
      this.initLoginPage();
      return;
    }

    // 主页面：鉴权检查
    if (!this.checkAuth()) return;

    // 创建共享 UI 组件
    this.createToast();
    this.createBottomNav();
    this.createModal();
    this.createConfirmOverlay();

    // 绑定全局事件
    this.bindNav();
    this.bindModal();
    this.bindMonthPicker();
    this.bindDeleteHandler();

    // 渲染页面内容
    this.renderPage();

    // 页面专属绑定
    if (this.state.page === 'budget') this.bindBudgetForm();
    if (this.state.page === 'settings') {
      this.bindCategoryManage();
      this.bindSettingsActions();
    }
  },

  /* ---- 鉴权 ---- */
  checkAuth() {
    const profile = getUserProfile();
    if (!profile) {
      window.location.href = 'register.html';
      return false;
    }
    if (profile.pin && !isLoggedIn()) {
      window.location.href = 'login.html';
      return false;
    }
    if (!isLoggedIn()) login();
    return true;
  },

  /* ========== 动态创建共享组件 ========== */

  createToast() {
    const el = document.createElement('div');
    el.id = 'toast';
    el.className = 'toast';
    document.body.appendChild(el);
  },

  createBottomNav() {
    const page = this.state.page;
    const items = [
      { id: 'home',      label: '首页', href: 'home.html' },
      { id: 'dashboard', label: '统计', href: 'dashboard.html' },
      { id: 'add',       label: '记账', href: null },
      { id: 'budget',    label: '预算', href: 'budget.html' },
      { id: 'settings',  label: '我的', href: 'settings.html' },
    ];

    const nav = document.createElement('nav');
    nav.id = 'bottom-nav';
    nav.className = 'bottom-nav';

    nav.innerHTML = items.map(item => {
      const isActive = item.id === page;
      const activeClass = isActive ? ' active' : '';
      const addClass = item.id === 'add' ? ' add-btn' : '';
      const labelText = item.id === 'add' ? '' : `<span>${item.label}</span>`;

      if (item.href) {
        return `<a href="${item.href}" class="nav-item${activeClass}${addClass}" data-page="${item.id}" aria-label="${item.label}">
          <span class="nav-icon">${this._navIconSVG(item.id)}</span>
          ${labelText}
        </a>`;
      }
      return `<button class="nav-item${activeClass}${addClass}" data-page="${item.id}" aria-label="${item.label}">
        <span class="nav-icon">${this._navIconSVG(item.id)}</span>
        ${labelText}
      </button>`;
    }).join('');

    document.getElementById('app').appendChild(nav);
  },

  _navIconSVG(id) {
    switch (id) {
      case 'home':
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>`;
      case 'dashboard':
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>`;
      case 'add':
        return `<span class="fab">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </span>`;
      case 'budget':
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 6v6l4 2"/>
        </svg>`;
      case 'settings':
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>`;
      default: return '';
    }
  },

  createModal() {
    const overlay = document.createElement('div');
    overlay.id = 'modal-overlay';
    overlay.className = 'modal-overlay hidden';
    overlay.innerHTML = `
      <div class="modal-sheet">
        <div class="modal-handle"></div>
        <div class="modal-title" id="modal-title">记一笔</div>
        <div class="type-toggle">
          <button class="active" data-type="expense">支出</button>
          <button data-type="income">收入</button>
        </div>
        <div class="amount-input-group">
          <label>金额</label>
          <div class="amount-input-row">
            <span class="currency">¥</span>
            <input type="text" id="tx-amount" placeholder="0.00" inputmode="decimal" autocomplete="off"/>
          </div>
        </div>
        <label style="font-size:0.75rem;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-secondary);display:block;margin-bottom:var(--space-sm);">选择分类</label>
        <div class="category-scroll" id="cat-chips"></div>
        <div class="form-row">
          <div>
            <label for="tx-date">日期</label>
            <input type="date" id="tx-date"/>
          </div>
          <div>
            <label for="tx-note">备注</label>
            <input type="text" id="tx-note" placeholder="添加备注..." maxlength="200"/>
          </div>
        </div>
        <button class="btn btn-primary" id="btn-save-tx">记一笔</button>
        <button id="modal-close" style="position:absolute;top:var(--space);right:var(--space);background:none;border:none;font-size:1.5rem;cursor:pointer;color:var(--text-tertiary);line-height:1;padding:4px;" aria-label="关闭">✕</button>
      </div>
    `;
    document.getElementById('app').appendChild(overlay);
  },

  createConfirmOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'confirm-overlay';
    overlay.className = 'confirm-overlay hidden';
    overlay.innerHTML = `
      <div class="confirm-dialog">
        <p>确定要删除这笔账单吗？<br/>此操作不可恢复。</p>
        <div class="btn-group">
          <button class="btn" id="btn-cancel-delete" style="background:var(--surface-hover);color:var(--text);">取消</button>
          <button class="btn btn-primary" id="btn-confirm-delete" style="background:var(--expense);">确认删除</button>
        </div>
      </div>
    `;
    document.getElementById('app').appendChild(overlay);
  },

  /* ---- 底部导航交互 ---- */
  bindNav() {
    document.querySelectorAll('.nav-item[data-page]').forEach(item => {
      item.addEventListener('click', (e) => {
        const page = item.dataset.page;
        if (page === 'add') {
          e.preventDefault();
          this.openAddModal();
        }
      });
    });
  },

  /* ---- 月份选择器 ---- */
  bindMonthPicker() {
    document.querySelectorAll('.month-picker').forEach(picker => {
      picker.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        const action = btn.dataset.monthAction;
        if (action === 'prev') {
          this.state.currentMonth--;
          if (this.state.currentMonth < 1) { this.state.currentMonth = 12; this.state.currentYear--; }
        } else if (action === 'next') {
          this.state.currentMonth++;
          if (this.state.currentMonth > 12) { this.state.currentMonth = 1; this.state.currentYear++; }
        } else if (action === 'today') {
          this.state.currentMonth = new Date().getMonth() + 1;
          this.state.currentYear = new Date().getFullYear();
        }
        this.renderPage();
      });
    });
  },

  /* ---- 统一渲染 ---- */
  renderPage() {
    this.updateMonthDisplays();
    switch (this.state.page) {
      case 'home':      this.renderHome();      break;
      case 'dashboard': this.renderStats();     break;
      case 'budget':    this.renderBudget();    break;
      case 'settings':  this.renderSettings();  break;
    }
  },

  updateMonthDisplays() {
    document.querySelectorAll('.month-label').forEach(el => {
      el.textContent = `${this.state.currentYear}年${this.state.currentMonth}月`;
    });
  },

  /* ========== 首页渲染 ========== */
  renderHome() {
    const todaySummary = getTodaySummary();
    const monthSummary = getMonthSummary(this.state.currentYear, this.state.currentMonth);

    const todayExpense = document.getElementById('today-expense');
    const todayIncome = document.getElementById('today-income');
    const monthExpense = document.getElementById('month-expense');
    const monthIncome = document.getElementById('month-income');

    if (todayExpense) todayExpense.textContent = '¥ ' + todaySummary.expense.toFixed(2);
    if (todayIncome) todayIncome.textContent = '¥ ' + todaySummary.income.toFixed(2);
    if (monthExpense) monthExpense.textContent = '¥ ' + monthSummary.expense.toFixed(2);
    if (monthIncome) monthIncome.textContent = '¥ ' + monthSummary.income.toFixed(2);

    const profile = getUserProfile();
    const nameEl = document.getElementById('greeting-name');
    if (nameEl) nameEl.textContent = profile ? profile.nickname : '用户';

    document.getElementById('greeting-avatar') && (document.getElementById('greeting-avatar').textContent = profile?.avatar || '👤');

    this.renderTransactionList();
  },

  renderTransactionList() {
    const container = document.getElementById('tx-list');
    if (!container) return;
    const groups = getTransactionsGroupedByDate(this.state.currentYear, this.state.currentMonth);

    if (!groups.length) {
      container.innerHTML = `<div class="empty-state"><div class="empty-icon">📋</div><p>本月暂无流水记录</p></div>`;
      return;
    }

    container.innerHTML = groups.map(([date, txs]) => `
      <div class="date-group">
        <div class="date-group-header">${this.formatDate(date)}</div>
        ${txs.map(tx => `
          <div class="tx-item" data-id="${tx.id}" data-date="${tx.date}">
            <div class="cat-icon">${tx.category?.icon || '💸'}</div>
            <div class="tx-info">
              <div class="tx-cat">${tx.category?.name || '未知'}</div>
              ${tx.note ? `<div class="tx-note">${this.escapeHtml(tx.note)}</div>` : ''}
            </div>
            <div class="tx-amount ${tx.type}">
              ${tx.type === 'expense' ? '-' : '+'}¥${tx.amount.toFixed(2)}
            </div>
            <div class="delete-hint">删除</div>
          </div>
        `).join('')}
      </div>
    `).join('');

    container.querySelectorAll('.tx-item').forEach(el => {
      el.addEventListener('click', () => {
        if (el.classList.contains('swiped')) {
          el.classList.remove('swiped');
          return;
        }
        this.openEditModal(el.dataset.id);
      });
    });

    this.bindSwipeDelete(container);
  },

  bindSwipeDelete(container) {
    let startX = 0, currentItem = null;

    container.addEventListener('touchstart', (e) => {
      const item = e.target.closest('.tx-item');
      if (!item) return;
      container.querySelectorAll('.tx-item.swiped').forEach(el => {
        if (el !== item) el.classList.remove('swiped');
      });
      startX = e.touches[0].clientX;
      currentItem = item;
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
      if (!currentItem) return;
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      if (diff > 60) {
        currentItem.classList.add('swiped');
      } else if (diff < -20) {
        currentItem.classList.remove('swiped');
      }
      currentItem = null;
    });

    container.addEventListener('click', (e) => {
      const hint = e.target.closest('.delete-hint');
      if (!hint) return;
      const item = hint.closest('.tx-item');
      if (item) this.confirmDelete(item.dataset.id);
    });
  },

  formatDate(dateStr) {
    const d = new Date(dateStr);
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return `${d.getMonth() + 1}月${d.getDate()}日 ${weekDays[d.getDay()]}`;
  },

  /* ========== 统计页渲染 ========== */
  renderStats() {
    this.renderPieChart();
    this.renderRankList();
  },

  renderPieChart() {
    const stats = getCategoryStats(this.state.currentYear, this.state.currentMonth);
    const total = stats.reduce((s, i) => s + i.amount, 0);
    const container = document.getElementById('pie-container');
    if (!container) return;

    const totalEl = document.getElementById('total-spending');
    if (!stats.length || total === 0) {
      container.innerHTML = '<div class="empty-state"><div class="empty-icon">📊</div><p>本月暂无支出数据</p></div>';
      if (totalEl) totalEl.textContent = '¥ 0.00';
      return;
    }

    if (totalEl) totalEl.textContent = '¥ ' + total.toFixed(2);

    const colors = ['#0F172A', '#1E3A8A', '#A16207', '#475569', '#DC2626', '#94A3B8',
                    '#1E293B', '#2563EB', '#CA8A04', '#64748B', '#059669', '#CBD5E1'];
    let cumulative = 0;
    const segments = stats.map((item, i) => {
      const start = cumulative;
      const pct = total > 0 ? (item.amount / total) * 100 : 0;
      cumulative += pct;
      return { ...item, pct, start, color: colors[i % colors.length] };
    });

    const gradient = segments.map(s =>
      `${s.color} ${s.start}% ${s.start + s.pct}%`
    ).join(', ');

    container.innerHTML = `
      <div style="width:200px;height:200px;margin:0 auto;position:relative;">
        <div style="width:100%;height:100%;border-radius:50%;background:conic-gradient(${gradient});position:relative;">
          <div style="position:absolute;top:25%;left:25%;width:50%;height:50%;border-radius:50%;background:var(--surface);"></div>
        </div>
      </div>
      <div style="margin-top:var(--space);display:flex;flex-wrap:wrap;gap:8px;justify-content:center;">
        ${segments.map(s => `
          <div style="display:flex;align-items:center;gap:4px;font-size:0.75rem;">
            <span style="width:10px;height:10px;border-radius:2px;background:${s.color};display:inline-block;"></span>
            <span>${s.name} ${s.pct.toFixed(1)}%</span>
          </div>
        `).join('')}
      </div>
    `;
  },

  renderRankList() {
    const stats = getCategoryStats(this.state.currentYear, this.state.currentMonth);
    const total = stats.reduce((s, i) => s + i.amount, 0);
    const container = document.getElementById('rank-list');
    if (!container) return;

    const top5 = stats.slice(0, 5);
    if (!top5.length) {
      container.innerHTML = '';
      return;
    }

    const maxAmount = top5[0]?.amount || 1;

    container.innerHTML = top5.map((item, i) => `
      <div class="rank-item">
        <div class="rank-num">${String(i + 1).padStart(2, '0')}</div>
        <div class="rank-icon">${item.icon}</div>
        <div class="rank-info">
          <div class="rank-name">${item.name}</div>
          <div class="rank-bar-bg">
            <div class="rank-bar-fill" style="width:${(item.amount / maxAmount * 100).toFixed(0)}%;"></div>
          </div>
        </div>
        <div class="rank-amount">¥${item.amount.toFixed(0)}</div>
      </div>
    `).join('');
  },

  /* ========== 预算页渲染 ========== */
  renderBudget() {
    const budget = getBudget(this.state.currentYear, this.state.currentMonth);
    const monthSummary = getMonthSummary(this.state.currentYear, this.state.currentMonth);
    const spent = monthSummary.expense;
    const total = budget ? budget.amount : 0;
    const pct = total > 0 ? Math.min((spent / total) * 100, 100) : 0;
    const remaining = Math.max(total - spent, 0);

    const input = document.getElementById('budget-amount-input');
    if (input) input.value = budget ? budget.amount : '';

    const ring = document.getElementById('budget-ring');
    if (ring) {
      const circumference = 2 * Math.PI * 90;
      const dash = (pct / 100) * circumference;
      ring.innerHTML = `
        <svg width="200" height="200" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="none" stroke="var(--border)" stroke-width="12"/>
          <circle cx="100" cy="100" r="90" fill="none" stroke="${pct >= 100 ? 'var(--expense)' : 'var(--primary)'}"
                  stroke-width="12" stroke-linecap="round"
                  stroke-dasharray="${dash} ${circumference - dash}"
                  style="transition: stroke-dasharray 0.6s ease;"/>
        </svg>
        <div class="center-text">
          <div class="pct" style="color:${pct >= 100 ? 'var(--expense)' : 'var(--text)'}">${pct.toFixed(1)}%</div>
          <div class="label-sm">已使用</div>
          <div style="font-size:0.85rem;margin-top:4px;font-weight:600;">¥${spent.toFixed(0)} / ¥${total.toFixed(0)}</div>
        </div>
      `;
    }

    const remainingEl = document.getElementById('budget-remaining');
    if (remainingEl) remainingEl.textContent = '¥ ' + remaining.toFixed(2);

    const dailyEl = document.getElementById('budget-daily');
    if (dailyEl) {
      const daysInMonth = new Date(this.state.currentYear, this.state.currentMonth, 0).getDate();
      const today = new Date().getDate();
      const daysLeft = daysInMonth - today + 1;
      dailyEl.textContent = '¥ ' + (daysLeft > 0 ? (remaining / Math.max(daysLeft, 1)).toFixed(2) : '0.00');
    }

    const warning = document.getElementById('budget-warning');
    if (warning) warning.style.display = pct >= 90 ? 'flex' : 'none';
  },

  /* ========== 设置页渲染 ========== */
  renderSettings() {
    const profile = getUserProfile();
    if (profile) {
      const avatarEl = document.getElementById('settings-avatar');
      const nameEl = document.getElementById('settings-nickname');
      const pinEl = document.getElementById('settings-pin-status');
      if (avatarEl) avatarEl.textContent = profile.avatar || '👤';
      if (nameEl) nameEl.textContent = profile.nickname;
      if (pinEl) pinEl.textContent = profile.pin ? '已设置' : '未设置';
    }
    this.renderCategoryManageList();
  },

  renderCategoryManageList() {
    const container = document.getElementById('cat-mgmt-list');
    if (!container) return;
    const categories = getCategories().filter(c => !c.isDefault);
    if (!categories.length) {
      container.innerHTML = '<div style="padding:var(--space);color:var(--text-tertiary);font-size:0.85rem;text-align:center;">暂无自定义分类</div>';
      return;
    }
    container.innerHTML = categories.map(c => `
      <div class="cat-mgmt-item">
        <span style="font-size:1.2rem;">${c.icon}</span>
        <span class="cat-name">${c.name}</span>
        <span style="font-size:0.7rem;color:var(--text-tertiary);">${c.type === 'expense' ? '支出' : '收入'}</span>
        <button class="delete-btn" data-cat-id="${c.id}">✕</button>
      </div>
    `).join('');
  },

  bindCategoryManage() {
    document.getElementById('cat-mgmt-list')?.addEventListener('click', (e) => {
      const btn = e.target.closest('.delete-btn');
      if (!btn) return;
      const id = btn.dataset.catId;
      if (confirm('删除此分类？该分类下的交易将迁移到"其他"分类。')) {
        deleteCategory(id);
        this.renderCategoryManageList();
        this.toast('分类已删除');
      }
    });

    document.getElementById('add-cat-btn')?.addEventListener('click', () => {
      const name = document.getElementById('new-cat-name')?.value.trim();
      const icon = document.getElementById('new-cat-icon')?.value.trim() || '📌';
      const type = document.getElementById('new-cat-type')?.value || 'expense';
      if (!name) { this.toast('请输入分类名称'); return; }
      addCategory(name, icon, type);
      this.renderCategoryManageList();
      const nameInput = document.getElementById('new-cat-name');
      if (nameInput) nameInput.value = '';
      this.toast('分类已添加');
    });
  },

  bindSettingsActions() {
    document.getElementById('btn-edit-nickname')?.addEventListener('click', () => {
      const profile = getUserProfile();
      if (!profile) return;
      const newName = prompt('请输入新昵称（1-12字符）：', profile.nickname);
      if (newName && newName.trim()) {
        profile.nickname = newName.trim().slice(0, 12);
        profile.updated_at = new Date().toISOString();
        saveUserProfile(profile);
        this.renderSettings();
        this.toast('昵称已更新');
      }
    });

    document.getElementById('btn-edit-avatar')?.addEventListener('click', () => {
      this.openAvatarPicker();
    });

    document.getElementById('btn-edit-pin')?.addEventListener('click', () => {
      const profile = getUserProfile();
      if (!profile) return;
      if (profile.pin) {
        if (confirm('确定要移除 PIN 码保护吗？')) {
          profile.pin = '';
          profile.updated_at = new Date().toISOString();
          saveUserProfile(profile);
          this.renderSettings();
          this.toast('PIN 码已移除');
        }
      } else {
        const newPin = prompt('请设置 4-6 位数字 PIN 码：');
        if (newPin && /^\d{4,6}$/.test(newPin)) {
          profile.pin = this.hashPin(newPin);
          profile.updated_at = new Date().toISOString();
          saveUserProfile(profile);
          this.renderSettings();
          this.toast('PIN 码已设置');
        } else if (newPin) {
          this.toast('PIN 码格式不正确（4-6位数字）');
        }
      }
    });

    document.getElementById('btn-logout')?.addEventListener('click', () => {
      if (confirm('确定要退出登录吗？')) {
        logout();
        window.location.href = 'login.html';
      }
    });

    document.getElementById('btn-reset')?.addEventListener('click', () => {
      if (confirm('⚠️ 重置将删除所有数据，此操作不可恢复！\n\n确定要继续吗？')) {
        localStorage.removeItem('finance_tracker');
        localStorage.removeItem('finance_user');
        _data = null;
        _userProfile = null;
        window.location.href = 'register.html';
      }
    });
  },

  /* ========== 记账弹窗 ========== */
  bindModal() {
    const overlay = document.getElementById('modal-overlay');
    if (!overlay) return;

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this.closeModal();
    });
    document.getElementById('modal-close')?.addEventListener('click', () => this.closeModal());

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !overlay.classList.contains('hidden')) this.closeModal();
    });

    overlay.querySelectorAll('.type-toggle button').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.txType = btn.dataset.type;
        overlay.querySelectorAll('.type-toggle button').forEach(b => {
          b.classList.toggle('active', b.dataset.type === this.state.txType);
        });
        this.renderModalCategories();
      });
    });

    document.getElementById('btn-save-tx')?.addEventListener('click', () => this.saveTransaction());
  },

  openAddModal() {
    this.state.editingTxId = null;
    this.state.txType = 'expense';
    this.state.selectedCatId = null;

    const titleEl = document.getElementById('modal-title');
    if (titleEl) titleEl.textContent = '记一笔';
    const amountEl = document.getElementById('tx-amount');
    if (amountEl) amountEl.value = '';
    const dateEl = document.getElementById('tx-date');
    if (dateEl) dateEl.value = new Date().toISOString().split('T')[0];
    const noteEl = document.getElementById('tx-note');
    if (noteEl) noteEl.value = '';

    document.querySelectorAll('#modal-overlay .type-toggle button').forEach(b => {
      b.classList.toggle('active', b.dataset.type === 'expense');
    });

    this.renderModalCategories();
    document.getElementById('modal-overlay').classList.remove('hidden');

    setTimeout(() => document.getElementById('tx-amount')?.focus(), 350);
  },

  openEditModal(id) {
    const tx = _load().transactions.find(t => t.id === id);
    if (!tx) return;

    this.state.editingTxId = id;
    this.state.txType = tx.type;
    this.state.selectedCatId = tx.categoryId;

    const titleEl = document.getElementById('modal-title');
    if (titleEl) titleEl.textContent = '编辑账单';
    const amountEl = document.getElementById('tx-amount');
    if (amountEl) amountEl.value = tx.amount;
    const dateEl = document.getElementById('tx-date');
    if (dateEl) dateEl.value = tx.date;
    const noteEl = document.getElementById('tx-note');
    if (noteEl) noteEl.value = tx.note || '';

    document.querySelectorAll('#modal-overlay .type-toggle button').forEach(b => {
      b.classList.toggle('active', b.dataset.type === tx.type);
    });

    this.renderModalCategories();
    document.getElementById('modal-overlay').classList.remove('hidden');

    setTimeout(() => document.getElementById('tx-amount')?.focus(), 350);
  },

  closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
    this.state.editingTxId = null;
    this.state.selectedCatId = null;
  },

  renderModalCategories() {
    const container = document.getElementById('cat-chips');
    if (!container) return;
    const cats = getCategories(this.state.txType);

    if (!this.state.selectedCatId && cats.length) {
      this.state.selectedCatId = cats[0].id;
    }

    container.innerHTML = cats.map(c => `
      <button class="cat-chip${c.id === this.state.selectedCatId ? ' selected' : ''}"
              data-cat-id="${c.id}" type="button">
        <span class="chip-icon">${c.icon}</span>
        <span>${c.name}</span>
      </button>
    `).join('');

    container.querySelectorAll('.cat-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        this.state.selectedCatId = chip.dataset.catId;
        container.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
      });
    });
  },

  saveTransaction() {
    const amount = parseFloat(document.getElementById('tx-amount')?.value);
    const date = document.getElementById('tx-date')?.value;
    const note = document.getElementById('tx-note')?.value.trim() || '';

    if (!amount || amount <= 0) { this.toast('请输入有效金额'); return; }
    if (!this.state.selectedCatId) { this.toast('请选择一个分类'); return; }
    if (!date) { this.toast('请选择日期'); return; }

    if (this.state.editingTxId) {
      updateTransaction(this.state.editingTxId, {
        type: this.state.txType,
        amount,
        categoryId: this.state.selectedCatId,
        date,
        note,
      });
      this.toast('账单已更新');
    } else {
      addTransaction(this.state.txType, amount, this.state.selectedCatId, date, note);
      this.toast('记账成功 ✓');
    }

    this.closeModal();
    this.renderPage();
  },

  /* ========== 删除确认 ========== */
  bindDeleteHandler() {
    document.getElementById('btn-confirm-delete')?.addEventListener('click', () => {
      const id = document.getElementById('confirm-overlay').dataset.txId;
      if (id) {
        deleteTransaction(id);
        this.toast('已删除');
      }
      document.getElementById('confirm-overlay').classList.add('hidden');
      this.renderPage();
    });

    document.getElementById('btn-cancel-delete')?.addEventListener('click', () => {
      document.getElementById('confirm-overlay').classList.add('hidden');
    });

    document.getElementById('confirm-overlay')?.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) {
        document.getElementById('confirm-overlay').classList.add('hidden');
      }
    });
  },

  confirmDelete(id) {
    const overlay = document.getElementById('confirm-overlay');
    overlay.dataset.txId = id;
    overlay.classList.remove('hidden');
  },

  /* ========== 预算表单 ========== */
  bindBudgetForm() {
    document.getElementById('btn-save-budget')?.addEventListener('click', () => {
      const amount = parseFloat(document.getElementById('budget-amount-input')?.value);
      if (!amount || amount <= 0) { this.toast('请输入有效的预算金额'); return; }
      setBudget(this.state.currentYear, this.state.currentMonth, amount);
      this.renderBudget();
      this.toast('预算已保存 ✓');
    });
  },

  /* ========== 注册表单 ========== */
  bindRegisterForm() {
    document.getElementById('btn-register')?.addEventListener('click', () => {
      const nickname = document.getElementById('reg-nickname')?.value.trim();
      if (!nickname) { this.toast('请输入昵称'); return; }
      if (nickname.length > 12) { this.toast('昵称最多12个字符'); return; }

      const avatar = document.querySelector('.avatar-option.selected')?.dataset.avatar || '👤';
      const pin = document.getElementById('reg-pin')?.value || '';

      if (pin && !/^\d{4,6}$/.test(pin)) { this.toast('PIN 码为 4-6 位数字或留空'); return; }

      const profile = {
        id: 'user_' + Date.now(),
        nickname,
        avatar,
        pin: pin ? this.hashPin(pin) : '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      saveUserProfile(profile);

      if (pin) {
        this.toast('注册成功！请登录');
        setTimeout(() => { window.location.href = 'login.html'; }, 600);
      } else {
        login();
        this.toast(`欢迎，${nickname}！`);
        setTimeout(() => { window.location.href = 'home.html'; }, 600);
      }
    });

    document.querySelectorAll('.avatar-option').forEach(opt => {
      opt.addEventListener('click', () => {
        document.querySelectorAll('.avatar-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
      });
    });
  },

  /* ========== 登录页 ========== */
  initLoginPage() {
    const profile = getUserProfile();
    if (!profile) {
      window.location.href = 'register.html';
      return;
    }

    const avatarEl = document.getElementById('login-avatar');
    const nameEl = document.getElementById('login-nickname');
    if (avatarEl) avatarEl.textContent = profile.avatar || '👤';
    if (nameEl) nameEl.textContent = profile.nickname;

    this.state.pinInput = '';
    this.state.pinAttempts = 0;
    this.updatePinDots();
    this.bindPinKeypad();
    this.bindForgotPin();
  },

  bindPinKeypad() {
    document.getElementById('pin-keypad')?.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const key = btn.dataset.key;
      if (key === 'delete') {
        this.state.pinInput = this.state.pinInput.slice(0, -1);
      } else if (key === 'confirm') {
        this.verifyPin();
        return;
      } else if (key) {
        if (this.state.pinInput.length < 6) {
          this.state.pinInput += key;
        }
        const profile = getUserProfile();
        if (profile && this.state.pinInput.length === profile.pin.length) {
          setTimeout(() => this.verifyPin(), 200);
        }
      }
      this.updatePinDots();
    });
  },

  bindForgotPin() {
    document.getElementById('btn-forgot-pin')?.addEventListener('click', () => {
      if (confirm('⚠️ 重置将删除所有数据，此操作不可恢复！\n\n确定要继续吗？')) {
        localStorage.removeItem('finance_tracker');
        localStorage.removeItem('finance_user');
        _data = null;
        _userProfile = null;
        window.location.href = 'register.html';
      }
    });
  },

  updatePinDots() {
    const profile = getUserProfile();
    const pinLen = profile ? profile.pin.length : 6;
    const dots = document.getElementById('pin-dots');
    if (!dots) return;
    dots.innerHTML = Array.from({ length: pinLen }, (_, i) =>
      `<div class="pin-dot${i < this.state.pinInput.length ? ' filled' : ''}"></div>`
    ).join('');
  },

  verifyPin() {
    const profile = getUserProfile();
    if (!profile) return;

    if (Date.now() < this.state.pinLockedUntil) {
      const remain = Math.ceil((this.state.pinLockedUntil - Date.now()) / 1000);
      this.toast(`请等待 ${remain} 秒后再试`);
      return;
    }

    if (this.hashPin(this.state.pinInput) === profile.pin) {
      login();
      this.toast(`欢迎回来，${profile.nickname}！`);
      setTimeout(() => { window.location.href = 'home.html'; }, 400);
    } else {
      this.state.pinAttempts++;
      document.querySelectorAll('#pin-dots .pin-dot').forEach(d => d.classList.add('error'));
      setTimeout(() => {
        document.querySelectorAll('#pin-dots .pin-dot').forEach(d => d.classList.remove('error'));
      }, 400);

      if (this.state.pinAttempts >= 5) {
        this.state.pinLockedUntil = Date.now() + 30000;
        this.toast('错误次数过多，请等待 30 秒');
      } else {
        this.toast(`PIN 码错误，剩余 ${5 - this.state.pinAttempts} 次机会`);
      }
      this.state.pinInput = '';
      this.updatePinDots();
    }
  },

  hashPin(pin) {
    let hash = 0;
    for (let i = 0; i < pin.length; i++) {
      const char = pin.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return 'hash_' + Math.abs(hash).toString(16);
  },

  /* ========== 头像选择器 ========== */
  openAvatarPicker() {
    const profile = getUserProfile();
    if (!profile) return;
    const avatars = ['👤', '🐱', '🐶', '🐼', '🦊', '🐰'];
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center;">
        ${avatars.map(a => `
          <div class="avatar-option${profile.avatar === a ? ' selected' : ''}" data-avatar="${a}"
               style="width:56px;height:56px;font-size:1.8rem;cursor:pointer;">
            ${a}
          </div>
        `).join('')}
      </div>
    `;
    wrapper.querySelectorAll('.avatar-option').forEach(opt => {
      opt.addEventListener('click', () => {
        profile.avatar = opt.dataset.avatar;
        profile.updated_at = new Date().toISOString();
        saveUserProfile(profile);
        this.renderSettings();
        this.toast('头像已更新');
        document.querySelector('.avatar-picker-overlay')?.remove();
      });
    });

    const overlay = document.createElement('div');
    overlay.className = 'confirm-overlay avatar-picker-overlay';
    overlay.innerHTML = `<div class="confirm-dialog"><h3 style="margin-bottom:16px;">选择头像</h3></div>`;
    overlay.querySelector('.confirm-dialog').appendChild(wrapper);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
    });
    document.body.appendChild(overlay);
  },

  /* ========== 工具方法 ========== */
  toast(msg) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => el.classList.remove('show'), 1800);
  },

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },
};

/* ---- 入口 ---- */
document.addEventListener('DOMContentLoaded', () => App.init());
