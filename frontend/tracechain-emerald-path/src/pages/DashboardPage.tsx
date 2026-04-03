import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import MetricCard from "@/components/MetricCard";
import { Box, ShieldCheck, Truck, Building2, AlertTriangle, CheckCircle } from "lucide-react";

export default function DashboardPage() {
  const batches = useQuery({ queryKey: ["batches"], queryFn: api.batches });
  const quality = useQuery({ queryKey: ["quality"], queryFn: api.quality });
  const custody = useQuery({ queryKey: ["custody"], queryFn: api.custody });
  const suppliers = useQuery({ queryKey: ["suppliers"], queryFn: api.suppliers });

  const totalBatches = batches.data?.length ?? 0;
  const passRate = quality.data
    ? Math.round((quality.data.filter((q) => q.result === "PASS").length / quality.data.length) * 100)
    : 0;
  const activeShipments = custody.data?.filter((c) => c.action === "DISPATCHED").length ?? 0;
  const totalSuppliers = suppliers.data?.length ?? 0;

  const recentQuality = quality.data?.slice(-5).reverse() ?? [];
  const recentCustody = custody.data?.slice(-5).reverse() ?? [];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold neon-text tracking-wider">
          DASHBOARD
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Supply chain overview and real-time metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Batches"
          value={totalBatches}
          subtitle="Active production"
          icon={<Box className="w-5 h-5" />}
          variant="default"
        />
        <MetricCard
          title="Quality Pass Rate"
          value={`${passRate}%`}
          subtitle="Inspection results"
          icon={<ShieldCheck className="w-5 h-5" />}
          variant="success"
        />
        <MetricCard
          title="Active Shipments"
          value={activeShipments}
          subtitle="In transit"
          icon={<Truck className="w-5 h-5" />}
          variant="warning"
        />
        <MetricCard
          title="Suppliers"
          value={totalSuppliers}
          subtitle="Registered partners"
          icon={<Building2 className="w-5 h-5" />}
          variant="default"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Quality Inspections */}
        <div className="glass-panel p-6">
          <h2 className="text-xs font-display tracking-widest uppercase text-muted-foreground mb-4">
            Recent Inspections
          </h2>
          <div className="space-y-3">
            {recentQuality.length === 0 && (
              <p className="text-sm text-muted-foreground">No data — connect your API at localhost:4567</p>
            )}
            {recentQuality.map((q) => (
              <div key={q.id} className="flex items-center justify-between p-3 rounded-md bg-secondary/50 border border-border">
                <div className="flex items-center gap-3">
                  {q.result === "PASS" ? (
                    <CheckCircle className="w-4 h-4 text-primary" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-neon-red" />
                  )}
                  <div>
                    <p className="text-sm font-display">Batch #{q.batch_id}</p>
                    <p className="text-xs text-muted-foreground">{q.inspector}</p>
                  </div>
                </div>
                <span className={`text-xs font-display font-bold ${q.result === "PASS" ? "status-pass" : "status-fail"}`}>
                  {q.result}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Custody Movements */}
        <div className="glass-panel p-6">
          <h2 className="text-xs font-display tracking-widest uppercase text-muted-foreground mb-4">
            Recent Movements
          </h2>
          <div className="space-y-3">
            {recentCustody.length === 0 && (
              <p className="text-sm text-muted-foreground">No data — connect your API at localhost:4567</p>
            )}
            {recentCustody.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-3 rounded-md bg-secondary/50 border border-border">
                <div>
                  <p className="text-sm font-display">Batch #{c.batch_id}</p>
                  <p className="text-xs text-muted-foreground">
                    {c.action} — {c.handler}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground font-display">
                  {new Date(c.timestamp).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
