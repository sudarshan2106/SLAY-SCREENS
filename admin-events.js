// Admin Events Management JavaScript

// Mock events database (stored in localStorage)
let events = JSON.parse(localStorage.getItem('adminEvents')) || [
    {
        id: 1,
        name: "Rock Concert 2024",
        category: "Music",
        date: "2024-12-20",
        time: "19:00",
        venue: "City Stadium",
        price: 1500,
        poster: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=500",
        description: "The biggest rock concert of the year featuring top artists.",
        status: "Active"
    },
    {
        id: 2,
        name: "IPL Cricket Match",
        category: "Sports",
        date: "2024-12-25",
        time: "15:00",
        venue: "National Cricket Stadium",
        price: 2000,
        poster: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=500",
        description: "Exciting IPL match between top teams.",
        status: "Active"
    },
    {
        id: 3,
        name: "Stand-Up Comedy Night",
        category: "Comedy",
        date: "2024-12-18",
        time: "20:00",
        venue: "Laugh Factory",
        price: 800,
        poster: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=500",
        description: "An evening of laughter with top comedians.",
        status: "Active"
    }
];

// Save default content to localStorage if empty
if (!localStorage.getItem('adminEvents')) {
    localStorage.setItem('adminEvents', JSON.stringify(events));
}

let editingEventId = null;

document.addEventListener('DOMContentLoaded', function () {
    checkAdminAuth();
    loadEvents();
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
    const form = document.getElementById('eventForm');
    if (form) {
        form.addEventListener('submit', handleEventSubmit);
    }
}

function loadEvents() {
    const tbody = document.getElementById('eventsTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    events.forEach(event => {
        const row = createEventRow(event);
        tbody.appendChild(row);
    });
}

function createEventRow(event) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td><img src="${event.poster}" alt="Poster" class="table-img"></td>
        <td>${event.name}</td>
        <td>${event.category}</td>
        <td>${event.date} ${event.time}</td>
        <td>${event.venue}</td>
        <td>₹${event.price}</td>
        <td><span class="status ${event.status.toLowerCase()}">${event.status}</span></td>
        <td>
            <button class="action-btn edit" onclick="editEvent(${event.id})">
                <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn delete" onclick="deleteEvent(${event.id})">
                <i class="fas fa-trash"></i>
            </button>
        </td>
    `;
    return tr;
}

function openAddModal() {
    editingEventId = null;
    document.getElementById('modalTitle').textContent = 'Add New Event';
    document.getElementById('eventForm').reset();
    document.getElementById('eventModal').style.display = 'flex';
}

function editEvent(id) {
    editingEventId = id;
    const event = events.find(e => e.id === id);
    if (!event) return;

    document.getElementById('modalTitle').textContent = 'Edit Event';
    document.getElementById('name').value = event.name;
    document.getElementById('category').value = event.category;
    document.getElementById('date').value = event.date;
    document.getElementById('time').value = event.time;
    document.getElementById('venue').value = event.venue;
    document.getElementById('price').value = event.price;
    document.getElementById('poster').value = event.poster;
    document.getElementById('description').value = event.description;
    document.getElementById('status').value = event.status;

    document.getElementById('eventModal').style.display = 'flex';
}

function deleteEvent(id) {
    if (!confirm('Are you sure you want to delete this event?')) return;

    events = events.filter(e => e.id !== id);
    saveEvents();
    loadEvents();
    showNotification('Event deleted successfully!', 'success');
}

function handleEventSubmit(e) {
    e.preventDefault();

    const eventData = {
        name: document.getElementById('name').value,
        category: document.getElementById('category').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        venue: document.getElementById('venue').value,
        price: parseInt(document.getElementById('price').value),
        poster: document.getElementById('poster').value,
        description: document.getElementById('description').value,
        status: document.getElementById('status').value
    };

    if (editingEventId) {
        const index = events.findIndex(e => e.id === editingEventId);
        if (index !== -1) {
            events[index] = { ...events[index], ...eventData };
            showNotification('Event updated successfully!', 'success');
        }
    } else {
        const newEvent = {
            id: Date.now(),
            ...eventData
        };
        events.push(newEvent);
        showNotification('Event added successfully!', 'success');
    }

    saveEvents();
    loadEvents();
    closeModal();
}

function closeModal() {
    document.getElementById('eventModal').style.display = 'none';
}

function saveEvents() {
    localStorage.setItem('adminEvents', JSON.stringify(events));
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
window.editEvent = editEvent;
window.deleteEvent = deleteEvent;
window.closeModal = closeModal;
