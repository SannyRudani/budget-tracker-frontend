import React from "react";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  DollarOutlined,
  TransactionOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const { Header, Content, Sider } = Layout;

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const selectedKey = location.pathname;

  return (
    <Layout
      style={{
        minHeight: "100vh",
        backgroundColor: "#00000015",
        display: "flex",
        padding: "0.8rem",
        gap: "0.8rem",
      }}
    >
      <Sider
        theme="light"
        style={{
          display: "flex",
          gap: "0.8rem",
          flex: 1,
          borderRadius: "0.8rem",
        }}
      >
        <div
          className="logo"
          style={{
            height: 32,
            margin: 16,
            fontWeight: "bold",
            flex: 1,
            display: "flex",
            fontSize: "1.2rem",
            alignItems: "center",
          }}
        >
          💸 Budget Tracker
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={handleMenuClick}
          //   width={220}
          style={{ flex: 1 }}
          items={[
            {
              key: "/dashboard",
              icon: <DashboardOutlined />,
              label: "Dashboard",
            },
            {
              key: "/transactions",
              icon: <TransactionOutlined />,
              label: "Transactions",
            },
            // { key: "logout", icon: <LogoutOutlined />, label: "Logout" },
          ]}
        />
      </Sider>
      <Layout
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.8rem",
        }}
      >
        <Header
          style={{
            background: "#ffff",
            padding: "0.8rem",
            borderRadius: "0.8rem",
            display: "flex",
            flexDirection: "row-reverse",
          }}
        >
          <LogoutOutlined
            style={{ fontSize: "25px", color: "black" }}
            onClick={handleLogout}
          />
        </Header>
        <Content
          style={{
            padding: 12,
            background: "#fff",
            overflow: "auto",
            height: "80vh",
            borderRadius: "0.8rem",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
