// const API = "http://localhost:8080/api";

// let allSuppliers = [];
// let editingSupplierId = null;


// // =========================================
// // LOAD SUPPLIERS
// // =========================================

// async function loadSuppliers() {

//     const tableBody =
//         document.getElementById("supplierTableBody");

//     tableBody.innerHTML = `
//         <tr>
//             <td colspan="7" class="loading">
//                 Loading suppliers...
//             </td>
//         </tr>
//     `;

//     try {

//         const response = await fetch(`${API}/suppliers`);

//         if (!response.ok) {
//             throw new Error("Failed to load suppliers");
//         }

//         allSuppliers = await response.json();

//         updateSummary();
//         renderSuppliers();

//     } catch (error) {

//         console.error(error);

//         tableBody.innerHTML = `
//             <tr>
//                 <td colspan="7" class="loading">
//                     Unable to load suppliers.
//                     <br>
//                     Make sure Spring Boot is running.
//                 </td>
//             </tr>
//         `;
//     }
// }


// // =========================================
// // UPDATE SUMMARY
// // =========================================

// function updateSummary() {

//     const total = allSuppliers.length;

//     document.getElementById("totalSuppliers").textContent = total;

//     document.getElementById("registeredSuppliers").textContent = total;
// }


// // =========================================
// // DISPLAY SUPPLIERS
// // =========================================

// function renderSuppliers() {

//     const tableBody =
//         document.getElementById("supplierTableBody");

//     if (allSuppliers.length === 0) {

//         tableBody.innerHTML = `
//             <tr>
//                 <td colspan="7" class="loading">
//                     No suppliers found.
//                     <br>
//                     Click "Add Supplier" to create one.
//                 </td>
//             </tr>
//         `;

//         return;
//     }


//     tableBody.innerHTML = allSuppliers.map(
//         supplier => {

//             return `
//                 <tr>

//                     <td>
//                         <strong>
//                             #${supplier.supplierId}
//                         </strong>
//                     </td>

//                     <td>
//                         <strong>
//                             ${escapeHtml(supplier.username)}
//                         </strong>
//                     </td>

//                     <td>
//                         ${escapeHtml(supplier.supplierName)}
//                     </td>

//                     <td>
//                         ${escapeHtml(supplier.phone)}
//                     </td>

//                     <td>
//                         ${escapeHtml(supplier.email)}
//                     </td>

//                     <td>
//                         ${escapeHtml(supplier.address)}
//                     </td>

//                     <td>

//                         <div class="action-buttons">

//                             <button
//                                 class="edit-btn"
//                                 onclick="editSupplier(${supplier.supplierId})">

//                                 Edit

//                             </button>

//                             <button
//                                 class="delete-btn"
//                                 onclick="deleteSupplier(${supplier.supplierId})">

//                                 Delete

//                             </button>

//                         </div>

//                     </td>

//                 </tr>
//             `;
//         }
//     ).join("");
// }


// // =========================================
// // OPEN ADD MODAL
// // =========================================

// function openSupplierModal() {

//     editingSupplierId = null;

//     document.getElementById("modalTitle").textContent =
//         "Add Supplier";

//     document.getElementById("supplierForm").reset();

//     document.getElementById("supplierId").value = "";

//     document.getElementById("supplierModal")
//         .classList.add("show");
// }


// // =========================================
// // CLOSE MODAL
// // =========================================

// function closeSupplierModal() {

//     document.getElementById("supplierModal")
//         .classList.remove("show");

//     editingSupplierId = null;
// }


// // =========================================
// // EDIT SUPPLIER
// // =========================================

// function editSupplier(id) {

//     const supplier = allSuppliers.find(
//         item => item.supplierId === id
//     );

//     if (!supplier) {
//         return;
//     }

//     editingSupplierId = id;

//     document.getElementById("modalTitle").textContent =
//         "Edit Supplier";

//     document.getElementById("supplierId").value =
//         supplier.supplierId;

//     document.getElementById("username").value =
//         supplier.username || "";

//     document.getElementById("supplierName").value =
//         supplier.supplierName || "";

//     document.getElementById("phone").value =
//         supplier.phone || "";

//     document.getElementById("email").value =
//         supplier.email || "";

//     document.getElementById("address").value =
//         supplier.address || "";

//     document.getElementById("supplierModal")
//         .classList.add("show");
// }


// // =========================================
// // SAVE SUPPLIER
// // =========================================

// document.getElementById("supplierForm")
//     .addEventListener("submit", async function(event) {

//         event.preventDefault();


//         const username =
//     document.getElementById("username").value.trim();

// const supplierName =
//     document.getElementById("supplierName").value.trim();

