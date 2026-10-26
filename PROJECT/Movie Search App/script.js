


const searchForm = document.querySelector('#searchForm');
const searchInput = document.querySelector('#searchInput');
const loading = document.querySelector('#loading');
const errorMessage = document.querySelector('#errorMessage');
const result = document.querySelector('#result');

const API_BASE =  'https://api.tvmaze.com/search/shows';

async function searchMovies(query) {

    showLoading(true);
    hideError();
    result.innerHTML = '';

try {

    const response = await fetch(
        `${API_BASE}?q=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
const data = await response.json();

if (data.length === 0) {
    showError('No results found.');
    return;
}

displayResults(data);
    
} catch (error) {
    console.error('Error fetching data:', error);
    showError(`an error occurred while fetching data: ${error.message}`);
} finally {
    showLoading(false);
}
}

function displayResults(data) {
    const htmlCards = data.map(item => {

        const show = item.show;
const posterHTML = show.image ? `<img src="${show.image.medium}"
 alt="${show.name}" loading="lazy" />` : '<div class="no-image">🎬</div>';

 const rating = show.rating?.average ? `<span class="rating">⭐ ${show.rating.average}</span>` : '';
 
 const genres = (show.genres || []).slice(0,2)
 .map(g=> `<span class="genre">${g}</span>`)
 .join(' ');

 const cleanSummary = (show.summary || '')
 .replace(/<[^>]*>/g, '')
 .trim();
 const summary = cleanSummary? (cleanSummary.length > 120 ? escapeHtml(cleanSummary.slice(0, 120)) + '...' 
 : escapeHtml(cleanSummary)) : 'No summary available.';
 
 return`<div class="movie-card">${posterHTML}<div class="movie-info"> <h3>${escapeHtml(show.name)}</h3> <div class="meta">${rating}${genres}</div>
 
 <p class="summary">${summary}</p></div></div>`;

    })
    .join('');
    result.innerHTML = htmlCards;   
}

function escapeHtml(str) {
    return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function showLoading(isLoading) {
    if (loading) loading.hidden = !isLoading;
}

function showError(message) {
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.hidden = false;
    }
}

function hideError() {
    if (errorMessage) {errorMessage.hidden = true;
    errorMessage.textContent = '';
}
}

searchForm.addEventListener('submit', function (e) {
e.preventDefault();
const query = searchInput.value.trim();

if (query === '') {
showError('please enter the title of the movie.');
return;
}

searchMovies(query);
searchInput.value = '';
searchInput.focus();
});

window.addEventListener('DOMContentLoaded', () => {
    searchMovies('breaking bad');
});