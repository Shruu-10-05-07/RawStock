# RawStock — Raw Material Inventory Management System

RawStock uses Java 17+, Spring Boot, HTML/CSS/JavaScript, Spring Data JPA, and PostgreSQL.

## Requirements

- JDK 17 or newer
- Maven 3.9+ (or use your IDE's Maven integration)
- PostgreSQL 14 or newer
- VS Code Live Server or another local static web server (recommended)

## 1. Create the PostgreSQL database

In `psql` or pgAdmin, create the database:

```sql
CREATE DATABASE rawstock_db;
```

The application uses `spring.jpa.hibernate.ddl-auto=update`, so Hibernate updates the existing schema without dropping tables. Back up your database before running a new build. The additive migration at `backend/sql/001_add_actual_delivery_date.sql` can also be applied manually if your database administrator prefers explicit schema changes.

## 2. Configure environment variables

The backend reads these environment variables:

| Variable | Default | Purpose |
|---|---|---|
| `DB_USERNAME` | `postgres` | PostgreSQL username |
| `DB_PASSWORD` | `postgres` | PostgreSQL password |
| `RAWSTOCK_ADMIN_USERNAME` | `admin` | Admin login username |
| `RAWSTOCK_ADMIN_PASSWORD` | `ChangeMe123!` | Admin login password |

**Change the default admin password before using the application beyond local development.** Do not commit your real database password or admin credentials.

PowerShell example for the current terminal:

```powershell
$env:DB_USERNAME = "postgres"
$env:DB_PASSWORD = "YOUR_POSTGRES_PASSWORD"
$env:RAWSTOCK_ADMIN_USERNAME = "admin"
$env:RAWSTOCK_ADMIN_PASSWORD = "YOUR_STRONG_ADMIN_PASSWORD"
```

## 3. Start the backend

From the `backend` folder:

```powershell
cd backend
mvn spring-boot:run
```

The API runs at `http://127.0.0.1:8080`.

## 4. Start the frontend

Open the `frontend` folder in VS Code and run Live Server on `index.html`. Keep the frontend on a configured origin such as `http://127.0.0.1:5500` or `http://localhost:5500`; these are allowed by the current CORS configuration.

- `index.html`: redirects to the Admin login page (`login.html`)
- `dashboard.html`: Admin dashboard and the single Admin notification center (auto-refreshes notifications every 30 seconds)
- `materials.html`: Materials
- `stock.html`: Stock history
- `suppliers.html`: Supplier management and supply requests
- `supplier-login.html`: Supplier login
- `supplier-dashboard.html`: Supplier request inbox and response page

## 5. Supplier request and delivery flow

1. Admin opens **Suppliers → Supplier Restocking** and selects a supplier, material, quantity, and required-by date.
2. The request is saved to PostgreSQL with status `PENDING`. Inventory is not changed.
3. The assigned Supplier signs in and sees the request in their own inbox.
4. The Supplier chooses an expected delivery date and accepts, or rejects the request.
5. Admin sees the supplier's response and expected delivery date in the request history and dashboard notifications.
6. When stock physically arrives, Admin records the quantity received. Only that receipt creates an `IN` stock transaction and increases material quantity.
7. Partial receipts remain `PARTIALLY_RECEIVED`; the request becomes `COMPLETED` once the full requested quantity is received. A row-level database lock protects concurrent receipt attempts.

## Notes

- Expected delivery date is a supplier commitment; it does not increase inventory.
- Admin notifications are displayed on `dashboard.html` only. Page-level validation and success/error messages remain where users perform actions.
- The app derives dashboard notifications from current material and supply-request records. It does not currently persist a separate read/unread notification history.
- If the backend rejects login, confirm the environment variables match the credentials entered on the login page.
