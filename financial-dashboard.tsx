"use client"

import type React from "react"
import { useState } from "react"
import {
  Card,
  Row,
  Col,
  Button,
  Typography,
  Tabs,
  Table,
  Tag,
  Space,
  Statistic,
  Progress,
  DatePicker,
  Select,
  Tooltip,
  Alert,
  Modal,
  Form,
  Input,
  InputNumber,
  Checkbox,
  Radio,
} from "antd"
import {
  DollarOutlined,
  BarChartOutlined,
  FileTextOutlined,
  BankOutlined,
  PlusOutlined,
  DownloadOutlined,
  SyncOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  SettingOutlined,
  LineChartOutlined,
  PrinterOutlined,
  CloudUploadOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
} from "@ant-design/icons"
import DashboardLayout from "../DashboardLayout"
import { Line, Pie } from "@ant-design/charts"

const { Title, Text, Paragraph } = Typography
const { Option } = Select
const { TabPane } = Tabs
const { RangePicker } = DatePicker

// Types for financial data
interface Transaction {
  id: string
  date: string
  description: string
  category: string
  property: string
  unit?: string
  amount: number
  type: "Income" | "Expense"
  status: "Completed" | "Pending" | "Failed"
  paymentMethod?: string
  reference?: string
  notes?: string
  attachments?: string[]
  createdBy: string
  createdAt: string
  updatedAt: string
}

interface BudgetItem {
  id: string
  category: string
  subcategory?: string
  property: string
  budgeted: number
  actual: number
  variance: number
  percentUsed: number
  fiscalYear: string
  fiscalPeriod: string
}

interface FinancialReport {
  id: string
  name: string
  type: "P&L" | "Cash Flow" | "Balance Sheet" | "Tax" | "Custom"
  dateRange: [string, string]
  properties: string[]
  createdAt: string
  lastGenerated?: string
  format: "PDF" | "Excel" | "CSV"
  status: "Ready" | "Generating" | "Failed"
}

interface BankAccount {
  id: string
  name: string
  institution: string
  accountType: "Checking" | "Savings" | "Credit Card" | "Investment" | "Other"
  accountNumber: string
  balance: number
  lastSync: string
  status: "Active" | "Inactive" | "Error"
  properties: string[]
}

interface TaxDocument {
  id: string
  name: string
  type: "1099" | "Schedule E" | "K-1" | "Property Tax" | "Other"
  year: string
  property: string
  status: "Ready" | "Pending" | "NA"
  dueDate?: string
  filingDate?: string
  amount?: number
}

// Sample data
const sampleTransactions: Transaction[] = [
  {
    id: "TRX-001",
    date: "2024-03-15",
    description: "Rent Payment - Unit 101",
    category: "Rent",
    property: "Modern Luxury Apartment",
    unit: "101",
    amount: 2500,
    type: "Income",
    status: "Completed",
    paymentMethod: "Bank Transfer",
    reference: "REF123456",
    notes: "On-time payment",
    createdBy: "System",
    createdAt: "2024-03-15T10:30:00Z",
    updatedAt: "2024-03-15T10:30:00Z",
  },
  {
    id: "TRX-002",
    date: "2024-03-10",
    description: "Plumbing Repair",
    category: "Maintenance",
    property: "Modern Luxury Apartment",
    unit: "203",
    amount: 350,
    type: "Expense",
    status: "Completed",
    paymentMethod: "Credit Card",
    reference: "INV-789",
    notes: "Emergency repair",
    createdBy: "John Smith",
    createdAt: "2024-03-10T15:45:00Z",
    updatedAt: "2024-03-10T15:45:00Z",
  },
  {
    id: "TRX-003",
    date: "2024-03-05",
    description: "Rent Payment - Unit 202",
    category: "Rent",
    property: "Cozy Studio Loft",
    unit: "202",
    amount: 1800,
    type: "Income",
    status: "Completed",
    paymentMethod: "ACH",
    reference: "REF789012",
    createdBy: "System",
    createdAt: "2024-03-05T09:15:00Z",
    updatedAt: "2024-03-05T09:15:00Z",
  },
  {
    id: "TRX-004",
    date: "2024-03-01",
    description: "Property Insurance",
    category: "Insurance",
    property: "All Properties",
    amount: 1200,
    type: "Expense",
    status: "Completed",
    paymentMethod: "ACH",
    reference: "INS-2024-Q1",
    notes: "Quarterly premium",
    createdBy: "Jane Doe",
    createdAt: "2024-03-01T11:00:00Z",
    updatedAt: "2024-03-01T11:00:00Z",
  },
  {
    id: "TRX-005",
    date: "2024-02-28",
    description: "Rent Payment - Penthouse",
    category: "Rent",
    property: "Downtown Penthouse",
    unit: "PH1",
    amount: 3200,
    type: "Income",
    status: "Completed",
    paymentMethod: "Check",
    reference: "CHK-1001",
    createdBy: "System",
    createdAt: "2024-02-28T14:30:00Z",
    updatedAt: "2024-02-28T14:30:00Z",
  },
  {
    id: "TRX-006",
    date: "2024-02-25",
    description: "Landscaping Service",
    category: "Maintenance",
    property: "Suburban Family Home",
    amount: 250,
    type: "Expense",
    status: "Completed",
    paymentMethod: "Credit Card",
    reference: "INV-456",
    createdBy: "John Smith",
    createdAt: "2024-02-25T16:20:00Z",
    updatedAt: "2024-02-25T16:20:00Z",
  },
  {
    id: "TRX-007",
    date: "2024-02-20",
    description: "Property Tax Payment",
    category: "Taxes",
    property: "All Properties",
    amount: 3500,
    type: "Expense",
    status: "Completed",
    paymentMethod: "Bank Transfer",
    reference: "TAX-2024-Q1",
    notes: "Q1 property tax payment",
    createdBy: "Jane Doe",
    createdAt: "2024-02-20T10:15:00Z",
    updatedAt: "2024-02-20T10:15:00Z",
  },
  {
    id: "TRX-008",
    date: "2024-02-15",
    description: "Rent Payment - Unit 303",
    category: "Rent",
    property: "Modern Luxury Apartment",
    unit: "303",
    amount: 2200,
    type: "Income",
    status: "Completed",
    paymentMethod: "ACH",
    reference: "REF345678",
    createdBy: "System",
    createdAt: "2024-02-15T09:45:00Z",
    updatedAt: "2024-02-15T09:45:00Z",
  },
  {
    id: "TRX-009",
    date: "2024-03-20",
    description: "Utility Bill Payment",
    category: "Utilities",
    property: "Beachfront Villa",
    amount: 450,
    type: "Expense",
    status: "Pending",
    paymentMethod: "ACH",
    reference: "UTIL-2024-03",
    notes: "March utilities",
    createdBy: "John Smith",
    createdAt: "2024-03-20T13:30:00Z",
    updatedAt: "2024-03-20T13:30:00Z",
  },
  {
    id: "TRX-010",
    date: "2024-03-25",
    description: "Security Deposit Refund",
    category: "Deposit",
    property: "Cozy Studio Loft",
    unit: "105",
    amount: 1800,
    type: "Expense",
    status: "Pending",
    paymentMethod: "Check",
    reference: "CHK-1002",
    notes: "Tenant moved out on 3/20/2024",
    createdBy: "Jane Doe",
    createdAt: "2024-03-25T11:15:00Z",
    updatedAt: "2024-03-25T11:15:00Z",
  },
  {
    id: "TRX-011",
    date: "2024-03-18",
    description: "HVAC Maintenance",
    category: "Maintenance",
    property: "Downtown Penthouse",
    unit: "PH1",
    amount: 275,
    type: "Expense",
    status: "Completed",
    paymentMethod: "Credit Card",
    reference: "INV-567",
    notes: "Seasonal maintenance",
    createdBy: "John Smith",
    createdAt: "2024-03-18T14:00:00Z",
    updatedAt: "2024-03-18T14:00:00Z",
  },
  {
    id: "TRX-012",
    date: "2024-03-22",
    description: "Late Fee - Unit 204",
    category: "Fees",
    property: "Modern Luxury Apartment",
    unit: "204",
    amount: 150,
    type: "Income",
    status: "Pending",
    paymentMethod: "Pending",
    createdBy: "System",
    createdAt: "2024-03-22T00:01:00Z",
    updatedAt: "2024-03-22T00:01:00Z",
  },
]

