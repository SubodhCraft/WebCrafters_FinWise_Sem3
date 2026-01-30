import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Sidebar from '../components/Layout/Sidebar.jsx';
import Header from '../components/Layout/Header.jsx';
import {
  Plus,
  X,
  Pin,
  Edit2,
  Trash2,
  Loader2,
  Search,
  Archive,
  Filter,
  Clock,
  Shield,
  CheckCircle2,
  Calendar,
  Layers,
  Activity,
  Zap,
  BookOpen,
  ArrowUpRight
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';
import {
  getAllSelfNotesApi,
  createSelfNoteApi,
  updateSelfNoteApi,
  deleteSelfNoteApi,
  togglePinSelfNoteApi
} from '../../service/api';

const SelfNotes = () => {
  const { isDarkMode: darkMode } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notesLoading, setNotesLoading] = useState(true);
  const [editingNote, setEditingNote] = useState(null);
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    color: '#6366F1'
  });

  const colorOptions = [
    { name: 'Indigo', value: '#6366F1' },
    { name: 'Violet', value: '#8B5CF6' },
    { name: 'Emerald', value: '#10B981' },
    { name: 'Rose', value: '#F43F5E' },
    { name: 'Amber', value: '#F59E0B' },
    { name: 'Cyan', value: '#06B6D4' }
  ];

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
    fetchNotes();
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
        color: '#6366F1'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingNote(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingNote) {
        await updateSelfNoteApi(editingNote.id, formData);
        toast.success('Note updated');
      } else {
        await createSelfNoteApi(formData);
        toast.success('Note saved');
      }
      await fetchNotes();
      handleCloseModal();
    } catch (error) {
      toast.error('Failed to save note');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this note?')) {
      try {
        await deleteSelfNoteApi(id);
        toast.success('Note deleted');
        await fetchNotes();
      } catch (error) {
        toast.error('Delete failed');
      }
    }
  };

  const handlePin = async (id) => {
    try {
      await togglePinSelfNoteApi(id);
      await fetchNotes();
    } catch (error) {
      toast.error('Failed to pin note');
    }
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedNotes = filteredNotes.filter(n => n.pinned);
  const otherNotes = filteredNotes.filter(n => !n.pinned);

  return (
    <div className={`flex min-h-screen transition-colors duration-500 ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <Sidebar />

      <div className="flex-1 ml-72 flex flex-col min-h-screen relative overflow-hidden">
        {/* Subtle background blurs */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-indigo-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>

        <Header title="Self Notes" />

        <main className="flex-1 p-10 space-y-10 relative z-10 mt-20 max-w-[1680px] mx-auto w-full">

          {/* Executive Intelligence Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-200 dark:border-slate-800 pb-10">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Self <span className="text-indigo-600">Notes</span></h1>
              <p className="text-slate-500 text-sm mt-1">Capture your thoughts, ideas, and reminders.</p>
            </div>

            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-4 px-6 py-3.5 rounded-2xl border transition-all ${darkMode ? 'bg-slate-900/50 border-slate-800 focus-within:border-indigo-500' : 'bg-white border-slate-100 shadow-sm focus-within:border-indigo-200'}`}>
                <Search size={16} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-[13px] font-bold w-56 placeholder:text-slate-400"
                />
              </div>
              <button
                onClick={() => handleOpenModal()}
                className="flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[1.25rem] font-bold text-sm shadow-xl shadow-indigo-600/20 active:scale-95 transition-all"
              >
                <Plus size={18} />
                Add Note
              </button>
            </div>
          </div>


          {notesLoading ? (
            <div className="py-32 flex flex-col items-center justify-center">
              <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
              <p className="mt-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Loading Notes...</p>
            </div>
          ) : notes.length === 0 ? (
            <div className={`py-24 text-center rounded-[3rem] border-2 border-dashed transition-all flex flex-col items-center justify-center ${darkMode ? 'border-slate-800 bg-slate-900/30' : 'border-slate-200 bg-white shadow-sm'}`}>
              <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-8 ${darkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                <BookOpen size={48} className="text-slate-300" />
              </div>
              <h3 className="text-3xl font-bold mb-4">No Notes Found</h3>
              <p className="text-slate-500 max-w-sm mx-auto text-base leading-relaxed italic">You haven't created any notes yet. Jot down your first thought!</p>

            </div>
          ) : (
            <div className="space-y-16">
              {pinnedNotes.length > 0 && (
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="h-[1px] flex-1 bg-slate-200 dark:bg-slate-800/50"></div>
                    <div className="flex items-center gap-2.5 px-6 py-2 rounded-full border border-indigo-500/20 bg-indigo-500/5">
                      <Zap size={14} className="text-amber-500 fill-amber-500/10" />
                      <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-500">Pinned Notes</h2>
                    </div>
                    <div className="h-[1px] flex-1 bg-slate-200 dark:bg-slate-800/50"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {pinnedNotes.map((note) => (
                      <NoteCard key={note.id} note={note} onEdit={handleOpenModal} onDelete={handleDelete} onPin={handlePin} darkMode={darkMode} />
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-slate-300 dark:bg-slate-800 rounded-full"></div>
                    <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">All Notes</h2>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-900 rounded-xl text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <Filter size={12} />
                    Category: All
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {otherNotes.map((note) => (
                    <NoteCard key={note.id} note={note} onEdit={handleOpenModal} onDelete={handleDelete} onPin={handlePin} darkMode={darkMode} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Professional Executive Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center z-[500] p-4">
          <div className={`w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in duration-500 border ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-100'}`}>
            <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/40">
              <div className="space-y-1">
                <h2 className="text-3xl font-bold tracking-tighter">{editingNote ? 'Edit Note' : 'Create New Note'}</h2>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Self Notes Portal</p>
                </div>
              </div>
              <button onClick={handleCloseModal} className="p-4 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all">
                <X size={28} className="text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-12 space-y-10">
              <div className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={`w-full px-6 py-5 rounded-2xl border-2 transition-all outline-none text-base font-bold ${darkMode ? 'bg-slate-900 border-slate-800 focus:border-indigo-600' : 'bg-slate-50 border-slate-100 focus:border-indigo-500 shadow-inner'}`}
                    placeholder="Note title..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Content</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={`w-full h-56 px-6 py-5 rounded-2xl border-2 transition-all outline-none text-sm font-medium resize-none leading-relaxed ${darkMode ? 'bg-slate-900 border-slate-800 focus:border-indigo-600' : 'bg-slate-50 border-slate-100 focus:border-indigo-500 shadow-inner'}`}
                    placeholder="Type your note here..."
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Color Theme</label>
                  <div className="flex items-center gap-6 p-6 rounded-[2rem] border-2 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
                    <div className="grid grid-cols-6 gap-4 flex-1">
                      {colorOptions.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, color: color.value })}
                          className={`h-10 rounded-xl transition-all flex items-center justify-center ${formData.color === color.value ? 'scale-110 shadow-lg ring-4 ring-indigo-500/20' : 'opacity-40 hover:opacity-100'}`}
                          style={{ backgroundColor: color.value }}
                        >
                          {formData.color === color.value && <CheckCircle2 size={20} className="text-white" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-6 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className={`flex-1 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all ${darkMode ? 'bg-slate-900 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-[2] py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-600/40 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : editingNote ? <><Zap size={18} /> Update Note</> : <><Plus size={18} /> Save Note</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const NoteCard = ({ note, onEdit, onDelete, onPin, darkMode }) => {
  const dateObj = new Date(note.createdAt);
  const formattedDate = dateObj.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div
      className={`group p-6 rounded-2xl border transition-all duration-300 flex flex-col relative overflow-hidden ${darkMode ? 'bg-slate-900 border-slate-800 hover:border-indigo-500/50' : 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-600/20'}`}
    >
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div
          className="w-8 h-1 rounded-full"
          style={{ backgroundColor: note.color }}
        ></div>
        <button
          onClick={() => onPin(note.id)}
          className={`p-2 rounded-lg transition-all ${note.pinned ? 'text-indigo-600 bg-indigo-600/5' : 'text-slate-300 hover:text-indigo-500'}`}
        >
          <Pin size={18} fill={note.pinned ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="flex-1 space-y-3 relative z-10">
        <h3 className={`text-lg font-bold leading-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>{note.title}</h3>
        <p className={`text-sm leading-relaxed line-clamp-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{note.description}</p>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center relative z-10">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          {formattedDate}
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(note)}
            className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-all"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-800 transition-all"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelfNotes;