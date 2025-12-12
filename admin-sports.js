// Admin Sports Management JavaScript

// Mock sports database (stored in localStorage)
let sports = JSON.parse(localStorage.getItem('adminSports')) || [
    {
        id: 1,
        team1: "Mumbai Indians",
        team2: "Chennai Super Kings",
        sportType: "Cricket",
        league: "IPL",
        date: "2024-12-20",
        time: "19:30",
        venue: "Wankhede Stadium",
        price: 1500,
        status: "Active"
    },
    {
        id: 2,
        team1: "India",
        team2: "Australia",
        sportType: "Cricket",
        league: "Test Match",
        date: "2024-12-26",
        time: "09:30",
        venue: "MCG, Melbourne",
        price: 3000,
        status: "Active"
    },
    {
        id: 3,
        team1: "FC Goa",
        team2: "Mumbai City FC",
        sportType: "Football",
        league: "ISL",
        date: "2024-12-18",
        time: "19:30",
        venue: "Fatorda Stadium",
        price: 500,
        status: "Active"
    }
];

// Save default content to localStorage if empty
if (!localStorage.getItem('adminSports')) {
    localStorage.setItem('adminSports', JSON.stringify(sports));
}

let editingSportId = null;

document.addEventListener('DOMContentLoaded', function () {
    checkAdminAuth();
    loadSports();
    setupEventListeners();
});

function checkAdminAuth() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.role || user.role !== 'ADMIN') {
        alert('Access denied! Admin login required.');
        window.location.href = '../login.html';
    }
}

function setupEventListeners() {
    const form = document.getElementById('sportForm');
    if (form) {
        form.addEventListener('submit', handleSportSubmit);
    }
}

function loadSports() {
    const tbody = document.getElementById('sportsTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    sports.forEach(sport => {
        const row = createSportRow(sport);
        tbody.appendChild(row);
    });
}

function createSportRow(sport) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${sport.team1} vs ${sport.team2}</td>
        <td>${sport.sportType} (${sport.league})</td>
        <td>${sport.date} ${sport.time}</td>
        <td>${sport.venue}</td>
        <td>₹${sport.price}</td>
        <td><span class="status ${sport.status.toLowerCase()}">${sport.status}</span></td>
        <td>
            <button class="action-btn edit" onclick="editSport(${sport.id})">
                <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn delete" onclick="deleteSport(${sport.id})">
                <i class="fas fa-trash"></i>
            </button>
        </td>
    `;
    return tr;
}

function openAddModal() {
    editingSportId = null;
    document.getElementById('modalTitle').textContent = 'Add New Match';
    document.getElementById('sportForm').reset();
    document.getElementById('sportModal').style.display = 'flex';
}

function editSport(id) {
    editingSportId = id;
    const sport = sports.find(s => s.id === id);
    if (!sport) return;

    document.getElementById('modalTitle').textContent = 'Edit Match';
    document.getElementById('team1').value = sport.team1;
    document.getElementById('team2').value = sport.team2;
    document.getElementById('sportType').value = sport.sportType;
    document.getElementById('league').value = sport.league;
    document.getElementById('date').value = sport.date;
    document.getElementById('time').value = sport.time;
    document.getElementById('venue').value = sport.venue;
    document.getElementById('price').value = sport.price;
    document.getElementById('status').value = sport.status;

    document.getElementById('sportModal').style.display = 'flex';
}

function deleteSport(id) {
    if (!confirm('Are you sure you want to delete this match?')) return;

    sports = sports.filter(s => s.id !== id);
    saveSports();
    loadSports();
    showNotification('Match deleted successfully!', 'success');
}

function handleSportSubmit(e) {
    e.preventDefault();

    const sportData = {
        team1: document.getElementById('team1').value,
        team2: document.getElementById('team2').value,
        sportType: document.getElementById('sportType').value,
        league: document.getElementById('league').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        venue: document.getElementById('venue').value,
        price: parseInt(document.getElementById('price').value),
        status: document.getElementById('status').value
    };

    if (editingSportId) {
        const index = sports.findIndex(s => s.id === editingSportId);
        if (index !== -1) {
            sports[index] = { ...sports[index], ...sportData };
            showNotification('Match updated successfully!', 'success');
        }
    } else {
        const newSport = {
            id: Date.now(),
            ...sportData
        };
        sports.push(newSport);
        showNotification('Match added successfully!', 'success');
    }

    saveSports();
    loadSports();
    closeModal();
}

function closeModal() {
    document.getElementById('sportModal').style.display = 'none';
}

function saveSports() {
    localStorage.setItem('adminSports', JSON.stringify(sports));
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
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Make functions globally available
window.openAddModal = openAddModal;
window.editSport = editSport;
window.deleteSport = deleteSport;
window.closeModal = closeModal;
