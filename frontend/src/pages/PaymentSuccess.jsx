import React, { useEffect, useState, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { backendUrl, token, setCartItems } = useContext(ShopContext);
  const [status, setStatus] = useState("Processing payment confirmation...");

  useEffect(() => {
    const confirmPayment = async () => {
      const orderId = searchParams.get("orderId");
      const paymentMethod = searchParams.get("paymentMethod") || "stripe";
      const paymentId = searchParams.get("paymentId") || null;

      if (!orderId) {
        setStatus("Missing order information.");
        return;
      }

      try {
        const response = await axios.post(
          backendUrl + "/api/order/confirm",
          { orderId, paymentMethod, paymentId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          if (setCartItems) setCartItems({})
          setStatus("Payment confirmed! Redirecting to orders...");
          setTimeout(() => navigate("/orders"), 1200);
        } else {
          setStatus(response.data.message || "Payment confirmation failed.");
        }
      } catch (error) {
        setStatus(error.message || "Payment confirmation failed.");
      }
    };

    confirmPayment();
  }, [backendUrl, navigate, searchParams, token]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-10 max-w-md text-center">
        <h1 className="text-xl font-semibold mb-4">Payment Status</h1>
        <p className="text-gray-700">{status}</p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
