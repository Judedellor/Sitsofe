"use client"

import type React from "react"
import { useState } from "react"
import {
  Table,
  Card,
  Button,
  Input,
  Space,
  Modal,
  Form,
  Select,
  Upload,
  Typography,
  Divider,
  Tooltip,
  Tree,
  Row,
  Col,
} from "antd"
import {
  SearchOutlined,
  PlusOutlined,
  DeleteOutlined,
  EyeOutlined,
  DownloadOutlined,
  FileOutlined,
  FolderOutlined,
  FilePdfOutlined,
  FileImageOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  InboxOutlined,
} from "@ant-design/icons"
import type { ColumnsType } from "antd/es/table"
import type { UploadProps } from "antd"
import DashboardLayout from "../DashboardLayout"

const { Title, Text } = Typography
const { Option } = Select
const { Dragger } = Upload
const { DirectoryTree } = Tree

interface DocumentType {
  key: string
  name: string
  type: string
  category: string
  property: string
  tenant: string
  uploadDate: string
  size: string
  status: string
}

const Documents: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isViewModalVisible, setIsViewModalVisible] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<DocumentType | null>(null)
  const [form] = Form.useForm()
  const [searchText, setSearchText] = useState("")
  const [filteredData, setFilteredData] = useState<DocumentType[]>([])
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")

  // Sample data
  const data: DocumentType[] = [
    {
      key: "1",
      name: "Lease Agreement - Sarah Johnson.pdf",
      type: "PDF",
      category: "Lease",
      property: "Modern Luxury Apartment",
      tenant: "Sarah Johnson",
      uploadDate: "2024-01-15",
      size: "2.5 MB",
      status: "Active",
    },
    {
      key: "2",
      name: "Property Inspection Report.docx",
      type: "DOCX",
      category: "Inspection",
      property: "Cozy Studio Loft",
      tenant: "Michael Brown",
      uploadDate: "2024-02-10",
      size: "1.8 MB",
      status: "Active",
    },
    {
      key: "3",
      name: "Maintenance Request Form.pdf",
      type: "PDF",
      category: "Maintenance",
      property: "Downtown Penthouse",
      tenant: "Emily Davis",
      uploadDate: "2024-02-28",
      size: "1.2 MB",
      status: "Active",
    },
    {
      key: "4",
      name: "Property Tax Statement 2023.pdf",
      type: "PDF",
      category: "Financial",
      property: "All Properties",
      tenant: "",
      uploadDate: "2024-01-05",
      size: "3.1 MB",
      status: "Active",
    },
    {
      key: "5",
      name: "Insurance Policy.pdf",
      type: "PDF",
      category: "Insurance",
      property: "All Properties",
      tenant: "",
      uploadDate: "2023-12-20",
      size: "4.5 MB",
      status: "Active",
    },
    {
      key: "6",
      name: "Property Photos.zip",
      type: "ZIP",
      category: "Media",
      property: "Beachfront Villa",
      tenant: "",
      uploadDate: "2024-03-01",
      size: "15.2 MB",
      status: "Active",
    },
  ]

  const showModal = () => {
    setIsModalVisible(true)
  }

  const showViewModal = (record: DocumentType) => {
    setSelectedDocument(record)
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
    setSelectedDocument(null)
  }

  const handleSearch = (value: string) => {
    setSearchText(value)
    if (value) {
      const filtered = data.filter(
        (item) =>
          item.name.toLowerCase().includes(value.toLowerCase()) ||
          item.category.toLowerCase().includes(value.toLowerCase()) ||
          item.property.toLowerCase().includes(value.toLowerCase()) ||
          (item.tenant && item.tenant.toLowerCase().includes(value.toLowerCase())),
      )
      setFilteredData(filtered)
    } else {
      setFilteredData([])
    }
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "PDF":
        return <FilePdfOutlined style={{ color: "#f5222d", fontSize: 20 }} />
      case "DOCX":
        return <FileWordOutlined style={{ color: "#1890ff", fontSize: 20 }} />
      case "XLSX":
        return <FileExcelOutlined style={{ color: "#52c41a", fontSize: 20 }} />
      case "JPG":
      case "PNG":
        return <FileImageOutlined style={{ color: "#faad14", fontSize: 20 }} />
      case "ZIP":
        return <FileOutlined style={{ color: "#722ed1", fontSize: 20 }} />
      default:
        return <FileOutlined style={{ color: "#8c8c8c", fontSize: 20 }} />
    }
  }

  const columns: ColumnsType<DocumentType> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Space>
          {getFileIcon(record.type)}
          <a onClick={() => showViewModal(record)}>{text}</a>
        </Space>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      filters: [
        { text: "Lease", value: "Lease" },
        { text: "Inspection", value: "Inspection" },
        { text: "Maintenance", value: "Maintenance" },
        { text: "Financial", value: "Financial" },
        { text: "Insurance", value: "Insurance" },
        { text: "Media", value: "Media" },
      ],
      onFilter: (value, record) => record.category === value,
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
      render: (text) => text || "-",
    },
    {
      title: "Upload Date",
      dataIndex: "uploadDate",
      key: "uploadDate",
      sorter: (a, b) => a.uploadDate.localeCompare(b.uploadDate),
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="View">
            <Button type="text" icon={<EyeOutlined />} onClick={() => showViewModal(record)} />
          </Tooltip>
          <Tooltip title="Download">
            <Button
              type="text"
              icon={<DownloadOutlined />}
              onClick={() => console.log("Download document", record.key)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => console.log("Delete document", record.key)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ]

  const uploadProps: UploadProps = {
    name: "file",
    multiple: true,
    action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
    onChange(info) {
      const { status } = info.file
      if (status !== "uploading") {
        console.log(info.file, info.fileList)
      }
      if (status === "done") {
        console.log(`${info.file.name} file uploaded successfully.`)
      } else if (status === "error") {
        console.error(`${info.file.name} file upload failed.`)
      }
    },
  }

  const treeData = [
    {
      title: "Documents",
      key: "documents",
      icon: <FolderOutlined />,
      children: [
        {
          title: "Leases",
          key: "leases",
          icon: <FolderOutlined />,
          children: [
            {
              title: "Lease Agreement - Sarah Johnson.pdf",
              key: "1",
              icon: <FilePdfOutlined style={{ color: "#f5222d" }} />,
            },
          ],
        },
        {
          title: "Inspections",
          key: "inspections",
          icon: <FolderOutlined />,
          children: [
            {
              title: "Property Inspection Report.docx",
              key: "2",
              icon: <FileWordOutlined style={{ color: "#1890ff" }} />,
            },
          ],
        },
        {
          title: "Maintenance",
          key: "maintenance",
          icon: <FolderOutlined />,
          children: [
            { title: "Maintenance Request Form.pdf", key: "3", icon: <FilePdfOutlined style={{ color: "#f5222d" }} /> },
          ],
        },
        {
          title: "Financial",
          key: "financial",
          icon: <FolderOutlined />,
          children: [
            {
              title: "Property Tax Statement 2023.pdf",
              key: "4",
              icon: <FilePdfOutlined style={{ color: "#f5222d" }} />,
            },
          ],
        },
        {
          title: "Insurance",
          key: "insurance",
          icon: <FolderOutlined />,
          children: [
            { title: "Insurance Policy.pdf", key: "5", icon: <FilePdfOutlined style={{ color: "#f5222d" }} /> },
          ],
        },
        {
          title: "Media",
          key: "media",
          icon: <FolderOutlined />,
          children: [{ title: "Property Photos.zip", key: "6", icon: <FileOutlined style={{ color: "#722ed1" }} /> }],
        },
      ],
    },
  ]

  return (
    <DashboardLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Title level={2}>Documents</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          Upload Document
        </Button>
      </div>
      <Divider />

      <Row gutter={24}>
        <Col span={6}>
          <Card title="Folders" bordered={false} style={{ marginBottom: 16 }}>
            <DirectoryTree
              defaultExpandAll
              treeData={treeData}
              onSelect={(keys) => {
                if (keys.length > 0 && typeof keys[0] === "string") {
                  const key = keys[0]
                  if (!isNaN(Number(key))) {
                    const doc = data.find((item) => item.key === key)
                    if (doc) {
                      showViewModal(doc)
                    }
                  }
                }
              }}
            />
          </Card>
        </Col>
        <Col span={18}>
          {/* Search Bar */}
          <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
            <Input.Search
              placeholder="Search documents..."
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 300 }}
            />
            <Space>
              <Button icon={<DownloadOutlined />} onClick={() => console.log("Export documents")}>
                Export
              </Button>
            </Space>
          </div>

          {/* Documents Table */}
          <Card bordered={false}>
            <Table
              columns={columns}
              dataSource={searchText ? filteredData : data}
              rowKey="key"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Upload Document Modal */}
      <Modal
        title="Upload Document"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={700}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Upload
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" name="document_form">
          <Form.Item
            name="files"
            label="Files"
            rules={[{ required: true, message: "Please upload at least one file" }]}
          >
            <Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag files to this area to upload</p>
              <p className="ant-upload-hint">
                Support for single or bulk upload. Strictly prohibited from uploading company data or other banned
                files.
              </p>
            </Dragger>
          </Form.Item>

          <Form.Item name="category" label="Category" rules={[{ required: true, message: "Please select a category" }]}>
            <Select placeholder="Select category">
              <Option value="Lease">Lease</Option>
              <Option value="Inspection">Inspection</Option>
              <Option value="Maintenance">Maintenance</Option>
              <Option value="Financial">Financial</Option>
              <Option value="Insurance">Insurance</Option>
              <Option value="Media">Media</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="property"
            label="Related Property"
            rules={[{ required: true, message: "Please select a property" }]}
          >
            <Select placeholder="Select property">
              <Option value="All Properties">All Properties</Option>
              <Option value="Modern Luxury Apartment">Modern Luxury Apartment</Option>
              <Option value="Cozy Studio Loft">Cozy Studio Loft</Option>
              <Option value="Downtown Penthouse">Downtown Penthouse</Option>
              <Option value="Suburban Family Home">Suburban Family Home</Option>
              <Option value="Beachfront Villa">Beachfront Villa</Option>
              <Option value="Mountain View Cabin">Mountain View Cabin</Option>
            </Select>
          </Form.Item>

          <Form.Item name="tenant" label="Related Tenant">
            <Select placeholder="Select tenant (optional)">
              <Option value="">None</Option>
              <Option value="Sarah Johnson">Sarah Johnson</Option>
              <Option value="Michael Brown">Michael Brown</Option>
              <Option value="Emily Davis">Emily Davis</Option>
              <Option value="Robert Wilson">Robert Wilson</Option>
              <Option value="Jennifer Lopez">Jennifer Lopez</Option>
              <Option value="David Miller">David Miller</Option>
            </Select>
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={4} placeholder="Enter document description" />
          </Form.Item>
        </Form>
      </Modal>

      {/* View Document Modal */}
      {selectedDocument && (
        <Modal
          title={selectedDocument.name}
          open={isViewModalVisible}
          onCancel={handleViewCancel}
          width={800}
          footer={[
            <Button key="back" onClick={handleViewCancel}>
              Close
            </Button>,
            <Button
              key="download"
              type="primary"
              icon={<DownloadOutlined />}
              onClick={() => console.log("Download document", selectedDocument.key)}
            >
              Download
            </Button>,
          ]}
        >
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            {getFileIcon(selectedDocument.type)}
            <div style={{ fontSize: 48, marginTop: 16 }}>{selectedDocument.name}</div>
            <Text type="secondary">{selectedDocument.size}</Text>
          </div>

          <Divider />

          <Row gutter={16}>
            <Col span={12}>
              <div style={{ marginBottom: 16 }}>
                <Text type="secondary">Category</Text>
                <div>{selectedDocument.category}</div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <Text type="secondary">Property</Text>
                <div>{selectedDocument.property}</div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <Text type="secondary">Tenant</Text>
                <div>{selectedDocument.tenant || "N/A"}</div>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: 16 }}>
                <Text type="secondary">Upload Date</Text>
                <div>{selectedDocument.uploadDate}</div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <Text type="secondary">Status</Text>
                <div>{selectedDocument.status}</div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <Text type="secondary">File Type</Text>
                <div>{selectedDocument.type}</div>
              </div>
            </Col>
          </Row>

          <Divider />

          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <Text>Preview not available. Please download the file to view its contents.</Text>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  )
}

export default Documents

