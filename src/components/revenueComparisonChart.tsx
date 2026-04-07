"use client";

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

export interface RevenueDataPoint {
  dayIndex: number;
  value: number;
  date: string;
}

export interface RevenueProps {
  current: RevenueDataPoint[];
  previous: RevenueDataPoint[];
}

export const RevenueComparisonChart = ({ current, previous }: RevenueProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || current.length === 0) return;

    // --- 2. DIMENSIONS & MARGINS ---
    const margin = { top: 30, right: 30, bottom: 50, left: 70 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = 350 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // --- 3. SCALES ---
    const maxDays = Math.max(current.length, previous.length);
    const x = d3.scaleLinear().domain([0, maxDays - 1]).range([0, width]);
    
    const maxValue = d3.max([...current, ...previous], d => d.value) || 100;
    const y = d3.scaleLinear()
      .domain([0, maxValue * 1.1]) // 10% padding at top
      .range([height, 0]);

    // --- 4. AXES ---
    // X Axis
    const xAxis = d3.axisBottom(x)
      .ticks(Math.min(maxDays, 10))
      .tickFormat(d => `Day ${Number(d) + 1}`);

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .attr("class", "text-slate-400 font-medium text-[10px]")
      .call(xAxis)
      .call(g => g.select(".domain").attr("stroke", "#e2e8f0"));

    // Y Axis (Currency Format)
    const yAxis = d3.axisLeft(y)
      .ticks(5)
      .tickFormat(d => `$${d3.format(".2s")(d)}`);

    g.append("g")
      .attr("class", "text-slate-400 font-medium text-[10px]")
      .call(yAxis)
      .call(g => g.select(".domain").attr("stroke", "none"));

    // --- 5. GRID LINES ---
    g.append("g")
      .attr("class", "grid-lines stroke-slate-100")
      .call(d3.axisLeft(y).ticks(5).tickSize(-width).tickFormat(() => ""));

    // --- 6. LINE GENERATOR ---
    const lineGenerator = d3.line<RevenueDataPoint>()
      .x(d => x(d.dayIndex))
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX);

    // Draw Previous (Dashed Grey)
    if (previous.length > 0) {
      g.append("path")
        .datum(previous)
        .attr("fill", "none")
        .attr("stroke", "#cbd5e1")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "5,5")
        .attr("d", lineGenerator);
    }

    // Draw Current (Solid Blue)
    g.append("path")
      .datum(current)
      .attr("fill", "none")
      .attr("stroke", "#3b82f6")
      .attr("stroke-width", 3)
      .attr("d", lineGenerator);

    // --- 7. HOVER OVERLAY SYSTEM ---
    const focus = g.append("g").style("display", "none");

    // Snapping vertical line
    focus.append("line")
      .attr("class", "stroke-slate-300")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "3,3")
      .attr("y1", 0)
      .attr("y2", height);

    // Snapping dots
    const dotCurrent = focus.append("circle").attr("r", 5).attr("fill", "#3b82f6").attr("stroke", "white").attr("stroke-width", 2);
    const dotPrevious = focus.append("circle").attr("r", 5).attr("fill", "#94a3b8").attr("stroke", "white").attr("stroke-width", 2);

    // Catch-all invisible rectangle for mouse tracking
    g.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "transparent")
      .on("mouseover", () => focus.style("display", null))
      .on("mouseout", () => {
        focus.style("display", "none");
        if (tooltipRef.current) tooltipRef.current.style.opacity = "0";
      })
      .on("mousemove", function(event) {
        const [mouseX] = d3.pointer(event);
        const index = Math.round(x.invert(mouseX));
        
        if (index >= 0 && index < maxDays) {
          const dCurr = current[index];
          const dPrev = previous[index];
          const xPos = x(index);

          // Update focus line position
          focus.select("line").attr("x1", xPos).attr("x2", xPos);
          
          // Position dots on the lines
          if (dCurr) dotCurrent.attr("cx", xPos).attr("cy", y(dCurr.value)).style("display", null);
          else dotCurrent.style("display", "none");

          if (dPrev) dotPrevious.attr("cx", xPos).attr("cy", y(dPrev.value)).style("display", null);
          else dotPrevious.style("display", "none");

          // Update tooltip position and content
          if (tooltipRef.current) {
            tooltipRef.current.style.opacity = "1";
            tooltipRef.current.style.left = `${event.pageX + 15}px`;
            tooltipRef.current.style.top = `${event.pageY - 60}px`;
            tooltipRef.current.innerHTML = `
              <div class="space-y-1.5 min-w-[120px]">
                <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Day ${index + 1}</div>
                <div class="flex justify-between items-center gap-4">
                  <span class="flex items-center gap-1.5 text-slate-700">
                    <div class="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Current
                  </span>
                  <span class="font-bold">$${dCurr?.value.toLocaleString() || 0}</span>
                </div>
                <div class="flex justify-between items-center gap-4">
                  <span class="flex items-center gap-1.5 text-slate-400">
                    <div class="w-1.5 h-1.5 rounded-full bg-slate-300"></div> Previous
                  </span>
                  <span class="font-bold text-slate-500">$${dPrev?.value.toLocaleString() || 0}</span>
                </div>
              </div>
            `;
          }
        }
      });

  }, [current, previous]);

  return (
    <div className="relative w-full overflow-visible">
      <div className="overflow-x-auto overflow-y-hidden">
        <svg 
          ref={svgRef} 
          className="w-full min-w-[600px]" 
          style={{ height: "350px" }} 
        />
      </div>
      {/* Floating Tooltip */}
      <div 
        ref={tooltipRef} 
        className="fixed pointer-events-none opacity-0 bg-white/95 backdrop-blur-md border border-slate-200 shadow-2xl p-3 rounded-md text-[11px] z-[999] transition-opacity duration-150"
      />
    </div>
  );
};