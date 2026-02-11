import React, { useState } from "react";
import Card from "../components/Card";
import Input from "../components/Input";
import TextArea from "../components/TextArea";
import Button from "../components/Button";
import productService from "../services/inventoryService";
import "./Login.css";

export default function Inventory() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState();
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await productService.create(formData);
      console.log(response);
    } catch (error) {
      setErrors({ message: error.message });
    }
  };

  return (
    <Card title="Create Product">
      <form onSubmit={handleSubmit} className="login-form">
        <Input
          label="Name"
          type="text"
          name="name"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="Enter your product name"
          required
        />
        <Input
          label="Slug"
          type="text"
          name="slug"
          value={formData.email}
          onChange={handleChange}
          error={errors.slugs}
          required
        />
        <TextArea
          label="Description"
          name="description"
          rows={10}
          cols={40}
          style={{ resize: "none" }}
          onChange={handleChange}
          error={errors.description}
        />
        {formData.description}
        <Input
          label="Price"
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          error={errors.price}
          required
        />
        <Button type="submit" loading={loading}>
          Save Product
        </Button>
      </form>
    </Card>
  );
}