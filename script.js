// script.js

// ============================================================
// WEDDING CHECKLIST DATA - Based on PDF Requirements
// Categories: Stationary & Wedding Collaterals, Hotels & Management,
// Transportation, Hampers & Gift Materials, Artists & Giveaways,
// Vendors & Agency Package, Other Requirements, Add-ons, Event Day Crew
// ============================================================

const checklistCategories = [
    {
        name: "📮 Stationary & Wedding Collaterals",
        icon: "fas fa-envelope-open-text",
        items: [
            "Wedding Invitation Cards",
            "Save the Date Cards",
            "RSVP Cards",
            "Thank You Cards",
            "Menu Cards",
            "Place Cards / Table Numbers",
            "Welcome Signs",
            "Program Brochures",
            "Seating Chart Display",
            "Wedding Favors Tags"
        ]
    },
    {
        name: "🏨 Hotels and Management",
        icon: "fas fa-hotel",
        items: [
            "Guest Room Block Booking",
            "Welcome Drinks at Hotel",
            "Check-in / Check-out Coordination",
            "VIP Guest Accommodation",
            "Bridal Suite Preparation",
            "Groom's Room Arrangement",
            "Hotel Staff Briefing",
            "Late Check-out Requests",
            "Luggage Handling Service",
            "Hotel Concierge Coordination"
        ]
    },
    {
        name: "🚗 Transportation",
        icon: "fas fa-car-side",
        items: [
            "Guest Airport Transfers",
            "Bridal Car / Vintage Car",
            "Groom's Arrival Vehicle",
            "Family & Relative Shuttles",
            "Artist & Vendor Transport",
            "Return Transfers for Guests",
            "Valet Parking Service",
            "Backup Vehicles",
            "Driver Briefing & Routes",
            "Tempo / Bus for Local Guests"
        ]
    },
    {
        name: "🎁 Hampers & Gift Materials",
        icon: "fas fa-gift",
        items: [
            "Welcome Hampers for Guests",
            "Bridal Party Gift Boxes",
            "Groom's Squad Kits",
            "Return Gifts for Attendees",
            "Eco-friendly Favors",
            "Personalized Mementos",
            "Gift Wrapping Station",
            "Hampers for VIPs / Parents",
            "Kids Activity Gift Bags",
            "Donation / Charity Gifts"
        ]
    },
    {
        name: "🎨 Artists | Giveaways | Activities",
        icon: "fas fa-microphone-alt",
        items: [
            "Live Band / DJ Booking",
            "Mehendi Artist",
            "Photographer & Videographer",
            "Makeup Artist (Bridal/Groom)",
            "Choreographer for Sangeet",
            "Magician / Entertainer",
            "Photo Booth with Props",
            "Games & Activities for Guests",
            "Fireworks / Laser Show",
            "Giveaways & Contest Prizes"
        ]
    },
    {
        name: "🤝 Vendors and Agency Package",
        icon: "fas fa-handshake",
        items: [
            "Decor & Florist Agency",
            "Catering & F&B Vendor",
            "Sound & Lighting Agency",
            "Tent & Furniture Rental",
            "Security Service Provider",
            "Cleanup & Waste Management",
            "Portable Restroom Rental",
            "Power Backup Vendor",
            "Event Insurance Package",
            "Backup Vendor Coordination"
        ]
    },
    {
        name: "📋 Other Requirements",
        icon: "fas fa-clipboard-list",
        items: [
            "Emergency Medical Kit",
            "Restroom Amenities Kit",
            "Baby Changing Station",
            "Lost & Found Desk",
            "Prayer / Quiet Room",
            "Smoking Zone Arrangement",
            "Parking Management",
            "Guest Registration Desk",
            "Wi-Fi & Charging Stations",
            "Weather Backup Plan"
        ]
    },
    {
        name: "➕ Add-ons",
        icon: "fas fa-plus-circle",
        items: [
            "Live Food Counter (Chaats/Desserts)",
            "Cigar / Hookah Lounge",
            "After Party Arrangement",
            "Drone Photography",
            "360° Video Booth",
            "Celebrity Appearance",
            "Fire Dancers / Performers",
            "Live Painting Artist",
            "Cocktail Robot / Bar",
            "Midnight Snack Counter"
        ]
    },
    {
        name: "👥 Event Day Crew",
        icon: "fas fa-users",
        items: [
            "Show Running - Senior Associate",
            "Logistics - Senior Associate + Runner",
            "Control Room - Senior Associate + Runner",
            "Hospitality - Senior Associate + Runner",
            "Supervisor - Senior Associate + Runner",
            "F&B Connoisseur - Runner",
            "Artist Manager - Senior Associate",
            "Vendor Manager - Senior Associate",
            "Shadowing (Male / Female / Runners)",
            "Production Manager - Senior Associate + Runner"
        ]
    }
];

