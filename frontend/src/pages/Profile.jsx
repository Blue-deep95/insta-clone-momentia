import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useSelector } from "react-redux";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

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
      setLoading(true);
      setError("");

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
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchProfile();
  }, [user]);

  // ✅ Handle Input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Update Profile
  const handleUpdate = async () => {
    try {
      setUpdating(true);
      setError("");

      await api.post("/profile/edit-profile", form);

      setEditMode(false);
      fetchProfile();
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  // ✅ Upload Avatar
  const handleAvatarUpload = async () => {
    if (!avatarFile) return;

    const formData = new FormData();
    formData.append("avatar", avatarFile);

    try {
      setUpdating(true);
      setError("");

      await api.post("/profile/upload-avatar", formData);

      setAvatarFile(null);
      fetchProfile();
    } catch (err) {
      setError("Upload failed");
    } finally {
      setUpdating(false);
    }
  };

  // ⏳ Loading
  if (loading) {
    return <p className="text-center mt-10">Loading profile...</p>;
  }

  // ❌ Error
  if (error && !profile) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-500">{error}</p>
        <button
          onClick={fetchProfile}
          className="mt-3 px-4 py-2 bg-purple-500 text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 md:px-20 py-10">

      {/* TOP SECTION */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-10">

        {/* Avatar */}
        <div className="flex flex-col items-center">
          <img
            src={
              profile?.profilePicture?.profileView ||
              "https://via.placeholder.com/150"
            }
            alt="avatar"
            className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border"
          />

          {editMode && (
            <>
              <input
                type="file"
                onChange={(e) => setAvatarFile(e.target.files[0])}
                className="mt-3 text-xs"
              />

              <button
                onClick={handleAvatarUpload}
                disabled={!avatarFile}
                className="mt-2 text-sm text-blue-500"
              >
                Upload
              </button>
            </>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1 w-full">

          {/* Username + Buttons */}
          <div className="flex flex-col md:flex-row md:items-center gap-4">

            {editMode ? (
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="border px-3 py-1 rounded-lg text-xl font-semibold"
              />
            ) : (
              <h2 className="text-2xl font-semibold">{profile?.name}</h2>
            )}

            <div className="flex gap-3">
              {editMode ? (
                <>
                  <button
                    onClick={handleUpdate}
                    disabled={updating}
                    className="px-4 py-1 bg-blue-500 text-white rounded-md text-sm"
                  >
                    {updating ? "Saving..." : "Save"}
                  </button>

                  <button
                    onClick={() => setEditMode(false)}
                    className="px-4 py-1 bg-gray-300 rounded-md text-sm"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setEditMode(true)}
                    className="px-4 py-1 bg-gray-200 rounded-md text-sm font-medium"
                  >
                    Edit profile
                  </button>

                  <button className="px-4 py-1 bg-gray-200 rounded-md text-sm font-medium">
                    View archive
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-4 text-sm">
            <p>
              <span className="font-semibold">{profile?.totalPosts || 0}</span>{" "}
              posts
            </p>
            <p>
              <span className="font-semibold">{profile?.followers || 0}</span>{" "}
              followers
            </p>
            <p>
              <span className="font-semibold">{profile?.following || 0}</span>{" "}
              following
            </p>
          </div>

          {/* Bio */}
          <div className="mt-4 text-sm">

            {editMode ? (
              <>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2"
                />

                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="mt-2 border px-2 py-1 rounded"
                >
                  <option value="">Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </>
            ) : (
              <>
                <p className="font-semibold">{profile?.name}</p>
                <p className="whitespace-pre-line">
                  {profile?.bio || "No bio yet"}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* POSTS */}
      <div className="mt-10 border-t pt-6">
        <div className="grid grid-cols-3 gap-1 md:gap-4">

          {profile?.posts?.length > 0 ? (
            profile.posts.map((post, i) => (
              <div key={i} className="aspect-square bg-gray-200">
                <img
                  src={post.imageUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center col-span-3">
              No posts yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;