// Admin Movies Management JavaScript

// Movie database (managed by DB object)
// Movie database (managed by DB object)
if (!window.DB) {
    console.error('DB object not found! Check db.js loading.');
    alert('System Error: Database not loaded. Please refresh the page.');
}
let movies = window.DB ? window.DB.getMovies() : [];

let editingMovieId = null;

document.addEventListener('DOMContentLoaded', function () {
    checkAdminAuth();
    loadMovies();
    setupEventListeners();

    // Listen for real-time updates from DB
    window.addEventListener('moviesUpdated', function () {
        console.log('Admin: Movies updated, reloading list...');
        loadMovies();
    });
});

function checkAdminAuth() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!user.role || user.role !== 'ADMIN') {
        alert('Access denied! Admin login required.');
        window.location.href = '../login.html';
    }
}

function setupEventListeners() {
    // Add New Movie button
    const addBtn = document.querySelector('.neon-btn-primary');
    if (addBtn) {
        addBtn.addEventListener('click', showAddMovieModal);
    }

    // Form submission handler
    const movieForm = document.getElementById('movieForm');
    if (movieForm) {
        movieForm.addEventListener('submit', function (e) {
            e.preventDefault();
            alert('Debug: Form submission started...'); // Explicit debug alert
            console.log('Form submitted');

            const movieData = {
                title: document.getElementById('title').value,
                genre: document.getElementById('genre').value,
                duration: document.getElementById('duration').value,
                rating: parseFloat(document.getElementById('rating').value),
                price: parseInt(document.getElementById('price').value),
                poster: document.getElementById('poster').value,
                backdrop: document.getElementById('backdrop').value,
                director: document.getElementById('director').value,
                description: document.getElementById('description').value,
                status: document.getElementById('status').value,
                releaseDate: document.getElementById('releaseDate').value,
                cast: getCastMembers()
            };

            console.log('Movie data:', movieData);

            if (editingMovieId) {
                const updatedMovie = { id: editingMovieId, ...movieData };
                if (window.DB.updateMovie(updatedMovie)) {
                    showNotification('Movie updated successfully!', 'success');
                } else {
                    showNotification('Error updating movie.', 'error');
                }
            } else {
                window.DB.addMovie(movieData);
                alert('Debug: Movie added to DB! ID: ' + movieData.id); // Explicit debug alert
                showNotification('Movie added successfully!', 'success');
            }

            // Reload movies from DB
            movies = window.DB.getMovies();
            loadMovies();
            closeModal();
        });
    }
}

// Cast Member Management Functions
let castMemberCount = 0;

function addCastMember(name = '', role = '', image = '') {
    const container = document.getElementById('castContainer');
    if (!container) return;

    castMemberCount++;
    const castCard = document.createElement('div');
    castCard.className = 'cast-member-card';
    castCard.id = `cast-member-${castMemberCount}`;

    castCard.innerHTML = `
        <div class="cast-member-header">
            <span class="cast-member-title">Cast Member #${castMemberCount}</span>
            <button type="button" class="remove-cast-btn" onclick="removeCastMember(${castMemberCount})">
                <i class="fas fa-trash"></i> Remove
            </button>
        </div>
        <div class="cast-input-row">
            <div>
                <label style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 5px; display: block;">Actor Name</label>
                <input type="text" class="glass-input cast-name" value="${name}" placeholder="e.g., Tom Hardy">
            </div>
            <div>
                <label style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 5px; display: block;">Role/Character</label>
                <input type="text" class="glass-input cast-role" value="${role}" placeholder="e.g., Eddie Brock">
            </div>
        </div>
        <div>
            <label style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 5px; display: block;">Actor Image URL</label>
            <input type="url" class="glass-input cast-image" value="${image}" placeholder="https://image.tmdb.org/t/p/w200/...">
        </div>
    `;

    container.appendChild(castCard);
}

function removeCastMember(id) {
    const castCard = document.getElementById(`cast-member-${id}`);
    if (castCard) {
        castCard.remove();
    }
}