// Store checked state
let checkedItems = new Map();

// Helper: generate unique key for each item
function getItemKey(categoryName, itemText) {
    return `${categoryName}::${itemText}`;
}

// Load from localStorage
function loadSavedState() {
    const saved = localStorage.getItem("ohYesWeddingChecklist");
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            for (let [key, val] of Object.entries(parsed)) {
                checkedItems.set(key, val);
            }
        } catch(e) {
            console.warn(e);
        }
    }
}

// Save to localStorage
function saveStateToLocal() {
    const obj = Object.fromEntries(checkedItems);
    localStorage.setItem("ohYesWeddingChecklist", JSON.stringify(obj));
}

// Render full checklist UI
function renderChecklist() {
    const container = document.getElementById("checklistContainer");
    if (!container) return;
    container.innerHTML = "";
    
    for (let cat of checklistCategories) {
        const catDiv = document.createElement("div");
        catDiv.className = "category-card";
        
        const titleDiv = document.createElement("div");
        titleDiv.className = "category-title";
        titleDiv.innerHTML = `<i class="${cat.icon}"></i> ${cat.name}`;
        catDiv.appendChild(titleDiv);
        
        const itemsDiv = document.createElement("div");
        itemsDiv.className = "items-list";
        
        for (let item of cat.items) {
            const key = getItemKey(cat.name, item);
            const isChecked = checkedItems.get(key) || false;
            
            const itemRow = document.createElement("div");
            itemRow.className = "checklist-item";
            itemRow.setAttribute("data-key", key);
            
            const cb = document.createElement("input");
            cb.type = "checkbox";
            cb.checked = isChecked;
            cb.addEventListener("change", (e) => {
                e.stopPropagation();
                checkedItems.set(key, cb.checked);
                saveStateToLocal();
                updateSummaryAndStats();
                showTemporaryToast(cb.checked ? "✓ Task completed" : "✗ Task unchecked");
            });
            
            const labelSpan = document.createElement("span");
            labelSpan.className = "item-text";
            labelSpan.innerText = item;
            
            itemRow.appendChild(cb);
            itemRow.appendChild(labelSpan);
            
            // Click on row toggles checkbox
            itemRow.addEventListener("click", (e) => {
                if (e.target !== cb) {
                    cb.checked = !cb.checked;
                    const changeEvent = new Event('change', { bubbles: true });
                    cb.dispatchEvent(changeEvent);
                }
            });
            
            itemsDiv.appendChild(itemRow);
        }
        
        catDiv.appendChild(itemsDiv);
        container.appendChild(catDiv);
    }
    
    updateTotalItemsCount();
    updateSummaryAndStats();
}

// Update total items count in UI
function updateTotalItemsCount() {
    let total = 0;
    for (let cat of checklistCategories) {
        total += cat.items.length;
    }
    const totalSpan = document.getElementById("totalItemsCount");
    if (totalSpan) totalSpan.innerText = total;
}

// Update summary panel and statistics
function updateSummaryAndStats() {
    const summaryContainer = document.getElementById("selectedSummaryList");
    const totalCheckedSpan = document.getElementById("totalChecked");
    const badgeSpan = document.getElementById("selectedCountBadge");
    
    let selectedList = [];
    for (let cat of checklistCategories) {
        for (let item of cat.items) {
            const key = getItemKey(cat.name, item);
            if (checkedItems.get(key) === true) {
                selectedList.push({ category: cat.name, item: item });
            }
        }
    }
    
    const totalChecked = selectedList.length;
    if (totalCheckedSpan) totalCheckedSpan.innerText = totalChecked;
    if (badgeSpan) badgeSpan.innerText = `${totalChecked} selected`;
    
    if (summaryContainer) {
        if (selectedList.length === 0) {
            summaryContainer.innerHTML = `<p class="placeholder-msg">✨ No items checked yet. Tick tasks to build your custom list.</p>`;
        } else {
            summaryContainer.innerHTML = selectedList.map(sel => `
                <div class="summary-item">
                    <span><i class="fas fa-check-circle" style="color:#e6a157; font-size:0.7rem;"></i> ${sel.item}</span>
                    <span style="font-size:0.7rem; color:#b47c48;">${sel.category.substring(0, 30)}${sel.category.length > 30 ? '...' : ''}</span>
                </div>
            `).join('');
        }
    }
}

