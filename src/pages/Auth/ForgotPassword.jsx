import React from "react";
import { Form, Input, Button, Card } from "antd";
import API from "../../services/axios";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const onFinish = async (values) => {
    try {
      await API.post("/auth/forgot-password", values);
      toast.success("Password reset link sent!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="centered-form">
      <Card title="Forgot Password" className="auth-card">
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button block type="primary" htmlType="submit">
              Send Reset Link
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ForgotPassword;
