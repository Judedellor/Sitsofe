"use client"

import type React from "react"
import { useState } from "react"
import { Card, Row, Col, Select, DatePicker, Button, Tabs, Typography, Divider, Space, Table, Tooltip } from "antd"
import {
  DownloadOutlined,
  BarChartOutlined,
  LineChartOutlined,
  DollarOutlined,
  TeamOutlined,
  HomeOutlined,
  SettingOutlined,
} from "@ant-design/icons"
import DashboardLayout from "../DashboardLayout"
import { Line, Bar, Pie, Column } from "@ant-design/charts"

const { Title, Text } = Typography
const { Option } = Select
const { RangePicker } = DatePicker
const { TabPane } = Tabs

const Analytics: React.FC = () => {
  const [dateRange, setDateRange] = useState<[string, string]>(["2023-01-01", "2023-12-31"])
  const [propertyFilter, setPropertyFilter] = useState<string>("all")
  const [chartType, setChartType] = useState<string>("line")

  // Sample data for revenue chart
  const revenueData = [
    { month: "Jan", revenue: 18000, expenses: 12000, profit: 6000 },
    { month: "Feb", revenue: 19500, expenses: 12500, profit: 7000 },
    { month: "Mar", revenue: 21000, expenses: 13000, profit: 8000 },
    { month: "Apr", revenue: 20500, expenses: 13500, profit: 7000 },
    { month: "May", revenue: 22500, expenses: 14000, profit: 8500 },
    { month: "Jun", revenue: 24000, expenses: 14500, profit: 9500 },
    { month: "Jul", revenue: 25500, expenses: 15000, profit: 10500 },
    { month: "Aug", revenue: 27000, expenses: 15500, profit: 11500 },
    { month: "Sep", revenue: 26500, expenses: 16000, profit: 10500 },
    { month: "Oct", revenue: 28000, expenses: 16500, profit: 11500 },
    { month: "Nov", revenue: 29500, expenses: 17000, profit: 12500 },
    { month: "Dec", revenue: 31000, expenses: 17500, profit: 13500 },
  ]

  // Sample data for occupancy chart
  const occupancyData = [
    { month: "Jan", occupancy: 88 },
    { month: "Feb", occupancy: 90 },
    { month: "Mar", occupancy: 92 },
    { month: "Apr", occupancy: 91 },
    { month: "May", occupancy: 93 },
    { month: "Jun", occupancy: 95 },
    { month: "Jul", occupancy: 96 },
    { month: "Aug", occupancy: 97 },
    { month: "Sep", occupancy: 95 },
    { month: "Oct", occupancy: 94 },
    { month: "Nov", occupancy: 93 },
    { month: "Dec", occupancy: 92 },
  ]

  // Sample data for maintenance requests
  const maintenanceData = [
    { month: "Jan", requests: 12, completed: 10 },
    { month: "Feb", requests: 15, completed: 13 },
    { month: "Mar", requests: 18, completed: 15 },
    { month: "Apr", requests: 14, completed: 12 },
    { month: "May", requests: 16, completed: 15 },
    { month: "Jun", requests: 20, completed: 18 },
    { month: "Jul", requests: 22, completed: 19 },
    { month: "Aug", requests: 19, completed: 17 },
    { month: "Sep", requests: 17, completed: 16 },
    { month: "Oct", requests: 15, completed: 14 },
    { month: "Nov", requests: 13, completed: 12 },
    { month: "Dec", requests: 11, completed: 10 },
  ]

  // Sample data for property performance
  const propertyPerformanceData = [
    { property: "Modern Luxury Apartment", revenue: 30000, occupancy: 95, maintenance: 8 },
    { property: "Cozy Studio Loft", revenue: 21600, occupancy: 90, maintenance: 5 },
    { property: "Downtown Penthouse", revenue: 50400, occupancy: 100, maintenance: 3 },
    { property: "Suburban Family Home", revenue: 26400, occupancy: 100, maintenance: 6 },
    { property: "Beachfront Villa", revenue: 42000, occupancy: 88, maintenance: 10 },
    { property: "Mountain View Cabin", revenue: 18000, occupancy: 75, maintenance: 4 },
  ]

  // Sample data for expense breakdown
  const expenseBreakdownData = [
    { type: "Maintenance", value: 35 },
    { type: "Utilities", value: 20 },
    { type: "Property Tax", value: 15 },
    { type: "Insurance", value: 10 },
    { type: "Management", value: 12 },
    { type: "Other", value: 8 },
  ]

  // Sample data for tenant turnover
  const tenantTurnoverData = [
    { month: "Jan", newTenants: 3, departures: 2 },
    { month: "Feb", newTenants: 2, departures: 1 },
    { month: "Mar", newTenants: 4, departures: 2 },
    { month: "Apr", newTenants: 2, departures: 3 },
    { month: "May", newTenants: 3, departures: 1 },
    { month: "Jun", newTenants: 5, departures: 2 },
    { month: "Jul", newTenants: 4, departures: 3 },
    { month: "Aug", newTenants: 3, departures: 2 },
    { month: "Sep", newTenants: 2, departures: 4 },
    { month: "Oct", newTenants: 4, departures: 1 },
    { month: "Nov", newTenants: 3, departures: 2 },
    { month: "Dec", newTenants: 2, departures: 3 },
  ]

  // Line chart configuration for revenue
  const revenueLineConfig = {
    data: revenueData,
    xField: "month",
    yField: "revenue",
    seriesField: "type",
    point: {
      size: 5,
      shape: "diamond",
    },
    label: {
      style: {
        fill: "#aaa",
      },
    },
  }

  // Multi-line chart configuration for revenue, expenses, profit
  const financialLineConfig = {
    data: revenueData.flatMap((item) => [
      { month: item.month, value: item.revenue, type: "Revenue" },
      { month: item.month, value: item.expenses, type: "Expenses" },
      { month: item.month, value: item.profit, type: "Profit" },
    ]),
    xField: "month",
    yField: "value",
    seriesField: "type",
    color: ["#52c41a", "#f5222d", "#1890ff"],
    point: {
      size: 5,
      shape: "circle",
    },
    legend: {
      position: "top",
    },
  }

  // Bar chart configuration for property performance
  const propertyBarConfig = {
    data: propertyPerformanceData,
    xField: "revenue",
    yField: "property",
    seriesField: "property",
    legend: { position: "top" },
    barBackground: { style: { fill: "rgba(0,0,0,0.1)" } },
    interactions: [{ type: "active-region", enable: false }],
    label: {
      position: "right",
      formatter: (datum: any) => `$${datum.revenue.toLocaleString()}`,
    },
  }

  // Pie chart configuration for expense breakdown
  const expensePieConfig = {
    data: expenseBreakdownData,
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    label: {
      type: "outer",
      content: "{name} {percentage}",
    },
    interactions: [{ type: "pie-legend-active" }, { type: "element-active" }],
  }

  // Column chart configuration for maintenance requests
  const maintenanceColumnConfig = {
    data: maintenanceData.flatMap((item) => [
      { month: item.month, count: item.requests, type: "Requests" },
      { month: item.month, count: item.completed, type: "Completed" },
    ]),
    xField: "month",
    yField: "count",
    seriesField: "type",
    isGroup: true,
    columnStyle: {
      radius: [20, 20, 0, 0],
    },
    label: {
      position: "top",
    },
  }

  // Column chart configuration for tenant turnover
  const tenantTurnoverConfig = {
    data: tenantTurnoverData.flatMap((item) => [
      { month: item.month, count: item.newTenants, type: "New Tenants" },
      { month: item.month, count: item.departures, type: "Departures" },
    ]),
    xField: "month",
    yField: "count",
    seriesField: "type",
    isGroup: true,
    columnStyle: {
      radius: [20, 20, 0, 0],
    },
    color: ["#52c41a", "#f5222d"],
  }

  // Line chart configuration for occupancy
  const occupancyLineConfig = {
    data: occupancyData,
    xField: "month",
    yField: "occupancy",
    point: {
      size: 5,
      shape: "circle",
    },
    label: {
      style: {
        fill: "#aaa",
      },
    },
    meta: {
      occupancy: {
        min: 0,
        max: 100,
      },
    },
  }

  // Property performance table columns
  const propertyColumns = [
    {
      title: "Property",
      dataIndex: "property",
      key: "property",
    },
    {
      title: "Revenue",
      dataIndex: "revenue",
      key: "revenue",
      render: (revenue: number) => `$${revenue.toLocaleString()}`,
      sorter: (a: any, b: any) => a.revenue - b.revenue,
    },
    {
      title: "Occupancy",
      dataIndex: "occupancy",
      key: "occupancy",
      render: (occupancy: number) => `${occupancy}%`,
      sorter: (a: any, b: any) => a.occupancy - b.occupancy,
    },
    {
      title: "Maintenance Requests",
      dataIndex: "maintenance",
      key: "maintenance",
      sorter: (a: any, b: any) => a.maintenance - b.maintenance,
    },
  ]

  return (
    <DashboardLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Title level={2}>Analytics & Reporting</Title>
        <Space>
          <Button icon={<DownloadOutlined />} onClick={() => console.log("Export report")}>
            Export Report
          </Button>
          <Select defaultValue="all" style={{ width: 200 }} onChange={(value) => setPropertyFilter(value)}>
            <Option value="all">All Properties</Option>
            <Option value="luxury">Modern Luxury Apartment</Option>
            <Option value="studio">Cozy Studio Loft</Option>
            <Option value="penthouse">Downtown Penthouse</Option>
            <Option value="suburban">Suburban Family Home</Option>
            <Option value="villa">Beachfront Villa</Option>
            <Option value="cabin">Mountain View Cabin</Option>
          </Select>
          <RangePicker
            defaultValue={[null, null]}
            onChange={(dates) => {
              if (dates && dates[0] && dates[1]) {
                setDateRange([dates[0].format("YYYY-MM-DD"), dates[1].format("YYYY-MM-DD")])
              }
            }}
          />
        </Space>
      </div>
      <Divider />

      <Tabs defaultActiveKey="financial" style={{ marginBottom: 32 }}>
        <TabPane
          tab={
            <span>
              <DollarOutlined />
              Financial
            </span>
          }
          key="financial"
        >
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card title="Revenue, Expenses & Profit" bordered={false}>
                <div style={{ marginBottom: 16, display: "flex", justifyContent: "flex-end" }}>
                  <Space>
                    <Tooltip title="Line Chart">
                      <Button
                        type={chartType === "line" ? "primary" : "default"}
                        icon={<LineChartOutlined />}
                        onClick={() => setChartType("line")}
                      />
                    </Tooltip>
                    <Tooltip title="Bar Chart">
                      <Button
                        type={chartType === "bar" ? "primary" : "default"}
                        icon={<BarChartOutlined />}
                        onClick={() => setChartType("bar")}
                      />
                    </Tooltip>
                  </Space>
                </div>
                <Line {...financialLineConfig} height={300} />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col span={16}>
              <Card title="Property Revenue Performance" bordered={false}>
                <Bar {...propertyBarConfig} height={300} />
              </Card>
            </Col>
            <Col span={8}>
              <Card title="Expense Breakdown" bordered={false}>
                <Pie {...expensePieConfig} height={300} />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col span={24}>
              <Card title="Property Performance Comparison" bordered={false}>
                <Table
                  dataSource={propertyPerformanceData}
                  columns={propertyColumns}
                  pagination={false}
                  rowKey="property"
                />
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane
          tab={
            <span>
              <HomeOutlined />
              Occupancy
            </span>
          }
          key="occupancy"
        >
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card title="Occupancy Rate Trend" bordered={false}>
                <Line {...occupancyLineConfig} height={300} />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col span={24}>
              <Card title="Tenant Turnover" bordered={false}>
                <Column {...tenantTurnoverConfig} height={300} />
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane
          tab={
            <span>
              <SettingOutlined />
              Maintenance
            </span>
          }
          key="maintenance"
        >
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card title="Maintenance Requests vs. Completions" bordered={false}>
                <Column {...maintenanceColumnConfig} height={300} />
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane
          tab={
            <span>
              <TeamOutlined />
              Tenants
            </span>
          }
          key="tenants"
        >
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card title="Tenant Satisfaction Score" bordered={false}>
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <Text>Tenant satisfaction data visualization will be displayed here.</Text>
                </div>
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col span={24}>
              <Card title="Lease Renewals" bordered={false}>
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <Text>Lease renewal rate visualization will be displayed here.</Text>
                </div>
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </DashboardLayout>
  )
}

export default Analytics

