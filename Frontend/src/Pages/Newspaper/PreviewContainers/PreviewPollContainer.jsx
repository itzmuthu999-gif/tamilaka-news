import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePollData } from "../../Slice/editpaperSlice/editpaperslice";
import { saveLayout } from "../../../Api/layoutApi";

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
  const layoutState = useSelector((state) => state.editpaper);
  const hasMountedRef = useRef(false);
  const lastTotalVotesRef = useRef(null);

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

  const buildLayoutPayload = (state) => ({
    pages: state.pages,
    presetContainers: state.presetContainers,
    activePage: state.activePage,
    activeLineId: state.activeLineId,
  });

  useEffect(() => {
    if (!pollData) return;

    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      lastTotalVotesRef.current = pollData.totalVotes ?? 0;
      return;
    }

    if (pollData.totalVotes === lastTotalVotesRef.current) return;

    lastTotalVotesRef.current = pollData.totalVotes;

    const payload = buildLayoutPayload(layoutState);
    saveLayout(payload).catch((error) => {
      console.error("Failed to persist poll vote:", error);
    });
  }, [pollData?.totalVotes, layoutState]);

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
