// const NOTIFICATION_API = "http://localhost:8080/api";


// // ==========================================
// // START
// // ==========================================

// document.addEventListener("DOMContentLoaded", () => {

//     setupNotificationButton();

//     loadNotifications();

// });


// // ==========================================
// // GET CURRENT PAGE
// // ==========================================

// function getPageName() {

//     const file =
//         window.location.pathname
//             .split("/")
//             .pop()
//             .toLowerCase();


//     if (file === "materials.html") {
//         return "materials";
//     }

//     if (file === "stock.html") {
//         return "stock";
//     }

//     if (file === "suppliers.html") {
//         return "suppliers";
//     }

//     if (file === "bom.html") {
//         return "bom";
//     }

//     return "dashboard";
// }


// // ==========================================
// // SETUP BELL
// // ==========================================

// function setupNotificationButton() {

//     const button =
//         document.getElementById(
//             "notificationButton"
//         );


//     if (!button) {

//         console.error(
//             "Notification button not found."
//         );

//         return;
//     }


//     console.log(
//         "RawStock notification button connected."
//     );


//     // Create popup

//     const popup =
//         document.createElement("div");

//     popup.id =
//         "rawstockNotificationPopup";

//     popup.className =
//         "rs-notification-panel";


//     popup.innerHTML = `

//         <div class="rs-notification-header">

//             <div>

//                 <strong>
//                     Notifications
//                 </strong>

//                 <small>
//                     RawStock alerts
//                 </small>

//             </div>

//             <span
//                 id="rsNotificationCount"
//                 class="rs-notification-count">
//                 0
//             </span>

//         </div>


//         <div
//             id="rsNotificationList"
//             class="rs-notification-list">

//             <div class="rs-notification-empty">

//                 Loading...

//             </div>

//         </div>

//     `;


//     // Put popup into topbar

//     const topbarRight =
//         button.parentElement;


//     topbarRight.style.position =
//         "relative";


//     topbarRight.appendChild(
//         popup
//     );


//     // ======================================
//     // CLICK
//     // ======================================

//     button.addEventListener(
//         "click",
//         function(event) {

//             event.preventDefault();

//             event.stopPropagation();


//             popup.classList.toggle(
//                 "show"
//             );

//         }
//     );


//     // ======================================
//     // OUTSIDE CLICK
//     // ======================================

//     document.addEventListener(
//         "click",
//         function(event) {

//             if (
//                 !topbarRight.contains(
//                     event.target
//                 )
//             ) {

//                 popup.classList.remove(
//                     "show"
//                 );

//             }

//         }
//     );

// }


// // ==========================================
// // LOAD NOTIFICATIONS
// // ==========================================

// async function loadNotifications() {

//     const page =
//         getPageName();


//     let notifications = [];


//     try {

//         if (page === "materials") {

//             notifications =
//                 await materialNotifications();

//         }

//         else if (page === "stock") {

//             notifications =
//                 await stockNotifications();

//         }

//         else if (page === "suppliers") {

//             notifications =
//                 await supplierNotifications();

//         }

//         else if (page === "bom") {

//             notifications =
//                 await bomNotifications();

//         }

//         else {

//             notifications =
//                 await materialNotifications();

//         }


//         renderNotifications(
//             notifications
//         );


//     } catch (error) {

//         console.error(
//             "Notification error:",
//             error
//         );


//         renderNotifications([
//             {
//                 type: "danger",
//                 title: "Connection Error",
//                 message:
//                     "Unable to load notifications."
//             }
//         ]);

//     }

// }


// // ==========================================
// // MATERIALS
// // ==========================================

// async function materialNotifications() {

//     const response =
//         await fetch(
//             `${NOTIFICATION_API}/materials`
//         );


//     const materials =
//         await response.json();


//     const result = [];


//     materials.forEach(material => {

//         const quantity =
//             Number(material.quantity || 0);

//         const minimum =
//             Number(
//                 material.minimumStock || 0
//             );


//         if (quantity <= 0) {

//             result.push({

//                 type: "danger",

//                 title: "Out of Stock",

//                 message:
//                     `${material.materialName} is out of stock.`

//             });

//         }

//         else if (quantity <= minimum) {

//             result.push({

//                 type: "warning",

//                 title: "Restock Required",

//                 message:
//                     `${material.materialName}: ${quantity} ${material.unit} remaining. Minimum: ${minimum}.`

//             });

//         }

//     });


//     if (result.length === 0) {

//         result.push({

//             type: "success",

//             title: "Stock Healthy",

//             message:
//                 "All materials are above their minimum stock level."

//         });

//     }


//     return result;
// }


// // ==========================================
// // STOCK
// // ==========================================

// async function stockNotifications() {

//     const [
//         stockResponse,
//         materialResponse
//     ] = await Promise.all([

//         fetch(`${NOTIFICATION_API}/stock`),

//         fetch(`${NOTIFICATION_API}/materials`)

//     ]);


//     const transactions =
//         await stockResponse.json();

//     const materials =
//         await materialResponse.json();


//     const result = [];


//     // Low stock

//     materials.forEach(material => {

//         const quantity =
//             Number(material.quantity || 0);

//         const minimum =
//             Number(
//                 material.minimumStock || 0
//             );


