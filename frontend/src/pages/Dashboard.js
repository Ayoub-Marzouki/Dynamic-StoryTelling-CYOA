import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function Dashboard() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await api.get('/stories');
        setStories(res.data);
      } catch (err) {
        console.error('Error fetching stories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  if (loading) return <div className="loading">Loading stories...</div>;

  return (
    <div className="dashboard-container">
      <h2>Available Adventures</h2>
      {stories.length === 0 ? (
        <p>No stories available yet. Be the first to upload one!</p>
      ) : (
        <div className="story-grid">
          {stories.map((story) => (
            <div key={story._id} className="story-card">
              <h3>{story.title}</h3>
              <p>By: {story.author?.username || 'Unknown'}</p>
              <Link to={`/story/${story._id}`} className="btn-secondary">Play Now</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