// const phone =
//     document.getElementById("phone").value.trim();

// const email =
//     document.getElementById("email").value.trim();

// const address =
//     document.getElementById("address").value.trim();


// // =========================================
// // VALIDATION
// // =========================================

// // Phone must contain exactly 10 digits
// const phonePattern = /^[0-9]{10}$/;

// if (!phonePattern.test(phone)) {

//     alert("Phone number must contain exactly 10 digits.");

//     document.getElementById("phone").focus();

//     return;
// }


// // Gmail validation
// const gmailPattern =
//     /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

// if (!gmailPattern.test(email)) {

//     alert("Please enter a valid Gmail address ending with @gmail.com.");

//     document.getElementById("email").focus();

//     return;
// }


// // Required fields
// if (!username) {

//     alert("Username is required.");

//     document.getElementById("username").focus();

//     return;
// }

// if (!supplierName) {

//     alert("Supplier name is required.");

//     document.getElementById("supplierName").focus();

//     return;
// }

// if (!address) {

//     alert("Address is required.");

//     document.getElementById("address").focus();

//     return;
// }



// const supplierData = {

//     username: username,

//     supplierName: supplierName,

//     phone: phone,

//     email: email,

//     address: address,

//     password: document.getElementById("supplierPassword").value.trim()
// };



//         try {

//             let response;


//             // ===============================
//             // EDIT
//             // ===============================

//             if (editingSupplierId !== null) {

//                 response = await fetch(
//                     `${API}/suppliers/${editingSupplierId}`,
//                     {
//                         method: "PUT",

//                         headers: {
//                             "Content-Type": "application/json"
//                         },

//                         body: JSON.stringify(supplierData)
//                     }
//                 );

//             }

//             // ===============================
//             // ADD
//             // ===============================

//             else {

//                 response = await fetch(
//                     `${API}/suppliers`,
//                     {
//                         method: "POST",

//                         headers: {
//                             "Content-Type": "application/json"
//                         },

//                         body: JSON.stringify(supplierData)
//                     }
//                 );
//             }


//             if (!response.ok) {
//                 throw new Error("Unable to save supplier");
//             }


//             alert(
//                 editingSupplierId !== null
//                     ? "Supplier updated successfully."
//                     : "Supplier added successfully."
//             );


//             closeSupplierModal();

//             loadSuppliers();


//         } catch (error) {

//             console.error(error);

//             alert(
//                 "Unable to save supplier. Check the backend."
//             );
//         }

//     });


// // =========================================
// // DELETE SUPPLIER
// // =========================================

// async function deleteSupplier(id) {

//     const supplier = allSuppliers.find(
//         item => item.supplierId === id
//     );

//     if (!supplier) {
//         return;
//     }


//     const confirmed = confirm(
//         `Delete supplier "${supplier.supplierName}"?`
//     );


//     if (!confirmed) {
//         return;
//     }


//     try {

//         const response = await fetch(
//             `${API}/suppliers/${id}`,
//             {
//                 method: "DELETE"
//             }
//         );


//         if (!response.ok) {
//             throw new Error("Delete failed");
//         }


//         alert("Supplier deleted successfully.");

//         loadSuppliers();


//     } catch (error) {

//         console.error(error);

//         alert(
//             "Unable to delete supplier."
//         );
//     }
// }


// // =========================================
// // HTML ESCAPE
// // =========================================

// function escapeHtml(value) {

//     if (value === null || value === undefined) {
//         return "";
//     }

//     return String(value)
//         .replace(/&/g, "&amp;")
//         .replace(/</g, "&lt;")
//         .replace(/>/g, "&gt;")
//         .replace(/"/g, "&quot;")
//         .replace(/'/g, "&#039;");
// }


// // =========================================
// // LOGOUT
// // =========================================

// function logout() {

//     window.location.href = "index.html";
// }


// // =========================================
// // INITIAL LOAD
// // =========================================

// document.addEventListener(
//     "DOMContentLoaded",
//     loadSuppliers
// );

// /* ==========================================
//    SUPPLIER RESTOCKING WORKFLOW
//    ========================================== */

// let restockSuppliers = [];
// let restockMaterials = [];
// let supplyRequests = [];


// // Load suppliers and materials for the request form
// async function loadRestockFormOptions() {
//     const supplierSelect = document.getElementById("requestSupplier");
//     const materialSelect = document.getElementById("requestMaterial");

//     if (!supplierSelect || !materialSelect) return;

//     try {
//         const [supplierResponse, materialResponse] = await Promise.all([
//             fetch(`${API}/suppliers`),
//             fetch(`${API}/materials`)
//         ]);

