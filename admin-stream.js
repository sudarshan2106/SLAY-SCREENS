// Admin Stream Management JavaScript

// Mock stream database (stored in localStorage)
let streamContent = JSON.parse(localStorage.getItem('adminStream')) || [
    {
        id: 1,
        title: "Oppenheimer",
        genre: "Biography",
        duration: "3h 00m",
        rating: 8.9,
        poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
        description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
        status: "Active"
    },
    {
        id: 2,
        title: "Barbie",
        genre: "Comedy",
        duration: "1h 54m",
        rating: 7.4,
        poster: "https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg",
        description: "Barbie suffers a crisis that leads her to question her world and her existence.",
        status: "Active"
    },
    {
        id: 3,
        title: "The Marvels",
        genre: "Action",
        duration: "1h 45m",
        rating: 6.8,
        poster: "https://image.tmdb.org/t/p/w500/9GBhzXMFjgcZ3FdR9w3bUMMTps5.jpg",
        description: "Carol Danvers gets her powers entangled with those of Kamala Khan and Monica Rambeau.",
        status: "Active"
    },
    {
        id: 4,
        title: "Napoleon",
        genre: "History",
        duration: "2h 38m",
        rating: 7.0,
        poster: "https://image.tmdb.org/t/p/w500/vcZWJGvB5xydWuUO1vaTLI82tGi.jpg",
        description: "An epic that details the checkered rise and fall of French Emperor Napoleon Bonaparte.",
        status: "Active"
    }
];

// Save default content to localStorage if empty
if (!localStorage.getItem('adminStream')) {
    localStorage.setItem('adminStream', JSON.stringify(streamContent));
}

let editingStreamId = null;

document.addEventListener('DOMContentLoaded', function () {
    checkAdminAuth();
    loadStreamContent();
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
    const form = document.getElementById('streamForm');
    if (form) {
        form.addEventListener('submit', handleStreamSubmit);
    }
}

function loadStreamContent() {
    const tbody = document.getElementById('streamTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    streamContent.forEach(item => {
        const row = createStreamRow(item);
        tbody.appendChild(row);
    });
}

function createStreamRow(item) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td><img src="${item.poster}" alt="Poster" class="table-img"></td>
        <td>${item.title}</td>
        <td>${item.genre}</td>
        <td>${item.duration}</td>
        <td><i class="fas fa-star" style="color: gold;"></i> ${item.rating}</td>
        <td><span class="status ${item.status.toLowerCase()}">${item.status}</span></td>
        <td>
            <button class="action-btn edit" onclick="editStream(${item.id})">
                <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn delete" onclick="deleteStream(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </td>
    `;
    return tr;
}

function openAddModal() {
    editingStreamId = null;
    document.getElementById('modalTitle').textContent = 'Add New Content';
    document.getElementById('streamForm').reset();
    document.getElementById('streamModal').style.display = 'flex';
}

function editStream(id) {
    editingStreamId = id;
    const item = streamContent.find(s => s.id === id);
    if (!item) return;

    document.getElementById('modalTitle').textContent = 'Edit Content';
    document.getElementById('title').value = item.title;
    document.getElementById('genre').value = item.genre;
    document.getElementById('duration').value = item.duration;
    document.getElementById('rating').value = item.rating;
    document.getElementById('poster').value = item.poster;
    document.getElementById('description').value = item.description;
    document.getElementById('status').value = item.status;

    document.getElementById('streamModal').style.display = 'flex';
}

function deleteStream(id) {
    if (!confirm('Are you sure you want to delete this content?')) return;

    streamContent = streamContent.filter(s => s.id !== id);
    saveStreamContent();
    loadStreamContent();
    showNotification('Content deleted successfully!', 'success');
}

function handleStreamSubmit(e) {
    e.preventDefault();

    const streamData = {
        title: document.getElementById('title').value,
        genre: document.getElementById('genre').value,
        duration: document.getElementById('duration').value,
        rating: parseFloat(document.getElementById('rating').value),
        poster: document.getElementById('poster').value,
        description: document.getElementById('description').value,
        status: document.getElementById('status').value
    };

    if (editingStreamId) {
        const index = streamContent.findIndex(s => s.id === editingStreamId);
        if (index !== -1) {
            streamContent[index] = { ...streamContent[index], ...streamData };
            showNotification('Content updated successfully!', 'success');
        }
    } else {
        const newStream = {
            id: Date.now(),
            ...streamData
        };
        streamContent.push(newStream);
        showNotification('Content added successfully!', 'success');
    }

    saveStreamContent();
    loadStreamContent();
    closeModal();
}

function closeModal() {
    document.getElementById('streamModal').style.display = 'none';
}

function saveStreamContent() {
    localStorage.setItem('adminStream', JSON.stringify(streamContent));
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
window.editStream = editStream;
window.deleteStream = deleteStream;
window.closeModal = closeModal;
