package backend;

import static spark.Spark.*;
import com.google.gson.Gson;

public class App {
    public static void main(String[] args) {
        port(4567);

        options("/*", (request, response) -> {
            String accessControlRequestHeaders = request.headers("Access-Control-Request-Headers");
            if (accessControlRequestHeaders != null) {
                response.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
            }
            String accessControlRequestMethod = request.headers("Access-Control-Request-Method");
            if (accessControlRequestMethod != null) {
                response.header("Access-Control-Allow-Methods", accessControlRequestMethod);
            }
            return "OK";
        });

        before((request, response) -> {
            response.header("Access-Control-Allow-Origin", "*");
            response.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
            response.header("Access-Control-Allow-Headers", "*");
            response.type("application/json");
        });

        get("/suppliers", (req, res) -> new Gson().toJson(DatabaseManager.getAllSuppliers()));
        get("/api/suppliers", (req, res) -> new Gson().toJson(DatabaseManager.getAllSuppliers()));

        get("/custody", (req, res) -> new Gson().toJson(DatabaseManager.getCustodyLogs()));
        get("/api/custody", (req, res) -> new Gson().toJson(DatabaseManager.getCustodyLogs()));

        get("/quality", (req, res) -> new Gson().toJson(DatabaseManager.getQualityChecks()));
        get("/api/quality", (req, res) -> new Gson().toJson(DatabaseManager.getQualityChecks()));

        get("/provenance/:id", (req, res) -> {
            String id = req.params(":id");
            return new Gson().toJson(DatabaseManager.getRecursiveData(id));
        });
        
        get("/api/provenance/:id", (req, res) -> {
            String id = req.params(":id");
            return new Gson().toJson(DatabaseManager.getRecursiveData(id));
        });
        get("/compliance", (req, res) -> new Gson().toJson(DatabaseManager.getComplianceRecords()));
        get("/api/compliance", (req, res) -> new Gson().toJson(DatabaseManager.getComplianceRecords()));
    }
}