//         if (!supplierResponse.ok || !materialResponse.ok) {
//             throw new Error("Could not load suppliers or materials.");
//         }

//         restockSuppliers = await supplierResponse.json();
//         restockMaterials = await materialResponse.json();

//         supplierSelect.innerHTML =
//             '<option value="">Select supplier</option>' +
//             restockSuppliers.map(supplier => `
//                 <option value="${supplier.supplierId}">
//                     ${escapeRestockText(supplier.supplierName)}
//                 </option>
//             `).join("");

//         materialSelect.innerHTML =
//             '<option value="">Select material</option>' +
//             restockMaterials.map(material => `
//                 <option value="${material.materialId}">
//                     ${escapeRestockText(material.materialName)}
//                     (Stock: ${Number(material.quantity || 0)})
//                 </option>
//             `).join("");

//     } catch (error) {
//         console.error("Restock form options error:", error);
//         showRestockMessage(
//             "Could not load suppliers and materials. Please refresh.",
//             true
//         );
//     }
// }


// // Create a supply request
// async function createSupplyRequest(event) {
//     event.preventDefault();

//     const supplierId =
//         Number(document.getElementById("requestSupplier").value);

//     const materialId =
//         Number(document.getElementById("requestMaterial").value);

//     const requestedQuantity =
//         Number(document.getElementById("requestedQuantity").value);

//     const requiredDate =
//         document.getElementById("requiredDate").value;

//     const notes =
//         document.getElementById("requestNotes").value.trim();

//     if (
//         !supplierId ||
//         !materialId ||
//         !Number.isFinite(requestedQuantity) ||
//         requestedQuantity <= 0 ||
//         !requiredDate
//     ) {
//         showRestockMessage(
//             "Select a supplier and material, enter a positive quantity, and choose a required date.",
//             true
//         );
//         return;
//     }

//     const submitButton = event.submitter;
//     if (submitButton) submitButton.disabled = true;

//     try {
//         const response = await fetch(`${API}/supply-requests`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//                 supplierId,
//                 materialId,
//                 requestedQuantity,
//                 requiredDate,
//                 notes
//             })
//         });

//         const result = await response.json().catch(() => ({}));

//         if (!response.ok) {
//             throw new Error(
//                 result.error || "Could not create supply request."
//             );
//         }

//         document.getElementById("supplyRequestForm").reset();

//         showRestockMessage(
//             "Supply request created successfully. Stock has not been changed."
//         );

//         await loadSupplyRequests();

//     } catch (error) {
//         showRestockMessage(error.message, true);
//     } finally {
//         if (submitButton) submitButton.disabled = false;
//     }
// }


// // Load the request history
// async function loadSupplyRequests() {
//     const tableBody =
//         document.getElementById("supplyRequestTableBody");

//     if (!tableBody) return;

//     tableBody.innerHTML = `
//         <tr>
//             <td colspan="8" class="loading">Loading supply requests...</td>
//         </tr>
//     `;

//     try {
//         const response = await fetch(`${API}/supply-requests`);

//         if (!response.ok) {
//             throw new Error("Could not load supply requests.");
//         }

//         supplyRequests = await response.json();

//         // Refresh material names and current quantities
//         const materialsResponse = await fetch(`${API}/materials`);

//         if (materialsResponse.ok) {
//             restockMaterials = await materialsResponse.json();
//         }

//         const suppliersById = new Map(
//             restockSuppliers.map(s => [Number(s.supplierId), s])
//         );

//         const materialsById = new Map(
//             restockMaterials.map(m => [Number(m.materialId), m])
//         );

//         if (supplyRequests.length === 0) {
//             tableBody.innerHTML = `
//                 <tr>
//                     <td colspan="8" class="loading">
//                         No supply requests yet.
//                     </td>
//                 </tr>
//             `;
//             return;
//         }

//         tableBody.innerHTML = supplyRequests.map(request => {
//             const supplier = suppliersById.get(Number(request.supplierId));
//             const material = materialsById.get(Number(request.materialId));

//             const status = String(request.status || "PENDING").toUpperCase();
//             const requested = Number(request.requestedQuantity || 0);
//             const received = Number(request.receivedQuantity || 0);
//             const remaining = Math.max(0, requested - received);

//             let actions = "";

//             if (status === "PENDING") {
//                 actions += `
//                     <button class="edit-btn"
//                         type="button"
//                         onclick="changeSupplyRequestStatus(${request.requestId}, 'ACCEPTED')">
//                         Accept
//                     </button>
//                     <button class="delete-btn"
//                         type="button"
//                         onclick="changeSupplyRequestStatus(${request.requestId}, 'REJECTED')">
//                         Reject
//                     </button>
//                 `;
//             } else if (
//                 status === "ACCEPTED" ||
//                 status === "PARTIALLY_RECEIVED"
//             ) {
//                 actions += `
//                     <button class="edit-btn"
//                         type="button"
//                         onclick="recordSupplyDelivery(${request.requestId}, ${remaining})">
//                         Record Delivery
//                     </button>
//                 `;
//             } else {
//                 actions = '<span>—</span>';
//             }

