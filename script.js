// script.js - Oh Yes Events Wedding Requirement System
// Warm, human-friendly form handling with PDF generation

// Store form data globally
let formData = {};

// DOM Elements
const weddingForm = document.getElementById('weddingForm');
const summaryModal = document.getElementById('summaryModal');
const successModal = document.getElementById('successModal');
const summaryContent = document.getElementById('summaryContent');
const confirmSubmitBtn = document.getElementById('confirmSubmitBtn');
const editFormBtn = document.getElementById('editFormBtn');
const closeSummaryBtn = document.querySelector('.close-summary');
const closeSuccessBtn = document.getElementById('closeSuccessBtn');
const successClientNameSpan = document.getElementById('successClientName');

// Progress tracker functionality
const progressSteps = document.querySelectorAll('.progress-step');
const formSections = document.querySelectorAll('.form-section');

// Helper: Show friendly toast message
function showToast(message, isError = false) {
    let toast = document.querySelector('.toast-message');
    if (toast) toast.remove();
    
    toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.style.background = isError ? '#dc3545' : '#2d6a4f';
    toast.style.color = 'white';
    toast.style.position = 'fixed';
    toast.style.bottom = '30px';
    toast.style.right = '30px';
    toast.style.padding = '14px 24px';
    toast.style.borderRadius = '50px';
    toast.style.fontWeight = '500';
    toast.style.zIndex = '10000';
    toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '12px';
    toast.style.fontFamily = 'Inter, sans-serif';
    toast.innerHTML = `<i class="fas ${isError ? 'fa-exclamation-triangle' : 'fa-check-circle'}" style="font-size: 1.2rem;"></i> ${message}`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        if (toast) toast.remove();
    }, 4000);
}

// Helper: Format currency in Indian style
function formatCurrency(amount) {
    if (!amount || amount === '') return 'Not specified';
    const num = parseInt(amount);
    if (isNaN(num)) return amount;
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(num);
}

