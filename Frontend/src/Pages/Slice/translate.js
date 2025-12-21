import axios from "axios";

export const translateToEnglish = async (text) => {
  const res = await axios.post("https://libretranslate.com/translate", {
    q: text,
    source: "ta",
    target: "en",
    format: "text"
  });

  return res.data.translatedText;
};
