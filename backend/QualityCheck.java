package backend;
public class QualityCheck {
    public int check_id, batch_id;
    public String status, inspector_name, remarks, inspection_date;
    public QualityCheck(int id, int bid, String s, String name, String r, String date) {
        this.check_id = id; this.batch_id = bid; this.status = s; this.inspector_name = name; this.remarks = r; this.inspection_date = date;
    }
}