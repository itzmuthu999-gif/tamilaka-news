const trash = useSelector((state) => state.newsform.trash);

return (
  <div>
    {trash.map((news) => (
      <div key={news.id}>
        <h3>{news.data.headline}</h3>

        <button onClick={() => dispatch(restoreNews(news.id))}>
          Restore
        </button>

        <button onClick={() => dispatch(permanentDelete(news.id))}>
          Delete Forever
        </button>
      </div>
    ))}
  </div>
);
