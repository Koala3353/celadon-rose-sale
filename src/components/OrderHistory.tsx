import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchUserOrders, SheetOrder } from '../services/sheetService';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';

const OrderHistory: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<SheetOrder | null>(null);
  
  const { data: orders, isLoading, error } = useQuery<SheetOrder[], Error>({
    queryKey: ['orders', user?.email],
    queryFn: () => fetchUserOrders(user!.email!),
    enabled: !!user,
  });

  const getStatusConfig = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    
    if (normalizedStatus.includes('completed') || normalizedStatus.includes('delivered')) {
      return { 
        bg: 'bg-green-100', 
        text: 'text-green-700', 
        border: 'border-green-200',
        icon: '✓',
        label: 'Completed'
      };
    }
    if (normalizedStatus.includes('pending')) {
      return { 
        bg: 'bg-amber-100', 
        text: 'text-amber-700', 
        border: 'border-amber-200',
        icon: '⏳',
        label: 'Pending'
      };
    }
    if (normalizedStatus.includes('process') || normalizedStatus.includes('processing')) {
      return { 
        bg: 'bg-blue-100', 
        text: 'text-blue-700', 
        border: 'border-blue-200',
        icon: '📦',
        label: status
      };
    }
    if (normalizedStatus.includes('cancelled') || normalizedStatus.includes('canceled')) {
      return { 
        bg: 'bg-red-100', 
        text: 'text-red-700', 
        border: 'border-red-200',
        icon: '✗',
        label: 'Cancelled'
      };
    }
    return { 
      bg: 'bg-gray-100', 
      text: 'text-gray-700', 
      border: 'border-gray-200',
      icon: '•',
      label: status
    };
  };

  // Parse cart items string into array for display
  const parseCartItems = (cartItemsStr: string): { name: string; quantity: number }[] => {
    if (!cartItemsStr) return [];
    // Format: "Emerald Teardrop Necklace x1, Silver Heart Shaped Locket x1, Grand Fifty Stem Mixed Bouquet x1"
    return cartItemsStr.split(',').map(item => {
      const trimmed = item.trim();
      const match = trimmed.match(/^(.+)\s+x(\d+)$/);
      if (match) {
        return { name: match[1].trim(), quantity: parseInt(match[2]) };
      }
      return { name: trimmed, quantity: 1 };
    }).filter(item => item.name);
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-rose-50 to-white pt-24 md:pt-28 pb-8 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.button 
            onClick={() => navigate('/shop')} 
            className="flex items-center gap-2 text-gray-600 hover:text-rose-600 font-medium transition-colors"
            whileHover={{ x: -5 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Shop
          </motion.button>
        </div>

        {/* Title Section */}
        <div className="text-center mb-10">
          <motion.div 
            className="w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full mx-auto flex items-center justify-center mb-4 shadow-lg shadow-rose-200"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <span className="text-2xl">📋</span>
          </motion.div>
          <motion.h1 
            className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Order History
          </motion.h1>
          <motion.p 
            className="text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Track all your rose deliveries
          </motion.p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <motion.div 
            className="flex flex-col items-center justify-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-16 h-16 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Loading your orders...</p>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div 
            className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <svg className="w-12 h-12 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-medium">There was an error fetching your orders.</p>
            <p className="text-sm mt-1">Please try again later.</p>
          </motion.div>
        )}

        {/* Not Signed In State */}
        {!user && !isLoading && (
          <motion.div 
            className="bg-white rounded-3xl shadow-xl shadow-rose-100/50 p-12 text-center border border-rose-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-20 h-20 bg-rose-100 rounded-full mx-auto flex items-center justify-center mb-6">
              <span className="text-4xl">🔒</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Sign In Required</h3>
            <p className="text-gray-600 mb-6">Please sign in to view your order history.</p>
            <motion.button
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-semibold shadow-lg shadow-rose-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Go to Login
            </motion.button>
          </motion.div>
        )}

        {/* Empty State */}
        {orders && orders.length === 0 && (
          <motion.div 
            className="bg-white rounded-3xl shadow-xl shadow-rose-100/50 p-12 text-center border border-rose-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-20 h-20 bg-rose-100 rounded-full mx-auto flex items-center justify-center mb-6">
              <span className="text-4xl">🌹</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Orders Yet</h3>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet. Start shopping to spread some love!</p>
            <motion.button
              onClick={() => navigate('/shop')}
              className="px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-semibold shadow-lg shadow-rose-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Browse Roses
            </motion.button>
          </motion.div>
        )}

        {/* Orders List */}
        {orders && orders.length > 0 && (
          <div className="space-y-6">
            <AnimatePresence>
              {orders.map((order, index) => {
                const statusConfig = getStatusConfig(order.status);
                const cartItems = parseCartItems(order.cartItems);
                return (
                  <motion.div 
                    key={order.orderId} 
                    className="bg-white rounded-3xl shadow-lg shadow-rose-100/50 overflow-hidden border border-rose-100"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    {/* Order Header */}
                    <div className="p-6 bg-gradient-to-r from-rose-50 to-pink-50 border-b border-rose-100">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-xl font-bold text-gray-800">Order #{order.orderId}</h3>
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} border`}>
                              <span>{statusConfig.icon}</span>
                              {statusConfig.label}
                            </span>
                          </div>
                          <p className="text-gray-500 text-sm flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(order.timestamp).toLocaleDateString('en-US', { 
                              weekday: 'long',
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Total</p>
                          <p className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                            ₱{order.total.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="p-6">
                      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Items Ordered</h4>
                      <div className="space-y-3">
                        {cartItems.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center gap-4 p-3 bg-rose-50/50 rounded-xl">
                            <div className="w-12 h-12 bg-gradient-to-br from-rose-100 to-pink-100 rounded-xl flex items-center justify-center flex-shrink-0">
                              <span className="text-xl">🌹</span>
                            </div>
                            <div className="flex-grow">
                              <p className="font-medium text-gray-800">{item.name}</p>
                              <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Delivery Info */}
                      {(order.venue1 || order.venue2) && (
                        <div className="mt-6 pt-4 border-t border-rose-100">
                          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Delivery Details</h4>
                          <div className="grid gap-3 md:grid-cols-2">
                            {order.venue1 && (
                              <div className="p-3 bg-rose-50/50 rounded-xl">
                                <p className="text-xs text-gray-500 mb-1">Delivery Option 1</p>
                                <p className="font-medium text-gray-800">{order.venue1}</p>
                                <p className="text-sm text-gray-600">
                                  {order.deliveryDate1} at {order.time1}
                                  {order.room1 && ` • Room ${order.room1}`}
                                </p>
                              </div>
                            )}
                            {order.venue2 && (
                              <div className="p-3 bg-rose-50/50 rounded-xl">
                                <p className="text-xs text-gray-500 mb-1">Delivery Option 2</p>
                                <p className="font-medium text-gray-800">{order.venue2}</p>
                                <p className="text-sm text-gray-600">
                                  {order.deliveryDate2} at {order.time2}
                                  {order.room2 && ` • Room ${order.room2}`}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Recipient Info */}
                      {order.recipientName && (
                        <div className="mt-4 pt-4 border-t border-rose-100">
                          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Recipient</h4>
                          <p className="font-medium text-gray-800">
                            {order.anonymous ? '(Anonymous)' : ''} {order.recipientName}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Order Footer */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-rose-100 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Order confirmed</span>
                      </div>
                      <motion.button
                        onClick={() => setSelectedOrder(order)}
                        className="text-rose-600 hover:text-rose-700 font-medium text-sm flex items-center gap-1"
                        whileHover={{ x: 5 }}
                      >
                        View Details
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Order Details Modal */}
        <AnimatePresence>
          {selectedOrder && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
            >
              <motion.div
                className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="sticky top-0 bg-gradient-to-r from-rose-500 to-pink-500 text-white p-6 rounded-t-3xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">Order #{selectedOrder.orderId}</h2>
                      <p className="text-rose-100 text-sm mt-1">
                        {new Date(selectedOrder.timestamp).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric'
                        })}
                      </p>
                    </div>
                    <motion.button
                      onClick={() => setSelectedOrder(null)}
                      className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>
                  </div>
                  
                  {/* Status Badge */}
                  <div className="mt-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white`}>
                      <span>{getStatusConfig(selectedOrder.status).icon}</span>
                      {getStatusConfig(selectedOrder.status).label || selectedOrder.status || 'Pending'}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Purchaser Details */}
                  <div className="bg-rose-50/50 rounded-2xl p-4">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center text-sm">👤</span>
                      Purchaser Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500">Name</p>
                        <p className="font-medium text-gray-800">{selectedOrder.purchaserName}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Student ID</p>
                        <p className="font-medium text-gray-800">{selectedOrder.studentId}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Email</p>
                        <p className="font-medium text-gray-800">{selectedOrder.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Contact Number</p>
                        <p className="font-medium text-gray-800">{selectedOrder.contactNumber}</p>
                      </div>
                      {selectedOrder.facebookLink && (
                        <div className="md:col-span-2">
                          <p className="text-gray-500">Facebook</p>
                          <a 
                            href={selectedOrder.facebookLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="font-medium text-rose-600 hover:text-rose-700 underline break-all"
                          >
                            {selectedOrder.facebookLink}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recipient Details */}
                  {selectedOrder.recipientName && (
                    <div className="bg-pink-50/50 rounded-2xl p-4">
                      <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <span className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-sm">🎁</span>
                        Recipient Details
                        {selectedOrder.anonymous && (
                          <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">Anonymous</span>
                        )}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-500">Name</p>
                          <p className="font-medium text-gray-800">{selectedOrder.recipientName}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Contact Number</p>
                          <p className="font-medium text-gray-800">{selectedOrder.recipientContact || 'N/A'}</p>
                        </div>
                        {selectedOrder.recipientFbLink && (
                          <div className="md:col-span-2">
                            <p className="text-gray-500">Facebook</p>
                            <a 
                              href={selectedOrder.recipientFbLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="font-medium text-rose-600 hover:text-rose-700 underline break-all"
                            >
                              {selectedOrder.recipientFbLink}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Delivery Options */}
                  {(selectedOrder.venue1 || selectedOrder.venue2) && (
                    <div className="bg-blue-50/50 rounded-2xl p-4">
                      <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm">🚚</span>
                        Delivery Options
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedOrder.venue1 && (
                          <div className="bg-white rounded-xl p-3 border border-blue-100">
                            <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                              <span className="w-5 h-5 bg-rose-500 text-white rounded-full text-xs flex items-center justify-center">1</span>
                              First Choice
                            </p>
                            <p className="font-medium text-gray-800">{selectedOrder.venue1}</p>
                            <p className="text-sm text-gray-600">
                              {selectedOrder.deliveryDate1} at {selectedOrder.time1}
                            </p>
                            {selectedOrder.room1 && (
                              <p className="text-sm text-gray-500">Room: {selectedOrder.room1}</p>
                            )}
                          </div>
                        )}
                        {selectedOrder.venue2 && (
                          <div className="bg-white rounded-xl p-3 border border-gray-200">
                            <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                              <span className="w-5 h-5 bg-gray-500 text-white rounded-full text-xs flex items-center justify-center">2</span>
                              Second Choice
                            </p>
                            <p className="font-medium text-gray-800">{selectedOrder.venue2}</p>
                            <p className="text-sm text-gray-600">
                              {selectedOrder.deliveryDate2} at {selectedOrder.time2}
                            </p>
                            {selectedOrder.room2 && (
                              <p className="text-sm text-gray-500">Room: {selectedOrder.room2}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Order Items */}
                  <div className="bg-amber-50/50 rounded-2xl p-4">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-sm">🌹</span>
                      Items Ordered
                    </h3>
                    <div className="space-y-2">
                      {parseCartItems(selectedOrder.cartItems).map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-white rounded-xl p-3 border border-amber-100">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-rose-100 to-pink-100 rounded-lg flex items-center justify-center">
                              <span>🌹</span>
                            </div>
                            <span className="font-medium text-gray-800">{item.name}</span>
                          </div>
                          <span className="text-gray-600">x{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    {selectedOrder.bundleDetails && (
                      <div className="mt-3 p-3 bg-white rounded-xl border border-amber-100">
                        <p className="text-sm text-gray-500">Bundle Details</p>
                        <p className="text-gray-800">{selectedOrder.bundleDetails}</p>
                      </div>
                    )}
                  </div>

                  {/* Messages */}
                  {(selectedOrder.msgRecipient || selectedOrder.msgBeneficiary || selectedOrder.notes) && (
                    <div className="bg-purple-50/50 rounded-2xl p-4">
                      <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm">💌</span>
                        Messages & Notes
                      </h3>
                      <div className="space-y-3">
                        {selectedOrder.msgRecipient && (
                          <div className="bg-white rounded-xl p-3 border border-purple-100">
                            <p className="text-xs text-gray-500 mb-1">Message for Recipient</p>
                            <p className="text-gray-800 whitespace-pre-wrap">{selectedOrder.msgRecipient}</p>
                          </div>
                        )}
                        {selectedOrder.msgBeneficiary && (
                          <div className="bg-white rounded-xl p-3 border border-purple-100">
                            <p className="text-xs text-gray-500 mb-1">Message for Beneficiary</p>
                            <p className="text-gray-800 whitespace-pre-wrap">{selectedOrder.msgBeneficiary}</p>
                          </div>
                        )}
                        {selectedOrder.notes && (
                          <div className="bg-white rounded-xl p-3 border border-purple-100">
                            <p className="text-xs text-gray-500 mb-1">Special Requests / Notes</p>
                            <p className="text-gray-800 whitespace-pre-wrap">{selectedOrder.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Advocacy Donation */}
                  {selectedOrder.advocacyDonation > 0 && (
                    <div className="bg-green-50/50 rounded-2xl p-4">
                      <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm">💚</span>
                        Advocacy Donation
                      </h3>
                      <p className="text-gray-600">
                        {selectedOrder.advocacyDonation} rose(s) donated = ₱{(selectedOrder.advocacyDonation * 15).toFixed(2)}
                      </p>
                    </div>
                  )}

                  {/* Order Total */}
                  <div className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl p-4 text-white">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Order Total</span>
                      <span className="text-2xl font-bold">₱{selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Assigned Dove */}
                  {selectedOrder.assignedDoveEmail && (
                    <div className="text-center text-sm text-gray-500">
                      <p>Assigned Dove: {selectedOrder.assignedDoveEmail}</p>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="sticky bottom-0 bg-gray-50 p-4 rounded-b-3xl border-t border-gray-100">
                  <motion.button
                    onClick={() => setSelectedOrder(null)}
                    className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-semibold shadow-lg shadow-rose-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Close
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default OrderHistory;