const sampleBudgetItems: BudgetItem[] = [
  {
    id: "BUD-001",
    category: "Maintenance",
    subcategory: "Repairs",
    property: "All Properties",
    budgeted: 5000,
    actual: 3200,
    variance: 1800,
    percentUsed: 64,
    fiscalYear: "2024",
    fiscalPeriod: "Q1",
  },
  {
    id: "BUD-002",
    category: "Utilities",
    subcategory: "Electricity",
    property: "All Properties",
    budgeted: 1500,
    actual: 1400,
    variance: 100,
    percentUsed: 93,
    fiscalYear: "2024",
    fiscalPeriod: "Q1",
  },
  {
    id: "BUD-003",
    category: "Utilities",
    subcategory: "Water",
    property: "All Properties",
    budgeted: 1000,
    actual: 950,
    variance: 50,
    percentUsed: 95,
    fiscalYear: "2024",
    fiscalPeriod: "Q1",
  },
  {
    id: "BUD-004",
    category: "Utilities",
    subcategory: "Gas",
    property: "All Properties",
    budgeted: 500,
    actual: 450,
    variance: 50,
    percentUsed: 90,
    fiscalYear: "2024",
    fiscalPeriod: "Q1",
  },
  {
    id: "BUD-005",
    category: "Insurance",
    property: "All Properties",
    budgeted: 4000,
    actual: 4000,
    variance: 0,
    percentUsed: 100,
    fiscalYear: "2024",
    fiscalPeriod: "Q1",
  },
  {
    id: "BUD-006",
    category: "Property Management",
    property: "All Properties",
    budgeted: 6000,
    actual: 5500,
    variance: 500,
    percentUsed: 92,
    fiscalYear: "2024",
    fiscalPeriod: "Q1",
  },
  {
    id: "BUD-007",
    category: "Taxes",
    subcategory: "Property Tax",
    property: "All Properties",
    budgeted: 8000,
    actual: 7500,
    variance: 500,
    percentUsed: 94,
    fiscalYear: "2024",
    fiscalPeriod: "Q1",
  },
  {
    id: "BUD-008",
    category: "Marketing",
    property: "All Properties",
    budgeted: 2000,
    actual: 1200,
    variance: 800,
    percentUsed: 60,
    fiscalYear: "2024",
    fiscalPeriod: "Q1",
  },
  {
    id: "BUD-009",
    category: "Legal & Professional",
    property: "All Properties",
    budgeted: 3000,
    actual: 1500,
    variance: 1500,
    percentUsed: 50,
    fiscalYear: "2024",
    fiscalPeriod: "Q1",
  },
]

