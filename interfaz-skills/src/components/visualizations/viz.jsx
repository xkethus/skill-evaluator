import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import CustomModal from "../CustomModal"; // Asegúrate de tener este componente

const Viz = ({ data }) => {
    const svgRef = useRef();
    const [selectedPoint, setSelectedPoint] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        console.log("Datos recibidos:", data);
        if (!data || data.length === 0) return;

        const width = 500;
        const height = 500;
        const radius = Math.min(width, height) / 2 - 50;

        const aggregatedData = data.reduce((acc, current) => {
            const key = `${current.skill} - ${current.subSkill}`;
            if (!acc[key]) {
                acc[key] = { ...current, count: 1 };
            } else {
                acc[key].count += 1;
            }
            return acc;
        }, {});

        const processedData = Object.values(aggregatedData);
        console.log("Datos procesados:", processedData);

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); // Limpia el SVG antes de redibujar

        const mainGroup = svg
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`);

        const angleScale = d3.scaleBand()
            .domain(processedData.map(d => `${d.skill} - ${d.subSkill}`))
            .range([0, 2 * Math.PI]);

        const radiusScale = d3.scaleLinear()
            .domain([0, 4]) // Ajustamos el dominio para incluir el 0 y separar mejor el nivel 1
            .range([20, radius]); // El nivel 1 ahora comienza más lejos del centro

        // Ejes de niveles
        mainGroup.selectAll(".axis")
            .data([1, 2, 2.5, 3, 4]) // Agregamos el nivel 2.5 como un eje extra
            .join("circle")
            .attr("class", "axis")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", d => radiusScale(d))
            .attr("fill", "none")
            .attr("stroke", d => (d === 2.5 ? "#6a1b9aaa" : "#ccc")) // Nivel 2.5 tiene un color diferente
            .attr("stroke-dasharray", d => (d === 2.5 ? "4 2" : "none")); // Nivel 2.5 es una línea discontinua

        // Puntos interactivos
        const points = mainGroup.selectAll(".point")
            .data(processedData)
            .join("circle")
            .attr("class", "point")
            .attr("r", d => 5 + d.count * 2)
            .attr("fill", d => d.level > 2 ? "#6a1b9a" : "#9c27b0")
            .on("click", (_, d) => {
                setSelectedPoint(d);
                setIsModalOpen(true);
            });

        // Animación de rotación
        d3.timer((elapsed) => {
            points
                .attr("cx", d => Math.cos(angleScale(`${d.skill} - ${d.subSkill}`) + elapsed / 10000 - Math.PI / 2) * radiusScale(d.level))
                .attr("cy", d => Math.sin(angleScale(`${d.skill} - ${d.subSkill}`) + elapsed / 10000 - Math.PI / 2) * radiusScale(d.level));
        });
    }, [data]);

    return (
        <>
            <svg ref={svgRef}></svg>
            {isModalOpen && selectedPoint && (
                <CustomModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    content={
                        <>
                            <h2>Detalles del Punto</h2>
                            <p><strong>Habilidad:</strong> {selectedPoint.skill}</p>
                            <p><strong>Subhabilidad:</strong> {selectedPoint.subSkill}</p>
                            <p><strong>Nivel:</strong> {selectedPoint.level}</p>
                            <p><strong>Frecuencia:</strong> {selectedPoint.count}</p>
                        </>
                    }
                />
            )}
        </>
    );
};

export default Viz;
