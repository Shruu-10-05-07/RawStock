// const API = "http://localhost:8080/api";
const API = "http://127.0.0.1:8080/api";


// ==========================================
// LOAD DASHBOARD
// ==========================================

async function loadDashboard() {

    try {

     const [materialsResponse, suppliersResponse, stockResponse] =
    await Promise.all([
        fetch(`${API}/materials`, {
            credentials: "include"
        }),
        fetch(`${API}/suppliers`, {
            credentials: "include"
        }),
        fetch(`${API}/stock`, {
            credentials: "include"
        })
    ]);

        const materials = await materialsResponse.json();
        loadNotifications(materials);
        const suppliers = await suppliersResponse.json();
        const transactions = await stockResponse.json();


        // ------------------------------
        // TOTAL MATERIALS
        // ------------------------------

        document.getElementById("totalMaterials").textContent =
            materials.length;


        // ------------------------------
        // TOTAL STOCK
        // ------------------------------

        const totalStock = materials.reduce(
            (total, material) =>
                total + Number(material.quantity || 0),
            0
        );

        document.getElementById("totalStock").textContent =
            formatNumber(totalStock);


        // ------------------------------
        // TOTAL SUPPLIERS
        // ------------------------------

        document.getElementById("totalSuppliers").textContent =
            suppliers.length;


        // ------------------------------
        // LOW STOCK
        // ------------------------------

        const lowStockMaterials = materials.filter(
            material =>
                Number(material.quantity) <=
                Number(material.minimumStock)
        );

        document.getElementById("lowStockCount").textContent =
            lowStockMaterials.length;

        displayLowStock(lowStockMaterials);


        // ------------------------------
        // RECENT TRANSACTIONS
        // ------------------------------

        displayRecentTransactions(
            transactions,
            materials
        );


        // ------------------------------
        // NOTIFICATION COUNT
        // ------------------------------

        const notificationBadge =
            document.querySelector(".notification-badge");

        notificationBadge.textContent =
            lowStockMaterials.length;

    } catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );

    }
}


// ==========================================
// LOW STOCK DISPLAY
// ==========================================

function displayLowStock(materials) {

    const container =
        document.getElementById("lowStockList");

    if (materials.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                <span>✓</span>
                <p>All materials are sufficiently stocked.</p>
            </div>
        `;

        return;
    }


    container.innerHTML = materials
        .slice(0, 5)
        .map(material => `

            <div class="alert-item">

                <div class="alert-material">

                    <div class="alert-icon">
                        !
                    </div>

                    <div>
                        <strong>
                            ${escapeHtml(material.materialName)}
                        </strong>

                        <span>
                            ${escapeHtml(material.materialCode)}
                            · Minimum ${material.minimumStock}
                        </span>
                    </div>

                </div>

                <div class="alert-quantity">

                    ${material.quantity}
                    ${escapeHtml(material.unit)}

                </div>

            </div>

        `)
        .join("");
}


// ==========================================
// RECENT TRANSACTIONS
// ==========================================

function displayRecentTransactions(
    transactions,
    materials
) {

    const tbody =
        document.getElementById("recentTransactions");

    if (!transactions.length) {

        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="table-loading">
                    No transactions found.
                </td>
            </tr>
        `;

        return;
    }


    const recent =
        [...transactions]
            .reverse()
            .slice(0, 6);


    tbody.innerHTML = recent
        .map(transaction => {

            const material =
                materials.find(
                    item =>
                        item.materialId ===
                        transaction.materialId
                );


            const materialName =
                material
                    ? material.materialName
                    : `Material #${transaction.materialId}`;


            const type =
                transaction.transactionType
                    .toUpperCase();


            return `

                <tr>

                    <td>
                        #${transaction.stockId}
                    </td>

                    <td>
                        <strong>
                            ${escapeHtml(materialName)}
                        </strong>
                    </td>

                    <td>

                        <span class="${
                            type === "IN"
                                ? "transaction-in"
                                : "transaction-out"
                        }">

                            ${type}

                        </span>

                    </td>

                    <td>
                        ${transaction.quantity}
                    </td>

                    <td>
                        ${transaction.transactionDate}
                    </td>

                </tr>

            `;

        })
        .join("");
}


// ==========================================
// NUMBER FORMAT
// ==========================================

function formatNumber(number) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            maximumFractionDigits: 2
        }
    ).format(number);
}


// ==========================================
// BASIC HTML SAFETY
// ==========================================

function escapeHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ==========================================
// LOGOUT
// ==========================================

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

window.location.replace("login.html");    }
}


// ==========================================
// START
// ==========================================

// =========================================
// VERIFY ADMIN SESSION BEFORE LOADING
// =========================================

