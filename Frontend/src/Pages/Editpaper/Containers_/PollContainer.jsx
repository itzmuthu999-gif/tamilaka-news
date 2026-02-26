import React, { useState } from "react";
import { IoIosClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import {
  updatePollData,
  removePollFromSlot,
  removePollFromNestedSlot,
  removeSlotFromContainer,
  removeSlotFromNestedContainer,
} from "../../Slice/editpaperSlice/editpaperslice";
import { FaPaperPlane, FaPlus } from "react-icons/fa";

const PollContainer = ({
  border = false,
  onDelete,
  slotId,
  catName,
  containerId,
  isNested = false,
  parentContainerId = null,
}) => {
  const dispatch = useDispatch();
  
  const pollData = useSelector((state) => {
    const page = state.editpaper.pages.find((p) => p.catName === catName);
    
    if (isNested && parentContainerId) {
      const nestedCont = page?.containers.find((c) => c.id === parentContainerId)
        ?.nestedContainers?.find((nc) => nc.id === containerId);
      const item = nestedCont?.items?.find((i) => i.slotId === slotId);
      return item?.pollData || null;
    } else {
      const container = page?.containers.find((c) => c.id === containerId);
      const item = container?.items.find((i) => i.slotId === slotId);
      return item?.pollData || null;
    }
  });

  const [showCreateModal, setShowCreateModal] = useState(!pollData);
  const [question, setQuestion] = useState(pollData?.question || "");
  const [options, setOptions] = useState(pollData?.options || [
    { text: "", votes: 0 },
    { text: "", votes: 0 }
  ]);
  const [allowMultiple, setAllowMultiple] = useState(pollData?.allowMultiple || true);

  const handleAddOption = () => {
    if (options.length < 10) {
      setOptions([...options, { text: "", votes: 0 }]);
    }
  };

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index].text = value;
    setOptions(newOptions);
  };

  const handleCreatePoll = () => {
    if (!question.trim() || options.some(opt => !opt.text.trim())) {
      alert("Please fill in the question and all options");
      return;
    }

    const pollDataToSave = {
      question: question.trim(),
      options: options.map(opt => ({ text: opt.text.trim(), votes: opt.votes || 0 })),
      allowMultiple,
      totalVotes: options.reduce((sum, opt) => sum + (opt.votes || 0), 0)
    };

    dispatch(updatePollData({
      catName,
      containerId: isNested ? containerId : containerId,
      slotId,
      pollData: pollDataToSave,
      isNested,
      parentContainerId
    }));

    setShowCreateModal(false);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete?.();
  };

  const handleVote = (index) => {
    const newOptions = [...pollData.options];
    newOptions[index].votes += 1;
    const newTotalVotes = newOptions.reduce((sum, opt) => sum + opt.votes, 0);

    dispatch(updatePollData({
      catName,
      containerId,
      slotId,
      pollData: {
        ...pollData,
        options: newOptions,
        totalVotes: newTotalVotes
      },
      isNested,
      parentContainerId
    }));
  };

  const getPercentage = (votes) => {
    if (!pollData?.totalVotes) return 0;
    return Math.round((votes / pollData.totalVotes) * 100);
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "450px",
        minHeight: "200px",
        position: "relative",
        background: "#1a1a1a",
        borderRadius: "12px",
        padding: "20px",
        border: border ? "2px dotted #999" : "none",
      }}
    >
      <style>
        {`
          .poll-option-input {
            width: 100%;
            padding: 12px;
            background: transparent;
            border: none;
            border-bottom: 2px solid #e91e63;
            color: #999;
            font-size: 14px;
            outline: none;
            transition: all 0.3s;
          }
          
          .poll-option-input:focus {
            border-bottom-color: #ff4081;
            color: #fff;
          }
          
          .poll-option-input::placeholder {
            color: #666;
          }
          
          .poll-create-btn {
            background: #e91e63;
            border: none;
            border-radius: 50%;
            width: 56px;
            height: 56px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s;
            color: white;
            font-size: 20px;
            box-shadow: 0 4px 12px rgba(233, 30, 99, 0.4);
          }
          
          .poll-create-btn:hover {
            background: #c2185b;
            transform: scale(1.05);
            box-shadow: 0 6px 16px rgba(233, 30, 99, 0.6);
          }
          
          .poll-option-bar {
            position: relative;
            background: #2a2a2a;
            border-radius: 8px;
            overflow: hidden;
            margin-bottom: 12px;
            cursor: pointer;
            transition: all 0.3s;
          }
          
          .poll-option-bar:hover {
            transform: translateX(4px);
            box-shadow: 0 2px 8px rgba(233, 30, 99, 0.3);
          }
          
          .poll-option-fill {
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            background: #e91e63;
            transition: width 0.5s ease;
            z-index: 1;
          }
          
          .poll-option-content {
            position: relative;
            z-index: 2;
            padding: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .poll-option-text {
            color: white;
            font-size: 16px;
            font-weight: 500;
          }
          
          .poll-option-stats {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          
          .poll-percentage {
            font-size: 20px;
            font-weight: bold;
            color: white;
          }
          
          .poll-votes {
            font-size: 14px;
            color: #999;
          }
          
          .add-option-btn {
            width: 100%;
            padding: 12px;
            background: transparent;
            border: 2px dashed #444;
            border-radius: 8px;
            color: #666;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: all 0.3s;
            margin-top: 12px;
          }
          
          .add-option-btn:hover {
            border-color: #e91e63;
            color: #e91e63;
          }
          
          .remove-option-btn {
            background: transparent;
            border: none;
            color: #666;
            cursor: pointer;
            font-size: 20px;
            padding: 4px;
            transition: all 0.3s;
          }
          
          .remove-option-btn:hover {
            color: #f44336;
          }
          
          .toggle-switch {
            position: relative;
            display: inline-block;
            width: 48px;
            height: 24px;
          }
          
          .toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
          }
          
          .toggle-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #4a4a4a;
            transition: 0.4s;
            border-radius: 24px;
          }
          
          .toggle-slider:before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: 0.4s;
            border-radius: 50%;
          }
          
          input:checked + .toggle-slider {
            background-color: #e91e63;
          }
          
          input:checked + .toggle-slider:before {
            transform: translateX(24px);
          }
        `}
      </style>

      {border && (
        <button
          onDoubleClick={handleDelete}
          title="Double click to delete"
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            fontWeight: "bold",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "24px",
            color: "#f44336",
            zIndex: 100,
          }}
        >
          <IoIosClose />
        </button>
      )}

      {showCreateModal ? (
        <div>
          <div style={{ 
            fontSize: "18px", 
            fontWeight: "600", 
            color: "white",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <IoIosClose 
              style={{ fontSize: "24px", cursor: "pointer" }} 
              onClick={() => border && setShowCreateModal(false)}
            />
            Create poll
          </div>

          <div style={{ marginBottom: "24px" }}>
            <div style={{ 
              fontSize: "14px", 
              fontWeight: "600", 
              color: "white",
              marginBottom: "12px" 
            }}>
              Question
            </div>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask question"
              className="poll-option-input"
              style={{ borderBottom: "2px solid #e91e63" }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <div style={{ 
              fontSize: "14px", 
              fontWeight: "600", 
              color: "white",
              marginBottom: "12px" 
            }}>
              Options
            </div>
            {options.map((option, index) => (
              <div key={index} style={{ 
                marginBottom: "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder="Add text"
                  className="poll-option-input"
                />
                {options.length > 2 && (
                  <button
                    onClick={() => handleRemoveOption(index)}
                    className="remove-option-btn"
                  >
                    ≡
                  </button>
                )}
              </div>
            ))}
            
            {options.length < 10 && (
              <button
                onClick={handleAddOption}
                className="add-option-btn"
              >
                <FaPlus /> Add option
              </button>
            )}
          </div>

          <div style={{ 
            marginBottom: "24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <div style={{ 
              fontSize: "14px", 
              color: "white",
              fontWeight: "500"
            }}>
              Allow multiple answers
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={allowMultiple}
                onChange={(e) => setAllowMultiple(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div style={{ 
            display: "flex", 
            justifyContent: "flex-end",
            marginTop: "32px"
          }}>
            <button
              onClick={handleCreatePoll}
              className="poll-create-btn"
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div style={{ 
            fontSize: "20px", 
            fontWeight: "600", 
            color: "white",
            marginBottom: "24px" 
          }}>
            {pollData.question}
          </div>

          {pollData.options.map((option, index) => {
            const percentage = getPercentage(option.votes);
            return (
              <div
                key={index}
                className="poll-option-bar"
                onClick={() => handleVote(index)}
              >
                <div
                  className="poll-option-fill"
                  style={{ width: `${percentage}%` }}
                />
                <div className="poll-option-content">
                  <div className="poll-option-text">{option.text}</div>
                  <div className="poll-option-stats">
                    <div className="poll-percentage">{percentage}%</div>
                    <div className="poll-votes">{option.votes}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PollContainer;