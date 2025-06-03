import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_BASE = 'https://anonymous-message-vddt.onrender.com';

function App() {
  const [thoughts, setThoughts] = useState([]);
  const [newThought, setNewThought] = useState('');
  const [author, setAuthor] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchThoughts();
  }, []);

  const fetchThoughts = () => {
    axios.get(`${API_BASE}/thoughts`)
      .then(res => setThoughts(res.data))
      .catch(err => console.error(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      content: newThought,
      author: author.trim() || 'Anonymous'
    };

    if (editId !== null) {
      axios.put(`${API_BASE}/thoughts/${editId}`, payload)
        .then(() => {
          fetchThoughts();
          setNewThought('');
          setEditId(null);
        });
    } else {
      axios.post(`${API_BASE}/thoughts`, payload)
        .then(() => {
          fetchThoughts();
          setNewThought('');
          setAuthor('');
        });
    }
  };

  const handleEdit = (thought) => {
    setNewThought(thought.content);
    setAuthor(thought.author);
    setEditId(thought.id);
  };

  const handleDelete = (id) => {
    axios.delete(`${API_BASE}/thoughts/${id}`)
      .then(() => fetchThoughts());
  };

  return (
    <div className="min-vh-100 bg-light bg-opacity-50 py-5 px-3" style={{
      background: 'linear-gradient(to right, #f0f8ff, #e6f7ff)',
    }}>
      <div className="container">
        <motion.h2
          className="text-center mb-4 text-primary fw-bold display-6"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          💌 Anonymous Message Portal
        </motion.h2>

        <motion.form
          onSubmit={handleSubmit}
          className="mb-5 bg-white rounded p-4 shadow-sm border border-light"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Your name (optional)"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <textarea
              className="form-control form-control-lg"
              rows="4"
              placeholder="Write your message..."
              value={newThought}
              onChange={(e) => setNewThought(e.target.value)}
              required
              minLength={5}
              maxLength={200}
            />
          </div>
          <div className="text-end">
            <button className={`btn ${editId ? 'btn-warning' : 'btn-success'} px-4`} type="submit">
              {editId ? 'Update Message' : 'Submit'}
            </button>
          </div>
        </motion.form>

        <div className="thoughts-list">
          {thoughts.length === 0 ? (
            <motion.div
              className="text-center text-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              No messages yet. Be the first to share! 🚀
            </motion.div>
          ) : thoughts.map((t, index) => (
            <motion.div
              key={t.id}
              className="card mb-4 shadow-sm border-0 rounded-3 bg-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="text-secondary mb-0">~ {t.author}</h6>
                  <small className="text-muted">{t.timestamp}</small>
                </div>
                <hr />
                <p className="fs-5">{t.content}</p>
                <div className="text-end">
                  <button onClick={() => handleEdit(t)} className="btn btn-sm btn-outline-primary me-2">
                    ✏️ Edit
                  </button>
                  <button onClick={() => handleDelete(t.id)} className="btn btn-sm btn-outline-danger">
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
