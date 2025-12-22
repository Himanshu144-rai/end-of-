// ===== MN TRADERS - INTERACTIVE SCRIPT =====

// Sample booking data for admin dashboard
let bookings = [
    { id: 1, name: "Rahul Sharma", product: "SS Ceiling Cloth Hanger", quantity: 5, date: "2024-03-20", time: "Morning", status: "pending" },
    { id: 2, name: "Priya Patel", product: "Aluminium Ladder", quantity: 2, date: "2024-03-19", time: "Afternoon", status: "confirmed" },
    { id: 3, name: "Amit Kumar", product: "Cash Hanger", quantity: 10, date: "2024-03-18", time: "Evening", status: "completed" },
    { id: 4, name: "Sneha Reddy", product: "SS Ceiling Cloth Hanger", quantity: 3, date: "2024-03-20", time: "Morning", status: "pending" },
    { id: 5, name: "Vikram Singh", product: "Custom Solution", quantity: 50, date: "2024-03-22", time: "Afternoon", status: "confirmed" }
];

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Navigation active state
    setupNavigation();
    
    // Product booking buttons
    setupProductBooking();
    
    // Initialize admin dashboard
    initDashboard();
    
    // Setup booking form
    setupBookingForm();
    
    // Setup enquiry form
    setupEnquiryForm();
    
    // Setup modal
    setupModal();
    
    // Initialize date picker with tomorrow as minimum
    initDatePicker();
    
    // Load recent bookings
    loadRecentBookings();
});

// ===== NAVIGATION =====
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    
    // Update active nav link on scroll
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Smooth scrolling
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// ===== PRODUCT BOOKING =====
function setupProductBooking() {
    const bookButtons = document.querySelectorAll('.book-btn');
    
    bookButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.getAttribute('data-product');
            const productSelect = document.getElementById('bookingProduct');
            
            // Scroll to booking section
            document.querySelector('#booking').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Set product in dropdown
            if (productSelect) {
                productSelect.value = productName;
                
                // Highlight the product selection
                productSelect.style.borderColor = '#D4AF37';
                productSelect.style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.2)';
                
                // Remove highlight after 3 seconds
                setTimeout(() => {
                    productSelect.style.borderColor = '#ddd';
                    productSelect.style.boxShadow = 'none';
                }, 3000);
            }
        });
    });
}

// ===== ADMIN DASHBOARD =====
function initDashboard() {
    updateDashboardStats();
}

function updateDashboardStats() {
    // Count bookings by status
    const pendingCount = bookings.filter(b => b.status === 'pending').length;
    const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
    const completedCount = bookings.filter(b => b.status === 'completed').length;
    
    // Update counts
    document.getElementById('pendingBookings').textContent = pendingCount;
    document.getElementById('confirmedBookings').textContent = confirmedCount;
    document.getElementById('completedOrders').textContent = completedCount;
    
    // Calculate revenue (simulated)
    const totalRevenue = completedCount * 15000; // Average order value
    document.getElementById('totalRevenue').textContent = totalRevenue.toLocaleString('en-IN');
}

