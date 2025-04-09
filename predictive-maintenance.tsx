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
  Select,
  Tooltip,
  Timeline,
  Statistic,
  Badge,
  List,
  Avatar,
  Calendar,
  Modal,
  Input,
  Form,
  DatePicker,
  Slider,
  Alert,
  Popconfirm,
  notification,
  Switch,
  Radio,
  Upload,
  message,
  Rate,
  InputNumber,
} from "antd"
import {
  ToolOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  BarChartOutlined,
  CalendarOutlined,
  SettingOutlined,
  BellOutlined,
  HistoryOutlined,
  RiseOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  UploadOutlined,
  DownloadOutlined,
  SearchOutlined,
  LineChartOutlined,
  DollarOutlined,
  SyncOutlined,
  AppstoreOutlined,
} from "@ant-design/icons"
import DashboardLayout from "../DashboardLayout"
import { Line, Pie, Column, Gauge, DualAxes } from "@ant-design/charts"
import type { Moment } from "moment"
import moment from "moment"

const { Title, Text, Paragraph } = Typography
const { Option } = Select
const { TabPane } = Tabs

interface MaintenanceItemType {
  key: string
  id: string
  property: string
  unit: string
  component: string
  category: string
  priority: string
  status: string
  healthScore: number
  nextService: string
  lastService: string
}

interface MaintenanceHistoryType {
  key: string
  date: string
  type: string
  description: string
  technician: string
  cost: number
}

