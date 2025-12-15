// Container 1: News 8 - Headline with image on right
const NewsContainer8 = ({ image, headline,time }) => (
  <div className="ep-nm-news-8">
    <div className="ep-nm8-sbc">
      <div className="epnn8-hdln">{headline}</div>
       <div className="epn-tm">{time}</div>
    </div>
    <div className="epnn8-img">
      <img src={image} alt="" />
    </div>
    
  </div>
);

// Container 2: News 7 - Image on left, headline on right
const NewsContainer7 = ({ image, headline,time }) => (
  <div className="ep-nm-news-7">
    <div className="epnn7-img">
      <img src={image} alt="" />
    </div>
    <div className="ep-nm7-sbc">
      <div className="epnn7-hdln">{headline}</div>
             <div className="epn-tm">{time}</div>
    </div>
  </div>
);

// Container 3: News 3 - Image on left, long content on right
const NewsContainer3 = ({ image, content,time }) => (
  <div className="ep-nm-news-3">
    <div className="epnn3-img">
      <img src={image} alt="" />
    </div>
    <div className="ep-nm3-sbc">
      <div className="epnn3-onln">{content}</div>
                   <div className="epn-tm">{time}</div>
    </div>
  </div>
);

// Container 4: News 4 - Content on left with time, image on right
const NewsContainer4 = ({ image, content, time }) => (
  <div className="ep-nm-news-4">
    <div className="ep-nm4-sbc">
      <div className="epnn4-onln">{content}</div>
      <div className="epn-tm">{time}</div>
    </div>
    <div className="epnn4-img">
      <img src={image} alt="" />
    </div>
  </div>
);

// Container 5: News 5 - Image on left, headline and time on right
const NewsContainer5 = ({ image, headline, time }) => (
  <div className="ep-nm-news-5">
    <div className="epnn5-img">
      <img src={image} alt="" />
    </div>
    <div className="ep-nm5-sbc">
      <div className="epbn5-hdln">{headline}</div>
      <div className="epn-tm">{time}</div>
    </div>
  </div>
);

// Container 6: News 6 - Headline and time on left, image on right
const NewsContainer6 = ({ image, headline, time }) => (
  <div className="ep-nm-news-6">
    <div className="ep-nm6-sbc">
      <div className="epbn6-hdln">{headline}</div>
      <div className="epn-tm">{time}</div>
    </div>
    <div className="epnn6-img">
      <img src={image} alt="" />
    </div>
  </div>
);

// Container 7: News 2.1 - Headline, content, time on left, image on right
// const NewsContainer21 = ({ image, headline, content, time }) => (
//   <div className="ep-nm2-news-1">
//     <div className="ep-nm21-sbc">
//       <div className="epbn21-hdln">{headline}</div>
//       <div className="epnn21-onln">{content}</div>
//       <div className="epn-tm">{time}</div>
//     </div>
//     <div className="epnn21-img">
//       <img src={image} alt="" />
//     </div>
//   </div>
// );

// Container 8: News 2.2 - Headline on top, content and image side by side
const NewsContainer21 = ({ image, headline, content, time }) => (
  <div className="ep-nm2-news-2">
    <div className="epbn22-hdln">{headline}</div>
    <div className="ep-nm22-sbc">
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <div className="epnn22-onln">{content}</div>
        <div className="epn-tm">{time}</div>
      </div>
      <div className="epnn22-img">
        <img src={image} alt="" />
      </div>
    </div>
  </div>
);

// Container 9: News 2.3 - Headline on top, image and content side by side
const NewsContainer22 = ({ image, headline, content, time }) => (
  <div className="ep-nm2-news-3">
    <div className="epbn23-hdln">{headline}</div>
    <div className="ep-nm23-sbc">
      <div className="epnn23-img">
        <img src={image} alt="" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <div className="epnn23-onln">{content}</div>
        <div className="epn-tm">{time}</div>
      </div>
    </div>
  </div>
);

// Container 10: News 1 - Image on left, headline, content, time on right
const NewsContainer1 = ({ image, headline, content, time }) => (
  <div className="ep-nm-news-1">
    <div className="epnn1-img">
      <img src={image} alt="" />
    </div>
    <div className="ep-nm1-sbc">
      <div className="epnn1-hdln">{headline}</div>
      <div className="epnn1-onln">{content}</div>
      <div className="epn-tm">{time}</div>
    </div>
  </div>
);

