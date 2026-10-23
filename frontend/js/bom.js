const API = "http://127.0.0.1:8080/api";


// =========================================
// BOM CALCULATION
// =========================================

document
    .getElementById("bomForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();

        const quantityPerProduct =
            Number(
                document.getElementById(
                    "quantityPerProduct"
                ).value
            );

        const numberOfProducts =
            Number(
                document.getElementById(
                    "numberOfProducts"
                ).value
            );


        // Basic validation

        if (
            quantityPerProduct <= 0 ||
            numberOfProducts <= 0
        ) {

            alert(
                "Please enter valid positive values."
            );

            return;
        }


        try {

            const response = await fetch(
        `${API}/bom/calculate?quantityPerProduct=${quantityPerProduct}&numberOfProducts=${numberOfProducts}`,
        {
            credentials: "include"
        }
    );


            if (!response.ok) {

                throw new Error(
                    "BOM calculation failed"
                );

            }


            const result =
                await response.json();


            // Display result

            document.getElementById(
                "requiredMaterial"
            ).textContent =
                formatNumber(
                    result.requiredMaterial
                );


            document.getElementById(
                "calculationResult"
            ).classList.remove("hidden");


            // Automatically put calculated
            // value into required stock

            document.getElementById(
                "requiredStock"
            ).value =
                result.requiredMaterial;


        } catch (error) {

            console.error(error);

            alert(
                "Unable to calculate material requirement. Make sure Spring Boot is running."
            );
        }

    });



// =========================================
// STOCK AVAILABILITY CHECK
// =========================================

document
    .getElementById("stockCheckForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();


        const availableStock =
            Number(
                document.getElementById(
                    "availableStock"
                ).value
            );

        const requiredStock =
            Number(
                document.getElementById(
                    "requiredStock"
                ).value
            );


        // Validation

        if (
            availableStock < 0 ||
            requiredStock < 0
        ) {

            alert(
                "Stock values cannot be negative."
            );

            return;
        }


        try {

            const response = await fetch(
    `${API}/bom/check-stock?availableStock=${availableStock}&requiredStock=${requiredStock}`,
    {
        credentials: "include"
    }
);


            if (!response.ok) {

                throw new Error(
                    "Stock check failed"
                );

            }


            const result =
                await response.json();


            displayStockResult(
                result.stockAvailable
            );


        } catch (error) {

            console.error(error);

            alert(
                "Unable to check stock. Make sure Spring Boot is running."
            );
        }

    });



// =========================================
// DISPLAY STOCK RESULT
// =========================================

function displayStockResult(isAvailable) {

    const resultBox =
        document.getElementById(
            "stockResult"
        );

    const icon =
        document.getElementById(
            "stockStatusIcon"
        );

    const status =
        document.getElementById(
            "stockStatus"
        );

    const statusText =
        document.getElementById(
            "stockStatusText"
        );


    resultBox.classList.remove("hidden");

    resultBox.classList.remove(
        "stock-available",
        "stock-insufficient"
    );


    if (isAvailable) {

        resultBox.classList.add(
            "stock-available"
        );

        icon.textContent = "✓";

        status.textContent =
            "Stock Available";

        statusText.textContent =
            "Sufficient material is available for production.";

    } else {

        resultBox.classList.add(
            "stock-insufficient"
        );

        icon.textContent = "!";

        status.textContent =
            "Insufficient Stock";

        statusText.textContent =
            "Additional material is required before production.";

    }

}



// =========================================
// FORMAT NUMBER
// =========================================

function formatNumber(value) {

    return Number(value || 0)
        .toLocaleString(
            "en-IN",
            {
                maximumFractionDigits: 2
            }
        );

}



// =========================================
// LOGOUT
// =========================================

function logout() {

    window.location.href =
        "index.html";

}