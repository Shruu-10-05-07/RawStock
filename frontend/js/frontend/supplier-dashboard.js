
const API = "http://127.0.0.1:8080/api";

const requestsBody = document.getElementById("requestsBody");
const notice = document.getElementById("notice");
// const refreshButton = document.getElementById("refreshButton");
const logoutButton = document.getElementById("logoutButton");
const refreshRequestsButton = document.getElementById("refreshRequestsButton");

let isLoading = false;
let knownRequestIds = null;
if (refreshRequestsButton) refreshRequestsButton.addEventListener("click", () => loadRequests(false));

function getTodayDateString() {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

function showNotice(text, type = "") {
    notice.textContent = text;
    notice.className = type;
}

function getStatusClass(status) {
    switch (String(status ?? "").toUpperCase()) {
        case "PENDING":
            return "pending";

        case "ACCEPTED":
            return "accepted";

        case "REJECTED":
            return "rejected";

        case "COMPLETED":
            return "completed";

        case "PARTIALLY_RECEIVED":
            return "partial";

        default:
            return "";
    }
}

function formatValue(value) {
    return value === null || value === undefined || value === ""
        ? "—"
        : escapeHtml(value);
}

async function loadRequests(silent = false) {
    if (isLoading) return;

    isLoading = true;
    if (!silent) {
        requestsBody.innerHTML = `
            <tr><td colspan="8" class="empty">Loading requests...</td></tr>
        `;
    }

    try {
        const response = await fetch(
            `${API}/supply-requests/supplier/my-requests`,
            {
                method: "GET",
                credentials: "include",
                headers: {
                    "Accept": "application/json"
                }
            }
        );

        if (response.status === 401 || response.status === 403) {
            sessionStorage.removeItem("supplierName");
            window.location.replace("supplier-login.html");
            return;
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));

            throw new Error(
                errorData.error ||
                errorData.message ||
                `Unable to load requests. HTTP ${response.status}`
            );
        }

        const requests = await response.json();

        if (!Array.isArray(requests)) {
            throw new Error("Unexpected response received from the server.");
        }

        const currentRequestIds = new Set(requests.map(request => Number(request.requestId)));
        const newRequests = knownRequestIds === null ? [] : requests.filter(
            request => !knownRequestIds.has(Number(request.requestId))
        );
        knownRequestIds = currentRequestIds;

        const pendingRequests = requests.filter(
            request => request.status === "PENDING"
        );

        const activeRequests = requests.filter(
            request => ["ACCEPTED", "PARTIALLY_RECEIVED"]
                .includes(request.status)
        );

        document.getElementById("totalCount").textContent =
            requests.length;

        document.getElementById("pendingCount").textContent =
            pendingRequests.length;

        document.getElementById("activeCount").textContent =
            activeRequests.length;

        const supplierName = sessionStorage.getItem("supplierName");

        document.getElementById("welcomeName").textContent =
            supplierName
                ? `Welcome, ${supplierName}`
                : "Supplier Dashboard";

        if (requests.length === 0) {
            requestsBody.innerHTML = `
                <tr>
                    <td colspan="8" class="empty">
                        No supply requests have been assigned to you yet.
                    </td>
                </tr>
            `;

            showNotice("");
            return;
        }

        requestsBody.innerHTML = requests.map(request => {
            const requestId = Number(request.requestId);
            const status = String(request.status ?? "").toUpperCase();
            const isPending = status === "PENDING";

            let actions = "—";

            if (isPending) {
                actions = `
                    <div class="actions supplier-request-actions">
                        <label class="expected-date-label" for="expected-date-${requestId}">Expected delivery</label>
                        <input type="date" class="expected-date-input" id="expected-date-${requestId}"
                            data-date-id="${requestId}" min="${getTodayDateString()}" required aria-label="Expected delivery date for request ${requestId}">
                        <button type="button" class="accept-btn" data-action="accept" data-id="${requestId}">Accept</button>
                        <button type="button" class="reject-btn" data-action="reject" data-id="${requestId}">Reject</button>
                    </div>
                `;
            }

            return `
                <tr>
                    <td>#${requestId}</td>
                    <td>${formatValue(request.materialId)}</td>
                    <td>${formatValue(request.requestedQuantity)}</td>
                    <td>${formatValue(request.deliveryDays)}</td>
                    <td>${formatValue(request.requiredDate)}</td>
                    
                    <td>${formatValue(request.expectedDeliveryDate)}</td>
                    <td>
                        <span class="badge ${getStatusClass(status)}">
                            ${escapeHtml(status || "UNKNOWN")}
                        </span>
                    </td>
                    <td>${actions}</td>
                </tr>
            `;
        }).join("");

        if (newRequests.length > 0) {
            const ids = newRequests.map(request => `#${Number(request.requestId)}`).join(", ");
            showNotice(`New supply request assigned: ${ids}. Review it below.`, "success");
        } else if (!silent) {
            showNotice("");
        }

    } catch (error) {
        requestsBody.innerHTML = `
            <tr>
                <td colspan="8" class="empty">
                    Unable to load supply requests.
                </td>
            </tr>
        `;

        showNotice(
            error.message || "Could not connect to the backend.",
            "error"
        );

    } finally {
        isLoading = false;
        // refreshButton.disabled = false;
    }
}

