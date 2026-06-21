/**
 * EduVesting — Shared Data Layer (SUPABASE CLOUD VERSION)
 * ---------------------------------------------------------------
 */
const EduVesting = (() => {
  const GOALS_KEY = 'eduvesting_goals_v1';

  const ASSET_TYPES = {
    saham: { label: 'Saham', unit: 'lembar', unitFull: 'lembar', gradient: ['#6366f1', '#818cf8'], badgeBg: 'rgba(99,102,241,0.15)', badgeColor: '#a5b4fc', badgeBorder: 'rgba(99,102,241,0.25)', feeRate: 0.0019, livePrice: false },
    kripto: { label: 'Kripto', unit: 'koin', unitFull: 'koin', gradient: ['#f59e0b', '#fbbf24'], badgeBg: 'rgba(245,158,11,0.12)', badgeColor: '#fcd34d', badgeBorder: 'rgba(245,158,11,0.25)', feeRate: 0.001, livePrice: true },
    emas: { label: 'Emas', unit: 'gram', unitFull: 'gram', gradient: ['#d97706', '#fcd34d'], badgeBg: 'rgba(217,119,6,0.12)', badgeColor: '#fde68a', badgeBorder: 'rgba(217,119,6,0.3)', feeRate: 0.005, livePrice: false },
    reksadana: { label: 'Kas/RD', unit: 'unit', unitFull: 'unit penyertaan', gradient: ['#06b6d4', '#22d3ee'], badgeBg: 'rgba(6,182,212,0.1)', badgeColor: '#67e8f9', badgeBorder: 'rgba(6,182,212,0.25)', feeRate: 0.0, livePrice: false },
  };

  const COINGECKO_IDS = { BTC: 'bitcoin', ETH: 'ethereum', BNB: 'binancecoin', SOL: 'solana', USDT: 'tether', USDC: 'usd-coin', ADA: 'cardano', XRP: 'ripple', DOGE: 'dogecoin', MATIC: 'polygon-ecosystem-token', AVAX: 'avalanche-2', DOT: 'polkadot', LTC: 'litecoin', TRX: 'tron', LINK: 'chainlink' };

  async function _getUserId() {
    if (!window.supabaseClient) return null;
    const { data: { user } } = await window.supabaseClient.auth.getUser();
    return user ? user.id : null;
  }

  // ==========================================
  // CLOUD DATABASE: ASSETS (SUPABASE)
  // ==========================================
  async function getAssets() {
    if (!window.supabaseClient) return [];
    const { data, error } = await window.supabaseClient.from('assets').select('*').order('created_at', { ascending: true });
    if (error) return [];
    return data.map(a => ({
      id: a.id, type: a.type, ticker: a.ticker, name: a.name, avgPrice: Number(a.avg_price), qty: Number(a.qty), lastPrice: Number(a.last_price)
    }));
  }

  async function addAsset(asset) {
    const userId = await _getUserId();
    if (!userId) throw new Error("Anda belum login!");
    const { error } = await window.supabaseClient.from('assets').insert([{
      user_id: userId, type: asset.type, ticker: (asset.ticker || '').toUpperCase(), name: asset.name || asset.ticker, avg_price: Number(asset.avgPrice) || 0, qty: Number(asset.qty) || 0, last_price: Number(asset.lastPrice) > 0 ? Number(asset.lastPrice) : (Number(asset.avgPrice) || 0)
    }]);
    if (error) throw error;
  }

  async function updateAsset(id, patch) {
    const payload = {};
    if (patch.type) payload.type = patch.type;
    if (patch.ticker) payload.ticker = patch.ticker.toUpperCase();
    if (patch.name) payload.name = patch.name;
    if (patch.avgPrice !== undefined) payload.avg_price = Number(patch.avgPrice);
    if (patch.qty !== undefined) payload.qty = Number(patch.qty);
    if (patch.lastPrice !== undefined) payload.last_price = Number(patch.lastPrice);
    payload.last_updated = new Date().toISOString();
    const { error } = await window.supabaseClient.from('assets').update(payload).eq('id', id);
    if (error) throw error;
  }

  async function deleteAsset(id) {
    const { error } = await window.supabaseClient.from('assets').delete().eq('id', id);
    if (error) throw error;
  }

  async function _setPriceOnly(id, price) {
    await window.supabaseClient.from('assets').update({ last_price: price, last_updated: new Date().toISOString() }).eq('id', id);
  }

  // ==========================================
  // CLOUD DATABASE: SETTINGS / KAS (SUPABASE)
  // ==========================================
  async function getSettings() {
    try {
      const userId = await _getUserId();
      if (!userId) return { cash: 0 };
      const { data, error } = await window.supabaseClient.from('users').select('cash').eq('id', userId).single();
      if (error) throw error;
      return { cash: Number(data.cash) || 0 };
    } catch (e) { return { cash: 0 }; }
  }

  async function saveSettings(settings) {
    const userId = await _getUserId();
    if (!userId) throw new Error("Belum login");
    const { error } = await window.supabaseClient.from('users').update({ cash: Number(settings.cash) || 0 }).eq('id', userId);
    if (error) throw error;
  }

  // ==========================================
  // LOCAL STORAGE: GOALS (SEMENTARA)
  // ==========================================
  function _getCurrentUserEmail() {
    try {
      const sbSession = localStorage.getItem('sb-eirhdjllijilxjhigiwr-auth-token');
      if (sbSession) { const parsed = JSON.parse(sbSession); if (parsed?.user?.email) return parsed.user.email.replace(/[^a-zA-Z0-9]/g, '_'); }
    } catch (e) {} return 'guest';
  }
  function _read(key, fb) { try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fb; } catch(e){ return fb; } }
  function _write(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
  function getGoals() { return _read(GOALS_KEY + '_' + _getCurrentUserEmail(), []); }
  function saveGoals(goals) { _write(GOALS_KEY + '_' + _getCurrentUserEmail(), goals); }
  function addGoal(goal) { const goals = getGoals(); goals.push({ id: 'g_'+Date.now(), name: goal.name, target: Number(goal.target)||0, saved: Number(goal.saved)||0, monthly: Number(goal.monthly)||0 }); saveGoals(goals); }
  function updateGoal(id, patch) { const goals = getGoals(); const idx = goals.findIndex(g => g.id === id); if (idx !== -1) { goals[idx] = { ...goals[idx], ...patch }; saveGoals(goals); } }
  function deleteGoal(id) { saveGoals(getGoals().filter(g => g.id !== id)); }

  // ==========================================
  // SINKRONISASI HARGA API
  // ==========================================
  async function fetchCryptoPricesIDR(tickers) {
    const unique = [...new Set(tickers.map(t => t.toUpperCase()))];
    const ids = unique.map(t => COINGECKO_IDS[t]).filter(Boolean);
    if (!ids.length) return {};
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(',')}&vs_currencies=idr`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('CoinGecko HTTP ' + res.status);
    const data = await res.json();
    const out = {};
    unique.forEach(t => { const id = COINGECKO_IDS[t]; if (id && data[id] && typeof data[id].idr === 'number') out[t] = data[id].idr; });
    return out;
  }

  async function refreshCryptoPrices() {
    const assets = await getAssets();
    const cryptoAssets = assets.filter(a => a.type === 'kripto' && COINGECKO_IDS[a.ticker]);
    if (!cryptoAssets.length) return { updated: 0, total: 0, error: null };
    try {
      const prices = await fetchCryptoPricesIDR(cryptoAssets.map(a => a.ticker));
      let updated = 0;
      for (let a of cryptoAssets) {
        const p = prices[a.ticker];
        if (p) { await _setPriceOnly(a.id, p); updated++; }
      }
      return { updated, total: cryptoAssets.length, error: null };
    } catch (e) { return { updated: 0, total: cryptoAssets.length, error: e.message }; }
  }

  async function fetchStockPriceIDR(ticker) {
    try {
      const url = `/api/price/saham/${ticker}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      const data = await res.json();
      return data.price;
    } catch (error) { return null; }
  }

  async function refreshStockPrices() {
    const assets = await getAssets(); 
    const stockAssets = assets.filter(a => a.type === 'saham');
    if (!stockAssets.length) return { updated: 0, total: 0 };
    let updated = 0;
    for (let a of stockAssets) {
      const livePrice = await fetchStockPriceIDR(a.ticker);
      if (livePrice && livePrice > 0) { await _setPriceOnly(a.id, livePrice); updated++; }
    }
    return { updated, total: stockAssets.length };
  }

  // ==========================================
  // KALKULASI METRICS (ASYNC)
  // ==========================================
  async function computeMetrics() {
    const assets = await getAssets(); 
    const settings = await getSettings(); // <--- SEKARANG MENGAMBIL KAS DARI DATABASE!
    
    let totalValue = 0, totalCost = 0;
    const byType = { saham: 0, kripto: 0, emas: 0, reksadana: 0 };

    assets.forEach(a => {
      const value = (a.lastPrice || 0) * (a.qty || 0);
      const cost = (a.avgPrice || 0) * (a.qty || 0);
      totalValue += value;
      totalCost += cost;
      byType[a.type] = (byType[a.type] || 0) + value;
    });

    const cash = Number(settings.cash) || 0;
    const totalEquity = totalValue + cash;
    const floatingPL = totalValue - totalCost;
    const plPercent = totalCost > 0 ? (floatingPL / totalCost) * 100 : 0;

    const allocation = Object.entries(byType)
      .filter(([, v]) => v > 0)
      .map(([type, value]) => ({
        type, value,
        percent: totalEquity > 0 ? (value / totalEquity) * 100 : 0,
        ...ASSET_TYPES[type],
      }));
    const cashPercent = totalEquity > 0 ? (cash / totalEquity) * 100 : 0;

    return { assets, settings, totalValue, totalCost, totalEquity, floatingPL, plPercent, byType, allocation, cash, cashPercent };
  }

  function generateInsights(metrics) {
    const insights = [];
    const { assets, totalEquity, byType, floatingPL, cashPercent } = metrics;
    if (!assets.length) return [{ icon: 'fa-circle-info', tone: 'indigo', title: 'Belum Ada Data Portofolio', text: 'Tambahkan aset pertama Anda.' }];
    const cryptoPct = totalEquity > 0 ? (byType.kripto / totalEquity) * 100 : 0;
    if (cryptoPct > 35) insights.push({ icon: 'fa-triangle-exclamation', tone: 'rose', title: 'Eksposur Kripto Tinggi', text: `Porsi kripto mencapai ${cryptoPct.toFixed(0)}%. Pertimbangkan manajemen risiko.` });
    const losers = assets.filter(a => a.lastPrice < a.avgPrice);
    if (losers.length) insights.push({ icon: 'fa-arrow-trend-down', tone: 'rose', title: 'Ada Posisi Merah', text: `${losers.length} aset sedang minus.` });
    if (floatingPL > 0 && metrics.plPercent > 10) insights.push({ icon: 'fa-arrow-trend-up', tone: 'emerald', title: 'Profit Mengambang Solid', text: `Floating P/L +${metrics.plPercent.toFixed(1)}%. Pertimbangkan take-profit parsial.` });
    if (cashPercent < 10) insights.push({ icon: 'fa-piggy-bank', tone: 'amber', title: 'Buffer Kas Tipis', text: `Kas Anda hanya ${cashPercent.toFixed(0)}%. Jaga buffer kas darurat.` });
    if (!insights.length) insights.push({ icon: 'fa-circle-check', tone: 'emerald', title: 'Portofolio Seimbang', text: 'Portofolio Anda relatif terdiversifikasi dengan baik.' });
    return insights;
  }

  function formatRupiah(n) { return 'Rp ' + Math.round(Number(n) || 0).toLocaleString('id-ID'); }
  function formatNumber(n, dec = 2) { return Number(n).toLocaleString('id-ID', { maximumFractionDigits: dec }); }

  return {
    ASSET_TYPES, COINGECKO_IDS,
    getAssets, addAsset, updateAsset, deleteAsset,
    getGoals, addGoal, updateGoal, deleteGoal,
    getSettings, saveSettings,
    fetchCryptoPricesIDR, refreshCryptoPrices,
    fetchStockPriceIDR, refreshStockPrices,
    computeMetrics, generateInsights,
    formatRupiah, formatNumber,
  };
})();
