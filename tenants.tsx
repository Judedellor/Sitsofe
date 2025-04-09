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
  Typography,
  Divider,
  Avatar,
  Tooltip,
  Badge,
} from "antd"
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons"
import type { ColumnsType } from "antd/es/table"
import DashboardLayout from "../DashboardLayout"

const { Title } = Typography
const { Option } = Select

interface TenantType {
  key: string
  name: string
  email: string
  phone: string
  property: string
  leaseStart: string
  leaseEnd: string
  status: string
  rentStatus: string
}

const Tenants: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [searchText, setSearchText] = useState("")
  const [filteredData, setFilteredData] = useState<TenantType[]>([])

  // Sample data
  const data: TenantType[] = [
    {
      key: "1",
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      phone: "(555) 123-4567",
      property: "Modern Luxury Apartment",
      leaseStart: "2023-06-01",
      leaseEnd: "2024-05-31",
      status: "Active",
      rentStatus: "Paid",
    },
    {
      key: "2",
      name: "Michael Brown",
      email: "michael.brown@example.com",
      phone: "(555) 234-5678",
      property: "Cozy Studio Loft",
      leaseStart: "2023-08-15",
      leaseEnd: "2024-08-14",
      status: "Active",
      rentStatus: "Paid",
    },
    {
      key: "3",
      name: "Emily Davis",
      email: "emily.davis@example.com",
      phone: "(555) 345-6789",
      property: "Downtown Penthouse",
      leaseStart: "2023-04-01",
      leaseEnd: "2024-03-31",
      status: "Active",
      rentStatus: "Late",
    },
    {
      key: "4",
      name: "Robert Wilson",
      email: "robert.wilson@example.com",
      phone: "(555) 456-7890",
      property: "Suburban Family Home",
      leaseStart: "2023-09-01",
      leaseEnd: "2024-08-31",
      status: "Active",
      rentStatus: "Paid",
    },
    {
      key: "5",
      name: "Jennifer Lopez",
      email: "jennifer.lopez@example.com",
      phone: "(555) 567-8901",
      property: "Beachfront Villa",
      leaseStart: "2023-01-15",
      leaseEnd: "2023-12-31",
      status: "Ending Soon",
      rentStatus: "Paid",
    },
    {
      key: "6",
      name: "David Miller",
      email: "david.miller@example.com",
      phone: "(555) 678-9012",
      property: "Mountain View Cabin",
      leaseStart: "2022-11-01",
      leaseEnd: "2023-10-31",
      status: "Inactive",
      rentStatus: "N/A",
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
          item.name.toLowerCase().includes(value.toLowerCase()) ||
          item.email.toLowerCase().includes(value.toLowerCase()) ||
          item.property.toLowerCase().includes(value.toLowerCase()),
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
      case "Inactive":
        return "red"
      default:
        return "default"
    }
  }

  const getRentStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "green"
      case "Late":
        return "red"
      case "Pending":
        return "orange"
      default:
        return "default"
    }
  }

  const columns: ColumnsType<TenantType> = [
    {
      title: "Tenant",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          {text}
        </Space>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Contact",
      key: "contact",
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
          {record.leaseStart} to {record.leaseEnd}
        </span>
      ),
      sorter: (a, b) => a.leaseEnd.localeCompare(b.leaseEnd),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
      filters: [
        { text: "Active", value: "Active" },
        { text: "Ending Soon", value: "Ending Soon" },
        { text: "Inactive", value: "Inactive" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Rent Status",
      dataIndex: "rentStatus",
      key: "rentStatus",
      render: (status) =>
        status === "N/A" ? (
          <span>N/A</span>
        ) : (
          <Badge status={status === "Paid" ? "success" : status === "Late" ? "error" : "warning"} text={status} />
        ),
      filters: [
        { text: "Paid", value: "Paid" },
        { text: "Late", value: "Late" },
        { text: "Pending", value: "Pending" },
      ],
      onFilter: (value, record) => record.rentStatus === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="View Details">
            <Button type="text" icon={<EyeOutlined />} onClick={() => console.log("View tenant", record.key)} />
          </Tooltip>
          <Tooltip title="Edit">
            <Button type="text" icon={<EditOutlined />} onClick={() => console.log("Edit tenant", record.key)} />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => console.log("Delete tenant", record.key)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ]

  return (
    <DashboardLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Title level={2}>Tenants</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          Add Tenant
        </Button>
      </div>
      <Divider />

      {/* Search Bar */}
      <div style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Search tenants..."
          allowClear
          enterButton={<SearchOutlined />}
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 300 }}
        />
      </div>

      {/* Tenants Table */}
      <Card bordered={false}>
        <Table
          columns={columns}
          dataSource={searchText ? filteredData : data}
          rowKey="key"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Add Tenant Modal */}
      <Modal
        title="Add New Tenant"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={700}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Add Tenant
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" name="tenant_form">
          <Form.Item name="name" label="Full Name" rules={[{ required: true, message: "Please enter tenant name" }]}>
            <Input placeholder="Enter tenant name" />
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

          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[{ required: true, message: "Please enter phone number" }]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>

          <Form.Item
            name="property"
            label="Assigned Property"
            rules={[{ required: true, message: "Please select a property" }]}
          >
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
            <DatePicker.RangePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="status" label="Status" rules={[{ required: true, message: "Please select tenant status" }]}>
            <Select placeholder="Select status">
              <Option value="Active">Active</Option>
              <Option value="Ending Soon">Ending Soon</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="rentStatus"
            label="Rent Status"
            rules={[{ required: true, message: "Please select rent status" }]}
          >
            <Select placeholder="Select rent status">
              <Option value="Paid">Paid</Option>
              <Option value="Pending">Pending</Option>
              <Option value="Late">Late</Option>
              <Option value="N/A">N/A</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </DashboardLayout>
  )
}

export default Tenants

