import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Sidebar from '../components/Layout/Sidebar.jsx';
import { Plus, X, Pin, Edit2, Trash2, Loader2, Search, StickyNote } from 'lucide-react';
import {
  getUserProfileApi,
  getRecentSelfNotesApi,
  getAllSelfNotesApi,
  createSelfNoteApi,
  updateSelfNoteApi,
  deleteSelfNoteApi,
  togglePinSelfNoteApi
} from '../../service/api';

const SelfNotes = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notesLoading, setNotesLoading] = useState(true);
  const [editingNote, setEditingNote] = useState(null);

  // User data
  const [userData, setUserData] = useState({
    id: null,
    username: '',
    email: ''
  });

  // Notes data
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    color: '#7B61FF'
  });

  const colorOptions = [
    { name: 'Purple', value: '#7B61FF' },
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Green', value: '#10B981' },
    { name: 'Pink', value: '#EC4899' },
    { name: 'Orange', value: '#F59E0B' },
    { name: 'Red', value: '#EF4444' }
  ];

  const fetchUserData = async () => {
    try {
      const response = await getUserProfileApi();
      if (response.data.success) {
        const user = response.data.user;
        setUserData({
          id: user.id,
          username: user.username,
          email: user.email
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      if (!localStorage.getItem('user')) {
        setNotesLoading(false);
      }
    }
  };

  const fetchNotes = async () => {
    try {
      setNotesLoading(true);
      const response = await getAllSelfNotesApi();
      if (response.data.success) {
        setNotes(response.data.notes || []);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error('Failed to load notes');
    } finally {
      setNotesLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (savedUser.id) {
        setUserData({
          id: savedUser.id,
          username: savedUser.username,
          email: savedUser.email
        });
      }

      await Promise.all([
        fetchUserData(),
        fetchNotes()
      ]);
    };
    init();
  }, []);

  const handleOpenModal = (note = null) => {
    if (note) {
      setEditingNote(note);
      setFormData({
        title: note.title,
        description: note.description,
        color: note.color
      });
    } else {
      setEditingNote(null);
      setFormData({
        title: '',
        description: '',
        color: '#7B61FF'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingNote(null);
    setFormData({
      title: '',
      description: '',
      color: '#7B61FF'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingNote) {
        const response = await updateSelfNoteApi(editingNote.id, formData);
        if (response.data.success) {
          await fetchNotes();
          handleCloseModal();
          toast.success('Note updated successfully!');
        }
      } else {
        const response = await createSelfNoteApi(formData);
        if (response.data.success) {
          await fetchNotes();
          handleCloseModal();
          toast.success('Note created successfully!');
        }
      }
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error(error.response?.data?.message || 'Failed to save note.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      const response = await deleteSelfNoteApi(noteId);
      if (response.data.success) {
        await fetchNotes();
        toast.success('Note deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note.');
    }
  };

  const handleTogglePin = async (noteId) => {
    try {
      const response = await togglePinSelfNoteApi(noteId);
      if (response.data.success) {
        await fetchNotes();
      }
    } catch (error) {
      console.error('Error toggling pin:', error);
      toast.error('Failed to toggle pin.');
    }
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!userData.id && !notesLoading) {
    return (
      <div className="flex bg-[#F4F7FE] min-h-screen">
        <Sidebar />
        <div className="flex-1 ml-64 flex items-center justify-center text-gray-500">
          Please login to access your notes
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F4F7FE]">
      <Sidebar />

      <div className="flex-1 ml-64 p-10">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-black text-[#1B2559] tracking-tight">
            My Self Notes
          </h1>
        </div>

        {/* Action Row */}
        <div className="flex justify-between items-center mb-10">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-[#7B61FF] focus:outline-none transition-colors"
            />
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="flex items-center bg-[#7B61FF] hover:bg-[#6a51e6] text-white px-7 py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-100/50 active:scale-95"
          >
            <Plus className="w-5 h-5 mr-2 stroke-[3px]" />
            Add New Note
          </button>
        </div>

        <main>
          {notesLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 text-[#7B61FF] animate-spin" />
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="text-center py-20">
              <StickyNote className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No notes yet</p>
              <p className="text-gray-300 text-sm mt-2">Create your first note to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className="bg-white rounded-[24px] p-6 shadow-sm border-2 border-white hover:border-indigo-100 transition-all relative group"
                  style={{ borderLeftColor: note.color, borderLeftWidth: '6px' }}
                >
                  <button
                    onClick={() => handleTogglePin(note.id)}
                    className={`absolute top-4 right-4 p-2 rounded-lg transition-all ${note.isPinned
                      ? 'bg-[#7B61FF] text-white'
                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                  >
                    <Pin className="w-4 h-4" />
                  </button>

                  <div className="pr-10 mb-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                      {note.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">
                      {formatDate(note.createdAt)}
                    </p>
                    <p className="text-gray-600 line-clamp-4 leading-relaxed">
                      {note.description}
                    </p>
                  </div>

                  <div className="flex space-x-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleOpenModal(note)}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-[#F0EEFF] text-[#7B61FF] hover:bg-[#7B61FF] hover:text-white transition-all font-medium"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-8 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-[#4D2DAA]">
                {editingNote ? 'Edit Note' : 'Create New Note'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter note title..."
                    required
                    maxLength={255}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#7B61FF] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Write your note here..."
                    required
                    rows="8"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#7B61FF] focus:outline-none transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Note Color
                  </label>
                  <div className="flex space-x-3">
                    {colorOptions.map((colorOption) => (
                      <button
                        key={colorOption.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, color: colorOption.value }))}
                        className={`w-12 h-12 rounded-xl transition-all ${formData.color === colorOption.value
                          ? 'ring-4 ring-offset-2 ring-gray-400 scale-110'
                          : 'hover:scale-105'
                          }`}
                        style={{ backgroundColor: colorOption.value }}
                        title={colorOption.name}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 rounded-xl bg-[#7B61FF] hover:bg-[#6a51e6] text-white font-bold transition-all shadow-lg shadow-indigo-100/50 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      editingNote ? 'Update Note' : 'Create Note'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelfNotes;