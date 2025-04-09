"use client"

import type React from "react"
import { Line } from "@ant-design/charts"

interface GraphChartProps {
  data: number[]
  width?: number
  height?: number
  strokeColor?: string
  labels?: string[]
}

const GraphChart: React.FC<GraphChartProps> = ({
  data,
  width = 300,
  height = 200,
  strokeColor = "#1890ff",
  labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
}) => {
  // Transform data into the format expected by the chart
  const chartData = data.map((value, index) => ({
    month: labels[index % labels.length],
    value,
  }))

  const config = {
    data: chartData,
    xField: "month",
    yField: "value",
    smooth: true,
    lineStyle: {
      stroke: strokeColor,
      lineWidth: 3,
    },
    point: {
      size: 5,
      shape: "circle",
      style: {
        fill: "white",
        stroke: strokeColor,
        lineWidth: 2,
      },
    },
    tooltip: {
      showMarkers: false,
    },
    state: {
      active: {
        style: {
          shadowBlur: 4,
          stroke: strokeColor,
          fill: "white",
        },
      },
    },
    interactions: [
      {
        type: "marker-active",
      },
    ],
  }

  return <Line {...config} width={width} height={height} />
}

export default GraphChart

