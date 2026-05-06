import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useSelector } from "react-redux";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: "",
    bio: "",
    gender: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);

  // ✅ Fetch Profile
  const fetchProfile = async () => {
    try {
      const res = await api.get(`/profile/get-profile/${user.id}`);
      setProfile(res.data.profile);

      setForm({
        name: res.data.profile.name || "",
        bio: res.data.profile.bio || "",
        gender: res.data.profile.gender || "",
      });
    } catch (err) {
      console.error("Error fetching profile", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) fetchProfile();
  }, [user]);

  // ✅ Handle Edit Input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Update Profile
  const handleUpdate = async () => {
    try {
      await api.post("/profile/edit-profile", form);
      setEditMode(false);
      fetchProfile();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  // ✅ Upload Avatar
  const handleAvatarUpload = async () => {
    if (!avatarFile) return;

    const formData = new FormData();
    formData.append("avatar", avatarFile);

    try {
      await api.post("/profile/upload-avatar", formData);
      fetchProfile();
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-10">

      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-3xl p-6">

        {/* TOP SECTION */}
        <div className="flex flex-col md:flex-row items-center gap-6">

          {/* Avatar */}
          <div className="relative">
            <img
              src={
                profile?.profilePicture?.profileView ||
                "https://via.placeholder.com/150"
              }
              alt="avatar"
              className="w-32 h-32 rounded-full object-cover border"
            />

            {/* Upload */}
            <input
              type="file"
              onChange={(e) => setAvatarFile(e.target.files[0])}
              className="mt-2 text-sm"
            />

            <button
              onClick={handleAvatarUpload}
              className="mt-2 px-3 py-1 bg-purple-500 text-white rounded-lg text-sm"
            >
              Upload
            </button>
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">

            {editMode ? (
              <>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="border px-3 py-2 rounded-lg w-full mb-2"
                />

                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  className="border px-3 py-2 rounded-lg w-full mb-2"
                />

                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="border px-3 py-2 rounded-lg w-full mb-2"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>

                <button
                  onClick={handleUpdate}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg mr-2"
                >
                  Save
                </button>

                <button
                  onClick={() => setEditMode(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold">{profile.name}</h2>
                <p className="text-gray-500">{profile.bio}</p>
                <p className="text-sm text-gray-400">{profile.gender}</p>

                <button
                  onClick={() => setEditMode(true)}
                  className="mt-3 px-4 py-2 bg-purple-500 text-white rounded-lg"
                >
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </div>

        {/* STATS */}
        <div className="flex justify-around mt-6 text-center">
          <div>
            <p className="font-bold text-lg">0</p>
            <p className="text-gray-500 text-sm">Posts</p>
          </div>
          <div>
            <p className="font-bold text-lg">0</p>
            <p className="text-gray-500 text-sm">Followers</p>
          </div>
          <div>
            <p className="font-bold text-lg">0</p>
            <p className="text-gray-500 text-sm">Following</p>
          </div>
        </div>

        {/* POSTS GRID (dummy for now) */}
        <div className="grid grid-cols-3 gap-2 mt-6">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="bg-gray-300 h-32 rounded-lg"></div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Profile;