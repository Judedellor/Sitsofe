"use client"

import type React from "react"
import { useState } from "react"
import {
  Table,
  Card,
  Button,
  Input,
  Space,
  Tag,
  Modal,
  Form,
  Select,
  DatePicker,
  InputNumber,
  Typography,
  Divider,
  Tooltip,
  Steps,
  Tabs,
  Row,
  Col,
  Statistic,
  Timeline,
} from "antd"
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  FilePdfOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  FileTextOutlined,
  MailOutlined,
  UserOutlined,
  HomeOutlined,
  CalendarOutlined,
  DollarOutlined,
} from "@ant-design/icons"
import type { ColumnsType } from "antd/es/table"
import DashboardLayout from "../DashboardLayout"

const { Title, Text } = Typography
const { Option } = Select
const { RangePicker } = DatePicker
const { TabPane } = Tabs

interface LeaseType {
  key: string
  id: string
  tenant: string
  property: string
  startDate: string
  endDate: string
  rent: number
  status: string
  renewalStatus: string
  documents: string[]
}

const LeaseManagement: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isViewModalVisible, setIsViewModalVisible] = useState(false)
  const [selectedLease, setSelectedLease] = useState<LeaseType | null>(null)
  const [form] = Form.useForm()
  const [searchText, setSearchText] = useState("")
  const [filteredData, setFilteredData] = useState<LeaseType[]>([])
  const [activeTab, setActiveTab] = useState("active")

  // Sample data
  const data: LeaseType[] = [
    {
      key: "1",
      id: "LS-001",
      tenant: "Sarah Johnson",
      property: "Modern Luxury Apartment",
      startDate: "2023-06-01",
      endDate: "2024-05-31",
      rent: 2500,
      status: "Active",
      renewalStatus: "Not Started",
      documents: ["Lease Agreement", "Move-in Inspection"],
    },
    {
      key: "2",
      id: "LS-002",
      tenant: "Michael Brown",
      property: "Cozy Studio Loft",
      startDate: "2023-08-15",
      endDate: "2024-08-14",
      rent: 1800,
      status: "Active",
      renewalStatus: "Not Started",
      documents: ["Lease Agreement", "Move-in Inspection", "Pet Addendum"],
    },
    {
      key: "3",
      id: "LS-003",
      tenant: "Emily Davis",
      property: "Downtown Penthouse",
      startDate: "2023-04-01",
      endDate: "2024-03-31",
      rent: 3200,
      status: "Active",
      renewalStatus: "In Progress",
      documents: ["Lease Agreement", "Move-in Inspection"],
    },
    {
      key: "4",
      id: "LS-004",
      tenant: "Robert Wilson",
      property: "Suburban Family Home",
      startDate: "2023-09-01",
      endDate: "2024-08-31",
      rent: 2200,
      status: "Active",
      renewalStatus: "Not Started",
      documents: ["Lease Agreement", "Move-in Inspection", "Garage Addendum"],
    },
    {
      key: "5",
      id: "LS-005",
      tenant: "Jennifer Lopez",
      property: "Beachfront Villa",
      startDate: "2023-01-15",
      endDate: "2023-12-31",
      rent: 3500,
      status: "Ending Soon",
      renewalStatus: "Pending Approval",
      documents: ["Lease Agreement", "Move-in Inspection"],
    },
    {
      key: "6",
      id: "LS-006",
      tenant: "David Miller",
      property: "Mountain View Cabin",
      startDate: "2022-11-01",
      endDate: "2023-10-31",
      rent: 1500,
      status: "Expired",
      renewalStatus: "Declined",
      documents: ["Lease Agreement", "Move-in Inspection"],
    },
  ]

  const showModal = () => {
    setIsModalVisible(true)
  }

  const showViewModal = (record: LeaseType) => {
    setSelectedLease(record)
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
    setSelectedLease(null)
  }

  const handleSearch = (value: string) => {
    setSearchText(value)
    if (value) {
      const filtered = data.filter(
        (item) =>
          item.tenant.toLowerCase().includes(value.toLowerCase()) ||
          item.property.toLowerCase().includes(value.toLowerCase()) ||
          item.id.toLowerCase().includes(value.toLowerCase()),
      )
      setFilteredData(filtered)
    } else {
      setFilteredData([])
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "green"
      case "Ending Soon":
        return "orange"
      case "Expired":
        return "red"
      case "Draft":
        return "blue"
      default:
        return "default"
    }
  }

  const getRenewalStatusColor = (status: string) => {
    switch (status) {
      case "Not Started":
        return "default"
      case "In Progress":
        return "blue"
      case "Pending Approval":
        return "orange"
      case "Approved":
        return "green"
      case "Declined":
        return "red"
      default:
        return "default"
    }
  }

  const getRenewalStatusStep = (status: string) => {
    switch (status) {
      case "Not Started":
        return 0
      case "In Progress":
        return 1
      case "Pending Approval":
        return 2
      case "Approved":
        return 3
      case "Declined":
        return 3
      default:
        return 0
    }
  }

  const columns: ColumnsType<LeaseType> = [
    {
      title: "Lease ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tenant",
      dataIndex: "tenant",
      key: "tenant",
      sorter: (a, b) => a.tenant.localeCompare(b.tenant),
    },
    {
      title: "Property",
      dataIndex: "property",
      key: "property",
      ellipsis: true,
    },
    {
      title: "Lease Period",
      key: "leasePeriod",
      render: (_, record) => (
        <span>
          {record.startDate} to {record.endDate}
        </span>
      ),
      sorter: (a, b) => a.endDate.localeCompare(b.endDate),
    },
    {
      title: "Monthly Rent",
      dataIndex: "rent",
      key: "rent",
      render: (rent) => `$${rent.toLocaleString()}`,
      sorter: (a, b) => a.rent - b.rent,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
      filters: [
        { text: "Active", value: "Active" },
        { text: "Ending Soon", value: "Ending Soon" },
        { text: "Expired", value: "Expired" },
        { text: "Draft", value: "Draft" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Renewal Status",
      dataIndex: "renewalStatus",
      key: "renewalStatus",
      render: (status) => <Tag color={getRenewalStatusColor(status)}>{status}</Tag>,
      filters: [
        { text: "Not Started", value: "Not Started" },
        { text: "In Progress", value: "In Progress" },
        { text: "Pending Approval", value: "Pending Approval" },
        { text: "Approved", value: "Approved" },
        { text: "Declined", value: "Declined" },
      ],
      onFilter: (value, record) => record.renewalStatus === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="View Details">
            <Button type="text" icon={<EyeOutlined />} onClick={() => showViewModal(record)} />
          </Tooltip>
          <Tooltip title="Edit">
            <Button type="text" icon={<EditOutlined />} onClick={() => console.log("Edit lease", record.key)} />
          </Tooltip>
          <Tooltip title="Documents">
            <Button type="text" icon={<FilePdfOutlined />} onClick={() => console.log("View documents", record.key)} />
          </Tooltip>
        </Space>
      ),
    },
  ]

  // Filter data based on active tab
  const getFilteredLeases = () => {
    let filteredLeases = data

    if (activeTab === "active") {
      filteredLeases = data.filter((lease) => lease.status === "Active")
    } else if (activeTab === "ending") {
      filteredLeases = data.filter((lease) => lease.status === "Ending Soon")
    } else if (activeTab === "expired") {
      filteredLeases = data.filter((lease) => lease.status === "Expired")
    } else if (activeTab === "renewal") {
      filteredLeases = data.filter(
        (lease) => lease.renewalStatus === "In Progress" || lease.renewalStatus === "Pending Approval",
      )
    }

    if (searchText) {
      return filteredLeases.filter(
        (item) =>
          item.tenant.toLowerCase().includes(searchText.toLowerCase()) ||
          item.property.toLowerCase().includes(searchText.toLowerCase()) ||
          item.id.toLowerCase().includes(searchText.toLowerCase()),
      )
    }

    return filteredLeases
  }

  // Calculate summary statistics
  const activeLeases = data.filter((lease) => lease.status === "Active").length
  const endingSoonLeases = data.filter((lease) => lease.status === "Ending Soon").length
  const expiredLeases = data.filter((lease) => lease.status === "Expired").length
  const renewalLeases = data.filter(
    (lease) => lease.renewalStatus === "In Progress" || lease.renewalStatus === "Pending Approval",
  ).length

  return (
    <DashboardLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Title level={2}>Lease Management</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          Create Lease
        </Button>
      </div>
      <Divider />

      {/* Summary Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Active Leases"
              value={activeLeases}
              valueStyle={{ color: "#52c41a" }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Ending Soon"
              value={endingSoonLeases}
              valueStyle={{ color: "#faad14" }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Expired"
              value={expiredLeases}
              valueStyle={{ color: "#f5222d" }}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Pending Renewals"
              value={renewalLeases}
              valueStyle={{ color: "#1890ff" }}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Tabs and Search */}
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab} style={{ marginBottom: 0 }}>
          <TabPane tab="Active Leases" key="active" />
          <TabPane tab="Ending Soon" key="ending" />
          <TabPane tab="Expired" key="expired" />
          <TabPane tab="Pending Renewals" key="renewal" />
        </Tabs>
        <Space>
          <Input.Search
            placeholder="Search leases..."
            allowClear
            enterButton={<SearchOutlined />}
            onSearch={handleSearch}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 300 }}
          />
        </Space>
      </div>

      {/* Leases Table */}
      <Card bordered={false}>
        <Table columns={columns} dataSource={getFilteredLeases()} rowKey="key" pagination={{ pageSize: 10 }} />
      </Card>

      {/* Create Lease Modal */}
      <Modal
        title="Create New Lease"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={700}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Create Lease
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" name="lease_form">
          <Form.Item name="tenant" label="Tenant" rules={[{ required: true, message: "Please select tenant" }]}>
            <Select placeholder="Select tenant">
              <Option value="Sarah Johnson">Sarah Johnson</Option>
              <Option value="Michael Brown">Michael Brown</Option>
              <Option value="Emily Davis">Emily Davis</Option>
              <Option value="Robert Wilson">Robert Wilson</Option>
              <Option value="Jennifer Lopez">Jennifer Lopez</Option>
              <Option value="David Miller">David Miller</Option>
            </Select>
          </Form.Item>

          <Form.Item name="property" label="Property" rules={[{ required: true, message: "Please select property" }]}>
            <Select placeholder="Select property">
              <Option value="Modern Luxury Apartment">Modern Luxury Apartment</Option>
              <Option value="Cozy Studio Loft">Cozy Studio Loft</Option>
              <Option value="Downtown Penthouse">Downtown Penthouse</Option>
              <Option value="Suburban Family Home">Suburban Family Home</Option>
              <Option value="Beachfront Villa">Beachfront Villa</Option>
              <Option value="Mountain View Cabin">Mountain View Cabin</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="leasePeriod"
            label="Lease Period"
            rules={[{ required: true, message: "Please select lease period" }]}
          >
            <RangePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="rent"
            label="Monthly Rent"
            rules={[{ required: true, message: "Please enter monthly rent" }]}
          >
            <InputNumber
              min={0}
              formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            name="securityDeposit"
            label="Security Deposit"
            rules={[{ required: true, message: "Please enter security deposit" }]}
          >
            <InputNumber
              min={0}
              formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item name="status" label="Status" rules={[{ required: true, message: "Please select status" }]}>
            <Select placeholder="Select status">
              <Option value="Active">Active</Option>
              <Option value="Draft">Draft</Option>
            </Select>
          </Form.Item>

          <Form.Item name="additionalTerms" label="Additional Terms">
            <Input.TextArea rows={4} placeholder="Enter any additional terms or notes" />
          </Form.Item>
        </Form>
      </Modal>

      {/* View Lease Modal */}
      {selectedLease && (
        <Modal
          title={`Lease Details: ${selectedLease.id}`}
          open={isViewModalVisible}
          onCancel={handleViewCancel}
          width={800}
          footer={[
            <Button key="back" onClick={handleViewCancel}>
              Close
            </Button>,
            <Button
              key="edit"
              type="primary"
              onClick={() => {
                handleViewCancel()
                console.log("Edit lease", selectedLease.key)
              }}
            >
              Edit Lease
            </Button>,
          ]}
        >
          <Tabs defaultActiveKey="details">
            <TabPane
              tab={
                <span>
                  <FileTextOutlined />
                  Lease Details
                </span>
              }
              key="details"
            >
              <Row gutter={24}>
                <Col span={12}>
                  <Card
                    title={
                      <span>
                        <UserOutlined style={{ marginRight: 8 }} />
                        Tenant Information
                      </span>
                    }
                    bordered={false}
                    style={{ marginBottom: 16 }}
                  >
                    <p>
                      <strong>Name:</strong> {selectedLease.tenant}
                    </p>
                    <p>
                      <strong>Email:</strong> tenant@example.com
                    </p>
                    <p>
                      <strong>Phone:</strong> (555) 123-4567
                    </p>
                    <Button type="link" icon={<UserOutlined />} onClick={() => console.log("View tenant profile")}>
                      View Tenant Profile
                    </Button>
                  </Card>
                </Col>
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
                      <strong>Property:</strong> {selectedLease.property}
                    </p>
                    <p>
                      <strong>Address:</strong> 123 Main St, Anytown, USA
                    </p>
                    <p>
                      <strong>Unit:</strong> #101
                    </p>
                    <Button type="link" icon={<HomeOutlined />} onClick={() => console.log("View property details")}>
                      View Property Details
                    </Button>
                  </Card>
                </Col>
              </Row>

              <Card
                title={
                  <span>
                    <CalendarOutlined style={{ marginRight: 8 }} />
                    Lease Terms
                  </span>
                }
                bordered={false}
                style={{ marginBottom: 16 }}
              >
                <Row gutter={24}>
                  <Col span={12}>
                    <p>
                      <strong>Start Date:</strong> {selectedLease.startDate}
                    </p>
                    <p>
                      <strong>End Date:</strong> {selectedLease.endDate}
                    </p>
                    <p>
                      <strong>Monthly Rent:</strong> ${selectedLease.rent.toLocaleString()}
                    </p>
                    <p>
                      <strong>Security Deposit:</strong> ${(selectedLease.rent * 1.5).toLocaleString()}
                    </p>
                  </Col>
                  <Col span={12}>
                    <p>
                      <strong>Status:</strong>{" "}
                      <Tag color={getStatusColor(selectedLease.status)}>{selectedLease.status}</Tag>
                    </p>
                    <p>
                      <strong>Renewal Status:</strong>{" "}
                      <Tag color={getRenewalStatusColor(selectedLease.renewalStatus)}>
                        {selectedLease.renewalStatus}
                      </Tag>
                    </p>
                    <p>
                      <strong>Payment Due Date:</strong> 1st of each month
                    </p>
                    <p>
                      <strong>Late Fee:</strong> $50 after the 5th
                    </p>
                  </Col>
                </Row>
              </Card>

              <Card
                title={
                  <span>
                    <FilePdfOutlined style={{ marginRight: 8 }} />
                    Documents
                  </span>
                }
                bordered={false}
              >
                <div>
                  {selectedLease.documents.map((doc, index) => (
                    <p key={index}>
                      <FilePdfOutlined style={{ marginRight: 8, color: "#f5222d" }} />
                      <a onClick={() => console.log(`View document: ${doc}`)}>{doc}</a>
                    </p>
                  ))}
                  <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    onClick={() => console.log("Add document")}
                    style={{ marginTop: 16 }}
                  >
                    Add Document
                  </Button>
                </div>
              </Card>
            </TabPane>

            <TabPane
              tab={
                <span>
                  <DollarOutlined />
                  Payment History
                </span>
              }
              key="payments"
            >
              <Card bordered={false}>
                <Timeline>
                  <Timeline.Item color="green">
                    <p>
                      <strong>March 2024 Rent</strong> - $2,500
                    </p>
                    <p>Paid on: March 1, 2024</p>
                    <p>Payment Method: Credit Card</p>
                  </Timeline.Item>
                  <Timeline.Item color="green">
                    <p>
                      <strong>February 2024 Rent</strong> - $2,500
                    </p>
                    <p>Paid on: February 2, 2024</p>
                    <p>Payment Method: Bank Transfer</p>
                  </Timeline.Item>
                  <Timeline.Item color="green">
                    <p>
                      <strong>January 2024 Rent</strong> - $2,500
                    </p>
                    <p>Paid on: January 1, 2024</p>
                    <p>Payment Method: Credit Card</p>
                  </Timeline.Item>
                  <Timeline.Item color="green">
                    <p>
                      <strong>December 2023 Rent</strong> - $2,500
                    </p>
                    <p>Paid on: December 1, 2023</p>
                    <p>Payment Method: Credit Card</p>
                  </Timeline.Item>
                  <Timeline.Item color="red">
                    <p>
                      <strong>November 2023 Rent</strong> - $2,500
                    </p>
                    <p>Paid on: November 7, 2023 (Late)</p>
                    <p>Payment Method: Bank Transfer</p>
                    <p>Late Fee: $50</p>
                  </Timeline.Item>
                </Timeline>
              </Card>
            </TabPane>

            <TabPane
              tab={
                <span>
                  <MailOutlined />
                  Communications
                </span>
              }
              key="communications"
            >
              <Card bordered={false}>
                <Timeline>
                  <Timeline.Item color="blue">
                    <p>
                      <strong>Lease Renewal Notice</strong>
                    </p>
                    <p>Sent on: February 15, 2024</p>
                    <p>Status: Delivered</p>
                    <Button type="link" onClick={() => console.log("View message")}>
                      View Message
                    </Button>
                  </Timeline.Item>
                  <Timeline.Item color="blue">
                    <p>
                      <strong>Maintenance Request Update</strong>
                    </p>
                    <p>Sent on: January 10, 2024</p>
                    <p>Status: Delivered</p>
                    <Button type="link" onClick={() => console.log("View message")}>
                      View Message
                    </Button>
                  </Timeline.Item>
                  <Timeline.Item color="blue">
                    <p>
                      <strong>Late Payment Reminder</strong>
                    </p>
                    <p>Sent on: November 6, 2023</p>
                    <p>Status: Delivered</p>
                    <Button type="link" onClick={() => console.log("View message")}>
                      View Message
                    </Button>
                  </Timeline.Item>
                </Timeline>
                <Button
                  type="primary"
                  icon={<MailOutlined />}
                  onClick={() => console.log("Send new message")}
                  style={{ marginTop: 16 }}
                >
                  Send Message
                </Button>
              </Card>
            </TabPane>

            <TabPane
              tab={
                <span>
                  <FileTextOutlined />
                  Renewal
                </span>
              }
              key="renewal"
            >
              <Card bordered={false}>
                <Steps
                  current={getRenewalStatusStep(selectedLease.renewalStatus)}
                  status={selectedLease.renewalStatus === "Declined" ? "error" : "process"}
                  style={{ marginBottom: 32 }}
                >
                  <Steps.Step title="Not Started" description="Renewal process not initiated" />
                  <Steps.Step title="In Progress" description="Renewal offer sent to tenant" />
                  <Steps.Step title="Pending Approval" description="Tenant response received" />
                  <Steps.Step
                    title={selectedLease.renewalStatus === "Declined" ? "Declined" : "Approved"}
                    description={
                      selectedLease.renewalStatus === "Declined" ? "Tenant declined renewal" : "Renewal approved"
                    }
                  />
                </Steps>

                {selectedLease.renewalStatus === "Not Started" ? (
                  <div style={{ textAlign: "center", margin: "32px 0" }}>
                    <p>The lease renewal process has not been initiated yet.</p>
                    <Button
                      type="primary"
                      onClick={() => console.log("Start renewal process")}
                      style={{ marginTop: 16 }}
                    >
                      Start Renewal Process
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Row gutter={24}>
                      <Col span={12}>
                        <Card title="Current Terms" bordered={false}>
                          <p>
                            <strong>Monthly Rent:</strong> ${selectedLease.rent.toLocaleString()}
                          </p>
                          <p>
                            <strong>Lease Period:</strong> {selectedLease.startDate} to {selectedLease.endDate}
                          </p>
                          <p>
                            <strong>Security Deposit:</strong> ${(selectedLease.rent * 1.5).toLocaleString()}
                          </p>
                        </Card>
                      </Col>
                      <Col span={12}>
                        <Card title="Proposed Terms" bordered={false}>
                          <p>
                            <strong>Monthly Rent:</strong> ${(selectedLease.rent * 1.05).toLocaleString()}
                          </p>
                          <p>
                            <strong>Lease Period:</strong> 12 months
                          </p>
                          <p>
                            <strong>Security Deposit:</strong> ${(selectedLease.rent * 1.5).toLocaleString()}{" "}
                            (Unchanged)
                          </p>
                        </Card>
                      </Col>
                    </Row>

                    <Card title="Renewal Timeline" bordered={false} style={{ marginTop: 16 }}>
                      <Timeline>
                        <Timeline.Item color="green">
                          <p>
                            <strong>Renewal Offer Sent</strong>
                          </p>
                          <p>Date: February 15, 2024</p>
                        </Timeline.Item>
                        {selectedLease.renewalStatus !== "In Progress" && (
                          <Timeline.Item color="green">
                            <p>
                              <strong>Tenant Response Received</strong>
                            </p>
                            <p>Date: February 28, 2024</p>
                          </Timeline.Item>
                        )}
                        {selectedLease.renewalStatus === "Approved" && (
                          <Timeline.Item color="green">
                            <p>
                              <strong>Renewal Approved</strong>
                            </p>
                            <p>Date: March 5, 2024</p>
                          </Timeline.Item>
                        )}
                        {selectedLease.renewalStatus === "Declined" && (
                          <Timeline.Item color="red">
                            <p>
                              <strong>Renewal Declined</strong>
                            </p>
                            <p>Date: March 5, 2024</p>
                            <p>Reason: Tenant is relocating</p>
                          </Timeline.Item>
                        )}
                      </Timeline>
                    </Card>
                  </div>
                )}
              </Card>
            </TabPane>
          </Tabs>
        </Modal>
      )}
    </DashboardLayout>
  )
}

export default LeaseManagement

