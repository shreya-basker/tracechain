import { useEffect, useRef } from "react";
import * as d3 from "d3";
import type { ProvenanceNode } from "@/lib/api";

interface Props {
  data: ProvenanceNode;
}

export default function ProvenanceTree({ data }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const margin = { top: 40, right: 120, bottom: 40, left: 120 };

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const treeLayout = d3
      .tree<ProvenanceNode>()
      .size([height - margin.top - margin.bottom, width - margin.left - margin.right]);

    const root = d3.hierarchy(data);
    const treeData = treeLayout(root);

    // Links
    g.selectAll(".link")
      .data(treeData.links())
      .join("path")
      .attr("class", "link")
      .attr("fill", "none")
      .attr("stroke", "hsl(155, 80%, 45%)")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5)
      .attr(
        "d",
        d3
          .linkHorizontal<d3.HierarchyPointLink<ProvenanceNode>, d3.HierarchyPointNode<ProvenanceNode>>()
          .x((d) => d.y)
          .y((d) => d.x) as any
      );

    // Nodes
    const nodes = g
      .selectAll(".node")
      .data(treeData.descendants())
      .join("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.y},${d.x})`);

    nodes
      .append("circle")
      .attr("r", 6)
      .attr("fill", "hsl(220, 18%, 13%)")
      .attr("stroke", "hsl(155, 80%, 45%)")
      .attr("stroke-width", 2);

    nodes
      .append("text")
      .attr("dy", -12)
      .attr("text-anchor", "middle")
      .attr("fill", "hsl(160, 10%, 85%)")
      .attr("font-size", "11px")
      .attr("font-family", "var(--font-display)")
      .text((d) => d.data.name);

    nodes
      .append("text")
      .attr("dy", 20)
      .attr("text-anchor", "middle")
      .attr("fill", "hsl(220, 10%, 50%)")
      .attr("font-size", "9px")
      .attr("font-family", "var(--font-display)")
      .text((d) => d.data.material || d.data.supplier || "");
  }, [data]);

  return (
    <svg
      ref={svgRef}
      className="w-full h-full min-h-[400px]"
      style={{ background: "transparent" }}
    />
  );
}
