"use client"

import type React from "react"
import { Row, Col, Card, Statistic, Table, Button, Progress, Typography, Divider } from "antd"
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  HomeOutlined,
  TeamOutlined,
  ToolOutlined,
  DollarOutlined,
} from "@ant-design/icons"
import DashboardLayout from "../DashboardLayout"
import { Line, Pie } from "@ant-design/charts"
import type { ColumnsType } from "antd/es/table"

const { Title } = Typography

interface DataType {
  key: string
  property: string
  tenant: string
  amount: number
  date: string
  status: string
}

const Dashboard: React.FC = () => {
  // Sample data for charts and tables
  const recentPayments: DataType[] = [
    {
      key: "1",
      property: "Modern Luxury Apartment",
      tenant: "Sarah Johnson",
      amount: 2500,
      date: "2024-03-15",
      status: "Paid",
    },
    {
      key: "2",
      property: "Cozy Studio Loft",
      tenant: "Michael Brown",
      amount: 1800,
      date: "2024-03-10",
      status: "Paid",
    },
    {
      key: "3",
      property: "Downtown Penthouse",
      tenant: "Emily Davis",
      amount: 3200,
      date: "2024-03-05",
      status: "Late",
    },
    {
      key: "4",
      property: "Suburban Family Home",
      tenant: "Robert Wilson",
      amount: 2200,
      date: "2024-03-01",
      status: "Paid",
    },
  ]

  const columns: ColumnsType<DataType> = [
    {
      title: "Property",
      dataIndex: "property",
      key: "property",
    },
    {
      title: "Tenant",
      dataIndex: "tenant",
      key: "tenant",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => `$${amount.toLocaleString()}`,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          style={{
            color: status === "Paid" ? "#52c41a" : "#f5222d",
            fontWeight: 500,
          }}
        >
          {status}
        </span>
      ),
    },
  ]

  // Revenue data for line chart
  const revenueData = [
    { month: "Jan", revenue: 18000 },
    { month: "Feb", revenue: 19500 },
    { month: "Mar", revenue: 21000 },
    { month: "Apr", revenue: 20500 },
    { month: "May", revenue: 22500 },
    { month: "Jun", revenue: 24000 },
    { month: "Jul", revenue: 25500 },
    { month: "Aug", revenue: 27000 },
    { month: "Sep", revenue: 26500 },
    { month: "Oct", revenue: 28000 },
    { month: "Nov", revenue: 29500 },
    { month: "Dec", revenue: 31000 },
  ]

  // Property distribution data for pie chart
  const propertyTypeData = [
    { type: "Apartments", value: 45 },
    { type: "Houses", value: 25 },
    { type: "Condos", value: 15 },
    { type: "Commercial", value: 10 },
    { type: "Other", value: 5 },
  ]

  // Line chart configuration
  const lineConfig = {
    data: revenueData,
    xField: "month",
    yField: "revenue",
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

  // Pie chart configuration
  const pieConfig = {
    data: propertyTypeData,
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    label: {
      type: "outer",
      content: "{name} {percentage}",
    },
    interactions: [{ type: "pie-legend-active" }, { type: "element-active" }],
  }

  return (
    <DashboardLayout>
      <Title level={2}>Dashboard</Title>
      <Divider />

      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title="Total Properties"
              value={42}
              prefix={<HomeOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
            <div style={{ marginTop: 8 }}>
              <span style={{ fontSize: 14, color: "#3f8600" }}>
                <ArrowUpOutlined /> 8% from last month
              </span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic title="Active Tenants" value={156} prefix={<TeamOutlined />} valueStyle={{ color: "#1890ff" }} />
            <div style={{ marginTop: 8 }}>
              <span style={{ fontSize: 14, color: "#1890ff" }}>
                <ArrowUpOutlined /> 12% from last month
              </span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title="Maintenance Requests"
              value={24}
              prefix={<ToolOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
            <div style={{ marginTop: 8 }}>
              <span style={{ fontSize: 14, color: "#faad14" }}>
                <ArrowDownOutlined /> 5% from last month
              </span>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title="Monthly Revenue"
              value={87500}
              prefix={<DollarOutlined />}
              valueStyle={{ color: "#52c41a" }}
              formatter={(value) => `$${value.toLocaleString()}`}
            />
            <div style={{ marginTop: 8 }}>
              <span style={{ fontSize: 14, color: "#52c41a" }}>
                <ArrowUpOutlined /> 15% from last month
              </span>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={16}>
          <Card title="Revenue Trend" bordered={false}>
            <Line {...lineConfig} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Property Distribution" bordered={false}>
            <Pie {...pieConfig} />
          </Card>
        </Col>
      </Row>

      {/* Occupancy and Collection Rate */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} sm={12}>
          <Card title="Occupancy Rate" bordered={false}>
            <Progress type="dashboard" percent={92} strokeColor="#1890ff" width={120} />
            <div style={{ marginTop: 16, textAlign: "center" }}>
              <Typography.Text>38 out of 42 properties occupied</Typography.Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card title="Rent Collection Rate" bordered={false}>
            <Progress type="dashboard" percent={95} strokeColor="#52c41a" width={120} />
            <div style={{ marginTop: 16, textAlign: "center" }}>
              <Typography.Text>$83,125 collected out of $87,500 due</Typography.Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recent Payments Table */}
      <Card
        title="Recent Payments"
        bordered={false}
        style={{ marginTop: 16 }}
        extra={<Button type="link">View All</Button>}
      >
        <Table columns={columns} dataSource={recentPayments} pagination={false} />
      </Card>
    </DashboardLayout>
  )
}

export default Dashboard

