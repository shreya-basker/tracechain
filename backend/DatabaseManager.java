package backend;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class DatabaseManager {
    private static final String URL = "jdbc:postgresql://localhost:5432/tracechain";
    private static final String USER = "postgres";
    private static final String PASS = "admin@123";

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASS);
    }

    public static List<Supplier> getAllSuppliers() {
        List<Supplier> list = new ArrayList<>();
        String sql = "SELECT * FROM Suppliers";
        try (Connection conn = getConnection(); Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                list.add(new Supplier(rs.getInt("supplier_id"), rs.getString("name"), rs.getString("location"), rs.getString("certification_status"), rs.getInt("compliance_rating")));
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return list;
    }

    public static List<CustodyLog> getCustodyLogs() {
        List<CustodyLog> list = new ArrayList<>();
        String sql = "SELECT * FROM CustodyLogs";
        try (Connection conn = getConnection(); Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                list.add(new CustodyLog(rs.getInt("custody_id"), rs.getInt("batch_id"), rs.getString("handler_entity"), rs.getString("action_type"), rs.getTimestamp("action_timestamp").toString()));
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return list;
    }

    public static List<QualityCheck> getQualityChecks() {
        List<QualityCheck> list = new ArrayList<>();
        String sql = "SELECT * FROM QualityChecks";
        try (Connection conn = getConnection(); Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                list.add(new QualityCheck(rs.getInt("check_id"), rs.getInt("batch_id"), rs.getString("status"), rs.getString("inspector_name"), rs.getString("remarks"), rs.getTimestamp("inspection_date").toString()));
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return list;
    }

    public static List<String> getRecursiveData(String productId) {
        List<String> results = new ArrayList<>();
        String sql = "WITH RECURSIVE provenance AS (" +
                     "  SELECT parent_id, component_id FROM ProductComponents WHERE parent_id = ? " +
                     "  UNION ALL " +
                     "  SELECT pc.parent_id, pc.component_id FROM ProductComponents pc " +
                     "  JOIN provenance p ON pc.parent_id = p.component_id" +
                     ") SELECT component_id FROM provenance";
        try (Connection conn = getConnection(); PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setInt(1, Integer.parseInt(productId));
            ResultSet rs = pstmt.executeQuery();
            while (rs.next()) { results.add(rs.getString("component_id")); }
        } catch (Exception e) { e.printStackTrace(); }
        return results;
    }
    public static List<ComplianceRecord> getComplianceRecords() {
    List<ComplianceRecord> list = new ArrayList<>();
    String sql = "SELECT * FROM ComplianceRecords";
    try (Connection conn = getConnection(); Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {
        while (rs.next()) {
            list.add(new ComplianceRecord(
                rs.getInt("record_id"),
                rs.getInt("supplier_id"),
                rs.getString("regulation_name"),
                rs.getString("status"),
                rs.getDate("expiry_date").toString()
            ));
        }
    } catch (SQLException e) { e.printStackTrace(); }
    return list;
}
}
class CustodyLog {
    public int custody_id, batch_id;
    public String location; // Rename handler_entity to location
    public String action_type, timestamp;

    public CustodyLog(int id, int bid, String loc, String type, String time) {
        this.custody_id = id; 
        this.batch_id = bid; 
        this.location = loc; // Map handler_entity from DB to location for JSON
        this.action_type = type; 
        this.timestamp = time;
    }
}
class ComplianceRecord {
    public int record_id;
    public int supplier_id; // Added this
    public String regulation_name;
    public String status;
    public String expiry_date;

    public ComplianceRecord(int id, int sid, String reg, String s, String expiry) {
        this.record_id = id;
        this.supplier_id = sid;
        this.regulation_name = reg;
        this.status = s;
        this.expiry_date = expiry;
    }
}