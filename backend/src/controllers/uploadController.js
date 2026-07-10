const isRealCloudinary = () =>
  !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

exports.uploadInfo = (_req, res) => {
  if (isRealCloudinary()) {
    return res.json({
      mode: 'cloudinary',
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET || 'agroconnect_unsigned',
    });
  }
  res.json({
    mode: 'passthrough',
    note: 'Cloudinary keys not configured. Frontend should collect a public image URL from the user instead of uploading a file.',
  });
};
