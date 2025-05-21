import React from "react";
import { Form, Input, Button, Card } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/axios";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      await API.post("/auth/reset-password", { token, ...values });
      toast.success("Password reset successfully!");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div className="centered-form">
      <Card title="Reset Password" className="auth-card">
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="password"
            label="New Password"
            rules={[{ required: true, min: 6 }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button block type="primary" htmlType="submit">
              Reset Password
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ResetPassword;
