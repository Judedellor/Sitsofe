"use client"

import { useState } from "react"
import { Card, Table, Tag, Button, Space, Tabs, Badge, Statistic, Row, Col, Divider, Typography } from "antd"
import { CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons"

const { Title } = Typography
const { TabPane } = Tabs

// Sample inspection data
const inspections = [
  {
    id: "1",
    property: "Sunset Apartments",
    unit: "Unit 101",
    type: "Move-in",
    date: "2024-04-15",
    inspector: "John Smith",
    status: "Scheduled",
    issues: 0,
  },
  {
    id: "2",
    property: "Lakeside Condos",
    unit: "Unit 202",
    type: "Routine",
    date: "2024-04-20",
    inspector: "Sarah Johnson",
    status: "Scheduled",
    issues: 0,
  },
  {
    id: "3",
    property: "Downtown Lofts",
    unit: "Penthouse A",
    type: "Move-out",
    date: "2024-03-15",
    inspector: "John Smith",
    status: "Completed",
    issues: 2,
  },
  {
    id: "4",
    property: "Garden Homes",
    unit: "Main House",
    type: "Annual",
    date: "2024-03-10",
    inspector: "Sarah Johnson",
    status: "Completed",
    issues: 5,
  },
]

const SimpleInspectionDashboard = () => {
  const [activeTab, setActiveTab] = useState("upcoming")

  // Get status color for tags
  const getStatusColor = (status) => {
    switch (status) {
      case "Scheduled":
        return "blue"
      case "In Progress":
        return "orange"
      case "Completed":
        return "green"
      default:
        return "default"
    }
  }

  // Filter inspections based on active tab
  const getFilteredInspections = () => {
    if (activeTab === "upcoming") {
      return inspections.filter((inspection) => inspection.status === "Scheduled")
    } else if (activeTab === "completed") {
      return inspections.filter((inspection) => inspection.status === "Completed")
    }
    return inspections
  }

  // Table columns
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Property",
      dataIndex: "property",
      key: "property",
    },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "unit",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => a.date.localeCompare(b.date),
    },
    {
      title: "Inspector",
      dataIndex: "inspector",
      key: "inspector",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: "Issues",
      dataIndex: "issues",
      key: "issues",
      render: (issues) =>
        issues > 0 ? (
          <Badge count={issues} style={{ backgroundColor: issues > 3 ? "#f5222d" : "#faad14" }} />
        ) : (
          <Badge count={0} showZero style={{ backgroundColor: "#52c41a" }} />
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small">
            View
          </Button>
          {record.status === "Scheduled" && (
            <Button type="link" size="small">
              Start
            </Button>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
        <Title level={2}>Property Inspections</Title>
        <Button type="primary">Schedule Inspection</Button>
      </div>

      <Divider />

      {/* Summary Cards */}
      <Row gutter={16} style={{ marginBottom: "24px" }}>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="Upcoming Inspections"
              value={inspections.filter((i) => i.status === "Scheduled").length}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="Completed This Month"
              value={inspections.filter((i) => i.status === "Completed").length}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="Issues Identified"
              value={inspections.reduce((sum, i) => sum + i.issues, 0)}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Inspection Tabs */}
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Upcoming Inspections" key="upcoming">
          <Card bordered={false}>
            <Table columns={columns} dataSource={getFilteredInspections()} rowKey="id" pagination={{ pageSize: 5 }} />
          </Card>
        </TabPane>

        <TabPane tab="Completed Inspections" key="completed">
          <Card bordered={false}>
            <Table columns={columns} dataSource={getFilteredInspections()} rowKey="id" pagination={{ pageSize: 5 }} />
          </Card>
        </TabPane>
      </Tabs>
    </div>
  )
}

export default SimpleInspectionDashboard

