import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { CheckCircle, XCircle } from "lucide-react";

export default function SuppliersPage() {
  const suppliers = useQuery({ queryKey: ["suppliers"], queryFn: api.suppliers });

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold neon-text tracking-wider">
          SUPPLIER REGISTRY
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Registered partners and compliance ratings
        </p>
      </div>

      <div className="glass-panel overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 text-[10px] font-display tracking-widest uppercase text-muted-foreground">ID</th>
              <th className="text-left p-4 text-[10px] font-display tracking-widest uppercase text-muted-foreground">Name</th>
              <th className="text-left p-4 text-[10px] font-display tracking-widest uppercase text-muted-foreground">Location</th>
              <th className="text-left p-4 text-[10px] font-display tracking-widest uppercase text-muted-foreground">Compliance</th>
              <th className="text-left p-4 text-[10px] font-display tracking-widest uppercase text-muted-foreground">Certified</th>
              <th className="text-left p-4 text-[10px] font-display tracking-widest uppercase text-muted-foreground">Contact</th>
            </tr>
          </thead>
          <tbody>
            {!suppliers.data && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-sm text-muted-foreground">
                  No data — connect your API at localhost:4567
                </td>
              </tr>
            )}
            {suppliers.data?.map((s) => (
              <tr key={s.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                <td className="p-4 text-sm font-display text-muted-foreground">#{s.id}</td>
                <td className="p-4 text-sm font-display font-medium text-foreground">{s.name}</td>
                <td className="p-4 text-sm text-muted-foreground">{s.location}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${s.compliance_rating}%`,
                          backgroundColor:
                            s.compliance_rating >= 80
                              ? "hsl(155, 80%, 45%)"
                              : s.compliance_rating >= 60
                              ? "hsl(38, 90%, 55%)"
                              : "hsl(0, 70%, 55%)",
                        }}
                      />
                    </div>
                    <span className="text-xs font-display text-muted-foreground">{s.compliance_rating}%</span>
                  </div>
                </td>
                <td className="p-4">
                  {s.certified ? (
                    <CheckCircle className="w-4 h-4 text-primary" />
                  ) : (
                    <XCircle className="w-4 h-4 text-neon-red" />
                  )}
                </td>
                <td className="p-4 text-sm text-muted-foreground">{s.contact_email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
