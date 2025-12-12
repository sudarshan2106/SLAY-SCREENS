// Admin Bookings Management JavaScript

let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', function () {
    checkAdminAuth();
    loadBookings();
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
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', function () {
            currentFilter = this.value;
            loadBookings();
        });
    }
}

function loadBookings() {
    const tbody = document.getElementById('bookingsTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    // Read real bookings from localStorage
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];

    let filteredBookings = bookings;
    if (currentFilter !== 'all') {
        filteredBookings = bookings.filter(b => b.status === currentFilter);
    }

    if (filteredBookings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 2rem;">No bookings found</td></tr>';
        return;
    }

    // Sort by booking date (newest first)
    filteredBookings.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));

    filteredBookings.forEach(booking => {
        const row = createBookingRow(booking);
        tbody.appendChild(row);
    });
}

function createBookingRow(booking) {
    const tr = document.createElement('tr');

    // Handle different booking types
    let itemTitle, itemVenue, itemDate, itemTime, itemSeats;

    if (booking.type === 'SPORTS') {
        itemTitle = `${booking.item.team1} vs ${booking.item.team2}`;
        itemVenue = booking.item.venue;
        itemDate = booking.item.date;
        itemTime = booking.item.time;
        itemSeats = `${booking.quantity} x Tickets`;
    } else if (booking.type === 'EVENT') {
        itemTitle = booking.item.name;
        itemVenue = booking.item.venue;
        itemDate = booking.item.date;
        itemTime = booking.item.time;
        itemSeats = `${booking.quantity} x Tickets`;
    } else {
        // Default to Movie
        itemTitle = booking.movie ? booking.movie.title : 'Unknown Movie';
        itemVenue = 'INOX: Megaplex';
        itemDate = booking.date;
        itemTime = booking.time;
        itemSeats = booking.seats ? booking.seats.join(', ') : 'N/A';
    }

    tr.innerHTML = `
        <td><strong>${booking.bookingId}</strong></td>
        <td>
            <div style="display: flex; flex-direction: column;">
                <span style="font-weight: 600;">${booking.customerName}</span>
                <small style="color: var(--text-muted);">${booking.customerEmail}</small>
                ${booking.customerPhone ? `<small style="color: var(--text-muted);">${booking.customerPhone}</small>` : ''}
            </div>
        </td>
        <td>
            <div style="display: flex; flex-direction: column;">
                <span style="font-weight: 600;">${itemTitle}</span>
                <small style="color: var(--text-muted);">${itemVenue}</small>
            </div>
        </td>
        <td>
            <div style="display: flex; flex-direction: column;">
                <span>${itemDate}</span>
                <small style="color: var(--text-muted);">${itemTime}</small>
            </div>
        </td>
        <td>${itemSeats}</td>
        <td style="color: var(--neon-green); font-weight: 600;">₹${booking.totalAmount || booking.totalPrice}</td>
        <td><span class="status ${booking.status.toLowerCase()}">${booking.status}</span></td>
        <td>
            <button class="action-btn" onclick="viewBookingDetails('${booking.bookingId}')" title="View Details">
                <i class="fas fa-eye"></i>
            </button>
        </td>
    `;
    return tr;
}

function viewBookingDetails(bookingId) {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const booking = bookings.find(b => b.bookingId === bookingId);

    if (!booking) {
        alert('Booking not found');
        return;
    }

    const bookingDate = new Date(booking.bookingDate);

    let itemDetails = '';
    if (booking.type === 'SPORTS') {
        itemDetails = `
MATCH DETAILS
────────────────────────────────────
Match: ${booking.item.team1} vs ${booking.item.team2}
Venue: ${booking.item.venue}
Date: ${booking.item.date}
Time: ${booking.item.time}
League: ${booking.item.league}
        `;
    } else if (booking.type === 'EVENT') {
        itemDetails = `
EVENT DETAILS
────────────────────────────────────
Event: ${booking.item.name}
Venue: ${booking.item.venue}
Date: ${booking.item.date}
Time: ${booking.item.time}
Category: ${booking.item.category}
        `;
    } else {
        itemDetails = `
MOVIE DETAILS
────────────────────────────────────
Title: ${booking.movie ? booking.movie.title : 'Unknown'}
Theater: INOX: Megaplex
Date: ${booking.date}
Time: ${booking.time}
        `;
    }

    const details = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BOOKING DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Booking ID: ${booking.bookingId}
Status: ${booking.status}

CUSTOMER INFORMATION
────────────────────────────────────
Name: ${booking.customerName}
Email: ${booking.customerEmail}
Phone: ${booking.customerPhone || 'N/A'}

${itemDetails}

BOOKING SUMMARY
────────────────────────────────────
Seats/Qty: ${booking.seats ? booking.seats.join(', ') : booking.quantity + ' Tickets'}
Total Amount: ₹${booking.totalAmount || booking.totalPrice}

Booked On: ${bookingDate.toLocaleString()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `;

    alert(details);
}

function saveBookings() {
    // Note: Admin view is read-only, bookings are saved by user actions
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    localStorage.setItem('bookings', JSON.stringify(bookings));
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
window.viewBookingDetails = viewBookingDetails;