function loadRecentBookings() {
    const tableBody = document.getElementById('recentBookingsTable');
    tableBody.innerHTML = '';
    
    // Sort bookings by date (newest first) and take first 5
    const recentBookings = [...bookings]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
    
    recentBookings.forEach(booking => {
        const row = document.createElement('tr');
        
        // Status badge
        let statusBadge = '';
        if (booking.status === 'pending') {
            statusBadge = '<span class="status-badge status-pending">Pending</span>';
        } else if (booking.status === 'confirmed') {
            statusBadge = '<span class="status-badge status-confirmed">Confirmed</span>';
        } else {
            statusBadge = '<span class="status-badge status-completed">Completed</span>';
        }
        
        // Action buttons
        const actions = booking.status === 'pending' 
            ? `<button class="btn-action confirm-btn" data-id="${booking.id}">Confirm</button>
               <button class="btn-action cancel-btn" data-id="${booking.id}">Cancel</button>`
            : '<span class="text-muted">No action</span>';
        
        row.innerHTML = `
            <td>${booking.name}</td>
            <td>${booking.product}</td>
            <td>${booking.quantity}</td>
            <td>${formatDate(booking.date)}</td>
            <td>${statusBadge}</td>
            <td>${actions}</td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Add event listeners to action buttons
    document.querySelectorAll('.confirm-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            updateBookingStatus(id, 'confirmed');
        });
    });
    
    document.querySelectorAll('.cancel-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            deleteBooking(id);
        });
    });
}

function updateBookingStatus(id, newStatus) {
    const bookingIndex = bookings.findIndex(b => b.id === id);
    if (bookingIndex !== -1) {
        bookings[bookingIndex].status = newStatus;
        updateDashboardStats();
        loadRecentBookings();
        
        // Show notification
        showNotification(`Booking #${id} has been ${newStatus}`, 'success');
    }
}

function deleteBooking(id) {
    if (confirm('Are you sure you want to cancel this booking?')) {
        bookings = bookings.filter(b => b.id !== id);
        updateDashboardStats();
        loadRecentBookings();
        
        // Show notification
        showNotification(`Booking #${id} has been cancelled`, 'warning');
    }
}

// ===== BOOKING FORM =====
function setupBookingForm() {
    const bookingForm = document.querySelector('.booking-form');
    const submitBtn = document.getElementById('submitBooking');
    
    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Validate form
            if (!validateBookingForm()) {
                return;
            }
            
            // Collect form data
            const bookingData = {
                id: bookings.length + 1,
                name: document.getElementById('bookingName').value,
                phone: document.getElementById('bookingPhone').value,
                email: document.getElementById('bookingEmail').value,
                product: document.getElementById('bookingProduct').value,
                quantity: document.getElementById('bookingQuantity').value,
                date: document.getElementById('bookingDate').value,
                time: document.getElementById('bookingTime').value,
                notes: document.getElementById('bookingNotes').value,
                status: 'pending',
                timestamp: new Date().toISOString()
            };
            
            // Add to bookings array
            bookings.unshift(bookingData);
            
            // Update dashboard
            updateDashboardStats();
            loadRecentBookings();
            
            // Show success modal
            showBookingSuccess(bookingData);
            
            // Reset form
            bookingForm.reset();
            
            // Reset date to tomorrow
            initDatePicker();
            
            // Send notification (simulated)
            simulateNotification(bookingData);
        });
    }
}