//             return `
//                 <tr>
//                     <td>#${Number(request.requestId)}</td>
//                     <td>${escapeRestockText(supplier?.supplierName || `Supplier ${request.supplierId}`)}</td>
//                     <td>${escapeRestockText(material?.materialName || `Material ${request.materialId}`)}</td>
//                     <td>${formatRestockNumber(requested)} ${escapeRestockText(material?.unit || "")}</td>
//                     <td>${formatRestockNumber(received)} / ${formatRestockNumber(requested)}</td>
//                     <td>${escapeRestockText(request.requiredDate || "-")}</td>
//                     <td>
//                         <span class="status-badge ${getRestockStatusClass(status)}">
//                             ${escapeRestockText(status)}
//                         </span>
//                     </td>
//                     <td><div class="action-buttons">${actions}</div></td>
//                 </tr>
//             `;
//         }).join("");

//     } catch (error) {
//         console.error("Supply request loading error:", error);
//         tableBody.innerHTML = `
//             <tr>
//                 <td colspan="8" class="loading">
//                     Could not load supply requests. Please refresh.
//                 </td>
//             </tr>
//         `;
//     }
// }


// // Accept or reject a pending request
// async function changeSupplyRequestStatus(requestId, status) {
//     const action = status === "ACCEPTED" ? "accept" : "reject";

//     if (!confirm(`Are you sure you want to ${action} request #${requestId}?`)) {
//         return;
//     }

//     try {
//         const response = await fetch(
//             `${API}/supply-requests/${requestId}/status`,
//             {
//                 method: "PUT",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ status })
//             }
//         );

//         const result = await response.json().catch(() => ({}));

//         if (!response.ok) {
//             throw new Error(
//                 result.error || `Could not ${action} the request.`
//             );
//         }

//         showRestockMessage(`Request #${requestId} ${status.toLowerCase()}.`);
//         await loadSupplyRequests();

//     } catch (error) {
//         showRestockMessage(error.message, true);
//     }
// }


// // Record an actual delivery, including partial delivery
// async function recordSupplyDelivery(requestId, remainingQuantity) {
//     if (remainingQuantity <= 0) {
//         showRestockMessage("There is no remaining quantity to receive.", true);
//         return;
//     }

//     const input = prompt(
//         `Request #${requestId}\n` +
//         `Remaining quantity: ${remainingQuantity}\n\n` +
//         "Enter the quantity actually received:"
//     );

//     if (input === null) return;

//     const quantity = Number(input);

//     if (
//         !Number.isFinite(quantity) ||
//         quantity <= 0 ||
//         quantity > remainingQuantity
//     ) {
//         showRestockMessage(
//             `Enter a quantity greater than 0 and no more than ${remainingQuantity}.`,
//             true
//         );
//         return;
//     }

//     if (!confirm(`Record receipt of ${quantity} units for request #${requestId}?`)) {
//         return;
//     }

//     try {
//         const response = await fetch(
//             `${API}/supply-requests/${requestId}/receive`,
//             {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ quantity })
//             }
//         );

//         const result = await response.json().catch(() => ({}));

//         if (!response.ok) {
//             throw new Error(
//                 result.error || "Could not record the delivery."
//             );
//         }

//         showRestockMessage(
//             `Delivery recorded for request #${requestId}. Refreshing inventory...`
//         );

//         await loadSupplyRequests();
//         await loadRestockFormOptions();

//     } catch (error) {
//         showRestockMessage(error.message, true);
//     }
// }


// // Small helpers used only by the restocking section
// function showRestockMessage(message, isError = false) {
//     const element = document.getElementById("supplyRequestMessage");

//     if (!element) {
//         if (isError) alert(message);
//         return;
//     }

//     element.textContent = message;
//     element.classList.toggle("error", isError);
//     element.classList.toggle("success", !isError);
// }

// function getRestockStatusClass(status) {
//     if (status === "COMPLETED") return "good";
//     if (status === "PARTIALLY_RECEIVED") return "low";
//     if (status === "REJECTED") return "out";
//     if (status === "ACCEPTED") return "good";
//     return "low";
// }

// function formatRestockNumber(value) {
//     return Number(value).toLocaleString(undefined, {
//         maximumFractionDigits: 3
//     });
// }

