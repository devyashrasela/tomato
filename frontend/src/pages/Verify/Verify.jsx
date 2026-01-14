import React, { useContext, useEffect, useRef } from 'react';
import "./Verify.css";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { StoreContext } from '../../components/Context/StoreContext';
import axios from 'axios';

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  const { url } = useContext(StoreContext);
  const navigate = useNavigate();
  const hasRun = useRef(false);

  const verifyPayment = async () => {
    try {
      const response = await axios.post(`${url}/api/order/verify`, {
        success: success === "true",
        orderId
      });

      navigate(response.data.success ? "/myorders" : "/");
    } catch (error) {
      console.error(error);
      navigate("/");
    }
  };

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    verifyPayment();
  }, [success, orderId, url, navigate]);

  return (
    <div className="verify">
      <div className="spinner"></div>
    </div>
  );
};

export default Verify;
