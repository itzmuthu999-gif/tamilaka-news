export const uploadVideo = (req, res) => {
  const videoFile = req.files?.video?.[0] || null;
  const thumbnailFile = req.files?.thumbnail?.[0] || null;

  if (!videoFile || !thumbnailFile) {
    return res.status(400).json({ message: "Video and thumbnail are required." });
  }

  const baseUrl = `${req.protocol}://${req.get("host")}`;

  return res.json({
    videoUrl: `${baseUrl}/uploads/videos/${videoFile.filename}`,
    thumbnailUrl: `${baseUrl}/uploads/thumbnails/${thumbnailFile.filename}`,
  });
};