// function escapeRestockText(value) {
//     return String(value ?? "").replace(/[&<>"']/g, character => ({
//         "&": "&amp;",
//         "<": "&lt;",
//         ">": "&gt;",
//         '"': "&quot;",
//         "'": "&#39;"
//     })[character]);
// }


// // Connect the new form without changing existing supplier handlers
// document.addEventListener("DOMContentLoaded", () => {
//     const requestForm = document.getElementById("supplyRequestForm");

//     if (requestForm) {
//         requestForm.addEventListener("submit", createSupplyRequest);
//         loadRestockFormOptions();
//         loadSupplyRequests();
//     }
// });

// const API = "http://localhost:8080/api";
const API = "http://127.0.0.1:8080/api";

let allSuppliers = [];
let editingSupplierId = null;

// =========================================
// LOAD SUPPLIERS
// =========================================
async function loadSuppliers() {
    const tableBody = document.getElementById("supplierTableBody");
    if (!tableBody) return;

    tableBody.innerHTML = `
        <tr>
            <td colspan="7" class="loading">Loading suppliers...</td>
        </tr>
    `;

    try {
        const response = await fetch(`${API}/suppliers`, {
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error(`Failed to load suppliers (HTTP ${response.status})`);
        }

        allSuppliers = await response.json();
        updateSummary();
        renderSuppliers();
    } catch (error) {
        console.error("Load suppliers error:", error);
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="loading">
                    Unable to load suppliers. Check your admin session and backend.
                </td>
            </tr>
        `;
    }
}

// =========================================
// UPDATE SUMMARY
// =========================================
function updateSummary() {
    const total = allSuppliers.length;
    const totalElement = document.getElementById("totalSuppliers");
    const registeredElement = document.getElementById("registeredSuppliers");

    if (totalElement) totalElement.textContent = total;
    if (registeredElement) registeredElement.textContent = total;
}

// =========================================
// DISPLAY SUPPLIERS
// =========================================
function renderSuppliers() {
    const tableBody = document.getElementById("supplierTableBody");
    if (!tableBody) return;

    if (allSuppliers.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="loading">
                    No suppliers found.<br>Click "Add Supplier" to create one.
                </td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = allSuppliers.map(supplier => `
        <tr>
            <td><strong>#${Number(supplier.supplierId)}</strong></td>
            <td><strong>${escapeHtml(supplier.username)}</strong></td>
            <td>${escapeHtml(supplier.supplierName)}</td>
            <td>${escapeHtml(supplier.phone)}</td>
            <td>${escapeHtml(supplier.email)}</td>
            <td>${escapeHtml(supplier.address)}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" type="button"
                        onclick="editSupplier(${Number(supplier.supplierId)})">Edit</button>
                    <button class="delete-btn" type="button"
                        onclick="deleteSupplier(${Number(supplier.supplierId)})">Delete</button>
                </div>
            </td>
        </tr>
    `).join("");
}

// =========================================
// OPEN / CLOSE SUPPLIER MODAL
// =========================================
function openSupplierModal() {
    editingSupplierId = null;
    document.getElementById("modalTitle").textContent = "Add Supplier";
    document.getElementById("supplierForm").reset();
    document.getElementById("supplierId").value = "";
    document.getElementById("supplierModal").classList.add("show");
}

function closeSupplierModal() {
    document.getElementById("supplierModal").classList.remove("show");
    editingSupplierId = null;
}

// =========================================
// EDIT SUPPLIER
// =========================================
function editSupplier(id) {
    const supplier = allSuppliers.find(item =>
        Number(item.supplierId) === Number(id)
    );
    if (!supplier) return;

    editingSupplierId = Number(id);
    document.getElementById("modalTitle").textContent = "Edit Supplier";
    document.getElementById("supplierId").value = supplier.supplierId;
    document.getElementById("username").value = supplier.username || "";
    document.getElementById("supplierName").value = supplier.supplierName || "";
    document.getElementById("phone").value = supplier.phone || "";
    document.getElementById("email").value = supplier.email || "";
    document.getElementById("address").value = supplier.address || "";

    const passwordInput = document.getElementById("supplierPassword");
    if (passwordInput) passwordInput.value = "";

    document.getElementById("supplierModal").classList.add("show");
}

// =========================================
// SAVE SUPPLIER
// =========================================
const supplierForm = document.getElementById("supplierForm");

if (supplierForm) {
    supplierForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const supplierName = document.getElementById("supplierName").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const email = document.getElementById("email").value.trim();
        const address = document.getElementById("address").value.trim();

        const passwordInput = document.getElementById("supplierPassword");
        const password = passwordInput ? passwordInput.value : "";

        if (!/^[0-9]{10}$/.test(phone)) {
            alert("Phone number must contain exactly 10 digits.");
            document.getElementById("phone").focus();
            return;
        }

        const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
        if (!gmailPattern.test(email)) {
            alert("Please enter a valid Gmail address ending with @gmail.com.");
            document.getElementById("email").focus();
            return;
        }

        if (!username) {
            alert("Username is required.");
            document.getElementById("username").focus();
            return;
        }

        if (!supplierName) {
            alert("Supplier name is required.");
            document.getElementById("supplierName").focus();
            return;
        }

        if (!address) {
            alert("Address is required.");
            document.getElementById("address").focus();
            return;
        }

        if (editingSupplierId === null &&
            (!password || password.length < 8)) {
            alert("Please enter an initial password of at least 8 characters.");
            if (passwordInput) passwordInput.focus();
            return;
        }

        const supplierData = {
            username,
            supplierName,
            phone,
            email,
            address,
            password
        };

        const submitButton = supplierForm.querySelector('button[type="submit"]');
        if (submitButton) submitButton.disabled = true;

        try {
            const isEditing = editingSupplierId !== null;
            const url = isEditing
                ? `${API}/suppliers/${editingSupplierId}`
                : `${API}/suppliers`;

            const response = await fetch(url, {
                method: isEditing ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(supplierData)
            });

            const result = await response.json().catch(() => ({}));
            if (!response.ok) {
                throw new Error(result.message || result.error ||
                    `Unable to save supplier (HTTP ${response.status}).`);
            }

            alert(isEditing
                ? "Supplier updated successfully."
                : "Supplier added successfully.");

            closeSupplierModal();
            await loadSuppliers();
            await loadRestockFormOptions();
        } catch (error) {
            console.error("Save supplier error:", error);
            alert(error.message || "Unable to save supplier. Check the backend.");
        } finally {
            if (submitButton) submitButton.disabled = false;
        }
    });
}

// =========================================
// DELETE SUPPLIER
// =========================================
async function deleteSupplier(id) {
    const supplier = allSuppliers.find(item =>
        Number(item.supplierId) === Number(id)
    );
    if (!supplier) return;

    if (!confirm(`Delete supplier "${supplier.supplierName}"?`)) return;

    try {
        const response = await fetch(`${API}/suppliers/${id}`, {
            method: "DELETE",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error(`Delete failed (HTTP ${response.status}).`);
        }

        alert("Supplier deleted successfully.");
        await loadSuppliers();
        await loadRestockFormOptions();
    } catch (error) {
        console.error("Delete supplier error:", error);
        alert(error.message || "Unable to delete supplier.");
    }
}

// =========================================
// HTML ESCAPE
// =========================================
function escapeHtml(value) {
    if (value === null || value === undefined) return "";
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// =========================================
// LOGOUT
// =========================================
async function logout() {
    try {
        await fetch(`${API}/admin-auth/logout`, {
            method: "POST",
            credentials: "include"
        });
    } catch (error) {
        console.error("Logout request failed:", error);
    } finally {
        localStorage.removeItem("rawstockLoggedIn");
        localStorage.removeItem("rawstockUser");
        localStorage.removeItem("rawstockRemember");
        window.location.href = "login.html";
    }
}

// =========================================
// SUPPLIER RESTOCKING WORKFLOW
// =========================================
let restockSuppliers = [];
let restockMaterials = [];
let supplyRequests = [];

async function loadRestockFormOptions() {
    const supplierSelect = document.getElementById("requestSupplier");
    const materialSelect = document.getElementById("requestMaterial");
    if (!supplierSelect || !materialSelect) return;

    try {
        const [supplierResponse, materialResponse] = await Promise.all([
            fetch(`${API}/suppliers`, { credentials: "include" }),
            fetch(`${API}/materials`, { credentials: "include" })
        ]);

        if (!supplierResponse.ok || !materialResponse.ok) {
            const failedStatus = !supplierResponse.ok
                ? supplierResponse.status : materialResponse.status;
            throw new Error(`Could not load suppliers or materials (HTTP ${failedStatus}).`);
        }

        restockSuppliers = await supplierResponse.json();
        restockMaterials = await materialResponse.json();

        supplierSelect.innerHTML =
            '<option value="">Select supplier</option>' +
            restockSuppliers.map(supplier => `
                <option value="${Number(supplier.supplierId)}">
                    ${escapeRestockText(supplier.supplierName)}
                </option>
            `).join("");

        materialSelect.innerHTML =
            '<option value="">Select material</option>' +
            restockMaterials.map(material => `
                <option value="${Number(material.materialId)}">
                    ${escapeRestockText(material.materialName)}
                    (Stock: ${Number(material.quantity || 0)})
                </option>
            `).join("");
    } catch (error) {
        console.error("Restock form options error:", error);
        showRestockMessage(error.message ||
            "Could not load suppliers and materials. Please refresh.", true);
    }
}

// =========================================
// CREATE SUPPLY REQUEST
// =========================================
async function createSupplyRequest(event) {
    event.preventDefault();

    const supplierId = Number(document.getElementById("requestSupplier").value);
    const materialId = Number(document.getElementById("requestMaterial").value);
    const requestedQuantity = Number(document.getElementById("requestedQuantity").value);
    const requiredDate = document.getElementById("requiredDate").value;
    const notes = document.getElementById("requestNotes").value.trim();

    if (!supplierId || !materialId ||
        !Number.isFinite(requestedQuantity) || requestedQuantity <= 0 ||
        !requiredDate) {
        showRestockMessage(
            "Select a supplier and material, enter a positive quantity, and choose a required date.",
            true
        );
        return;
    }

    const submitButton = event.submitter;
    if (submitButton) submitButton.disabled = true;

    try {
        const response = await fetch(`${API}/supply-requests`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                supplierId,
                materialId,
                requestedQuantity,
                requiredDate,
                notes
            })
        });

        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(result.message || result.error ||
                `Could not create supply request (HTTP ${response.status}).`);
        }

        document.getElementById("supplyRequestForm").reset();
        showRestockMessage(
            "Supply request created successfully. Stock has not been changed."
        );
        await loadSupplyRequests();
    } catch (error) {
        console.error("Create supply request error:", error);
        showRestockMessage(error.message, true);
    } finally {
        if (submitButton) submitButton.disabled = false;
    }
}

// =========================================
// LOAD SUPPLY REQUEST HISTORY
// =========================================
async function loadSupplyRequests() {
    const tableBody = document.getElementById("supplyRequestTableBody");
    if (!tableBody) return;

    tableBody.innerHTML = `
        <tr><td colspan="10" class="loading">Loading supply requests...</td></tr>
    `;

    try {
        const response = await fetch(`${API}/supply-requests`, {
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error(`Could not load supply requests (HTTP ${response.status}).`);
        }

        supplyRequests = await response.json();

        const materialsResponse = await fetch(`${API}/materials`, {
            credentials: "include"
        });
        if (materialsResponse.ok) {
            restockMaterials = await materialsResponse.json();
        }

        if (restockSuppliers.length === 0) {
            const suppliersResponse = await fetch(`${API}/suppliers`, {
                credentials: "include"
            });
            if (suppliersResponse.ok) {
                restockSuppliers = await suppliersResponse.json();
            }
        }

        const suppliersById = new Map(
            restockSuppliers.map(supplier => [Number(supplier.supplierId), supplier])
        );
        const materialsById = new Map(
            restockMaterials.map(material => [Number(material.materialId), material])
        );

        if (supplyRequests.length === 0) {
            tableBody.innerHTML = `
                <tr><td colspan="10" class="loading">No supply requests yet.</td></tr>
            `;
            return;
        }

        tableBody.innerHTML = supplyRequests.map(request => {
            const supplier = suppliersById.get(Number(request.supplierId));
            const material = materialsById.get(Number(request.materialId));
            const status = String(request.status || "PENDING").toUpperCase();
            const requested = Number(request.requestedQuantity || 0);
            const received = Number(request.receivedQuantity || 0);
            const remaining = Math.max(0, requested - received);

            let actions = "";
            if (status === "PENDING") {
                actions = "Waiting for supplier response";
            } else if (status === "ACCEPTED" || status === "PARTIALLY_RECEIVED") {
                actions = `
                    <button class="edit-btn" type="button"
                        onclick="recordSupplyDelivery(${Number(request.requestId)}, ${remaining})">Record Delivery</button>
                `;
            } else {
                actions = "<span>—</span>";
            }

            return `
                <tr>
                    <td>#${Number(request.requestId)}</td>
                    <td>${escapeRestockText(supplier?.supplierName || `Supplier ${request.supplierId}`)}</td>
                    <td>${escapeRestockText(material?.materialName || `Material ${request.materialId}`)}</td>
                    <td>${formatRestockNumber(requested)} ${escapeRestockText(material?.unit || "")}</td>
                    <td>${formatRestockNumber(received)} / ${formatRestockNumber(requested)}</td>
                    <td>${escapeRestockText(request.requiredDate || "-")}</td>
                    <td>${escapeRestockText(request.expectedDeliveryDate || "Not provided yet")}</td>
                    <td>${escapeRestockText(request.actualDeliveryDate || "Not received")}</td>
                    <td>
                        <span class="status-badge ${getRestockStatusClass(status)}">
                            ${escapeRestockText(status)}
                        </span>
                    </td>
                    <td>${actions}</td>
                </tr>
            `;
        }).join("");
    } catch (error) {
        console.error("Supply request loading error:", error);
        tableBody.innerHTML = `
            <tr>
                <td colspan="10" class="loading">
                    Could not load supply requests: ${escapeRestockText(error.message)}
                </td>
            </tr>
        `;
    }
}

// =========================================
// ACCEPT OR REJECT REQUEST
// =========================================

async function changeSupplyRequestStatus(requestId, status) {
    const action = status === "ACCEPTED" ? "accept" : "reject";
    let deliveryDays = null;

    if (status === "ACCEPTED") {
        const input = prompt(
            `How many days will delivery take for request #${requestId}?`
        );

        if (input === null) return;

        deliveryDays = Number(input);

        if (!Number.isInteger(deliveryDays) || deliveryDays < 1) {
            showRestockMessage(
                "Please enter a whole number of days, at least 1.",
                true
            );
            return;
        }
    }

    if (!confirm(`Are you sure you want to ${action} request #${requestId}?`)) {
        return;
    }

    try {
        const response = await fetch(
            `${API}/supply-requests/${requestId}/status`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    status,
                    deliveryDays
                })
            }
        );

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(
                result.message || result.error ||
                `Could not ${action} the request (HTTP ${response.status}).`
            );
        }

        showRestockMessage(
            status === "ACCEPTED"
                ? `Request #${requestId} accepted. Expected delivery: ${result.expectedDeliveryDate || "calculated by server"}.`
                : `Request #${requestId} rejected.`
        );

        await loadSupplyRequests();

    } catch (error) {
        console.error("Change request status error:", error);
        showRestockMessage(error.message, true);
    }
}


