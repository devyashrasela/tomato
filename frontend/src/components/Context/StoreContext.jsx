import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

export const StoreContextProvider = (props) => {

    const url = "http://localhost:3000";

    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState("");
    const [food_list, setFood_list] = useState([]);

    const addToCart = async (itemId) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: (prev[itemId] || 0) + 1
        }));
        if (token) {
            await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
        }

    };

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => {
            if (!prev[itemId] || prev[itemId] === 1) {
                const updated = { ...prev };
                delete updated[itemId];
                return updated;
            }
            return { ...prev, [itemId]: prev[itemId] - 1 };
        });
        if (token) {
            await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            const itemInfo = food_list.find((p) => p._id === item);
            if (itemInfo) {
                totalAmount += itemInfo.price * cartItems[item];
            }
        }
        return totalAmount;
    };

    const fetchFoodList = async () => {
        const response = await axios.get(`${url}/api/food/list`);
        setFood_list(response.data.foodItems);
    };

    const loadCartData = async (token) => {
        const response = await axios.get(url + "/api/cart/get", { headers: { token } });
        setCartItems(response.data.cartData);
    }

    useEffect(() => {
        async function loadData() {
            fetchFoodList();
            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                setToken(storedToken);
                console.log("Stored token found:", storedToken);
                await loadCartData(storedToken);
            }
        }
        loadData();
    }, [token]);

    const contextValue = {
        url,
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        token,
        setToken
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};
