// script.js
// Oh Yes Events - Professional Wedding Requirement System

let formData = {};

// DOM Elements
const form = document.getElementById('weddingForm');
const reviewModal = document.getElementById('reviewModal');
const successModal = document.getElementById('successModal');
const reviewContent = document.getElementById('reviewContent');
const closeModalBtn = document.querySelector('.close-modal');
const editButton = document.getElementById('editButton');
const confirmButton = document.getElementById('confirmButton');
const closeSuccessButton = document.getElementById('closeSuccessButton');

// Helper Functions
function getSelectedServices() {
    const checkboxes = document.querySelectorAll('.service-item:checked');
    return Array.from(checkboxes).map(cb => cb.value);
}

function getFileNames() {
    const fileInput = document.getElementById('referenceImages');
    if (fileInput.files.length > 0) {
        return Array.from(fileInput.files).map(f => f.name).join(', ');
    }
    return 'No files uploaded';
}

function formatCurrency(value) {
    if (!value) return 'Not specified';
    return '₹' + parseInt(value).toLocaleString('en-IN');
}

function formatDate(dateString) {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

function collectFormData() {
    return {
        clientName: document.getElementById('clientName')?.value.trim() || '',
        contactNumber: document.getElementById('contactNumber')?.value.trim() || '',
        email: document.getElementById('email')?.value.trim() || '',
        contactMethod: document.getElementById('contactMethod')?.value || '',
        referredBy: document.getElementById('referredBy')?.value || '',
        heardFrom: document.getElementById('heardFrom')?.value || '',
        eventType: document.getElementById('eventType')?.value || '',
        eventDate: document.getElementById('eventDate')?.value || '',
        venue: document.getElementById('venue')?.value.trim() || '',
        venueStatus: document.getElementById('venueStatus')?.value || '',
        guestCount: document.getElementById('guestCount')?.value || '',
        functionDays: document.getElementById('functionDays')?.value || '',
        budgetMin: document.getElementById('budgetMin')?.value || '',
        budgetMax: document.getElementById('budgetMax')?.value || '',
        vision: document.getElementById('vision')?.value || '',
        colorPalette: document.getElementById('colorPalette')?.value || '',
        weddingStyle: document.getElementById('weddingStyle')?.value || '',
        nonNegotiables: document.getElementById('nonNegotiables')?.value || '',
        restrictions: document.getElementById('restrictions')?.value || '',
        referenceLinks: document.getElementById('referenceLinks')?.value || '',
        selectedServices: getSelectedServices(),
        fileNames: getFileNames(),
        shareWithVendors: document.getElementById('shareWithVendors')?.checked || false
    };
}

function validateForm(data) {
    if (!data.clientName) return 'Please enter client name';
    if (!data.contactNumber) return 'Please enter phone number';
    if (!data.email) return 'Please enter email address';
    if (!data.eventType) return 'Please select event type';
    if (!data.eventDate) return 'Please select event date';
    if (!data.venue) return 'Please enter venue name/location';
    if (!data.guestCount) return 'Please enter guest count';
    if (!data.vision) return 'Please describe your wedding vision';
    if (!data.nonNegotiables) return 'Please share your non-negotiables';
    
    const confirmationCheckbox = document.getElementById('confirmationCheckbox');
    if (!confirmationCheckbox?.checked) return 'Please confirm that the information is accurate';
    
    return null;
}

function generateReviewHTML(data) {
    const hasServices = data.selectedServices.length > 0;
    
    return `
        <div class="review-section">
            <h4>Client Information</h4>
            <p><strong>Name:</strong> ${escapeHtml(data.clientName)}</p>
            <p><strong>Phone:</strong> ${escapeHtml(data.contactNumber)}</p>
            <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
            <p><strong>Preferred Contact:</strong> ${data.contactMethod || 'Not specified'}</p>
            <p><strong>Referred By:</strong> ${data.referredBy || 'Not specified'}</p>
        </div>
        
        <div class="review-section">
            <h4>Event Overview</h4>
            <p><strong>Event Type:</strong> ${data.eventType}</p>
            <p><strong>Event Date:</strong> ${formatDate(data.eventDate)}</p>
            <p><strong>Venue:</strong> ${escapeHtml(data.venue)}</p>
            <p><strong>Venue Status:</strong> ${data.venueStatus || 'Not specified'}</p>
            <p><strong>Guest Count:</strong> ${data.guestCount}</p>
            <p><strong>Number of Functions:</strong> ${data.functionDays || 'Not specified'}</p>
            <p><strong>Budget Range:</strong> ${data.budgetMin || data.budgetMax ? `${formatCurrency(data.budgetMin)} - ${formatCurrency(data.budgetMax)}` : 'To be discussed'}</p>
        </div>
        
        <div class="review-section">
            <h4>Vision & Priorities</h4>
            <p><strong>Wedding Vision:</strong> ${escapeHtml(data.vision)}</p>
            <p><strong>Theme/Colors:</strong> ${data.colorPalette || 'Not specified'}</p>
            <p><strong>Wedding Style:</strong> ${data.weddingStyle || 'Not specified'}</p>
            <p><strong>Non-Negotiables:</strong> ${escapeHtml(data.nonNegotiables)}</p>
            ${data.restrictions ? `<p><strong>Restrictions:</strong> ${escapeHtml(data.restrictions)}</p>` : ''}
        </div>
        
        <div class="review-section">
            <h4>Services Required (${data.selectedServices.length} items)</h4>
            ${hasServices ? `<p>${data.selectedServices.map(s => `<span class="review-tag">${escapeHtml(s)}</span>`).join('')}</p>` : '<p>No services selected yet</p>'}
        </div>
        
        <div class="review-section">
            <h4>Additional Information</h4>
            ${data.referenceLinks ? `<p><strong>Inspiration Links:</strong> ${escapeHtml(data.referenceLinks)}</p>` : ''}
            <p><strong>Uploaded Files:</strong> ${data.fileNames}</p>
            <p><strong>Share with vendors:</strong> ${data.shareWithVendors ? 'Yes' : 'No'}</p>
        </div>
    `;
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

async function generatePDF(data) {
    const pdfContainer = document.createElement('div');
    pdfContainer.style.position = 'absolute';
    pdfContainer.style.left = '-9999px';
    pdfContainer.style.top = '-9999px';
    pdfContainer.style.width = '800px';
    pdfContainer.style.backgroundColor = 'white';
    pdfContainer.style.padding = '40px';
    pdfContainer.style.fontFamily = "'Inter', Arial, sans-serif";
    pdfContainer.style.color = '#1a1a1a';
    
    const currentDate = new Date().toLocaleString('en-IN');
    const hasServices = data.selectedServices.length > 0;
    
    pdfContainer.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #c46b3f; padding-bottom: 20px;">
            <div style="font-size: 28px; font-weight: 700; color: #c46b3f;">Oh Yes Events</div>
            <div style="font-size: 18px; color: #4a4a4a; margin-top: 8px;">Wedding Requirement Checklist</div>
            <div style="font-size: 11px; color: #8a7a6e; margin-top: 12px;">Generated on ${currentDate}</div>
        </div>
        
        <div style="margin-bottom: 24px;">
            <h2 style="color: #c46b3f; font-size: 16px; border-left: 3px solid #c46b3f; padding-left: 12px; margin-bottom: 16px;">Client Information</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 6px 0; width: 35%;"><strong>Name:</strong></td><td>${escapeHtml(data.clientName)}</td></tr>
                <tr><td style="padding: 6px 0;"><strong>Phone:</strong></td><td>${escapeHtml(data.contactNumber)}</td></tr>
                <tr><td style="padding: 6px 0;"><strong>Email:</strong></td><td>${escapeHtml(data.email)}</td></tr>
                <tr><td style="padding: 6px 0;"><strong>Referred By:</strong></td><td>${data.referredBy || 'Not specified'}</td></tr>
            </table>
        </div>
        
        <div style="margin-bottom: 24px;">
            <h2 style="color: #c46b3f; font-size: 16px; border-left: 3px solid #c46b3f; padding-left: 12px; margin-bottom: 16px;">Event Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 6px 0; width: 35%;"><strong>Event Type:</strong></td><td>${data.eventType}</td></tr>
                <tr><td style="padding: 6px 0;"><strong>Event Date:</strong></td><td>${formatDate(data.eventDate)}</td></tr>
                <tr><td style="padding: 6px 0;"><strong>Venue:</strong></td><td>${escapeHtml(data.venue)}</td></tr>
                <tr><td style="padding: 6px 0;"><strong>Guest Count:</strong></td><td>${data.guestCount}</td></tr>
                <tr><td style="padding: 6px 0;"><strong>Functions:</strong></td><td>${data.functionDays || 'Not specified'}</td></tr>
                <tr><td style="padding: 6px 0;"><strong>Budget:</strong></td><td>${data.budgetMin || data.budgetMax ? `${formatCurrency(data.budgetMin)} - ${formatCurrency(data.budgetMax)}` : 'To be discussed'}</td></tr>
            </table>
        </div>
        
        <div style="margin-bottom: 24px;">
            <h2 style="color: #c46b3f; font-size: 16px; border-left: 3px solid #c46b3f; padding-left: 12px; margin-bottom: 16px;">Wedding Vision</h2>
            <p><strong>Vision:</strong> ${escapeHtml(data.vision)}</p>
            ${data.colorPalette ? `<p><strong>Theme/Colors:</strong> ${escapeHtml(data.colorPalette)}</p>` : ''}
            ${data.weddingStyle ? `<p><strong>Style:</strong> ${data.weddingStyle}</p>` : ''}
            <p><strong>Non-Negotiables:</strong> ${escapeHtml(data.nonNegotiables)}</p>
            ${data.restrictions ? `<p><strong>Restrictions:</strong> ${escapeHtml(data.restrictions)}</p>` : ''}
        </div>
        
        <div style="margin-bottom: 24px;">
            <h2 style="color: #c46b3f; font-size: 16px; border-left: 3px solid #c46b3f; padding-left: 12px; margin-bottom: 16px;">Services Required</h2>
            ${hasServices ? `<p>${data.selectedServices.join(', ')}</p>` : '<p>No specific services selected - consultation recommended</p>'}
        </div>
        
        <div style="margin-bottom: 24px;">
            <h2 style="color: #c46b3f; font-size: 16px; border-left: 3px solid #c46b3f; padding-left: 12px; margin-bottom: 16px;">Additional Notes</h2>
            ${data.referenceLinks ? `<p><strong>Inspiration Links:</strong> ${escapeHtml(data.referenceLinks)}</p>` : ''}
            <p><strong>Uploaded Files:</strong> ${data.fileNames}</p>
        </div>
        
        <div style="margin-top: 30px; text-align: center; font-size: 10px; color: #8a7a6e; border-top: 1px solid #e8e0d8; padding-top: 20px;">
            This document was generated from the Oh Yes Events Wedding Requirement System.<br>
            Our team will contact the client within 24 hours to schedule a consultation.
        </div>
    `;
    
    document.body.appendChild(pdfContainer);
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `OhYes_Events_${data.clientName.replace(/\s/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    
    try {
        await html2pdf().set(opt).from(pdfContainer).save();
        return true;
    } catch (error) {
        console.error('PDF Error:', error);
        return false;
    } finally {
        document.body.removeChild(pdfContainer);
    }
}

function sendEmail(data) {
    const subject = `New Wedding Requirement: ${data.clientName} - ${formatDate(data.eventDate)}`;
    const body = `NEW WEDDING REQUIREMENT SUBMISSION
==========================================

CLIENT INFORMATION:
-------------------
Name: ${data.clientName}
Phone: ${data.contactNumber}
Email: ${data.email}
Preferred Contact: ${data.contactMethod || 'Not specified'}
Referred By: ${data.referredBy || 'Not specified'}
Heard From: ${data.heardFrom || 'Not specified'}

EVENT DETAILS:
--------------
Event Type: ${data.eventType}
Event Date: ${formatDate(data.eventDate)}
Venue: ${data.venue}
Venue Status: ${data.venueStatus || 'Not specified'}
Guest Count: ${data.guestCount}
Number of Functions: ${data.functionDays || 'Not specified'}
Budget Range: ${data.budgetMin || data.budgetMax ? `${formatCurrency(data.budgetMin)} - ${formatCurrency(data.budgetMax)}` : 'To be discussed'}

WEDDING VISION & PRIORITIES:
---------------------------
Vision: ${data.vision}
Theme/Colors: ${data.colorPalette || 'Not specified'}
Wedding Style: ${data.weddingStyle || 'Not specified'}
NON-NEGOTIABLES: ${data.nonNegotiable
