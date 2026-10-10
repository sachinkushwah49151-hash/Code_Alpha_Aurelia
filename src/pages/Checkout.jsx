import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CreditCard,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShoppingBag,
  Smartphone,
  Wallet,
} from 'lucide-react';
import { useDocumentTitle } from '../utils/useDocumentTitle';
import { useCart } from '../context/CartContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { formatPrice } from '../utils/formatters';

export const Checkout = () => {
  useDocumentTitle('Checkout');
  const navigate = useNavigate();
  const { cart, user, cartSubtotal, shippingFee, discountAmount, estimatedTax, cartTotal, placeOrder } = useCart();

  // Form states initialized with logged in user or sensible defaults
  const [formData, setFormData] = useState({
    email: user ? user.email : '',
    phone: user ? user.phone : '',
    firstName: user ? user.name.split(' ')[0] : '',
    lastName: user ? user.name.split(' ').slice(1).join(' ') : '',
    address: user?.addresses?.[0]?.street || '',
    apartment: '',
    city: user?.addresses?.[0]?.city || 'Bengaluru',
    state: user?.addresses?.[0]?.state || 'Karnataka',
    postalCode: user?.addresses?.[0]?.postalCode || '560103',
    country: 'India',
  });

  // Keep form data populated if user identity is confirmed asynchronously
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
        firstName: prev.firstName || (user.name ? user.name.split(' ')[0] : ''),
        lastName: prev.lastName || (user.name ? user.name.split(' ').slice(1).join(' ') : ''),
      }));
    }
  }, [user]);

  const [deliveryMethod, setDeliveryMethod] = useState('standard'); // 'standard' | 'express'
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'upi' | 'cod'
  const [upiId, setUpiId] = useState('');

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrderInfo, setPlacedOrderInfo] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.email || !formData.email.includes('@')) errs.email = 'Valid email is required';
    if (!formData.phone || formData.phone.length < 10) errs.phone = 'Valid phone number is required';
    if (!formData.firstName.trim()) errs.firstName = 'First name is required';
    if (!formData.lastName.trim()) errs.lastName = 'Last name is required';
    if (!formData.address.trim()) errs.address = 'Street address is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.state.trim()) errs.state = 'State is required';
    if (!formData.postalCode.trim()) errs.postalCode = 'Postal code is required';

    if (paymentMethod === 'upi' && !upiId.includes('@')) {
      errs.upi = 'Please enter a valid UPI ID (e.g. name@okhdfcbank)';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setErrors((prev) => ({ ...prev, form: '' }));

    if (!validate()) {
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    const token = localStorage.getItem('aurelia_auth_token') || localStorage.getItem('nova_auth_token');
    if (!token) {
      setErrors((prev) => ({
        ...prev,
        form: 'Please sign in to complete checkout. Orders are saved to your verified member account.',
      }));
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        shippingAddress: {
          fullName: `${formData.firstName} ${formData.lastName}`.trim(),
          street: formData.apartment ? `${formData.address}, ${formData.apartment}` : formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
          phone: formData.phone,
        },
        paymentMethod:
          paymentMethod === 'card'
            ? 'Credit Card (Visa ending 4242)'
            : paymentMethod === 'upi'
            ? `UPI (${upiId || 'Instant UPI'})`
            : 'Cash on Delivery',
        deliveryMethod,
      };

      const completedOrder = await placeOrder(orderPayload);
      setPlacedOrderInfo(completedOrder);
    } catch (err) {
      console.error('Checkout failed:', err);
      setErrors((prev) => ({
        ...prev,
        form: err.message || 'Order creation failed. Please check your cart and try again.',
      }));
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0 && !placedOrderInfo) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-4">
        <ShoppingBag className="w-12 h-12 text-stone-400 mx-auto" />
        <h2 className="text-2xl font-bold text-neutral-900">Your Cart is Empty</h2>
        <p className="text-sm text-neutral-500">
          Add items to your bag before proceeding to checkout.
        </p>
        <Link to="/shop">
          <Button variant="primary">Browse Catalog</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Checkout Title */}
      <div className="pb-6 mb-8 border-b border-stone-200">
        <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-stone-500">
          Secure Transaction
        </span>
        <h1 className="text-3xl sm:text-4xl font-light text-neutral-950 mt-1">
          Express <span className="font-semibold">Checkout</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* LEFT COLUMN: Checkout Form (7 cols) */}
        <form onSubmit={handlePlaceOrder} className="lg:col-span-7 space-y-8">
          {errors.form && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-medium">
              {errors.form}
            </div>
          )}

          {/* Step 1: Contact Information */}
          <div className="bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h2 className="text-base font-semibold text-neutral-900">
                1. Contact Information
              </h2>
              {!user && (
                <span className="text-xs text-neutral-500">
                  Already have an account?{' '}
                  <Link to="/login" className="text-neutral-900 font-semibold underline">
                    Log in
                  </Link>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Email Address"
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={errors.email}
                placeholder="name@example.com"
                helperText="We'll send order tracking & invoice here"
              />
              <Input
                label="Phone Number"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                error={errors.phone}
                placeholder="+91 98765 43210"
                helperText="Required for delivery dispatch coordination"
              />
            </div>
          </div>

          {/* Step 2: Shipping Address */}
          <div className="bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-6 shadow-sm space-y-4">
            <h2 className="text-base font-semibold text-neutral-900 border-b border-stone-100 pb-3">
              2. Shipping Address
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First Name"
                required
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                error={errors.firstName}
                placeholder="Alex"
              />
              <Input
                label="Last Name"
                required
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                error={errors.lastName}
                placeholder="Vance"
              />
            </div>

            <Input
              label="Street Address"
              required
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              error={errors.address}
              placeholder="e.g. 42 Lotus Boulevard, Indiranagar"
            />

            <Input
              label="Apartment, Suite, Unit (Optional)"
              value={formData.apartment}
              onChange={(e) => handleInputChange('apartment', e.target.value)}
              placeholder="Apt 8B, Floor 3"
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Input
                label="City"
                required
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                error={errors.city}
                placeholder="Bengaluru"
              />
              <Input
                label="State"
                required
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                error={errors.state}
                placeholder="Karnataka"
              />
              <div className="col-span-2 sm:col-span-1">
                <Input
                  label="PIN / Postal"
                  required
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  error={errors.postalCode}
                  placeholder="560103"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Delivery Speed */}
          <div className="bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-6 shadow-sm space-y-4">
            <h2 className="text-base font-semibold text-neutral-900 border-b border-stone-100 pb-3">
              3. Delivery Method
            </h2>

            <div className="space-y-2.5">
              <label
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  deliveryMethod === 'standard'
                    ? 'border-neutral-900 bg-stone-50 ring-1 ring-neutral-900'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryMethod === 'standard'}
                    onChange={() => setDeliveryMethod('standard')}
                    className="accent-neutral-900"
                  />
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">Standard Insured Courier</p>
                    <p className="text-xs text-neutral-500">Delivered within 3 to 5 business days</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-700 uppercase">
                  Free
                </span>
              </label>

              <label
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  deliveryMethod === 'express'
                    ? 'border-neutral-900 bg-stone-50 ring-1 ring-neutral-900'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="delivery"
                    checked={deliveryMethod === 'express'}
                    onChange={() => setDeliveryMethod('express')}
                    className="accent-neutral-900"
                  />
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">Priority Express Air Cargo</p>
                    <p className="text-xs text-neutral-500">Next-day guaranteed delivery</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-neutral-900">
                  ₹299
                </span>
              </label>
            </div>
          </div>

          {/* Step 4: Payment Placeholder (Phase 2 Stripe / Razorpay Ready) */}
          <div className="bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h2 className="text-base font-semibold text-neutral-900">
                4. Payment Selection
              </h2>
              <span className="text-[11px] font-mono text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                Phase 2 Integration Ready
              </span>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'border-neutral-900 bg-neutral-900 text-white'
                    : 'border-stone-200 bg-white text-neutral-700 hover:bg-stone-50'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'upi'
                    ? 'border-neutral-900 bg-neutral-900 text-white'
                    : 'border-stone-200 bg-white text-neutral-700 hover:bg-stone-50'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'cod'
                    ? 'border-neutral-900 bg-neutral-900 text-white'
                    : 'border-stone-200 bg-white text-neutral-700 hover:bg-stone-50'
                }`}
              >
                <Wallet className="w-4 h-4" />
                <span>Pay on Delivery</span>
              </button>
            </div>

            {/* Card Mock Input Fields */}
            {paymentMethod === 'card' && (
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-3">
                <div className="flex items-center justify-between text-xs text-neutral-600 mb-1">
                  <span>Card Number</span>
                  <span className="font-mono text-[11px] text-stone-400">TEST MODE MOCK</span>
                </div>
                <input
                  type="text"
                  readOnly
                  value="4242 •••• •••• 4242"
                  className="w-full bg-white border border-stone-300 rounded-lg px-3.5 py-2 text-xs font-mono text-neutral-800"
                />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-neutral-500">Expiry</label>
                    <input
                      type="text"
                      readOnly
                      value="12 / 28"
                      className="w-full bg-white border border-stone-300 rounded-lg px-3.5 py-2 text-xs font-mono text-neutral-800 mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-neutral-500">CVV</label>
                    <input
                      type="password"
                      readOnly
                      value="888"
                      className="w-full bg-white border border-stone-300 rounded-lg px-3.5 py-2 text-xs font-mono text-neutral-800 mt-1"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'upi' && (
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-2">
                <Input
                  label="Virtual Payment Address (VPA / UPI ID)"
                  placeholder="e.g. mobile@okhdfcbank"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  error={errors.upi}
                />
                <p className="text-[11px] text-stone-400">
                  A payment authorization request will be pinged to your UPI application.
                </p>
              </div>
            )}

            {paymentMethod === 'cod' && (
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs text-neutral-600 space-y-1">
                <p className="font-semibold text-neutral-900">Cash or UPI at Delivery</p>
                <p>
                  Pay the delivery executive upon arrival via cash or instant QR code scan.
                </p>
              </div>
            )}
          </div>

          {/* Place Order CTA */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
              className="py-4 text-base shadow-lg hover:shadow-xl"
            >
              <span>Place Order • {formatPrice(cartTotal)}</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
            <p className="text-center text-[11px] text-stone-400 mt-3 flex items-center justify-center gap-1.5">
              <Lock className="w-3 h-3 text-stone-400" />
              Your payment information is handled with end-to-end TLS encryption
            </p>
          </div>
        </form>

        {/* RIGHT COLUMN: Items Review Sidebar (5 cols) */}
        <div className="lg:col-span-5 sticky top-28 bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="text-base font-semibold text-neutral-900">
              Items in Order ({cart.length})
            </h3>
            <Link to="/cart" className="text-xs text-neutral-600 hover:text-neutral-950 underline">
              Edit Bag
            </Link>
          </div>

          {/* Mini Item List */}
          <div className="divide-y divide-stone-100 max-h-72 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.cartItemId} className="py-3 flex items-center gap-3">
                <div className="relative w-14 h-16 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-neutral-900 text-white text-[10px] font-bold flex items-center justify-center">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-neutral-900 truncate">
                    {item.name}
                  </p>
                  <p className="text-[11px] text-neutral-500">{item.color}</p>
                </div>
                <span className="text-xs font-semibold text-neutral-900">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="space-y-2.5 pt-4 border-t border-stone-200 text-xs text-neutral-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-neutral-900">{formatPrice(cartSubtotal)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Promotional Discount</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>
                {shippingFee === 0 ? (
                  <span className="text-emerald-700 font-semibold uppercase">Free</span>
                ) : (
                  <span className="font-medium text-neutral-900">{formatPrice(shippingFee)}</span>
                )}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Estimated GST (18%)</span>
              <span>{formatPrice(estimatedTax)}</span>
            </div>

            <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline text-sm">
              <span className="font-semibold text-neutral-900">Total</span>
              <span className="text-xl font-bold text-neutral-950">
                {formatPrice(cartTotal)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Success Modal Confirmation */}
      {placedOrderInfo && (
        <Modal
          isOpen={true}
          onClose={() => navigate('/orders')}
          title="Order Confirmed"
          subtitle={`Reference ID: #${placedOrderInfo.id}`}
        >
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-neutral-950">
                Thank you for your acquisition.
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
                Your order is currently being prepared with obsessive care at our fulfillment depot.
                An email confirmation has been dispatched to{' '}
                <span className="font-semibold text-neutral-900">{formData.email}</span>.
              </p>
            </div>

            {/* Order snapshot summary */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-neutral-500">Order Total:</span>
                <span className="font-bold text-neutral-900">
                  {formatPrice(placedOrderInfo.total)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Payment:</span>
                <span className="font-medium text-neutral-900">{placedOrderInfo.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Shipping To:</span>
                <span className="font-medium text-neutral-900 truncate max-w-[200px]">
                  {placedOrderInfo.shippingAddress?.fullName},{' '}
                  {placedOrderInfo.shippingAddress?.city}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2 max-w-md mx-auto">
              <Button
                variant="primary"
                fullWidth
                onClick={() => navigate('/orders')}
              >
                Track in My Orders
              </Button>
              <Button
                variant="outline"
                fullWidth
                onClick={() => navigate('/shop')}
              >
                Continue Browsing
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