//         if (quantity <= 0) {

//             result.push({

//                 type: "danger",

//                 title: "Stock Empty",

//                 message:
//                     `${material.materialName} has 0 ${material.unit}.`

//             });

//         }

//         else if (quantity <= minimum) {

//             result.push({

//                 type: "warning",

//                 title: "Low Stock",

//                 message:
//                     `${material.materialName} is below its minimum level.`

//             });

//         }

//     });


//     // Recent transactions

//     transactions
//         .slice(-5)
//         .reverse()
//         .forEach(transaction => {

//             result.push({

//                 type:
//                     String(
//                         transaction.transactionType
//                     ).toUpperCase() === "IN"
//                         ? "success"
//                         : "info",

//                 title:
//                     String(
//                         transaction.transactionType
//                     ).toUpperCase() === "IN"
//                         ? "Stock In"
//                         : "Stock Out",

//                 message:
//                     `${transaction.quantity} units moved for Material #${transaction.materialId}.`

//             });

//         });


//     if (result.length === 0) {

//         result.push({

//             type: "success",

//             title: "Stock Normal",

//             message:
//                 "No stock alerts at the moment."

//         });

//     }


//     return result;
// }


// // ==========================================
// // SUPPLIERS
// // ==========================================

// async function supplierNotifications() {

//     const response =
//         await fetch(
//             `${NOTIFICATION_API}/suppliers`
//         );


//     const suppliers =
//         await response.json();


//     const result = [];


//     result.push({

//         type: "info",

//         title: "Supplier Directory",

//         message:
//             `${suppliers.length} supplier(s) registered in RawStock.`

//     });


//     suppliers.forEach(supplier => {

//         const missing = [];


//         if (!supplier.phone) {
//             missing.push("phone");
//         }

//         if (!supplier.email) {
//             missing.push("email");
//         }

//         if (!supplier.address) {
//             missing.push("address");
//         }


//         if (missing.length > 0) {

//             result.push({

//                 type: "warning",

//                 title: "Incomplete Supplier",

//                 message:
//                     `${supplier.supplierName || supplier.username} is missing ${missing.join(", ")}.`

//             });

//         }

//     });


//     return result;
// }


// // ==========================================
// // BOM
// // ==========================================

// async function bomNotifications() {

//     const response =
//         await fetch(
//             `${NOTIFICATION_API}/materials`
//         );


//     const materials =
//         await response.json();


//     const result = [];


//     materials.forEach(material => {

//         const quantity =
//             Number(material.quantity || 0);

//         const minimum =
//             Number(
//                 material.minimumStock || 0
//             );


//         if (quantity <= 0) {

//             result.push({

//                 type: "danger",

//                 title: "BOM Warning",

//                 message:
//                     `${material.materialName} has no stock available for production.`

//             });

//         }

//         else if (quantity <= minimum) {

//             result.push({

//                 type: "warning",

//                 title: "BOM Material Warning",

//                 message:
//                     `${material.materialName} may be insufficient for production.`

//             });

//         }

//     });


//     if (result.length === 0) {

//         result.push({

//             type: "success",

//             title: "BOM Ready",

//             message:
//                 "Current material stock is sufficient."

//         });

//     }


//     return result;
// }


// // ==========================================
// // RENDER
// // ==========================================

// function renderNotifications(
//     notifications
// ) {

//     const list =
//         document.getElementById(
//             "rsNotificationList"
//         );


//     const count =
//         document.getElementById(
//             "rsNotificationCount"
//         );


//     const dot =
//         document.getElementById(
//             "notificationDot"
//         );


//     if (!list) {

//         console.error(
//             "Notification list not found."
//         );

//         return;
//     }


//     count.textContent =
//         notifications.length;


//     // Red dot for warnings/errors

//     const hasAlert =
//         notifications.some(
//             item =>
//                 item.type === "danger" ||
//                 item.type === "warning"
//         );


//     if (dot) {

//         dot.classList.toggle(
//             "show",
//             hasAlert
//         );

//     }


//     list.innerHTML =
//         notifications
//             .map(item => `

//                 <div
//                     class="rs-notification-item">

//                     <div
//                         class="rs-notification-icon">

//                         ${getIcon(
//                             item.type
//                         )}

//                     </div>

//                     <div>

//                         <strong>
//                             ${escapeNotification(
//                                 item.title
//                             )}
//                         </strong>

//                         <span>
//                             ${escapeNotification(
//                                 item.message
//                             )}
//                         </span>

//                     </div>

//                 </div>

//             `)
//             .join("");
// }


// // ==========================================
// // ICON
// // ==========================================

// function getIcon(type) {

//     if (type === "danger") {
//         return "⚠";
//     }

//     if (type === "warning") {
//         return "!";
//     }

//     if (type === "success") {
//         return "✓";
//     }

//     return "i";
// }


// // ==========================================
// // ESCAPE
// // ==========================================

// function escapeNotification(value) {

//     return String(value ?? "")
//         .replace(/&/g, "&amp;")
//         .replace(/</g, "&lt;")
//         .replace(/>/g, "&gt;")
//         .replace(/"/g, "&quot;")
//         .replace(/'/g, "&#039;");
// }