// Container 11: Big News 2 - Image on left, headline and content on right (400px width)
const BigNewsContainer2V1 = ({ image, headline, content, time }) => (
  <div className="ep-bg-news-2">
    <div className="epbn2-img">
      <img src={image} alt="" />
    </div>
    <div style={{ width: "400px" }}>
      <div className="epbn2-hdln">{headline}</div>
      <div className="epbn2-onln">{content}</div>
      <div className="epn-tm">{time}</div>
    </div>
  </div>
);
const BigNewsContainer5V1 = ({ image, headline, content, time }) => (
  <div className="ep-bg-news5-1">

    <div style={{ width: "400px" }}>
      <div className="epbn51-hdln">Head{headline}</div>
      <div className="epbn51-onln">{content}</div>
      <div className="epn-tm">{time}</div>
    </div>
        <div className="epbn51-img">
      <img src={image} alt="" />
    </div>
  </div>
);
const BigNewsContainer5V2 = ({ image, headline, content, time }) => (
  <div className="ep-bg-news5-1">
      <div className="epbn51-img">
      <img src={image} alt="" />
    </div>
    <div style={{ width: "400px" }}>
      <div className="epbn51-hdln">Head{headline}</div>
      <div className="epbn51-onln">{content}</div>
      <div className="epn-tm">{time}</div>
    </div>

  </div>
);
// Container 12: News 2 - Headline, content, time on left, image on right
const NewsContainer2 = ({ image, headline, content, time }) => (
  <div className="ep-nm-news-2">
    <div className="ep-nm2-sbc">
      <div className="epnn2-hdln">{headline}</div>
      <div className="epnn2-onln">{content}</div>
      <div className="epn-tm">{time}</div>
    </div>
    <div className="epnn2-img">
      <img src={image} alt="" />
    </div>
  </div>
);

// Container 13: Big News 1 (Version 1) - Image, headline, content, time stacked
const BigNewsContainer1V1 = ({ image, headline, content, time }) => (
  <div className="ep-bg-news-1">
    <div className="epbn1-img">
      <img src={image} alt="" />
    </div>
    <div className="epbn1-hdln">{headline}</div>
    <div className="epbn1-onln">{content}</div>
    <div className="epn-tm">{time}</div>
  </div>
);

// Container 14: Big News 1 (Version 2) - Headline, image, content, time stacked
const BigNewsContainer1V2 = ({ image, headline, content, time }) => (
  <div className="ep-bg-news-1">
    <div className="epbn1-hdln">{headline}</div>
    <div className="epbn1-img">
      <img src={image} alt="" />
    </div>
    <div className="epbn1-onln">{content}</div>
    <div className="epn-tm">{time}</div>
  </div>
);
const BigNewsContainer1V3 = ({ image, headline, content, time }) => (
  <div className="ep-bg-news-1">
    <div className="epbn1-hdln">{headline}</div>
     <div className="epbn1-onln">{content}</div>
    <div className="epbn1-img">
      <img src={image} alt="" />
    </div>
   
    <div className="epn-tm">{time}</div>
  </div>
);

// Container 15: Big News 2 (Reversed) - Content on left (400px), image on right
const BigNewsContainer2V2 = ({ image, headline, content, time }) => (
  <div className="ep-bg-news-2">
    <div style={{ width: "400px" }}>
      <div className="epbn2-hdln">{headline}</div>
      <div className="epbn2-onln">{content}</div>
      <div className="epn-tm">{time}</div>
    </div>
    <div className="epbn2-img">
      <img src={image} alt="" />
    </div>
  </div>
);


// Container 16: Big News 3 (Version 1) - Headline, image, content, time stacked
const BigNewsContainer3V1 = ({ image, headline, content, time }) => (
  <div className="ep-bg-news-3">
    <div className="epbn3-hdln">{headline}</div>
    <div className="epbn3-img">
      <img src={image} alt="" />
    </div>
    <div className="epbn3-onln">{content}</div>
    <div className="epn-tm">{time}</div>
  </div>
);
const BigNewsContainer3V3 = ({ image, headline, content, time }) => (
  <div className="ep-bg-news-3">
    <div className="epbn3-hdln">{headline}</div>
        <div className="epbn3-onln">{content}</div>
    <div className="epbn3-img">
      <img src={image} alt="" />
    </div>

    <div className="epn-tm">{time}</div>
  </div>
);

// Container 17: Big News 3 (Version 2) - Image, headline, content, time stacked
const BigNewsContainer3V2 = ({ image, headline, content, time }) => (
  <div className="ep-bg-news-3">
    <div className="epbn3-img">
      <img src={image} alt="" />
    </div>
    <div className="epbn3-hdln">{headline}</div>
    <div className="epbn3-onln">{content}</div>
    <div className="epn-tm">{time}</div>
  </div>
);

// Container 18: Big News 4 (Version 1) - Image, headline, time stacked
const BigNewsContainer4V1 = ({ image, headline, time }) => (
  <div className="ep-bg-news-4">
    <div className="epbn4-img">
      <img src={image} alt="" />
    </div>
    <div className="epbn4-hdln">{headline}</div>
    <div className="epn-tm">{time}</div>
  </div>
);

// Container 19: Big News 4 (Version 2) - Headline, time, image stacked
const BigNewsContainer4V2 = ({ image, headline, time }) => (
  <div className="ep-bg-news-4">
    <div className="epbn4-hdln">{headline}</div>
    
    <div className="epbn4-img">
      <img src={image} alt="" />
    </div>
    <div className="epn-tm">{time}</div>
  </div>
);


export const CONTAINER_MAP = {
  NewsContainer1,
  NewsContainer2,
  NewsContainer3,
  NewsContainer4,
  NewsContainer5,
  NewsContainer6,
  NewsContainer7,
  NewsContainer8,
  NewsContainer21,
  NewsContainer22,
  BigNewsContainer1V1,
  BigNewsContainer1V2,
  BigNewsContainer2V1,
  BigNewsContainer2V2,
  BigNewsContainer3V1,
  BigNewsContainer3V2,
  BigNewsContainer4V1,
  BigNewsContainer4V2,
};