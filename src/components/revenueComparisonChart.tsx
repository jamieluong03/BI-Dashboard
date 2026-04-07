import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

export interface RevenueProps {
  current: any[];
  previous: any[];
}

export const RevenueComparisonChart = ({ current, previous }: RevenueProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !current.length) return;

    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    // 1. Scales
    // We use dayIndex so that Day 1 of March aligns with Day 1 of February
    const maxDays = Math.max(current.length, previous.length);
    const x = d3.scaleLinear().domain([0, maxDays - 1]).range([0, width]);
    const y = d3.scaleLinear()
      .domain([0, d3.max([...current, ...previous], d => d.value) * 1.1])
      .range([height, 0]);

    // 2. Line Generators
    const line = d3.line<any>()
      .x(d => x(d.dayIndex))
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX);

    // 3. Draw Previous Period (Dashed Grey)
    g.append("path")
      .datum(previous)
      .attr("fill", "none")
      .attr("stroke", "#cbd5e1")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "4,4")
      .attr("d", line);

    // 4. Draw Current Period (Solid Blue)
    g.append("path")
      .datum(current)
      .attr("fill", "none")
      .attr("stroke", "#3b82f6")
      .attr("stroke-width", 3)
      .attr("d", line);

    // 5. Synced Hover Interaction
    const hoverLine = g.append("line")
      .attr("stroke", "#94a3b8")
      .attr("stroke-width", 1)
      .attr("y1", 0)
      .attr("y2", height)
      .style("opacity", 0);

    const overlay = g.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "transparent")
      .on("mousemove", (event) => {
        const [mouseX] = d3.pointer(event);
        const index = Math.round(x.invert(mouseX));
        
        if (index >= 0 && index < maxDays) {
          const currPoint = current[index];
          const prevPoint = previous[index];

          hoverLine.attr("x1", x(index)).attr("x2", x(index)).style("opacity", 1);

          d3.select(tooltipRef.current)
            .style("opacity", 1)
            .style("left", `${event.pageX + 15}px`)
            .style("top", `${event.pageY - 50}px`)
            .html(`
              <div class="text-[10px] font-bold text-slate-400 mb-1">DAY ${index + 1}</div>
              <div class="flex justify-between gap-4">
                <span class="text-blue-500 font-bold">Current:</span>
                <span>$${currPoint?.value.toLocaleString() || 0}</span>
              </div>
              <div class="flex justify-between gap-4">
                <span class="text-slate-400 font-bold">Previous:</span>
                <span>$${prevPoint?.value.toLocaleString() || 0}</span>
              </div>
            `);
        }
      })
      .on("mouseleave", () => {
        hoverLine.style("opacity", 0);
        d3.select(tooltipRef.current).style("opacity", 0);
      });

  }, [current, previous]);

  return (
    <div className="relative w-full">
      <svg ref={svgRef} className="w-full h-[250px]" />
      <div 
        ref={tooltipRef} 
        className="fixed pointer-events-none opacity-0 bg-white border border-slate-200 shadow-xl p-3 rounded-lg text-xs z-[100] transition-opacity"
      />
    </div>
  );
};