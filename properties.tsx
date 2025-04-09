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
  InputNumber,
  Upload,
  Typography,
  Divider,
  Tooltip,
  Dropdown,
} from "antd"
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  FilterOutlined,
  SortAscendingOutlined,
} from "@ant-design/icons"
import type { ColumnsType } from "antd/es/table"
import DashboardLayout from "../DashboardLayout"

const { Title } = Typography
const { Option } = Select

interface PropertyType {
  key: string
  name: string
  address: string
  type: string
  units: number
  status: string
  occupancy: number
  rent: number
}

const Properties: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [searchText, setSearchText] = useState("")
  const [filteredData, setFilteredData] = useState<PropertyType[]>([])

  // Sample data
  const data: PropertyType[] = [
    {
      key: "1",
      name: "Modern Luxury Apartment",
      address: "123 Downtown Ave, New York, NY 10001",
      type: "Apartment",
      units: 12,
      status: "Active",
      occupancy: 92,
      rent: 2500,
    },
    {
      key: "2",
      name: "Cozy Studio Loft",
      address: "456 Arts District, Los Angeles, CA 90013",
      type: "Studio",
      units: 8,
      status: "Active",
      occupancy: 75,
      rent: 1800,
    },
    {
      key: "3",
      name: "Downtown Penthouse",
      address: "789 Financial District, San Francisco, CA 94104",
      type: "Penthouse",
      units: 4,
      status: "Active",
      occupancy: 100,
      rent: 4200,
    },
    {
      key: "4",
      name: "Suburban Family Home",
      address: "101 Maple Street, Chicago, IL 60007",
      type: "House",
      units: 1,
      status: "Active",
      occupancy: 100,
      rent: 2200,
    },
    {
      key: "5",
      name: "Beachfront Villa",
      address: "202 Ocean Drive, Miami, FL 33139",
      type: "Villa",
      units: 1,
      status: "Maintenance",
      occupancy: 0,
      rent: 3500,
    },
    {
      key: "6",
      name: "Mountain View Cabin",
      address: "303 Pine Road, Denver, CO 80202",
      type: "Cabin",
      units: 1,
      status: "Vacant",
      occupancy: 0,
      rent: 1500,
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
          item.address.toLowerCase().includes(value.toLowerCase()) ||
          item.type.toLowerCase().includes(value.toLowerCase()),
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
      case "Maintenance":
        return "orange"
      case "Vacant":
        return "red"
      default:
        return "default"
    }
  }

  const columns: ColumnsType<PropertyType> = [
    {
      title: "Property Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      ellipsis: true,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      filters: [
        { text: "Apartment", value: "Apartment" },
        { text: "Studio", value: "Studio" },
        { text: "Penthouse", value: "Penthouse" },
        { text: "House", value: "House" },
        { text: "Villa", value: "Villa" },
        { text: "Cabin", value: "Cabin" },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: "Units",
      dataIndex: "units",
      key: "units",
      sorter: (a, b) => a.units - b.units,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
      filters: [
        { text: "Active", value: "Active" },
        { text: "Maintenance", value: "Maintenance" },
        { text: "Vacant", value: "Vacant" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Occupancy",
      dataIndex: "occupancy",
      key: "occupancy",
      render: (occupancy) => `${occupancy}%`,
      sorter: (a, b) => a.occupancy - b.occupancy,
    },
    {
      title: "Rent",
      dataIndex: "rent",
      key: "rent",
      render: (rent) => `$${rent.toLocaleString()}`,
      sorter: (a, b) => a.rent - b.rent,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="View Details">
            <Button type="text" icon={<EyeOutlined />} onClick={() => console.log("View property", record.key)} />
          </Tooltip>
          <Tooltip title="Edit">
            <Button type="text" icon={<EditOutlined />} onClick={() => console.log("Edit property", record.key)} />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => console.log("Delete property", record.key)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ]

  const filterMenu = {
    items: [
      {
        key: "1",
        label: "All Properties",
      },
      {
        key: "2",
        label: "Active Properties",
      },
      {
        key: "3",
        label: "Vacant Properties",
      },
      {
        key: "4",
        label: "Under Maintenance",
      },
    ],
  }

  const sortMenu = {
    items: [
      {
        key: "1",
        label: "Name (A-Z)",
      },
      {
        key: "2",
        label: "Name (Z-A)",
      },
      {
        key: "3",
        label: "Rent (Low to High)",
      },
      {
        key: "4",
        label: "Rent (High to Low)",
      },
      {
        key: "5",
        label: "Occupancy (Low to High)",
      },
      {
        key: "6",
        label: "Occupancy (High to Low)",
      },
    ],
  }

  return (
    <DashboardLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Title level={2}>Properties</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          Add Property
        </Button>
      </div>
      <Divider />

      {/* Search and Filter Bar */}
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
        <Input.Search
          placeholder="Search properties..."
          allowClear
          enterButton={<SearchOutlined />}
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 300 }}
        />
        <Space>
          <Dropdown menu={filterMenu} placement="bottomRight">
            <Button icon={<FilterOutlined />}>Filter</Button>
          </Dropdown>
          <Dropdown menu={sortMenu} placement="bottomRight">
            <Button icon={<SortAscendingOutlined />}>Sort</Button>
          </Dropdown>
        </Space>
      </div>

      {/* Properties Table */}
      <Card bordered={false}>
        <Table
          columns={columns}
          dataSource={searchText ? filteredData : data}
          rowKey="key"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Add Property Modal */}
      <Modal
        title="Add New Property"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={700}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Add Property
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" name="property_form">
          <Form.Item
            name="name"
            label="Property Name"
            rules={[{ required: true, message: "Please enter property name" }]}
          >
            <Input placeholder="Enter property name" />
          </Form.Item>

          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please enter property address" }]}
          >
            <Input.TextArea rows={2} placeholder="Enter full address" />
          </Form.Item>

          <Form.Item
            name="type"
            label="Property Type"
            rules={[{ required: true, message: "Please select property type" }]}
          >
            <Select placeholder="Select property type">
              <Option value="Apartment">Apartment</Option>
              <Option value="Studio">Studio</Option>
              <Option value="Penthouse">Penthouse</Option>
              <Option value="House">House</Option>
              <Option value="Villa">Villa</Option>
              <Option value="Cabin">Cabin</Option>
              <Option value="Commercial">Commercial</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="units"
            label="Number of Units"
            rules={[{ required: true, message: "Please enter number of units" }]}
          >
            <InputNumber min={1} placeholder="Number of units" style={{ width: "100%" }} />
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
            name="status"
            label="Property Status"
            rules={[{ required: true, message: "Please select property status" }]}
          >
            <Select placeholder="Select property status">
              <Option value="Active">Active</Option>
              <Option value="Maintenance">Maintenance</Option>
              <Option value="Vacant">Vacant</Option>
            </Select>
          </Form.Item>

          <Form.Item name="images" label="Property Images">
            <Upload listType="picture-card" maxCount={5} beforeUpload={() => false}>
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={4} placeholder="Enter property description" />
          </Form.Item>
        </Form>
      </Modal>
    </DashboardLayout>
  )
}

export default Properties

