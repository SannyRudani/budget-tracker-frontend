import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/axios";
import toast from "react-hot-toast";

const EmailVerify = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const verify = async () => {
    try {
      await API.get("/auth/verify-email", {
        params: { token },
      });
      toast.success("Email verified!");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    }
  };
  useEffect(() => {
    if (token) {
      verify();
    }
  }, [token, navigate]);

  return <p style={{ textAlign: "center" }}>Verifying your email...</p>;
};

export default EmailVerify;
