/**
 * EduVesting — Shared Data Layer
 * ---------------------------------------------------------------
 */
const EduVesting = (() => {
  const ASSETS_KEY   = 'eduvesting_assets_v1';
  const GOALS_KEY    = 'eduvesting_goals_v1';
  const SETTINGS_KEY = 'eduvesting_settings_v1';

  const ASSET_TYPES = {
    saham: {
      label: 'Saham', 
      unit: 'lembar',
      unitFull: 'lembar', 
      gradient: ['#6366f1', '#818cf8'],
      badgeBg: 'rgba(99,102,241,0.15)', badgeColor: '#a5b4fc', badgeBorder: 'rgba(99,102,241,0.25)',
      feeRate: 0.0019, livePrice: false,
    },
    kripto: {
      label: 'Kripto', 
      unit: 'koin',
      unitFull: 'koin', 
      gradient: ['#f59e0b', '#fbbf24'],
      badgeBg: 'rgba(245,158,11,0.12)', badgeColor: '#fcd34d', badgeBorder: 'rgba(245,158,11,0.25)',
      feeRate: 0.001, livePrice: true,
    },
    emas: {
      label: 'Emas', unit: 'gram', unitFull: 'gram',
      gradient: ['#d97706', '#fcd34d'],
      badgeBg: 'rgba(217,119,6,0.12)', badgeColor: '#fde68a', badgeBorder: 'rgba(217,119,6,0.3)',
      feeRate: 0.005, livePrice: false,
    },
    reksadana: {
      label: 'Kas/RD', unit: 'unit', unitFull: 'unit penyertaan',
      gradient: ['#06b6d4', '#22d3ee'],
      badgeBg: 'rgba(6,182,212,0.1)', badgeColor: '#67e8f9', badgeBorder: 'rgba(6,182,212,0.25)',
      feeRate: 0.0, livePrice: false,
    },
  };

  const COINGECKO_IDS = {
    BTC: 'bitcoin', ETH: 'ethereum', BNB: 'binancecoin', SOL: 'solana',
    USDT: 'tether', USDC: 'usd-coin', ADA: 'cardano', XRP: 'ripple',
    DOGE: 'dogecoin', MATIC: 'polygon-ecosystem-token', AVAX: 'avalanche-2',
    DOT: 'polkadot', LTC: 'litecoin', TRX: 'tron', LINK: 'chainlink',
  };

  // ---------- low level storage ----------
  function _read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      if (Array.isArray(fallback) && !Array.isArray(parsed)) return fallback;
      return parsed;
    } catch (e) {
      console.warn('EduVesting: gagal membaca', key, e);
      return fallback;
    }
  }

  function _write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // ---------- assets ----------
  function getAssets() { return _read(ASSETS_KEY, []); }
  function saveAssets(assets) { _write(ASSETS_KEY, assets); }

  function addAsset(asset) {
    const assets = getAssets();
    const now = new Date().toISOString();
    const newAsset = {
      id: 'a_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
      type: asset.type,
      ticker: (asset.ticker || '').toUpperCase(),
      name: asset.name || asset.ticker,
      avgPrice: Number(asset.avgPrice) || 0,
      qty: Number(asset.qty) || 0,
      lastPrice: Number(asset.lastPrice) > 0 ? Number(asset.lastPrice) : (Number(asset.avgPrice) || 0),
      createdAt: now,
      lastUpdated: now,
    };
    assets.push(newAsset);
    saveAssets(assets);
    return newAsset;
  }

  function updateAsset(id, patch) {
    const assets = getAssets();
    const idx = assets.findIndex(a => a.id === id);
    if (idx === -1) return null;
    assets[idx] = { ...assets[idx], ...patch, lastUpdated: new Date().toISOString() };
    saveAssets(assets);
    return assets[idx];
  }

  function deleteAsset(id) {
    saveAssets(getAssets().filter(a => a.id !== id));
  }

  function _setPriceOnly(id, price) {
    const assets = getAssets();
    const idx = assets.findIndex(a => a.id === id);
    if (idx === -1) return;
    assets[idx].lastPrice = price;
    assets[idx].lastUpdated = new Date().toISOString();
    saveAssets(assets);
  }

  // ---------- goals ----------
  function getGoals() { return _read(GOALS_KEY, []); }
  function saveGoals(goals) { _write(GOALS_KEY, goals); }

  function addGoal(goal) {
    const goals = getGoals();
    const newGoal = {
      id: 'g_' + Date.now() + '_' + Math.random().toString(36).slice(2, 5),
      name: goal.name,
      target: Number(goal.target) || 0,
      saved: Number(goal.saved) || 0,
      targetDate: goal.targetDate || '',
      createdAt: new Date().toISOString(),
    };
    goals.push(newGoal);
    saveGoals(goals);
    return newGoal;
  }

  function updateGoal(id, patch) {
    const goals = getGoals();
    const idx = goals.findIndex(g => g.id === id);
    if (idx === -1) return null;
    goals[idx] = { ...goals[idx], ...patch };
    saveGoals(goals);
    return goals[idx];
  }

  function deleteGoal(id) {
    saveGoals(getGoals().filter(g => g.id !== id));
  }

  // ---------- settings ----------
  function getSettings() { return _read(SETTINGS_KEY, { cash: 0 }); }
  function saveSettings(settings) { _write(SETTINGS_KEY, settings); }

  // ---------- realtime crypto price (CoinGecko) ----------
  async function fetchCryptoPricesIDR(tickers) {
    const unique = [...new Set(tickers.map(t => t.toUpperCase()))];
    const ids = unique.map(t => COINGECKO_IDS[t]).filter(Boolean);
    if (!ids.length) return {};
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(',')}&vs_currencies=idr`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('CoinGecko HTTP ' + res.status);
    const data = await res.json();
    const out = {};
    unique.forEach(t => {
      const id = COINGECKO_IDS[t];
      if (id && data[id] && typeof data[id].idr === 'number') out[t] = data[id].idr;
    });
    return out;
  }

  async function refreshCryptoPrices() {
    const assets = getAssets();
    const cryptoAssets = assets.filter(a => a.type === 'kripto' && COINGECKO_IDS[a.ticker]);
    if (!cryptoAssets.length) return { updated: 0, total: 0, error: null };
    try {
      const prices = await fetchCryptoPricesIDR(cryptoAssets.map(a => a.ticker));
      let updated = 0;
      cryptoAssets.forEach(a => {
        const p = prices[a.ticker];
        if (p) { _setPriceOnly(a.id, p); updated++; }
      });
      return { updated, total: cryptoAssets.length, error: null };
    } catch (e) {
      return { updated: 0, total: cryptoAssets.length, error: e.message };
    }
  }

  // ---------- realtime stock price (Backend Vercel) ----------
  async function fetchStockPriceIDR(ticker) {
    try {
      // Menggunakan relative path untuk Vercel Serverless Function
      const url = `/api/price/saham/${ticker}`;
      const res = await fetch(url);
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP Error ${res.status}`);
      }
      
      const data = await res.json();
      return data.price;
      
    } catch (error) {
      alert(`⚠️ GAGAL SINKRON SAHAM ${ticker}!\n\nPenyebab: ${error.message}\n\nPastikan koneksi internet stabil atau API backend sedang down.`);
      console.error(`Gagal ambil harga saham ${ticker}:`, error);
      return null;
    }
  }

  async function refreshStockPrices() {
    const assets = getAssets();
    const stockAssets = assets.filter(a => a.type === 'saham');
    if (!stockAssets.length) return { updated: 0, total: 0 };
    
    let updated = 0;
    for (let a of stockAssets) {
      const livePrice = await fetchStockPriceIDR(a.ticker);
      if (livePrice && livePrice > 0) {
        _setPriceOnly(a.id, livePrice);
        updated++;
      }
    }
    return { updated, total: stockAssets.length };
  }

  // ---------- metrics ----------
  function computeMetrics() {
    const assets = getAssets();
    const settings = getSettings();
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

    if (!assets.length) {
      return [{
        icon: 'fa-circle-info', tone: 'indigo', title: 'Belum Ada Data Portofolio',
        text: 'Tambahkan aset pertama Anda di halaman Portofolio. Setelah tersimpan, analisis di sini akan otomatis dihitung dari data nyata Anda — bukan data contoh.',
      }];
    }

    const cryptoPct = totalEquity > 0 ? (byType.kripto / totalEquity) * 100 : 0;
    const sahamPct = totalEquity > 0 ? (byType.saham / totalEquity) * 100 : 0;

    if (cryptoPct > 35) {
      insights.push({
        icon: 'fa-triangle-exclamation', tone: 'rose', title: 'Eksposur Kripto Tinggi',
        text: `Porsi kripto mencapai ${cryptoPct.toFixed(0)}% dari total ekuitas Anda. Aset ini punya volatilitas tinggi — pertimbangkan merealisasikan sebagian profit dan memindahkannya ke instrumen yang lebih stabil seperti emas atau reksa dana pasar uang.`,
      });
    } else if (cryptoPct === 0 && sahamPct === 0) {
      insights.push({
        icon: 'fa-seedling', tone: 'cyan', title: 'Portofolio Masih Konservatif',
        text: 'Saat ini portofolio Anda belum punya eksposur ke saham/kripto. Jika profil risiko memungkinkan, sebagian kecil dana bisa dialokasikan ke aset pertumbuhan.',
      });
    }

    const losers = assets.filter(a => a.lastPrice < a.avgPrice);
    if (losers.length) {
      insights.push({
        icon: 'fa-arrow-trend-down', tone: 'rose', title: 'Ada Posisi yang Merah',
        text: `${losers.length} aset (${losers.map(a => a.ticker).join(', ')}) sedang berada di bawah harga beli rata-rata Anda. Evaluasi apakah masih sesuai dengan tujuan investasi awal sebelum menambah posisi.`,
      });
    }

    if (floatingPL > 0 && metrics.plPercent > 10) {
      insights.push({
        icon: 'fa-arrow-trend-up', tone: 'emerald', title: 'Profit Mengambang Solid',
        text: `Floating P/L Anda sudah +${metrics.plPercent.toFixed(1)}%. Banyak investor pemula tergoda menahan semua posisi — pertimbangkan take-profit parsial untuk mengamankan sebagian keuntungan.`,
      });
    }

    if (cashPercent < 10) {
      insights.push({
        icon: 'fa-piggy-bank', tone: 'amber', title: 'Buffer Kas Tipis',
        text: `Kas/dana likuid Anda hanya ${cashPercent.toFixed(0)}% dari total ekuitas. Idealnya jaga buffer kas minimal 15–20% sebagai dana darurat dan untuk menangkap peluang.`,
      });
    }

    if (!insights.length) {
      insights.push({
        icon: 'fa-circle-check', tone: 'emerald', title: 'Portofolio Cukup Seimbang',
        text: 'Berdasarkan distribusi aset saat ini, portofolio Anda relatif terdiversifikasi dan tidak menunjukkan konsentrasi risiko yang ekstrem.',
      });
    }
    return insights;
  }

  function formatRupiah(n) {
    const v = Math.round(Number(n) || 0);
    return 'Rp ' + v.toLocaleString('id-ID');
  }
  
  function formatNumber(n, decimals = 2) {
    return Number(n).toLocaleString('id-ID', { maximumFractionDigits: decimals });
  }

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
