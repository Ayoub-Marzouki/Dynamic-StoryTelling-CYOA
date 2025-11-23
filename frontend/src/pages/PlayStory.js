import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import StoryPlayer from '../components/StoryPlayer';

function PlayStory() {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const res = await api.get(`/stories/${id}`);
        setStory(res.data);
      } catch (err) {
        setError('Failed to load story.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [id]);

  if (loading) return <div className="loading">Loading Adventure...</div>;
  if (error) return <div className="error-msg">{error}</div>;
  if (!story || !story.jsonContent) return <div className="error-msg">Invalid story data.</div>;

  return (
    <div className="play-container">
      <div className="story-header">
        <h1>{story.title}</h1>
      </div>
      <StoryPlayer storyData={story.jsonContent} />
    </div>
  );
}

export default PlayStory;