// =========================================
// RECORD DELIVERY
// =========================================
async function recordSupplyDelivery(requestId, remainingQuantity) {
    if (remainingQuantity <= 0) {
        showRestockMessage("There is no remaining quantity to receive.", true);
        return;
    }

    const input = prompt(
        `Request #${requestId}\nRemaining quantity: ${remainingQuantity}\n\nEnter the quantity actually received:`
    );
    if (input === null) return;

    const quantity = Number(input);
    if (!Number.isFinite(quantity) || quantity <= 0 || quantity > remainingQuantity) {
        showRestockMessage(
            `Enter a quantity greater than 0 and no more than ${remainingQuantity}.`,
            true
        );
        return;
    }

    if (!confirm(`Record receipt of ${quantity} units for request #${requestId}?`)) return;

    try {
        const response = await fetch(`${API}/supply-requests/${requestId}/receive`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ quantity })
        });

        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(result.message || result.error ||
                `Could not record the delivery (HTTP ${response.status}).`);
        }

        showRestockMessage(
            `Delivery recorded for request #${requestId}. Refreshing inventory...`
        );
        await loadSupplyRequests();
        await loadRestockFormOptions();
    } catch (error) {
        console.error("Record delivery error:", error);
        showRestockMessage(error.message, true);
    }
}

