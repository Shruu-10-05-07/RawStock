// const API = "http://localhost:8080/api";
const API = "http://127.0.0.1:8080/api";

let allTransactions = [];
let currentFilter = "ALL";


// ===============================
// LOAD STOCK TRANSACTIONS
// ===============================

async function loadStock() {

    const tableBody = document.getElementById("stockTableBody");

    tableBody.innerHTML = `
        <tr>
            <td colspan="6" class="loading">
                Loading transactions...
            </td>
        </tr>
    `;

    try {

       const response = await fetch(`${API}/stock`, {
    credentials: "include"
});

        if (!response.ok) {
            throw new Error("Failed to load stock transactions");
        }

        allTransactions = await response.json();

        updateSummary();

        renderStock();

    } catch (error) {

        console.error(error);

        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="loading">
                    Unable to load stock transactions.
                    <br>
                    Make sure Spring Boot is running.
                </td>
            </tr>
        `;
    }
}


// ===============================
// SUMMARY
// ===============================

function updateSummary() {

    const total = allTransactions.length;

    const stockIn = allTransactions.filter(
        transaction =>
            transaction.transactionType === "IN"
    ).length;

    const stockOut = allTransactions.filter(
        transaction =>
            transaction.transactionType === "OUT"
    ).length;

    const movement = allTransactions.reduce(
        (sum, transaction) =>
            sum + Number(transaction.quantity || 0),
        0
    );

    document.getElementById("totalTransactions").textContent = total;

    document.getElementById("stockInCount").textContent = stockIn;

    document.getElementById("stockOutCount").textContent = stockOut;

    document.getElementById("totalMovement").textContent =
        formatNumber(movement);
}


// ===============================
// RENDER TABLE
// ===============================

function renderStock() {

    const tableBody =
        document.getElementById("stockTableBody");

    let transactions = [...allTransactions];


    // FILTER

    if (currentFilter !== "ALL") {

        transactions = transactions.filter(
            transaction =>
                transaction.transactionType === currentFilter
        );
    }


    // EMPTY STATE

    if (transactions.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="loading">
                    No stock transactions found.
                </td>
            </tr>
        `;

        return;
    }


    // NEWEST FIRST

    transactions.reverse();


    tableBody.innerHTML = transactions.map(
        transaction => {

            const type =
                transaction.transactionType === "IN"
                    ? "Stock In"
                    : "Stock Out";

            const badgeClass =
                transaction.transactionType === "IN"
                    ? "status-in"
                    : "status-out";


            return `
                <tr>

                    <td>
                        <strong>
                            #${transaction.stockId}
                        </strong>
                    </td>

                    <td>
                        RM-${String(transaction.materialId)
                            .padStart(3, "0")}
                    </td>

                    <td>

                        <span class="stock-badge ${badgeClass}">
                            ${
                                transaction.transactionType === "IN"
                                    ? "↓"
                                    : "↑"
                            }
                            ${type}
                        </span>

                    </td>

                    <td>
                        <strong>
                            ${formatNumber(transaction.quantity)}
                        </strong>
                    </td>

                    <td>
                        ${transaction.transactionDate || "-"}
                    </td>

                    <td>

                        <button
                            class="delete-btn"
                            onclick="deleteTransaction(${transaction.stockId})">

                            Delete

                        </button>

                    </td>

                </tr>
            `;
        }
    ).join("");
}


// ===============================
// FILTER
// ===============================

function filterStock(filter, button) {

    currentFilter = filter;

    document
        .querySelectorAll(".filter-btn")
        .forEach(btn => {
            btn.classList.remove("active");
        });

    button.classList.add("active");

    renderStock();
}


// ===============================
// DELETE TRANSACTION
// ===============================

async function deleteTransaction(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this stock transaction?"
    );

    if (!confirmed) {
        return;
    }

    try {

        const response = await fetch(
    `${API}/stock/${id}`,
    {
        method: "DELETE",
        credentials: "include"
    }
);

        if (!response.ok) {
            throw new Error("Delete failed");
        }

        alert("Transaction deleted successfully.");

        loadStock();

    } catch (error) {

        console.error(error);

        alert(
            "Unable to delete transaction."
        );
    }
}


// ===============================
// FORMAT NUMBER
// ===============================

function formatNumber(value) {

    return Number(value || 0)
        .toLocaleString("en-IN", {
            maximumFractionDigits: 2
        });
}


// ===============================
// LOGOUT
// ===============================

function logout() {

    window.location.href = "index.html";
}


// ===============================
// INITIAL LOAD
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    loadStock
);