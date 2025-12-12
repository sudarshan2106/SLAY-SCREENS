// Admin Users Management JavaScript

// Mock users database (stored in localStorage)
// Mock users database (stored in localStorage)
// Fix: Read from 'users' key to match auth.js
let users = JSON.parse(localStorage.getItem('users')) || [];

let editingUserId = null;

document.addEventListener('DOMContentLoaded', function () {
    checkAdminAuth();
    loadUsers();
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
    const form = document.getElementById('userForm');
    if (form) {
        form.addEventListener('submit', handleUserSubmit);
    }
}

function loadUsers() {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    // Re-fetch users to ensure fresh data
    users = JSON.parse(localStorage.getItem('users')) || [];

    users.forEach(user => {
        const row = createUserRow(user);
        tbody.appendChild(row);
    });
}

function createUserRow(user) {
    const tr = document.createElement('tr');

    // Handle missing fields gracefully
    const joinDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A';
    const status = user.status || 'Active'; // Default to Active if not present

    tr.innerHTML = `
        <td><strong>${user.name}</strong></td>
        <td>${user.email}</td>
        <td>${user.phone || 'N/A'}</td>
        <td><span class="role-badge ${user.role.toLowerCase()}">${user.role}</span></td>
        <td>${joinDate}</td>
        <td><span class="status ${status.toLowerCase()}">${status}</span></td>
        <td>
            <button class="action-btn edit" onclick="editUser(${user.id})">
                <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn delete" onclick="deleteUser(${user.id})">
                <i class="fas fa-trash"></i>
            </button>
        </td>
    `;
    return tr;
}

function openAddModal() {
    editingUserId = null;
    document.getElementById('modalTitle').textContent = 'Add New User';
    document.getElementById('userForm').reset();
    document.getElementById('userModal').style.display = 'flex';
}

function editUser(id) {
    editingUserId = id;
    const user = users.find(u => u.id === id);
    if (!user) return;

    document.getElementById('modalTitle').textContent = 'Edit User';
    document.getElementById('name').value = user.name;
    document.getElementById('email').value = user.email;
    document.getElementById('phone').value = user.phone || '';
    document.getElementById('role').value = user.role;
    document.getElementById('status').value = user.status || 'Active';

    document.getElementById('userModal').style.display = 'flex';
}

function deleteUser(id) {
    const user = users.find(u => u.id === id);

    // Prevent deleting the current admin user
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user.email === currentUser.email) {
        alert('You cannot delete your own account!');
        return;
    }

    if (!confirm('Are you sure you want to delete this user?')) return;

    users = users.filter(u => u.id !== id);
    saveUsers();
    loadUsers();
    showNotification('User deleted successfully!', 'success');
}

function handleUserSubmit(e) {
    e.preventDefault();

    const userData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        role: document.getElementById('role').value,
        status: document.getElementById('status').value
    };

    if (editingUserId) {
        const index = users.findIndex(u => u.id === editingUserId);
        if (index !== -1) {
            // Preserve existing fields like password and createdAt
            users[index] = { ...users[index], ...userData };
            showNotification('User updated successfully!', 'success');
        }
    } else {
        const newUser = {
            id: Date.now(),
            ...userData,
            password: 'password123', // Default password for admin-created users
            createdAt: new Date().toISOString()
        };
        users.push(newUser);
        showNotification('User added successfully!', 'success');
    }

    saveUsers();
    loadUsers();
    closeModal();
}

function closeModal() {
    document.getElementById('userModal').style.display = 'none';
}

function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
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
window.editUser = editUser;
window.deleteUser = deleteUser;
window.closeModal = closeModal;