// Helper: Format date nicely
function formatDate(dateString) {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

// Helper: Get selected checkbox values
function getSelectedValues(className) {
    const checkboxes = document.querySelectorAll(`.${className}:checked`);
    return Array.from(checkboxes).map(cb => cb.value);
}

// Helper: Get priority areas
function getPriorityAreas() {
    const priorities = document.querySelectorAll('.priority-item:checked');
    return Array.from(priorities).map(p => p.value);
}

// Helper: Get vibe selections
function getVibeSelections() {
    const vibes = document.querySelectorAll('.vibe-item:checked');
    return Array.from(vibes).map(v => v.value);
}

// Helper: Get uploaded file names
function getFileNames() {
    const fileInput = document.getElementById('referenceImages');
    if (fileInput.files.length > 0) {
        return Array.from(fileInput.files).map(f => f.name).join(', ');
    }
    return 'No files uploaded';
}

// Collect all form data from the page
function collectFormData() {
    // Basic Info
    const clientName = document.getElementById('clientName')?.value.trim() || '';
    const contactNumber = document.getElementById('contactNumber')?.value.trim() || '';
    const email = document.getElementById('email')?.value.trim() || '';
    const eventType = document.getElementById('eventType')?.value || '';
    const eventDate = document.getElementById('eventDate')?.value || '';
    const venue = document.getElementById('venue')?.value.trim() || '';
    const guestCount = document.getElementById('guestCount')?.value || '';
    const functionDays = document.getElementById('functionDays')?.value || '';
    
    // Budget
    const totalBudget = document.getElementById('totalBudget')?.value || '';
    const budgetStatus = document.getElementById('budgetStatus')?.value || '';
    const budgetBreakdown = document.getElementById('budgetBreakdown')?.value || '';
    
    // Style & Dreams
    const colorPalette = document.getElementById('colorPalette')?.value || '';
    const referenceLinks = document.getElementById('referenceLinks')?.value || '';
    const fileNames = getFileNames();
    const vibeSelections = getVibeSelections();
    
    // Priorities & Non-negotiables
    const priorityAreas = getPriorityAreas();
    const nonNegotiables = document.getElementById('nonNegotiables')?.value || '';
    const restrictions = document.getElementById('restrictions')?.value || '';
    const criticalDeadlines = document.getElementById('criticalDeadlines')?.value || '';
    
    // All 9 service categories (based on PDF checklist)
    const stationary = getSelectedValues('stationary-item');
    const hotels = getSelectedValues('hotel-item');
    const transport = getSelectedValues('transport-item');
    const hampers = getSelectedValues('hamper-item');
    const artists = getSelectedValues('artist-item');
    const vendors = getSelectedValues('vendor-item');
    const other = getSelectedValues('other-item');
    const addons = getSelectedValues('addon-item');
    const crew = getSelectedValues('crew-item');
    
    // Newsletter preference
    const newsletter = document.getElementById('newsletterCheckbox')?.checked || false;
    
    return {
        clientName, contactNumber, email, eventType, eventDate, venue, guestCount, functionDays,
        totalBudget, budgetStatus, budgetBreakdown,
        colorPalette, referenceLinks, fileNames, vibeSelections,
        priorityAreas, nonNegotiables, restrictions, criticalDeadlines,
        stationary, hotels, transport, hampers, artists, vendors, other, addons, crew,
        newsletter
    };
}

// Validate all required fields with friendly messages
function validateForm(data) {
    if (!data.clientName) return 'Please tell us your name — we\'d love to know who we\'re planning for! 💝';
    if (!data.contactNumber) return 'Please share your phone number so we can call you and say hello! 📞';
    if (!data.email) return 'We need your email address to send you the celebration summary. 📧';
    if (!data.eventType) return 'Please let us know what you\'re celebrating — wedding, engagement, or something else? 🎉';
    if (!data.eventDate) return 'When is your special day? Even an approximate date helps us plan! 📅';
    if (!data.venue) return 'Where will the celebration take place? (Or tell us if you need help finding a venue!) 📍';
    if (!data.guestCount) return 'About how many guests are you expecting? This helps us plan better. 👥';
    if (!data.functionDays) return 'How many days will you be celebrating? One day or multiple? 🎊';
    if (!data.totalBudget) return 'What\'s your approximate budget? Don\'t worry — we work with all ranges! 💰';
    if (!data.budgetStatus) return 'Please let us know your budget status — approved, pending, or flexible? 🤝';
    if (!data.nonNegotiables) return 'What are the things that absolutely MUST happen on your special day? This helps us make it perfect! ⭐';
    
    const confirmationCheckbox = document.getElementById('confirmationCheckbox');
    if (!confirmationCheckbox?.checked) return 'Please confirm that the information is accurate so we can plan your dream celebration! ✅';
    
    return null;
}

// Escape HTML to prevent issues
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// Generate beautiful summary HTML for review modal
function generateSummaryHTML(data) {
    const hasItems = (arr) => arr && arr.length > 0;
    
    return `
        <div class="summary-section">
            <h4><i class="fas fa-user-check"></i> About You</h4>
            <p><strong>Your name(s):</strong> ${escapeHtml(data.clientName)}</p>
            <p><strong>Phone:</strong> ${escapeHtml(data.contactNumber)}</p>
            <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
        </div>
        
        <div class="summary-section">
            <h4><i class="fas fa-calendar-alt"></i> Your Celebration</h4>
            <p><strong>Event type:</strong> ${data.eventType}</p>
            <p><strong>Date:</strong> ${formatDate(data.eventDate)}</p>
            <p><strong>Venue:</strong> ${escapeHtml(data.venue)}</p>
            <p><strong>Guests:</strong> ${data.guestCount} people</p>
            <p><strong>Duration:</strong> ${data.functionDays} day(s)</p>
        </div>
        
        <div class="summary-section">
            <h4><i class="fas fa-rupee-sign"></i> Budget</h4>
            <p><strong>Total budget:</strong> ${formatCurrency(data.totalBudget)}</p>
            <p><strong>Status:</strong> ${data.budgetStatus}</p>
            ${data.budgetBreakdown ? `<p><strong>Where you want to splurge:</strong> ${escapeHtml(data.budgetBreakdown)}</p>` : ''}
        </div>
        
        <div class="summary-section">
            <h4><i class="fas fa-palette"></i> Your Style & Dreams</h4>
            ${data.colorPalette ? `<p><strong>Colors/Theme:</strong> ${escapeHtml(data.colorPalette)}</p>` : ''}
            ${data.vibeSelections.length > 0 ? `<p><strong>Vibe:</strong> ${data.vibeSelections.join(', ')}</p>` : ''}
            ${data.referenceLinks ? `<p><strong>Inspiration links:</strong> ${escapeHtml(data.referenceLinks)}</p>` : ''}
            <p><strong>Photos uploaded:</strong> ${data.fileNames}</p>
        </div>
        
        <div class="summary-section">
            <h4><i class="fas fa-heart"></i> What Matters Most</h4>
            <p><strong>Top priorities:</strong> ${data.priorityAreas.length > 0 ? data.priorityAreas.map(p => `<span class="summary-tag">${p}</span>`).join('') : 'Not specified'}</p>
            <p><strong>Must-haves:</strong> ${escapeHtml(data.nonNegotiables)}</p>
            ${data.restrictions ? `<p><strong>Things to avoid:</strong> ${escapeHtml(data.restrictions)}</p>` : ''}
            ${data.criticalDeadlines ? `<p><strong>Important deadlines:</strong> ${escapeHtml(data.criticalDeadlines)}</p>` : ''}
        </div>
        
        <div class="summary-section">
            <h4><i class="fas fa-clipboard-list"></i> Services You're Interested In</h4>
            ${hasItems(data.stationary) ? `<p><strong>📨 Invitations & Paper:</strong> ${data.stationary.join(', ')}</p>` : ''}
            ${hasItems(data.hotels) ? `<p><strong>🏨 Guest Stays:</strong> ${data.hotels.join(', ')}</p>` : ''}
            ${hasItems(data.transport) ? `<p><strong>🚗 Transportation:</strong> ${data.transport.join(', ')}</p>` : ''}
            ${hasItems(data.hampers) ? `<p><strong>🎁 Gifts & Hampers:</strong> ${data.hampers.join(', ')}</p>` : ''}
            ${hasItems(data.artists) ? `<p><strong>🎵 Entertainment:</strong> ${data.artists.join(', ')}</p>` : ''}
            ${hasItems(data.vendors) ? `<p><strong>🤝 Vendors:</strong> ${data.vendors.join(', ')}</p>` : ''}
            ${hasItems(data.other) ? `<p><strong>✨ Extra Care:</strong> ${data.other.join(', ')}</p>` : ''}
            ${hasItems(data.addons) ? `<p><strong>🎉 Fun Add-ons:</strong> ${data.addons.join(', ')}</p>` : ''}
            ${hasItems(data.crew) ? `<p><strong>👥 Event Day Team:</strong> ${data.crew.join(', ')}</p>` : ''}
            ${!hasItems(data.stationary) && !hasItems(data.hotels) && !hasItems(data.transport) && !hasItems(data.hampers) && !hasItems(data.artists) && !hasItems(data.vendors) && !hasItems(data.other) && !hasItems(data.addons) && !hasItems(data.crew) ? '<p><em>No specific services selected yet — that\'s okay! We\'ll help you figure out what you need.</em></p>' : ''}
        </div>
        
        <div class="summary-section newsletter-note">
            <i class="fas fa-envelope"></i>
            <p>${data.newsletter ? '✓ You\'ll receive wedding tips and inspiration via email!' : 'You opted out of emails — no worries, we\'ll only contact you about your event.'}</p>
        </div>
    `;
}

// Generate PDF with all requirements (professional yet warm)
async function generatePDF(data) {
    // Create hidden container for PDF
    const pdfContainer = document.createElement('div');
    pdfContainer.id = 'pdfContainer';
    pdfContainer.style.position = 'absolute';
    pdfContainer.style.left = '-9999px';
    pdfContainer.style.top = '-9999px';
    pdfContainer.style.width = '800px';
    pdfContainer.style.backgroundColor = 'white';
    pdfContainer.style.padding = '35px';
    pdfContainer.style.fontFamily = "'Inter', 'Segoe UI', Arial, sans-serif";
    pdfContainer.style.color = '#1a1a2e';
    pdfContainer.style.lineHeight = '1.5';
    
    const hasItems = (arr) => arr && arr.length > 0;
    const currentDate = new Date().toLocaleString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    
    pdfContainer.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #e94560; padding-bottom: 20px;">
            <div style="font-size: 32px; color: #e94560; margin-bottom: 8px;">✨ Oh Yes Events ✨</div>
            <h1 style="color: #1a1a2e; margin: 5px 0; font-size: 24px;">Wedding Requirement Summary</h1>
            <p style="color: #666; font-size: 11px; margin-top: 10px;">Generated on ${currentDate}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h2 style="color: #e94560; font-size: 18px; border-left: 4px solid #e94560; padding-left: 12px; margin: 20px 0 12px 0;">👋 About the Couple</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 6px 0; width: 35%;"><strong>Name(s):</strong></td><td>${escapeHtml(data.clientName)}</td></tr>
                <tr><td style="padding: 6px 0;"><strong>Phone:</strong></td><td>${escapeHtml(data.contactNumber)}</td></tr>
                <tr><td style="padding: 6px 0;"><strong>Email:</strong></td><td>${escapeHtml(data.email)}</td></tr>
            </table>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h2 style="color: #e94560; font-size: 18px; border-left: 4px solid #e94560; padding-left: 12px; margin: 20px 0 12px 0;">📅 Event Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 6px 0;"><strong>Event Type:</strong></td><td>${data.eventType}</td></tr>
                <tr><td style="padding: 6px 0;"><strong>Date:</strong></td><td>${formatDate(data.eventDate)}</td></tr>
                <tr><td style="padding: 6px 0;"><strong>Venue:</strong></td><td>${escapeHtml(data.venue)}</td></tr>
                <tr><td style="padding: 6px 0;"><strong>Guest Count:</strong></td><td>${data.guestCount} guests</td></tr>
                <tr><td style="padding: 6px 0;"><strong>Celebration Duration:</strong></td><td>${data.functionDays} day(s)</td></tr>
            </table>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h2 style="color: #e94560; font-size: 18px; border-left: 4px solid #e94560; padding-left: 12px; margin: 20px 0 12px 0;">💰 Budget Information</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 6px 0;"><strong>Total Budget:</strong></td><td>${formatCurrency(data.totalBudget)}</td></tr>
                <tr><td style="padding: 6px 0;"><strong>Budget Status:</strong></td><td>${data.budgetStatus}</td></tr>
                ${data.budgetBreakdown ? `<tr><td style="padding: 6px 0;"><strong>Budget Focus:</strong></td><td>${escapeHtml(data.budgetBreakdown)}</td></tr>` : ''}
            </table>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h2 style="color: #e94560; font-size: 18px; border-left: 4px solid #e94560; padding-left: 12px; margin: 20px 0 12px 0;">🎨 Style & Inspiration</h2>
            ${data.colorPalette ? `<p><strong>Colors/Theme:</strong> ${escapeHtml(data.colorPalette)}</p>` : ''}
            ${data.vibeSelections.length > 0 ? `<p><strong>Preferred Vibe:</strong> ${data.vibeSelections.join(', ')}</p>` : ''}
            ${data.referenceLinks ? `<p><strong>Inspiration Links:</strong> ${escapeHtml(data.referenceLinks)}</p>` : ''}
            <p><strong>Uploaded Photos:</strong> ${data.fileNames}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h2 style="color: #e94560; font-size: 18px; border-left: 4px solid #e94560; padding-left: 12px; margin: 20px 0 12px 0;">⭐ Priorities & Must-Haves</h2>
            <p><strong>Top Priority Areas:</strong> ${data.priorityAreas.length > 0 ? data.priorityAreas.join(', ') : 'Not specified'}</p>
            <p><strong>Non-Negotiables (Must-Haves):</strong> ${escapeHtml(data.nonNegotiables)}</p>
            ${data.restrictions ? `<p><strong>Things to Avoid:</strong> ${escapeHtml(data.restrictions)}</p>` : ''}
            ${data.criticalDeadlines ? `<p><strong>Important Deadlines:</strong> ${escapeHtml(data.criticalDeadlines)}</p>` : ''}
        </div>
        
        <div style="margin-bottom: 20px;">
            <h2 style="color: #e94560; font-size: 18px; border-left: 4px solid #e94560; padding-left: 12px; margin: 20px 0 12px 0;">📋 Services Requested</h2>
            ${hasItems(data.stationary) ? `<p><strong>Invitations & Paper:</strong> ${data.stationary.join(', ')}</p>` : ''}
            ${hasItems(data.hotels) ? `<p><strong>Guest Stays:</strong> ${data.hotels.join(', ')}</p>` : ''}
            ${hasItems(data.transport) ? `<p><strong>Transportation:</strong> ${data.transport.join(', ')}</p>` : ''}
            ${hasItems(data.hampers) ? `<p><strong>Gifts & Hampers:</strong> ${data.hampers.join(', ')}</p>` : ''}
            ${hasItems(data.artists) ? `<p><strong>Entertainment:</strong> ${data.artists.join(', ')}</p>` : ''}
            ${hasItems(data.vendors) ? `<p><strong>Vendors:</strong> ${data.vendors.join(', ')}</p>` : ''}
            ${hasItems(data.other) ? `<p><strong>Extra Services:</strong> ${data.other.join(', ')}</p>` : ''}
            ${hasItems(data.addons) ? `<p><strong>Add-ons:</strong> ${data.addons.join(', ')}</p>` : ''}
            ${hasItems(data.crew) ? `<p><strong>Event Day Crew:</strong> ${data.crew.join(', ')}</p>` : ''}
            ${!hasItems(data.stationary) && !hasItems(data.hotels) && !hasItems(data.transport) && !hasItems(data.hampers) && !hasItems(data.artists) && !hasItems(data.vendors) && !hasItems(data.other) && !hasItems(data.addons) && !hasItems(data.crew) ? '<p><em>No specific services selected — the client would like consultation to determine needs.</em></p>' : ''}
        </div>
        
        <div style="margin-top: 35px; text-align: center; font-size: 11px; color: #888; border-top: 1px solid #ddd; padding-top: 20px;">
            This document was generated from the Oh Yes Events Wedding Requirement System.<br>
            Our team will contact the client within 24 hours. ✨ Let's create magic! ✨
        </div>
    `;
    
    document.body.appendChild(pdfContainer);
    
    // Allow DOM to render
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `OhYes_Events_${data.clientName.replace(/\s/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, letterRendering: true, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    
    try {
        await html2pdf().set(opt).from(pdfContainer).save();
        showToast('📄 Your celebration summary PDF has been downloaded!');
    } catch (error) {
        console.error('PDF Error:', error);
        showToast('⚠️ Could not generate PDF automatically, but your information has been saved!', true);
    }
    
    document.body.removeChild(pdfContainer);
}

// Send email via mailto with friendly message
function sendEmail(data) {
    const subject = `🎉 New Wedding Inquiry: ${data.clientName} - ${formatDate(data.eventDate)}`;
    const body = `Hello Oh Yes Events Team,

A new wedding requirement has been submitted!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 CLIENT INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Client Name: ${data.clientName}
Phone: ${data.contactNumber}
Email: ${data.email}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎊 EVENT DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Event Type: ${data.eventType}
Event Date: ${formatDate(data.eventDate)}
Venue: ${data.venue}
Guest Count: ${data.guestCount}
Celebration Duration: ${data.functionDays} day(s)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 BUDGET
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Budget: ${formatCurrency(data.totalBudget)}
Budget Status: ${data.budgetStatus}
${data.budgetBreakdown ? `Budget Focus: ${data.budgetBreakdown}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 STYLE & INSPIRATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${data.colorPalette ? `Theme/Colors: ${data.colorPalette}` : ''}
${data.vibeSelections.length > 0 ? `Vibe: ${data.vibeSelections.join(', ')}` : ''}
${data.referenceLinks ? `Reference Links: ${data.referenceLinks}` : ''}
Photos Uploaded: ${data.fileNames}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⭐ PRIORITIES & MUST-HAVES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Top Priorities: ${data.priorityAreas.join(', ') || 'Not specified'}
NON-NEGOTIABLE MUST-HAVES:
${data.nonNegotiables}
${data.restrictions ? `\nThings to Avoid:\n${data.restrictions}` : ''}
${data.criticalDeadlines ? `\nCritical Deadlines:\n${data.criticalDeadlines}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 SERVICES REQUESTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Invitations & Paper: ${data.stationary.join(', ') || 'None'}
Guest Stays: ${data.hotels.join(', ') || 'None'}
Transportation: ${data.transport.join(', ') || 'None'}
Gifts & Hampers: ${data.hampers.join(', ') || 'None'}
Entertainment: ${data.artists.join(', ') || 'None'}
Vendors: ${data.vendors.join(', ') || 'None'}
Extra Services: ${data.other.join(', ') || 'None'}
Add-ons: ${data.addons.join(', ') || 'None'}
Event Day Crew: ${data.crew.join(', ') || 'None'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 Newsletter Opt-in: ${data.newsletter ? 'YES' : 'NO'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Please review and contact the client within 24 hours.

✨ Let's create magic! ✨
---
This message was generated by the Oh Yes Events Wedding Requirement System.
`;
    
    const mailtoLink = `mailto:kisneylogesh78823@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, '_blank');
}

// Handle form submission
weddingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = collectFormData();
    const validationError = validateForm(data);
    
    if (validationError) {
        showToast(validationError, true);
        // Scroll to top to show error
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }
    
    formData = data;
    summaryContent.innerHTML = generateSummaryHTML(data);
    summaryModal.style.display = 'flex';
});

// Confirm and submit
confirmSubmitBtn.addEventListener('click', async () => {
    summaryModal.style.display = 'none';
    
    showToast('🎉 Creating your celebration plan...');
    
    try {
        await generatePDF(formData);
        sendEmail(formData);
        
        // Set client name in success modal
        if (successClientNameSpan) {
            successClientNameSpan.textContent = formData.clientName.split('&')[0].trim();
        }
        
        successModal.style.display = 'flex';
        
        // Reset form
        weddingForm.reset();
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
        
        // Reset date min
        const eventDateInput = document.getElementById('eventDate');
        const today = new Date().toISOString().split('T')[0];
        eventDateInput.min = today;
        
    } catch (error) {
        console.error('Error:', error);
        showToast('Something unexpected happened. Please try again or contact us directly. 💖', true);
    }
});

// Edit form button
editFormBtn.addEventListener('click', () => {
    summaryModal.style.display = 'none';
});

// Close buttons
closeSummaryBtn.addEventListener('click', () => {
    summaryModal.style.display = 'none';
});

closeSuccessBtn.addEventListener('click', () => {
    successModal.style.display = 'none';
});

// Close modals on outside click
window.addEventListener('click', (e) => {
    if (e.target === summaryModal) {
        summaryModal.style.display = 'none';
    }
    if (e.target === successModal) {
        successModal.style.display = 'none';
    }
});

// Set minimum date to today for event date
const eventDateInput = document.getElementById('eventDate');
if (eventDateInput) {
    const today = new Date().toISOString().split('T')[0];
    eventDateInput.min = today;
}

// Progress tracking - scroll to section functionality
progressSteps.forEach(step => {
    step.addEventListener('click', () => {
        const stepNum = parseInt(step.dataset.step);
        let targetSection = null;
        
        for (let section of formSections) {
            const sectionStep = parseInt(section.dataset.section);
            if (sectionStep === stepNum) {
                targetSection = section;
                break;
            }
        }
        
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Auto-save to localStorage (friendly feature)
function autoSave() {
    const formElements = weddingForm.querySelectorAll('input, select, textarea');
    const saveData = {};
    formElements.forEach(el => {
        if (el.id) {
            if (el.type === 'checkbox') {
                saveData[el.id] = el.checked;
            } else {
                saveData[el.id] = el.value;
            }
        }
    });
    localStorage.setItem('ohYesWeddingDraft', JSON.stringify(saveData));
}

// Auto-load draft
function loadDraft() {
    const saved = localStorage.getItem('ohYesWeddingDraft');
    if (saved) {
        const saveData = JSON.parse(saved);
        for (let [id, value] of Object.entries(saveData)) {
            const el = document.getElementById(id);
            if (el) {
                if (el.type === 'checkbox') {
                    el.checked = value;
                } else {
                    el.value = value;
                }
            }
        }
        showToast('💾 We found a saved draft — continuing where you left off!');
    }
}

// Save on input
weddingForm.addEventListener('input', () => {
    autoSave();
});

// Load draft on page load
loadDraft();

// Limit priority selections to 5 (friendly reminder)
const priorityCheckboxes = document.querySelectorAll('.priority-item');
priorityCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
        const checked = document.querySelectorAll('.priority-item:checked');
        if (checked.length > 5) {
            cb.checked = false;
            showToast('💡 You can select up to 5 priority areas — just pick what matters most!', false);
        }
    });
});

console.log('✨ Oh Yes Events — Wedding planning system ready! ✨');
