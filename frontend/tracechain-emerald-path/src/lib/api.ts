const BASE_URL = 'http://localhost:4567/api';

async function fetchApi<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export interface Supplier {
  id: number;
  name: string;
  location: string;
  compliance_rating: number;
  contact_email: string;
  certified: boolean;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  supplier_id: number;
}

export interface Component {
  id: number;
  name: string;
  product_id: number;
  parent_component_id: number | null;
  supplier_id: number;
  material: string;
}

export interface Batch {
  id: number;
  product_id: number;
  manufacture_date: string;
  quantity: number;
  status: string;
}

export interface Warehouse {
  id: number;
  name: string;
  location: string;
  capacity: number;
}

export interface Route {
  id: number;
  origin_warehouse_id: number;
  destination_warehouse_id: number;
  transport_mode: string;
  estimated_days: number;
}

export interface QualityRecord {
  id: number;
  batch_id: number;
  inspection_date: string;
  result: 'PASS' | 'FAIL';
  inspector: string;
  notes: string;
}

export interface ComplianceRecord {
  id: number;
  supplier_id: number;
  regulation: string;
  status: string;
  audit_date: string;
  expiry_date: string;
}

export interface CustodyLog {
  id: number;
  batch_id: number;
  warehouse_id: number;
  action: string;
  timestamp: string;
  handler: string;
}

export interface ProvenanceNode {
  id: number;
  name: string;
  material?: string;
  supplier?: string;
  children?: ProvenanceNode[];
}

export const api = {
  suppliers: () => fetchApi<Supplier[]>('/suppliers'),
  products: () => fetchApi<Product[]>('/products'),
  components: () => fetchApi<Component[]>('/components'),
  batches: () => fetchApi<Batch[]>('/batches'),
  warehouses: () => fetchApi<Warehouse[]>('/warehouses'),
  routes: () => fetchApi<Route[]>('/routes'),
  quality: () => fetchApi<QualityRecord[]>('/quality'),
  compliance: () => fetchApi<ComplianceRecord[]>('/compliance'),
  custody: () => fetchApi<CustodyLog[]>('/custody'),
  provenance: (productId: number) => fetchApi<ProvenanceNode>(`/provenance/${productId}`),
};
