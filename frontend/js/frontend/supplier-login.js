const SUPPLIER_AUTH_API = "http://127.0.0.1:8080/api/supplier-auth";

const supplierLoginForm = document.getElementById("supplierLoginForm");
const supplierLoginButton = document.getElementById("loginButton");
const supplierLoginMessage = document.getElementById("message");

function showSupplierLoginMessage(message, isError = false) {
    if (!supplierLoginMessage) return;
    supplierLoginMessage.textContent = message;
    supplierLoginMessage.classList.toggle("error", isError);
    supplierLoginMessage.classList.toggle("success", !isError);
}

if (supplierLoginForm) {
    supplierLoginForm.addEventListener("submit", async event => {
        event.preventDefault();
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;

        if (!username || !password) {
            showSupplierLoginMessage("Enter your username and password.", true);
            return;
        }

        supplierLoginButton.disabled = true;
        supplierLoginButton.textContent = "Signing in...";
        showSupplierLoginMessage("");

        try {
            const response = await fetch(`${SUPPLIER_AUTH_API}/login`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ username, password })
            });
            const result = await response.json().catch(() => ({}));
            if (!response.ok) {
                throw new Error(result.message || result.error || `Login failed (HTTP ${response.status}).`);
            }

            sessionStorage.setItem("supplierName", result.supplierName || result.username || username);
            sessionStorage.setItem("supplierUsername", result.username || username);
            sessionStorage.setItem("supplierId", String(result.supplierId || ""));
            window.location.replace("supplier-dashboard.html");
        } catch (error) {
            showSupplierLoginMessage(error.message || "Unable to connect to RawStock.", true);
        } finally {
            supplierLoginButton.disabled = false;
            supplierLoginButton.textContent = "Sign In";
        }
    });
}
