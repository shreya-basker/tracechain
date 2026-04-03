package backend;

public class Supplier {
    public int supplier_id;
    public String name;
    public String location;
    public String certification_status;
    public int compliance_rating;
    public Supplier(int id, String n, String l, String c, int r) {
        this.supplier_id = id;
        this.name = n;
        this.location = l;
        this.certification_status = c;
        this.compliance_rating = r;
    }
}