async function verifyAdminSession() {
    try {
        const response = await fetch(
            `${API}/admin-auth/me`,
            {
                method: "GET",
                credentials: "include"
            }
        );

        if (!response.ok) {
            localStorage.removeItem("rawstockLoggedIn");
            localStorage.removeItem("rawstockUser");

            window.location.replace("login.html");
            return;
        }

        loadDashboard();

    } catch (error) {
        console.error("Session verification failed:", error);

        alert("Cannot verify your login. Please check that the backend is running.");
    }
}

verifyAdminSession();
// Keep the dashboard's central notification center current while it remains open.
window.setInterval(async () => {
    try {
        const response = await fetch(`${API}/materials`, { credentials: "include" });
        if (response.ok) loadNotifications(await response.json());
    } catch (error) {
        console.warn("Dashboard notification refresh failed:", error);
    }
}, 30000);
// =========================================
// NOTIFICATION SYSTEM
// =========================================

function toggleNotifications() {

    const panel =
        document.getElementById(
            "notificationPanel"
        );

    if (!panel) {
        return;
    }

    panel.classList.toggle("show");

}


// =========================================
// LOAD ADMIN DASHBOARD NOTIFICATIONS
// Notifications intentionally live only on dashboard.html.
// =========================================
async function loadNotifications(materials) {
    const notificationList = document.getElementById("notificationList");
    const notificationCount = document.getElementById("notificationCount");
    const notificationDot = document.getElementById("notificationDot");
    if (!notificationList) return;

    const lowStockMaterials = (materials || []).filter(material =>
        Number(material.quantity || 0) <= Number(material.minimumStock || 0)
    );
    const alerts = lowStockMaterials.map(material => ({
        title: "Low stock — restock required",
        message: `${material.materialName} has ${formatNumber(material.quantity)} ${material.unit || "units"} remaining (minimum ${formatNumber(material.minimumStock)}).`,
        kind: "stock"
    }));

    try {
        const response = await fetch(`${API}/supply-requests`, { credentials: "include" });
        if (response.ok) {
            const requests = await response.json();
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            for (const request of requests) {
                const status = String(request.status || "PENDING").toUpperCase();
                const requestLabel = `Request #${request.requestId}`;
                if (["PENDING", "ACCEPTED", "REJECTED", "PARTIALLY_RECEIVED", "COMPLETED"].includes(status)) {
                    const expected = request.expectedDeliveryDate ? ` Expected delivery: ${request.expectedDeliveryDate}.` : "";
                    alerts.push({
                        title: status === "PENDING" ? `${requestLabel} awaiting supplier response` : `${requestLabel} ${status.toLowerCase().replaceAll("_", " ")}`,
                        message: `Material #${request.materialId}, quantity ${formatNumber(request.requestedQuantity)}.${expected}`,
                        kind: status === "REJECTED" ? "warning" : "request"
                    });
                }
                if (["ACCEPTED", "PARTIALLY_RECEIVED"].includes(status) && request.expectedDeliveryDate) {
                    const expectedDate = new Date(`${request.expectedDeliveryDate}T00:00:00`);
                    if (!Number.isNaN(expectedDate.getTime()) && expectedDate < today) {
                        alerts.push({
                            title: `${requestLabel} delivery overdue`,
                            message: `Expected ${request.expectedDeliveryDate}; material #${request.materialId} still has an outstanding delivery.`,
                            kind: "warning"
                        });
                    }
                }
            }
        }
    } catch (error) {
        console.warn("Could not load supplier request notifications:", error);
    }

    if (notificationCount) notificationCount.textContent = String(alerts.length);
    if (notificationDot) notificationDot.classList.toggle("show", alerts.length > 0);
    if (alerts.length === 0) {
        notificationList.innerHTML = `<div class="notification-empty">✓ No inventory or supplier updates need attention.</div>`;
        return;
    }
    notificationList.innerHTML = alerts.map(alert => `
        <div class="notification-item">
            <div class="notification-icon">${alert.kind === "warning" ? "!" : alert.kind === "stock" ? "↓" : "✓"}</div>
            <div><strong>${escapeHtml(alert.title)}</strong><span>${escapeHtml(alert.message)}</span></div>
        </div>
    `).join("");
}

// =========================================
// CLOSE NOTIFICATIONS WHEN CLICKING OUTSIDE
// =========================================

document.addEventListener(
    "click",
    function(event) {

        const wrapper =
            document.querySelector(
                ".notification-wrapper"
            );

        const panel =
            document.getElementById(
                "notificationPanel"
            );


        if (
            wrapper &&
            panel &&
            !wrapper.contains(event.target)
        ) {

            panel.classList.remove(
                "show"
            );

        }

    }
);