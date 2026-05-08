import React, { useState, useRef } from "react";
import api from "../services/api.js";

const CreatePost = () => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);

  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Submit post
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please select an image");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("caption", caption);
      formData.append("images", image);

      const res = await api.post("/post/upload-post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert(res.data.message);

      // Reset
      setCaption("");
      setImage(null);
      setPreview("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">

      <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-xl">

        {/* HEADER */}
        <div className="mb-6">
          <h2 className="text-3xl font-semibold text-gray-800">
            Create Post
          </h2>

          <p className="mt-1 text-gray-500">
            Share your favorite moments with the world
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* IMAGE PREVIEW */}
          {preview && (
            <div className="h-[400px] w-full overflow-hidden rounded-2xl border">
              <img
                src={preview}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {/* FILE INPUT */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Upload Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="w-full rounded-xl border border-gray-300 p-3"
            />
          </div>

          {/* CAPTION */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Caption
            </label>

            <textarea
              rows="4"
              placeholder="Write a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full resize-none rounded-xl border border-gray-300 p-4 outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 py-4 text-lg font-semibold text-white transition hover:opacity-90"
          >
            {loading ? "Posting..." : "Share Post"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default CreatePost;