function getCastMembers() {
    const castCards = document.querySelectorAll('.cast-member-card');
    const castArray = [];

    castCards.forEach(card => {
        const name = card.querySelector('.cast-name').value.trim();
        const role = card.querySelector('.cast-role').value.trim();
        const image = card.querySelector('.cast-image').value.trim();

        if (name && role) {
            castArray.push({
                name: name,
                role: role,
                image: image || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=b026ff&color=fff`
            });
        }
    });

    return castArray;
}

function populateCastMembers(castArray) {
    const container = document.getElementById('castContainer');
    if (!container) return;

    container.innerHTML = '';
    castMemberCount = 0;

    if (castArray && castArray.length > 0) {
        castArray.forEach(member => {
            addCastMember(member.name, member.role, member.image);
        });
    }
}

// Make functions globally available
window.addCastMember = addCastMember;
window.removeCastMember = removeCastMember;

function loadMovies() {
    const tbody = document.querySelector('.admin-table tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    // Refresh movies list from DB
    movies = window.DB.getMovies();

    movies.forEach(movie => {
        const row = createMovieRow(movie);
        tbody.appendChild(row);
    });
}

function createMovieRow(movie) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td><img src="${movie.poster}" alt="Poster" class="table-img"></td>
        <td>${movie.title}</td>
        <td>${movie.genre}</td>
        <td>${movie.releaseDate}</td>
        <td><span class="status ${movie.status.toLowerCase()}">${movie.status}</span></td>
        <td>
            <button class="action-btn edit" onclick="editMovie(${movie.id})">
                <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn delete" onclick="deleteMovie(${movie.id})">
                <i class="fas fa-trash"></i>
            </button>
        </td>
    `;
    return tr;
}

function showAddMovieModal() {
    editingMovieId = null;
    document.getElementById('modalTitle').textContent = 'Add New Movie';
    document.getElementById('movieForm').reset();
    document.getElementById('releaseDate').value = new Date().toISOString().split('T')[0];
    populateCastMembers([]);
    document.getElementById('movieModal').style.display = 'flex';
}

function openAddModal() {
    showAddMovieModal();
}

function editMovie(id) {
    editingMovieId = id;
    const movie = window.DB.getMovie(id);
    if (!movie) return;

    document.getElementById('modalTitle').textContent = 'Edit Movie';
    document.getElementById('title').value = movie.title;
    document.getElementById('genre').value = movie.genre;
    document.getElementById('duration').value = movie.duration;
    document.getElementById('rating').value = movie.rating;
    document.getElementById('poster').value = movie.poster;
    document.getElementById('backdrop').value = movie.backdrop || '';
    document.getElementById('director').value = movie.director || '';
    document.getElementById('description').value = movie.description;
    document.getElementById('price').value = movie.price;
    document.getElementById('status').value = movie.status;
    document.getElementById('releaseDate').value = movie.releaseDate || new Date().toISOString().split('T')[0];

    // Populate cast members
    populateCastMembers(movie.cast || []);

    document.getElementById('movieModal').style.display = 'flex';
}

function deleteMovie(id) {
    if (!confirm('Are you sure you want to delete this movie?')) return;

    if (window.DB.deleteMovie(id)) {
        loadMovies();
        showNotification('Movie deleted successfully!', 'success');
    } else {
        showNotification('Error deleting movie.', 'error');
    }
}

function closeModal() {
    document.getElementById('movieModal').style.display = 'none';
    document.getElementById('movieForm').reset();
    populateCastMembers([]);
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 0, 136, 0.2)'};
        border: 1px solid ${type === 'success' ? '#00ff88' : '#ff0088'};
        border-radius: 8px;
        color: white;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Make functions globally available
window.editMovie = editMovie;
window.deleteMovie = deleteMovie;
window.closeModal = closeModal;
window.openAddModal = openAddModal;

function resetDatabase() {
    if (confirm('WARNING: This will delete all custom movies and reset to defaults. Are you sure?')) {
        localStorage.removeItem('movies');
        window.DB.init();
        alert('Database reset to defaults. Please refresh the page.');
        window.location.reload();
    }
}
function fillTestData() {
    document.getElementById('title').value = 'Test Movie ' + Math.floor(Math.random() * 1000);
    document.getElementById('genre').value = 'Action/Test';
    document.getElementById('duration').value = '2h 00m';
    document.getElementById('rating').value = '9.9';
    document.getElementById('director').value = 'Test Director';
    document.getElementById('poster').value = 'https://image.tmdb.org/t/p/w500/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg'; // Venom
    document.getElementById('backdrop').value = 'https://image.tmdb.org/t/p/original/3V4kLQg0kSqPLctI5ziYWabAZYF.jpg'; // Venom
    document.getElementById('description').value = 'This is a test movie description for debugging purposes.';
    document.getElementById('price').value = '500';
    document.getElementById('status').value = 'Active';
    alert('Test data filled! Now click "Save Movie".');
}
window.fillTestData = fillTestData;

// Test localStorage functionality
function testLocalStorage() {
    try {
        // Test write
        const testData = { test: 'value', timestamp: Date.now() };
        localStorage.setItem('test_storage', JSON.stringify(testData));

        // Test read
        const retrieved = JSON.parse(localStorage.getItem('test_storage'));

        // Test movies
        const movies = JSON.parse(localStorage.getItem('movies') || '[]');

        alert(`✅ localStorage is WORKING!\n\n` +
            `Test write/read: SUCCESS\n` +
            `Movies in storage: ${movies.length}\n` +
            `First movie: ${movies[0]?.title || 'None'}\n\n` +
            `Check console for details.`);

        console.log('localStorage Test Results:');
        console.log('Test data:', retrieved);
        console.log('Movies count:', movies.length);
        console.log('All movies:', movies);

        // Cleanup
        localStorage.removeItem('test_storage');
    } catch (e) {
        alert(`❌ localStorage FAILED!\n\nError: ${e.message}\n\nYour browser might have storage disabled.`);
        console.error('localStorage test failed:', e);
    }
}
window.testLocalStorage = testLocalStorage;