// Reset all selections
function resetAllSelections() {
    checkedItems.clear();
    saveStateToLocal();
    renderChecklist();
    updateSummaryAndStats();
    showTemporaryToast("All selections have been cleared 🧹");
}

// Toast notification
let toastTimeout = null;
function showTemporaryToast(msg) {
    let existingToast = document.querySelector(".toast-message");
    if(existingToast) existingToast.remove();
    const toast = document.createElement("div");
    toast.className = "toast-message";
    toast.innerText = msg;
    document.body.appendChild(toast);
    if(toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        if(toast) toast.remove();
    }, 2000);
}

// ============================================================
// EMAIL SUBMISSION via EmailJS
// ============================================================
// IMPORTANT: To enable automatic email sending, you need to:
// 1. Sign up at https://www.emailjs.com/
// 2. Create an email service (Gmail, Outlook, etc.)
// 3. Create an email template
// 4. Replace the keys below with your actual credentials
// ============================================================

const EMAILJS_PUBLIC_KEY = "YOUR_EMAILJS_PUBLIC_KEY";  // Replace with your EmailJS public key
const EMAILJS_SERVICE_ID = "service_ohyes";            // Replace with your service ID
const EMAILJS_TEMPLATE_ID = "template_wedding";        // Replace with your template ID

let emailJsReady = false;
if (EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY !== "YOUR_EMAILJS_PUBLIC_KEY") {
    emailjs.init(EMAILJS_PUBLIC_KEY);
    emailJsReady = true;
}

// Get selected checklist items as formatted text
function getSelectedChecklistText() {
    let selected = [];
    for (let cat of checklistCategories) {
        for (let item of cat.items) {
            const key = getItemKey(cat.name, item);
            if (checkedItems.get(key)) {
                selected.push(`• ${item} (${cat.name})`);
            }
        }
    }
    if (selected.length === 0) return "No tasks selected.";
    return selected.join("\n");
}

// Get selected items grouped by category for better email formatting
function getSelectedChecklistGrouped() {
    let grouped = {};
    for (let cat of checklistCategories) {
        let catItems = [];
        for (let item of cat.items) {
            const key = getItemKey(cat.name, item);
            if (checkedItems.get(key)) {
                catItems.push(item);
            }
        }
        if (catItems.length > 0) {
            grouped[cat.name] = catItems;
        }
    }
    return grouped;
}

// Send checklist via email
function sendChecklistViaEmail() {
    const totalSelected = Array.from(checkedItems.values()).filter(v => v === true).length;
    if (totalSelected === 0) {
        showTemporaryToast("Please select at least one checklist item before submitting.");
        return;
    }
    
    const selectedGrouped = getSelectedChecklistGrouped();
    let formattedMessage = "✨ WEDDING CHECKLIST SUBMISSION ✨\n\n";
    formattedMessage += `Date: ${new Date().toLocaleString()}\n`;
    formattedMessage += `Total Tasks Selected: ${totalSelected}\n`;
    formattedMessage += "=".repeat(50) + "\n\n";
    
    for (let [category, items] of Object.entries(selectedGrouped)) {
        formattedMessage += `📌 ${category}\n`;
        items.forEach(item => {
            formattedMessage += `   ✓ ${item}\n`;
        });
        formattedMessage += "\n";
    }
    
    formattedMessage += "=".repeat(50) + "\n";
    formattedMessage += "Let's create magic! - Oh Yes Events";
    
    const subject = `Wedding Checklist Submission - ${totalSelected} Tasks Selected`;
    
    // Try EmailJS if configured
    if (emailJsReady) {
        const templateParams = {
            to_email: "kisneylogesh78823@gmail.com",
            from_name: "Oh Yes Events Client",
            message: formattedMessage,
            subject: subject,
            checklist_summary: getSelectedChecklistText()
        };
        
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
            .then(() => {
                showTemporaryToast("✅ Checklist sent to planner! Magic incoming ✨");
            })
            .catch((err) => {
                console.error("EmailJS error:", err);
                showTemporaryToast("⚠️ EmailJS not configured. Using email client fallback.");
                fallbackSendMail(formattedMessage, subject);
            });
    } else {
        showTemporaryToast("📧 Opening email client to send your checklist...");
        fallbackSendMail(formattedMessage, subject);
    }
}

