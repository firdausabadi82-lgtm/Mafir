/* =========================================
   CONFIGURATION & STATE
   ========================================= */
const CONFIG = {
    API_BASE: 'https://api.tvmaze.com/search/shows',
    TIMEOUT_MS: 10000,
    DEFAULT_QUERY: 'Breaking Bad',
};

const state = {
    lastQuery: '',
    isLoading: false,
    controller: null,
};

const DOM = {
    form: document.querySelector('#searchForm'),
    input: document.querySelector('#searchInput'),
    button: document.querySelector('#searchBtn'),
    loading: document.querySelector('#loading'),
    skeleton: document.querySelector('#skeletonGrid'),
    errorBox: document.querySelector('#errorMessage'),
    errorText: document.querySelector('#errorText'),
    retryBtn: document.querySelector('#retryBtn'),
    results: document.querySelector('#results'),
    offlineBanner: document.querySelector('#offlineBanner'),
};

const ERROR_MESSAGES = {
    offline: 'You are offline. Please check your internet connection.',
    timeout: 'Connection timed out. Please try again later.',
    network: 'Network error. Please check your connection.',
    not_found: 'No results found. Please try a different search term.',
    default: 'An unexpected error occurred. Please try again later.',
};

/* =========================================
   UTILITY FUNCTIONS
   ========================================= */
// Prevents XSS attacks by escaping HTML characters
function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
    }[c]));
}

/* =========================================
   API FETCHING
   ========================================= */
async function fetchMovies(query) {
    if (!navigator.onLine) {
        throw new Error('OFFLINE');
    }

    const controller = new AbortController();
    state.controller = controller;
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT_MS);

    try {
        const url = `${CONFIG.API_BASE}?q=${encodeURIComponent(query)}`;
        const response = await fetch(url, { signal: controller.signal });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        if (error.name === 'AbortError') throw new Error('TIMEOUT');
        if (error.name === 'TypeError') throw new Error('NETWORK');
        throw error;
    } finally {
        clearTimeout(timeoutId);
    }
}

/* =========================================
   UI RENDERING
   ========================================= */
function renderMovies(movies) {
    if (!DOM.results) return;

    const htmlCards = movies
        .map(({ show }) => {
            const posterHtml = show.image
                ? `<img src="${show.image.medium}" alt="${escapeHtml(show.name)}" loading="lazy" />`
                : `<div class="no-image">🎬</div>`;

            const rating = show.rating?.average
                ? `<span class="rating">⭐ ${show.rating.average}</span>`
                : '';

            const genres = (show.genres || [])
                .slice(0, 3)
                .map((g) => `<span class="genre">${escapeHtml(g)}</span>`)
                .join(' ');

            const rawSummary = show.summary
                ? show.summary.replace(/<[^>]*>/g, '').trim()
                : '';
            const summary = rawSummary
                ? escapeHtml(rawSummary.slice(0, 120)) + '…'
                : 'No summary available.';

            return `
                <div class="movie-card">
                    ${posterHtml}
                    <div class="info">
                        <h3>${escapeHtml(show.name)}</h3>
                        <div class="meta">${rating} ${genres}</div>
                        <p>${summary}</p>
                    </div>
                </div>`;
        })
        .join('');

    DOM.results.innerHTML = htmlCards;
}

function setLoading(isLoading) {
    state.isLoading = isLoading;
    
    // Optional chaining prevents crashes if elements are missing
    if (DOM.loading) DOM.loading.hidden = !isLoading;
    if (DOM.skeleton) DOM.skeleton.hidden = !isLoading;
    
    if (DOM.button) {
        DOM.button.disabled = isLoading;
        DOM.button.innerHTML = isLoading ? 'Searching...' : '🔍 Search';
    }
}

function showError(code) {
    const key = String(code || '').toLowerCase();
    if (DOM.errorText) {
        DOM.errorText.textContent = ERROR_MESSAGES[key] || ERROR_MESSAGES.default;
    }
    if (DOM.errorBox) {
        DOM.errorBox.hidden = false;
    }
}

function hideError() {
    if (DOM.errorBox) DOM.errorBox.hidden = true;
    if (DOM.errorText) DOM.errorText.textContent = '';
}

function clearResults() {
    if (DOM.results) DOM.results.innerHTML = '';
}

/* =========================================
   EVENT HANDLERS & APP LOGIC
   ========================================= */
async function handleSearch(query) {
    if (state.isLoading) return;

    const q = String(query || '').trim();
    if (!q) return;

    state.lastQuery = q;

    hideError();
    clearResults();
    setLoading(true);

    try {
        const data = await fetchMovies(q);

        if (!Array.isArray(data) || data.length === 0) {
            showError('not_found');
            return;
        }

        renderMovies(data);
    } catch (error) {
        const type = ['OFFLINE', 'TIMEOUT', 'NETWORK'].includes(error.message)
            ? error.message.toLowerCase()
            : 'default';
        showError(type);
    } finally {
        setLoading(false);
    }
}

function init() {
    if (DOM.offlineBanner) {
        DOM.offlineBanner.hidden = navigator.onLine;
    }
    handleSearch(CONFIG.DEFAULT_QUERY);
}

/* =========================================
   EVENT LISTENERS
   ========================================= */
if (DOM.form) {
    DOM.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = DOM.input.value.trim();
        if (!query) return;

        handleSearch(query);
        DOM.input.value = '';
    });
}

if (DOM.retryBtn) {
    DOM.retryBtn.addEventListener('click', () => {
        if (state.lastQuery) {
            handleSearch(state.lastQuery);
        }
    });
}

window.addEventListener('online', () => {
    if (DOM.offlineBanner) DOM.offlineBanner.hidden = true;
});

window.addEventListener('offline', () => {
    if (DOM.offlineBanner) DOM.offlineBanner.hidden = false;
});

// Initialize App safely
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}