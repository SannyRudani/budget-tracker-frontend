import React from "react";
import { Form, Input, Button, Card } from "antd";
import API from "../../services/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      await API.post("/auth/register", values);
      toast.success(
        "Registration successful! Check your email for verification."
      );
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="centered-form" style={{ backgroundColor: "lightgray" }}>
      <Card title="Register" className="auth-card">
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
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
            rules={[{ required: true, min: 6 }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button block type="primary" htmlType="submit">
              Register
            </Button>
          </Form.Item>
          <Form.Item style={{ marginBottom: "0" }}>
            <Button type="link" onClick={() => navigate("/login")}>
              already have an account?
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage;
