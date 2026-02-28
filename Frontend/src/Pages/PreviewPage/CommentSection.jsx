import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateNews } from "../Slice/newsformslice.js";
import { updateNews as updateNewsApi } from "../../Api/newsApi.js";
import "./Previewpge.scss";
import timeFun from "../Newspaper/Containers_/timeFun.js";
import Line from "../Newspaper/Components/Line.jsx";

export default function CommentSection({ newsId, comments = [] }) {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.newsform?.language || "ta");
  const [commentText, setCommentText] = useState("");
  const [userName, setUserName] = useState("");
  const [showAll, setShowAll] = useState(false);
  const isEnglish = language === "en";

  const headerText = isEnglish
    ? `This article has ${comments.length} comment${comments.length === 1 ? "" : "s"}.`
    : `இந்த செய்திக்கு ${comments.length} பேர் கருத்து தெரிவித்துள்ளனர்.`;
  const viewMoreText = isEnglish ? "View more comments ↓" : "மேலும் கருத்துகளை காண்க ↓";
  const viewLessText = isEnglish ? "View less comments ↑" : "குறைந்த கருத்துகளை காண்க ↑";
  const commentPlaceholder = isEnglish
    ? "Type your comment here..."
    : "உங்கள் கருத்தை இங்கே சேர்க்கவும் ...";
  const namePlaceholder = isEnglish ? "Your name..." : "உங்கள் பெயர் ...";
  const loginAlert = isEnglish
    ? "Please log in to post comments."
    : "கருத்துகளை பதிவிட உள்நுழையவும்.";
  const saveFailAlert = isEnglish
    ? "Failed to save comment. Check the server and try again."
    : "கருத்தை சேமிக்க முடியவில்லை. சர்வரை சரிபார்த்து மீண்டும் முயற்சிக்கவும்.";

  const handleSubmit = async () => {
    if (commentText.trim() && userName.trim()) {
      const token = localStorage.getItem("userToken");
      if (!token) {
        alert(loginAlert);
        return;
      }
      const newComment = {
        id: Date.now(),
        name: userName.trim(),
        text: commentText.trim(),
        timestamp: new Date().toLocaleString()
      };

      const nextComments = [...comments, newComment];

      try {
        await updateNewsApi(newsId, { comments: nextComments });
        dispatch(updateNews({ id: newsId, updatedNews: { comments: nextComments } }));
        setCommentText("");
        setUserName("");
      } catch (error) {
        console.error("Failed to save comment:", error);
        alert(saveFailAlert);
      }
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
        <h3>{headerText}</h3>
      </div>

      {/* Comments Display */}
      {comments.length > 0 && (
        <div className="comments-display-box">
          <div className="comments-list">
            {displayedComments.map((comment, index) => (
              <div key={comment.id || index}>
                <div className="comment-item">
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
                {showAll ? viewLessText : viewMoreText}
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
          placeholder={commentPlaceholder}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <input
          type="text"
          className="comment-input comment-name-input"
          placeholder={namePlaceholder}
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



