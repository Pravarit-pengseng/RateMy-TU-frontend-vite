// src/components/ImageUpload.js
import React, { useState } from 'react';
// import axios from 'axios';
import { uploadImage } from '../Function/profile';

function ImageUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadedImageUrl(''); // เคลียร์รูปเก่า
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setUploading(true);
    setError('');

    // เราต้องใช้ FormData เพื่อส่งไฟล์
    const formData = new FormData();
    formData.append('image', file); // 'image' ต้องตรงกับที่ multer ตั้งไว้ (upload.single('image'))

    try {
      // ส่ง request ไปยัง backend
      const response = await uploadImage(formData);

      // รับ URL ที่ได้จาก backend
      setUploadedImageUrl(response.data.imageUrl);
      console.log('File uploaded:', response.data.imageUrl);
      // ณ จุดนี้ คุณอาจจะบันทึก URL นี้ลง state หรือ context ของ React
      
    } catch (err) {
      console.error('Error uploading file:', err);
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h3>Upload Image 📁</h3>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept="image/*" />
        <button type="submit" disabled={uploading || !file}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {uploadedImageUrl && (
        <div>
          <h4>Upload Successful!</h4>
          <img src={uploadedImageUrl} alt="Uploaded" style={{ width: '300px' }} />
          <p>URL: {uploadedImageUrl}</p>
        </div>
      )}
    </div>
  );
}

export default ImageUpload;