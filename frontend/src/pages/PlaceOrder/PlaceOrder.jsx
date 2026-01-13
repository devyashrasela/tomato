import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../components/Context/StoreContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } =
  useContext(StoreContext);

  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: ""
  });

  const placeOrder = async (event) => {
    event.preventDefault();

    if (!token) {
      navigate("/login");
      return;
    }

    let orderItems = [];

    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        orderItems.push({
          ...item,
          quantity: cartItems[item._id],
        });
      }
    });

    const orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + (getTotalCartAmount() === 0 ? 0 : 2),
    };

    try {
      const response = await axios.post(
        url + "/api/order/place",
        orderData,
        { headers: { token } }
      );

      if (response.data.success) {
        window.location.replace(response.data.session_url);
      } else {
        alert("Order failed");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  useEffect(()=>{
    if(!token){
      navigate("/cart");
    }
    else if(getTotalCartAmount() === 0){
      navigate("/cart");
    }
  },[token])

  const onChangeHandler = (e) => {
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input required type="text" placeholder='First Name' name="firstName" onChange={onChangeHandler} value={data.firstName} />
          <input required type="text" placeholder='Last Name' name="lastName" onChange={onChangeHandler} value={data.lastName} />
        </div>
        <input required type="email" placeholder='Email address' name="email" onChange={onChangeHandler} value={data.email} />
        <input required type="text" placeholder='Street' name="street" onChange={onChangeHandler} value={data.street} />
        <div className="multi-fields">
          <input required type="text" placeholder='City' name="city" onChange={onChangeHandler} value={data.city} />
          <input required type="text" placeholder='State' name="state" onChange={onChangeHandler} value={data.state} />
        </div>
        <div className="multi-fields">
          <input required type="text" placeholder='Zip Code' name="zipCode" onChange={onChangeHandler} value={data.zipCode} />
          <input required type="text" placeholder='Country' name="country" onChange={onChangeHandler} value={data.country} />
        </div>
        <input required type="text" placeholder='Phone' name="phone" onChange={onChangeHandler} value={data.phone} />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Total</p>
              <p>${getTotalCartAmount() + (getTotalCartAmount() === 0 ? 0 : 2)}</p>
            </div>
          </div>
          <button type="submit">Proceed to Checkout</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;

