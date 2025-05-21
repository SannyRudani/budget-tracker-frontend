import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  InputNumber,
  Space,
} from "antd";
import axios from "../utils/axios"; // your axios instance with interceptor
import dayjs from "dayjs";
import toast from "react-hot-toast";

const { RangePicker } = DatePicker;
const { Option } = Select;

const categories = [
  "Salary",
  "Groceries",
  "Entertainment",
  "Utilities",
  "Transport",
  "Other",
];

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    category: "",
    dateRange: [],
    amountRange: [],
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const [form] = Form.useForm();

  // Fetch transactions from backend with filters & pagination
  const fetchTransactions = async (page = 1, pageSize = 10) => {
    setLoading(true);

    try {
      // Build query params
      const params = {
        limit: pageSize,
        page,
      };

      if (filters.category) params.category = filters.category;
      if (filters.dateRange.length === 2) {
        params.dateFrom = filters.dateRange[0].format("YYYY-MM-DD");
        params.dateTo = filters.dateRange[1].format("YYYY-MM-DD");
      }
      // amountRange is optional, you can extend later

      const res = await axios.get("/transactions", { params });

      setTransactions(res.data.transactions); // assuming backend returns {transactions: [], total: number}
      setPagination((prev) => ({
        ...prev,
        current: page,
        pageSize,
        total: res.data.total,
      }));
    } catch (error) {
      toast.error("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  // Table columns
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text) => dayjs(text).format("YYYY-MM-DD"),
      sorter: true,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (text) => (text === "income" ? "Income" : "Expense"),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (val) => `$${val.toFixed(2)}`,
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => openEditModal(record)}>
            Edit
          </Button>
          <Button
            type="link"
            danger
            onClick={() => deleteTransaction(record._id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  // Open modal for edit or add
  const openEditModal = (transaction = null) => {
    setEditingTransaction(transaction);
    if (transaction) {
      form.setFieldsValue({
        ...transaction,
        date: dayjs(transaction.date),
      });
    } else {
      form.resetFields();
    }
    setModalVisible(true);
  };

  // Delete transaction handler
  const deleteTransaction = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?"))
      return;

    try {
      await axios.delete(`/transactions/${id}`);
      toast.success("Transaction deleted");
      fetchTransactions(pagination.current, pagination.pageSize);
    } catch (error) {
      toast.error("Failed to delete transaction");
    }
  };

  // Form submit handler for add/edit
  const onFinish = async (values) => {
    try {
      const payload = {
        ...values,
        date: values.date.format("YYYY-MM-DD"),
      };

      if (editingTransaction) {
        // Edit mode
        await axios.put(`/transactions/${editingTransaction._id}`, payload);
        toast.success("Transaction updated");
      } else {
        // Add mode
        await axios.post("/transactions", payload);
        toast.success("Transaction added");
      }
      setModalVisible(false);
      fetchTransactions(pagination.current, pagination.pageSize);
    } catch (error) {
      toast.error("Failed to save transaction");
    }
  };

  // Pagination handler
  const onTableChange = (page, pageSize) => {
    fetchTransactions(page, pageSize);
  };

  // Filters handler
  const onFilterChange = (changedFilters) => {
    setFilters((prev) => ({ ...prev, ...changedFilters }));
  };

  return (
    <>
      <h2>Transactions</h2>

      {/* Filters */}
      <Space style={{ marginBottom: 16 }}>
        <Select
          placeholder="Category"
          allowClear
          style={{ width: 150 }}
          onChange={(val) => onFilterChange({ category: val })}
          value={filters.category || undefined}
        >
          {categories.map((cat) => (
            <Option key={cat} value={cat}>
              {cat}
            </Option>
          ))}
        </Select>

        <RangePicker
          onChange={(dates) => onFilterChange({ dateRange: dates || [] })}
          value={filters.dateRange.length ? filters.dateRange : null}
        />

        <Button onClick={() => fetchTransactions(1, pagination.pageSize)}>
          Apply Filters
        </Button>
        <Button
          onClick={() => {
            setFilters({ category: "", dateRange: [] });
            fetchTransactions(1, pagination.pageSize);
          }}
        >
          Clear Filters
        </Button>

        <Button type="primary" onClick={() => openEditModal()}>
          Add Transaction
        </Button>
      </Space>

      <Table
        rowKey="_id"
        loading={loading}
        columns={columns}
        dataSource={transactions}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: onTableChange,
        }}
      />

      {/* Modal for Add/Edit */}
      <Modal
        title={editingTransaction ? "Edit Transaction" : "Add Transaction"}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        okText={editingTransaction ? "Update" : "Add"}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: "Please select type" }]}
          >
            <Select>
              <Option value="income">Income</Option>
              <Option value="expense">Expense</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: "Please select category" }]}
          >
            <Select>
              {categories.map((cat) => (
                <Option key={cat} value={cat}>
                  {cat}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="amount"
            label="Amount"
            rules={[
              { required: true, message: "Please enter amount" },
              { type: "number", min: 0, message: "Amount must be positive" },
            ]}
          >
            <InputNumber style={{ width: "100%" }} min={0} step={0.01} />
          </Form.Item>

          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: "Please select date" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="note" label="Note">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Transactions;
