# Oh Yes Events - Wedding Checklist

A beautiful, interactive wedding checklist web application for planning weddings with task selection, email submission, and PDF download features.

## Files

- `index.html` - Main HTML structure
- `style.css` - Styling and animations
- `script.js` - JavaScript functionality

## How to Use

1. Save all three files in the same folder
2. Open `index.html` in a web browser
3. Click checklist items to select tasks
4. Click "Submit & Send to Planner" to email your selections
5. Click "Download PDF Checklist" to save as PDF
6. Click "Reset All" to clear all selections

## Email Setup (Optional)

To enable automatic email sending:

1. Create free account at https://www.emailjs.com
2. Get your Public Key from Account → API Keys
3. Get your Service ID from Email Services tab
4. Get your Template ID from Email Templates tab
5. Update these lines in `script.js`:

```javascript
const EMAILJS_PUBLIC_KEY = "your_public_key_here";
const EMAILJS_SERVICE_ID = "your_service_id_here";
const EMAILJS_TEMPLATE_ID = "your_template_id_here";
