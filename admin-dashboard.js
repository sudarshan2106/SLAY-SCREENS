// Admin Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function () {
    checkAdminAuth();
    loadDashboardStats();

    // Listen for real-time updates
    window.addEventListener('moviesUpdated', function () {
        console.log('Dashboard: Data updated, refreshing stats...');
        loadDashboardStats();
    });
});

function checkAdminAuth() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!user.role || user.role !== 'ADMIN') {
        alert('Access denied! Admin login required.');
        window.location.href = '../login.html';
    }
}

function loadDashboardStats() {
    // Get data from centralized DB
    const movies = window.DB.getMovies();
    const bookings = JSON.parse(localStorage.getItem('allBookings') || '[]');

    // Update stats
    updateStat('.stat-card:nth-child(1) h3', bookings.length || 1250);
    updateStat('.stat-card:nth-child(2) h3', `₹${calculateRevenue(bookings)}`);
    updateStat('.stat-card:nth-child(3) h3', movies.length || 24);
    updateStat('.stat-card:nth-child(4) h3', 850); // Mock users count
}

function updateStat(selector, value) {
    const element = document.querySelector(selector);
    if (element) {
        element.textContent = value;
    }
}

function calculateRevenue(bookings) {
    if (!bookings.length) return '45,000';

    const total = bookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);
    return total.toLocaleString();
}

// Sidebar navigation
const navLinks = document.querySelectorAll('.sidebar .nav-links a');
navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        if (this.getAttribute('href') === '#') {
            e.preventDefault();
            const feature = this.textContent.trim();
            showComingSoon(feature);
        }
    });
});

function showComingSoon(feature) {
    alert(`${feature} feature coming soon!`);
}

function resetDatabase() {
    if (confirm('WARNING: This will delete all custom movies and reset to defaults. Are you sure?')) {
        localStorage.removeItem('movies');
        window.DB.init();
        alert('Database reset to defaults. Please refresh the page.');
        window.location.reload();
    }
}
