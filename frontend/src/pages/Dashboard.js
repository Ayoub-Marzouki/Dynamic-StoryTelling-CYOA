import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

function Dashboard() {
  const { user } = useAuth();
  
  // Data States
  const [stories, setStories] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // UI States
  const [selectedGenre, setSelectedGenre] = useState(null); // null = view genres, 'id' = view stories

  // Admin States
  const [userFile, setUserFile] = useState(null);
  const [genreFile, setGenreFile] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [storiesRes, genresRes] = await Promise.all([
          api.get('/stories'),
          api.get('/genres')
        ]);
        setStories(storiesRes.data);
        setGenres(genresRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAdminImport = async (type, file) => {
    if (!file) return alert("Please select a file first");
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post(`/${type}/import`, formData);
      setMessage(`${type.toUpperCase()} Import: ${res.data.message}`);
      setTimeout(() => setMessage(''), 5000);
      // Reload data if genres were imported
      if (type === 'genres') {
        const gRes = await api.get('/genres');
        setGenres(gRes.data);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Import failed");
    }
  };

  // Filtering Logic
  const filteredStories = selectedGenre 
    ? stories.filter(s => s.genreId === selectedGenre) 
    : [];

  const currentGenreInfo = genres.find(g => g.genreId === selectedGenre);

  if (loading) return <div className="loading">Loading the library...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dynamic StoryTelling</h1>
        <p>Choose Your Own Adventure - XML Powered Platform</p>
      </div>

      {/* ADMIN PANEL */}
      {user && user.role === 'admin' && (
        <div className="admin-panel">
          <h2>Admin Command Center</h2>
          {message && <div className="success-msg">{message}</div>}
          
          <div className="admin-controls">
            <div className="control-group">
              <h3>Import Users (XML)</h3>
              <div className="file-input-wrapper">
                <input type="file" accept=".xml" onChange={(e) => setUserFile(e.target.files[0])} />
                <button className="btn-upload" onClick={() => handleAdminImport('users', userFile)}>Import</button>
              </div>
            </div>

            <div className="control-group">
              <h3>Import Genres (XML)</h3>
              <div className="file-input-wrapper">
                <input type="file" accept=".xml" onChange={(e) => setGenreFile(e.target.files[0])} />
                <button className="btn-upload" onClick={() => handleAdminImport('genres', genreFile)}>Import</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GENRE BROWSING (Default View) */}
      {!selectedGenre ? (
        <div className="genres-section">
          <h2>Browse by Genre</h2>
          {genres.length === 0 ? (
             <p className="no-data-msg">No genres found. Admin needs to import 'site_genres.xml'.</p>
          ) : (
            <div className="genre-grid">
              {genres.map((g) => (
                <div key={g._id} className="genre-card" onClick={() => setSelectedGenre(g.genreId)}>
                  <div className="genre-icon">{g.icon}</div>
                  <h3>{g.label}</h3>
                  <p>{g.description}</p>
                  <span className="genre-count">
                    {stories.filter(s => s.genreId === g.genreId).length} Stories
                  </span>
                </div>
              ))}
            </div>
          )}
          
          {/* If logged in as User/Author, show their own stories maybe? Or just generic list */}
          {/* Just showing a button to see ALL stories if needed, or relying on genres */}
        </div>
      ) : (
        /* STORY LIST (Filtered View) */
        <div className="stories-section">
          <div className="section-header">
            <button className="btn-secondary" onClick={() => setSelectedGenre(null)}>
              ← Back to Genres
            </button>
            <h2>{currentGenreInfo?.icon} {currentGenreInfo?.label || selectedGenre}</h2>
          </div>

          {filteredStories.length === 0 ? (
            <p className="no-data-msg">No stories found in this genre yet.</p>
          ) : (
            <div className="story-grid">
              {filteredStories.map((story) => (
                <div key={story._id} className="story-card">
                  <div>
                    <h3>{story.title}</h3>
                    <p>By: {story.author?.username || 'Unknown'}</p>
                  </div>
                  <Link to={`/story/${story._id}`} className="btn-secondary">Play Now</Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
