// pages/ProductDetail.jsx or components/ProductDetail.jsx
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "../lib/axios";

const ProductDetail = () => {
  const { id } = useParams(); // This gets the ID from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch product by ID
    fetchProduct(id);
  }, [id]);

  const fetchProduct = async (productId) => {
    try {
      const response = await axios.get(`/products/${productId}`);
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>${product.price}</p>
    </div>
  );
};

export default ProductDetail;
