import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const IncomeExpenseCategoryChart = ({
  data,
  width = 300,
  height = 300,
  innerRadius = 70,
  outerRadius = 100,
}) => {
  const ref = useRef();

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    // Create a color scale based on category
    const color = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.category))
      .range(["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"]); // You can customize with your own colors here

    const pie = d3.pie().value((d) => d.value);
    const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);

    const arcs = pie(data);

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    g.selectAll("path")
      .data(arcs)
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d, i) => color(d.data.category))
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);

    g.selectAll("text")
      .data(arcs)
      .enter()
      .append("text")
      .text((d) => d.data.category)
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .style("text-anchor", "middle")
      .style("font-size", 12);
  }, [data, width, height, innerRadius, outerRadius]);

  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      style={{ padding: "0.8rem" }}
    ></svg>
  );
};

export default IncomeExpenseCategoryChart;
