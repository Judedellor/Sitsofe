"use client"

import type React from "react"
import { useState } from "react"
import {
  Card,
  Row,
  Col,
  Button,
  Typography,
  Divider,
  Tabs,
  Table,
  Tag,
  Space,
  Progress,
  DatePicker,
  Select,
  Form,
  Input,
  Modal,
  Tooltip,
  Steps,
  Badge,
  Timeline,
  Checkbox,
  Upload,
  List,
  Avatar,
  Statistic,
} from "antd"
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  UploadOutlined,
  CalendarOutlined,
  HomeOutlined,
  FileTextOutlined,
  UserOutlined,
  ToolOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  CameraOutlined,
} from "@ant-design/icons"
import type { UploadProps } from "antd"
import DashboardLayout from "../DashboardLayout"

const { Title, Text, Paragraph } = Typography
const { Option } = Select
const { TabPane } = Tabs
const { TextArea } = Input
const { RangePicker } = DatePicker
const { Step } = Steps

interface InspectionType {
  key: string
  id: string
  property: string
  unit: string
  type: string
  date: string
  inspector: string
  status: string
  issues: number
  score: number
}

interface ChecklistItemType {
  key: string
  item: string
  category: string
  status: string
  notes: string
}

const PropertyInspection: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isViewModalVisible, setIsViewModalVisible] = useState(false)
  const [selectedInspection, setSelectedInspection] = useState<InspectionType | null>(null)
  const [form] = Form.useForm()
  const [activeTab, setActiveTab] = useState("upcoming")
  const [complianceData, setComplianceData] = useState<{
    required: number
    completed: number
    upcoming: number
    overdue: number
  }>({
    required: 24,
    completed: 18,
    upcoming: 4,
    overdue: 2,
  })

  // Sample data for inspections
  const inspections: InspectionType[] = [
    {
      key: "1",
      id: "INS-001",
      property: "Modern Luxury Apartment",
      unit: "Unit 101",
      type: "Move-in",
      date: "2024-04-15",
      inspector: "John Smith",
      status: "Scheduled",
      issues: 0,
      score: 0,
    },
    {
      key: "2",
      id: "INS-002",
      property: "Cozy Studio Loft",
      unit: "Unit 202",
      type: "Routine",
      date: "2024-04-20",
      inspector: "Sarah Johnson",
      status: "Scheduled",
      issues: 0,
      score: 0,
    },
    {
      key: "3",
      id: "INS-003",
      property: "Downtown Penthouse",
      unit: "Penthouse A",
      type: "Move-out",
      date: "2024-03-15",
      inspector: "John Smith",
      status: "Completed",
      issues: 2,
      score: 85,
    },
    {
      key: "4",
      id: "INS-004",
      property: "Suburban Family Home",
      unit: "Main House",
      type: "Annual",
      date: "2024-03-10",
      inspector: "Sarah Johnson",
      status: "Completed",
      issues: 5,
      score: 75,
    },
    {
      key: "5",
      id: "INS-005",
      property: "Modern Luxury Apartment",
      unit: "Unit 303",
      type: "Routine",
      date: "2024-03-05",
      inspector: "Michael Brown",
      status: "Completed",
      issues: 0,
      score: 95,
    },
    {
      key: "6",
      id: "INS-006",
      property: "Beachfront Villa",
      unit: "Main Villa",
      type: "Maintenance",
      date: "2024-03-01",
      inspector: "John Smith",
      status: "Completed",
      issues: 3,
      score: 80,
    },
  ]

  // Sample data for checklist items
  const checklistItems: ChecklistItemType[] = [
    {
      key: "1",
      item: "Walls and ceilings",
      category: "Interior",
      status: "Pass",
      notes: "No visible damage or stains",
    },
    {
      key: "2",
      item: "Flooring",
      category: "Interior",
      status: "Pass",
      notes: "Carpet in good condition, no tears or stains",
    },
    {
      key: "3",
      item: "Windows and screens",
      category: "Interior",
      status: "Fail",
      notes: "Broken screen on living room window",
    },
    {
      key: "4",
      item: "Doors and locks",
      category: "Interior",
      status: "Pass",
      notes: "All doors functioning properly",
    },
    {
      key: "5",
      item: "Light fixtures",
      category: "Interior",
      status: "Pass",
      notes: "All lights working",
    },
    {
      key: "6",
      item: "Smoke detectors",
      category: "Safety",
      status: "Fail",
      notes: "Bedroom smoke detector needs battery replacement",
    },
    {
      key: "7",
      item: "Plumbing fixtures",
      category: "Plumbing",
      status: "Pass",
      notes: "No leaks observed",
    },
    {
      key: "8",
      item: "Appliances",
      category: "Kitchen",
      status: "Pass",
      notes: "All appliances in working order",
    },
    {
      key: "9",
      item: "HVAC system",
      category: "Systems",
      status: "Pass",
      notes: "Heating and cooling functioning properly",
    },
    {
      key: "10",
      item: "Exterior siding",
      category: "Exterior",
      status: "Pass",
      notes: "No visible damage",
    },
  ]

  const showModal = () => {
    setIsModalVisible(true)
  }

  const showViewModal = (record: InspectionType) => {
    setSelectedInspection(record)
    setIsViewModalVisible(true)
  }

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        console.log("Form values:", values)
        form.resetFields()
        setIsModalVisible(false)
      })
      .catch((info) => {
        console.log("Validate Failed:", info)
      })
  }

  const handleCancel = () => {
    form.resetFields()
    setIsModalVisible(false)
  }

  const handleViewCancel = () => {
    setIsViewModalVisible(false)
    setSelectedInspection(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "blue"
      case "In Progress":
        return "orange"
      case "Completed":
        return "green"
      case "Cancelled":
        return "red"
      default:
        return "default"
    }
  }

  const getCheckStatusColor = (status: string) => {
    switch (status) {
      case "Pass":
        return "green"
      case "Fail":
        return "red"
      case "N/A":
        return "gray"
      default:
        return "default"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "#52c41a"
    if (score >= 70) return "#faad14"
    return "#f5222d"
  }

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
      filters: [
        { text: "Modern Luxury Apartment", value: "Modern Luxury Apartment" },
        { text: "Cozy Studio Loft", value: "Cozy Studio Loft" },
        { text: "Downtown Penthouse", value: "Downtown Penthouse" },
        { text: "Suburban Family Home", value: "Suburban Family Home" },
        { text: "Beachfront Villa", value: "Beachfront Villa" },
      ],
      onFilter: (value: string, record: InspectionType) => record.property === value,
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
      filters: [
        { text: "Move-in", value: "Move-in" },
        { text: "Move-out", value: "Move-out" },
        { text: "Routine", value: "Routine" },
        { text: "Annual", value: "Annual" },
        { text: "Maintenance", value: "Maintenance" },
      ],
      onFilter: (value: string, record: InspectionType) => record.type === value,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a: InspectionType, b: InspectionType) => a.date.localeCompare(b.date),
    },
    {
      title: "Inspector",
      dataIndex: "inspector",
      key: "inspector",
      filters: [
        { text: "John Smith", value: "John Smith" },
        { text: "Sarah Johnson", value: "Sarah Johnson" },
        { text: "Michael Brown", value: "Michael Brown" },
      ],
      onFilter: (value: string, record: InspectionType) => record.inspector === value,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => <Tag color={getStatusColor(status)}>{status}</Tag>,
      filters: [
        { text: "Scheduled", value: "Scheduled" },
        { text: "In Progress", value: "In Progress" },
        { text: "Completed", value: "Completed" },
        { text: "Cancelled", value: "Cancelled" },
      ],
      onFilter: (value: string, record: InspectionType) => record.status === value,
    },
    {
      title: "Issues",
      dataIndex: "issues",
      key: "issues",
      render: (issues: number) =>
        issues > 0 ? (
          <Badge count={issues} style={{ backgroundColor: issues > 3 ? "#f5222d" : "#faad14" }} />
        ) : (
          <Badge count={0} showZero style={{ backgroundColor: "#52c41a" }} />
        ),
      sorter: (a: InspectionType, b: InspectionType) => a.issues - b.issues,
    },
    {
      title: "Score",
      dataIndex: "score",
      key: "score",
      render: (score: number) =>
        score > 0 ? (
          <div style={{ width: 70 }}>
            <Progress
              percent={score}
              size="small"
              strokeColor={getScoreColor(score)}
              format={(percent) => `${percent}%`}
            />
          </div>
        ) : (
          "N/A"
        ),
      sorter: (a: InspectionType, b: InspectionType) => a.score - b.score,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: InspectionType) => (
        <Space size="middle">
          <Tooltip title="View Details">
            <Button type="text" icon={<EyeOutlined />} onClick={() => showViewModal(record)} />
          </Tooltip>
          <Tooltip title="Edit">
            <Button type="text" icon={<EditOutlined />} onClick={() => console.log("Edit inspection", record.id)} />
          </Tooltip>
          {record.status === "Scheduled" && (
            <Tooltip title="Cancel">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => console.log("Cancel inspection", record.id)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ]

  const checklistColumns = [
    {
      title: "Item",
      dataIndex: "item",
      key: "item",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      filters: [
        { text: "Interior", value: "Interior" },
        { text: "Exterior", value: "Exterior" },
        { text: "Kitchen", value: "Kitchen" },
        { text: "Bathroom", value: "Bathroom" },
        { text: "Safety", value: "Safety" },
        { text: "Plumbing", value: "Plumbing" },
        { text: "Systems", value: "Systems" },
      ],
      onFilter: (value: string, record: ChecklistItemType) => record.category === value,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => <Tag color={getCheckStatusColor(status)}>{status}</Tag>,
      filters: [
        { text: "Pass", value: "Pass" },
        { text: "Fail", value: "Fail" },
        { text: "N/A", value: "N/A" },
      ],
      onFilter: (value: string, record: ChecklistItemType) => record.status === value,
    },
    {
      title: "Notes",
      dataIndex: "notes",
      key: "notes",
      ellipsis: true,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: ChecklistItemType) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} onClick={() => console.log("Edit checklist item", record.key)} />
          <Button type="text" icon={<CameraOutlined />} onClick={() => console.log("Add photo", record.key)} />
        </Space>
      ),
    },
  ]

  // Upload props
  const uploadProps: UploadProps = {
    name: "file",
    action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === "done") {
        console.log(`${info.file.name} file uploaded successfully`)
      } else if (info.file.status === "error") {
        console.error(`${info.file.name} file upload failed.`)
      }
    },
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

  return (
    <DashboardLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Title level={2}>Property Inspections</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          Schedule Inspection
        </Button>
      </div>
      <Divider />

      {/* Summary Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="Upcoming Inspections"
              value={inspections.filter((i) => i.status === "Scheduled").length}
              prefix={<CalendarOutlined />}
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

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane
          tab={
            <span>
              <CalendarOutlined />
              Upcoming Inspections
            </span>
          }
          key="upcoming"
        >
          <Card bordered={false}>
            <Table columns={columns} dataSource={getFilteredInspections()} rowKey="key" pagination={{ pageSize: 10 }} />
          </Card>
        </TabPane>

        <TabPane
          tab={
            <span>
              <CheckCircleOutlined />
              Completed Inspections
            </span>
          }
          key="completed"
        >
          <Card bordered={false}>
            <Table columns={columns} dataSource={getFilteredInspections()} rowKey="key" pagination={{ pageSize: 10 }} />
          </Card>
        </TabPane>

        <TabPane
          tab={
            <span>
              <FileTextOutlined />
              Inspection Templates
            </span>
          }
          key="templates"
        >
          <Card
            bordered={false}
            title={
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Inspection Templates</span>
                <Button type="primary" icon={<PlusOutlined />}>
                  Create Template
                </Button>
              </div>
            }
          >
            <List
              itemLayout="horizontal"
              dataSource={[
                {
                  title: "Move-in Inspection",
                  description: "Comprehensive checklist for new tenant move-ins",
                  items: 45,
                },
                {
                  title: "Move-out Inspection",
                  description: "Detailed assessment for tenant move-outs",
                  items: 48,
                },
                {
                  title: "Routine Inspection",
                  description: "Standard quarterly inspection checklist",
                  items: 30,
                },
                {
                  title: "Annual Property Assessment",
                  description: "Yearly comprehensive property evaluation",
                  items: 65,
                },
                {
                  title: "Maintenance Inspection",
                  description: "Focused checklist for maintenance issues",
                  items: 25,
                },
              ]}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button key="edit" type="text" icon={<EditOutlined />}>
                      Edit
                    </Button>,
                    <Button key="view" type="text" icon={<EyeOutlined />}>
                      View
                    </Button>,
                    <Button key="use" type="link">
                      Use Template
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar icon={<FileTextOutlined />} />}
                    title={item.title}
                    description={
                      <div>
                        <Text>{item.description}</Text>
                        <div>
                          <Badge status="processing" text={`${item.items} checklist items`} />
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </TabPane>
        <TabPane
          tab={
            <span>
              <CheckCircleOutlined />
              Compliance Management
            </span>
          }
          key="compliance"
        >
          <Card bordered={false}>
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={6}>
                <Card bordered={false}>
                  <Statistic
                    title="Required Inspections"
                    value={complianceData.required}
                    valueStyle={{ color: "#1890ff" }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card bordered={false}>
                  <Statistic
                    title="Completed"
                    value={complianceData.completed}
                    valueStyle={{ color: "#52c41a" }}
                    suffix={`/ ${complianceData.required}`}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card bordered={false}>
                  <Statistic title="Upcoming" value={complianceData.upcoming} valueStyle={{ color: "#faad14" }} />
                </Card>
              </Col>
              <Col span={6}>
                <Card bordered={false}>
                  <Statistic title="Overdue" value={complianceData.overdue} valueStyle={{ color: "#f5222d" }} />
                </Card>
              </Col>
            </Row>

            <Divider orientation="left">Compliance Requirements</Divider>

            <Table
              dataSource={[
                {
                  key: "1",
                  requirement: "Annual Property Inspection",
                  frequency: "Yearly",
                  properties: "All Properties",
                  lastCompleted: "2024-02-15",
                  nextDue: "2025-02-15",
                  status: "Completed",
                },
                {
                  key: "2",
                  requirement: "Fire Safety Inspection",
                  frequency: "Bi-annual",
                  properties: "All Properties",
                  lastCompleted: "2023-11-10",
                  nextDue: "2024-05-10",
                  status: "Upcoming",
                },
                {
                  key: "3",
                  requirement: "Move-out Inspection",
                  frequency: "Per Tenant",
                  properties: "Tenant Properties",
                  lastCompleted: "Varies",
                  nextDue: "As Needed",
                  status: "Ongoing",
                },
                {
                  key: "4",
                  requirement: "Elevator Inspection",
                  frequency: "Quarterly",
                  properties: "Properties with Elevators",
                  lastCompleted: "2024-01-20",
                  nextDue: "2024-04-20",
                  status: "Upcoming",
                },
                {
                  key: "5",
                  requirement: "HVAC System Inspection",
                  frequency: "Bi-annual",
                  properties: "All Properties",
                  lastCompleted: "2023-10-05",
                  nextDue: "2024-04-05",
                  status: "Overdue",
                },
              ]}
              columns={[
                {
                  title: "Requirement",
                  dataIndex: "requirement",
                  key: "requirement",
                },
                {
                  title: "Frequency",
                  dataIndex: "frequency",
                  key: "frequency",
                },
                {
                  title: "Properties",
                  dataIndex: "properties",
                  key: "properties",
                },
                {
                  title: "Last Completed",
                  dataIndex: "lastCompleted",
                  key: "lastCompleted",
                },
                {
                  title: "Next Due",
                  dataIndex: "nextDue",
                  key: "nextDue",
                },
                {
                  title: "Status",
                  dataIndex: "status",
                  key: "status",
                  render: (status: string) => {
                    let color = "default"
                    if (status === "Completed") color = "green"
                    if (status === "Upcoming") color = "blue"
                    if (status === "Overdue") color = "red"
                    if (status === "Ongoing") color = "purple"
                    return <Tag color={color}>{status}</Tag>
                  },
                },
                {
                  title: "Actions",
                  key: "actions",
                  render: (_: any, record: any) => (
                    <Space size="middle">
                      <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => console.log("View requirement", record.key)}
                      />
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => console.log("Edit requirement", record.key)}
                      />
                      {record.status === "Upcoming" && (
                        <Button type="link" onClick={() => console.log("Schedule inspection", record.key)}>
                          Schedule
                        </Button>
                      )}
                    </Space>
                  ),
                },
              ]}
            />
          </Card>
        </TabPane>
        <TabPane
          tab={
            <span>
              <UserOutlined />
              Tenant Communication
            </span>
          }
          key="communication"
        >
          <Card bordered={false}>
            <Row gutter={16}>
              <Col span={12}>
                <Card
                  title="Notification Templates"
                  bordered={false}
                  extra={
                    <Button type="primary" icon={<PlusOutlined />} size="small">
                      Create Template
                    </Button>
                  }
                >
                  <List
                    itemLayout="horizontal"
                    dataSource={[
                      {
                        key: "1",
                        title: "Inspection Notice",
                        description: "Notify tenants of upcoming inspections",
                        type: "Email & SMS",
                      },
                      {
                        key: "2",
                        title: "Inspection Reminder",
                        description: "Remind tenants of scheduled inspections",
                        type: "Email & SMS",
                      },
                      {
                        key: "3",
                        title: "Inspection Results",
                        description: "Share inspection results with tenants",
                        type: "Email",
                      },
                      {
                        key: "4",
                        title: "Maintenance Required",
                        description: "Notify tenants of required maintenance",
                        type: "Email & SMS",
                      },
                    ]}
                    renderItem={(item) => (
                      <List.Item
                        actions={[
                          <Button key="edit" type="text" icon={<EditOutlined />} />,
                          <Button key="preview" type="text" icon={<EyeOutlined />} />,
                        ]}
                      >
                        <List.Item.Meta
                          title={item.title}
                          description={
                            <>
                              <div>{item.description}</div>
                              <Tag color="blue">{item.type}</Tag>
                            </>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card
                  title="Recent Communications"
                  bordered={false}
                  extra={
                    <Button type="primary" icon={<PlusOutlined />} size="small">
                      Send Notification
                    </Button>
                  }
                >
                  <Timeline>
                    <Timeline.Item color="green">
                      <p>
                        <strong>Inspection Results Sent</strong>
                      </p>
                      <p>Property: Downtown Penthouse, Unit: Penthouse A</p>
                      <p>Sent to: tenant@example.com</p>
                      <p>Date: 2024-03-16</p>
                    </Timeline.Item>
                    <Timeline.Item color="blue">
                      <p>
                        <strong>Inspection Reminder Sent</strong>
                      </p>
                      <p>Property: Cozy Studio Loft, Unit: Unit 202</p>
                      <p>Sent to: tenant2@example.com</p>
                      <p>Date: 2024-03-19</p>
                    </Timeline.Item>
                    <Timeline.Item color="blue">
                      <p>
                        <strong>Inspection Notice Sent</strong>
                      </p>
                      <p>Property: Modern Luxury Apartment, Unit: Unit 101</p>
                      <p>Sent to: tenant3@example.com</p>
                      <p>Date: 2024-04-08</p>
                    </Timeline.Item>
                    <Timeline.Item color="red">
                      <p>
                        <strong>Maintenance Required Notice</strong>
                      </p>
                      <p>Property: Downtown Penthouse, Unit: Penthouse A</p>
                      <p>Sent to: tenant@example.com</p>
                      <p>Date: 2024-03-17</p>
                    </Timeline.Item>
                  </Timeline>
                </Card>
              </Col>
            </Row>
          </Card>
        </TabPane>
      </Tabs>

      {/* Schedule Inspection Modal */}
      <Modal
        title="Schedule New Inspection"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={700}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Schedule Inspection
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" name="inspection_form">
          <Form.Item name="property" label="Property" rules={[{ required: true, message: "Please select property" }]}>
            <Select placeholder="Select property">
              <Option value="Modern Luxury Apartment">Modern Luxury Apartment</Option>
              <Option value="Cozy Studio Loft">Cozy Studio Loft</Option>
              <Option value="Downtown Penthouse">Downtown Penthouse</Option>
              <Option value="Suburban Family Home">Suburban Family Home</Option>
              <Option value="Beachfront Villa">Beachfront Villa</Option>
            </Select>
          </Form.Item>

          <Form.Item name="unit" label="Unit" rules={[{ required: true, message: "Please enter unit" }]}>
            <Input placeholder="Enter unit number or description" />
          </Form.Item>

          <Form.Item
            name="type"
            label="Inspection Type"
            rules={[{ required: true, message: "Please select inspection type" }]}
          >
            <Select placeholder="Select inspection type">
              <Option value="Move-in">Move-in</Option>
              <Option value="Move-out">Move-out</Option>
              <Option value="Routine">Routine</Option>
              <Option value="Annual">Annual</Option>
              <Option value="Maintenance">Maintenance</Option>
            </Select>
          </Form.Item>

          <Form.Item name="date" label="Inspection Date" rules={[{ required: true, message: "Please select date" }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="time" label="Inspection Time" rules={[{ required: true, message: "Please select time" }]}>
            <Select placeholder="Select time slot">
              <Option value="morning">Morning (9:00 AM - 12:00 PM)</Option>
              <Option value="afternoon">Afternoon (1:00 PM - 4:00 PM)</Option>
              <Option value="evening">Evening (5:00 PM - 7:00 PM)</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="inspector"
            label="Inspector"
            rules={[{ required: true, message: "Please select inspector" }]}
          >
            <Select placeholder="Select inspector">
              <Option value="John Smith">John Smith</Option>
              <Option value="Sarah Johnson">Sarah Johnson</Option>
              <Option value="Michael Brown">Michael Brown</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="template"
            label="Inspection Template"
            rules={[{ required: true, message: "Please select template" }]}
          >
            <Select placeholder="Select inspection template">
              <Option value="move-in">Move-in Inspection</Option>
              <Option value="move-out">Move-out Inspection</Option>
              <Option value="routine">Routine Inspection</Option>
              <Option value="annual">Annual Property Assessment</Option>
              <Option value="maintenance">Maintenance Inspection</Option>
            </Select>
          </Form.Item>

          <Form.Item name="notes" label="Notes">
            <TextArea rows={3} placeholder="Enter any additional notes or instructions" />
          </Form.Item>

          <Form.Item name="notify" label="Notifications" valuePropName="checked">
            <Checkbox>Notify tenant about inspection</Checkbox>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Inspection Modal */}
      {selectedInspection && (
        <Modal
          title={`Inspection Details: ${selectedInspection.id}`}
          open={isViewModalVisible}
          onCancel={handleViewCancel}
          width={800}
          footer={[
            <Button key="back" onClick={handleViewCancel}>
              Close
            </Button>,
            selectedInspection.status === "Scheduled" && (
              <Button
                key="start"
                type="primary"
                onClick={() => {
                  handleViewCancel()
                  console.log("Start inspection", selectedInspection.id)
                }}
              >
                Start Inspection
              </Button>
            ),
            selectedInspection.status === "Completed" && (
              <Button
                key="report"
                type="primary"
                onClick={() => {
                  console.log("Generate report", selectedInspection.id)
                }}
              >
                Generate Report
              </Button>
            ),
          ]}
        >
          <Tabs defaultActiveKey="details">
            <TabPane
              tab={
                <span>
                  <FileTextOutlined />
                  Inspection Details
                </span>
              }
              key="details"
            >
              <Row gutter={24}>
                <Col span={12}>
                  <Card
                    title={
                      <span>
                        <HomeOutlined style={{ marginRight: 8 }} />
                        Property Information
                      </span>
                    }
                    bordered={false}
                    style={{ marginBottom: 16 }}
                  >
                    <p>
                      <strong>Property:</strong> {selectedInspection.property}
                    </p>
                    <p>
                      <strong>Unit:</strong> {selectedInspection.unit}
                    </p>
                    <p>
                      <strong>Address:</strong> 123 Main St, Anytown, USA
                    </p>
                    <Button type="link" icon={<HomeOutlined />} onClick={() => console.log("View property details")}>
                      View Property Details
                    </Button>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card
                    title={
                      <span>
                        <CalendarOutlined style={{ marginRight: 8 }} />
                        Inspection Information
                      </span>
                    }
                    bordered={false}
                    style={{ marginBottom: 16 }}
                  >
                    <p>
                      <strong>Type:</strong> {selectedInspection.type}
                    </p>
                    <p>
                      <strong>Date:</strong> {selectedInspection.date}
                    </p>
                    <p>
                      <strong>Inspector:</strong> {selectedInspection.inspector}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <Tag color={getStatusColor(selectedInspection.status)}>{selectedInspection.status}</Tag>
                    </p>
                  </Card>
                </Col>
              </Row>

              {selectedInspection.status === "Completed" && (
                <Card
                  title={
                    <span>
                      <CheckCircleOutlined style={{ marginRight: 8 }} />
                      Inspection Results
                    </span>
                  }
                  bordered={false}
                >
                  <Row gutter={24}>
                    <Col span={8}>
                      <div style={{ textAlign: "center" }}>
                        <Progress
                          type="circle"
                          percent={selectedInspection.score}
                          strokeColor={getScoreColor(selectedInspection.score)}
                        />
                        <div style={{ marginTop: 16 }}>
                          <Text strong>Overall Score</Text>
                        </div>
                      </div>
                    </Col>
                    <Col span={16}>
                      <div>
                        <p>
                          <strong>Issues Identified:</strong> {selectedInspection.issues}
                        </p>
                        <p>
                          <strong>Inspection Date:</strong> {selectedInspection.date}
                        </p>
                        <p>
                          <strong>Completed By:</strong> {selectedInspection.inspector}
                        </p>
                        <p>
                          <strong>Summary:</strong> The property is in{" "}
                          {selectedInspection.score >= 90
                            ? "excellent"
                            : selectedInspection.score >= 70
                              ? "good"
                              : "fair"}{" "}
                          condition with {selectedInspection.issues} issues identified that require attention.
                        </p>
                      </div>
                    </Col>
                  </Row>
                </Card>
              )}

              {selectedInspection.status === "Scheduled" && (
                <Card
                  title={
                    <span>
                      <ClockCircleOutlined style={{ marginRight: 8 }} />
                      Inspection Status
                    </span>
                  }
                  bordered={false}
                >
                  <Steps current={0} style={{ marginBottom: 24 }}>
                    <Step title="Scheduled" description="Inspection planned" />
                    <Step title="In Progress" description="Conducting inspection" />
                    <Step title="Review" description="Reviewing findings" />
                    <Step title="Completed" description="Inspection completed" />
                  </Steps>
                  <div style={{ textAlign: "center" }}>
                    <Text>This inspection is scheduled for {selectedInspection.date}.</Text>
                    <div style={{ marginTop: 16 }}>
                      <Button type="primary" onClick={() => console.log("Start inspection", selectedInspection.id)}>
                        Start Inspection
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </TabPane>

            <TabPane
              tab={
                <span>
                  <FileTextOutlined />
                  Checklist
                </span>
              }
              key="checklist"
            >
              <Card bordered={false}>
                {selectedInspection.status === "Completed" ? (
                  <Table columns={checklistColumns} dataSource={checklistItems} rowKey="key" pagination={false} />
                ) : (
                  <div style={{ textAlign: "center", padding: "40px 0" }}>
                    <Text>Checklist will be available once the inspection is started.</Text>
                  </div>
                )}
              </Card>
            </TabPane>

            <TabPane
              tab={
                <span>
                  <CameraOutlined />
                  Photos
                </span>
              }
              key="photos"
            >
              <Card
                bordered={false}
                title={
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Inspection Photos</span>
                    {selectedInspection.status === "Completed" && (
                      <Upload {...uploadProps}>
                        <Button icon={<UploadOutlined />}>Upload Photo</Button>
                      </Upload>
                    )}
                  </div>
                }
              >
                {selectedInspection.status === "Completed" ? (
                  <Row gutter={[16, 16]}>
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                      <Col span={8} key={item}>
                        <Card
                          hoverable
                          cover={
                            <img
                              alt={`Inspection Photo ${item}`}
                              src={`/placeholder.svg?height=200&width=300`}
                              style={{ height: 200, objectFit: "cover" }}
                            />
                          }
                          actions={[<EyeOutlined key="view" />, <DeleteOutlined key="delete" />]}
                        >
                          <Card.Meta title={`Photo ${item}`} description={item % 2 === 0 ? "Living Room" : "Kitchen"} />
                        </Card>
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <div style={{ textAlign: "center", padding: "40px 0" }}>
                    <Text>Photos will be available once the inspection is started.</Text>
                  </div>
                )}
              </Card>
            </TabPane>

            <TabPane
              tab={
                <span>
                  <ToolOutlined />
                  Maintenance Issues
                </span>
              }
              key="issues"
            >
              <Card bordered={false}>
                {selectedInspection.status === "Completed" && selectedInspection.issues > 0 ? (
                  <List
                    itemLayout="horizontal"
                    dataSource={[
                      {
                        title: "Broken screen on living room window",
                        severity: "Medium",
                        category: "Interior",
                        status: "Open",
                      },
                      {
                        title: "Bedroom smoke detector needs battery replacement",
                        severity: "High",
                        category: "Safety",
                        status: "Open",
                      },
                      {
                        title: "Minor water stain on bathroom ceiling",
                        severity: "Low",
                        category: "Plumbing",
                        status: "Open",
                      },
                    ].slice(0, selectedInspection.issues)}
                    renderItem={(item) => (
                      <List.Item
                        actions={[
                          <Button key="view" type="text" icon={<EyeOutlined />}>
                            View
                          </Button>,
                          <Button key="create" type="link">
                            Create Work Order
                          </Button>,
                        ]}
                      >
                        <List.Item.Meta
                          avatar={
                            <Avatar
                              icon={<WarningOutlined />}
                              style={{
                                backgroundColor:
                                  item.severity === "High"
                                    ? "#f5222d"
                                    : item.severity === "Medium"
                                      ? "#faad14"
                                      : "#52c41a",
                              }}
                            />
                          }
                          title={item.title}
                          description={
                            <Space>
                              <Tag
                                color={
                                  item.severity === "High" ? "red" : item.severity === "Medium" ? "orange" : "green"
                                }
                              >
                                {item.severity}
                              </Tag>
                              <Tag>{item.category}</Tag>
                              <Tag color="blue">{item.status}</Tag>
                            </Space>
                          }
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <div style={{ textAlign: "center", padding: "40px 0" }}>
                    <Text>
                      {selectedInspection.status === "Completed"
                        ? "No maintenance issues identified."
                        : "Maintenance issues will be available once the inspection is completed."}
                    </Text>
                  </div>
                )}
              </Card>
            </TabPane>

            <TabPane
              tab={
                <span>
                  <UserOutlined />
                  Tenant Information
                </span>
              }
              key="tenant"
            >
              <Card bordered={false}>
                <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
                  <Avatar size={64} icon={<UserOutlined />} style={{ marginRight: 16 }} />
                  <div>
                    <Title level={4} style={{ margin: 0 }}>
                      Sarah Johnson
                    </Title>
                    <Text type="secondary">Tenant since June 2023</Text>
                  </div>
                </div>
                <Row gutter={24}>
                  <Col span={12}>
                    <p>
                      <strong>Email:</strong> sarah@example.com
                    </p>
                    <p>
                      <strong>Phone:</strong> (555) 123-4567
                    </p>
                    <p>
                      <strong>Lease End Date:</strong> May 31, 2024
                    </p>
                  </Col>
                  <Col span={12}>
                    <p>
                      <strong>Occupants:</strong> 2 Adults
                    </p>
                    <p>
                      <strong>Pets:</strong> 1 Cat
                    </p>
                    <p>
                      <strong>Payment Status:</strong> <Tag color="green">Current</Tag>
                    </p>
                  </Col>
                </Row>
                <Divider />
                <div>
                  <Title level={5}>Inspection Notifications</Title>
                  <Timeline>
                    <Timeline.Item color="green">
                      <p>
                        <strong>Inspection Notice Sent</strong>
                      </p>
                      <p>
                        Date: {selectedInspection.date.split("-")[0]}-{selectedInspection.date.split("-")[1]}-
                        {Number(selectedInspection.date.split("-")[2]) - 7}
                      </p>
                      <p>Method: Email</p>
                    </Timeline.Item>
                    <Timeline.Item color="green">
                      <p>
                        <strong>Reminder Sent</strong>
                      </p>
                      <p>
                        Date: {selectedInspection.date.split("-")[0]}-{selectedInspection.date.split("-")[1]}-
                        {Number(selectedInspection.date.split("-")[2]) - 1}
                      </p>
                      <p>Method: SMS</p>
                    </Timeline.Item>
                    {selectedInspection.status === "Completed" && (
                      <Timeline.Item color="green">
                        <p>
                          <strong>Results Shared</strong>
                        </p>
                        <p>Date: {selectedInspection.date}</p>
                        <p>Method: Email</p>
                      </Timeline.Item>
                    )}
                  </Timeline>
                </div>
              </Card>
            </TabPane>
          </Tabs>
        </Modal>
      )}
    </DashboardLayout>
  )
}

export default PropertyInspection

