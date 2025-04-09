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
  Form,
  Input,
  Select,
  Upload,
  Table,
  Tag,
  Space,
  Modal,
  Statistic,
  Progress,
  DatePicker,
  Tooltip,
} from "antd"
import {
  PlusOutlined,
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PictureOutlined,
  VideoCameraOutlined,
  HomeOutlined,
  GlobalOutlined,
  ShareAltOutlined,
  SearchOutlined,
  BarChartOutlined,
} from "@ant-design/icons"
import type { UploadProps } from "antd"
import DashboardLayout from "../DashboardLayout"
import { Line, Pie } from "@ant-design/charts"

const { Title, Text } = Typography
const { Option } = Select
const { TabPane } = Tabs
const { TextArea } = Input
const { RangePicker } = DatePicker

interface ListingType {
  key: string
  title: string
  property: string
  platform: string
  status: string
  views: number
  inquiries: number
  publishDate: string
}

const Marketing: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()

  // Sample data for listings
  const listings: ListingType[] = [
    {
      key: "1",
      title: "Luxury Downtown Apartment with City Views",
      property: "Modern Luxury Apartment",
      platform: "Zillow",
      status: "Active",
      views: 1250,
      inquiries: 15,
      publishDate: "2024-02-15",
    },
    {
      key: "2",
      title: "Cozy Studio in Arts District",
      property: "Cozy Studio Loft",
      platform: "Apartments.com",
      status: "Active",
      views: 980,
      inquiries: 8,
      publishDate: "2024-02-20",
    },
    {
      key: "3",
      title: "Stunning Penthouse with Panoramic Views",
      property: "Downtown Penthouse",
      platform: "Zillow",
      status: "Active",
      views: 2100,
      inquiries: 23,
      publishDate: "2024-02-10",
    },
    {
      key: "4",
      title: "Family Home in Quiet Suburban Neighborhood",
      property: "Suburban Family Home",
      platform: "Realtor.com",
      status: "Active",
      views: 850,
      inquiries: 12,
      publishDate: "2024-03-01",
    },
    {
      key: "5",
      title: "Beachfront Villa with Private Access",
      property: "Beachfront Villa",
      platform: "Airbnb",
      status: "Draft",
      views: 0,
      inquiries: 0,
      publishDate: "",
    },
    {
      key: "6",
      title: "Rustic Mountain Cabin with Stunning Views",
      property: "Mountain View Cabin",
      platform: "VRBO",
      status: "Inactive",
      views: 450,
      inquiries: 3,
      publishDate: "2024-01-15",
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "green"
      case "Draft":
        return "blue"
      case "Inactive":
        return "red"
      default:
        return "default"
    }
  }

  const columns = [
    {
      title: "Listing Title",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
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
        { text: "Mountain View Cabin", value: "Mountain View Cabin" },
      ],
      onFilter: (value: string, record: ListingType) => record.property === value,
    },
    {
      title: "Platform",
      dataIndex: "platform",
      key: "platform",
      filters: [
        { text: "Zillow", value: "Zillow" },
        { text: "Apartments.com", value: "Apartments.com" },
        { text: "Realtor.com", value: "Realtor.com" },
        { text: "Airbnb", value: "Airbnb" },
        { text: "VRBO", value: "VRBO" },
      ],
      onFilter: (value: string, record: ListingType) => record.platform === value,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => <Tag color={getStatusColor(status)}>{status}</Tag>,
      filters: [
        { text: "Active", value: "Active" },
        { text: "Draft", value: "Draft" },
        { text: "Inactive", value: "Inactive" },
      ],
      onFilter: (value: string, record: ListingType) => record.status === value,
    },
    {
      title: "Performance",
      key: "performance",
      render: (_: any, record: ListingType) => (
        <Space direction="vertical" size="small" style={{ width: "100%" }}>
          <Text>{record.views} views</Text>
          <Text>{record.inquiries} inquiries</Text>
          {record.views > 0 && (
            <Progress
              percent={Math.round((record.inquiries / record.views) * 100 * 10)}
              size="small"
              format={(percent) => `${percent! / 10}%`}
            />
          )}
        </Space>
      ),
    },
    {
      title: "Publish Date",
      dataIndex: "publishDate",
      key: "publishDate",
      render: (date: string) => date || "Not published",
      sorter: (a: ListingType, b: ListingType) => {
        if (!a.publishDate) return 1
        if (!b.publishDate) return -1
        return a.publishDate.localeCompare(b.publishDate)
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: ListingType) => (
        <Space size="middle">
          <Tooltip title="View">
            <Button type="text" icon={<EyeOutlined />} onClick={() => console.log("View listing", record.key)} />
          </Tooltip>
          <Tooltip title="Edit">
            <Button type="text" icon={<EditOutlined />} onClick={() => console.log("Edit listing", record.key)} />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => console.log("Delete listing", record.key)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ]

  // Sample data for analytics charts
  const viewsData = [
    { date: "2024-02-01", views: 120 },
    { date: "2024-02-08", views: 350 },
    { date: "2024-02-15", views: 580 },
    { date: "2024-02-22", views: 920 },
    { date: "2024-03-01", views: 1250 },
    { date: "2024-03-08", views: 1580 },
    { date: "2024-03-15", views: 1850 },
    { date: "2024-03-22", views: 2100 },
  ]

  const inquiriesData = [
    { date: "2024-02-01", inquiries: 2 },
    { date: "2024-02-08", inquiries: 5 },
    { date: "2024-02-15", inquiries: 8 },
    { date: "2024-02-22", inquiries: 15 },
    { date: "2024-03-01", inquiries: 22 },
    { date: "2024-03-08", inquiries: 28 },
    { date: "2024-03-15", inquiries: 35 },
    { date: "2024-03-22", inquiries: 42 },
  ]

  const platformData = [
    { platform: "Zillow", value: 45 },
    { platform: "Apartments.com", value: 25 },
    { platform: "Realtor.com", value: 15 },
    { platform: "Airbnb", value: 10 },
    { platform: "VRBO", value: 5 },
  ]

  // Line chart configuration for views
  const viewsConfig = {
    data: viewsData,
    xField: "date",
    yField: "views",
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

  // Line chart configuration for inquiries
  const inquiriesConfig = {
    data: inquiriesData,
    xField: "date",
    yField: "inquiries",
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

  // Pie chart configuration for platform distribution
  const platformConfig = {
    data: platformData,
    angleField: "value",
    colorField: "platform",
    radius: 0.8,
    label: {
      type: "outer",
      content: "{name} {percentage}",
    },
    interactions: [{ type: "pie-legend-active" }, { type: "element-active" }],
  }

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

  return (
    <DashboardLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Title level={2}>Marketing & Listings</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          Create Listing
        </Button>
      </div>
      <Divider />

      <Tabs defaultActiveKey="listings">
        <TabPane
          tab={
            <span>
              <HomeOutlined />
              Property Listings
            </span>
          }
          key="listings"
        >
          <Card bordered={false}>
            <Table columns={columns} dataSource={listings} rowKey="key" pagination={{ pageSize: 10 }} />
          </Card>
        </TabPane>

        <TabPane
          tab={
            <span>
              <BarChartOutlined />
              Analytics
            </span>
          }
          key="analytics"
        >
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={8}>
              <Card bordered={false}>
                <Statistic title="Total Views" value={5630} valueStyle={{ color: "#1890ff" }} />
              </Card>
            </Col>
            <Col span={8}>
              <Card bordered={false}>
                <Statistic title="Total Inquiries" value={61} valueStyle={{ color: "#52c41a" }} />
              </Card>
            </Col>
            <Col span={8}>
              <Card bordered={false}>
                <Statistic
                  title="Conversion Rate"
                  value={1.08}
                  precision={2}
                  valueStyle={{ color: "#722ed1" }}
                  suffix="%"
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Card title="Listing Views" bordered={false}>
                <Line {...viewsConfig} height={300} />
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Inquiries" bordered={false}>
                <Line {...inquiriesConfig} height={300} />
              </Card>
            </Col>
          </Row>

          <Row gutter={16} style={{ marginTop: 16 }}>
            <Col span={12}>
              <Card title="Platform Distribution" bordered={false}>
                <Pie {...platformConfig} height={300} />
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Top Performing Listings" bordered={false}>
                <Table
                  columns={[
                    {
                      title: "Property",
                      dataIndex: "property",
                      key: "property",
                    },
                    {
                      title: "Views",
                      dataIndex: "views",
                      key: "views",
                      sorter: (a: any, b: any) => a.views - b.views,
                      defaultSortOrder: "descend",
                    },
                    {
                      title: "Inquiries",
                      dataIndex: "inquiries",
                      key: "inquiries",
                    },
                    {
                      title: "Conversion",
                      key: "conversion",
                      render: (_: any, record: any) => `${((record.inquiries / record.views) * 100).toFixed(2)}%`,
                    },
                  ]}
                  dataSource={listings.filter((item) => item.status === "Active")}
                  rowKey="key"
                  pagination={false}
                />
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane
          tab={
            <span>
              <PictureOutlined />
              Media Library
            </span>
          }
          key="media"
        >
          <Card
            bordered={false}
            title={
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Property Media</span>
                <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined />}>Upload Media</Button>
                </Upload>
              </div>
            }
          >
            <div style={{ marginBottom: 16 }}>
              <Input.Search
                placeholder="Search media..."
                allowClear
                enterButton={<SearchOutlined />}
                style={{ width: 300 }}
              />
            </div>

            <Tabs defaultActiveKey="images">
              <TabPane
                tab={
                  <span>
                    <PictureOutlined />
                    Images
                  </span>
                }
                key="images"
              >
                <Row gutter={[16, 16]}>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                    <Col span={6} key={item}>
                      <Card
                        hoverable
                        cover={
                          <img
                            alt={`Property Image ${item}`}
                            src={`/placeholder.svg?height=200&width=300`}
                            style={{ height: 200, objectFit: "cover" }}
                          />
                        }
                        actions={[
                          <EyeOutlined key="view" />,
                          <EditOutlined key="edit" />,
                          <DeleteOutlined key="delete" />,
                        ]}
                      >
                        <Card.Meta title={`Property Image ${item}`} description="Added on Mar 15, 2024" />
                      </Card>
                    </Col>
                  ))}
                </Row>
              </TabPane>

              <TabPane
                tab={
                  <span>
                    <VideoCameraOutlined />
                    Videos
                  </span>
                }
                key="videos"
              >
                <Row gutter={[16, 16]}>
                  {[1, 2, 3, 4].map((item) => (
                    <Col span={12} key={item}>
                      <Card
                        hoverable
                        cover={
                          <div
                            style={{
                              height: 200,
                              background: "#f0f0f0",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <VideoCameraOutlined style={{ fontSize: 48, color: "#bfbfbf" }} />
                          </div>
                        }
                        actions={[
                          <EyeOutlined key="view" />,
                          <EditOutlined key="edit" />,
                          <DeleteOutlined key="delete" />,
                        ]}
                      >
                        <Card.Meta title={`Property Video Tour ${item}`} description="Added on Mar 10, 2024" />
                      </Card>
                    </Col>
                  ))}
                </Row>
              </TabPane>
            </Tabs>
          </Card>
        </TabPane>

        <TabPane
          tab={
            <span>
              <GlobalOutlined />
              Website Management
            </span>
          }
          key="website"
        >
          <Card bordered={false}>
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <Title level={4}>Property Website Management</Title>
              <Text>Manage your property website content, SEO settings, and analytics.</Text>
              <div style={{ marginTop: 24 }}>
                <Button type="primary" icon={<EditOutlined />} style={{ marginRight: 16 }}>
                  Edit Website
                </Button>
                <Button icon={<EyeOutlined />}>Preview Website</Button>
              </div>
            </div>
          </Card>
        </TabPane>

        <TabPane
          tab={
            <span>
              <ShareAltOutlined />
              Social Media
            </span>
          }
          key="social"
        >
          <Card bordered={false}>
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <Title level={4}>Social Media Management</Title>
              <Text>Connect and manage your social media accounts to promote your properties.</Text>
              <div style={{ marginTop: 24 }}>
                <Button type="primary" icon={<PlusOutlined />}>
                  Connect Social Account
                </Button>
              </div>
            </div>
          </Card>
        </TabPane>
      </Tabs>

      {/* Create Listing Modal */}
      <Modal
        title="Create New Listing"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Create Listing
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" name="listing_form">
          <Form.Item
            name="title"
            label="Listing Title"
            rules={[{ required: true, message: "Please enter listing title" }]}
          >
            <Input placeholder="Enter an attractive title for your listing" />
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

          <Form.Item name="platform" label="Platform" rules={[{ required: true, message: "Please select platform" }]}>
            <Select placeholder="Select platform">
              <Option value="Zillow">Zillow</Option>
              <Option value="Apartments.com">Apartments.com</Option>
              <Option value="Realtor.com">Realtor.com</Option>
              <Option value="Airbnb">Airbnb</Option>
              <Option value="VRBO">VRBO</Option>
              <Option value="Company Website">Company Website</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <TextArea rows={6} placeholder="Enter a detailed description of the property" />
          </Form.Item>

          <Form.Item name="price" label="Price" rules={[{ required: true, message: "Please enter price" }]}>
            <Input prefix="$" placeholder="Enter price" />
          </Form.Item>

          <Form.Item name="availability" label="Availability Date">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="features" label="Key Features">
            <Select mode="tags" style={{ width: "100%" }} placeholder="Enter key features">
              <Option value="Parking">Parking</Option>
              <Option value="Pool">Pool</Option>
              <Option value="Gym">Gym</Option>
              <Option value="Pet Friendly">Pet Friendly</Option>
              <Option value="Furnished">Furnished</Option>
              <Option value="Balcony">Balcony</Option>
              <Option value="Washer/Dryer">Washer/Dryer</Option>
              <Option value="Dishwasher">Dishwasher</Option>
            </Select>
          </Form.Item>

          <Form.Item name="images" label="Images">
            <Upload listType="picture-card" fileList={[]} {...uploadProps}>
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item name="status" label="Status" rules={[{ required: true, message: "Please select status" }]}>
            <Select placeholder="Select status">
              <Option value="Active">Active</Option>
              <Option value="Draft">Draft</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </DashboardLayout>
  )
}

export default Marketing

