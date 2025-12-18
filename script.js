// Add this to your existing script.js file

// Customer Data Storage
const CustomerData = {
    // Save customer inquiry
    saveInquiry: function(formData) {
        // Get existing leads or initialize empty array
        let leads = JSON.parse(localStorage.getItem('sharma_carpenter_leads')) || [];
        
        // Create new lead object
        const newLead = {
            id: 'lead_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            date: new Date().toLocaleDateString('en-IN'),
            time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
            status: 'new',
            name: formData.name || '',
            phone: formData.phone || '',
            email: formData.email || '',
            location: formData.location || '',
            service: formData.service || '',
            message: formData.message || ''
        };
        
        // Add to beginning of array (newest first)
        leads.unshift(newLead);
        
        // Save to localStorage
        localStorage.setItem('sharma_carpenter_leads', JSON.stringify(leads));
        
        return newLead;
    },
    
    // Get all leads
    getAllLeads: function() {
        return JSON.parse(localStorage.getItem('sharma_carpenter_leads')) || [];
    },
    
    // Update lead status
    updateLeadStatus: function(leadId, newStatus) {
        let leads = this.getAllLeads();
        const leadIndex = leads.findIndex(lead => lead.id === leadId);
        
        if (leadIndex !== -1) {
            leads[leadIndex].status = newStatus;
            localStorage.setItem('sharma_carpenter_leads', JSON.stringify(leads));
            return true;
        }
        
        return false;
    },
    
    // Delete lead
    deleteLead: function(leadId) {
        let leads = this.getAllLeads();
        const initialLength = leads.length;
        
        leads = leads.filter(lead => lead.id !== leadId);
        
        if (leads.length < initialLength) {
            localStorage.setItem('sharma_carpenter_leads', JSON.stringify(leads));
            return true;
        }
        
        return false;
    }
};

// Update your contact form submission to save data
// Find your existing contact form submission code and modify it:

// Example of how to modify your existing form submission:
/*
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        location: document.getElementById('location').value,
        service: document.getElementById('service').value,
        message: document.getElementById('message').value
    };
    
    // Save customer inquiry
    CustomerData.saveInquiry(formData);
    
    // Rest of your form submission logic...
    // Show success message, reset form, etc.
});
*/