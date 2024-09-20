//crear un componente para mostrar las inspecciones de los ultimos 7 dias

import ReactEcharts from "echarts-for-react";
import { Inspection } from "@/interfaces/inspection";

interface Bar7DaysProps {
  inspections: Inspection[];
}

const Bar7Days = ({ inspections }: Bar7DaysProps) => {
  const filteredInspections = inspections.filter((inspection) => {
    console.log(inspection);
    if (!inspection.date) return false; // Check for undefined date
    const inspectionDate = new Date(inspection.date);
    const today = new Date();
    const last7Days = new Date(today.setDate(today.getDate() - 7));
    return inspectionDate >= last7Days;
  });

  // Prepare data for ECharts
  const inspectionDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split("T")[0]; // Formato DD-MM
  });

  const completeInspectionCounts = inspectionDates.map((date) => {
    const count = filteredInspections.filter(
      (ins) =>
        ins.date && new Date(ins.date).toISOString().split("T")[0] === date // Check if ins.date is defined
    ).length; // Contar todas las inspecciones para esa fecha
    return count; // Retornar el conteo
  });

  const option = {
    xAxis: {
      type: "category",
      data: inspectionDates,
    },
    yAxis: {
      type: "value",
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
        data: completeInspectionCounts, // Asegúrate de que esto tenga la misma longitud
        type: "bar",
      },
    ],
    tooltip: {
      trigger: "axis",
      formatter: function (params: any) {
        return `${params[0].name}: ${params[0].value} inspections`;
      },
    },
  };

  return <ReactEcharts option={option} />;
};

export default Bar7Days;
