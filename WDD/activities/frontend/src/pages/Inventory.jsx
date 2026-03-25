import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import "../pages/Login.css";
import { use, useEffect, useState } from "react";
import TextArea from "../components/TextArea";
import slugify from "slugify";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import inventoryService from "../services/inventoryService.js";

const Inventory = () => {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: 0,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState();
  const [slug, setSlug] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();

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
      // Set loading to true to show the spinner
      setLoading(true);
      
      // Prepare the product data with the generated slug
      const productData = {
        name: formData.name,
        slug: slug,
        description: formData.description,
        price: parseFloat(formData.price),
        countInStock: 1,
      };

      // Call the service to save the product in MongoDB
      await inventoryService.create(productData);
      
      // Show success message
      alert("Product saved successfully!");
      
      // Reset the form
      setFormData({ name: "", slug: "", description: "", price: 0 });
      setSlug("");
    } catch (error) {
      setErrors({ error: error.message });
    } finally {
      // Stop loading regardless of success or failure
      setLoading(false);
    }
  };

  useEffect(() => {
    if (formData.name) {
      const generatedSlug = slugify(formData.name, {
        lower: true,
        strict: true,
      });
      setSlug(generatedSlug);
    }
  }, [formData.name]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <Card title="Create Product">
      <form onSubmit={handleSubmit} className="login-form">
        <Input
          label="Name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="Enter product name"
          required
        />
        <Input
          label="Slug"
          type="text"
          name="slug"
          value={slug}
          onChange={handleChange}
          error={errors.slug}
          disabled
        />
        <TextArea
          label="Description"
          name="description"
          error={errors.description}
          rows={10}
          cols={40}
        />
        <Input
          label="Price"
          type="number"
          name="price"
          value={formData.price}
          error={errors.price}
          onChange={handleChange}
        />
        <Button type="submit" loading={loading}>
          Save Product
        </Button>
      </form>
    </Card>
  );
};

export default Inventory;
