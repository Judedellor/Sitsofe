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
  Steps,
  Avatar,
  Tooltip,
  Progress,
} from "antd"
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  ToolOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
} from "@ant-design/icons"
import type { ColumnsType } from "antd/es/table"
import DashboardLayout from "../DashboardLayout"

const { Title, Text } = Typography
const { Option } = Select
const { TextArea } = Input

interface MaintenanceRequestType {
  key: string
  title: string
  property: string
  tenant: string
  category: string
  priority: string
  status: string
  dateSubmitted: string
  assignedTo: string
  completionPercentage: number
}

const Maintenance: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isViewModalVisible, setIsViewModalVisible] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequestType | null>(null)
  const [form] = Form.useForm()
  const [searchText, setSearchText] = useState("")
  const [filteredData, setFilteredData] = useState<MaintenanceRequestType[]>([])

  // Sample data
  const data: MaintenanceRequestType[] = [
    {
      key: "1",
      title: "Leaking Faucet",
      property: "Modern Luxury Apartment",
      tenant: "Sarah Johnson",
      category: "Plumbing",
      priority: "Medium",
      status: "In Progress",
      dateSubmitted: "2024-03-10",
      assignedTo: "John Doe",
      completionPercentage: 50,
    },
    {
      key: "2",
      title: "Broken Air Conditioner",
      property: "Cozy Studio Loft",
      tenant: "Michael Brown",
      category: "HVAC",
      priority: "High",
      status: "Open",
      dateSubmitted: "2024-03-12",
      assignedTo: "Unassigned",
      completionPercentage: 0,
    },
    {
      key: "3",
      title: "Electrical Outlet Not Working",
      property: "Downtown Penthouse",
      tenant: "Emily Davis",
      category: "Electrical",
      priority: "High",
      status: "In Progress",
      dateSubmitted: "2024-03-08",
      assignedTo: "Jane Smith",
      completionPercentage: 75,
    },
    {
      key: "4",
      title: "Garbage Disposal Jammed",
      property: "Suburban Family Home",
      tenant: "Robert Wilson",
      category: "Appliance",
      priority: "Low",
      status: "Completed",
      dateSubmitted: "2024-03-05",
      assignedTo: "John Doe",
      completionPercentage: 100,
    },
    {
      key: "5",
      title: "Roof Leak",
      property: "Beachfront Villa",
      tenant: "Jennifer Lopez",
      category: "Structural",
      priority: "Critical",
      status: "In Progress",
      dateSubmitted: "2024-03-11",
      assignedTo: "Mike Johnson",
      completionPercentage: 30,
    },
    {
      key: "6",
      title: "Broken Window",
      property: "Mountain View Cabin",
      tenant: "David Miller",
      category: "Structural",
      priority: "Medium",
      status: "Scheduled",
      dateSubmitted: "2024-03-09",
      assignedTo: "Jane Smith",
      completionPercentage: 10,
    },
  ]

  const showModal = () => {
    setIsModalVisible(true)
  }

  const showViewModal = (record: MaintenanceRequestType) => {
    setSelectedRequest(record)
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
    setSelectedRequest(null)
  }

  const handleSearch = (value: string) => {
    setSearchText(value)
    if (value) {
      const filtered = data.filter(
        (item) =>
          item.title.toLowerCase().includes(value.toLowerCase()) ||
          item.property.toLowerCase().includes(value.toLowerCase()) ||
          item.tenant.toLowerCase().includes(value.toLowerCase()) ||
          item.category.toLowerCase().includes(value.toLowerCase()),
      )
      setFilteredData(filtered)
    } else {
      setFilteredData([])
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "#f5222d"
      case "High":
        return "#fa8c16"
      case "Medium":
        return "#faad14"
      case "Low":
        return "#52c41a"
      default:
        return "#1890ff"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "blue"
      case "Scheduled":
        return "purple"
      case "In Progress":
        return "orange"
      case "Completed":
        return "green"
      default:
        return "default"
    }
  }

  const getStatusStep = (status: string) => {
    switch (status) {
      case "Open":
        return 0
      case "Scheduled":
        return 1
      case "In Progress":
        return 2
      case "Completed":
        return 3
      default:
        return 0
    }
  }

  const columns: ColumnsType<MaintenanceRequestType> = [
    {
      title: "Request",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Property",
      dataIndex: "property",
      key: "property",
      ellipsis: true,
    },
    {
      title: "Tenant",
      dataIndex: "tenant",
      key: "tenant",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      filters: [
        { text: "Plumbing", value: "Plumbing" },
        { text: "Electrical", value: "Electrical" },
        { text: "HVAC", value: "HVAC" },
        { text: "Appliance", value: "Appliance" },
        { text: "Structural", value: "Structural" },
      ],
      onFilter: (value, record) => record.category === value,
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (priority) => (
        <Tag color={getPriorityColor(priority)} style={{ fontWeight: 500 }}>
          {priority}
        </Tag>
      ),
      filters: [
        { text: "Critical", value: "Critical" },
        { text: "High", value: "High" },
        { text: "Medium", value: "Medium" },
        { text: "Low", value: "Low" },
      ],
      onFilter: (value, record) => record.priority === value,
      sorter: (a, b) => {
        const priorityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 }
        return (
          priorityOrder[a.priority as keyof typeof priorityOrder] -
          priorityOrder[b.priority as keyof typeof priorityOrder]
        )
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
      filters: [
        { text: "Open", value: "Open" },
        { text: "Scheduled", value: "Scheduled" },
        { text: "In Progress", value: "In Progress" },
        { text: "Completed", value: "Completed" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Date",
      dataIndex: "dateSubmitted",
      key: "dateSubmitted",
      sorter: (a, b) => a.dateSubmitted.localeCompare(b.dateSubmitted),
    },
    {
      title: "Progress",
      key: "progress",
      render: (_, record) => (
        <Progress
          percent={record.completionPercentage}
          size="small"
          status={record.completionPercentage === 100 ? "success" : "active"}
        />
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
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => console.log("Edit maintenance request", record.key)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ]

  return (
    <DashboardLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Title level={2}>Maintenance Requests</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          New Request
        </Button>
      </div>
      <Divider />

      {/* Search Bar */}
      <div style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Search maintenance requests..."
          allowClear
          enterButton={<SearchOutlined />}
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 300 }}
        />
      </div>

      {/* Maintenance Requests Table */}
      <Card bordered={false}>
        <Table
          columns={columns}
          dataSource={searchText ? filteredData : data}
          rowKey="key"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Add Maintenance Request Modal */}
      <Modal
        title="Create Maintenance Request"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={700}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Create Request
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" name="maintenance_form">
          <Form.Item
            name="title"
            label="Request Title"
            rules={[{ required: true, message: "Please enter request title" }]}
          >
            <Input placeholder="Enter request title" />
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

          <Form.Item name="category" label="Category" rules={[{ required: true, message: "Please select category" }]}>
            <Select placeholder="Select category">
              <Option value="Plumbing">Plumbing</Option>
              <Option value="Electrical">Electrical</Option>
              <Option value="HVAC">HVAC</Option>
              <Option value="Appliance">Appliance</Option>
              <Option value="Structural">Structural</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item name="priority" label="Priority" rules={[{ required: true, message: "Please select priority" }]}>
            <Select placeholder="Select priority">
              <Option value="Critical">Critical</Option>
              <Option value="High">High</Option>
              <Option value="Medium">Medium</Option>
              <Option value="Low">Low</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <TextArea rows={4} placeholder="Describe the maintenance issue" />
          </Form.Item>

          <Form.Item name="assignedTo" label="Assign To">
            <Select placeholder="Select maintenance staff">
              <Option value="John Doe">John Doe</Option>
              <Option value="Jane Smith">Jane Smith</Option>
              <Option value="Mike Johnson">Mike Johnson</Option>
              <Option value="Unassigned">Unassigned</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Maintenance Request Modal */}
      {selectedRequest && (
        <Modal
          title={`Maintenance Request: ${selectedRequest.title}`}
          open={isViewModalVisible}
          onCancel={handleViewCancel}
          width={700}
          footer={[
            <Button key="back" onClick={handleViewCancel}>
              Close
            </Button>,
            <Button
              key="edit"
              type="primary"
              onClick={() => {
                handleViewCancel()
                console.log("Edit maintenance request", selectedRequest.key)
              }}
            >
              Edit Request
            </Button>,
          ]}
        >
          <div style={{ marginBottom: 24 }}>
            <Steps
              current={getStatusStep(selectedRequest.status)}
              items={[
                {
                  title: "Open",
                  icon: <ExclamationCircleOutlined />,
                },
                {
                  title: "Scheduled",
                  icon: <ClockCircleOutlined />,
                },
                {
                  title: "In Progress",
                  icon: <ToolOutlined />,
                },
                {
                  title: "Completed",
                  icon: <CheckCircleOutlined />,
                },
              ]}
            />
          </div>

          <Card bordered={false} style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <Text type="secondary">Property</Text>
                <div>{selectedRequest.property}</div>
              </div>
              <div>
                <Text type="secondary">Tenant</Text>
                <div>{selectedRequest.tenant}</div>
              </div>
              <div>
                <Text type="secondary">Date Submitted</Text>
                <div>{selectedRequest.dateSubmitted}</div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <Text type="secondary">Category</Text>
                <div>{selectedRequest.category}</div>
              </div>
              <div>
                <Text type="secondary">Priority</Text>
                <div>
                  <Tag color={getPriorityColor(selectedRequest.priority)}>{selectedRequest.priority}</Tag>
                </div>
              </div>
              <div>
                <Text type="secondary">Status</Text>
                <div>
                  <Tag color={getStatusColor(selectedRequest.status)}>{selectedRequest.status}</Tag>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Text type="secondary">Assigned To</Text>
              <div style={{ display: "flex", alignItems: "center", marginTop: 4 }}>
                <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
                {selectedRequest.assignedTo}
              </div>
            </div>

            <div>
              <Text type="secondary">Progress</Text>
              <Progress
                percent={selectedRequest.completionPercentage}
                status={selectedRequest.completionPercentage === 100 ? "success" : "active"}
              />
            </div>
          </Card>

          <Card title="Description" bordered={false} style={{ marginBottom: 16 }}>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, urna eu tincidunt consectetur, nisl
              nunc euismod nisi, eu porttitor nisl nisl euismod nisi. Sed euismod, urna eu tincidunt consectetur, nisl
              nunc euismod nisi, eu porttitor nisl nisl euismod nisi.
            </p>
          </Card>

          <Card title="Activity Log" bordered={false}>
            <Steps
              direction="vertical"
              size="small"
              current={3}
              items={[
                {
                  title: "Request Created",
                  description: `${selectedRequest.dateSubmitted} by ${selectedRequest.tenant}`,
                },
                {
                  title: "Request Assigned",
                  description: `2024-03-11 by Admin`,
                },
                {
                  title: "Work Started",
                  description: `2024-03-12 by ${selectedRequest.assignedTo}`,
                },
                {
                  title: "Status Updated",
                  description: `2024-03-13 by ${selectedRequest.assignedTo}`,
                },
              ]}
            />
          </Card>
        </Modal>
      )}
    </DashboardLayout>
  )
}

export default Maintenance

