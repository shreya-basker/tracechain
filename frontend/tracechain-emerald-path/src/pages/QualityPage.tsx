import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { CheckCircle, AlertTriangle, FileText, Shield } from "lucide-react";

export default function QualityPage() {
  const quality = useQuery({ queryKey: ["quality"], queryFn: api.quality });
  const compliance = useQuery({ queryKey: ["compliance"], queryFn: api.compliance });
  const suppliers = useQuery({ queryKey: ["suppliers"], queryFn: api.suppliers });

  const supplierMap = new Map(suppliers.data?.map((s) => [s.id, s.name]) ?? []);

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold neon-text tracking-wider">
          QUALITY & COMPLIANCE
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Inspection results and regulatory audit logs
        </p>
      </div>

      {/* Quality Inspections */}
      <div>
        <h2 className="text-xs font-display tracking-widest uppercase text-muted-foreground mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4" /> Quality Inspections
        </h2>
        <div className="glass-panel overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-[10px] font-display tracking-widest uppercase text-muted-foreground">ID</th>
                <th className="text-left p-4 text-[10px] font-display tracking-widest uppercase text-muted-foreground">Batch</th>
                <th className="text-left p-4 text-[10px] font-display tracking-widest uppercase text-muted-foreground">Date</th>
                <th className="text-left p-4 text-[10px] font-display tracking-widest uppercase text-muted-foreground">Result</th>
                <th className="text-left p-4 text-[10px] font-display tracking-widest uppercase text-muted-foreground">Inspector</th>
                <th className="text-left p-4 text-[10px] font-display tracking-widest uppercase text-muted-foreground">Notes</th>
              </tr>
            </thead>
            <tbody>
              {!quality.data && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-sm text-muted-foreground">
                    No data — connect your API at localhost:4567
                  </td>
                </tr>
              )}
              {quality.data?.map((q) => (
                <tr key={q.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="p-4 text-sm font-display text-muted-foreground">#{q.id}</td>
                  <td className="p-4 text-sm font-display">Batch #{q.batch_id}</td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {new Date(q.inspection_date).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-display font-bold ${
                      q.result === "PASS"
                        ? "bg-primary/10 text-primary"
                        : "bg-neon-red/10 text-neon-red"
                    }`}>
                      {q.result === "PASS" ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                      {q.result}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{q.inspector}</td>
                  <td className="p-4 text-sm text-muted-foreground max-w-xs truncate">{q.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compliance Audit Logs */}
      <div>
        <h2 className="text-xs font-display tracking-widest uppercase text-muted-foreground mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4" /> Compliance Audit Logs
        </h2>
        <div className="glass-panel overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-[10px] font-display tracking-widest uppercase text-muted-foreground">ID</th>
                <th className="text-left p-4 text-[10px] font-display tracking-widest uppercase text-muted-foreground">Supplier</th>
                <th className="text-left p-4 text-[10px] font-display tracking-widest uppercase text-muted-foreground">Regulation</th>
                <th className="text-left p-4 text-[10px] font-display tracking-widest uppercase text-muted-foreground">Status</th>
                <th className="text-left p-4 text-[10px] font-display tracking-widest uppercase text-muted-foreground">Audit Date</th>
                <th className="text-left p-4 text-[10px] font-display tracking-widest uppercase text-muted-foreground">Expiry</th>
              </tr>
            </thead>
            <tbody>
              {!compliance.data && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-sm text-muted-foreground">
                    No data — connect your API at localhost:4567
                  </td>
                </tr>
              )}
              {compliance.data?.map((c) => (
                <tr key={c.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="p-4 text-sm font-display text-muted-foreground">#{c.id}</td>
                  <td className="p-4 text-sm font-display font-medium text-foreground">
                    {supplierMap.get(c.supplier_id) || `Supplier #${c.supplier_id}`}
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{c.regulation}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-display font-bold ${
                      c.status === "COMPLIANT"
                        ? "bg-primary/10 text-primary"
                        : c.status === "PENDING"
                        ? "bg-neon-amber/10 text-neon-amber"
                        : "bg-neon-red/10 text-neon-red"
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {new Date(c.audit_date).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {new Date(c.expiry_date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
