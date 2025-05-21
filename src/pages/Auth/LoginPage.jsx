import React, { useEffect } from "react";
import { Form, Input, Button, Card } from "antd";
import API from "../../services/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const res = await API.post("/auth/login", values);
      localStorage.setItem("token", res.data.token);
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="centered-form" style={{ backgroundColor: "lightgray" }}>
      <Card title="Login" className="auth-card">
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button block type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>
          <Form.Item style={{ marginBottom: "0" }}>
            <Button type="link" onClick={() => navigate("/forgot-password")}>
              Forgot Password?
            </Button>
            <Button type="link" onClick={() => navigate("/register")}>
              create new account
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
