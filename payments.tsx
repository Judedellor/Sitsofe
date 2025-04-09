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
  Statistic,
  Row,
  Col,
} from "antd"
import {
  SearchOutlined,
  PlusOutlined,
  EyeOutlined,
  DownloadOutlined,
  DollarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons"
import type { ColumnsType } from "antd/es/table"
import DashboardLayout from "../DashboardLayout"

const { Title } = Typography
const { Option } = Select
const { RangePicker } = DatePicker

interface PaymentType {
  key: string
  id: string
  tenant: string
  property: string
  amount: number
  date: string
  dueDate: string
  method: string
  status: string
  type: string
}

const Payments: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [searchText, setSearchText] = useState("")
  const [filteredData, setFilteredData] = useState<PaymentType[]>([])

  // Sample data
  const data: PaymentType[] = [
    {
      key: "1",
      id: "PMT-001",
      tenant: "Sarah Johnson",
      property: "Modern Luxury Apartment",
      amount: 2500,
      date: "2024-03-01",
      dueDate: "2024-03-05",
      method: "Credit Card",
      status: "Paid",
      type: "Rent",
    },
    {
      key: "2",
      id: "PMT-002",
      tenant: "Michael Brown",
      property: "Cozy Studio Loft",
      amount: 1800,
      date: "2024-03-02",
      dueDate: "2024-03-05",
      method: "Bank Transfer",
      status: "Paid",
      type: "Rent",
    },
    {
      key: "3",
      id: "PMT-003",
      tenant: "Emily Davis",
      property: "Downtown Penthouse",
      amount: 3200,
      date: "",
      dueDate: "2024-03-05",
      method: "",
      status: "Overdue",
      type: "Rent",
    },
    {
      key: "4",
      id: "PMT-004",
      tenant: "Robert Wilson",
      property: "Suburban Family Home",
      amount: 2200,
      date: "2024-03-04",
      dueDate: "2024-03-05",
      method: "PayPal",
      status: "Paid",
      type: "Rent",
    },
    {
      key: "5",
      id: "PMT-005",
      tenant: "Jennifer Lopez",
      property: "Beachfront Villa",
      amount: 500,
      date: "2024-03-10",
      dueDate: "2024-03-15",
      method: "Credit Card",
      status: "Paid",
      type: "Maintenance Fee",
    },
    {
      key: "6",
      id: "PMT-006",
      tenant: "David Miller",
      property: "Mountain View Cabin",
      amount: 1500,
      date: "",
      dueDate: "2024-04-05",
      method: "",
      status: "Pending",
      type: "Rent",
    },
  ]

  const showModal = () => {
    setIsModalVisible(true)
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

  const handleSearch = (value: string) => {
    setSearchText(value)
    if (value) {
      const filtered = data.filter(
        (item) =>
          item.tenant.toLowerCase().includes(value.toLowerCase()) ||
          item.property.toLowerCase().includes(value.toLowerCase()) ||
          item.id.toLowerCase().includes(value.toLowerCase()) ||
          item.status.toLowerCase().includes(value.toLowerCase()),
      )
      setFilteredData(filtered)
    } else {
      setFilteredData([])
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "green"
      case "Pending":
        return "blue"
      case "Overdue":
        return "red"
      default:
        return "default"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Paid":
        return <CheckCircleOutlined />
      case "Pending":
        return <ClockCircleOutlined />
      case "Overdue":
        return <CloseCircleOutlined />
      default:
        return null
    }
  }

  const columns: ColumnsType<PaymentType> = [
    {
      title: "Payment ID",
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
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => `$${amount.toLocaleString()}`,
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      sorter: (a, b) => a.dueDate.localeCompare(b.dueDate),
    },
    {
      title: "Payment Date",
      dataIndex: "date",
      key: "date",
      render: (date) => date || "-",
    },
    {
      title: "Method",
      dataIndex: "method",
      key: "method",
      render: (method) => method || "-",
      filters: [
        { text: "Credit Card", value: "Credit Card" },
        { text: "Bank Transfer", value: "Bank Transfer" },
        { text: "PayPal", value: "PayPal" },
      ],
      onFilter: (value, record) => record.method === value,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      filters: [
        { text: "Rent", value: "Rent" },
        { text: "Maintenance Fee", value: "Maintenance Fee" },
        { text: "Deposit", value: "Deposit" },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
          {status}
        </Tag>
      ),
      filters: [
        { text: "Paid", value: "Paid" },
        { text: "Pending", value: "Pending" },
        { text: "Overdue", value: "Overdue" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="View Details">
            <Button type="text" icon={<EyeOutlined />} onClick={() => console.log("View payment", record.key)} />
          </Tooltip>
          <Tooltip title="Download Receipt">
            <Button
              type="text"
              icon={<DownloadOutlined />}
              onClick={() => console.log("Download receipt", record.key)}
              disabled={record.status !== "Paid"}
            />
          </Tooltip>
        </Space>
      ),
    },
  ]

  // Calculate summary statistics
  const totalReceived = data.filter((item) => item.status === "Paid").reduce((sum, item) => sum + item.amount, 0)

  const totalPending = data.filter((item) => item.status === "Pending").reduce((sum, item) => sum + item.amount, 0)

  const totalOverdue = data.filter((item) => item.status === "Overdue").reduce((sum, item) => sum + item.amount, 0)

  return (
    <DashboardLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Title level={2}>Payments</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          Record Payment
        </Button>
      </div>
      <Divider />

      {/* Summary Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="Total Received"
              value={totalReceived}
              precision={2}
              valueStyle={{ color: "#3f8600" }}
              prefix={<DollarOutlined />}
              suffix="USD"
            />
            <div style={{ marginTop: 8 }}>
              <span style={{ fontSize: 14, color: "#3f8600" }}>
                <ArrowUpOutlined /> 12% from last month
              </span>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="Pending Payments"
              value={totalPending}
              precision={2}
              valueStyle={{ color: "#1890ff" }}
              prefix={<DollarOutlined />}
              suffix="USD"
            />
            <div style={{ marginTop: 8 }}>
              <span style={{ fontSize: 14, color: "#1890ff" }}>
                <ArrowDownOutlined /> 5% from last month
              </span>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title="Overdue Payments"
              value={totalOverdue}
              precision={2}
              valueStyle={{ color: "#cf1322" }}
              prefix={<DollarOutlined />}
              suffix="USD"
            />
            <div style={{ marginTop: 8 }}>
              <span style={{ fontSize: 14, color: "#cf1322" }}>
                <ArrowUpOutlined /> 8% from last month
              </span>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Search and Filter Bar */}
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
        <Input.Search
          placeholder="Search payments..."
          allowClear
          enterButton={<SearchOutlined />}
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 300 }}
        />
        <Space>
          <RangePicker />
          <Button icon={<DownloadOutlined />}>Export</Button>
        </Space>
      </div>

      {/* Payments Table */}
      <Card bordered={false}>
        <Table
          columns={columns}
          dataSource={searchText ? filteredData : data}
          rowKey="key"
          pagination={{ pageSize: 10 }}
          summary={(pageData) => {
            let totalAmount = 0
            pageData.forEach(({ amount }) => {
              totalAmount += amount
            })

            return (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={3}>
                  Total
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  <Text strong>${totalAmount.toLocaleString()}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2} colSpan={6}></Table.Summary.Cell>
              </Table.Summary.Row>
            )
          }}
        />
      </Card>

      {/* Record Payment Modal */}
      <Modal
        title="Record Payment"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={700}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Record Payment
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" name="payment_form">
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

          <Form.Item name="amount" label="Amount" rules={[{ required: true, message: "Please enter amount" }]}>
            <InputNumber
              min={0}
              formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            name="type"
            label="Payment Type"
            rules={[{ required: true, message: "Please select payment type" }]}
          >
            <Select placeholder="Select payment type">
              <Option value="Rent">Rent</Option>
              <Option value="Maintenance Fee">Maintenance Fee</Option>
              <Option value="Deposit">Deposit</Option>
              <Option value="Late Fee">Late Fee</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="method"
            label="Payment Method"
            rules={[{ required: true, message: "Please select payment method" }]}
          >
            <Select placeholder="Select payment method">
              <Option value="Credit Card">Credit Card</Option>
              <Option value="Bank Transfer">Bank Transfer</Option>
              <Option value="PayPal">PayPal</Option>
              <Option value="Cash">Cash</Option>
              <Option value="Check">Check</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="date"
            label="Payment Date"
            rules={[{ required: true, message: "Please select payment date" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="notes" label="Notes">
            <Input.TextArea rows={4} placeholder="Enter any additional notes" />
          </Form.Item>
        </Form>
      </Modal>
    </DashboardLayout>
  )
}

export default Payments

