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
      const data = res.data.profile;

      setProfile(data);
      setForm({
        name: data.name || "",
        bio: data.bio || "",
        gender: data.gender || "",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    await api.post("/profile/edit-profile", form);
    setEditMode(false);
    fetchProfile();
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;

    const formData = new FormData();
    formData.append("avatar", avatarFile);

    await api.post("/profile/upload-avatar", formData);
    fetchProfile();
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef2ff] via-white to-[#fdf2f8]">

      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-white shadow-sm p-5 flex-col gap-6">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-pink-500 text-transparent bg-clip-text">
          Momentia
        </h1>

        <nav className="flex flex-col gap-4 text-gray-600">
          <span>🏠 Home</span>
          <span>🔍 Explore</span>
          <span>🎬 Reels</span>
          <span>💬 Messages</span>
          <span className="font-semibold text-purple-500">👤 Profile</span>
        </nav>
      </div>

      {/* MAIN */}
      <div className="md:ml-64 p-4 md:p-8">

        {/* PROFILE CARD */}
        <div className="bg-white/80 backdrop-blur rounded-3xl shadow p-6">

          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">

            {/* AVATAR */}
            <div className="relative">
              <div className="p-[3px] rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                <img
                  src={
                    profile?.profilePicture?.profileView ||
                    "https://via.placeholder.com/150"
                  }
                  className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover border-4 border-white"
                />
              </div>

              <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>

              {editMode && (
                <>
                  <input
                    type="file"
                    onChange={(e) => setAvatarFile(e.target.files[0])}
                    className="mt-2 text-xs"
                  />
                  <button
                    onClick={handleAvatarUpload}
                    className="text-xs text-blue-500"
                  >
                    Upload
                  </button>
                </>
              )}
            </div>

            {/* INFO */}
            <div className="flex-1 w-full text-center md:text-left">

              <div className="flex flex-col md:flex-row items-center gap-3">

                {editMode ? (
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="border px-3 py-1 rounded-lg text-xl font-semibold"
                  />
                ) : (
                  <h2 className="text-2xl font-bold">{profile.name}</h2>
                )}

                <button
                  onClick={() => setEditMode(!editMode)}
                  className="px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm"
                >
                  {editMode ? "Cancel" : "Edit Profile"}
                </button>
              </div>

              {/* STATS */}
              <div className="flex justify-center md:justify-start gap-6 mt-4 text-sm">
                <span><b>{profile?.totalPosts || 0}</b> Moments</span>
                <span><b>{profile?.followers || 0}</b> Connections</span>
                <span><b>{profile?.following || 0}</b> Following</span>
              </div>

              {/* BIO */}
              <div className="mt-3 text-sm">
                {editMode ? (
                  <>
                    <textarea
                      name="bio"
                      value={form.bio}
                      onChange={handleChange}
                      className="w-full border rounded-lg p-2"
                    />
                  </>
                ) : (
                  <p>{profile.bio || "No bio yet"}</p>
                )}
              </div>

            </div>
          </div>

          {/* HIGHLIGHTS */}
          <div className="flex gap-4 mt-6 overflow-x-auto">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-400 via-purple-500 to-pink-500 p-[2px]">
                  <div className="w-full h-full bg-white rounded-full"></div>
                </div>
                <p className="text-xs mt-1">Story</p>
              </div>
            ))}
          </div>
        </div>

        {/* POSTS */}
        <div className="mt-6 grid grid-cols-3 gap-2 md:gap-4">
          {profile?.posts?.length > 0 ? (
            profile.posts.map((post, i) => (
              <div key={i} className="aspect-square overflow-hidden rounded-lg">
                <img
                  src={post.imageUrl}
                  className="w-full h-full object-cover hover:scale-105 transition"
                />
              </div>
            ))
          ) : (
            <p className="col-span-3 text-center text-gray-400">
              No moments yet
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;