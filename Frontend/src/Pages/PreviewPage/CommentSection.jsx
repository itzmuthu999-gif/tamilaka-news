import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addComment } from "../Slice/newsformslice.js";
import "./Previewpge.scss";
import timeFun from "../Newspaper/Containers_/timeFun.js";
import Line from "../Newspaper/Components/Line.jsx";

export default function CommentSection({ newsId, comments = [] }) {
  const dispatch = useDispatch();
  const [commentText, setCommentText] = useState("");
  const [userName, setUserName] = useState("");
  const [showAll, setShowAll] = useState(false);

  const handleSubmit = () => {
    if (commentText.trim() && userName.trim()) {
      dispatch(addComment({
        newsId,
        comment: {
          name: userName.trim(),
          text: commentText.trim()
        }
      }));
      setCommentText("");
      setUserName("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const displayedComments = showAll ? comments : comments.slice(0, 1);

  return (
    <div className="comment-section">
      <div className="comment-header">
        <h3>{comments.length} peoples commented on this news</h3>
      </div>

      {/* Comments Display */}
      {comments.length > 0 && (
        <div className="comments-display-box">
          <div className="comments-list">
            {displayedComments.map((comment, index) => (
             <div>
                            <div key={comment.id || index} className="comment-item">
                <div className="comment-avatar">
                  {comment.name.charAt(0).toUpperCase()}
                </div>
                <div className="comment-content">
                  <div className="comment-name">{comment.name}</div>
                  <div className="comment-text">{comment.text}</div>
                  <div className="comment-time">{ timeFun(comment.timestamp)}</div>
                </div>
                                     
              </div>
              <Line direction="H" length="100%" thickness="0.5px" color="#b6b6b6ff"/>
             </div>
              
            ))}
          </div>

          {comments.length > 1 && (
            <div className="view-more-section">
              <button 
                className="view-more-btn"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? "view less comments ↑" : "view more comments ↓"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Comment Input */}
      <div className="comment-input-section">
        <input
          type="text"
          className="comment-input comment-text-input"
          placeholder="Add your comment here ..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <input
          type="text"
          className="comment-input comment-name-input"
          placeholder="your name ..."
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className="comment-send-btn" onClick={handleSubmit}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22 2L11 13"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M22 2L15 22L11 13L2 9L22 2Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}