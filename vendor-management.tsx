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
  Typography,
  Divider,
  Tooltip,
  Rate,
  Avatar,
  Tabs,
  Row,
  Col,
  Statistic,
  Badge,
} from "antd"
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PhoneOutlined,
  MailOutlined,
  ToolOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  TeamOutlined,
  FileTextOutlined,
  UserOutlined,
  FilePdfOutlined,
} from "@ant-design/icons"
import type { ColumnsType } from "antd/es/table"
import DashboardLayout from "../DashboardLayout"

const { Title, Text } = Typography
const { Option } = Select
const { TabPane } = Tabs
const { TextArea } = Input

interface VendorType {
  key: string
  name: string
  category: string
  contact: string
  email: string
  phone: string
  rating: number
  status: string
  completedJobs: number
  pendingJobs: number
}

interface WorkOrderType {
  key: string
  id: string
  property: string
  description: string
  date: string
  status: string
  cost: number
}

const VendorManagement: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isViewModalVisible, setIsViewModalVisible] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState<VendorType | null>(null)
  const [form] = Form.useForm()
  const [searchText, setSearchText] = useState("")
  const [filteredData, setFilteredData] = useState<VendorType[]>([])

  // Sample data
  const data: VendorType[] = [
    {
      key: "1",
      name: "Quick Fix Plumbing",
      category: "Plumbing",
      contact: "John Smith",
      email: "john@quickfixplumbing.com",
      phone: "(555) 123-4567",
      rating: 4.5,
      status: "Active",
      completedJobs: 28,
      pendingJobs: 2,
    },
    {
      key: "2",
      name: "Elite Electrical Services",
      category: "Electrical",
      contact: "Sarah Johnson",
      email: "sarah@eliteelectrical.com",
      phone: "(555) 234-5678",
      rating: 4.8,
      status: "Active",
      completedJobs: 35,
      pendingJobs: 1,
    },
    {
      key: "3",
      name: "Green Lawn Care",
      category: "Landscaping",
      contact: "Mike Wilson",
      email: "mike@greenlawn.com",
      phone: "(555) 345-6789",
      rating: 4.2,
      status: "Active",
      completedJobs: 42,
      pendingJobs: 3,
    },
    {
      key: "4",
      name: "Comfort HVAC Solutions",
      category: "HVAC",
      contact: "David Brown",
      email: "david@comforthvac.com",
      phone: "(555) 456-7890",
      rating: 4.7,
      status: "Active",
      completedJobs: 31,
      pendingJobs: 0,
    },
    {
      key: "5",
      name: "Secure Lock & Key",
      category: "Security",
      contact: "Lisa Chen",
      email: "lisa@securelock.com",
      phone: "(555) 567-8901",
      rating: 4.6,
      status: "Active",
      completedJobs: 19,
      pendingJobs: 1,
    },
    {
      key: "6",
      name: "Fresh Paint Pros",
      category: "Painting",
      contact: "Robert Davis",
      email: "robert@freshpaint.com",
      phone: "(555) 678-9012",
      rating: 4.3,
      status: "Inactive",
      completedJobs: 15,
      pendingJobs: 0,
    },
  ]

  // Sample work orders for selected vendor
  const workOrders: WorkOrderType[] = [
    {
      key: "1",
      id: "WO-001",
      property: "Modern Luxury Apartment",
      description: "Leaking faucet in master bathroom",
      date: "2024-03-10",
      status: "Completed",
      cost: 150,
    },
    {
      key: "2",
      id: "WO-002",
      property: "Cozy Studio Loft",
      description: "Replace kitchen sink",
      date: "2024-03-05",
      status: "Completed",
      cost: 350,
    },
    {
      key: "3",
      id: "WO-003",
      property: "Downtown Penthouse",
      description: "Fix clogged drain in shower",
      date: "2024-02-28",
      status: "Completed",
      cost: 120,
    },
    {
      key: "4",
      id: "WO-004",
      property: "Suburban Family Home",
      description: "Install new water heater",
      date: "2024-02-15",
      status: "Completed",
      cost: 850,
    },
    {
      key: "5",
      id: "WO-005",
      property: "Modern Luxury Apartment",
      description: "Repair toilet in guest bathroom",
      date: "2024-03-15",
      status: "In Progress",
      cost: 200,
    },
    {
      key: "6",
      id: "WO-006",
      property: "Beachfront Villa",
      description: "Fix leaking pipe under kitchen sink",
      date: "2024-03-20",
      status: "Scheduled",
      cost: 180,
    },
  ]

  const showModal = () => {
    setIsModalVisible(true)
  }

  const showViewModal = (record: VendorType) => {
    setSelectedVendor(record)
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
    setSelectedVendor(null)
  }

  const handleSearch = (value: string) => {
    setSearchText(value)
    if (value) {
      const filtered = data.filter(
        (item) =>
          item.name.toLowerCase().includes(value.toLowerCase()) ||
          item.category.toLowerCase().includes(value.toLowerCase()) ||
          item.contact.toLowerCase().includes(value.toLowerCase()),
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
      case "Inactive":
        return "red"
      default:
        return "default"
    }
  }

  const getWorkOrderStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "green"
      case "In Progress":
        return "blue"
      case "Scheduled":
        return "orange"
      default:
        return "default"
    }
  }

  const columns: ColumnsType<VendorType> = [
    {
      title: "Vendor Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      filters: [
        { text: "Plumbing", value: "Plumbing" },
        { text: "Electrical", value: "Electrical" },
        { text: "HVAC", value: "HVAC" },
        { text: "Landscaping", value: "Landscaping" },
        { text: "Security", value: "Security" },
        { text: "Painting", value: "Painting" },
      ],
      onFilter: (value, record) => record.category === value,
    },
    {
      title: "Contact",
      dataIndex: "contact",
      key: "contact",
    },
    {
      title: "Contact Info",
      key: "contactInfo",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Space>
            <MailOutlined />
            <a href={`mailto:${record.email}`}>{record.email}</a>
          </Space>
          <Space>
            <PhoneOutlined />
            <a href={`tel:${record.phone}`}>{record.phone}</a>
          </Space>
        </Space>
      ),
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (rating) => <Rate disabled defaultValue={rating} allowHalf />,
      sorter: (a, b) => a.rating - b.rating,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
      filters: [
        { text: "Active", value: "Active" },
        { text: "Inactive", value: "Inactive" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Jobs",
      key: "jobs",
      render: (_, record) => (
        <Space>
          <Badge status="success" text={`${record.completedJobs} completed`} />
          {record.pendingJobs > 0 && <Badge status="processing" text={`${record.pendingJobs} pending`} />}
        </Space>
      ),
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
            <Button type="text" icon={<EditOutlined />} onClick={() => console.log("Edit vendor", record.key)} />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => console.log("Delete vendor", record.key)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ]

  const workOrderColumns: ColumnsType<WorkOrderType> = [
    {
      title: "Work Order ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Property",
      dataIndex: "property",
      key: "property",
      ellipsis: true,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => a.date.localeCompare(b.date),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={getWorkOrderStatusColor(status)}>{status}</Tag>,
    },
    {
      title: "Cost",
      dataIndex: "cost",
      key: "cost",
      render: (cost) => `$${cost.toLocaleString()}`,
      sorter: (a, b) => a.cost - b.cost,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button type="text" icon={<EyeOutlined />} onClick={() => console.log("View work order", record.key)} />
        </Space>
      ),
    },
  ]

  // Calculate summary statistics
  const totalVendors = data.length
  const activeVendors = data.filter((vendor) => vendor.status === "Active").length
  const totalCompletedJobs = data.reduce((sum, vendor) => sum + vendor.completedJobs, 0)
  const totalPendingJobs = data.reduce((sum, vendor) => sum + vendor.pendingJobs, 0)

  return (
    <DashboardLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Title level={2}>Vendor Management</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          Add Vendor
        </Button>
      </div>
      <Divider />

      {/* Summary Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic title="Total Vendors" value={totalVendors} prefix={<TeamOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Active Vendors"
              value={activeVendors}
              valueStyle={{ color: "#52c41a" }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Completed Jobs"
              value={totalCompletedJobs}
              valueStyle={{ color: "#1890ff" }}
              prefix={<ToolOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Pending Jobs"
              value={totalPendingJobs}
              valueStyle={{ color: "#faad14" }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Search Bar */}
      <div style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Search vendors..."
          allowClear
          enterButton={<SearchOutlined />}
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 300 }}
        />
      </div>

      {/* Vendors Table */}
      <Card bordered={false}>
        <Table
          columns={columns}
          dataSource={searchText ? filteredData : data}
          rowKey="key"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Add Vendor Modal */}
      <Modal
        title="Add New Vendor"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={700}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Add Vendor
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" name="vendor_form">
          <Form.Item name="name" label="Vendor Name" rules={[{ required: true, message: "Please enter vendor name" }]}>
            <Input placeholder="Enter vendor name" />
          </Form.Item>

          <Form.Item name="category" label="Category" rules={[{ required: true, message: "Please select category" }]}>
            <Select placeholder="Select category">
              <Option value="Plumbing">Plumbing</Option>
              <Option value="Electrical">Electrical</Option>
              <Option value="HVAC">HVAC</Option>
              <Option value="Landscaping">Landscaping</Option>
              <Option value="Security">Security</Option>
              <Option value="Painting">Painting</Option>
              <Option value="Cleaning">Cleaning</Option>
              <Option value="Carpentry">Carpentry</Option>
              <Option value="Roofing">Roofing</Option>
              <Option value="Flooring">Flooring</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="contact"
            label="Contact Person"
            rules={[{ required: true, message: "Please enter contact person" }]}
          >
            <Input placeholder="Enter contact person name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input placeholder="Enter email address" />
          </Form.Item>

          <Form.Item name="phone" label="Phone" rules={[{ required: true, message: "Please enter phone number" }]}>
            <Input placeholder="Enter phone number" />
          </Form.Item>

          <Form.Item name="address" label="Address">
            <Input.TextArea rows={2} placeholder="Enter address" />
          </Form.Item>

          <Form.Item name="status" label="Status" rules={[{ required: true, message: "Please select status" }]}>
            <Select placeholder="Select status">
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
          </Form.Item>

          <Form.Item name="notes" label="Notes">
            <TextArea rows={4} placeholder="Enter any additional notes" />
          </Form.Item>
        </Form>
      </Modal>

      {/* View Vendor Modal */}
      {selectedVendor && (
        <Modal
          title={`Vendor Details: ${selectedVendor.name}`}
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
                console.log("Edit vendor", selectedVendor.key)
              }}
            >
              Edit Vendor
            </Button>,
          ]}
        >
          <Tabs defaultActiveKey="details">
            <TabPane
              tab={
                <span>
                  <UserOutlined />
                  Vendor Details
                </span>
              }
              key="details"
            >
              <Row gutter={24}>
                <Col span={16}>
                  <Card bordered={false} style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
                      <Avatar size={64} icon={<UserOutlined />} style={{ marginRight: 16 }} />
                      <div>
                        <Title level={4} style={{ margin: 0 }}>
                          {selectedVendor.name}
                        </Title>
                        <Tag color="blue">{selectedVendor.category}</Tag>
                        <Tag color={getStatusColor(selectedVendor.status)}>{selectedVendor.status}</Tag>
                      </div>
                    </div>
                    <Divider style={{ margin: "12px 0" }} />
                    <div>
                      <p>
                        <strong>Contact Person:</strong> {selectedVendor.contact}
                      </p>
                      <p>
                        <strong>Email:</strong> <a href={`mailto:${selectedVendor.email}`}>{selectedVendor.email}</a>
                      </p>
                      <p>
                        <strong>Phone:</strong> <a href={`tel:${selectedVendor.phone}`}>{selectedVendor.phone}</a>
                      </p>
                      <p>
                        <strong>Address:</strong> 123 Business St, Suite 101, Anytown, USA
                      </p>
                    </div>
                  </Card>
                  <Card title="Services Offered" bordered={false}>
                    <ul>
                      <li>Emergency repairs</li>
                      <li>Routine maintenance</li>
                      <li>Installations</li>
                      <li>Inspections</li>
                      <li>Consultations</li>
                    </ul>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card title="Performance" bordered={false} style={{ marginBottom: 16 }}>
                    <div style={{ marginBottom: 16 }}>
                      <Text>Overall Rating</Text>
                      <div>
                        <Rate disabled defaultValue={selectedVendor.rating} allowHalf />
                        <span style={{ marginLeft: 8 }}>{selectedVendor.rating}/5</span>
                      </div>
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <Text>Response Time</Text>
                      <div>
                        <Rate disabled defaultValue={4} allowHalf />
                        <span style={{ marginLeft: 8 }}>4/5</span>
                      </div>
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <Text>Quality of Work</Text>
                      <div>
                        <Rate disabled defaultValue={4.5} allowHalf />
                        <span style={{ marginLeft: 8 }}>4.5/5</span>
                      </div>
                    </div>
                    <div>
                      <Text>Value for Money</Text>
                      <div>
                        <Rate disabled defaultValue={4} allowHalf />
                        <span style={{ marginLeft: 8 }}>4/5</span>
                      </div>
                    </div>
                  </Card>
                  <Card title="Statistics" bordered={false}>
                    <Statistic
                      title="Completed Jobs"
                      value={selectedVendor.completedJobs}
                      valueStyle={{ color: "#3f8600" }}
                      prefix={<CheckCircleOutlined />}
                      style={{ marginBottom: 16 }}
                    />
                    <Statistic
                      title="Pending Jobs"
                      value={selectedVendor.pendingJobs}
                      valueStyle={{ color: "#1890ff" }}
                      prefix={<ClockCircleOutlined />}
                      style={{ marginBottom: 16 }}
                    />
                    <Statistic
                      title="Average Cost per Job"
                      value={275}
                      valueStyle={{ color: "#722ed1" }}
                      prefix={<DollarOutlined />}
                    />
                  </Card>
                </Col>
              </Row>
            </TabPane>

            <TabPane
              tab={
                <span>
                  <ToolOutlined />
                  Work Orders
                </span>
              }
              key="workOrders"
            >
              <Card bordered={false}>
                <Table columns={workOrderColumns} dataSource={workOrders} rowKey="key" pagination={{ pageSize: 5 }} />
              </Card>
            </TabPane>

            <TabPane
              tab={
                <span>
                  <FileTextOutlined />
                  Documents
                </span>
              }
              key="documents"
            >
              <Card bordered={false}>
                <div style={{ marginBottom: 16 }}>
                  <p>
                    <FilePdfOutlined style={{ marginRight: 8, color: "#f5222d" }} />
                    <a onClick={() => console.log("View document")}>Vendor Agreement.pdf</a>
                  </p>
                  <p>
                    <FilePdfOutlined style={{ marginRight: 8, color: "#f5222d" }} />
                    <a onClick={() => console.log("View document")}>Insurance Certificate.pdf</a>
                  </p>
                  <p>
                    <FilePdfOutlined style={{ marginRight: 8, color: "#f5222d" }} />
                    <a onClick={() => console.log("View document")}>W-9 Form.pdf</a>
                  </p>
                  <p>
                    <FilePdfOutlined style={{ marginRight: 8, color: "#f5222d" }} />
                    <a onClick={() => console.log("View document")}>Service Price List.pdf</a>
                  </p>
                </div>
                <Button type="dashed" icon={<PlusOutlined />} onClick={() => console.log("Add document")}>
                  Add Document
                </Button>
              </Card>
            </TabPane>

            <TabPane
              tab={
                <span>
                  <DollarOutlined />
                  Billing History
                </span>
              }
              key="billing"
            >
              <Card bordered={false}>
                <Table
                  columns={[
                    {
                      title: "Invoice #",
                      dataIndex: "invoice",
                      key: "invoice",
                    },
                    {
                      title: "Date",
                      dataIndex: "date",
                      key: "date",
                      sorter: (a: any, b: any) => a.date.localeCompare(b.date),
                    },
                    {
                      title: "Amount",
                      dataIndex: "amount",
                      key: "amount",
                      render: (amount: number) => `$${amount.toLocaleString()}`,
                      sorter: (a: any, b: any) => a.amount - b.amount,
                    },
                    {
                      title: "Status",
                      dataIndex: "status",
                      key: "status",
                      render: (status: string) => <Tag color={status === "Paid" ? "green" : "red"}>{status}</Tag>,
                    },
                    {
                      title: "Actions",
                      key: "actions",
                      render: (_: any, record: any) => (
                        <Button type="link" onClick={() => console.log("View invoice", record.invoice)}>
                          View
                        </Button>
                      ),
                    },
                  ]}
                  dataSource={[
                    {
                      key: "1",
                      invoice: "INV-001",
                      date: "2024-03-15",
                      amount: 350,
                      status: "Paid",
                    },
                    {
                      key: "2",
                      invoice: "INV-002",
                      date: "2024-03-05",
                      amount: 120,
                      status: "Paid",
                    },
                    {
                      key: "3",
                      invoice: "INV-003",
                      date: "2024-02-20",
                      amount: 850,
                      status: "Paid",
                    },
                    {
                      key: "4",
                      invoice: "INV-004",
                      date: "2024-03-20",
                      amount: 180,
                      status: "Pending",
                    },
                  ]}
                  rowKey="key"
                  pagination={false}
                />
              </Card>
            </TabPane>
          </Tabs>
        </Modal>
      )}
    </DashboardLayout>
  )
}

export default VendorManagement

