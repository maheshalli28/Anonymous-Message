import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { FiSend } from "react-icons/fi";
import Image from '../assets/chat (1).png';
import './Message.css';

const API_BASE = 'https://anonymous-message-vddt.onrender.com';

function Message() {
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
    <div className="container-grid">

      {/* Header */}
      <div className="header">
        <motion.h1
          className="page-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Share Your Thoughts.!
        </motion.h1>
      </div>

      {/* Sidebar / Image Section */}
      <div className="sidebar">
        <div className='row'>
        
        <img 
          src= {Image} 
          alt="Inspiration" 
          className="sidebar-image" 
        />
        
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <form className="message-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter your message"
            value={newThought}
            onChange={(e) => setNewThought(e.target.value)}
            required
          />
          <button type="submit" className="send-btn">
            <FiSend />
          </button>
        </form>

        <div className="thoughts-container">
          {thoughts.length === 0 ? (
            <p className="no-msg">No messages yet. Be the first!</p>
          ) : (
            thoughts.map((t) => (
              <motion.div
                key={t.id}
                className="thought-card"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="thought-text">“{t.content}”</p>
                <div className="thought-footer">
                  <span className="author">~ {t.author}</span>
                  <div className="actions">
                    <button onClick={() => handleEdit(t)}>
                      <FaEdit className='text-warning' />
                    </button>
                    <button onClick={() => handleDelete(t.id)}>
                      <FaTrash className='text-danger' />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        <p>Anonymous Messages © 2025</p>
      </div>
    </div>
  );
}

export default Message;
