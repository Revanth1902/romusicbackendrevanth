import React, { useState, useEffect } from "react";
import "./admin.css"; // Import CSS for styling

const AdminDashboard = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [songUrl, setSongUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploads, setUploads] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [songFile, setSongFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Upload image to Cloudinary
      const imageFormData = new FormData();
      imageFormData.append("file", imageFile);
      imageFormData.append("upload_preset", "ml_default");

      // No need to specify upload preset for unsigned upload
      const imageResponse = await fetch(
        "https://api.cloudinary.com/v1_1/dta5aowzh/image/upload",
        {
          method: "POST",
          body: imageFormData,
        }
      );

      const imageData = await imageResponse.json();
      setImageUrl(imageData.secure_url);

      // Upload other data along with image and song URL to your backend API
      const response = await fetch(
        "https://popularbeatsbackend.onrender.com/api/songs",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            description,
            imageUrl: imageData.secure_url,
            url: songUrl,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to upload file");
      }
      console.log("Upload successful");
      setName("");
      setDescription("");
      setImageUrl("");
      setSongUrl("");
      fetchUploads(); // Fetch uploads again after successful upload
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

  const UploadList = ({ uploads }) => {
    return (
      <div className="upload-list">
        <h2>Existing Uploads</h2>
        <table>
          <thead>
            <tr>
              <th>Image </th>
              <th>Name</th>
              <th>Description</th>

              <th>Song URL</th>
            </tr>
          </thead>
          <tbody>
            {uploads.map((upload) => (
              <tr key={upload.id}>
                <td>
                  <img style={{width:"100px" , height:"100px"}} src={upload.imageUrl} alt={upload.name}/>
                </td>
                <td>{upload.name}</td>
                <td>{upload.description}</td>

                <td>
                  <a href={upload.url}>{upload.url}</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  useEffect(() => {
    fetchUploads();
  }, []);

  const fetchUploads = async () => {
    try {
      const response = await fetch(
        "https://popularbeatsbackend.onrender.com/api/songs"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch uploads");
      }
      const data = await response.json();
      setUploads(data);
    } catch (error) {
      console.error("Error fetching uploads:", error);
    }
  };

  return (
    <div className="admin-dashboard">
      <header>
        <img src="/imageinlogo.jpg" alt="Logo" />
        <h1>Admin Dashboard for PopularBeats</h1>
      </header>
      <main>
        <div className="upload-form">
          <h2>Add New Upload</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Image:</label>
              <input
                type="file"
                onChange={(e) => setImageFile(e.target.files[0])}
                accept="image/*"
                required
              />
            </div>
            <div className="form-group">
              <label>Song URL:</label>
              <input
                type="text"
                value={songUrl}
                onChange={(e) => setSongUrl(e.target.value)}
                required
              />
            </div>
            <button type="submit">{loading ? "Uploading..." : "Upload"}</button>
          </form>
        </div>
        <UploadList uploads={uploads} />
      </main>
      <footer>
        <p>&copy; 2024 ROL softwares</p>
      </footer>
    </div>
  );
};

export default AdminDashboard;
