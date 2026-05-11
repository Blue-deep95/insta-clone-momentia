import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";


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

  if (loading) return <p className="mt-10 text-center">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef2ff] via-white to-[#fdf2f8]">

     {/* RIGHT SIDEBAR (Desktop only) */}
             <div className="hidden flex-shrink-0 lg:block">
               <Sidebar />
             </div>

      {/* MAIN */}
      <div className="mt-10 p-4 md:ml-64 md:p-8">

        {/* PROFILE CARD */}
        <div className="rounded-3xl bg-white/80 p-6 shadow backdrop-blur">

          <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">

            {/* AVATAR */}
            <div className="relative">
              <div className="rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-[3px]">
                <img
                  src={
                    profile?.profilePicture?.profileView ||
                    "https://via.placeholder.com/150"
                  }
                  className="h-28 w-28 rounded-full border-4 border-white object-cover md:h-36 md:w-36"
                />
              </div>

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
            <div className="w-full flex-1 text-center md:text-left">

              <div className="flex flex-col items-center gap-3 md:flex-row">

                {editMode ? (
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="rounded-lg border px-3 py-1 text-xl font-semibold"
                  />
                ) : (
                  <h2 className="text-2xl font-bold">{profile.name}</h2>
                )}

                <button
                  onClick={() => setEditMode(!editMode)}
                  className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-1 text-sm text-white"
                >
                  {editMode ? "Cancel" : "Edit Profile"}
                </button>
              </div>

              {/* STATS */}
              <div className="mt-4 flex justify-center gap-6 text-sm md:justify-start">
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
                      className="w-full rounded-lg border p-2"
                    />
                  </>
                ) : (
                  <p>{profile.bio || "No bio yet"}</p>
                )}
              </div>

            </div>
          </div>

        </div>

        {/* POSTS */}
        <div className="mt-6 grid grid-cols-3 gap-2 md:gap-4">
          {profile?.posts?.length > 0 ? (
            profile.posts.map((post, i) => (
              <div key={i} className="aspect-square overflow-hidden rounded-lg">
                <img
                  src={post.imageUrl}
                  className="h-full w-full object-cover transition hover:scale-105"
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