requestsBody.addEventListener("click", async event => {
    const button = event.target.closest("button[data-action]");

    if (!button || button.disabled) return;

    const requestId = Number(button.dataset.id);
    const action = button.dataset.action;

    if (!Number.isSafeInteger(requestId) || requestId <= 0) {
        showNotice("Invalid request ID.", "error");
        return;
    }

    let status;
    let expectedDeliveryDate = null;

    if (action === "accept") {
        const dateInput = document.querySelector(`[data-date-id="${requestId}"]`);
        expectedDeliveryDate = dateInput?.value || "";
        const todayText = getTodayDateString();
        if (!expectedDeliveryDate || expectedDeliveryDate < todayText ||
            !/^\d{4}-\d{2}-\d{2}$/.test(expectedDeliveryDate)) {
            showNotice("Choose a valid expected delivery date today or later before accepting.", "error");
            dateInput?.focus();
            return;
        }
        status = "ACCEPTED";

    } else if (action === "reject") {
        const confirmed = confirm(
            `Are you sure you want to reject request #${requestId}?`
        );

        if (!confirmed) return;

        status = "REJECTED";

    } else {
        return;
    }

    button.disabled = true;
    showNotice("Saving your response...");

    try {
        const response = await fetch(
            `${API}/supply-requests/${requestId}/supplier-status`,
            {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    status: status,
                    expectedDeliveryDate: expectedDeliveryDate
                })
            }
        );

        const data = await response.json().catch(() => ({}));

        if (response.status === 401 || response.status === 403) {
            sessionStorage.removeItem("supplierName");
            window.location.replace("supplier-login.html");
            return;
        }

        if (!response.ok) {
            throw new Error(
                data.error ||
                data.message ||
                `Unable to update request. HTTP ${response.status}`
            );
        }

        await loadRequests(true);
        showNotice(
            status === "ACCEPTED"
                ? "Request accepted. Your expected delivery date was submitted to Admin."
                : "Request rejected successfully.",
            "success"
        );

    } catch (error) {
        showNotice(
            error.message || "Unable to save your response.",
            "error"
        );

        button.disabled = false;
    }
});

// refreshButton.addEventListener("click", loadRequests);


// logoutButton.addEventListener("click", async () => {
//     logoutButton.disabled = true;
//     logoutButton.textContent = "Logging out...";

//     try {
//         const response = await fetch("http://127.0.0.1:8080/logout", {
//             method: "POST",
//             credentials: "include"
//         });

//         if (!response.ok) {
//             throw new Error(`Logout failed: HTTP ${response.status}`);
//         }

//         sessionStorage.removeItem("supplierName");
//         window.location.replace("supplier-login.html");

//     } catch (error) {
//         console.error("Supplier logout failed:", error);
//         alert("Logout failed. Please check the backend and try again.");

//         logoutButton.disabled = false;
//         logoutButton.textContent = "Logout";
//     }
// });

logoutButton.addEventListener("click", async () => {
    logoutButton.disabled = true;
    logoutButton.textContent = "Logging out...";

    try {
        const response = await fetch("http://127.0.0.1:8080/logout", {
            method: "POST",
            credentials: "include"
        });

        // Spring Security may redirect after a successful logout.
        if (!response.ok) {
            throw new Error(`Logout failed: HTTP ${response.status}`);
        }

        sessionStorage.removeItem("supplierName");
        window.location.replace("login.html");

    } catch (error) {
        console.error("Supplier logout failed:", error);
        alert("Logout failed. Check the browser console and backend.");

        logoutButton.disabled = false;
        logoutButton.textContent = "Logout";
    }
});


loadRequests();
// Refresh assigned requests periodically so newly created Admin requests appear without manual reload.
window.setInterval(() => loadRequests(true), 30000);

