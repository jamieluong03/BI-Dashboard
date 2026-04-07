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
    const containerRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!svgRef.current || current.length === 0) return;

        const margin = { top: 20, right: 20, bottom: 100, left: 70 };
        const width = svgRef.current.clientWidth - margin.left - margin.right;
        const height = 350 - margin.top - margin.bottom;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // --- 2. SCALES ---
        const maxDays = Math.max(current.length, previous.length);
        const x = d3.scaleLinear().domain([0, maxDays - 1]).range([0, width]);
        const maxValue = d3.max([...current, ...previous], d => d.value) || 100;
        const y = d3.scaleLinear().domain([0, maxValue * 1.1]).range([height, 0]);

        // --- 3. AXES ---
        const xAxis = d3.axisBottom(x)
            .ticks(Math.min(maxDays, 8))
            .tickPadding(12)
            .tickFormat((d) => {
                const index = Number(d);
                const item = current[index] || previous[index];
                if (item && item.date) {
                    const [year, month, day] = item.date.split('-').map(Number);
                    return `${month}/${day}`;
                }
                return "";
            });

        const yAxis = d3.axisLeft(y)
            .ticks(5)
            .tickPadding(10)
            .tickFormat(d => `$${d3.format(".2s")(d)}`);

        // X Axis (The actual baseline)
        g.append("g")
            .attr("transform", `translate(0,${height})`)
            .attr("class", "text-slate-400 font-medium text-[10px]")
            .call(xAxis)
            .call(g => g.select(".domain")
                .attr("stroke", "#94a3b8")
                .attr("stroke-width", "1.5")
            );

        // Y Axis (Labels only)
        g.append("g")
            .attr("class", "text-slate-400 font-medium text-[10px]")
            .call(yAxis)
            .call(g => g.select(".domain").attr("display", "block"));

        // --- 4. LABELS (X and Y) ---
        // X-Axis Label
        g.append("text")
            .attr("text-anchor", "middle")
            .attr("x", width / 2)
            .attr("y", height + 50)
            .attr("class", "fill-slate-400 text-[10px] font-bold uppercase tracking-widest")
            .text("Days");

        // Y-Axis Label
        g.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left + 20)
            .attr("x", -height / 2)
            .attr("class", "fill-slate-400 text-[10px] font-bold uppercase tracking-widest")
            .text("Revenue ($)");

        // --- 5. GRID & LINES ---
        g.append("g")
            .attr("class", "grid-lines")
            .call(d3.axisLeft(y)
                .ticks(5)
                .tickSize(-width)
                .tickFormat(() => "")
            )
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line")
                .attr("stroke", "#f1f5f9e7")
                .attr("stroke-width", 1)
            );

        const line = d3.line<RevenueDataPoint>()
            .x(d => x(d.dayIndex))
            .y(d => y(d.value))
            .curve(d3.curveMonotoneX);

        if (previous.length > 0) {
            g.append("path").datum(previous).attr("fill", "none").attr("stroke", "#cbd5e1").attr("stroke-width", 2).attr("stroke-dasharray", "4,4").attr("d", line);
        }
        g.append("path").datum(current).attr("fill", "none").attr("stroke", "#3b82f6").attr("stroke-width", 3).attr("d", line);

        // --- 6. TOOLTIP OVERLAY ---
        const focus = g.append("g").style("display", "none");
        focus.append("line").attr("stroke", "#e2e8f0").attr("stroke-width", 1).attr("stroke-dasharray", "3,3").attr("y1", 0).attr("y2", height);
        const dotA = focus.append("circle").attr("r", 4).attr("fill", "#3b82f6").attr("stroke", "white").attr("stroke-width", 2);
        const dotB = focus.append("circle").attr("r", 4).attr("fill", "#94a3b8").attr("stroke", "white").attr("stroke-width", 2);

        g.append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr("fill", "transparent")
            .on("mouseover", () => focus.style("display", null))
            .on("mouseout", () => {
                focus.style("display", "none");
                if (tooltipRef.current) tooltipRef.current.style.opacity = "0";
            })
            .on("mousemove", function (event) {
                const [mX, mY] = d3.pointer(event);
                const index = Math.round(x.invert(mX));

                if (index >= 0 && index < maxDays) {
                    const dA = current[index];
                    const dB = previous[index];
                    const xPos = x(index);

                    // Update the vertical line and dots
                    focus.select("line").attr("x1", xPos).attr("x2", xPos);
                    if (dA) dotA.attr("cx", xPos).attr("cy", y(dA.value)).style("display", null);
                    else dotA.style("display", "none");

                    if (dB) dotB.attr("cx", xPos).attr("cy", y(dB.value)).style("display", null);
                    else dotB.style("display", "none");

                    // --- TOOLTIP UPDATE ---
                    if (tooltipRef.current) {
                        const item = dA || dB;
                        let dateLabel = "";

                        if (item && item.date) {
                            const [year, month, day] = item.date.split('-').map(Number);
                            dateLabel = `${month}/${day}`;
                        }

                        // 1. Show the tooltip
                        tooltipRef.current.style.opacity = "1";

                        // 2. Position it (Adjusting for margins and adding a slight offset)
                        tooltipRef.current.style.left = `${mX + margin.left + 15}px`;
                        tooltipRef.current.style.top = `${mY + margin.top - 10}px`;

                        // 3. Inject the HTML
                        tooltipRef.current.innerHTML = `
                            <div class="flex flex-col gap-1.5 min-w-[120px]">
                                <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1 mb-1">
                                    ${dateLabel}
                                </div>
                                
                                <div class="flex justify-between items-center gap-4">
                                    <span class="flex items-center gap-1.5 text-slate-700 font-medium">
                                        <div class="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Now
                                    </span>
                                    <span class="font-bold text-slate-900">
                                        $${dA?.value.toLocaleString() || "0"}
                                    </span>
                                </div>

                                <div class="flex justify-between items-center gap-4">
                                    <span class="flex items-center gap-1.5 text-slate-400 font-medium">
                                        <div class="w-1.5 h-1.5 rounded-full bg-slate-300"></div> Prev
                                    </span>
                                    <span class="font-bold text-slate-500">
                                        $${dB?.value.toLocaleString() || "0"}
                                    </span>
                                </div>
                            </div>
                        `;
                    }
                }
            });

    }, [current, previous]);

    return (
        <div ref={containerRef} className="relative w-full h-[350px] overflow-hidden bg-white">
            <div className="overflow-x-auto h-full scrollbar-hide">
                <svg
                    ref={svgRef}
                    className="w-full min-w-[650px] h-full"
                    style={{ display: "block" }}
                />
            </div>
            {/* Floating Tooltip */}
            <div
                ref={tooltipRef}
                className="absolute pointer-events-none opacity-0 bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl p-2 rounded-lg text-[10px] z-[100] transition-opacity duration-150"
                style={{ minWidth: "100px" }}
            />
        </div>
    );
};