const PredictiveMaintenance: React.FC = () => {
  const [propertyFilter, setPropertyFilter] = useState<string>("all")
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedItem, setSelectedItem] = useState<MaintenanceItemType | null>(null)
  const [dateRange, setDateRange] = useState<[Moment, Moment]>([moment().subtract(30, "days"), moment()])
  const [viewMode, setViewMode] = useState<"table" | "card" | "calendar">("table")
  const [isAddComponentModalVisible, setIsAddComponentModalVisible] = useState(false)
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false)
  const [isAlertThresholdModalVisible, setIsAlertThresholdModalVisible] = useState(false)
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [isAIAnalysisEnabled, setIsAIAnalysisEnabled] = useState(true)
  const [searchText, setSearchText] = useState("")
  const [form] = Form.useForm()
  const [thresholdForm] = Form.useForm()
  const [settingsForm] = Form.useForm()

  const [maintenanceItems, setMaintenanceItems] = useState<MaintenanceItemType[]>([
    {
      key: "1",
      id: "1",
      property: "Modern Luxury Apartment",
      unit: "Unit 101",
      component: "HVAC System",
      category: "Mechanical",
      priority: "High",
      status: "Active",
      healthScore: 85,
      nextService: "2024-03-15",
      lastService: "2023-12-15",
    },
    {
      key: "2",
      id: "2",
      property: "Cozy Studio Loft",
      unit: "Common Area",
      component: "Plumbing System",
      category: "Plumbing",
      priority: "Medium",
      status: "Active",
      healthScore: 72,
      nextService: "2024-04-01",
      lastService: "2024-01-01",
    },
    {
      key: "3",
      id: "3",
      property: "Downtown Penthouse",
      unit: "Unit 201",
      component: "Electrical System",
      category: "Electrical",
      priority: "Low",
      status: "Active",
      healthScore: 92,
      nextService: "2024-05-10",
      lastService: "2024-02-10",
    },
  ])

  const criticalItems = maintenanceItems.filter((item) => item.priority === "High").length
  const highPriorityItems = maintenanceItems.filter((item) => item.priority === "Medium").length
  const scheduledMaintenance = 5
  const healthyComponents = maintenanceItems.filter((item) => item.healthScore > 70).length

  const upcomingMaintenance = [
    {
      key: "1",
      property: "Modern Luxury Apartment",
      unit: "Unit 101",
      component: "HVAC System",
      priority: "High",
      nextService: "2024-03-15",
    },
    {
      key: "2",
      property: "Cozy Studio Loft",
      unit: "Common Area",
      component: "Plumbing System",
      priority: "Medium",
      nextService: "2024-04-01",
    },
    {
      key: "3",
      property: "Downtown Penthouse",
      unit: "Unit 201",
      component: "Electrical System",
      priority: "Low",
      nextService: "2024-05-10",
    },
  ]

  const componentBreakdown = [
    { component: "HVAC System", count: 12, issues: 2 },
    { component: "Plumbing System", count: 8, issues: 1 },
    { component: "Electrical System", count: 15, issues: 0 },
  ]

  const costByCategoryConfig = {
    appendPadding: 10,
    data: [
      { type: "HVAC", value: 45 },
      { type: "Plumbing", value: 25 },
      { type: "Electrical", value: 15 },
      { type: "Structural", value: 10 },
      { type: "Other", value: 5 },
    ],
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    label: {
      type: "outer",
      content: "{name} {percentage}",
    },
    interactions: [{ type: "element-active" }],
  }

  const healthScoreConfig = {
    data: [
      { date: "2023-01", score: 80 },
      { date: "2023-02", score: 82 },
      { date: "2023-03", score: 85 },
      { date: "2023-04", score: 83 },
      { date: "2023-05", score: 86 },
      { date: "2023-06", score: 88 },
    ],
    xField: "date",
    yField: "score",
    point: {
      size: 5,
      shape: "diamond",
    },
  }

  const maintenanceHistory = [
    {
      key: "1",
      date: "2024-01-15",
      type: "Routine Maintenance",
      description: "Replaced air filters and lubricated moving parts",
      technician: "John Smith",
      cost: 150,
    },
    {
      key: "2",
      date: "2023-12-20",
      type: "Emergency Repair",
      description: "Fixed a burst pipe in the plumbing system",
      technician: "Sarah Johnson",
      cost: 450,
    },
  ]

  const columns = [
    {
      title: "Component",
      dataIndex: "component",
      key: "component",
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: "Property",
      dataIndex: "property",
      key: "property",
    },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "unit",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (priority: string) => <Tag color={getPriorityColor(priority)}>{priority}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: "Health Score",
      dataIndex: "healthScore",
      key: "healthScore",
      render: (healthScore: number) => (
        <Progress percent={healthScore} status="active" strokeColor={getHealthScoreColor(healthScore)} />
      ),
    },
    {
      title: "Next Service",
      dataIndex: "nextService",
      key: "nextService",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record: MaintenanceItemType) => (
        <Space size="middle">
          <Button type="link" onClick={() => showModal(record)}>
            View
          </Button>
          <Popconfirm
            title="Are you sure to delete this component?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const historyColumns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Technician",
      dataIndex: "technician",
      key: "technician",
    },
    {
      title: "Cost",
      dataIndex: "cost",
      key: "cost",
      render: (cost: number) => `$${cost}`,
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "red"
      case "Medium":
        return "orange"
      case "Low":
        return "green"
      default:
        return "gray"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "green"
      case "Inactive":
        return "red"
      case "Warning":
        return "orange"
      default:
        return "gray"
    }
  }

  const getHealthScoreColor = (healthScore: number) => {
    if (healthScore > 70) {
      return "#52c41a"
    } else if (healthScore > 50) {
      return "#faad14"
    } else {
      return "#f5222d"
    }
  }

  const showModal = (item: MaintenanceItemType) => {
    setSelectedItem(item)
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const handleDelete = (id: string) => {
    console.log("Deleting component with ID:", id)
    // Implement delete logic here
  }

  // Component health monitoring functions
  const monitorComponentHealth = (componentId: string) => {
    // In a real implementation, this would connect to IoT sensors or data sources
    notification.info({
      message: "Health Monitoring Activated",
      description: `Real-time monitoring has been activated for component ${componentId}. You will receive alerts when metrics exceed thresholds.`,
      duration: 4,
    })
  }

  const runDiagnostics = (componentId: string) => {
    message.loading({ content: "Running diagnostics...", key: "diagnostics" })

    // Simulate diagnostic process
    setTimeout(() => {
      message.success({
        content: "Diagnostics completed. No critical issues found.",
        key: "diagnostics",
        duration: 4,
      })
    }, 2000)
  }

  const updateHealthScore = (componentId: string, newScore: number) => {
    // This would update the health score in a real implementation
    message.success(`Health score updated to ${newScore}%`)
  }

  // Maintenance scheduling functions
  const scheduleMaintenanceTask = (values: any) => {
    console.log("Scheduling maintenance task:", values)
    message.success("Maintenance task scheduled successfully")
    setIsModalVisible(false)
    form.resetFields()
  }

  const generateOptimalSchedule = () => {
    message.loading({ content: "Generating optimal maintenance schedule...", key: "schedule" })

    // Simulate schedule generation
    setTimeout(() => {
      message.success({
        content: "Optimal maintenance schedule generated based on component health and usage patterns.",
        key: "schedule",
        duration: 4,
      })
    }, 2500)
  }

  const updateMaintenanceThresholds = (values: any) => {
    console.log("Updating maintenance thresholds:", values)
    message.success("Maintenance thresholds updated successfully")
    setIsAlertThresholdModalVisible(false)
    thresholdForm.resetFields()
  }

  // Risk assessment functions
  const runRiskAnalysis = () => {
    message.loading({ content: "Running comprehensive risk analysis...", key: "risk" })

    // Simulate risk analysis
    setTimeout(() => {
      message.success({
        content: "Risk analysis completed. 3 components identified with elevated risk.",
        key: "risk",
        duration: 4,
      })
    }, 3000)
  }

  const predictFailureProbability = (componentId: string) => {
    // This would use machine learning models to predict failure in a real implementation
    return Math.floor(Math.random() * 30) + 5 // Random value between 5-35%
  }

  const identifyRiskFactors = (componentId: string) => {
    // In a real implementation, this would analyze historical data and current conditions
    const riskFactors = [
      { factor: "Age", impact: "High", description: "Component is nearing end of expected lifespan" },
      { factor: "Usage Intensity", impact: "Medium", description: "Component usage is above average" },
      {
        factor: "Environmental Conditions",
        impact: "Low",
        description: "Operating within normal environmental parameters",
      },
    ]

    return riskFactors
  }

  // Cost optimization functions
  const calculateCostSavings = () => {
    // In a real implementation, this would analyze historical repair costs vs preventive maintenance
    return {
      preventiveCost: 12500,
      estimatedRepairCost: 45000,
      savings: 32500,
      savingsPercentage: 72,
    }
  }

  const optimizeMaintenanceBudget = () => {
    message.loading({ content: "Optimizing maintenance budget allocation...", key: "budget" })

    // Simulate budget optimization
    setTimeout(() => {
      message.success({
        content: "Budget optimization complete. Recommended allocation updated.",
        key: "budget",
        duration: 4,
      })
    }, 2000)
  }

  const generateROIReport = () => {
    setIsGeneratingReport(true)

    // Simulate report generation
    setTimeout(() => {
      setIsGeneratingReport(false)
      message.success("ROI report generated and available for download")
    }, 3000)
  }

  // Performance metrics functions
  const analyzePerformanceTrends = () => {
    message.loading({ content: "Analyzing performance trends...", key: "performance" })

    // Simulate performance analysis
    setTimeout(() => {
      message.success({
        content: "Performance analysis complete. Efficiency has improved by 8% over the last quarter.",
        key: "performance",
        duration: 4,
      })
    }, 2500)
  }

  const calculateReliabilityMetrics = (componentId: string) => {
    // In a real implementation, this would calculate MTBF, availability, etc.
    return {
      mtbf: Math.floor(Math.random() * 200) + 100, // Mean Time Between Failures (days)
      availability: (Math.random() * 5 + 94).toFixed(1), // Availability percentage
      reliabilityScore: Math.floor(Math.random() * 20) + 80, // Overall reliability score
    }
  }

  const trackEnergyEfficiency = (componentId: string) => {
    // This would track energy usage in a real implementation
    return {
      currentEfficiency: Math.floor(Math.random() * 20) + 70,
      targetEfficiency: 95,
      trend: "improving",
    }
  }

  // Add Component Modal
  const renderAddComponentModal = () => (
    <Modal
      title="Add New Component for Monitoring"
      open={isAddComponentModalVisible}
      onCancel={() => setIsAddComponentModalVisible(false)}
      footer={[
        <Button key="back" onClick={() => setIsAddComponentModalVisible(false)}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => {
            form
              .validateFields()
              .then((values) => {
                form.resetFields()
                setIsAddComponentModalVisible(false)
                message.success("Component added successfully to monitoring system")
              })
              .catch((info) => {
                console.log("Validate Failed:", info)
              })
          }}
        >
          Add Component
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" name="add_component_form">
        <Form.Item name="property" label="Property" rules={[{ required: true, message: "Please select a property" }]}>
          <Select placeholder="Select property">
            <Option value="property1">Modern Luxury Apartment</Option>
            <Option value="property2">Cozy Studio Loft</Option>
            <Option value="property3">Downtown Penthouse</Option>
            <Option value="property4">Suburban Family Home</Option>
            <Option value="property5">Beachfront Villa</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="unit"
          label="Unit/Area"
          rules={[{ required: true, message: "Please specify the unit or area" }]}
        >
          <Select placeholder="Select unit or area">
            <Option value="common">Building Common Area</Option>
            <Option value="hvac">Building HVAC</Option>
            <Option value="unit101">Unit 101</Option>
            <Option value="unit102">Unit 102</Option>
            <Option value="unit201">Unit 201</Option>
            <Option value="unit202">Unit 202</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="component"
          label="Component Name"
          rules={[{ required: true, message: "Please enter the component name" }]}
        >
          <Input placeholder="e.g., Water Heater, HVAC System, etc." />
        </Form.Item>

        <Form.Item name="category" label="Category" rules={[{ required: true, message: "Please select a category" }]}>
          <Select placeholder="Select category">
            <Option value="mechanical">Mechanical</Option>
            <Option value="plumbing">Plumbing</Option>
            <Option value="electrical">Electrical</Option>
            <Option value="structural">Structural</Option>
            <Option value="safety">Safety</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="installDate"
          label="Installation Date"
          rules={[{ required: true, message: "Please select the installation date" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="manufacturer" label="Manufacturer">
          <Input placeholder="Enter manufacturer name" />
        </Form.Item>

        <Form.Item name="model" label="Model Number">
          <Input placeholder="Enter model number" />
        </Form.Item>

        <Form.Item
          name="expectedLifespan"
          label="Expected Lifespan (years)"
          rules={[{ required: true, message: "Please enter the expected lifespan" }]}
        >
          <InputNumber min={1} max={50} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="initialHealthScore"
          label="Initial Health Score"
          rules={[{ required: true, message: "Please set the initial health score" }]}
        >
          <Slider
            marks={{
              0: "Poor",
              25: "Fair",
              50: "Average",
              75: "Good",
              100: "Excellent",
            }}
            defaultValue={100}
          />
        </Form.Item>

        <Form.Item
          name="maintenanceFrequency"
          label="Maintenance Frequency"
          rules={[{ required: true, message: "Please select maintenance frequency" }]}
        >
          <Select placeholder="Select frequency">
            <Option value="monthly">Monthly</Option>
            <Option value="quarterly">Quarterly</Option>
            <Option value="biannual">Bi-Annual</Option>
            <Option value="annual">Annual</Option>
            <Option value="custom">Custom</Option>
          </Select>
        </Form.Item>

        <Form.Item name="documents" label="Upload Documentation">
          <Upload>
            <Button icon={<UploadOutlined />}>Upload manual or documentation</Button>
          </Upload>
        </Form.Item>

        <Form.Item name="notes" label="Additional Notes">
          <Input.TextArea rows={4} placeholder="Enter any additional information about this component" />
        </Form.Item>
      </Form>
    </Modal>
  )

  // Settings Modal
  const renderSettingsModal = () => (
    <Modal
      title="Predictive Maintenance Settings"
      open={isSettingsModalVisible}
      onCancel={() => setIsSettingsModalVisible(false)}
      footer={[
        <Button key="back" onClick={() => setIsSettingsModalVisible(false)}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => {
            settingsForm
              .validateFields()
              .then((values) => {
                settingsForm.resetFields()
                setIsSettingsModalVisible(false)
                message.success("Settings updated successfully")
              })
              .catch((info) => {
                console.log("Validate Failed:", info)
              })
          }}
        >
          Save Settings
        </Button>,
      ]}
      width={700}
    >
      <Form
        form={settingsForm}
        layout="vertical"
        name="settings_form"
        initialValues={{
          notificationPreference: "email",
          aiAnalysis: true,
          autoScheduling: true,
          dataCollection: "daily",
          riskThreshold: "medium",
        }}
      >
        <Tabs defaultActiveKey="notifications">
          <TabPane tab="Notifications" key="notifications">
            <Form.Item name="notificationPreference" label="Notification Preferences">
              <Radio.Group>
                <Radio value="email">Email</Radio>
                <Radio value="sms">SMS</Radio>
                <Radio value="both">Both</Radio>
                <Radio value="none">None</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item name="urgentAlerts" label="Urgent Alerts" valuePropName="checked">
              <Switch defaultChecked />
            </Form.Item>

            <Form.Item name="scheduledReports" label="Scheduled Reports">
              <Select defaultValue="weekly">
                <Option value="daily">Daily</Option>
                <Option value="weekly">Weekly</Option>
                <Option value="monthly">Monthly</Option>
                <Option value="none">None</Option>
              </Select>
            </Form.Item>

            <Form.Item name="alertRecipients" label="Alert Recipients">
              <Select mode="tags" style={{ width: "100%" }} placeholder="Add email addresses">
                <Option value="manager@example.com">manager@example.com</Option>
                <Option value="maintenance@example.com">maintenance@example.com</Option>
              </Select>
            </Form.Item>
          </TabPane>

          <TabPane tab="AI & Automation" key="automation">
            <Form.Item name="aiAnalysis" label="AI-Powered Analysis" valuePropName="checked">
              <Switch defaultChecked onChange={(checked) => setIsAIAnalysisEnabled(checked)} />
            </Form.Item>

            <Form.Item name="autoScheduling" label="Automatic Maintenance Scheduling" valuePropName="checked">
              <Switch defaultChecked />
            </Form.Item>

            <Form.Item name="dataCollection" label="Data Collection Frequency">
              <Radio.Group>
                <Radio value="hourly">Hourly</Radio>
                <Radio value="daily">Daily</Radio>
                <Radio value="weekly">Weekly</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item name="mlModel" label="Machine Learning Model">
              <Select defaultValue="standard">
                <Option value="standard">Standard (Recommended)</Option>
                <Option value="aggressive">Aggressive (More Alerts)</Option>
                <Option value="conservative">Conservative (Fewer Alerts)</Option>
                <Option value="custom">Custom</Option>
              </Select>
            </Form.Item>
          </TabPane>

          <TabPane tab="Risk Management" key="risk">
            <Form.Item name="riskThreshold" label="Risk Threshold">
              <Radio.Group>
                <Radio value="low">Low (More Alerts)</Radio>
                <Radio value="medium">Medium (Recommended)</Radio>
                <Radio value="high">High (Fewer Alerts)</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item name="criticalComponents" label="Critical Components">
              <Select mode="multiple" placeholder="Select critical components">
                {maintenanceItems.map((item) => (
                  <Option key={item.id} value={item.id}>
                    {item.component} ({item.property})
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="autoRiskAssessment" label="Automatic Risk Assessment" valuePropName="checked">
              <Switch defaultChecked />
            </Form.Item>
          </TabPane>

          <TabPane tab="Integration" key="integration">
            <Form.Item name="workOrderSystem" label="Work Order System Integration" valuePropName="checked">
              <Switch defaultChecked />
            </Form.Item>

            <Form.Item name="buildingManagementSystem" label="Building Management System">
              <Select placeholder="Select BMS">
                <Option value="none">None</Option>
                <Option value="johnson">Johnson Controls</Option>
                <Option value="siemens">Siemens</Option>
                <Option value="honeywell">Honeywell</Option>
                <Option value="schneider">Schneider Electric</Option>
              </Select>
            </Form.Item>

            <Form.Item name="iotSensors" label="IoT Sensor Network" valuePropName="checked">
              <Switch />
            </Form.Item>

            <Form.Item name="financialSystem" label="Financial System Integration" valuePropName="checked">
              <Switch defaultChecked />
            </Form.Item>
          </TabPane>
        </Tabs>
      </Form>
    </Modal>
  )

  // Alert Threshold Modal
  const renderAlertThresholdModal = () => (
    <Modal
      title="Configure Alert Thresholds"
      open={isAlertThresholdModalVisible}
      onCancel={() => setIsAlertThresholdModalVisible(false)}
      footer={[
        <Button key="back" onClick={() => setIsAlertThresholdModalVisible(false)}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => {
            thresholdForm
              .validateFields()
              .then((values) => {
                updateMaintenanceThresholds(values)
              })
              .catch((info) => {
                console.log("Validate Failed:", info)
              })
          }}
        >
          Save Thresholds
        </Button>,
      ]}
    >
      <Form
        form={thresholdForm}
        layout="vertical"
        name="threshold_form"
        initialValues={{
          healthScoreThreshold: 70,
          temperatureThreshold: 85,
          vibrationThreshold: 50,
          noiseThreshold: 60,
          energyUsageThreshold: 110,
        }}
      >
        <Alert
          message="Threshold Configuration"
          description="Set the thresholds at which the system will generate alerts for maintenance. Lower thresholds will generate more alerts."
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <Form.Item
          name="healthScoreThreshold"
          label="Health Score Threshold (%)"
          tooltip="Alert when health score falls below this value"
        >
          <Slider
            marks={{
              50: "50",
              60: "60",
              70: "70",
              80: "80",
              90: "90",
            }}
          />
        </Form.Item>

        <Form.Item
          name="temperatureThreshold"
          label="Temperature Threshold (°F)"
          tooltip="Alert when temperature exceeds this value"
        >
          <Slider
            marks={{
              70: "70°F",
              80: "80°F",
              90: "90°F",
              100: "100°F",
            }}
          />
        </Form.Item>

        <Form.Item
          name="vibrationThreshold"
          label="Vibration Threshold (%)"
          tooltip="Alert when vibration exceeds this percentage of normal"
        >
          <Slider
            marks={{
              25: "25%",
              50: "50%",
              75: "75%",
              100: "100%",
            }}
          />
        </Form.Item>

        <Form.Item name="noiseThreshold" label="Noise Threshold (dB)" tooltip="Alert when noise exceeds this level">
          <Slider
            marks={{
              40: "40dB",
              50: "50dB",
              60: "60dB",
              70: "70dB",
              80: "80dB",
            }}
          />
        </Form.Item>

        <Form.Item
          name="energyUsageThreshold"
          label="Energy Usage Threshold (%)"
          tooltip="Alert when energy usage exceeds this percentage of normal"
        >
          <Slider
            marks={{
              100: "100%",
              110: "110%",
              120: "120%",
              130: "130%",
              140: "140%",
            }}
          />
        </Form.Item>

        <Form.Item name="customThresholds" label="Component-Specific Thresholds">
          <Select mode="multiple" placeholder="Select components for custom thresholds">
            {maintenanceItems.map((item) => (
              <Option key={item.id} value={item.id}>
                {item.component} ({item.property})
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )

  return (
    <DashboardLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Title level={2}>Predictive Maintenance</Title>
        <Space>
          <Input
            placeholder="Search components..."
            prefix={<SearchOutlined />}
            style={{ width: 200 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Select defaultValue="all" style={{ width: 200 }} onChange={(value) => setPropertyFilter(value)}>
            <Option value="all">All Properties</Option>
            <Option value="luxury">Modern Luxury Apartment</Option>
            <Option value="studio">Cozy Studio Loft</Option>
            <Option value="penthouse">Downtown Penthouse</Option>
            <Option value="suburban">Suburban Family Home</Option>
            <Option value="villa">Beachfront Villa</Option>
          </Select>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsAddComponentModalVisible(true)}>
            Add Component
          </Button>
        </Space>
      </div>
      <Divider />

      {/* Summary Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Critical Items"
              value={criticalItems}
              valueStyle={{ color: "#f5222d" }}
              prefix={<ExclamationCircleOutlined />}
            />
            <div style={{ marginTop: 8 }}>
              <Button type="link" size="small" onClick={runRiskAnalysis}>
                Run Risk Analysis
              </Button>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="High Priority Items"
              value={highPriorityItems}
              valueStyle={{ color: "#fa8c16" }}
              prefix={<WarningOutlined />}
            />
            <div style={{ marginTop: 8 }}>
              <Button type="link" size="small" onClick={generateOptimalSchedule}>
                Generate Schedule
              </Button>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Scheduled Maintenance"
              value={scheduledMaintenance}
              valueStyle={{ color: "#1890ff" }}
              prefix={<CalendarOutlined />}
            />
            <div style={{ marginTop: 8 }}>
              <Button type="link" size="small" onClick={() => setIsAlertThresholdModalVisible(true)}>
                Configure Alerts
              </Button>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Healthy Components"
              value={healthyComponents}
              valueStyle={{ color: "#52c41a" }}
              prefix={<CheckCircleOutlined />}
            />
            <div style={{ marginTop: 8 }}>
              <Button type="link" size="small" onClick={analyzePerformanceTrends}>
                Performance Trends
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Cost Optimization Summary */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card
            title={
              <Space>
                <DollarOutlined />
                <span>Cost Optimization</span>
              </Space>
            }
            extra={
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                loading={isGeneratingReport}
                onClick={generateROIReport}
              >
                Generate ROI Report
              </Button>
            }
            bordered={false}
          >
            <Row gutter={16}>
              <Col span={6}>
                <Statistic
                  title="Preventive Maintenance Cost"
                  value={calculateCostSavings().preventiveCost}
                  prefix="$"
                  valueStyle={{ color: "#1890ff" }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="Estimated Repair Cost (without PM)"
                  value={calculateCostSavings().estimatedRepairCost}
                  prefix="$"
                  valueStyle={{ color: "#cf1322" }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="Projected Savings"
                  value={calculateCostSavings().savings}
                  prefix="$"
                  valueStyle={{ color: "#3f8600" }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="Savings Percentage"
                  value={calculateCostSavings().savingsPercentage}
                  suffix="%"
                  valueStyle={{ color: "#3f8600" }}
                  prefix={<RiseOutlined />}
                />
                <Button type="link" size="small" onClick={optimizeMaintenanceBudget} style={{ marginTop: 8 }}>
                  Optimize Budget
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Tabs defaultActiveKey="overview">
        <TabPane
          tab={
            <span>
              <BarChartOutlined />
              Overview
            </span>
          }
          key="overview"
        >
          <Row gutter={16}>
            <Col span={16}>
              <Card
                title="Maintenance Items by Status"
                bordered={false}
                extra={
                  <Radio.Group value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
                    <Radio.Button value="table">
                      <BarChartOutlined />
                    </Radio.Button>
                    <Radio.Button value="card">
                      <AppstoreOutlined />
                    </Radio.Button>
                    <Radio.Button value="calendar">
                      <CalendarOutlined />
                    </Radio.Button>
                  </Radio.Group>
                }
              >
                <Table columns={columns} dataSource={maintenanceItems} rowKey="key" pagination={{ pageSize: 10 }} />
              </Card>
            </Col>
            <Col span={8}>
              <Card title="Upcoming Maintenance" bordered={false} style={{ marginBottom: 16 }}>
                <List
                  itemLayout="horizontal"
                  dataSource={upcomingMaintenance.slice(0, 5)}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            icon={<ToolOutlined />}
                            style={{ backgroundColor: getPriorityColor(item.priority) }}
                          />
                        }
                        title={<a onClick={() => showModal(item)}>{item.component}</a>}
                        description={
                          <Space direction="vertical" size={0}>
                            <Text>
                              {item.property} - {item.unit}
                            </Text>
                            <Space>
                              <Tag color={getPriorityColor(item.priority)}>{item.priority}</Tag>
                              <Text type="secondary">{item.nextService}</Text>
                            </Space>
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
              <Card title="Component Breakdown" bordered={false}>
                <List
                  itemLayout="horizontal"
                  dataSource={componentBreakdown}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        title={item.component}
                        description={
                          <Space>
                            <Badge count={item.count} style={{ backgroundColor: "#1890ff" }} />
                            {item.issues > 0 && (
                              <Badge count={`${item.issues} issues`} style={{ backgroundColor: "#f5222d" }} />
                            )}
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={16} style={{ marginTop: 16 }}>
            <Col span={12}>
              <Card title="Maintenance Cost by Category" bordered={false}>
                <Pie {...costByCategoryConfig} height={300} />
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Maintenance Calendar" bordered={false}>
                <Calendar
                  fullscreen={false}
                  cellRender={(date) => {
                    const dateStr = date.format("YYYY-MM-DD")
                    const item = upcomingMaintenance.find((m) => m.nextService === dateStr)

                    if (item) {
                      return (
                        <div>
                          <Badge
                            status="warning"
                            text={item.component}
                            style={{
                              fontSize: "10px",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          />
                        </div>
                      )
                    }
                    return null
                  }}
                  dateFullCellRender={(date) => {
                    const dateStr = date.format("YYYY-MM-DD")
                    const item = upcomingMaintenance.find((m) => m.nextService === dateStr)

                    return (
                      <div
                        style={{
                          height: "100%",
                          padding: "4px",
                          backgroundColor: item ? `${getPriorityColor(item.priority)}20` : "transparent",
                          border: item ? `1px solid ${getPriorityColor(item.priority)}` : "none",
                        }}
                      >
                        <div>{date.date()}</div>
                        {item && (
                          <div style={{ fontSize: "10px" }}>
                            <Tooltip title={`${item.component} (${item.property})`}>
                              <span
                                style={{
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  display: "block",
                                }}
                              >
                                {item.component}
                              </span>
                            </Tooltip>
                          </div>
                        )}
                      </div>
                    )
                  }}
                />
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane
          tab={
            <span>
              <LineChartOutlined />
              Performance Metrics
            </span>
          }
          key="performance"
        >
          <Row gutter={16}>
            <Col span={24}>
              <Card
                title="System Performance Overview"
                bordered={false}
                extra={
                  <Space>
                    <DatePicker.RangePicker value={dateRange} onChange={(dates) => setDateRange(dates)} />
                    <Button type="primary" icon={<SyncOutlined />} onClick={analyzePerformanceTrends}>
                      Refresh Analysis
                    </Button>
                  </Space>
                }
              >
                <Row gutter={16}>
                  <Col span={8}>
                    <Card title="Overall System Health" bordered={false}>
                      <Gauge
                        percent={78}
                        range={{ color: "l(0) 0:#F4664A 0.5:#FAAD14 1:#30BF78" }}
                        startAngle={Math.PI}
                        endAngle={2 * Math.PI}
                        indicators={[
                          { percent: 0.3, text: "Poor" },
                          { percent: 0.7, text: "Good" },
                          { percent: 0.9, text: "Excellent" },
                        ]}
                        height={200}
                      />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card title="Efficiency Metrics" bordered={false}>
                      <div style={{ marginBottom: 16 }}>
                        <Text>Energy Efficiency</Text>
                        <Progress percent={75} status="active" />
                      </div>
                      <div style={{ marginBottom: 16 }}>
                        <Text>Operational Efficiency</Text>
                        <Progress percent={82} status="active" />
                      </div>
                      <div>
                        <Text>Cost Efficiency</Text>
                        <Progress percent={68} status="active" />
                      </div>
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card title="Reliability Metrics" bordered={false}>
                      <div style={{ marginBottom: 16 }}>
                        <Statistic title="Mean Time Between Failures" value={365} suffix="days" />
                      </div>
                      <div>
                        <Statistic title="System Availability" value={99.2} suffix="%" precision={1} />
                      </div>
                    </Card>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>

          <Row gutter={16} style={{ marginTop: 16 }}>
            <Col span={12}>
              <Card title="Maintenance Efficiency Trend" bordered={false}>
                <DualAxes
                  data={[
                    [
                      { month: "Jan", value: 12 },
                      { month: "Feb", value: 8 },
                      { month: "Mar", value: 15 },
                      { month: "Apr", value: 10 },
                      { month: "May", value: 7 },
                      { month: "Jun", value: 5 },
                    ],
                    [
                      { month: "Jan", efficiency: 68 },
                      { month: "Feb", efficiency: 72 },
                      { month: "Mar", efficiency: 70 },
                      { month: "Apr", efficiency: 76 },
                      { month: "May", efficiency: 82 },
                      { month: "Jun", efficiency: 88 },
                    ],
                  ]}
                  xField="month"
                  yField={["value", "efficiency"]}
                  geometryOptions={[
                    {
                      geometry: "column",
                      color: "#1890ff",
                    },
                    {
                      geometry: "line",
                      color: "#f5222d",
                      lineStyle: {
                        lineWidth: 2,
                      },
                    },
                  ]}
                  height={300}
                />
                <div style={{ textAlign: "center", marginTop: 8 }}>
                  <Text type="secondary">Number of Maintenance Tasks vs. System Efficiency</Text>
                </div>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Component Performance Comparison" bordered={false}>
                <Column
                  data={[
                    { category: "HVAC", value: 85, benchmark: 90 },
                    { category: "Plumbing", value: 92, benchmark: 88 },
                    { category: "Electrical", value: 78, benchmark: 85 },
                    { category: "Structural", value: 95, benchmark: 92 },
                    { category: "Safety", value: 97, benchmark: 95 },
                  ]}
                  xField="category"
                  yField="value"
                  seriesField="type"
                  isGroup={true}
                  columnStyle={{
                    radius: [20, 20, 0, 0],
                  }}
                  height={300}
                />
                <div style={{ textAlign: "center", marginTop: 8 }}>
                  <Text type="secondary">Current Performance vs. Industry Benchmark</Text>
                </div>
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane
          tab={
            <span>
              <WarningOutlined />
              Risk Assessment
            </span>
          }
          key="risk"
        >
          <Row gutter={16}>
            <Col span={24}>
              <Card
                title="System Risk Overview"
                bordered={false}
                extra={
                  <Button type="primary" danger icon={<ExclamationCircleOutlined />} onClick={runRiskAnalysis}>
                    Run Comprehensive Risk Analysis
                  </Button>
                }
              >
                <Alert
                  message="Risk Assessment Summary"
                  description="The system has identified 3 components with elevated risk levels that may require attention in the next 30 days. Overall system risk is moderate."
                  type="warning"
                  showIcon
                  style={{ marginBottom: 16 }}
                />

                <Row gutter={16}>
                  <Col span={8}>
                    <Card title="Risk Distribution" bordered={false}>
                      <Pie
                        data={[
                          { type: "Critical Risk", value: 2 },
                          { type: "High Risk", value: 3 },
                          { type: "Medium Risk", value: 8 },
                          { type: "Low Risk", value: 12 },
                        ]}
                        angleField="value"
                        colorField="type"
                        radius={0.8}
                        label={{
                          type: "outer",
                          content: "{name} {percentage}",
                        }}
                        height={250}
                      />
                    </Card>
                  </Col>
                  <Col span={16}>
                    <Card title="Components with Highest Risk" bordered={false}>
                      <Table
                        dataSource={[
                          {
                            key: "1",
                            component: "HVAC System",
                            property: "Modern Luxury Apartment",
                            failureProbability: "35%",
                            impact: "High",
                            recommendedAction: "Schedule inspection within 7 days",
                          },
                          {
                            key: "2",
                            component: "Furnace",
                            property: "Suburban Family Home",
                            failureProbability: "28%",
                            impact: "High",
                            recommendedAction: "Replace critical components",
                          },
                          {
                            key: "3",
                            component: "Elevator",
                            property: "Modern Luxury Apartment",
                            failureProbability: "22%",
                            impact: "Critical",
                            recommendedAction: "Perform preventive maintenance",
                          },
                        ]}
                        columns={[
                          {
                            title: "Component",
                            dataIndex: "component",
                            key: "component",
                          },
                          {
                            title: "Property",
                            dataIndex: "property",
                            key: "property",
                          },
                          {
                            title: "Failure Probability",
                            dataIndex: "failureProbability",
                            key: "failureProbability",
                            render: (text) => (
                              <Tag
                                color={
                                  text.replace("%", "") > 30 ? "red" : text.replace("%", "") > 20 ? "orange" : "green"
                                }
                              >
                                {text}
                              </Tag>
                            ),
                          },
                          {
                            title: "Impact",
                            dataIndex: "impact",
                            key: "impact",
                            render: (text) => (
                              <Tag
                                color={
                                  text === "Critical"
                                    ? "red"
                                    : text === "High"
                                      ? "orange"
                                      : text === "Medium"
                                        ? "blue"
                                        : "green"
                                }
                              >
                                {text}
                              </Tag>
                            ),
                          },
                          {
                            title: "Recommended Action",
                            dataIndex: "recommendedAction",
                            key: "recommendedAction",
                          },
                          {
                            title: "Action",
                            key: "action",
                            render: (_, record) => (
                              <Space size="small">
                                <Button size="small" type="primary">
                                  Create Work Order
                                </Button>
                              </Space>
                            ),
                          },
                        ]}
                        pagination={false}
                      />
                    </Card>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>

          <Row gutter={16} style={{ marginTop: 16 }}>
            <Col span={12}>
              <Card title="Risk Factors Analysis" bordered={false}>
                <List
                  itemLayout="horizontal"
                  dataSource={[
                    {
                      factor: "Component Age",
                      description: "Components nearing end of expected lifespan have higher failure rates",
                      impact: "High",
                      mitigation: "Implement age-based replacement schedule",
                    },
                    {
                      factor: "Usage Intensity",
                      description: "Components under heavy usage experience accelerated wear",
                      impact: "Medium",
                      mitigation: "Adjust maintenance frequency based on usage patterns",
                    },
                    {
                      factor: "Environmental Conditions",
                      description: "Extreme temperatures and humidity affect component reliability",
                      impact: "Medium",
                      mitigation: "Monitor environmental conditions and adjust operations",
                    },
                    {
                      factor: "Maintenance History",
                      description: "Components with irregular maintenance have higher failure rates",
                      impact: "High",
                      mitigation: "Enforce regular maintenance schedule",
                    },
                    {
                      factor: "Manufacturer Quality",
                      description: "Component quality varies by manufacturer and model",
                      impact: "Medium",
                      mitigation: "Standardize on reliable manufacturers and models",
                    },
                  ]}
                  renderItem={(item) => (
                    <List.Item key={item.factor}>
                      <List.Item.Meta
                        title={
                          <Space>
                            {item.factor}
                            <Tag color={item.impact === "High" ? "red" : item.impact === "Medium" ? "orange" : "green"}>
                              {item.impact} Impact
                            </Tag>
                          </Space>
                        }
                        description={
                          <>
                            <div>{item.description}</div>
                            <div style={{ marginTop: 4 }}>
                              <Text strong>Mitigation: </Text>
                              <Text>{item.mitigation}</Text>
                            </div>
                          </>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Predictive Failure Analysis" bordered={false}>
                <Alert
                  message="AI-Powered Analysis"
                  description="The system uses machine learning algorithms to predict component failures based on historical data, usage patterns, and sensor readings."
                  type="info"
                  showIcon
                  style={{ marginBottom: 16 }}
                />

                <Line
                  data={[
                    { date: "2023-01", hvac: 95, plumbing: 98, electrical: 97 },
                    { date: "2023-02", hvac: 94, plumbing: 97, electrical: 96 },
                    { date: "2023-03", hvac: 92, plumbing: 97, electrical: 95 },
                    { date: "2023-04", hvac: 90, plumbing: 96, electrical: 95 },
                    { date: "2023-05", hvac: 87, plumbing: 95, electrical: 94 },
                    { date: "2023-06", hvac: 85, plumbing: 94, electrical: 93 },
                    { date: "2023-07", hvac: 82, plumbing: 93, electrical: 92 },
                    { date: "2023-08", hvac: 78, plumbing: 92, electrical: 91 },
                    { date: "2023-09", hvac: 75, plumbing: 91, electrical: 90 },
                    { date: "2023-10", hvac: 70, plumbing: 90, electrical: 89 },
                    { date: "2023-11", hvac: 65, plumbing: 89, electrical: 88 },
                    { date: "2023-12", hvac: 60, plumbing: 87, electrical: 87 },
                  ]}
                  xField="date"
                  yField={["hvac", "plumbing", "electrical"]}
                  seriesField="category"
                  yAxis={{
                    label: {
                      formatter: (v) => `${v}%`,
                    },
                    min: 50,
                    max: 100,
                  }}
                  legend={{
                    position: "top",
                  }}
                  smooth={true}
                  height={300}
                />
                <div style={{ textAlign: "center", marginTop: 8 }}>
                  <Text type="secondary">Predicted Health Score Trend by System Type</Text>
                </div>

                <Divider />

                <Row gutter={16}>
                  <Col span={12}>
                    <Statistic title="Predicted Next Failure" value="HVAC System" valueStyle={{ color: "#cf1322" }} />
                    <div style={{ marginTop: 4 }}>
                      <Text type="secondary">Estimated in 45-60 days</Text>
                    </div>
                  </Col>
                  <Col span={12}>
                    <Statistic title="Confidence Level" value={78} suffix="%" valueStyle={{ color: "#faad14" }} />
                    <div style={{ marginTop: 4 }}>
                      <Text type="secondary">Based on historical patterns</Text>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane
          tab={
            <span>
              <SettingOutlined />
              Maintenance Settings
            </span>
          }
          key="settings"
        >
          <Card bordered={false}>
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <Title level={4}>Maintenance Schedule Configuration</Title>
              <Text>Configure maintenance schedules, thresholds, and notification settings.</Text>
              <div style={{ marginTop: 24 }}>
                <Space size="large">
                  <Button type="primary" icon={<SettingOutlined />} onClick={() => setIsSettingsModalVisible(true)}>
                    System Settings
                  </Button>
                  <Button icon={<BellOutlined />} onClick={() => setIsAlertThresholdModalVisible(true)}>
                    Alert Thresholds
                  </Button>
                  <Button icon={<CalendarOutlined />} onClick={generateOptimalSchedule}>
                    Generate Optimal Schedule
                  </Button>
                </Space>
              </div>
            </div>

            <Divider />

            <Row gutter={16}>
              <Col span={12}>
                <Card title="Maintenance Schedule Templates" bordered={false}>
                  <List
                    itemLayout="horizontal"
                    dataSource={[
                      {
                        title: "HVAC Quarterly Maintenance",
                        description: "Comprehensive inspection and service of HVAC systems",
                        interval: "Quarterly",
                        duration: "4 hours",
                      },
                      {
                        title: "Plumbing Annual Inspection",
                        description: "Complete inspection of all plumbing systems and fixtures",
                        interval: "Annual",
                        duration: "6 hours",
                      },
                      {
                        title: "Electrical Safety Check",
                        description: "Safety inspection of all electrical systems and components",
                        interval: "Semi-Annual",
                        duration: "3 hours",
                      },
                      {
                        title: "Roof and Structural Inspection",
                        description: "Inspection of roof, foundation, and structural elements",
                        interval: "Annual",
                        duration: "5 hours",
                      },
                      {
                        title: "Fire Safety System Test",
                        description: "Testing of all fire alarms, sprinklers, and safety equipment",
                        interval: "Quarterly",
                        duration: "2 hours",
                      },
                    ]}
                    renderItem={(item) => (
                      <List.Item
                        key={item.title}
                        actions={[<Button type="link">Edit</Button>, <Button type="link">Apply</Button>]}
                      >
                        <List.Item.Meta
                          title={item.title}
                          description={
                            <>
                              <div>{item.description}</div>
                              <div style={{ marginTop: 4 }}>
                                <Tag color="blue">{item.interval}</Tag>
                                <Tag color="green">{item.duration}</Tag>
                              </div>
                            </>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card title="Vendor Management" bordered={false}>
                  <List
                    itemLayout="horizontal"
                    dataSource={[
                      {
                        name: "ABC HVAC Services",
                        specialty: "HVAC",
                        rating: 4.8,
                        contact: "John Smith (555-123-4567)",
                      },
                      {
                        name: "Quality Plumbing Co.",
                        specialty: "Plumbing",
                        rating: 4.5,
                        contact: "Sarah Johnson (555-987-6543)",
                      },
                      {
                        name: "Elite Electrical",
                        specialty: "Electrical",
                        rating: 4.7,
                        contact: "Mike Williams (555-456-7890)",
                      },
                      {
                        name: "Structural Experts Inc.",
                        specialty: "Structural",
                        rating: 4.6,
                        contact: "David Lee (555-789-0123)",
                      },
                      {
                        name: "Safety First Systems",
                        specialty: "Safety & Security",
                        rating: 4.9,
                        contact: "Lisa Chen (555-234-5678)",
                      },
                    ]}
                    renderItem={(item) => (
                      <List.Item
                        key={item.name}
                        actions={[<Button type="link">History</Button>, <Button type="link">Contact</Button>]}
                      >
                        <List.Item.Meta
                          title={
                            <Space>
                              {item.name}
                              <Rate disabled defaultValue={Math.round(item.rating)} />
                            </Space>
                          }
                          description={
                            <>
                              <div>
                                <Tag color="blue">{item.specialty} Specialist</Tag>
                              </div>
                              <div style={{ marginTop: 4 }}>{item.contact}</div>
                            </>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>
          </Card>
        </TabPane>
      </Tabs>

      {/* Modals */}
      {renderAddComponentModal()}
      {renderSettingsModal()}
      {renderAlertThresholdModal()}

      {/* View Component Modal */}
      {selectedItem && (
        <Modal
          title={`Component Details: ${selectedItem.component}`}
          open={isModalVisible}
          onCancel={handleCancel}
          width={800}
          footer={[
            <Button key="back" onClick={handleCancel}>
              Close
            </Button>,
            <Button
              key="workOrder"
              type="primary"
              onClick={() => {
                handleCancel()
                console.log("Create work order", selectedItem.id)
              }}
            >
              Create Work Order
            </Button>,
          ]}
        >
          <Tabs defaultActiveKey="details">
            <TabPane
              tab={
                <span>
                  <ToolOutlined />
                  Component Details
                </span>
              }
              key="details"
            >
              <Row gutter={24}>
                <Col span={16}>
                  <Card bordered={false} style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
                      <Avatar
                        size={64}
                        icon={<ToolOutlined />}
                        style={{ marginRight: 16, backgroundColor: getPriorityColor(selectedItem.priority) }}
                      />
                      <div>
                        <Title level={4} style={{ margin: 0 }}>
                          {selectedItem.component}
                        </Title>
                        <Space>
                          <Tag color="blue">{selectedItem.category}</Tag>
                          <Tag color={getPriorityColor(selectedItem.priority)}>{selectedItem.priority}</Tag>
                          <Tag color={getStatusColor(selectedItem.status)}>{selectedItem.status}</Tag>
                        </Space>
                      </div>
                    </div>
                    <Divider style={{ margin: "12px 0" }} />
                    <div>
                      <p>
                        <strong>Property:</strong> {selectedItem.property}
                      </p>
                      <p>
                        <strong>Unit/Area:</strong> {selectedItem.unit}
                      </p>
                      <p>
                        <strong>Last Service Date:</strong> {selectedItem.lastService}
                      </p>
                      <p>
                        <strong>Next Service Date:</strong> {selectedItem.nextService}
                      </p>
                      <p>
                        <strong>Manufacturer:</strong> Johnson Controls
                      </p>
                      <p>
                        <strong>Model:</strong> XYZ-1000
                      </p>
                      <p>
                        <strong>Installation Date:</strong> 2020-06-15
                      </p>
                      <p>
                        <strong>Expected Lifespan:</strong> 15 years
                      </p>
                    </div>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card title="Health Score" bordered={false} style={{ marginBottom: 16 }}>
                    <div style={{ textAlign: "center" }}>
                      <Progress
                        type="circle"
                        percent={selectedItem.healthScore}
                        strokeColor={getHealthScoreColor(selectedItem.healthScore)}
                      />
                      <div style={{ marginTop: 16 }}>
                        <Text strong>Current Health</Text>
                      </div>
                    </div>
                    <Divider />
                    <div>
                      <Text>Health Score Trend</Text>
                      <Line {...healthScoreConfig} height={150} />
                    </div>
                  </Card>
                  <Card title="Maintenance Schedule" bordered={false}>
                    <Timeline>
                      <Timeline.Item color="green">
                        <p>
                          <strong>Last Maintenance</strong>
                        </p>
                        <p>{selectedItem.lastService}</p>
                        <p>Routine maintenance completed</p>
                      </Timeline.Item>
                      <Timeline.Item color="blue">
                        <p>
                          <strong>Next Scheduled Maintenance</strong>
                        </p>
                        <p>{selectedItem.nextService}</p>
                        <p>Regular maintenance due</p>
                      </Timeline.Item>
                      <Timeline.Item color="gray">
                        <p>
                          <strong>Future Maintenance</strong>
                        </p>
                        <p>
                          {
                            new Date(new Date(selectedItem.nextService).getTime() + 180 * 24 * 60 * 60 * 1000)
                              .toISOString()
                              .split("T")[0]
                          }
                        </p>
                        <p>6-month follow-up</p>
                      </Timeline.Item>
                    </Timeline>
                  </Card>
                </Col>
              </Row>
            </TabPane>

            <TabPane
              tab={
                <span>
                  <HistoryOutlined />
                  Maintenance History
                </span>
              }
              key="history"
            >
              <Card bordered={false}>
                <Table columns={historyColumns} dataSource={maintenanceHistory} rowKey="key" pagination={false} />
              </Card>
            </TabPane>

            <TabPane
              tab={
                <span>
                  <RiseOutlined />
                  Performance Metrics
                </span>
              }
              key="metrics"
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Card title="Efficiency Metrics" bordered={false} style={{ marginBottom: 16 }}>
                    <div style={{ marginBottom: 16 }}>
                      <Text>Energy Efficiency</Text>
                      <Progress percent={75} status="active" />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <Text>Operational Efficiency</Text>
                      <Progress percent={82} status="active" />
                    </div>
                    <div>
                      <Text>Cost Efficiency</Text>
                      <Progress percent={68} status="active" />
                    </div>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="Reliability Metrics" bordered={false} style={{ marginBottom: 16 }}>
                    <div style={{ marginBottom: 16 }}>
                      <Text>Mean Time Between Failures</Text>
                      <Statistic value={365} suffix="days" />
                    </div>
                    <div>
                      <Text>Availability</Text>
                      <Statistic value={99.2} suffix="%" precision={1} />
                    </div>
                  </Card>
                </Col>
              </Row>
              <Card title="Maintenance Cost History" bordered={false}>
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <Text>Detailed cost history and performance metrics will be displayed here.</Text>
                </div>
              </Card>
            </TabPane>

            <TabPane
              tab={
                <span>
                  <WarningOutlined />
                  Risk Assessment
                </span>
              }
              key="risk"
            >
              <Card bordered={false}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Card title="Risk Factors" bordered={false} style={{ marginBottom: 16 }}>
                      <List
                        itemLayout="horizontal"
                        dataSource={[
                          {
                            factor: "Age of Component",
                            risk: "Medium",
                            description: "Component is 4 years old (27% of expected lifespan)",
                          },
                          {
                            factor: "Usage Intensity",
                            risk: "High",
                            description: "Component is used heavily throughout the year",
                          },
                          {
                            factor: "Environmental Factors",
                            risk: "Low",
                            description: "Component is in a controlled environment",
                          },
                          {
                            factor: "Maintenance History",
                            risk: "Medium",
                            description: "Regular maintenance with occasional issues",
                          },
                          {
                            factor: "Failure Impact",
                            risk: "High",
                            description: "Failure would significantly impact property operations",
                          },
                        ]}
                        renderItem={(item) => (
                          <List.Item>
                            <List.Item.Meta
                              title={
                                <Space>
                                  {item.factor}
                                  <Tag
                                    color={item.risk === "High" ? "red" : item.risk === "Medium" ? "orange" : "green"}
                                  >
                                    {item.risk}
                                  </Tag>
                                </Space>
                              }
                              description={item.description}
                            />
                          </List.Item>
                        )}
                      />
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card title="Failure Prediction" bordered={false} style={{ marginBottom: 16 }}>
                      <div style={{ textAlign: "center", marginBottom: 24 }}>
                        <Statistic
                          title="Probability of Failure (Next 6 Months)"
                          value={selectedItem.healthScore < 70 ? 35 : 15}
                          suffix="%"
                          valueStyle={{ color: selectedItem.healthScore < 70 ? "#fa8c16" : "#52c41a" }}
                        />
                      </div>
                      <div>
                        <Text strong>Potential Failure Modes:</Text>
                        <ul>
                          <li>Compressor failure</li>
                          <li>Refrigerant leak</li>
                          <li>Control system malfunction</li>
                          <li>Fan motor failure</li>
                        </ul>
                      </div>
                    </Card>
                    <Card title="Recommended Actions" bordered={false}>
                      <List
                        itemLayout="horizontal"
                        dataSource={[
                          { action: "Schedule preventive maintenance", priority: "High", timeframe: "Within 30 days" },
                          { action: "Replace air filters", priority: "Medium", timeframe: "Within 60 days" },
                          { action: "Inspect refrigerant levels", priority: "Medium", timeframe: "Within 60 days" },
                          { action: "Clean condenser coils", priority: "Low", timeframe: "Within 90 days" },
                        ]}
                        renderItem={(item) => (
                          <List.Item>
                            <List.Item.Meta
                              avatar={
                                <Avatar
                                  icon={<CheckCircleOutlined />}
                                  style={{
                                    backgroundColor:
                                      item.priority === "High"
                                        ? "#fa8c16"
                                        : item.priority === "Medium"
                                          ? "#faad14"
                                          : "#52c41a",
                                  }}
                                />
                              }
                              title={item.action}
                              description={`${item.priority} priority - ${item.timeframe}`}
                            />
                          </List.Item>
                        )}
                      />
                    </Card>
                  </Col>
                </Row>
              </Card>
            </TabPane>
          </Tabs>
        </Modal>
      )}
    </DashboardLayout>
  )
}

export default PredictiveMaintenance

