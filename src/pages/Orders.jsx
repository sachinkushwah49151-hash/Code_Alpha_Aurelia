import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Truck,
  Download,
  Eye,
} from 'lucide-react';
import { useDocumentTitle } from '../utils/useDocumentTitle';
import { useCart } from '../context/CartContext';
import { formatPrice, formatDate } from '../utils/formatters';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';

export const Orders = () => {
  useDocumentTitle('My Orders');
  const { orders, user, ordersLoading } = useCart();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'processing' | 'delivered'

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-stone-100 text-stone-500 flex items-center justify-center mx-auto">
          <Package className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Sign in Required</h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Please sign in to view your verified orders archive and dispatch tracking.
          </p>
        </div>
        <div className="pt-2">
          <Link to="/login">
            <Button variant="primary">Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  const filteredOrders = orders.filter((order) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'processing') return order.status === 'Processing' || order.status === 'Shipped';
    if (filterStatus === 'delivered') return order.status === 'Delivered';
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return <Badge variant="emerald">Delivered</Badge>;
      case 'Shipped':
        return <Badge variant="blue">Shipped</Badge>;
      case 'Processing':
        return <Badge variant="amber">Processing</Badge>;
      case 'Cancelled':
        return <Badge variant="neutral">Cancelled</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Title & Filter Tabs */}
      <div className="pb-6 mb-8 border-b border-stone-200 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-stone-500">
            Account Archives
          </span>
          <h1 className="text-3xl sm:text-4xl font-light text-neutral-950 mt-1">
            My <span className="font-semibold">Orders</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Track past acquisitions, dispatch logistics, and official invoices
          </p>
        </div>

        {/* Status Filter Tabs */}
        {orders.length > 0 && (
          <div className="flex bg-stone-100 p-1 rounded-xl text-xs font-medium text-neutral-600">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterStatus === 'all'
                  ? 'bg-white text-neutral-950 shadow-sm font-semibold'
                  : 'hover:text-neutral-900'
              }`}
            >
              All ({orders.length})
            </button>
            <button
              onClick={() => setFilterStatus('processing')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterStatus === 'processing'
                  ? 'bg-white text-neutral-950 shadow-sm font-semibold'
                  : 'hover:text-neutral-900'
              }`}
            >
              In Transit
            </button>
            <button
              onClick={() => setFilterStatus('delivered')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterStatus === 'delivered'
                  ? 'bg-white text-neutral-950 shadow-sm font-semibold'
                  : 'hover:text-neutral-900'
              }`}
            >
              Delivered
            </button>
          </div>
        )}
      </div>

      {/* Orders List or Empty State */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-10 sm:p-16 text-center space-y-4 max-w-lg mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-stone-100 text-stone-500 flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-neutral-950">
              No orders found
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              You haven&apos;t placed any orders matching this filter yet.
            </p>
          </div>
          <div className="pt-2">
            <Link to="/shop">
              <Button variant="primary">Start Shopping</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden hover:border-stone-300 transition-colors"
            >
              {/* Order Card Header */}
              <div className="p-4 sm:p-5 bg-stone-50/60 border-b border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                      Order Placed
                    </span>
                    <span className="font-semibold text-neutral-900">
                      {formatDate(order.date)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                      Total
                    </span>
                    <span className="font-semibold text-neutral-900">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                      Ship To
                    </span>
                    <span className="font-semibold text-neutral-900 truncate max-w-[120px] block">
                      {order.shippingAddress?.fullName || 'Collector'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(order.status)}
                  <span className="font-mono text-xs font-semibold text-neutral-600">
                    #{order.id}
                  </span>
                </div>
              </div>

              {/* Order Products List */}
              <div className="p-4 sm:p-6 divide-y divide-stone-100">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-18 sm:w-20 sm:h-22 object-cover rounded-xl bg-stone-100 border border-stone-200/80 shrink-0"
                      />
                      <div className="min-w-0">
                        <Link
                          to={`/product/${item.id}`}
                          className="text-xs sm:text-sm font-semibold text-neutral-900 hover:text-neutral-600 transition-colors truncate block"
                        >
                          {item.name}
                        </Link>
                        {item.color && (
                          <p className="text-xs text-stone-500 mt-0.5">
                            Finish: <span className="font-medium text-neutral-700">{item.color}</span>
                          </p>
                        )}
                        <p className="text-xs text-stone-400 mt-0.5">
                          Qty: {item.quantity} • {formatPrice(item.price)} each
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs sm:text-sm font-bold text-neutral-900">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Footer Actions */}
              <div className="p-4 sm:px-6 bg-stone-50/30 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs text-neutral-500 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-stone-400" />
                  {order.status === 'Delivered'
                    ? 'Delivered to your doorstep'
                    : 'Dispatch preparation in progress'}
                </span>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedOrder(order)}
                    icon={Eye}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Order Modal */}
      {selectedOrder && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedOrder(null)}
          title={`Order #${selectedOrder.id}`}
          subtitle={`Placed on ${formatDate(selectedOrder.date)}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6">
            {/* Status Timeline */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                  Fulfillment Status
                </span>
                {getStatusBadge(selectedOrder.status)}
              </div>

              {/* Timeline Steps */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="space-y-1">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto text-[10px]">
                    ✓
                  </div>
                  <p className="font-semibold text-neutral-900">Order Placed</p>
                  <p className="text-[10px] text-stone-400">Confirmed</p>
                </div>
                <div className="space-y-1">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center mx-auto text-[10px] ${
                      selectedOrder.status === 'Shipped' || selectedOrder.status === 'Delivered'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-300 text-stone-600'
                    }`}
                  >
                    {selectedOrder.status === 'Delivered' ? '✓' : '2'}
                  </div>
                  <p className="font-semibold text-neutral-900">In Transit</p>
                  <p className="text-[10px] text-stone-400">Expedited Courier</p>
                </div>
                <div className="space-y-1">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center mx-auto text-[10px] ${
                      selectedOrder.status === 'Delivered'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-200 text-stone-400'
                    }`}
                  >
                    3
                  </div>
                  <p className="font-semibold text-neutral-900">Delivered</p>
                  <p className="text-[10px] text-stone-400">Signed & Verified</p>
                </div>
              </div>
            </div>

            {/* Shipping Address & Payment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl border border-stone-200 space-y-1">
                <p className="font-bold text-neutral-900 uppercase tracking-wider text-[10px]">
                  Shipping Destination
                </p>
                <p className="font-semibold text-neutral-800">{selectedOrder.shippingAddress?.fullName}</p>
                <p className="text-stone-500">{selectedOrder.shippingAddress?.street}</p>
                <p className="text-stone-500">
                  {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}{' '}
                  {selectedOrder.shippingAddress?.postalCode}
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-stone-200 space-y-1">
                <p className="font-bold text-neutral-900 uppercase tracking-wider text-[10px]">
                  Payment Method
                </p>
                <p className="font-semibold text-neutral-800">{selectedOrder.paymentMethod}</p>
                <p className="text-stone-500">Total Charged: {formatPrice(selectedOrder.total)}</p>
                <p className="text-emerald-700 font-medium">Payment Verified (SSL)</p>
              </div>
            </div>

            {/* Items Breakdown */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                Objects in Order
              </p>
              <div className="divide-y divide-stone-100 max-h-48 overflow-y-auto">
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img src={it.image} alt={it.name} className="w-10 h-10 object-cover rounded-lg" />
                      <div>
                        <p className="font-semibold text-neutral-900">{it.name}</p>
                        <p className="text-stone-400">{it.color} • Qty {it.quantity}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-neutral-900">
                      {formatPrice(it.price * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Invoice Download Action */}
            <div className="pt-3 border-t border-stone-200 flex justify-between items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => alert(`Simulated downloading tax invoice for order #${selectedOrder.id}`)}
                icon={Download}
              >
                Download Invoice (PDF)
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => setSelectedOrder(null)}
              >
                Close Details
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
