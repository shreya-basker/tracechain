# 📦 TraceChain: 3-Tier Supply Chain Provenance System

TraceChain is a full-stack supply chain management platform designed to track product provenance, warehouse movements, and compliance logs using a robust **3-Tier Architecture**.



---

## 🏗️ System Architecture

### 1. Presentation Tier (Frontend)
- **Tech:** React, Vite, Tailwind CSS, Lucide Icons.
- **Role:** Provides a real-time dashboard, provenance tracer tree, and supplier registry.

### 2. Logic Tier (Backend)
- **Tech:** Java, Spark Framework, Gson, JDBC.
- **Role:** Handles API routing, recursive SQL logic for product tracing, and JSON data serialization.

### 3. Data Tier (Database)
- **Tech:** PostgreSQL.
- **Role:** Stores 9 relational tables including Suppliers, Products, Batches, and Custody Logs.

---

## 🚀 Getting Started

### 1. Database Setup
1. Open **pgAdmin** or your SQL terminal.
2. Create a database named `tracechain`.
3. Run the script located in `/db/schema.sql` to create tables and seed sample data.

### 2. Backend Setup
1. Navigate to the `backend/` folder.
2. Open `DatabaseManager.java` and update the `DB_URL`, `USER`, and `PASS` to match your local PostgreSQL credentials.
3. Run `App.java`. The server will start on `http://localhost:4567`.

### 3. Frontend Setup
1. Navigate to the `frontend/` folder.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to launch the dashboard on `http://localhost:8081`.

---

## 🛠️ Key Features
- **Provenance Tracer:** Uses recursive SQL to find all sub-components of a finished product.
- **Chain of Custody:** Real-time tracking of batch movements across warehouses.
- **Compliance Registry:** Automated status tracking for supplier certifications (RoHS, ISO).
- **Interactive Dashboard:** High-level metrics for active shipments and quality pass rates.

---

## 📁 Project Structure
```text
tracechain/
├── backend/          # Java Logic Tier
├── frontend/         # React Presentation Tier
├── db/               # SQL Data Tier (schema.sql)
└── .gitignore        # Root-level git rules
