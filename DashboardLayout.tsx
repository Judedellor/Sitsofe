"use client"

import type React from "react"
import { useState } from "react"
import { Layout, Menu, Button, Avatar, Dropdown, Badge, theme } from "antd"
import {
  HomeOutlined,
  AppstoreOutlined,
  TeamOutlined,
  ToolOutlined,
  DollarOutlined,
  FileOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "../context/AuthContext"

const { Header, Sider, Content } = Layout

interface DashboardLayoutProps {
  children: React.ReactNode
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)
  const { token } = theme.useToken()
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const toggleCollapsed = () => {
    setCollapsed(!collapsed)
  }

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  const userMenuItems = [
    {
      key: "profile",
      label: "Profile",
      icon: <UserOutlined />,
      onClick: () => router.push("/profile"),
    },
    {
      key: "settings",
      label: "Settings",
      icon: <SettingOutlined />,
      onClick: () => router.push("/settings"),
    },
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ]

  const notificationItems = [
    {
      key: "1",
      label: "New maintenance request",
      onClick: () => router.push("/maintenance"),
    },
    {
      key: "2",
      label: "Payment received",
      onClick: () => router.push("/payments"),
    },
    {
      key: "3",
      label: "New tenant application",
      onClick: () => router.push("/tenants"),
    },
  ]

  const menuItems = [
    {
      key: "dashboard",
      icon: <HomeOutlined />,
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      key: "properties",
      icon: <AppstoreOutlined />,
      label: "Properties",
      path: "/properties",
    },
    {
      key: "tenants",
      icon: <TeamOutlined />,
      label: "Tenants",
      path: "/tenants",
    },
    {
      key: "maintenance",
      icon: <ToolOutlined />,
      label: "Maintenance",
      path: "/maintenance",
    },
    {
      key: "payments",
      icon: <DollarOutlined />,
      label: "Payments",
      path: "/payments",
    },
    {
      key: "documents",
      icon: <FileOutlined />,
      label: "Documents",
      path: "/documents",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Settings",
      path: "/settings",
    },
  ]

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="light"
        style={{
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
          zIndex: 10,
        }}
      >
        <div
          style={{
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            padding: collapsed ? "0" : "0 16px",
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          {collapsed ? (
            <div style={{ fontSize: "24px", color: token.colorPrimary }}>PM</div>
          ) : (
            <div style={{ fontSize: "18px", fontWeight: "bold", color: token.colorPrimary }}>Property Manager</div>
          )}
        </div>
        <Menu mode="inline" selectedKeys={[pathname?.split("/")[1] || "dashboard"]} style={{ borderRight: 0 }}>
          {menuItems.map((item) => (
            <Menu.Item key={item.key} icon={item.icon}>
              <Link href={item.path}>{item.label}</Link>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            padding: "0 16px",
            background: token.colorBgContainer,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleCollapsed}
            style={{ fontSize: "16px", width: 64, height: 64 }}
          />
          <div style={{ display: "flex", alignItems: "center" }}>
            <Dropdown menu={{ items: notificationItems }} placement="bottomRight" arrow>
              <Badge count={3} size="small">
                <Button type="text" icon={<BellOutlined />} style={{ fontSize: "16px" }} />
              </Badge>
            </Dropdown>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  marginLeft: "16px",
                }}
              >
                <Avatar src={user?.avatar} icon={!user?.avatar && <UserOutlined />} size="default" />
                <span
                  style={{
                    marginLeft: "8px",
                    fontWeight: 500,
                  }}
                >
                  {user?.name || "User"}
                </span>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: token.colorBgContainer,
            borderRadius: token.borderRadiusLG,
            minHeight: 280,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}

export default DashboardLayout

