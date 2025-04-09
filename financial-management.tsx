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
  Statistic,
  Progress,
  DatePicker,
  Select,
  Form,
  Input,
  Modal,
  Tooltip,
  Dropdown,
} from "antd"
import {
  DollarOutlined,
  BarChartOutlined,
  FileTextOutlined,
  BankOutlined,
  PlusOutlined,
  DownloadOutlined,
  FilterOutlined,
  SyncOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  SettingOutlined,
} from "@ant-design/icons"
import DashboardLayout from "../DashboardLayout"
import { Line, Column } from "@ant-design/charts"

const { Title, Text } = Typography
const { Option } = Select
const { TabPane } = Tabs
const { RangePicker } = DatePicker

interface TransactionType {
  key: string
  id: string
  date: string
  description: string
  category: string
  property: string
  amount: number
  type: string
  status: string
}

interface BudgetType {
  key: string
  category: string
  budgeted: number
  actual: number
  variance: number
  percentUsed: number
}

const FinancialManagement: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [activeTab, setActiveTab] = useState("transactions")
  const [dateRange, setDateRange] = useState<[string, string]>(["2024-01-01", "2024-03-31"])
  const [propertyFilter, setPropertyFilter] = useState<string>("all")

  // Sample data for transactions
  const transactions: TransactionType[] = [
    {
      key: "1",
      id: "TRX-001",
      date: "2024-03-15",
      description: "Rent Payment - Unit 101",
      category: "Rent",
      property: "Modern Luxury Apartment",
      amount: 2500,
      type: "Income",
      status: "Completed",
    },
    {
      key: "2",
      id: "TRX-002",
      date: "2024-03-10",
      description: "Plumbing Repair",
      category: "Maintenance",
      property: "Modern Luxury Apartment",
      amount: 350,
      type: "Expense",
      status: "Completed",
    },
    {
      key: "3",
      id: "TRX-003",
      date: "2024-03-05",
      description: "Rent Payment - Unit 202",
      category: "Rent",
      property: "Cozy Studio Loft",
      amount: 1800,
      type: "Income",
      status: "Completed",
    },
    {
      key: "4",
      id: "TRX-004",
      date: "2024-03-01",
      description: "Property Insurance",
      category: "Insurance",
      property: "All Properties",
      amount: 1200,
      type: "Expense",
      status: "Completed",
    },
    {
      key: "5",
      id: "TRX-005",
      date: "2024-02-28",
      description: "Rent Payment - Penthouse",
      category: "Rent",
      property: "Downtown Penthouse",
      amount: 3200,
      type: "Income",
      status: "Completed",
    },
    {
      key: "6",
      id: "TRX-006",
      date: "2024-02-25",
      description: "Landscaping Service",
      category: "Maintenance",
      property: "Suburban Family Home",
      amount: 250,
      type: "Expense",
      status: "Completed",
    },
    {
      key: "7",
      id: "TRX-007",
      date: "2024-02-20",
      description: "Property Tax Payment",
      category: "Taxes",
      property: "All Properties",
      amount: 3500,
      type: "Expense",
      status: "Completed",
    },
    {
      key: "8",
      id: "TRX-008",
      date: "2024-02-15",
      description: "Rent Payment - Unit 303",
      category: "Rent",
      property: "Modern Luxury Apartment",
      amount: 2200,
      type: "Income",
      status: "Completed",
    },
    {
      key: "9",
      id: "TRX-009",
      date: "2024-03-20",
      description: "Utility Bill Payment",
      category: "Utilities",
      property: "Beachfront Villa",
      amount: 450,
      type: "Expense",
      status: "Pending",
    },
    {
      key: "10",
      id: "TRX-010",
      date: "2024-03-25",
      description: "Security Deposit Refund",
      category: "Deposit",
      property: "Cozy Studio Loft",
      amount: 1800,
      type: "Expense",
      status: "Pending",
    },
  ]

  // Sample data for budget
  const budgetData: BudgetType[] = [
    {
      key: "1",
      category: "Maintenance",
      budgeted: 5000,
      actual: 3200,
      variance: 1800,
      percentUsed: 64,
    },
    {
      key: "2",
      category: "Utilities",
      budgeted: 3000,
      actual: 2800,
      variance: 200,
      percentUsed: 93,
    },
    {
      key: "3",
      category: "Insurance",
      budgeted: 4000,
      actual: 4000,
      variance: 0,
      percentUsed: 100,
    },
    {
      key: "4",
      category: "Property Management",
      budgeted: 6000,
      actual: 5500,
      variance: 500,
      percentUsed: 92,
    },
    {
      key: "5",
      category: "Taxes",
      budgeted: 8000,
      actual: 7500,
      variance: 500,
      percentUsed: 94,
    },
    {
      key: "6",
      category: "Marketing",
      budgeted: 2000,
      actual: 1200,
      variance: 800,
      percentUsed: 60,
    },
    {
      key: "7",
      category: "Legal & Professional",
      budgeted: 3000,
      actual: 1500,
      variance: 1500,
      percentUsed: 50,
    },
  ]

  // Sample data for monthly financial summary
  const monthlyData = [
    { month: "Jan", income: 12500, expenses: 8200, profit: 4300 },
    { month: "Feb", income: 13200, expenses: 7800, profit: 5400 },
    { month: "Mar", income: 14500, expenses: 9100, profit: 5400 },
    { month: "Apr", income: 13800, expenses: 8500, profit: 5300 },
    { month: "May", income: 14200, expenses: 8900, profit: 5300 },
    { month: "Jun", income: 15000, expenses: 9200, profit: 5800 },
    { month: "Jul", income: 15500, expenses: 9500, profit: 6000 },
    { month: "Aug", income: 15800, expenses: 9700, profit: 6100 },
    { month: "Sep", income: 15200, expenses: 9300, profit: 5900 },
    { month: "Oct", income: 14800, expenses: 9000, profit: 5800 },
    { month: "Nov", income: 14500, expenses: 8800, profit: 5700 },
    { month: "Dec", income: 16000, expenses: 9800, profit: 6200 },
  ]

  // Sample data for expense breakdown
  const expenseBreakdownData = [
    { month: "Jan", category: "Maintenance", amount: 2500 },
    { month: "Jan", category: "Utilities", amount: 1500 },
    { month: "Jan", category: "Insurance", amount: 1000 },
    { month: "Jan", category: "Taxes", amount: 2000 },
    { month: "Jan", category: "Management", amount: 1200 },
    { month: "Feb", category: "Maintenance", amount: 2200 },
    { month: "Feb", category: "Utilities", amount: 1400 },
    { month: "Feb", category: "Insurance", amount: 1000 },
    { month: "Feb", category: "Taxes", amount: 2000 },
    { month: "Feb", category: "Management", amount: 1200 },
    { month: "Mar", category: "Maintenance", amount: 3000 },
    { month: "Mar", category: "Utilities", amount: 1600 },
    { month: "Mar", category: "Insurance", amount: 1000 },
    { month: "Mar", category: "Taxes", amount: 2200 },
    { month: "Mar", category: "Management", amount: 1300 },
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
      case "Completed":
        return "green"
      case "Pending":
        return "orange"
      case "Failed":
        return "red"
      default:
        return "default"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Income":
        return "green"
      case "Expense":
        return "red"
      default:
        return "default"
    }
  }

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return "#3f8600"
    if (variance < 0) return "#cf1322"
    return "inherit"
  }

  const transactionColumns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a: TransactionType, b: TransactionType) => a.date.localeCompare(b.date),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      filters: [
        { text: "Rent", value: "Rent" },
        { text: "Maintenance", value: "Maintenance" },
        { text: "Insurance", value: "Insurance" },
        { text: "Taxes", value: "Taxes" },
        { text: "Utilities", value: "Utilities" },
        { text: "Deposit", value: "Deposit" },
      ],
      onFilter: (value: string, record: TransactionType) => record.category === value,
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
        { text: "All Properties", value: "All Properties" },
      ],
      onFilter: (value: string, record: TransactionType) => record.property === value,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number, record: TransactionType) => (
        <span style={{ color: record.type === "Income" ? "#3f8600" : "#cf1322" }}>
          {record.type === "Income" ? "+" : "-"}${amount.toLocaleString()}
        </span>
      ),
      sorter: (a: TransactionType, b: TransactionType) => a.amount - b.amount,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type: string) => <Tag color={getTypeColor(type)}>{type}</Tag>,
      filters: [
        { text: "Income", value: "Income" },
        { text: "Expense", value: "Expense" },
      ],
      onFilter: (value: string, record: TransactionType) => record.type === value,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => <Tag color={getStatusColor(status)}>{status}</Tag>,
      filters: [
        { text: "Completed", value: "Completed" },
        { text: "Pending", value: "Pending" },
        { text: "Failed", value: "Failed" },
      ],
      onFilter: (value: string, record: TransactionType) => record.status === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: TransactionType) => (
        <Space size="middle">
          <Tooltip title="View">
            <Button type="text" icon={<EyeOutlined />} onClick={() => console.log("View transaction", record.id)} />
          </Tooltip>
          <Tooltip title="Edit">
            <Button type="text" icon={<EditOutlined />} onClick={() => console.log("Edit transaction", record.id)} />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => console.log("Delete transaction", record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ]

  const budgetColumns = [
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Budgeted",
      dataIndex: "budgeted",
      key: "budgeted",
      render: (amount: number) => `$${amount.toLocaleString()}`,
      sorter: (a: BudgetType, b: BudgetType) => a.budgeted - b.budgeted,
    },
    {
      title: "Actual",
      dataIndex: "actual",
      key: "actual",
      render: (amount: number) => `$${amount.toLocaleString()}`,
      sorter: (a: BudgetType, b: BudgetType) => a.actual - b.actual,
    },
    {
      title: "Variance",
      dataIndex: "variance",
      key: "variance",
      render: (variance: number) => (
        <span style={{ color: getVarianceColor(variance) }}>${variance.toLocaleString()}</span>
      ),
      sorter: (a: BudgetType, b: BudgetType) => a.variance - b.variance,
    },
    {
      title: "Usage",
      dataIndex: "percentUsed",
      key: "percentUsed",
      render: (percent: number) => (
        <div style={{ width: 150 }}>
          <Progress percent={percent} size="small" status={percent > 95 ? "exception" : "normal"} />
        </div>
      ),
      sorter: (a: BudgetType, b: BudgetType) => a.percentUsed - b.percentUsed,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: BudgetType) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <Button type="text" icon={<EditOutlined />} onClick={() => console.log("Edit budget", record.key)} />
          </Tooltip>
        </Space>
      ),
    },
  ]

  // Multi-line chart configuration for monthly financial summary
  const monthlyFinancialConfig = {
    data: monthlyData.flatMap((item) => [
      { month: item.month, value: item.income, type: "Income" },
      { month: item.month, value: item.expenses, type: "Expenses" },
      { month: item.month, value: item.profit, type: "Profit" },
    ]),
    xField: "month",
    yField: "value",
    seriesField: "type",
    color: ["#52c41a", "#f5222d", "#1890ff"],
    point: {
      size: 5,
      shape: "circle",
    },
    legend: {
      position: "top",
    },
  }

  // Stacked column chart for expense breakdown
  const expenseBreakdownConfig = {
    data: expenseBreakdownData,
    xField: "month",
    yField: "amount",
    seriesField: "category",
    isStack: true,
    label: {
      position: "middle",
      layout: [{ type: "interval-adjust-position" }, { type: "interval-hide-overlap" }, { type: "adjust-color" }],
    },
  }

  // Calculate summary statistics
  const totalIncome = transactions.filter((t) => t.type === "Income").reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions.filter((t) => t.type === "Expense").reduce((sum, t) => sum + t.amount, 0)

  const netCashFlow = totalIncome - totalExpenses

  const pendingTransactions = transactions.filter((t) => t.status === "Pending").length

  return (
    <DashboardLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Title level={2}>Financial Management</Title>
        <Space>
          <Select defaultValue="all" style={{ width: 200 }} onChange={(value) => setPropertyFilter(value)}>
            <Option value="all">All Properties</Option>
            <Option value="luxury">Modern Luxury Apartment</Option>
            <Option value="studio">Cozy Studio Loft</Option>
            <Option value="penthouse">Downtown Penthouse</Option>
            <Option value="suburban">Suburban Family Home</Option>
            <Option value="villa">Beachfront Villa</Option>
          </Select>
          <RangePicker
            defaultValue={[null, null]}
            onChange={(dates) => {
              if (dates && dates[0] && dates[1]) {
                setDateRange([dates[0].format("YYYY-MM-DD"), dates[1].format("YYYY-MM-DD")])
              }
            }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
            Add Transaction
          </Button>
        </Space>
      </div>
      <Divider />

      {/* Summary Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Total Income"
              value={totalIncome}
              precision={2}
              valueStyle={{ color: "#3f8600" }}
              prefix={<ArrowUpOutlined />}
              suffix="USD"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Total Expenses"
              value={totalExpenses}
              precision={2}
              valueStyle={{ color: "#cf1322" }}
              prefix={<ArrowDownOutlined />}
              suffix="USD"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Net Cash Flow"
              value={netCashFlow}
              precision={2}
              valueStyle={{ color: netCashFlow >= 0 ? "#3f8600" : "#cf1322" }}
              prefix={netCashFlow >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              suffix="USD"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic
              title="Pending Transactions"
              value={pendingTransactions}
              valueStyle={{ color: pendingTransactions > 0 ? "#faad14" : "#3f8600" }}
              prefix={pendingTransactions > 0 ? <ClockCircleOutlined /> : <CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane
          tab={
            <span>
              <FileTextOutlined />
              Transactions
            </span>
          }
          key="transactions"
        >
          <Card
            bordered={false}
            title={
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Transaction History</span>
                <Space>
                  <Dropdown
                    menu={{
                      items: [
                        { key: "1", label: "Last 7 Days" },
                        { key: "2", label: "Last 30 Days" },
                        { key: "3", label: "Last 90 Days" },
                        { key: "4", label: "This Year" },
                        { key: "5", label: "Custom Range" },
                      ],
                    }}
                  >
                    <Button icon={<FilterOutlined />}>Filter</Button>
                  </Dropdown>
                  <Button icon={<DownloadOutlined />}>Export</Button>
                </Space>
              </div>
            }
          >
            <Table columns={transactionColumns} dataSource={transactions} rowKey="key" pagination={{ pageSize: 10 }} />
          </Card>
        </TabPane>

        <TabPane
          tab={
            <span>
              <BarChartOutlined />
              Budget
            </span>
          }
          key="budget"
        >
          <Card
            bordered={false}
            title={
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Budget vs. Actual (Q1 2024)</span>
                <Space>
                  <Button icon={<SettingOutlined />}>Budget Settings</Button>
                  <Button icon={<DownloadOutlined />}>Export</Button>
                </Space>
              </div>
            }
          >
            <Table columns={budgetColumns} dataSource={budgetData} rowKey="key" pagination={false} />
          </Card>
        </TabPane>

        <TabPane
          tab={
            <span>
              <DollarOutlined />
              Financial Reports
            </span>
          }
          key="reports"
        >
          <Row gutter={16}>
            <Col span={24}>
              <Card title="Monthly Financial Summary (2024)" bordered={false}>
                <Line {...monthlyFinancialConfig} height={300} />
              </Card>
            </Col>
          </Row>

          <Row gutter={16} style={{ marginTop: 16 }}>
            <Col span={24}>
              <Card title="Expense Breakdown by Category (Q1 2024)" bordered={false}>
                <Column {...expenseBreakdownConfig} height={300} />
              </Card>
            </Col>
          </Row>

          <Row gutter={16} style={{ marginTop: 16 }}>
            <Col span={24}>
              <Card
                title="Available Reports"
                bordered={false}
                extra={
                  <Button type="primary" icon={<DownloadOutlined />}>
                    Generate Report
                  </Button>
                }
              >
                <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                  <Card style={{ width: 300 }}>
                    <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
                      <FileTextOutlined style={{ fontSize: 24, marginRight: 16 }} />
                      <div>
                        <Title level={5} style={{ margin: 0 }}>
                          Profit & Loss Statement
                        </Title>
                        <Text type="secondary">Monthly, quarterly, or annual</Text>
                      </div>
                    </div>
                    <Button type="link" icon={<DownloadOutlined />}>
                      Download
                    </Button>
                  </Card>

                  <Card style={{ width: 300 }}>
                    <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
                      <FileTextOutlined style={{ fontSize: 24, marginRight: 16 }} />
                      <div>
                        <Title level={5} style={{ margin: 0 }}>
                          Cash Flow Statement
                        </Title>
                        <Text type="secondary">Monthly, quarterly, or annual</Text>
                      </div>
                    </div>
                    <Button type="link" icon={<DownloadOutlined />}>
                      Download
                    </Button>
                  </Card>

                  <Card style={{ width: 300 }}>
                    <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
                      <FileTextOutlined style={{ fontSize: 24, marginRight: 16 }} />
                      <div>
                        <Title level={5} style={{ margin: 0 }}>
                          Balance Sheet
                        </Title>
                        <Text type="secondary">As of specific date</Text>
                      </div>
                    </div>
                    <Button type="link" icon={<DownloadOutlined />}>
                      Download
                    </Button>
                  </Card>

                  <Card style={{ width: 300 }}>
                    <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
                      <FileTextOutlined style={{ fontSize: 24, marginRight: 16 }} />
                      <div>
                        <Title level={5} style={{ margin: 0 }}>
                          Expense Report
                        </Title>
                        <Text type="secondary">By category or property</Text>
                      </div>
                    </div>
                    <Button type="link" icon={<DownloadOutlined />}>
                      Download
                    </Button>
                  </Card>

                  <Card style={{ width: 300 }}>
                    <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
                      <FileTextOutlined style={{ fontSize: 24, marginRight: 16 }} />
                      <div>
                        <Title level={5} style={{ margin: 0 }}>
                          Rent Roll
                        </Title>
                        <Text type="secondary">Current and historical</Text>
                      </div>
                    </div>
                    <Button type="link" icon={<DownloadOutlined />}>
                      Download
                    </Button>
                  </Card>

                  <Card style={{ width: 300 }}>
                    <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
                      <FileTextOutlined style={{ fontSize: 24, marginRight: 16 }} />
                      <div>
                        <Title level={5} style={{ margin: 0 }}>
                          Tax Report
                        </Title>
                        <Text type="secondary">Annual summary for tax filing</Text>
                      </div>
                    </div>
                    <Button type="link" icon={<DownloadOutlined />}>
                      Download
                    </Button>
                  </Card>
                </div>
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane
          tab={
            <span>
              <BankOutlined />
              Banking
            </span>
          }
          key="banking"
        >
          <Card bordered={false}>
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <Title level={4}>Banking Integration</Title>
              <Text>Connect your bank accounts to automatically import transactions.</Text>

              <div style={{ marginTop: 24 }}>
                <Button type="primary" icon={<PlusOutlined />} style={{ marginRight: 16 }}>
                  Connect Bank Account
                </Button>
                <Button icon={<SyncOutlined />}>Sync Transactions</Button>
              </div>
            </div>
          </Card>
        </TabPane>
      </Tabs>

      {/* Add Transaction Modal */}
      <Modal
        title="Add New Transaction"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={700}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Add Transaction
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" name="transaction_form">
          <Form.Item name="date" label="Transaction Date" rules={[{ required: true, message: "Please select date" }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="type"
            label="Transaction Type"
            rules={[{ required: true, message: "Please select transaction type" }]}
          >
            <Select placeholder="Select transaction type">
              <Option value="Income">Income</Option>
              <Option value="Expense">Expense</Option>
            </Select>
          </Form.Item>

          <Form.Item name="category" label="Category" rules={[{ required: true, message: "Please select category" }]}>
            <Select placeholder="Select category">
              <Option value="Rent">Rent</Option>
              <Option value="Maintenance">Maintenance</Option>
              <Option value="Insurance">Insurance</Option>
              <Option value="Taxes">Taxes</Option>
              <Option value="Utilities">Utilities</Option>
              <Option value="Deposit">Deposit</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item name="property" label="Property" rules={[{ required: true, message: "Please select property" }]}>
            <Select placeholder="Select property">
              <Option value="Modern Luxury Apartment">Modern Luxury Apartment</Option>
              <Option value="Cozy Studio Loft">Cozy Studio Loft</Option>
              <Option value="Downtown Penthouse">Downtown Penthouse</Option>
              <Option value="Suburban Family Home">Suburban Family Home</Option>
              <Option value="Beachfront Villa">Beachfront Villa</Option>
              <Option value="All Properties">All Properties</Option>
            </Select>
          </Form.Item>

          <Form.Item name="amount" label="Amount" rules={[{ required: true, message: "Please enter amount" }]}>
            <Input prefix="$" placeholder="Enter amount" type="number" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input.TextArea rows={3} placeholder="Enter transaction description" />
          </Form.Item>

          <Form.Item name="status" label="Status" rules={[{ required: true, message: "Please select status" }]}>
            <Select placeholder="Select status">
              <Option value="Completed">Completed</Option>
              <Option value="Pending">Pending</Option>
            </Select>
          </Form.Item>

          <Form.Item name="notes" label="Notes">
            <Input.TextArea rows={2} placeholder="Enter any additional notes" />
          </Form.Item>
        </Form>
      </Modal>
    </DashboardLayout>
  )
}

export default FinancialManagement

