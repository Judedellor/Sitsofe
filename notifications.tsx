"use client"

import type React from "react"
import { useState } from "react"
import {
  Card,
  Form,
  Switch,
  Select,
  Button,
  Divider,
  Typography,
  Tabs,
  Input,
  Space,
  Table,
  Tag,
  Modal,
  TimePicker,
} from "antd"
import {
  BellOutlined,
  MailOutlined,
  MobileOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons"
import DashboardLayout from "../../DashboardLayout"

const { Title, Text } = Typography
const { Option } = Select
const { TabPane } = Tabs
const { TextArea } = Input

interface TemplateType {
  key: string
  name: string
  type: string
  subject: string
  lastModified: string
  status: string
}

const NotificationSettings: React.FC = () => {
  const [form] = Form.useForm()
  const [templateForm] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<TemplateType | null>(null)

  // Sample data for notification templates
  const templates: TemplateType[] = [
    {
      key: "1",
      name: "Rent Due Reminder",
      type: "Email",
      subject: "Your Rent Payment is Due Soon",
      lastModified: "2024-02-15",
      status: "Active",
    },
    {
      key: "2",
      name: "Maintenance Request Update",
      type: "Email",
      subject: "Update on Your Maintenance Request",
      lastModified: "2024-02-10",
      status: "Active",
    },
    {
      key: "3",
      name: "Late Payment Notification",
      type: "Email",
      subject: "Your Rent Payment is Overdue",
      lastModified: "2024-01-20",
      status: "Active",
    },
    {
      key: "4",
      name: "Lease Renewal Reminder",
      type: "Email",
      subject: "Your Lease is Up for Renewal",
      lastModified: "2024-03-05",
      status: "Active",
    },
    {
      key: "5",
      name: "Maintenance Visit Scheduled",
      type: "SMS",
      subject: "Maintenance Visit Scheduled",
      lastModified: "2024-02-28",
      status: "Active",
    },
    {
      key: "6",
      name: "Welcome New Tenant",
      type: "Email",
      subject: "Welcome to Your New Home",
      lastModified: "2024-01-10",
      status: "Inactive",
    },
  ]

  const showModal = (template?: TemplateType) => {
    if (template) {
      setEditingTemplate(template)
      templateForm.setFieldsValue({
        name: template.name,
        type: template.type,
        subject: template.subject,
        content:
          "Dear {{tenant_name}},\n\nThis is a notification about {{notification_subject}}.\n\nThank you,\n{{property_manager_name}}",
        status: template.status === "Active",
      })
    } else {
      setEditingTemplate(null)
      templateForm.resetFields()
    }
    setIsModalVisible(true)
  }

  const handleOk = () => {
    templateForm
      .validateFields()
      .then((values) => {
        console.log("Form values:", values)
        templateForm.resetFields()
        setIsModalVisible(false)
        setEditingTemplate(null)
      })
      .catch((info) => {
        console.log("Validate Failed:", info)
      })
  }

  const handleCancel = () => {
    templateForm.resetFields()
    setIsModalVisible(false)
    setEditingTemplate(null)
  }

  const columns = [
    {
      title: "Template Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: TemplateType, b: TemplateType) => a.name.localeCompare(b.name),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      filters: [
        { text: "Email", value: "Email" },
        { text: "SMS", value: "SMS" },
        { text: "Push", value: "Push" },
      ],
      onFilter: (value: string, record: TemplateType) => record.type === value,
      render: (type: string) => {
        const color = type === "Email" ? "blue" : type === "SMS" ? "green" : "purple"
        return <Tag color={color}>{type}</Tag>
      },
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      ellipsis: true,
    },
    {
      title: "Last Modified",
      dataIndex: "lastModified",
      key: "lastModified",
      sorter: (a: TemplateType, b: TemplateType) => a.lastModified.localeCompare(b.lastModified),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Active", value: "Active" },
        { text: "Inactive", value: "Inactive" },
      ],
      onFilter: (value: string, record: TemplateType) => record.status === value,
      render: (status: string) => {
        const color = status === "Active" ? "green" : "red"
        return <Tag color={color}>{status}</Tag>
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: TemplateType) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} onClick={() => showModal(record)} />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => console.log("Delete template", record.key)}
          />
        </Space>
      ),
    },
  ]

  return (
    <DashboardLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Title level={2}>Notification Settings</Title>
      </div>
      <Divider />

      <Tabs defaultActiveKey="preferences">
        <TabPane
          tab={
            <span>
              <BellOutlined />
              Notification Preferences
            </span>
          }
          key="preferences"
        >
          <Card bordered={false}>
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                rent_due_email: true,
                rent_due_sms: true,
                rent_due_push: true,
                rent_due_days: 3,
                maintenance_email: true,
                maintenance_sms: true,
                maintenance_push: true,
                lease_renewal_email: true,
                lease_renewal_sms: false,
                lease_renewal_push: true,
                lease_renewal_days: 30,
                payment_received_email: true,
                payment_received_sms: false,
                payment_received_push: true,
                tenant_application_email: true,
                tenant_application_sms: false,
                tenant_application_push: true,
                daily_summary: true,
                daily_summary_time: null,
                weekly_report: true,
                weekly_report_day: "Monday",
              }}
            >
              <Title level={4}>Rent Notifications</Title>
              <div style={{ marginBottom: 24 }}>
                <Form.Item label="Rent Due Reminder" style={{ marginBottom: 8 }}>
                  <Space>
                    <Form.Item name="rent_due_email" valuePropName="checked" noStyle>
                      <Switch checkedChildren={<MailOutlined />} unCheckedChildren={<MailOutlined />} />
                    </Form.Item>
                    <Form.Item name="rent_due_sms" valuePropName="checked" noStyle>
                      <Switch checkedChildren={<MobileOutlined />} unCheckedChildren={<MobileOutlined />} />
                    </Form.Item>
                    <Form.Item name="rent_due_push" valuePropName="checked" noStyle>
                      <Switch checkedChildren={<BellOutlined />} unCheckedChildren={<BellOutlined />} />
                    </Form.Item>
                    <Text>Send reminder</Text>
                    <Form.Item name="rent_due_days" noStyle>
                      <Select style={{ width: 80 }}>
                        <Option value={1}>1</Option>
                        <Option value={2}>2</Option>
                        <Option value={3}>3</Option>
                        <Option value={5}>5</Option>
                        <Option value={7}>7</Option>
                      </Select>
                    </Form.Item>
                    <Text>days before due date</Text>
                  </Space>
                </Form.Item>
              </div>

              <Title level={4}>Maintenance Notifications</Title>
              <div style={{ marginBottom: 24 }}>
                <Form.Item label="Maintenance Request Updates" style={{ marginBottom: 8 }}>
                  <Space>
                    <Form.Item name="maintenance_email" valuePropName="checked" noStyle>
                      <Switch checkedChildren={<MailOutlined />} unCheckedChildren={<MailOutlined />} />
                    </Form.Item>
                    <Form.Item name="maintenance_sms" valuePropName="checked" noStyle>
                      <Switch checkedChildren={<MobileOutlined />} unCheckedChildren={<MobileOutlined />} />
                    </Form.Item>
                    <Form.Item name="maintenance_push" valuePropName="checked" noStyle>
                      <Switch checkedChildren={<BellOutlined />} unCheckedChildren={<BellOutlined />} />
                    </Form.Item>
                  </Space>
                </Form.Item>
              </div>

              <Title level={4}>Lease Notifications</Title>
              <div style={{ marginBottom: 24 }}>
                <Form.Item label="Lease Renewal Reminder" style={{ marginBottom: 8 }}>
                  <Space>
                    <Form.Item name="lease_renewal_email" valuePropName="checked" noStyle>
                      <Switch checkedChildren={<MailOutlined />} unCheckedChildren={<MailOutlined />} />
                    </Form.Item>
                    <Form.Item name="lease_renewal_sms" valuePropName="checked" noStyle>
                      <Switch checkedChildren={<MobileOutlined />} unCheckedChildren={<MobileOutlined />} />
                    </Form.Item>
                    <Form.Item name="lease_renewal_push" valuePropName="checked" noStyle>
                      <Switch checkedChildren={<BellOutlined />} unCheckedChildren={<BellOutlined />} />
                    </Form.Item>
                    <Text>Send reminder</Text>
                    <Form.Item name="lease_renewal_days" noStyle>
                      <Select style={{ width: 80 }}>
                        <Option value={15}>15</Option>
                        <Option value={30}>30</Option>
                        <Option value={45}>45</Option>
                        <Option value={60}>60</Option>
                        <Option value={90}>90</Option>
                      </Select>
                    </Form.Item>
                    <Text>days before lease expiration</Text>
                  </Space>
                </Form.Item>
              </div>

              <Title level={4}>Payment Notifications</Title>
              <div style={{ marginBottom: 24 }}>
                <Form.Item label="Payment Received Confirmation" style={{ marginBottom: 8 }}>
                  <Space>
                    <Form.Item name="payment_received_email" valuePropName="checked" noStyle>
                      <Switch checkedChildren={<MailOutlined />} unCheckedChildren={<MailOutlined />} />
                    </Form.Item>
                    <Form.Item name="payment_received_sms" valuePropName="checked" noStyle>
                      <Switch checkedChildren={<MobileOutlined />} unCheckedChildren={<MobileOutlined />} />
                    </Form.Item>
                    <Form.Item name="payment_received_push" valuePropName="checked" noStyle>
                      <Switch checkedChildren={<BellOutlined />} unCheckedChildren={<BellOutlined />} />
                    </Form.Item>
                  </Space>
                </Form.Item>
              </div>

              <Title level={4}>Tenant Applications</Title>
              <div style={{ marginBottom: 24 }}>
                <Form.Item label="New Tenant Application" style={{ marginBottom: 8 }}>
                  <Space>
                    <Form.Item name="tenant_application_email" valuePropName="checked" noStyle>
                      <Switch checkedChildren={<MailOutlined />} unCheckedChildren={<MailOutlined />} />
                    </Form.Item>
                    <Form.Item name="tenant_application_sms" valuePropName="checked" noStyle>
                      <Switch checkedChildren={<MobileOutlined />} unCheckedChildren={<MobileOutlined />} />
                    </Form.Item>
                    <Form.Item name="tenant_application_push" valuePropName="checked" noStyle>
                      <Switch checkedChildren={<BellOutlined />} unCheckedChildren={<BellOutlined />} />
                    </Form.Item>
                  </Space>
                </Form.Item>
              </div>

              <Title level={4}>Summary Reports</Title>
              <div style={{ marginBottom: 24 }}>
                <Form.Item label="Daily Summary" style={{ marginBottom: 8 }}>
                  <Space>
                    <Form.Item name="daily_summary" valuePropName="checked" noStyle>
                      <Switch />
                    </Form.Item>
                    <Form.Item name="daily_summary_time" noStyle>
                      <TimePicker format="HH:mm" placeholder="Select time" />
                    </Form.Item>
                  </Space>
                </Form.Item>

                <Form.Item label="Weekly Report" style={{ marginBottom: 8 }}>
                  <Space>
                    <Form.Item name="weekly_report" valuePropName="checked" noStyle>
                      <Switch />
                    </Form.Item>
                    <Form.Item name="weekly_report_day" noStyle>
                      <Select style={{ width: 120 }}>
                        <Option value="Monday">Monday</Option>
                        <Option value="Tuesday">Tuesday</Option>
                        <Option value="Wednesday">Wednesday</Option>
                        <Option value="Thursday">Thursday</Option>
                        <Option value="Friday">Friday</Option>
                        <Option value="Saturday">Saturday</Option>
                        <Option value="Sunday">Sunday</Option>
                      </Select>
                    </Form.Item>
                  </Space>
                </Form.Item>
              </div>

              <Divider />

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Save Preferences
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>

        <TabPane
          tab={
            <span>
              <MailOutlined />
              Notification Templates
            </span>
          }
          key="templates"
        >
          <Card
            bordered={false}
            title={
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Notification Templates</span>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
                  Create Template
                </Button>
              </div>
            }
          >
            <Table columns={columns} dataSource={templates} rowKey="key" pagination={{ pageSize: 10 }} />
          </Card>
        </TabPane>
      </Tabs>

      {/* Template Modal */}
      <Modal
        title={editingTemplate ? "Edit Notification Template" : "Create Notification Template"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={700}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            {editingTemplate ? "Save Changes" : "Create Template"}
          </Button>,
        ]}
      >
        <Form
          form={templateForm}
          layout="vertical"
          name="template_form"
          initialValues={{
            type: "Email",
            status: true,
          }}
        >
          <Form.Item
            name="name"
            label="Template Name"
            rules={[{ required: true, message: "Please enter template name" }]}
          >
            <Input placeholder="Enter template name" />
          </Form.Item>

          <Form.Item
            name="type"
            label="Notification Type"
            rules={[{ required: true, message: "Please select notification type" }]}
          >
            <Select placeholder="Select notification type">
              <Option value="Email">Email</Option>
              <Option value="SMS">SMS</Option>
              <Option value="Push">Push Notification</Option>
            </Select>
          </Form.Item>

          <Form.Item name="subject" label="Subject" rules={[{ required: true, message: "Please enter subject" }]}>
            <Input placeholder="Enter subject" />
          </Form.Item>

          <Form.Item name="content" label="Content" rules={[{ required: true, message: "Please enter content" }]}>
            <TextArea rows={6} placeholder="Enter notification content" />
          </Form.Item>

          <Form.Item name="status" label="Status" valuePropName="checked">
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>

          <div style={{ marginBottom: 16 }}>
            <Text type="secondary">Available Variables:</Text>
            <div style={{ marginTop: 8 }}>
              <Tag color="blue">{{ tenant_name }}</Tag>
              <Tag color="blue">{{ property_name }}</Tag>
              <Tag color="blue">{{ property_address }}</Tag>
              <Tag color="blue">{{ due_date }}</Tag>
              <Tag color="blue">{{ amount_due }}</Tag>
              <Tag color="blue">{{ notification_subject }}</Tag>
              <Tag color="blue">{{ property_manager_name }}</Tag>
            </div>
          </div>
        </Form>
      </Modal>
    </DashboardLayout>
  )
}

export default NotificationSettings

