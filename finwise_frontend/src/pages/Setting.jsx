import React, { useState, useEffect } from 'react';
import { Bell, Lock, User, Save, MessageSquare } from 'lucide-react';
import Sidebar from '../components/Layout/Sidebar.jsx';
import {
  createFeedbackApi,
  getUserProfileApi,
  updateUserProfileApi,
  changePasswordApi
} from '../../service/api';
import toast from 'react-hot-toast';

const Setting = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
  });

  const [feedback, setFeedback] = useState({ message: '', rating: 5 });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setPageLoading(true);
      const response = await getUserProfileApi();
      if (response.data.success) {
        const { user } = response.data;
        const newFormData = {
          ...formData,
          fullName: user.fullName || '',
          email: user.email || '',
          phone: user.phone || '',
        };
        setFormData(newFormData);

        // Sync with local storage
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({
          ...currentUser,
          fullName: user.fullName || user.username,
          email: user.email,
          username: user.username
        }));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile settings');
    } finally {
      setPageLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await updateUserProfileApi({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone
      });
      if (response.data) {
        toast.success(response.data.message || 'Profile updated successfully');

        // Update local storage user
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({
          ...currentUser,
          fullName: formData.fullName,
          email: formData.email
        }));
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!formData.oldPassword || !formData.newPassword) {
      toast.error('Please fill in both current and new passwords');
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const response = await changePasswordApi({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword
      });
      toast.success(response.data.message || 'Password updated successfully');
      setFormData(prev => ({
        ...prev,
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.message) {
      toast.error("Please enter a message");
      return;
    }
    setFeedbackLoading(true);
    try {
      await createFeedbackApi(feedback);
      toast.success("Thank you for your feedback!");
      setFeedback({ message: '', rating: 5 });
    } catch (error) {
      console.error("Feedback error:", error);
      toast.error(error.response?.data?.message || "Failed to submit feedback");
    } finally {
      setFeedbackLoading(false);
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <div className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

        <div className="">
          {pageLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {/* Profile Settings */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <div className="flex items-center mb-6">
                    <User className="w-6 h-6 text-indigo-600 mr-3" />
                    <h2 className="text-xl font-semibold text-gray-900">Profile Settings</h2>
                  </div>

                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center disabled:opacity-50"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {loading ? 'Saving...' : 'Save Profile'}
                    </button>
                  </form>
                </div>

                {/* Security Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center mb-6">
                    <Lock className="w-6 h-6 text-indigo-600 mr-3" />
                    <h2 className="text-xl font-semibold text-gray-900">Security</h2>
                  </div>

                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="oldPassword"
                        value={formData.oldPassword}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter current password"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Enter new password"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center disabled:opacity-50"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      {loading ? 'Processing...' : 'Change Password'}
                    </button>
                  </form>
                </div>
              </div>

              <div className="lg:col-span-1 space-y-6">
                {/* Notifications Panel */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center mb-6">
                    <Bell className="w-6 h-6 text-indigo-600 mr-3" />
                    <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="emailNotifications"
                        name="emailNotifications"
                        checked={formData.emailNotifications}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                      />
                      <label htmlFor="emailNotifications" className="ml-3 text-sm font-medium text-gray-700 cursor-pointer">
                        Email Notifications
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="smsNotifications"
                        name="smsNotifications"
                        checked={formData.smsNotifications}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                      />
                      <label htmlFor="smsNotifications" className="ml-3 text-sm font-medium text-gray-700 cursor-pointer">
                        SMS Notifications
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="pushNotifications"
                        name="pushNotifications"
                        checked={formData.pushNotifications}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                      />
                      <label htmlFor="pushNotifications" className="ml-3 text-sm font-medium text-gray-700 cursor-pointer">
                        Push Notifications
                      </label>
                    </div>
                  </div>
                </div>

                {/* Feedback Panel */}
                <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-indigo-600">
                  <div className="flex items-center mb-4">
                    <MessageSquare className="w-6 h-6 text-indigo-600 mr-3" />
                    <h2 className="text-xl font-semibold text-gray-900">Feedback</h2>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Share your thoughts with our team.</p>
                  <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                    <div>
                      <textarea
                        name="message"
                        value={feedback.message}
                        onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-32 text-sm"
                        placeholder="How can we improve?"
                      />
                    </div>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFeedback({ ...feedback, rating: star })}
                          className={`text-2xl ${feedback.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <button
                      type="submit"
                      disabled={feedbackLoading}
                      className="w-full bg-indigo-600 text-white p-2 rounded-lg font-bold hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                      {feedbackLoading ? 'Submitting...' : 'Submit Feedback'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Setting;