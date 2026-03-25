import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiTrash2, FiPlus, FiMinus, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, setCartItems, removeFromCart, clearCart } = useCart();
  const [selectedItems, setSelectedItems] = useState(new Set());

  const handleQuantityChange = (id, change) => {
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.id === id) {
          const newSamples = Math.max(1, parseInt(item.numberOfSamples) + change);
          return {
            ...item,
            numberOfSamples: newSamples,
            price: (item.price / item.numberOfSamples) * newSamples
          };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (id) => {
    removeFromCart(id);
    setSelectedItems(prev => {
      const newSelected = new Set(prev);
      newSelected.delete(id);
      return newSelected;
    });
  };

  const handleSelectItem = (id) => {
    setSelectedItems(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.size === cartItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cartItems.map(item => item.id)));
    }
  };

  const handleRemoveSelected = () => {
    const newCartItems = cartItems.filter(item => !selectedItems.has(item.id));
    setCartItems(newCartItems);
    setSelectedItems(new Set());
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price, 0);
  };

  const calculateTax = (subtotal) => {
    return subtotal * 0.1; // 10% tax
  };

  const calculateTotal = (subtotal, tax) => {
    return subtotal + tax;
  };

  const handleCheckout = () => {
    clearCart();
    navigate('/order-success');
  };

  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const total = calculateTotal(subtotal, tax);

  return (
    <div className="dashboard-main">
      <div className="dashboard-content">
        <div className="service-detail">
          <div className="service-header">
            <div className="service-icon" style={{ color: '#00843D' }}>
              <FiShoppingCart />
            </div>
            <div className="service-info">
              <h1>Shopping Cart</h1>
              <p>{cartItems.length} items in your cart</p>
            </div>
          </div>

          <div className="service-form-container">
            <div className="cart-content">
              <div className="cart-actions">
                <div className="selection-controls">
                  <div className="select-all">
                    <input
                      type="checkbox"
                      checked={selectedItems.size === cartItems.length && cartItems.length > 0}
                      onChange={handleSelectAll}
                    />
                    <span>Select All</span>
                  </div>
                  {selectedItems.size > 0 && (
                    <div className="selected-actions">
                      <span className="selected-count">{selectedItems.size} selected</span>
                      <button className="remove-selected" onClick={handleRemoveSelected}>
                        <FiTrash2 size={16} />
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <table className="cart-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Service</th>
                    <th>Details</th>
                    <th>Samples</th>
                    <th>Price per Sample</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map(item => (
                    <tr key={item.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedItems.has(item.id)}
                          onChange={() => handleSelectItem(item.id)}
                        />
                      </td>
                      <td>{item.serviceName}</td>
                      <td>
                        <div className="service-details">
                          <div><strong>Sample Format:</strong> {item.sampleFormat}</div>
                          <div><strong>Sample Type:</strong> {item.sampleType}</div>
                          <div><strong>Target Region:</strong> {item.targetRegion.join(', ')}</div>
                          <div><strong>Services:</strong> {item.services.join(', ')}</div>
                        </div>
                      </td>
                      <td>
                        <div className="quantity-control">
                          <button 
                            onClick={() => handleQuantityChange(item.id, -1)}
                            disabled={item.numberOfSamples <= 1}
                          >
                            <FiMinus />
                          </button>
                          <span>{item.numberOfSamples}</span>
                          <button onClick={() => handleQuantityChange(item.id, 1)}>
                            <FiPlus />
                          </button>
                        </div>
                      </td>
                      <td>${(item.price / item.numberOfSamples).toFixed(2)}</td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>
                        <button 
                          className="remove-button"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="cart-summary">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <button 
                  className="checkout-button"
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 