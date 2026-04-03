-- 1. CLEANUP (Optional: Drops existing tables to start fresh)
DROP TABLE IF EXISTS CustodyLogs, QualityChecks, ComplianceRecords, TransportRoutes, ShipmentBatches, ProductComponents, Warehouses, Products, Suppliers CASCADE;

-- 2. CORE ENTITIES
CREATE TABLE Suppliers (
    supplier_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    certification_status VARCHAR(100),
    compliance_rating INTEGER CHECK (compliance_rating BETWEEN 1 AND 5)
);

CREATE TABLE Products (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    supplier_id INTEGER REFERENCES Suppliers(supplier_id)
);

CREATE TABLE Warehouses (
    warehouse_id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    location VARCHAR(255),
    capacity INTEGER
);

-- 3. PROVENANCE (Recursive Logic)
CREATE TABLE ProductComponents (
    parent_id INTEGER REFERENCES Products(product_id),
    component_id INTEGER REFERENCES Products(product_id),
    quantity INTEGER DEFAULT 1,
    relationship_type VARCHAR(50),
    PRIMARY KEY (parent_id, component_id)
);

-- 4. LOGISTICS & BATCHING
CREATE TABLE ShipmentBatches (
    batch_id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES Products(product_id),
    quantity INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending'
);

CREATE TABLE TransportRoutes (
    route_id SERIAL PRIMARY KEY,
    origin VARCHAR(100),
    destination VARCHAR(100),
    carrier VARCHAR(100),
    estimated_days INTEGER
);

-- 5. COMPLIANCE & CUSTODY
CREATE TABLE QualityChecks (
    check_id SERIAL PRIMARY KEY,
    batch_id INTEGER REFERENCES ShipmentBatches(batch_id),
    inspector_name VARCHAR(100),
    status VARCHAR(20) CHECK (status IN ('Pass', 'Fail', 'Pending')),
    remarks TEXT,
    inspection_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ComplianceRecords (
    record_id SERIAL PRIMARY KEY,
    supplier_id INTEGER REFERENCES Suppliers(supplier_id),
    regulation_name VARCHAR(255),
    status VARCHAR(20),
    expiry_date DATE
);

CREATE TABLE CustodyLogs (
    custody_id SERIAL PRIMARY KEY,
    batch_id INTEGER REFERENCES ShipmentBatches(batch_id),
    handler_entity VARCHAR(100),
    action_type VARCHAR(50),
    action_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. SAMPLE DATA SEEDING
-- Seed Suppliers
INSERT INTO Suppliers (name, location, certification_status, compliance_rating)
VALUES ('Apex Electronics', 'Taipei, TW', 'ISO 14001', 5),
       ('Global Logistics Co', 'Singapore', 'TAPA Certified', 4),
       ('Silicon Source', 'San Jose, USA', 'ISO 9001', 5);

-- Seed Products
INSERT INTO Products (name, category, supplier_id)
VALUES ('Smart Thermostat X1', 'Consumer Electronics', 1),
       ('Temperature Sensor v2', 'Components', 3),
       ('Wifi Module', 'Components', 1);

-- Seed Components (Thermostat is made of Sensor and Wifi Module)
INSERT INTO ProductComponents (parent_id, component_id, quantity, relationship_type)
VALUES (1, 2, 1, 'Assembly'), (1, 3, 1, 'Integration');

-- Seed Batches
INSERT INTO ShipmentBatches (product_id, quantity, status) 
VALUES (1, 500, 'In Transit'), (2, 1000, 'Warehouse');

-- Seed Quality Checks
INSERT INTO QualityChecks (batch_id, inspector_name, status, remarks)
VALUES (1, 'Dr. Aris', 'Pass', 'All units calibrated');

-- Seed Compliance
INSERT INTO ComplianceRecords (supplier_id, regulation_name, status, expiry_date)
VALUES (1, 'RoHS Directive', 'Compliant', '2027-12-31');

-- Seed Custody Logs
INSERT INTO CustodyLogs (batch_id, handler_entity, action_type) 
VALUES (1, 'Apex Electronics', 'Dispatched'), (1, 'Global Logistics Co', 'Received');