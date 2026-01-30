import React, { useState, useEffect } from 'react';
import {
  Bell, Lock, User, Save, MessageSquare, Mail, Shield,
  Camera, Zap, Layout, Heart, Loader2, Globe, Trash2, X, Eye, EyeOff
} from 'lucide-react';
import Sidebar from '../components/Layout/Sidebar.jsx';
import Header from '../components/Layout/Header.jsx';
import {
  createFeedbackApi,
  getUserProfileApi,
  updateUserProfileApi,
  changePasswordApi,
  deleteAccountApi,
  uploadProfilePictureApi
} from '../../service/api';
import toast from 'react-hot-toast';
import { useCurrency } from '../context/CurrencyContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

const Setting = () => {
  const { currency, toggleCurrency, isPrivacyMode, togglePrivacyMode } = useCurrency();
  const { isDarkMode: darkMode } = useTheme();

  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    phone: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    emailNotifications: true,
    pushNotifications: true,
  });

  const [feedback, setFeedback] = useState({ message: '', rating: 5 });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setPageLoading(true);
      const response = await getUserProfileApi();
      if (response.data.success) {
        const { user } = response.data;
        setFormData(prev => ({
          ...prev,
          username: user.username || '',
          fullName: user.fullName || '',
          email: user.email || '',
          phone: user.phone || '',
        }));

        localStorage.setItem('user', JSON.stringify(user));
        if (user.profilePicture) {
          // Check if the profilePicture is an absolute URL (Cloudinary) or needs the backend prefix
          const picUrl = user.profilePicture.startsWith('http')
            ? user.profilePicture
            : `http://localhost:5000/uploads/profiles/${user.profilePicture}`;
          setProfilePicturePreview(picUrl);
        }
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
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

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await updateUserProfileApi({
        username: formData.username,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone
      });
      if (response.data.success) {
        toast.success('Profile updated');
        fetchProfile();
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePicturePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload to backend
    try {
      setLoading(true);
      const uploadFormData = new FormData();
      uploadFormData.append('profilePicture', file);
      const response = await uploadProfilePictureApi(uploadFormData);
      if (response.data.success) {
        toast.success('Profile picture updated');
        fetchProfile();
      }
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      setLoading(true);
      await changePasswordApi({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword
      });
      toast.success('Password updated');
      setFormData(prev => ({ ...prev, oldPassword: '', newPassword: '', confirmPassword: '' }));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createFeedbackApi(feedback);
      toast.success('Feedback sent');
      setFeedback({ message: '', rating: 5 });
    } catch (error) {
      toast.error('Failed to send feedback');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className={`flex min-h-screen ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
        <Sidebar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
          <p className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-500">Loading Settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen transition-colors duration-500 ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col min-h-screen relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-indigo-600/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>

        <Header title="Settings" />

        <main className="flex-1 p-8 space-y-10 relative z-10 mt-20 max-w-7xl mx-auto w-full">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
              <p className="text-slate-500 text-sm mt-1">Manage your profile and security.</p>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-8">

            {/* Profile Section */}
            <div className={`col-span-12 p-8 rounded-2xl border transition-all duration-300 hover:shadow-lg ${darkMode ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 shadow-sm hover:border-indigo-100'}`}>
              <div className="flex items-center gap-4 mb-8">
                <div className="p-2.5 bg-indigo-600/10 text-indigo-600 rounded-xl"><User size={22} /></div>
                <h3 className="text-xl font-bold">Account Profile</h3>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-8 mb-10 pb-8 border-b border-slate-100 dark:border-slate-800">
                <div className="relative group">
                  <div className={`w-28 h-28 rounded-2xl border-4 overflow-hidden ${darkMode ? 'border-slate-800' : 'border-slate-50'}`}>
                    {profilePicturePreview ? (
                      <img src={profilePicturePreview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-indigo-600 flex items-center justify-center text-white">
                        <User size={40} />
                      </div>
                    )}
                  </div>
                  <label htmlFor="profile-upload" className="absolute -bottom-2 -right-2 p-2 bg-indigo-600 text-white rounded-lg shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer">
                    <Camera size={16} />
                    <input
                      id="profile-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                <div className="text-center md:text-left">
                  <h4 className="text-2xl font-bold tracking-tight">@{formData.username || 'user'}</h4>
                  <p className="text-sm font-medium text-slate-500 mt-1">{formData.fullName || 'FinWise Member'}</p>
                </div>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none font-bold text-sm ${darkMode ? 'bg-slate-800 border-slate-700 focus:border-indigo-500' : 'bg-slate-50 border-slate-100 focus:border-indigo-500'}`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none font-bold text-sm ${darkMode ? 'bg-slate-800 border-slate-700 focus:border-indigo-500' : 'bg-slate-50 border-slate-100 focus:border-indigo-500'}`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none font-bold text-sm ${darkMode ? 'bg-slate-800 border-slate-700 focus:border-indigo-500' : 'bg-slate-50 border-slate-100 focus:border-indigo-500'}`}
                    />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md active:scale-95 transition-all flex items-center gap-2">
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Save Profile
                </button>
              </form>
            </div>

            {/* Access Security */}
            <div className={`col-span-12 lg:col-span-6 p-8 rounded-2xl border transition-all duration-300 hover:shadow-lg ${darkMode ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 shadow-sm hover:border-indigo-100'}`}>
              <div className="flex items-center gap-4 mb-8">
                <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl"><Lock size={22} /></div>
                <h3 className="text-xl font-bold">Security</h3>
              </div>

              <form onSubmit={handleUpdatePassword} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Current Password</label>
                  <input
                    type="password"
                    name="oldPassword"
                    value={formData.oldPassword}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none font-bold text-sm ${darkMode ? 'bg-slate-800 border-slate-700 focus:border-indigo-500' : 'bg-slate-50 border-slate-100 focus:border-indigo-500'}`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none font-bold text-sm ${darkMode ? 'bg-slate-800 border-slate-700 focus:border-indigo-500' : 'bg-slate-50 border-slate-100 focus:border-indigo-500'}`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none font-bold text-sm ${darkMode ? 'bg-slate-800 border-slate-700 focus:border-indigo-500' : 'bg-slate-50 border-slate-100 focus:border-indigo-500'}`}
                    />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="w-full py-4 bg-slate-900 dark:bg-white dark:text-slate-950 text-white rounded-xl font-bold text-sm shadow-md active:scale-95 transition-all">
                  Update Password
                </button>
              </form>
            </div>

            {/* System Preferences */}
            <div className={`col-span-12 lg:col-span-6 p-8 rounded-2xl border transition-all duration-300 hover:shadow-lg ${darkMode ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 shadow-sm hover:border-indigo-100'}`}>
              <div className="flex items-center gap-4 mb-8">
                <div className="p-2.5 bg-indigo-600/10 text-indigo-600 rounded-xl"><Layout size={22} /></div>
                <h3 className="text-xl font-bold">Preferences</h3>
              </div>

              <div className="space-y-6">
                {/* Privacy Mode */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${isPrivacyMode ? 'bg-rose-500/10 text-rose-500' : 'bg-indigo-600/10 text-indigo-600'}`}>
                      {isPrivacyMode ? <EyeOff size={18} /> : <Eye size={18} />}
                    </div>
                    <div>
                      <p className="text-sm font-bold">Privacy Mode</p>
                      <p className="text-[10px] text-slate-500 font-medium">Mask all balance & transaction amounts</p>
                    </div>
                  </div>
                  <button
                    onClick={togglePrivacyMode}
                    className={`relative w-12 h-6 rounded-full transition-all duration-300 ${isPrivacyMode ? 'bg-rose-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${isPrivacyMode ? 'left-7' : 'left-1'}`}></div>
                  </button>
                </div>

                {/* Currency Switcher */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-indigo-600/10 text-indigo-600">
                      <Globe size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Currency Unit</p>
                      <p className="text-[10px] text-slate-500 font-medium">Currently using: {currency}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      toggleCurrency();
                      toast.success(`Switched to ${currency === 'NPR' ? 'USD' : 'NPR'}`);
                    }}
                    className={`px-4 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all ${darkMode ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-white hover:bg-slate-100 shadow-sm border border-slate-200'}`}
                  >
                    Switch to {currency === 'NPR' ? 'USD' : 'NPR'}
                  </button>
                </div>
              </div>
            </div>

            {/* Performance Logs & Termination */}
            <div className="col-span-12 lg:col-span-6 space-y-8">
              <div className={`p-8 rounded-2xl border transition-all duration-300 hover:shadow-lg ${darkMode ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 shadow-sm hover:border-indigo-100'}`}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-2.5 bg-indigo-600/10 text-indigo-600 rounded-xl"><MessageSquare size={22} /></div>
                  <h3 className="text-xl font-bold">Feedback</h3>
                </div>
                <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setFeedback(f => ({ ...f, rating: s }))}
                        className={`flex-1 py-2.5 rounded-lg font-bold text-xs transition-all ${feedback.rating >= s ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={feedback.message}
                    onChange={(e) => setFeedback(f => ({ ...f, message: e.target.value }))}
                    className={`w-full h-24 px-4 py-3 rounded-xl border-2 transition-all outline-none text-sm font-medium resize-none ${darkMode ? 'bg-slate-800 border-slate-700 focus:border-indigo-500' : 'bg-slate-50 border-slate-100 focus:border-indigo-500'}`}
                    placeholder="Tell us what you think..."
                  />
                  <button type="submit" className="w-full py-2.5 bg-indigo-600/10 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all">
                    Send feedback
                  </button>
                </form>
              </div>

              <div className={`p-8 rounded-2xl border-2 border-dashed border-rose-500/20 bg-rose-500/5`}>
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="text-lg font-bold text-rose-500">Delete Account</h3>
                    <p className="text-xs font-medium text-slate-500 mt-1">This action cannot be undone.</p>
                  </div>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold text-xs shadow-md active:scale-95 transition-all flex items-center gap-2"
                  >
                    <Trash2 size={16} />
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center pt-8 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2">
            <Heart size={12} className="text-rose-500" />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">FinWise</p>
          </div>
        </main>
      </div>

      {/* Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center z-[500] p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-8 border border-rose-500/30 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 mx-auto mb-6">
              <Trash2 size={28} />
            </div>
            <h3 className="text-xl font-bold text-center mb-2">Confirm Deletion</h3>
            <p className="text-slate-500 text-center text-xs mb-6">Enter your password to confirm account deletion.</p>
            <input
              type="password"
              placeholder="Your Password"
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none mb-6 font-bold text-center text-base"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
            />
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-xs uppercase">Cancel</button>
              <button className="flex-1 py-3 rounded-xl bg-rose-500 text-white font-bold text-xs uppercase shadow-md">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Setting;
