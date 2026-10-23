
 // =========================================
 // RAWSTOCK LOGIN
 // =========================================

// const API_BASE = "http://localhost:8080/api";
const API_BASE = "http://127.0.0.1:8080/api";


// =========================================
// PASSWORD VALIDATION
// =========================================

function validatePassword(password) {
    const hasLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[@$!%*?&#]/.test(password);

    return {
        hasLength,
        hasUppercase,
        hasLowercase,
        hasNumber,
        hasSpecial,
        valid:
            hasLength &&
            hasUppercase &&
            hasLowercase &&
            hasNumber &&
            hasSpecial
    };
}


// =========================================
// UPDATE PASSWORD RULES
// =========================================

function updatePasswordRules(password) {
    const result = validatePassword(password);

    updateRule("lengthRule", result.hasLength,
        "At least 8 characters");

    updateRule("uppercaseRule", result.hasUppercase,
        "1 uppercase letter");

    updateRule("lowercaseRule", result.hasLowercase,
        "1 lowercase letter");

    updateRule("numberRule", result.hasNumber,
        "1 number");

    updateRule("specialRule", result.hasSpecial,
        "1 special character");
}


// =========================================
// RULE UI
// =========================================

function updateRule(id, valid, text) {
    const element = document.getElementById(id);

    if (!element) {
        return;
    }

    if (valid) {
        element.textContent = "✓ " + text;
        element.classList.add("valid");
    } else {
        element.textContent = "○ " + text;
        element.classList.remove("valid");
    }
}


// =========================================
// PASSWORD LIVE CHECK
// =========================================

const passwordInput = document.getElementById("password");

if (passwordInput) {
    passwordInput.addEventListener("input", function () {
        updatePasswordRules(passwordInput.value);
    });
}


// =========================================
// LOGIN FORM
// =========================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const username = document
            .getElementById("username")
            .value
            .trim();

        const password = document
            .getElementById("password")
            .value;

        if (!username) {
            showMessage(
                "Please enter your username.",
                "error"
            );
            return;
        }

        const passwordResult = validatePassword(password);

        if (!passwordResult.valid) {
            showMessage(
                "Password does not meet the required security rules.",
                "error"
            );

            updatePasswordRules(password);
            return;
        }

        const submitButton =
            loginForm.querySelector('button[type="submit"]');

        if (submitButton) {
            submitButton.disabled = true;
        }

        try {
            const response = await fetch(
                `${API_BASE}/admin-auth/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        username: username,
                        password: password
                    })
                }
            );

            const result = await response.json();

            if (!response.ok) {
                showMessage(
                    result.message ||
                    "Invalid username or password.",
                    "error"
                );
                return;
            }

            // Store frontend compatibility state only.
            // The backend session is the authentication mechanism.
            localStorage.setItem("rawstockLoggedIn", "true");
            localStorage.setItem("rawstockUser", username);

            const rememberMe =
                document.getElementById("rememberMe");

            if (rememberMe && rememberMe.checked) {
                localStorage.setItem("rawstockRemember", "true");
            } else {
                localStorage.removeItem("rawstockRemember");
            }

            showMessage(
                "Login successful. Redirecting...",
                "success"
            );

            setTimeout(function () {
                window.location.href = "dashboard.html";
            }, 700);

        } catch (error) {
            console.error("Login error:", error);

            showMessage(
                "Unable to connect to the backend. Please check that the server is running.",
                "error"
            );

        } finally {
            if (submitButton) {
                submitButton.disabled = false;
            }
        }
    });
}


// =========================================
// SHOW MESSAGE
// =========================================

function showMessage(text, type) {
    const message = document.getElementById("loginMessage");

    if (!message) {
        return;
    }

    message.textContent = text;
    message.className = "login-message " + type;
}
