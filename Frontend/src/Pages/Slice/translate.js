import axios from "axios";

export const translateToEnglish = async (text) => {
  const str = text != null ? String(text).trim() : "";
  if (!str) return "";
  const res = await axios.post("https://libretranslate.com/translate", {
    q: str,
    source: "ta",
    target: "en",
    format: "text"
  });
  return res.data.translatedText;
};
