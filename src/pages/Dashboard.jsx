import React, { useEffect, useState } from "react";
import { Row, Col, Card, Statistic, DatePicker } from "antd";
import {
  DollarOutlined,
  ShoppingCartOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import API from "../services/axios";
import toast from "react-hot-toast";
import MonthlyBudgetChart from "../components/charts/MonthlyBudgetChart";
import IncomeExpenseCategoryChart from "../components/charts/IncomeExpenseCategoryChart";
import "./Dashboard.css";

const { RangePicker } = DatePicker;

const Dashboard = () => {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    budget: 0,
    expensesByCategory: [],
    incomeByCategory: [],
  });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState([]);
  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await API.get("/transactions/summary", {
        params: { startDate: filters[0], endDate: filters[1] },
      });
      setSummary(res.data.result);
    } catch (err) {
      toast.error("Failed to load dashboard data");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSummary();
  }, [filters]);

  const onFilterChange = (dates) => {
    setFilters(dates);
  };
  return (
    <div className="dashboard-wrapper">
      <RangePicker
        onChange={(dates) => onFilterChange(dates)}
        value={filters ? filters : null}
      />
      <Row gutter={[16, 16]}>
        {/* Income */}
        <Col xs={24} sm={8}>
          <Card loading={loading}>
            <Statistic
              title="Total Income"
              value={summary.totalIncome}
              precision={2}
              prefix={<DollarOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>

        {/* Expenses */}
        <Col xs={24} sm={8}>
          <Card loading={loading}>
            <Statistic
              title="Total Expenses"
              value={summary.totalExpenses}
              precision={2}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>

        {/* Balance */}
        <Col xs={24} sm={8}>
          <Card loading={loading}>
            <Statistic
              title="Balance"
              value={summary.balance}
              precision={2}
              prefix={<WalletOutlined />}
              valueStyle={{
                color: summary.balance >= 0 ? "#3f8600" : "#cf1322",
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Monthly Income vs Expenses Bar Chart */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title="Income vs Expenses"
            className="monthly-budget"
            loading={loading}
          >
            <MonthlyBudgetChart
              income={summary.totalIncome}
              expenses={summary.totalExpenses}
              height={320}
              width={400}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12} className="widget-wrapper">
          {/* Income by Category Chart */}
          <Row xs={24} lg={24} gutter={[16, 16]}>
            <Col xs={24} lg={24}>
              <Card
                title="Income by Category"
                className="income-expence-card"
                loading={loading}
              >
                <IncomeExpenseCategoryChart
                  height={200}
                  width={400}
                  innerRadius={45}
                  outerRadius={75}
                  data={summary?.incomeByCategory}
                />
              </Card>
            </Col>
          </Row>
          {/* Expenses by Category Chart */}
          <Row xs={24} lg={24} gutter={[16, 16]}>
            <Col xs={24} lg={24}>
              <Card
                title="Expenses by Category"
                className="income-expence-card"
                loading={loading}
              >
                <IncomeExpenseCategoryChart
                  height={200}
                  width={400}
                  innerRadius={45}
                  outerRadius={75}
                  data={summary.expensesByCategory}
                />
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
