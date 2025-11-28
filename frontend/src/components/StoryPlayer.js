import React from 'react';
import './StoryPlayer.css';

function StoryPlayer({ storyData }) {
  // Start with the first node in the array (usually 'start' or index 0)
  const [currentNodeId, setCurrentNodeId] = React.useState(storyData.nodes[0]?.id);
  
  // Find the node object based on the current ID
  const currentNode = storyData.nodes.find(n => n.id === currentNodeId);

  if (!currentNode) {
    return <div className="error-msg">Error: Node '{currentNodeId}' not found in story data.</div>;
  }

  const handleChoice = (targetId) => {
    setCurrentNodeId(targetId);
  };

  return (
    <div className="story-player">
      <div className="story-content">
        {currentNode.image && (
          <img src={currentNode.image} alt="Scene" className="story-image" />
        )}
        <p className="story-text">{currentNode.text}</p>
      </div>
      
      <div className="choices-container">
        {currentNode.choices && currentNode.choices.length > 0 ? (
          currentNode.choices.map((choice, index) => (
            <button 
              key={index} 
              className="btn-choice" 
              onClick={() => handleChoice(choice.target)}
            >
              {choice.text}
            </button>
          ))
        ) : (
          <div className="end-story">
            <h3>The End</h3>
            <button className="btn-secondary" onClick={() => window.location.reload()}>Restart</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default StoryPlayer;
