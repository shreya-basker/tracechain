import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ArrowDown, Package, Warehouse } from "lucide-react";

export default function CustodyPage() {
  const [batchId, setBatchId] = useState<number | null>(null);
  const custody = useQuery({ queryKey: ["custody"], queryFn: api.custody });
  const batches = useQuery({ queryKey: ["batches"], queryFn: api.batches });
  const warehouses = useQuery({ queryKey: ["warehouses"], queryFn: api.warehouses });

  const warehouseMap = new Map(warehouses.data?.map((w) => [w.id, w.name]) ?? []);

  const filteredLogs = batchId
    ? custody.data?.filter((c) => c.batch_id === batchId) ?? []
    : custody.data ?? [];

  const sortedLogs = [...filteredLogs].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold neon-text tracking-wider">
          CHAIN OF CUSTODY
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track batch movements across warehouses
        </p>
      </div>

      <div className="glass-panel p-4">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setBatchId(null)}
            className={`px-3 py-1.5 text-xs font-display rounded border transition-colors ${
              batchId === null
                ? "border-primary/50 bg-primary/10 text-primary"
                : "border-border bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            ALL BATCHES
          </button>
          {batches.data?.map((b) => (
            <button
              key={b.id}
              onClick={() => setBatchId(b.id)}
              className={`px-3 py-1.5 text-xs font-display rounded border transition-colors ${
                batchId === b.id
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-border bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              Batch #{b.id}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-panel p-6">
        {sortedLogs.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            No custody data — connect your API at localhost:4567
          </p>
        )}

        <div className="relative">
          {sortedLogs.length > 1 && (
            <div className="absolute left-5 top-6 bottom-6 w-px bg-border" />
          )}

          <div className="space-y-6">
            {sortedLogs.map((log, i) => (
              <div key={log.id} className="relative flex items-start gap-4 pl-2">
                <div className="relative z-10 w-7 h-7 rounded-full bg-card border-2 border-primary/50 flex items-center justify-center flex-shrink-0">
                  {log.action === "RECEIVED" ? (
                    <Warehouse className="w-3 h-3 text-primary" />
                  ) : (
                    <Package className="w-3 h-3 text-neon-amber" />
                  )}
                </div>
                <div className="flex-1 bg-secondary/30 border border-border rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className={`text-xs font-display font-bold ${
                        log.action === "RECEIVED" ? "text-primary" : "text-neon-amber"
                      }`}>
                        {log.action}
                      </span>
                      <p className="text-sm text-foreground mt-0.5 font-display">
                        Batch #{log.batch_id} — {warehouseMap.get(log.warehouse_id) || `Warehouse #${log.warehouse_id}`}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground font-display">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Handler: {log.handler}
                  </p>
                </div>
                {i < sortedLogs.length - 1 && (
                  <ArrowDown className="absolute left-[14px] -bottom-4 w-3 h-3 text-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