// =========================================
// HELPERS
// =========================================
function showRestockMessage(message, isError = false) {
    const element = document.getElementById("supplyRequestMessage");
    if (!element) {
        if (isError) alert(message);
        return;
    }

    element.textContent = message;
    element.classList.toggle("error", isError);
    element.classList.toggle("success", !isError);
}

function getRestockStatusClass(status) {
    if (status === "COMPLETED") return "good";
    if (status === "PARTIALLY_RECEIVED") return "low";
    if (status === "REJECTED") return "out";
    if (status === "ACCEPTED") return "good";
    return "low";
}

function formatRestockNumber(value) {
    return Number(value).toLocaleString(undefined, {
        maximumFractionDigits: 3
    });
}

function escapeRestockText(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

// =========================================
// INITIALIZE PAGE
// =========================================
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("supplierTableBody")) {
        loadSuppliers();
    }

    const requestForm = document.getElementById("supplyRequestForm");
    if (requestForm) {
        requestForm.addEventListener("submit", createSupplyRequest);
        loadRestockFormOptions();
        loadSupplyRequests();
    }
});

// async function logout() {
//     try {
//         await fetch("http://localhost:8080/logout", {
//             method: "POST",
//             credentials: "include"
//         });
//     } catch (error) {
//         console.error("Logout request failed:", error);
//     } finally {
//         localStorage.removeItem("rawstockLoggedIn");
//         localStorage.removeItem("rawstockUser");
//         localStorage.removeItem("rawstockRemember");

//         window.location.href = "login.html";
//     }
// }
