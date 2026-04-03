import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import ProvenanceTree from "@/components/ProvenanceTree";
import { Search } from "lucide-react";

export default function ProvenancePage() {
  const [productId, setProductId] = useState<number | null>(null);
  const [inputVal, setInputVal] = useState("");

  const products = useQuery({ queryKey: ["products"], queryFn: api.products });
  const provenance = useQuery({
    queryKey: ["provenance", productId],
    queryFn: () => api.provenance(productId!),
    enabled: productId !== null,
  });

  const handleSearch = () => {
    const id = parseInt(inputVal);
    if (!isNaN(id)) setProductId(id);
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold neon-text tracking-wider">
          PROVENANCE TRACER
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Trace the component tree of any product
        </p>
      </div>

      <div className="glass-panel p-4">
        <div className="flex gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Enter Product ID..."
              className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-border rounded-md text-sm font-display text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-5 py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-display font-bold tracking-wider hover:bg-primary/90 transition-colors"
          >
            TRACE
          </button>
        </div>

        {products.data && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {products.data.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setProductId(p.id);
                  setInputVal(String(p.id));
                }}
                className={`px-3 py-1 text-xs font-display rounded border transition-colors ${
                  productId === p.id
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-border bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                #{p.id} — {p.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="glass-panel p-6" style={{ minHeight: 500 }}>
        {provenance.isLoading && (
          <div className="flex items-center justify-center h-96">
            <span className="text-muted-foreground font-display text-sm animate-pulse-neon">
              Loading provenance data...
            </span>
          </div>
        )}
        {provenance.isError && (
          <div className="flex items-center justify-center h-96">
            <span className="text-neon-red font-display text-sm">
              Failed to load provenance — ensure API is running at localhost:4567
            </span>
          </div>
        )}
        {provenance.data && <ProvenanceTree data={provenance.data} />}
        {!productId && (
          <div className="flex items-center justify-center h-96">
            <span className="text-muted-foreground font-display text-sm">
              Select a product to trace its provenance
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
