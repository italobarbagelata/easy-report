import ReactEcharts from "echarts-for-react";
import { Inspection } from "@/interfaces/inspection";

interface Bar7DaysProps {
  inspections: Inspection[];
}

const BarPhythoChina = ({ inspections }: Bar7DaysProps) => {
  const countryData = inspections.reduce(
    (acc: Record<string, number>, inspection) => {
      // Explicitly type acc
      const country = inspection.phyto_china?.description; // Usar la descripción del país
      if (country) {
        acc[country] = (acc[country] || 0) + 1; // Contar inspecciones por país
      }
      return acc;
    },
    {}
  );

  const countries = Object.keys(countryData);
  const inspectionCounts = Object.values(countryData); // Cambiar a conteo de inspecciones

  const option = {
    tooltip: {
      trigger: "item",
    },
    legend: {
      bottom: "5%",
      left: "center",
      textStyle: {
        color: "white",
      },
    },
    series: [
      {
        name: "Inspecciones por País",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 12,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: countries.map((country, index) => ({
          value: inspectionCounts[index], // Usar conteo de inspecciones como valor
          name: country, // Usar país como nombre
        })),
      },
    ],
  };
  return (
    <ReactEcharts option={option} style={{ height: "400px", width: "100%" }} />
  );
};

export default BarPhythoChina;
