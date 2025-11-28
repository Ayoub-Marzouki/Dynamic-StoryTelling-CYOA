import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function UploadStory() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an XML file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      await api.post('/stories', formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Error uploading file. Ensure it is valid XML.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload New Story (XML)</h2>
      <p className="instructions">
        Upload a valid XML file following the project schema.
      </p>
      
      {error && <p className="error-msg">{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input 
            type="file" 
            accept=".xml" 
            onChange={handleFileChange} 
            disabled={uploading}
          />
        </div>
        <button type="submit" className="btn-primary" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload Story'}
        </button>
      </form>
    </div>
  );
}

export default UploadStory;
