import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePollData } from "../../Slice/editpaperSlice/editpaperslice";

/**
 * PreviewPollContainer
 *
 * Read-only renderable poll for the public newspaper view.
 * - No close / edit controls.
 * - Options are clickable → dispatches a vote increment to Redux so the
 *   percentage + count updates instantly and persists in state.
 * - Supports both single and multiple-answer polls via allowMultiple.
 */
const PreviewPollContainer = ({
  catName,
  containerId,
  slotId,
  isNested = false,
  parentContainerId = null,
}) => {
  const dispatch = useDispatch();

  // Read poll data straight from Redux (same path used in the editor)
  const pollData = useSelector((state) => {
    const page = state.editpaper.pages.find((p) => p.catName === catName);

    if (isNested && parentContainerId) {
      const nestedCont = page?.containers
        .find((c) => c.id === parentContainerId)
        ?.nestedContainers?.find((nc) => nc.id === containerId);
      const item = nestedCont?.items?.find((i) => i.slotId === slotId);
      return item?.pollData || null;
    } else {
      const container = page?.containers.find((c) => c.id === containerId);
      const item = container?.items.find((i) => i.slotId === slotId);
      return item?.pollData || null;
    }
  });

  // Track which options the user has already voted on (local only, per session)
  const [votedIndices, setVotedIndices] = useState([]);
  const [revealed, setRevealed] = useState(false);

  if (!pollData) return null;

  const getPercentage = (votes) => {
    if (!pollData.totalVotes) return 0;
    return Math.round((votes / pollData.totalVotes) * 100);
  };

  const handleVote = (index) => {
    // If already voted on this option, do nothing
    if (votedIndices.includes(index)) return;

    // If single-answer and already voted, do nothing
    if (!pollData.allowMultiple && votedIndices.length > 0) return;

    const newOptions = pollData.options.map((opt, i) =>
      i === index ? { ...opt, votes: opt.votes + 1 } : opt
    );
    const newTotalVotes = newOptions.reduce((sum, opt) => sum + opt.votes, 0);

    dispatch(
      updatePollData({
        catName,
        containerId,
        slotId,
        pollData: {
          ...pollData,
          options: newOptions,
          totalVotes: newTotalVotes,
        },
        isNested,
        parentContainerId,
      })
    );

    const next = [...votedIndices, index];
    setVotedIndices(next);
    setRevealed(true);
  };

  const hasVoted = votedIndices.length > 0;

  return (
    <div className="preview-poll-wrapper">
      <style>{`
        .preview-poll-wrapper {
          width: 100%;
          max-width: 450px;
          min-height: 200px;
          background: #1a1a1a;
          border-radius: 12px;
          padding: 20px;
          box-sizing: border-box;
        }

        .preview-poll-question {
          font-size: 20px;
          font-weight: 600;
          color: white;
          margin-bottom: 24px;
          line-height: 1.4;
        }

        .preview-poll-hint {
          font-size: 12px;
          color: #888;
          margin-bottom: 16px;
        }

        /* ── Unvoted state: plain clickable option ── */
        .preview-poll-option-unvoted {
          position: relative;
          background: #2a2a2a;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 12px;
          cursor: pointer;
          transition: all 0.25s ease;
          border: 2px solid transparent;
        }

        .preview-poll-option-unvoted:hover {
          border-color: #e91e63;
          transform: translateX(4px);
        }

        .preview-poll-option-unvoted-content {
          padding: 16px;
          color: white;
          font-size: 16px;
          font-weight: 500;
        }

        /* ── Voted state: animated bar behind content ── */
        .preview-poll-option-voted {
          position: relative;
          background: #2a2a2a;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 12px;
          transition: all 0.25s ease;
          cursor: default;
        }

        .preview-poll-option-voted.is-chosen {
          box-shadow: 0 0 0 2px #e91e63;
        }

        .preview-poll-fill {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          background: #e91e63;
          transition: width 0.6s ease;
          z-index: 1;
        }

        .preview-poll-option-voted-content {
          position: relative;
          z-index: 2;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .preview-poll-option-text {
          color: white;
          font-size: 16px;
          font-weight: 500;
        }

        .preview-poll-stats {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .preview-poll-pct {
          font-size: 20px;
          font-weight: bold;
          color: white;
        }

        .preview-poll-count {
          font-size: 13px;
          color: #bbb;
        }

        .preview-poll-total {
          font-size: 12px;
          color: #666;
          margin-top: 12px;
          text-align: right;
        }
      `}</style>

      <div className="preview-poll-question">{pollData.question}</div>

      {!hasVoted && (
        <div className="preview-poll-hint">
          {pollData.allowMultiple ? "Choose one or more options" : "Choose one option"}
        </div>
      )}

      {pollData.options.map((option, index) => {
        const pct = getPercentage(option.votes);
        const isChosen = votedIndices.includes(index);

        if (!revealed) {
          // Before any vote — show clean clickable buttons
          return (
            <div
              key={index}
              className="preview-poll-option-unvoted"
              onClick={() => handleVote(index)}
            >
              <div className="preview-poll-option-unvoted-content">
                {option.text}
              </div>
            </div>
          );
        }

        // After voting — show bars + percentage + count
        return (
          <div
            key={index}
            className={`preview-poll-option-voted${isChosen ? " is-chosen" : ""}`}
            onClick={() => handleVote(index)}
            style={{ cursor: pollData.allowMultiple && !isChosen ? "pointer" : "default" }}
          >
            <div
              className="preview-poll-fill"
              style={{ width: `${pct}%` }}
            />
            <div className="preview-poll-option-voted-content">
              <div className="preview-poll-option-text">{option.text}</div>
              <div className="preview-poll-stats">
                <div className="preview-poll-pct">{pct}%</div>
                <div className="preview-poll-count">{option.votes}</div>
              </div>
            </div>
          </div>
        );
      })}

      {revealed && (
        <div className="preview-poll-total">
          {pollData.totalVotes} vote{pollData.totalVotes !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
};

export default PreviewPollContainer;