function validateBookingForm() {
    const name = document.getElementById('bookingName').value.trim();
    const phone = document.getElementById('bookingPhone').value.trim();
    const email = document.getElementById('bookingEmail').value.trim();
    const product = document.getElementById('bookingProduct').value;
    const date = document.getElementById('bookingDate').value;
    const terms = document.getElementById('bookingTerms').checked;
    
    let isValid = true;
    
    // Reset previous errors
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    document.querySelectorAll('.luxury-input, .luxury-select').forEach(el => {
        el.classList.remove('error');
    });
    
    // Validate name
    if (!name) {
        showError('bookingName', 'Please enter your full name');
        isValid = false;
    }
    
    // Validate phone
    if (!phone || phone.length < 10) {
        showError('bookingPhone', 'Please enter a valid 10-digit mobile number');
        isValid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        showError('bookingEmail', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate product
    if (!product) {
        showError('bookingProduct', 'Please select a product');
        isValid = false;
    }
    
    // Validate date
    if (!date) {
        showError('bookingDate', 'Please select a preferred date');
        isValid = false;
    }
    
    // Validate terms
    if (!terms) {
        alert('Please agree to the terms and conditions');
        isValid = false;
    }
    
    return isValid;
}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = '#DC3545';
    errorDiv.style.fontSize = '0.85rem';
    errorDiv.style.marginTop = '5px';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
    field.classList.add('error');
    field.style.borderColor = '#DC3545';
}

// ===== ENQUIRY FORM =====
function setupEnquiryForm() {
    const enquiryBtn = document.getElementById('submitEnquiry');
    
    if (enquiryBtn) {
        enquiryBtn.addEventListener('click', function() {
            const name = document.getElementById('enquiryName').value.trim();
            const phone = document.getElementById('enquiryPhone').value.trim();
            const product = document.getElementById('enquiryProduct').value;
            const message = document.getElementById('enquiryMessage').value.trim();
            
            if (!name || !phone || !product) {
                alert('Please fill all required fields');
                return;
            }
            
            // Simulate sending enquiry
            showNotification('Your enquiry has been sent successfully! We will contact you shortly.', 'success');
            
            // Reset form
            document.getElementById('enquiryForm').reset();
        });
    }
}

// ===== MODAL =====
function setupModal() {
    const modal = document.getElementById('successModal');
    const closeBtn = document.querySelector('.modal-close');
    const closeBtn2 = document.getElementById('modalClose');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    if (closeBtn2) {
        closeBtn2.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

function showBookingSuccess(bookingData) {
    const modal = document.getElementById('successModal');
    const detailsDiv = document.getElementById('bookingDetails');
    
    // Format booking details
    const detailsHTML = `
        <p><strong>Booking ID:</strong> MN-${bookingData.id.toString().padStart(4, '0')}</p>
        <p><strong>Name:</strong> ${bookingData.name}</p>
        <p><strong>Product:</strong> ${bookingData.product}</p>
        <p><strong>Quantity:</strong> ${bookingData.quantity}</p>
        <p><strong>Date:</strong> ${formatDate(bookingData.date)}</p>
        <p><strong>Time Slot:</strong> ${bookingData.time}</p>
    `;
    
    detailsDiv.innerHTML = detailsHTML;
    modal.style.display = 'flex';
}

// ===== UTILITY FUNCTIONS =====
function initDatePicker() {
    const dateInput = document.getElementById('bookingDate');
    if (dateInput) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        // Format as YYYY-MM-DD
        const minDate = tomorrow.toISOString().split('T')[0];
        dateInput.min = minDate;
        
        // Set default to tomorrow
        dateInput.value = minDate;
    }
}

function formatDate(dateString) {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#28A745' : type === 'warning' ? '#FFC107' : '#0A1931'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 3000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease;
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', function() {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

function simulateNotification(bookingData) {
    // Simulate sending WhatsApp notification
    console.log(`WhatsApp would be sent to +91${bookingData.phone}`);
    
    // Simulate sending email
    console.log(`Email would be sent to ${bookingData.email}`);
    
    // Simulate admin notification
    setTimeout(() => {
        showNotification(`New booking received from ${bookingData.name}`, 'success');
    }, 1000);
}

// ===== ADDITIONAL FEATURES =====
// Live clock in header
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
    
    const clockElement = document.getElementById('liveClock');
    if (!clockElement) {
        // Create clock element if it doesn't exist
        const clockDiv = document.createElement('div');
        clockDiv.id = 'liveClock';
        clockDiv.style.cssText = `
            color: var(--gold);
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 5px;
        `;
        
        const headerActions = document.querySelector('.header-actions');
        if (headerActions) {
            clockDiv.innerHTML = `<i class="fas fa-clock"></i> ${timeString}`;
            headerActions.appendChild(clockDiv);
        }
    } else {
        clockElement.innerHTML = `<i class="fas fa-clock"></i> ${timeString}`;
    }
}

// Update clock every minute
setInterval(updateClock, 60000);
updateClock();

// Add animation to product cards on scroll
function animateOnScroll() {
    const cards = document.querySelectorAll('.luxury-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
}

// Initialize animations when page loads
window.addEventListener('load', animateOnScroll);