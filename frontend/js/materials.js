// const API = "http://localhost:8080/api";
const API = "http://127.0.0.1:8080/api";

let allMaterials = [];
let editingMaterialId = null;


// ==========================================
// LOAD MATERIALS
// ==========================================

async function loadMaterials() {

    try {

        const response =
            await fetch(`${API}/materials`, {
                credentials: "include"
            });

        if (!response.ok) {
            throw new Error("Failed to load materials");
        }

        allMaterials = await response.json();

        renderMaterials(allMaterials);
        updateSummary(allMaterials);

    } catch (error) {

        console.error(error);

        document.getElementById("materialsTable").innerHTML = `
            <tr>
                <td colspan="7" class="table-loading">
                    Unable to connect to backend.
                    Make sure Spring Boot is running.
                </td>
            </tr>
        `;
    }
}


// ==========================================
// RENDER MATERIALS
// ==========================================

function renderMaterials(materials) {

    const tbody =
        document.getElementById("materialsTable");

    if (!materials.length) {

        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="table-loading">
                    No materials found.
                </td>
            </tr>
        `;

        document.getElementById("resultText").textContent =
            "0 materials";

        return;
    }


    tbody.innerHTML = materials.map(material => {

        const quantity =
            Number(material.quantity || 0);

        const minimum =
            Number(material.minimumStock || 0);


        let status;
        let statusClass;

        if (quantity <= 0) {

            status = "Out of Stock";
            statusClass = "out";

        } else if (quantity <= minimum) {

            status = "Restock Required";
            statusClass = "low";

        } else {

            status = "In Stock";
            statusClass = "good";
        }


        const firstLetter =
            (material.materialName || "M")
                .charAt(0)
                .toUpperCase();


        const packText =
            material.purchaseUnit
                ? `${material.purchaseUnit}`
                : "Loose";


        const packDetails =
            material.packSize
                ? `${material.packSize} ${material.unit || ""}`
                : "No pack size";


        return `

            <tr>

                <!-- MATERIAL -->

                <td>

                    <div class="material-info">

                        <div class="material-avatar">
                            ${firstLetter}
                        </div>

                        <div>

                            <strong>
                                ${escapeHtml(material.materialName)}
                            </strong>

                            <span>
                                ${escapeHtml(material.materialCode)}
                            </span>

                        </div>

                    </div>

                </td>


                <!-- CATEGORY -->

                <td>
                    ${escapeHtml(material.category || "-")}
                </td>


                <!-- STOCK -->

                <td>

                    <div class="stock-value">

                        <strong>
                            ${formatNumber(quantity)}
                        </strong>

                        <span>
                            ${escapeHtml(material.unit || "")}
                        </span>

                    </div>

                    <small>
                        Min: ${formatNumber(minimum)}
                    </small>

                </td>


                <!-- PACKAGING -->

                <td>

                    <div class="pack-info">

                        <strong>
                            ${escapeHtml(packText)}
                        </strong>

                        <span>
                            ${escapeHtml(packDetails)}
                        </span>

                    </div>

                </td>


                <!-- LOCATION -->

                <td>

                    <span class="location-text">
                        ${escapeHtml(material.location || "Not assigned")}
                    </span>

                </td>


                <!-- STATUS -->

                <td>

                    <span class="status-badge ${statusClass}">

                        <span class="status-dot-small"></span>

                        ${status}

                    </span>

                </td>


                <!-- ACTIONS -->

                <td>

                    <div class="action-buttons">

                        <button
                            class="table-action stock"
                            title="Stock In / Out"
                            onclick="openStockModal(${material.materialId})">

                            ⇅

                        </button>


                        <button
                            class="table-action edit"
                            title="Edit"
                            onclick="editMaterial(${material.materialId})">

                            ✎

                        </button>


                        <button
                            class="table-action delete"
                            title="Delete"
                            onclick="deleteMaterial(${material.materialId})">

                            🗑

                        </button>

                    </div>

                </td>

            </tr>
        `;

    }).join("");


    document.getElementById("resultText").textContent =
        `${materials.length} material${materials.length !== 1 ? "s" : ""}`;
}


// ==========================================
// SEARCH
// ==========================================

async function searchMaterials() {

    const keyword =
        document.getElementById("searchInput")
            .value
            .trim();


    if (!keyword) {

        applyFilters();
        return;
    }


    try {

        const response =
            await fetch(
                `${API}/materials/search?keyword=${encodeURIComponent(keyword)}`
            );

        const results =
            await response.json();

        renderMaterials(
            applyStockFilterToArray(results)
        );

    } catch (error) {

        console.error(
            "Search error:",
            error
        );
    }
}


// ==========================================
// CLEAR SEARCH
// ==========================================

function clearSearch() {

    document.getElementById("searchInput").value = "";

    applyFilters();
}


// ==========================================
// FILTER
// ==========================================

function applyFilters() {

    const filter =
        document.getElementById("stockFilter").value;

    const keyword =
        document.getElementById("searchInput")
            .value
            .trim()
            .toLowerCase();


    let results = allMaterials;


    if (keyword) {

        results = allMaterials.filter(material => {

            const text = [
                material.materialCode,
                material.materialName,
                material.category,
                material.location
            ]
                .join(" ")
                .toLowerCase();

            return text.includes(keyword);
        });
    }


    results =
        applyStockFilterToArray(results);


    renderMaterials(results);
}


function applyStockFilterToArray(materials) {

    const filter =
        document.getElementById("stockFilter").value;

    return materials.filter(material => {

        const quantity =
            Number(material.quantity ?? 0);

        const minimum =
            Number(material.minimumStock ?? 0);

        if (filter === "available") {
            return quantity > 0;
        }

        if (filter === "low") {
            return quantity > 0 && quantity <= minimum;
        }

        if (filter === "out") {
            return quantity <= 0;
        }

        return true;
    });
}

// function applyStockFilterToArray(materials) {

//     const filter =
//         document.getElementById("stockFilter").value;


//     return materials.filter(material => {

//         const quantity =
//             Number(material.quantity || 0);

//         const minimum =
//             Number(material.minimumStock || 0);


//         if (filter === "available") {
//             return quantity > minimum;
//         }

//         if (filter === "low") {
//             return quantity > 0 && quantity <= minimum;
//         }

//         if (filter === "out") {
//             return quantity <= 0;
//         }

//         return true;
//     });
// }


// ==========================================
// SUMMARY
// ==========================================

function updateSummary(materials) {

    document.getElementById("materialCount")
        .textContent = materials.length;


    document.getElementById("availableCount")
        .textContent =
        materials.filter(material =>
            Number(material.quantity) >
            Number(material.minimumStock)
        ).length;


    document.getElementById("restockCount")
        .textContent =
        materials.filter(material => {

            const quantity =
                Number(material.quantity);

            const minimum =
                Number(material.minimumStock);

            return quantity > 0 &&
                   quantity <= minimum;

        }).length;


    document.getElementById("outOfStockCount")
        .textContent =
        materials.filter(material =>
            Number(material.quantity) <= 0
        ).length;
}


// ==========================================
// ADD / EDIT MODAL
// ==========================================

function openMaterialModal(material = null) {

    document
        .getElementById("materialModal")
        .classList.add("show");


    if (material) {

        editingMaterialId =
            material.materialId;

        document.getElementById("modalTitle")
            .textContent = "Edit Material";


        document.getElementById("materialId")
            .value = material.materialId;

        document.getElementById("materialCode")
            .value = material.materialCode || "";

        document.getElementById("materialName")
            .value = material.materialName || "";

        document.getElementById("category")
            .value = material.category || "";

        document.getElementById("unit")
            .value = material.unit || "";

        document.getElementById("quantity")
            .value = material.quantity ?? 0;

        document.getElementById("minimumStock")
            .value = material.minimumStock ?? 0;

        document.getElementById("location")
            .value = material.location || "";

        document.getElementById("purchaseUnit")
            .value = material.purchaseUnit || "";

        document.getElementById("packSize")
            .value = material.packSize ?? "";

        document.getElementById("packType")
            .value = material.packType || "";

    } else {

        editingMaterialId = null;

        document.getElementById("modalTitle")
            .textContent = "Add Material";

        document.getElementById("materialForm")
            .reset();

        document.getElementById("quantity")
            .value = 0;

    }
}


function closeMaterialModal() {

    document
        .getElementById("materialModal")
        .classList.remove("show");

    editingMaterialId = null;
}


// ==========================================
// SAVE MATERIAL
// ==========================================

document
    .getElementById("materialForm")
    .addEventListener("submit", async function(event) {

        event.preventDefault();


        const material = {

            materialCode:
                document.getElementById("materialCode").value.trim(),

            materialName:
                document.getElementById("materialName").value.trim(),

            category:
                document.getElementById("category").value.trim(),

            unit:
                document.getElementById("unit").value,

            quantity:
                Number(document.getElementById("quantity").value),

            minimumStock:
                Number(document.getElementById("minimumStock").value),

            location:
                document.getElementById("location").value.trim(),

            purchaseUnit:
                document.getElementById("purchaseUnit").value,

            packSize:
                Number(document.getElementById("packSize").value || 0),

            packType:
                document.getElementById("packType").value.trim()
        };


        try {

            let response;


            if (editingMaterialId) {

                response =
                    await fetch(
                        `${API}/materials/${editingMaterialId}`,
                        {
                            method: "PUT",
                            credentials: "include",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(material)
                        }
                    );

            } else {

         response =
    await fetch(
        `${API}/materials`,
        {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(material)
        }
    );
            }


            if (!response.ok) {
                throw new Error("Unable to save material");
            }


            closeMaterialModal();

            await loadMaterials();

        } catch (error) {

            console.error(error);

            alert(
                "Unable to save material. Check the backend."
            );
        }

    });


// ==========================================
// EDIT MATERIAL
// ==========================================

function editMaterial(id) {

    const material =
        allMaterials.find(
            item => item.materialId === id
        );


    if (!material) {
        return;
    }


    openMaterialModal(material);
}


// ==========================================
// DELETE MATERIAL
// ==========================================

async function deleteMaterial(id) {

    const material =
        allMaterials.find(
            item => item.materialId === id
        );


    if (!material) {
        return;
    }


    const confirmed =
        confirm(
            `Delete "${material.materialName}"?`
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
    await fetch(
        `${API}/materials/${id}`,
        {
            method: "DELETE",
            credentials: "include"
        }
    );


        if (!response.ok) {
            throw new Error("Delete failed");
        }


        await loadMaterials();

    } catch (error) {

        console.error(error);

        alert(
            "Unable to delete material."
        );
    }
}


// ==========================================
// STOCK MODAL
// ==========================================

function openStockModal(id) {

    const material =
        allMaterials.find(
            item => item.materialId === id
        );


    if (!material) {
        return;
    }


    document
        .getElementById("stockModal")
        .classList.add("show");


    document.getElementById("stockMaterialId")
        .value = id;


    document.getElementById("stockMaterialName")
        .textContent =
        material.materialName;


    document.getElementById("currentStock")
        .textContent =
        `${formatNumber(material.quantity)} ${material.unit || ""}`;


    document.getElementById("stockAmount")
        .value = "";


    document.getElementById("transactionDate")
        .value =
        new Date().toISOString().split("T")[0];

}


function closeStockModal() {

    document
        .getElementById("stockModal")
        .classList.remove("show");
}


// ==========================================
// STOCK UPDATE
// ==========================================

document
    .getElementById("stockForm")
    .addEventListener("submit", async function(event) {

        event.preventDefault();


        const id =
            document.getElementById("stockMaterialId")
                .value;


        const amount =
            Number(
                document.getElementById("stockAmount")
                    .value
            );


        const type =
            document.querySelector(
                'input[name="stockType"]:checked'
            ).value;


        const date =
            document.getElementById("transactionDate")
                .value;


        if (amount <= 0) {

            alert("Enter a valid quantity.");

            return;
        }


        const material =
            allMaterials.find(
                item =>
                    item.materialId === Number(id)
            );


        if (!material) {
            return;
        }


        // Prevent stock out beyond available stock

        if (
            type === "OUT" &&
            amount > Number(material.quantity)
        ) {

            alert(
                `Insufficient stock.\n\nAvailable: ${material.quantity} ${material.unit}`
            );

            return;
        }


        try {

            // First update material quantity

            const endpoint =
                type === "IN"
                    ? `${API}/materials/${id}/stock-in?amount=${amount}`
                    : `${API}/materials/${id}/stock-out?amount=${amount}`;


            const response =
                await fetch(
                    endpoint,
                    {
                        method: "PUT",
                        credentials: "include"
                    }
                );


            if (!response.ok) {
                throw new Error("Stock update failed");
            }


            // Save transaction in stock table

            await fetch(
                `${API}/stock`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({

                        materialId: Number(id),

                        transactionType: type,

                        quantity: amount,

                        transactionDate: date
                    })
                }
            );


            closeStockModal();

            await loadMaterials();


            alert(
                `Stock ${type === "IN" ? "added" : "removed"} successfully.`
            );

        } catch (error) {

            console.error(error);

            alert(
                "Unable to update stock."
            );
        }

    });


// ==========================================
// NUMBER FORMAT
// ==========================================

function formatNumber(value) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            maximumFractionDigits: 2
        }
    ).format(Number(value || 0));
}


// ==========================================
// HTML SAFETY
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
// CLOSE MODALS WHEN CLICKING OUTSIDE
// ==========================================

window.addEventListener("click", function(event) {

    if (
        event.target ===
        document.getElementById("materialModal")
    ) {
        closeMaterialModal();
    }

    if (
        event.target ===
        document.getElementById("stockModal")
    ) {
        closeStockModal();
    }

});


// ==========================================
// START
// ==========================================

loadMaterials();


// ==========================================
// MATERIALS NOTIFICATIONS
// ==========================================

function setupMaterialsNotification() {

    const button =
        document.getElementById("notificationButton");

    const panel =
        document.getElementById("notificationPanel");

    if (!button || !panel) {

        console.log(
            "Materials notification elements not found"
        );

        return;
    }

    console.log(
        "Materials notification connected"
    );


    // ======================================
    // BELL CLICK
    // ======================================

    button.addEventListener(
        "click",
        function(event) {

            event.stopPropagation();

            panel.classList.toggle("show");

        }
    );


    // ======================================
    // CLOSE WHEN CLICKING OUTSIDE
    // ======================================

    document.addEventListener(
        "click",
        function(event) {

            if (
                !button.contains(event.target) &&
                !panel.contains(event.target)
            ) {

                panel.classList.remove("show");

            }

        }
    );


    // Load notifications

    loadMaterialsNotifications();

}


// ==========================================
// LOAD MATERIAL NOTIFICATIONS
// ==========================================

async function loadMaterialsNotifications() {

    try {

        const response =
    await fetch(
        "http://127.0.0.1:8080/api/materials",
        {
            credentials: "include"
        }
    );


        if (!response.ok) {

            throw new Error(
                "Failed to load materials"
            );

        }


        const materials =
            await response.json();


        // Find low-stock materials

        const lowStock =
            materials.filter(material =>

                Number(material.quantity || 0)
                <=
                Number(material.minimumStock || 0)

            );


        const list =
            document.getElementById(
                "notificationList"
            );


        const count =
            document.getElementById(
                "notificationCount"
            );


        const dot =
            document.getElementById(
                "notificationDot"
            );


        if (!list) {

            return;

        }


        // ======================================
        // NOTIFICATION COUNT
        // ======================================

        if (count) {

            count.textContent =
                lowStock.length;

        }


        // ======================================
        // RED DOT
        // ======================================

        if (dot) {

            dot.classList.toggle(
                "show",
                lowStock.length > 0
            );

        }


        // ======================================
        // NO ALERTS
        // ======================================

        if (lowStock.length === 0) {

            list.innerHTML = `

                <div class="notification-empty">

                    ✓ No restock alerts

                    <br><br>

                    All materials are above
                    their minimum stock level.

                </div>

            `;

            return;

        }


        // ======================================
        // DISPLAY ALERTS
        // ======================================

        list.innerHTML =

            lowStock.map(material => `

                <div class="notification-item">

                    <div class="notification-icon">
                        !
                    </div>

                    <div>

                        <strong>
                            Restock Required
                        </strong>

                        <span>

                            ${material.materialName}

                            has only

                            ${material.quantity}

                            ${material.unit}

                            remaining.

                            Minimum:

                            ${material.minimumStock}

                            ${material.unit}

                        </span>

                    </div>

                </div>

            `).join("");


    } catch (error) {

        console.error(
            "Materials notification error:",
            error
        );

    }

}


// ==========================================
// START MATERIAL NOTIFICATIONS
// ==========================================

setupMaterialsNotification();