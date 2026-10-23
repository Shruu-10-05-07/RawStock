
// const API = "http://127.0.0.1:8080/api";

// const loginForm = document.getElementById("loginForm");
// const loginButton = document.getElementById("loginButton");
// const message = document.getElementById("message");

// loginForm.addEventListener("submit", async (event) => {
//     event.preventDefault();

//     const role = document.getElementById("role").value;
//     const username = document.getElementById("username").value.trim();
//     const password = document.getElementById("password").value;

//     const endpoint =
//         role === "ADMIN"
//             ? "/admin-auth/login"
//             : "/supplier-auth/login";

//     const dashboard =
//         role === "ADMIN"
//             ? "dashboard.html"
//             : "supplier-dashboard.html";

//     loginButton.disabled = true;
//     loginButton.textContent = "Signing in...";
//     message.textContent = "";
//     message.className = "";

//     try {
//         const response = await fetch(`${API}${endpoint}`, {
//             method: "POST",
//             credentials: "include",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({
//                 username: username,
//                 password: password
//             })
//         });

//         const data = await response.json().catch(() => ({}));

//         if (!response.ok) {
//             throw new Error(
//                 data.error ||
//                 data.message ||
//                 "Invalid username or password."
//             );
//         }

//         // Store only the supplier's display name for this browser tab.
// if (role === "SUPPLIER") {
//     if (data.supplierName) {
//         sessionStorage.setItem("supplierName", data.supplierName);
//     }

//     window.location.replace("supplier-dashboard.html");
// } else {
//     window.location.replace("dashboard.html");
// }

//     } catch (error) {
//         message.textContent =
//             error.message || "Unable to connect to the backend.";

//         message.className = "error";

//     } finally {
//         loginButton.disabled = false;
//         loginButton.textContent = "Sign In";
//     }
// });


// const API = "http://127.0.0.1:8080/api";

// const loginForm = document.getElementById("loginForm");
// const loginButton = document.getElementById("loginButton");
// const message = document.getElementById("message");

// loginForm.addEventListener("submit", async (event) => {
//     event.preventDefault();

//     const role = document.getElementById("role").value;
//     const username = document.getElementById("username").value.trim();
//     const password = document.getElementById("password").value;

//     const endpoint =
//         role === "ADMIN"
//             ? "/admin-auth/login"
//             : "/supplier-auth/login";

//     const dashboard =
//         role === "ADMIN"
//             ? "dashboard.html"
//             : "supplier-dashboard.html";

//     loginButton.disabled = true;
//     loginButton.textContent = "Signing in...";
//     message.textContent = "";
//     message.className = "";

//     try {
//         const response = await fetch(`${API}${endpoint}`, {
//             method: "POST",
//             credentials: "include",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Accept": "application/json"
//             },
//             body: JSON.stringify({
//                 username,
//                 password
//             })
//         });

//         const data = await response.json().catch(() => ({}));

//         if (!response.ok) {
//             throw new Error(
//                 data.error ||
//                 data.message ||
//                 "Invalid username or password."
//             );
//         }

//         if (role === "SUPPLIER" && data.supplierName) {
//             sessionStorage.setItem("supplierName", data.supplierName);
//         }

//         window.location.replace(dashboard);

//     } catch (error) {
//         message.textContent =
//             error.message || "Unable to connect to the backend.";

//         message.className = "error";
//     } finally {
//         loginButton.disabled = false;
//         loginButton.textContent = "Sign In";
//     }
// });


const API_BASE = "http://127.0.0.1:8080/api";

const loginForm = document.getElementById("loginForm");
const loginButton = document.getElementById("loginButton");
const message = document.getElementById("message");

function showMessage(text, type = "") {
    message.textContent = text;
    message.className = type;
}

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const role = document.getElementById("role").value;
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (!username || !password) {
        showMessage("Enter your username and password.", "error");
        return;
    }

    loginButton.disabled = true;
    loginButton.textContent = "Signing in...";
    showMessage("");

    const endpoint = role === "SUPPLIER"
        ? `${API_BASE}/supplier-auth/login`
        : `${API_BASE}/admin-auth/login`;

    try {
        const response = await fetch(endpoint, {
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
            throw new Error(
                result.message ||
                result.error ||
                `Login failed (HTTP ${response.status}).`
            );
        }

        if (role === "SUPPLIER") {
            sessionStorage.setItem(
                "supplierName",
                result.supplierName || result.username || username
            );
            sessionStorage.setItem(
                "supplierUsername",
                result.username || username
            );
            sessionStorage.setItem(
                "supplierId",
                String(result.supplierId || "")
            );

            localStorage.removeItem("rawstockLoggedIn");
            localStorage.removeItem("rawstockUser");

            window.location.replace("supplier-dashboard.html");
        } else {
            localStorage.setItem("rawstockLoggedIn", "true");
            localStorage.setItem("rawstockUser", username);
            localStorage.removeItem("rawstockRemember");

            sessionStorage.removeItem("supplierName");
            sessionStorage.removeItem("supplierUsername");
            sessionStorage.removeItem("supplierId");

            window.location.replace("dashboard.html");
        }
    } catch (error) {
        console.error("Login failed:", error);
        showMessage(
            error.message || "Unable to connect to the backend.",
            "error"
        );
    } finally {
        loginButton.disabled = false;
        loginButton.textContent = "Sign In";
    }
});

