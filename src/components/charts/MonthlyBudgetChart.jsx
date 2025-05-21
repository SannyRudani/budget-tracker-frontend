import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const MonthlyBudgetChart = ({
  income,
  expenses,
  width = 400,
  height = 300,
}) => {
  const ref = useRef();

  useEffect(() => {
    if (income == null || expenses == null) return;

    const data = [
      { label: "Income", value: income },
      { label: "Expenses", value: expenses },
    ];

    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.label))
      .range([margin.left, width - margin.right])
      .padding(0.4);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) * 1.2])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const color = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.label))
      .range(["#1890ff", "#ff4d4f"]);

    // X Axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    // Y Axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5));

    // Bars
    svg
      .append("g")
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", (d) => x(d.label))
      .attr("y", (d) => y(d.value))
      .attr("height", (d) => y(0) - y(d.value))
      .attr("width", x.bandwidth())
      .attr("fill", (d) => color(d.label));

    // Labels
    svg
      .append("g")
      .selectAll("text.label")
      .data(data)
      .join("text")
      .attr("class", "label")
      .attr("x", (d) => x(d.label) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.value) - 5)
      .attr("text-anchor", "middle")
      .text((d) => d.value.toFixed(2));
  }, [income, expenses]);

  return <svg ref={ref} width={width} height={height} />;
};

export default MonthlyBudgetChart;