// Fallback: open default email client
function fallbackSendMail(body, subject) {
    const mailtoLink = `mailto:kisneylogesh78823@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
}

// ============================================================
// PDF DOWNLOAD FUNCTION
// ============================================================
function downloadChecklistPDF() {
    const selectedList = [];
    for (let cat of checklistCategories) {
        for (let item of cat.items) {
            const key = getItemKey(cat.name, item);
            if (checkedItems.get(key)) {
                selectedList.push({ category: cat.name, item: item });
            }
        }
    }
    
    if (selectedList.length === 0) {
        showTemporaryToast("No items selected. Please tick some tasks before downloading PDF.");
        return;
    }
    
    // Group by category for PDF
    const groupedByCat = {};
    for (let sel of selectedList) {
        if (!groupedByCat[sel.category]) {
            groupedByCat[sel.category] = [];
        }
        groupedByCat[sel.category].push(sel.item);
    }
    
    // Build printable HTML
    const printDiv = document.createElement('div');
    printDiv.style.padding = '2rem';
    printDiv.style.fontFamily = "'Inter', 'Playfair Display', Georgia, serif";
    printDiv.style.backgroundColor = '#fffaf2';
    printDiv.style.color = '#2d2a24';
    printDiv.style.maxWidth = '900px';
    printDiv.style.margin = '0 auto';
    
    let itemsHTML = '';
    for (let [category, items] of Object.entries(groupedByCat)) {
        itemsHTML += `
            <div style="margin-bottom: 1.5rem;">
                <h3 style="color: #b45f2b; border-left: 4px solid #e6a157; padding-left: 12px; margin-bottom: 10px;">${category}</h3>
                <div style="padding-left: 16px;">
                    ${items.map(item => `<div style="display: flex; align-items: center; gap: 10px; padding: 6px 0;"><span style="color: #e6a157;">✓</span> <span>${item}</span></div>`).join('')}
                </div>
            </div>
        `;
    }
    
    printDiv.innerHTML = `
        <div style="text-align: center; margin-bottom: 2rem;">
            <div style="font-size: 0.85rem; color: #b45f2b; letter-spacing: 2px;">OH YES EVENTS</div>
            <h1 style="font-family: 'Playfair Display', serif; color: #3e2c1f; margin: 0.5rem 0;">Wedding Checklist</h1>
            <div style="width: 60px; height: 2px; background: #e6a157; margin: 1rem auto;"></div>
            <p style="color: #7f694f;">Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        <div style="margin-top: 1rem;">
            ${itemsHTML}
        </div>
        <div style="margin-top: 2.5rem; text-align: center; font-size: 0.8rem; color: #8c623b; border-top: 1px solid #ffdec2; padding-top: 1rem;">
            <i class="fas fa-star-of-life"></i> Let's create magic — Schedule a consultation: kisneylogesh78823@gmail.com
        </div>
    `;
    
    document.body.appendChild(printDiv);
    
    const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `OhYes_Wedding_Checklist_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, letterRendering: true, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(printDiv).save().then(() => {
        document.body.removeChild(printDiv);
        showTemporaryToast("PDF Checklist downloaded! 🎉");
    }).catch(err => {
        document.body.removeChild(printDiv);
        console.error("PDF Error:", err);
        showTemporaryToast("Error generating PDF. Please try again.");
    });
}

// ============================================================
// EVENT LISTENERS & INITIALIZATION
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
    loadSavedState();
    renderChecklist();
    
    const submitBtn = document.getElementById("submitEmailBtn");
    const downloadBtn = document.getElementById("downloadPdfBtn");
    const resetBtn = document.getElementById("resetAllBtn");
    
    if (submitBtn) submitBtn.addEventListener("click", sendChecklistViaEmail);
    if (downloadBtn) downloadBtn.addEventListener("click", downloadChecklistPDF);
    if (resetBtn) resetBtn.addEventListener("click", resetAllSelections);
    
    // Show EmailJS setup reminder if not configured
    if (!emailJsReady) {
        console.log("EmailJS not configured. Using mailto fallback. To enable auto-send, sign up at emailjs.com and update credentials in script.js");
    }
});