import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  LogOut,
  Edit2,
  Package,
  Heart,
  Plus,
} from 'lucide-react';
import { useDocumentTitle } from '../utils/useDocumentTitle';
import { useCart } from '../context/CartContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';

export const Profile = () => {
  useDocumentTitle('User Profile');
  const navigate = useNavigate();
  const { user, logout, updateUserProfile, orders, wishlist } = useCart();

  // Modal states
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [addAddressOpen, setAddAddressOpen] = useState(false);

  // Edit profile form
  const [name, setName] = useState(user?.name || 'Alex Vance');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // New address form
  const [addressTitle, setAddressTitle] = useState('Office Studio');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <User className="w-12 h-12 text-stone-400 mx-auto" />
        <h2 className="text-2xl font-bold text-neutral-900">Sign in Required</h2>
        <p className="text-sm text-neutral-500">
          Please sign in to view and manage your account details.
        </p>
        <Link to="/login">
          <Button variant="primary">Sign In</Button>
        </Link>
      </div>
    );
  }

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    updateUserProfile({ name, phone });
    setEditProfileOpen(false);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!currentPassword) {
      setPasswordError('Please enter your current password');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    alert('Password updated successfully!');
    setPasswordModalOpen(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!street || !city || !postalCode) return;
    const newAddr = {
      id: 'addr_' + Date.now(),
      title: addressTitle || 'Secondary Address',
      name: user.name,
      street,
      city,
      state,
      postalCode,
      country: 'India',
      isDefault: false,
    };
    const updated = [...(user.addresses || []), newAddr];
    updateUserProfile({ addresses: updated });
    setAddAddressOpen(false);
    setStreet('');
    setCity('');
    setState('');
    setPostalCode('');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Title */}
      <div className="pb-6 mb-8 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-stone-500">
            Collector Overview
          </span>
          <h1 className="text-3xl sm:text-4xl font-light text-neutral-950 mt-1">
            Account <span className="font-semibold">Profile</span>
          </h1>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 text-xs font-semibold text-rose-600 hover:text-rose-700 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-sm space-y-8">
        {/* User Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-stone-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xl font-bold font-serif-or-sans shadow-md">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-neutral-950">{user.name}</h2>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                  Verified Collector
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Member since {user.memberSince || 'March 2024'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditProfileOpen(true)}
              icon={Edit2}
            >
              Edit Profile
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPasswordModalOpen(true)}
              icon={Lock}
            >
              Security
            </Button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <Link
            to="/orders"
            className="p-4 rounded-2xl bg-stone-50 hover:bg-stone-100 transition-colors border border-stone-200/60 block"
          >
            <div className="flex items-center gap-2 text-stone-500 text-xs mb-1">
              <Package className="w-4 h-4" />
              <span>Orders Placed</span>
            </div>
            <p className="text-2xl font-bold text-neutral-950">{orders.length}</p>
          </Link>

          <Link
            to="/shop"
            className="p-4 rounded-2xl bg-stone-50 hover:bg-stone-100 transition-colors border border-stone-200/60 block"
          >
            <div className="flex items-center gap-2 text-stone-500 text-xs mb-1">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Wishlist Items</span>
            </div>
            <p className="text-2xl font-bold text-neutral-950">{wishlist.length}</p>
          </Link>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60">
            <div className="flex items-center gap-2 text-stone-500 text-xs mb-1">
              <MapPin className="w-4 h-4" />
              <span>Saved Addresses</span>
            </div>
            <p className="text-2xl font-bold text-neutral-950">
              {user.addresses ? user.addresses.length : 1}
            </p>
          </div>
        </div>

        {/* Section 1: Contact Information */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-stone-200/80 bg-stone-50/50 flex items-center gap-3">
              <Mail className="w-4 h-4 text-stone-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-bold text-neutral-400">Email Address</p>
                <p className="text-xs font-semibold text-neutral-900 truncate">{user.email}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-stone-200/80 bg-stone-50/50 flex items-center gap-3">
              <Phone className="w-4 h-4 text-stone-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-bold text-neutral-400">Phone</p>
                <p className="text-xs font-semibold text-neutral-900 truncate">{user.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Saved Shipping Addresses */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Shipping Destinations
            </h3>
            <button
              type="button"
              onClick={() => setAddAddressOpen(true)}
              className="flex items-center gap-1 text-xs font-semibold text-neutral-900 hover:text-neutral-600 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Address</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(user.addresses && user.addresses.length > 0
              ? user.addresses
              : [
                  {
                    id: 'addr_default',
                    title: 'Primary Residence',
                    name: user.name,
                    street: '42 Lotus Boulevard, Apt 8B',
                    city: 'Bengaluru',
                    state: 'Karnataka',
                    postalCode: '560103',
                    country: 'India',
                    isDefault: true,
                  },
                ]
            ).map((addr) => (
              <div
                key={addr.id}
                className="p-4 rounded-2xl border border-stone-200 bg-white relative space-y-1 text-xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-neutral-900">{addr.title}</span>
                  {addr.isDefault && (
                    <span className="text-[10px] uppercase font-semibold text-neutral-500 bg-stone-100 px-2 py-0.5 rounded">
                      Default
                    </span>
                  )}
                </div>
                <p className="font-medium text-neutral-800">{addr.name}</p>
                <p className="text-neutral-600">{addr.street}</p>
                <p className="text-neutral-600">
                  {addr.city}, {addr.state} - {addr.postalCode}
                </p>
                <p className="text-stone-400 pt-1">{addr.country}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
        title="Edit Personal Information"
        subtitle="Keep your contact details up to date for dispatches"
      >
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditProfileOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        title="Security & Password"
        subtitle="Choose a robust password to safeguard your account"
      >
        <form onSubmit={handleChangePassword} className="space-y-4">
          {passwordError && (
            <p className="text-xs text-rose-600 font-medium">{passwordError}</p>
          )}
          <Input
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setPasswordModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Update Password
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Address Modal */}
      <Modal
        isOpen={addAddressOpen}
        onClose={() => setAddAddressOpen(false)}
        title="Add Shipping Destination"
        subtitle="Provide precise delivery address instructions"
      >
        <form onSubmit={handleAddAddress} className="space-y-4">
          <Input
            label="Address Nickname"
            value={addressTitle}
            onChange={(e) => setAddressTitle(e.target.value)}
            placeholder="Studio / Work / Vacation"
            required
          />
          <Input
            label="Street Address"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            placeholder="Flat 402, Sunset Towers"
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Mumbai"
              required
            />
            <Input
              label="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="Maharashtra"
              required
            />
          </div>
          <Input
            label="PIN / Postal Code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            placeholder="400050"
            required
          />
          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setAddAddressOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Address
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