const sampleReports: FinancialReport[] = [
  {
    id: "REP-001",
    name: "Q1 2024 Profit & Loss",
    type: "P&L",
    dateRange: ["2024-01-01", "2024-03-31"],
    properties: ["All Properties"],
    createdAt: "2024-03-31T23:59:59Z",
    lastGenerated: "2024-04-01T10:15:00Z",
    format: "PDF",
    status: "Ready",
  },
  {
    id: "REP-002",
    name: "Q1 2024 Cash Flow Statement",
    type: "Cash Flow",
    dateRange: ["2024-01-01", "2024-03-31"],
    properties: ["All Properties"],
    createdAt: "2024-03-31T23:59:59Z",
    lastGenerated: "2024-04-01T10:20:00Z",
    format: "PDF",
    status: "Ready",
  },
  {
    id: "REP-003",
    name: "March 2024 Balance Sheet",
    type: "Balance Sheet",
    dateRange: ["2024-03-01", "2024-03-31"],
    properties: ["All Properties"],
    createdAt: "2024-03-31T23:59:59Z",
    lastGenerated: "2024-04-01T10:25:00Z",
    format: "PDF",
    status: "Ready",
  },
  {
    id: "REP-004",
    name: "Q1 2024 Expense Report by Category",
    type: "Custom",
    dateRange: ["2024-01-01", "2024-03-31"],
    properties: ["All Properties"],
    createdAt: "2024-03-31T23:59:59Z",
    lastGenerated: "2024-04-01T10:30:00Z",
    format: "Excel",
    status: "Ready",
  },
  {
    id: "REP-005",
    name: "Q1 2024 Rent Roll",
    type: "Custom",
    dateRange: ["2024-01-01", "2024-03-31"],
    properties: ["Modern Luxury Apartment", "Cozy Studio Loft", "Downtown Penthouse"],
    createdAt: "2024-03-31T23:59:59Z",
    lastGenerated: "2024-04-01T10:35:00Z",
    format: "Excel",
    status: "Ready",
  },
  {
    id: "REP-006",
    name: "2023 Annual Tax Summary",
    type: "Tax",
    dateRange: ["2023-01-01", "2023-12-31"],
    properties: ["All Properties"],
    createdAt: "2023-12-31T23:59:59Z",
    lastGenerated: "2024-01-15T14:30:00Z",
    format: "PDF",
    status: "Ready",
  },
]

const sampleBankAccounts: BankAccount[] = [
  {
    id: "ACC-001",
    name: "Main Operating Account",
    institution: "Chase Bank",
    accountType: "Checking",
    accountNumber: "****1234",
    balance: 45678.9,
    lastSync: "2024-03-30T23:59:59Z",
    status: "Active",
    properties: ["All Properties"],
  },
  {
    id: "ACC-002",
    name: "Security Deposits",
    institution: "Wells Fargo",
    accountType: "Savings",
    accountNumber: "****5678",
    balance: 25000.0,
    lastSync: "2024-03-30T23:59:59Z",
    status: "Active",
    properties: ["All Properties"],
  },
  {
    id: "ACC-003",
    name: "Maintenance Reserve",
    institution: "Bank of America",
    accountType: "Savings",
    accountNumber: "****9012",
    balance: 15000.0,
    lastSync: "2024-03-30T23:59:59Z",
    status: "Active",
    properties: ["All Properties"],
  },
  {
    id: "ACC-004",
    name: "Business Credit Card",
    institution: "American Express",
    accountType: "Credit Card",
    accountNumber: "****3456",
    balance: -2345.67,
    lastSync: "2024-03-30T23:59:59Z",
    status: "Active",
    properties: ["All Properties"],
  },
]

const sampleTaxDocuments: TaxDocument[] = [
  {
    id: "TAX-001",
    name: "2023 Schedule E",
    type: "Schedule E",
    year: "2023",
    property: "All Properties",
    status: "Ready",
    dueDate: "2024-04-15",
    filingDate: "2024-03-15",
  },
  {
    id: "TAX-002",
    name: "2023 Form 1099-MISC",
    type: "1099",
    year: "2023",
    property: "All Properties",
    status: "Ready",
    dueDate: "2024-01-31",
    filingDate: "2024-01-15",
  },
  {
    id: "TAX-003",
    name: "2023 Property Tax Statement - Modern Luxury Apartment",
    type: "Property Tax",
    year: "2023",
    property: "Modern Luxury Apartment",
    status: "Ready",
    dueDate: "2023-12-31",
    filingDate: "2023-12-15",
    amount: 12500.0,
  },
  {
    id: "TAX-004",
    name: "2023 Property Tax Statement - Cozy Studio Loft",
    type: "Property Tax",
    year: "2023",
    property: "Cozy Studio Loft",
    status: "Ready",
    dueDate: "2023-12-31",
    filingDate: "2023-12-15",
    amount: 8750.0,
  },
  {
    id: "TAX-005",
    name: "2023 Property Tax Statement - Downtown Penthouse",
    type: "Property Tax",
    year: "2023",
    property: "Downtown Penthouse",
    status: "Ready",
    dueDate: "2023-12-31",
    filingDate: "2023-12-15",
    amount: 15000.0,
  },
  {
    id: "TAX-006",
    name: "2024 Estimated Tax Payments Schedule",
    type: "Other",
    year: "2024",
    property: "All Properties",
    status: "Ready",
    dueDate: "2024-04-15",
  },
]

