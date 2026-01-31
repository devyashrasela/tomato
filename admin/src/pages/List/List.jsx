import React, { useEffect, useState } from 'react'
import './List.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const List = ({ url }) => {

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchlist = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.foodItems);
      } else {
        toast.error("Could not fetch the list");
      }
    } catch (error) {
      toast.error("Error fetching list");
    } finally {
      setLoading(false);
    }
  }

  const removeFood = async (foodId) => {
    setDeletingId(foodId);
    try {
      const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
      if (response.data.success) {
        // Remove item from local state instead of refetching
        setList(prevList => prevList.filter(item => item._id !== foodId));
        toast.success(response.data.message);
      } else {
        toast.error("Error deleting item");
      }
    } catch (error) {
      toast.error("Error deleting item");
    } finally {
      setDeletingId(null);
    }
  }

  useEffect(() => {
    fetchlist();
  }, [])

  return (
    <div className='list add flex-col'>
      <p>All Foods List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Actions</b>
        </div>
        {loading ? (
          <div className="loading-message">Loading...</div>
        ) : list.length === 0 ? (
          <div className="empty-message">No food items found</div>
        ) : (
          list.map((item, index) => {
            return (
              <div key={index} className={`list-table-format ${deletingId === item._id ? 'deleting' : ''}`}>
                <img
                  src={item.image}
                  alt={item.name}
                />
                <p>{item.name}</p>
                <p>{item.category}</p>
                <p>${item.price}</p>
                <p
                  onClick={() => !deletingId && removeFood(item._id)}
                  className={`cursor ${deletingId ? 'disabled' : ''}`}
                >
                  {deletingId === item._id ? '...' : 'X'}
                </p>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default List;