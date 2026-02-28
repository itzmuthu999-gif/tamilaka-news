import React from "react";
import { useSelector } from "react-redux";
import PreviewPage from "../PreviewPage/PreviewPage";

export default function NewsPageEdit() {
  const allNews = useSelector((state) => state.newsform.allNews || []);

  const forcedNewsId = allNews.length > 0 ? allNews[0].id : null;

  return <PreviewPage forcedNewsId={forcedNewsId} editMode={true} />;
}