// Monthly financial data for charts
const monthlyFinancialData = [
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

// Expense breakdown data for charts
const expenseBreakdownData = [
  { category: "Maintenance", value: 3200 },
  { category: "Utilities", value: 2800 },
  { category: "Insurance", value: 4000 },
  { category: "Property Management", value: 5500 },
  { category: "Taxes", value: 7500 },
  { category: "Marketing", value: 1200 },
  { category: "Legal & Professional", value: 1500 },
]

// Income breakdown data for charts
const incomeBreakdownData = [
  { category: "Rent", value: 40200 },
  { category: "Late Fees", value: 450 },
  { category: "Application Fees", value: 300 },
  { category: "Other Income", value: 750 },
]

// Main component
const FinancialDashboard: React.FC = () => {
  // State variables
  const [activeTab, setActiveTab] = useState("dashboard")
  const [dateRange, setDateRange] = useState<[string, string]>(["2024-01-01", "2024-03-31"])
  const [propertyFilter, setPropertyFilter] = useState<string>("all")
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions)
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(sampleBudgetItems)
  const [reports, setReports] = useState<FinancialReport[]>(sampleReports)
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(sampleBankAccounts)
  const [taxDocuments, setTaxDocuments] = useState<TaxDocument[]>(sampleTaxDocuments)

  // Modal states
  const [transactionModalVisible, setTransactionModalVisible] = useState(false)
  const [budgetModalVisible, setBudgetModalVisible] = useState(false)
  const [reportModalVisible, setReportModalVisible] = useState(false)
  const [bankModalVisible, setBankModalVisible] = useState(false)
  const [taxModalVisible, setTaxModalVisible] = useState(false)

  // Form instances
  const [transactionForm] = Form.useForm()
  const [budgetForm] = Form.useForm()
  const [reportForm] = Form.useForm()
  const [bankForm] = Form.useForm()
  const [taxForm] = Form.useForm()

  // Calculate summary statistics
  const totalIncome = transactions.filter((t) => t.type === "Income").reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions.filter((t) => t.type === "Expense").reduce((sum, t) => sum + t.amount, 0)

  const netCashFlow = totalIncome - totalExpenses

  const pendingTransactions = transactions.filter((t) => t.status === "Pending").length

  // Total assets (bank account balances)
  const totalAssets = bankAccounts.filter((a) => a.accountType !== "Credit Card").reduce((sum, a) => sum + a.balance, 0)

  // Total liabilities (credit card balances)
  const totalLiabilities = bankAccounts
    .filter((a) => a.accountType === "Credit Card")
    .reduce((sum, a) => sum + Math.abs(a.balance), 0)

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
      case "Ready":
      case "Active":
        return "green"
      case "Pending":
      case "Generating":
      case "Inactive":
        return "orange"
      case "Failed":
      case "Error":
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

  // Modal handlers
  const showTransactionModal = () => {
    setTransactionModalVisible(true)
  }

  const handleTransactionOk = () => {
    transactionForm
      .validateFields()
      .then((values) => {
        console.log("Transaction form values:", values)
        // In a real app, you would save the transaction here
        transactionForm.resetFields()
        setTransactionModalVisible(false)
      })
      .catch((info) => {
        console.log("Validate Failed:", info)
      })
  }

  const handleTransactionCancel = () => {
    transactionForm.resetFields()
    setTransactionModalVisible(false)
  }

  const showBudgetModal = () => {
    setBudgetModalVisible(true)
  }

  const handleBudgetOk = () => {
    budgetForm
      .validateFields()
      .then((values) => {
        console.log("Budget form values:", values)
        // In a real app, you would save the budget item here
        budgetForm.resetFields()
        setBudgetModalVisible(false)
      })
      .catch((info) => {
        console.log("Validate Failed:", info)
      })
  }

  const handleBudgetCancel = () => {
    budgetForm.resetFields()
    setBudgetModalVisible(false)
  }

  const showReportModal = () => {
    setReportModalVisible(true)
  }

  const handleReportOk = () => {
    reportForm
      .validateFields()
      .then((values) => {
        console.log("Report form values:", values)
        // In a real app, you would generate the report here
        reportForm.resetFields()
        setReportModalVisible(false)
      })
      .catch((info) => {
        console.log("Validate Failed:", info)
      })
  }

  const handleReportCancel = () => {
    reportForm.resetFields()
    setReportModalVisible(false)
  }

  const showBankModal = () => {
    setBankModalVisible(true)
  }

  const handleBankOk = () => {
    bankForm
      .validateFields()
      .then((values) => {
        console.log("Bank form values:", values)
        // In a real app, you would connect to the bank here
        bankForm.resetFields()
        setBankModalVisible(false)
      })
      .catch((info) => {
        console.log("Validate Failed:", info)
      })
  }

  const handleBankCancel = () => {
    bankForm.resetFields()
    setBankModalVisible(false)
  }

  const showTaxModal = () => {
    setTaxModalVisible(true)
  }

  const handleTaxOk = () => {
    taxForm
      .validateFields()
      .then((values) => {
        console.log("Tax form values:", values)
        // In a real app, you would save the tax document here
        taxForm.resetFields()
        setTaxModalVisible(false)
      })
      .catch((info) => {
        console.log("Validate Failed:", info)
      })
  }

  const handleTaxCancel = () => {
    taxForm.resetFields()
    setTaxModalVisible(false)
  }

  // Table columns
  const transactionColumns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a: Transaction, b: Transaction) => a.date.localeCompare(b.date),
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
        { text: "Fees", value: "Fees" },
      ],
      onFilter: (value: string, record: Transaction) => record.category === value,
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
      onFilter: (value: string, record: Transaction) => record.property === value,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number, record: Transaction) => (
        <span style={{ color: record.type === "Income" ? "#3f8600" : "#cf1322" }}>
          {record.type === "Income" ? "+" : "-"}${amount.toLocaleString()}
        </span>
      ),
      sorter: (a: Transaction, b: Transaction) => a.amount - b.amount,
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
      onFilter: (value: string, record: Transaction) => record.type === value,
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
      onFilter: (value: string, record: Transaction) => record.status === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Transaction) => (
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
      title: "Subcategory",
      dataIndex: "subcategory",
      key: "subcategory",
      render: (text: string) => text || "-",
    },
    {
      title: "Budgeted",
      dataIndex: "budgeted",
      key: "budgeted",
      render: (amount: number) => `$${amount.toLocaleString()}`,
      sorter: (a: BudgetItem, b: BudgetItem) => a.budgeted - b.budgeted,
    },
    {
      title: "Actual",
      dataIndex: "actual",
      key: "actual",
      render: (amount: number) => `$${amount.toLocaleString()}`,
      sorter: (a: BudgetItem, b: BudgetItem) => a.actual - b.actual,
    },
    {
      title: "Variance",
      dataIndex: "variance",
      key: "variance",
      render: (variance: number) => (
        <span style={{ color: getVarianceColor(variance) }}>${variance.toLocaleString()}</span>
      ),
      sorter: (a: BudgetItem, b: BudgetItem) => a.variance - b.variance,
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
      sorter: (a: BudgetItem, b: BudgetItem) => a.percentUsed - b.percentUsed,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: BudgetItem) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <Button type="text" icon={<EditOutlined />} onClick={() => console.log("Edit budget", record.id)} />
          </Tooltip>
        </Space>
      ),
    },
  ]

  const reportColumns = [
    {
      title: "Report Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      filters: [
        { text: "P&L", value: "P&L" },
        { text: "Cash Flow", value: "Cash Flow" },
        { text: "Balance Sheet", value: "Balance Sheet" },
        { text: "Tax", value: "Tax" },
        { text: "Custom", value: "Custom" },
      ],
      onFilter: (value: string, record: FinancialReport) => record.type === value,
    },
    {
      title: "Date Range",
      key: "dateRange",
      render: (_, record: FinancialReport) => <span>{`${record.dateRange[0]} to ${record.dateRange[1]}`}</span>,
    },
    {
      title: "Format",
      dataIndex: "format",
      key: "format",
      render: (format: string) => {
        const icon =
          format === "PDF" ? <FilePdfOutlined /> : format === "Excel" ? <FileExcelOutlined /> : <FileTextOutlined />
        return <Tag icon={icon}>{format}</Tag>
      },
    },
    {
      title: "Last Generated",
      dataIndex: "lastGenerated",
      key: "lastGenerated",
      render: (text: string) => (text ? new Date(text).toLocaleString() : "-"),
      sorter: (a: FinancialReport, b: FinancialReport) => {
        if (!a.lastGenerated) return 1
        if (!b.lastGenerated) return -1
        return a.lastGenerated.localeCompare(b.lastGenerated)
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: FinancialReport) => (
        <Space size="middle">
          <Tooltip title="Download">
            <Button
              type="text"
              icon={<DownloadOutlined />}
              disabled={record.status !== "Ready"}
              onClick={() => console.log("Download report", record.id)}
            />
          </Tooltip>
          <Tooltip title="Regenerate">
            <Button type="text" icon={<SyncOutlined />} onClick={() => console.log("Regenerate report", record.id)} />
          </Tooltip>
          <Tooltip title="Print">
            <Button
              type="text"
              icon={<PrinterOutlined />}
              disabled={record.status !== "Ready"}
              onClick={() => console.log("Print report", record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ]

  const bankColumns = [
    {
      title: "Account Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Institution",
      dataIndex: "institution",
      key: "institution",
    },
    {
      title: "Account Type",
      dataIndex: "accountType",
      key: "accountType",
    },
    {
      title: "Account Number",
      dataIndex: "accountNumber",
      key: "accountNumber",
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      render: (balance: number, record: BankAccount) => (
        <span style={{ color: record.accountType === "Credit Card" ? "#cf1322" : "#3f8600" }}>
          {record.accountType === "Credit Card" ? "-" : ""}${Math.abs(balance).toLocaleString()}
        </span>
      ),
      sorter: (a: BankAccount, b: BankAccount) => a.balance - b.balance,
    },
    {
      title: "Last Sync",
      dataIndex: "lastSync",
      key: "lastSync",
      render: (text: string) => new Date(text).toLocaleString(),
      sorter: (a: BankAccount, b: BankAccount) => a.lastSync.localeCompare(b.lastSync),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: BankAccount) => (
        <Space size="middle">
          <Tooltip title="Sync">
            <Button type="text" icon={<SyncOutlined />} onClick={() => console.log("Sync bank account", record.id)} />
          </Tooltip>
          <Tooltip title="Edit">
            <Button type="text" icon={<EditOutlined />} onClick={() => console.log("Edit bank account", record.id)} />
          </Tooltip>
          <Tooltip title="Disconnect">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => console.log("Disconnect bank account", record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ]

  const taxColumns = [
    {
      title: "Document Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      filters: [
        { text: "Schedule E", value: "Schedule E" },
        { text: "1099", value: "1099" },
        { text: "K-1", value: "K-1" },
        { text: "Property Tax", value: "Property Tax" },
        { text: "Other", value: "Other" },
      ],
      onFilter: (value: string, record: TaxDocument) => record.type === value,
    },
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
      sorter: (a: TaxDocument, b: TaxDocument) => a.year.localeCompare(b.year),
    },
    {
      title: "Property",
      dataIndex: "property",
      key: "property",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => (amount ? `$${amount.toLocaleString()}` : "-"),
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (date: string) => date || "-",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: TaxDocument) => (
        <Space size="middle">
          <Tooltip title="Download">
            <Button
              type="text"
              icon={<DownloadOutlined />}
              disabled={record.status !== "Ready"}
              onClick={() => console.log("Download tax document", record.id)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button type="text" icon={<EditOutlined />} onClick={() => console.log("Edit tax document", record.id)} />
          </Tooltip>
        </Space>
      ),
    },
  ]

  // Chart configurations
  const monthlyFinancialConfig = {
    data: monthlyFinancialData.flatMap((item) => [
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

  const expensePieConfig = {
    data: expenseBreakdownData,
    angleField: "value",
    colorField: "category",
    radius: 0.8,
    label: {
      type: "outer",
      content: "{name}: ${value}",
    },
    interactions: [{ type: "element-active" }],
  }

  const incomePieConfig = {
    data: incomeBreakdownData,
    angleField: "value",
    colorField: "category",
    radius: 0.8,
    label: {
      type: "outer",
      content: "{name}: ${value}",
    },
    interactions: [{ type: "element-active" }],
  }

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
        </Space>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane
          tab={
            <span>
              <DollarOutlined />
              Dashboard
            </span>
          }
          key="dashboard"
        >
          {/* Financial Summary Cards */}
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

          {/* Charts */}
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={24}>
              <Card title="Monthly Financial Summary (2024)" bordered={false}>
                <Line {...monthlyFinancialConfig} height={300} />
              </Card>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Card title="Income Breakdown" bordered={false}>
                <Pie {...incomePieConfig} height={300} />
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Expense Breakdown" bordered={false}>
                <Pie {...expensePieConfig} height={300} />
              </Card>
            </Col>
          </Row>

          {/* Recent Transactions */}
          <Row gutter={16} style={{ marginTop: 24 }}>
            <Col span={24}>
              <Card
                title="Recent Transactions"
                bordered={false}
                extra={
                  <Button type="primary" icon={<PlusOutlined />} onClick={showTransactionModal}>
                    Add Transaction
                  </Button>
                }
              >
                <Table
                  columns={transactionColumns}
                  dataSource={transactions.slice(0, 5)}
                  rowKey="id"
                  pagination={false}
                />
                <div style={{ textAlign: "right", marginTop: 16 }}>
                  <Button type="link" onClick={() => setActiveTab("transactions")}>
                    View All Transactions
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        </TabPane>

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
                  <Button type="primary" icon={<PlusOutlined />} onClick={showTransactionModal}>
                    Add Transaction
                  </Button>
                  <Button icon={<DownloadOutlined />}>Export</Button>
                </Space>
              </div>
            }
          >
            <Table columns={transactionColumns} dataSource={transactions} rowKey="id" pagination={{ pageSize: 10 }} />
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
                  <Button type="primary" icon={<PlusOutlined />} onClick={showBudgetModal}>
                    Add Budget Item
                  </Button>
                  <Button icon={<SettingOutlined />}>Budget Settings</Button>
                  <Button icon={<DownloadOutlined />}>Export</Button>
                </Space>
              </div>
            }
          >
            <Table columns={budgetColumns} dataSource={budgetItems} rowKey="id" pagination={false} />
          </Card>
        </TabPane>

        <TabPane
          tab={
            <span>
              <LineChartOutlined />
              Reports
            </span>
          }
          key="reports"
        >
          <Card
            bordered={false}
            title={
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Financial Reports</span>
                <Space>
                  <Button type="primary" icon={<PlusOutlined />} onClick={showReportModal}>
                    Generate Report
                  </Button>
                </Space>
              </div>
            }
          >
            <Table columns={reportColumns} dataSource={reports} rowKey="id" pagination={false} />
          </Card>
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
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={12}>
              <Card bordered={false}>
                <Statistic
                  title="Total Assets"
                  value={totalAssets}
                  precision={2}
                  valueStyle={{ color: "#3f8600" }}
                  prefix={<DollarOutlined />}
                  suffix="USD"
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card bordered={false}>
                <Statistic
                  title="Total Liabilities"
                  value={totalLiabilities}
                  precision={2}
                  valueStyle={{ color: "#cf1322" }}
                  prefix={<DollarOutlined />}
                  suffix="USD"
                />
              </Card>
            </Col>
          </Row>

          <Card
            bordered={false}
            title={
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Connected Bank Accounts</span>
                <Space>
                  <Button type="primary" icon={<PlusOutlined />} onClick={showBankModal}>
                    Connect Account
                  </Button>
                  <Button icon={<SyncOutlined />}>Sync All</Button>
                </Space>
              </div>
            }
          >
            <Table columns={bankColumns} dataSource={bankAccounts} rowKey="id" pagination={false} />
          </Card>
        </TabPane>

        <TabPane
          tab={
            <span>
              <FileTextOutlined />
              Tax
            </span>
          }
          key="tax"
        >
          <Card
            bordered={false}
            title={
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Tax Documents</span>
                <Space>
                  <Button type="primary" icon={<PlusOutlined />} onClick={showTaxModal}>
                    Add Tax Document
                  </Button>
                  <Button icon={<DownloadOutlined />}>Export All</Button>
                </Space>
              </div>
            }
          >
            <Table columns={taxColumns} dataSource={taxDocuments} rowKey="id" pagination={false} />
          </Card>
        </TabPane>
      </Tabs>

      {/* Add Transaction Modal */}
      <Modal
        title="Add New Transaction"
        open={transactionModalVisible}
        onOk={handleTransactionOk}
        onCancel={handleTransactionCancel}
        width={700}
        footer={[
          <Button key="back" onClick={handleTransactionCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleTransactionOk}>
            Add Transaction
          </Button>,
        ]}
      >
        <Form form={transactionForm} layout="vertical" name="transaction_form">
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
              <Option value="Fees">Fees</Option>
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

          <Form.Item name="unit" label="Unit (if applicable)">
            <Input placeholder="Enter unit number" />
          </Form.Item>

          <Form.Item name="amount" label="Amount" rules={[{ required: true, message: "Please enter amount" }]}>
            <InputNumber
              prefix="$"
              placeholder="Enter amount"
              style={{ width: "100%" }}
              formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input.TextArea rows={3} placeholder="Enter transaction description" />
          </Form.Item>

          <Form.Item name="paymentMethod" label="Payment Method">
            <Select placeholder="Select payment method">
              <Option value="Cash">Cash</Option>
              <Option value="Check">Check</Option>
              <Option value="Credit Card">Credit Card</Option>
              <Option value="ACH">ACH</Option>
              <Option value="Bank Transfer">Bank Transfer</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item name="reference" label="Reference Number">
            <Input placeholder="Enter reference number" />
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

          <Form.Item name="attachments" label="Attachments">
            <Button icon={<CloudUploadOutlined />}>Upload Receipt/Invoice</Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Add Budget Item Modal */}
      <Modal
        title="Add Budget Item"
        open={budgetModalVisible}
        onOk={handleBudgetOk}
        onCancel={handleBudgetCancel}
        width={700}
        footer={[
          <Button key="back" onClick={handleBudgetCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleBudgetOk}>
            Add Budget Item
          </Button>,
        ]}
      >
        <Form form={budgetForm} layout="vertical" name="budget_form">
          <Form.Item name="category" label="Category" rules={[{ required: true, message: "Please select category" }]}>
            <Select placeholder="Select category">
              <Option value="Maintenance">Maintenance</Option>
              <Option value="Utilities">Utilities</Option>
              <Option value="Insurance">Insurance</Option>
              <Option value="Taxes">Taxes</Option>
              <Option value="Property Management">Property Management</Option>
              <Option value="Marketing">Marketing</Option>
              <Option value="Legal & Professional">Legal & Professional</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item name="subcategory" label="Subcategory">
            <Input placeholder="Enter subcategory" />
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

          <Form.Item
            name="fiscalYear"
            label="Fiscal Year"
            rules={[{ required: true, message: "Please select fiscal year" }]}
          >
            <Select placeholder="Select fiscal year">
              <Option value="2024">2024</Option>
              <Option value="2025">2025</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="fiscalPeriod"
            label="Fiscal Period"
            rules={[{ required: true, message: "Please select fiscal period" }]}
          >
            <Select placeholder="Select fiscal period">
              <Option value="Q1">Q1 (Jan-Mar)</Option>
              <Option value="Q2">Q2 (Apr-Jun)</Option>
              <Option value="Q3">Q3 (Jul-Sep)</Option>
              <Option value="Q4">Q4 (Oct-Dec)</Option>
              <Option value="Annual">Annual</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="budgeted"
            label="Budgeted Amount"
            rules={[{ required: true, message: "Please enter budgeted amount" }]}
          >
            <InputNumber
              prefix="$"
              placeholder="Enter budgeted amount"
              style={{ width: "100%" }}
              formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>

          <Form.Item name="notes" label="Notes">
            <Input.TextArea rows={2} placeholder="Enter any additional notes" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Generate Report Modal */}
      <Modal
        title="Generate Financial Report"
        open={reportModalVisible}
        onOk={handleReportOk}
        onCancel={handleReportCancel}
        width={700}
        footer={[
          <Button key="back" onClick={handleReportCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleReportOk}>
            Generate Report
          </Button>,
        ]}
      >
        <Form form={reportForm} layout="vertical" name="report_form">
          <Form.Item name="name" label="Report Name" rules={[{ required: true, message: "Please enter report name" }]}>
            <Input placeholder="Enter report name" />
          </Form.Item>

          <Form.Item name="type" label="Report Type" rules={[{ required: true, message: "Please select report type" }]}>
            <Select placeholder="Select report type">
              <Option value="P&L">Profit & Loss Statement</Option>
              <Option value="Cash Flow">Cash Flow Statement</Option>
              <Option value="Balance Sheet">Balance Sheet</Option>
              <Option value="Tax">Tax Report</Option>
              <Option value="Custom">Custom Report</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="dateRange"
            label="Date Range"
            rules={[{ required: true, message: "Please select date range" }]}
          >
            <RangePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="properties"
            label="Properties"
            rules={[{ required: true, message: "Please select properties" }]}
          >
            <Select placeholder="Select properties" mode="multiple" defaultValue={["All Properties"]}>
              <Option value="All Properties">All Properties</Option>
              <Option value="Modern Luxury Apartment">Modern Luxury Apartment</Option>
              <Option value="Cozy Studio Loft">Cozy Studio Loft</Option>
              <Option value="Downtown Penthouse">Downtown Penthouse</Option>
              <Option value="Suburban Family Home">Suburban Family Home</Option>
              <Option value="Beachfront Villa">Beachfront Villa</Option>
            </Select>
          </Form.Item>

          <Form.Item name="format" label="Format" rules={[{ required: true, message: "Please select format" }]}>
            <Radio.Group defaultValue="PDF">
              <Radio value="PDF">PDF</Radio>
              <Radio value="Excel">Excel</Radio>
              <Radio value="CSV">CSV</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="includeCharts" valuePropName="checked">
            <Checkbox>Include charts and graphs</Checkbox>
          </Form.Item>

          <Form.Item name="notes" label="Notes">
            <Input.TextArea rows={2} placeholder="Enter any additional notes" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Connect Bank Account Modal */}
      <Modal
        title="Connect Bank Account"
        open={bankModalVisible}
        onOk={handleBankOk}
        onCancel={handleBankCancel}
        width={700}
        footer={[
          <Button key="back" onClick={handleBankCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleBankOk}>
            Connect Account
          </Button>,
        ]}
      >
        <Form form={bankForm} layout="vertical" name="bank_form">
          <Alert
            message="Secure Connection"
            description="We use bank-level security to connect to your financial institution. Your credentials are never stored on our servers."
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />

          <Form.Item
            name="institution"
            label="Financial Institution"
            rules={[{ required: true, message: "Please select institution" }]}
          >
            <Select placeholder="Select or search for your bank">
              <Option value="Chase Bank">Chase Bank</Option>
              <Option value="Bank of America">Bank of America</Option>
              <Option value="Wells Fargo">Wells Fargo</Option>
              <Option value="Citibank">Citibank</Option>
              <Option value="US Bank">US Bank</Option>
              <Option value="Capital One">Capital One</Option>
              <Option value="American Express">American Express</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="accountType"
            label="Account Type"
            rules={[{ required: true, message: "Please select account type" }]}
          >
            <Select placeholder="Select account type">
              <Option value="Checking">Checking</Option>
              <Option value="Savings">Savings</Option>
              <Option value="Credit Card">Credit Card</Option>
              <Option value="Investment">Investment</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="name"
            label="Account Name"
            rules={[{ required: true, message: "Please enter account name" }]}
          >
            <Input placeholder="Enter a name for this account" />
          </Form.Item>

          <Form.Item
            name="properties"
            label="Associated Properties"
            rules={[{ required: true, message: "Please select properties" }]}
          >
            <Select placeholder="Select properties" mode="multiple" defaultValue={["All Properties"]}>
              <Option value="All Properties">All Properties</Option>
              <Option value="Modern Luxury Apartment">Modern Luxury Apartment</Option>
              <Option value="Cozy Studio Loft">Cozy Studio Loft</Option>
              <Option value="Downtown Penthouse">Downtown Penthouse</Option>
              <Option value="Suburban Family Home">Suburban Family Home</Option>
              <Option value="Beachfront Villa">Beachfront Villa</Option>
            </Select>
          </Form.Item>

          <Paragraph>
            <Text type="secondary">
              You will be redirected to your bank's website to complete the connection process.
            </Text>
          </Paragraph>
        </Form>
      </Modal>

      {/* Add Tax Document Modal */}
      <Modal
        title="Add Tax Document"
        open={taxModalVisible}
        onOk={handleTaxOk}
        onCancel={handleTaxCancel}
        width={700}
        footer={[
          <Button key="back" onClick={handleTaxCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleTaxOk}>
            Add Document
          </Button>,
        ]}
      >
        <Form form={taxForm} layout="vertical" name="tax_form">
          <Form.Item
            name="name"
            label="Document Name"
            rules={[{ required: true, message: "Please enter document name" }]}
          >
            <Input placeholder="Enter document name" />
          </Form.Item>

          <Form.Item
            name="type"
            label="Document Type"
            rules={[{ required: true, message: "Please select document type" }]}
          >
            <Select placeholder="Select document type">
              <Option value="Schedule E">Schedule E</Option>
              <Option value="1099">1099 Form</Option>
              <Option value="K-1">K-1 Form</Option>
              <Option value="Property Tax">Property Tax Statement</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item name="year" label="Tax Year" rules={[{ required: true, message: "Please select tax year" }]}>
            <Select placeholder="Select tax year">
              <Option value="2024">2024</Option>
              <Option value="2023">2023</Option>
              <Option value="2022">2022</Option>
              <Option value="2021">2021</Option>
            </Select>
          </Form.Item>

          <Form.Item name="property" label="Property" rules={[{ required: true, message: "Please select property" }]}>
            <Select placeholder="Select property">
              <Option value="All Properties">All Properties</Option>
              <Option value="Modern Luxury Apartment">Modern Luxury Apartment</Option>
              <Option value="Cozy Studio Loft">Cozy Studio Loft</Option>
              <Option value="Downtown Penthouse">Downtown Penthouse</Option>
              <Option value="Suburban Family Home">Suburban Family Home</Option>
              <Option value="Beachfront Villa">Beachfront Villa</Option>
            </Select>
          </Form.Item>

          <Form.Item name="amount" label="Amount (if applicable)">
            <InputNumber
              prefix="$"
              placeholder="Enter amount"
              style={{ width: "100%" }}
              formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>

          <Form.Item name="dueDate" label="Due Date (if applicable)">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="filingDate" label="Filing Date (if applicable)">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="document" label="Upload Document">
            <Button icon={<CloudUploadOutlined />}>Upload Document</Button>
          </Form.Item>

          <Form.Item name="notes" label="Notes">
            <Input.TextArea rows={2} placeholder="Enter any additional notes" />
          </Form.Item>
        </Form>
      </Modal>
    </DashboardLayout>
  )
}

export default FinancialDashboard

