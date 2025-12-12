// Admin Theaters Management JavaScript

let theaters = JSON.parse(localStorage.getItem('theaters')) || [
    {
        id: 1,
        name: 'INOX: Megaplex',
        location: 'Phoenix Marketcity, Mumbai',
        distance: '2.5 km',
        screens: ['IMAX', '4DX', 'Regular'],
        showtimes: [
            { time: '10:00 AM', price: 200, screen: 'Regular' },
            { time: '01:30 PM', price: 250, screen: 'Regular' },
            { time: '04:45 PM', price: 300, screen: 'IMAX' },
            { time: '07:30 PM', price: 350, screen: '4DX' },
            { time: '10:15 PM', price: 250, screen: 'Regular' }
        ]
    },
    {
        id: 2,
        name: 'PVR: Gold',
        location: 'Juhu, Mumbai',
        distance: '4.2 km',
        screens: ['Gold Class', 'Regular'],
        showtimes: [
            { time: '11:00 AM', price: 400, screen: 'Gold Class' },
            { time: '02:00 PM', price: 220, screen: 'Regular' },
            { time: '05:30 PM', price: 450, screen: 'Gold Class' },
            { time: '08:45 PM', price: 280, screen: 'Regular' }
        ]
    },
    {
        id: 3,
        name: 'Cinepolis: VIP',
        location: 'Andheri West, Mumbai',
        distance: '3.8 km',
        screens: ['VIP', 'Regular'],
        showtimes: [
            { time: '12:00 PM', price: 350, screen: 'VIP' },
            { time: '03:15 PM', price: 200, screen: 'Regular' },
            { time: '06:30 PM', price: 400, screen: 'VIP' },
            { time: '09:45 PM', price: 230, screen: 'Regular' }
        ]
    }
];

// Save default theaters to localStorage if empty
if (!localStorage.getItem('theaters')) {
    localStorage.setItem('theaters', JSON.stringify(theaters));
}

// Expose to window
window.theaters = theaters;

document.addEventListener('DOMContentLoaded', function () {
    checkAdminAuth();
    loadTheaters();
});

function checkAdminAuth() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.role || user.role !== 'ADMIN') {
        alert('Access denied! Admin login required.');
        window.location.href = '../login.html';
    }
}

function loadTheaters() {
    const tbody = document.getElementById('theatersTableBody');
    if (!tbody) return;

    theaters = JSON.parse(localStorage.getItem('theaters')) || [];

    if (theaters.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem;">No theaters found</td></tr>';
        return;
    }

    tbody.innerHTML = theaters.map(theater => `
        <tr>
            <td><strong>${theater.name}</strong></td>
            <td>${theater.location}</td>
            <td>${theater.distance}</td>
            <td>${theater.screens.join(', ')}</td>
            <td>${theater.showtimes.length} shows</td>
            <td>
                <button class="action-btn" onclick="editTheater(${theater.id})" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn" onclick="deleteTheater(${theater.id})" title="Delete" style="color: var(--neon-pink);">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function showAddTheaterModal() {
    document.getElementById('theaterModal').style.display = 'flex';
    document.getElementById('modalTitle').textContent = 'Add New Theater';
    document.getElementById('theaterForm').reset();
    document.getElementById('theaterId').value = '';
}

function closeModal() {
    document.getElementById('theaterModal').style.display = 'none';
}

function saveTheater(event) {
    event.preventDefault();

    const id = document.getElementById('theaterId').value;
    const name = document.getElementById('theaterName').value;
    const location = document.getElementById('theaterLocation').value;
    const distance = document.getElementById('theaterDistance').value;
    const screens = document.getElementById('theaterScreens').value.split(',').map(s => s.trim());

    // Get showtimes
    const showtimes = [];
    const showtimeInputs = document.querySelectorAll('.showtime-entry');
    showtimeInputs.forEach(entry => {
        const time = entry.querySelector('.showtime-time').value;
        const price = entry.querySelector('.showtime-price').value;
        const screen = entry.querySelector('.showtime-screen').value;
        if (time && price && screen) {
            showtimes.push({ time, price: parseInt(price), screen });
        }
    });

    if (id) {
        // Edit existing
        const index = theaters.findIndex(t => t.id == id);
        if (index !== -1) {
            theaters[index] = { id: parseInt(id), name, location, distance, screens, showtimes };
        }
    } else {
        // Add new
        const newId = theaters.length > 0 ? Math.max(...theaters.map(t => t.id)) + 1 : 1;
        theaters.push({ id: newId, name, location, distance, screens, showtimes });
    }

    localStorage.setItem('theaters', JSON.stringify(theaters));
    loadTheaters();
    closeModal();
    showNotification('Theater saved successfully!', 'success');
}

function editTheater(id) {
    const theater = theaters.find(t => t.id === id);
    if (!theater) return;

    document.getElementById('theaterModal').style.display = 'flex';
    document.getElementById('modalTitle').textContent = 'Edit Theater';
    document.getElementById('theaterId').value = theater.id;
    document.getElementById('theaterName').value = theater.name;
    document.getElementById('theaterLocation').value = theater.location;
    document.getElementById('theaterDistance').value = theater.distance;
    document.getElementById('theaterScreens').value = theater.screens.join(', ');

    // Populate showtimes
    const container = document.getElementById('showtimesContainer');
    container.innerHTML = theater.showtimes.map(st => `
        <div class="showtime-entry">
            <input type="time" class="glass-input showtime-time" value="${st.time}" required>
            <input type="number" class="glass-input showtime-price" placeholder="Price" value="${st.price}" required>
            <input type="text" class="glass-input showtime-screen" placeholder="Screen Type" value="${st.screen}" required>
        </div>
    `).join('');
}

function deleteTheater(id) {
    if (!confirm('Are you sure you want to delete this theater?')) return;

    theaters = theaters.filter(t => t.id !== id);
    localStorage.setItem('theaters', JSON.stringify(theaters));
    loadTheaters();
    showNotification('Theater deleted successfully!', 'success');
}

function addShowtimeEntry() {
    const container = document.getElementById('showtimesContainer');
    const entry = document.createElement('div');
    entry.className = 'showtime-entry';
    entry.innerHTML = `
        <input type="time" class="glass-input showtime-time" required>
        <input type="number" class="glass-input showtime-price" placeholder="Price" required>
        <input type="text" class="glass-input showtime-screen" placeholder="Screen Type" required>
        <button type="button" onclick="this.parentElement.remove()" style="background: rgba(255,68,68,0.2); border: 1px solid #ff4444; color: #ff4444; padding: 8px 12px; border-radius: 5px; cursor: pointer;">Remove</button>
    `;
    container.appendChild(entry);
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
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
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Make functions globally available
window.showAddTheaterModal = showAddTheaterModal;
window.closeModal = closeModal;
window.saveTheater = saveTheater;
window.editTheater = editTheater;
window.deleteTheater = deleteTheater;
window.addShowtimeEntry = addShowtimeEntry;
