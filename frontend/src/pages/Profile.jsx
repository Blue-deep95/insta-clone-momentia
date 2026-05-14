import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import FollowersModal from "../components/FollowersModal.jsx";
import FollowingModal from "../components/FollowingModal.jsx";
import FollowButton from "../components/FollowButton.jsx";

import {
  Camera,
  Heart,
  MapPin,
  Link2,
  Calendar,
  BadgeCheck,
  LayoutGrid,
  User,
  Images,
  Bookmark,
  ThumbsUp,
  Plus,
} from "lucide-react";

/* ─────────────────────────────────────────────
   TABS CONFIG
───────────────────────────────────────────── */
const TABS = [
  { key: "posts", label: "Posts", Icon: LayoutGrid },
  { key: "about", label: "About", Icon: User },
  { key: "photos", label: "Photos", Icon: Images },
  { key: "saved", label: "Saved", Icon: Bookmark },
  { key: "liked", label: "Liked", Icon: ThumbsUp },
];

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const { userId } = useParams();

  // Determine which user ID to fetch: the URL param or the current user
  const profileUserId = userId || user?.id || user?._id;
  const isOwnProfile = !userId || userId === user?.id || userId === user?._id;

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPrev, setAvatarPrev] = useState(null);

  const [saving, setSaving] = useState(false);

  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const [form, setForm] = useState({
    name: "",
    bio: "",
    gender: "",
  });

  /* FETCH PROFILE */
  const fetchProfile = async () => {
    try {
      const res = await api.get(`/profile/get-profile/${profileUserId}`);

      const data = res.data.profile;

      setProfile(data);
      
      // Check if current user is following this profile (for other users' profiles)
      if (res.data.following !== undefined) {
        setIsFollowing(res.data.following);
      }

      setForm({
        name: data.name || "",
        bio: data.bio || "",
        gender: data.gender || "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  /* FETCH POSTS */
  const fetchProfilePosts = async () => {
    try {
      const res = await api.get(`/profile/get-userposts/${profileUserId}`);

      setPosts(res.data.posts || []);
    } catch (err) {
      console.error("Failed to load profile posts:", err);
    }
  };

  /* LOAD */
  useEffect(() => {
    if (!profileUserId) return;

    const loadProfile = async () => {
      setLoading(true);

      await Promise.all([
        fetchProfile(),
        fetchProfilePosts(),
      ]);

      setLoading(false);
    };

    loadProfile();
  }, [profileUserId]);

  /* INPUT CHANGE */
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* AVATAR */
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setAvatarFile(file);
    setAvatarPrev(URL.createObjectURL(file));
  };

  /* SAVE */
  const handleSave = async () => {
    setSaving(true);

    try {
      await api.post("/profile/edit-profile", form);

      if (avatarFile) {
        const fd = new FormData();

        fd.append("avatar", avatarFile);

        await api.post("/profile/upload-avatar", fd);
      }

      setEditMode(false);

      setAvatarFile(null);
      setAvatarPrev(null);

      fetchProfile();
    } finally {
      setSaving(false);
    }
  };

  /* CANCEL */
  const handleCancel = () => {
    setEditMode(false);

    setAvatarFile(null);
    setAvatarPrev(null);

    setForm({
      name: profile?.name || "",
      bio: profile?.bio || "",
      gender: profile?.gender || "",
    });
  };

  /* LOADING */
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

          <p className="text-sm font-medium text-gray-400">
            Loading profile…
          </p>
        </div>
      </div>
    );
  }

  const avatarSrc =
    avatarPrev ||
    profile?.profilePicture?.profileView ||
    null;

  return (
    <div className="flex min-h-screen bg-white lg:pl-20">

      {/* SIDEBAR */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* BODY */}
      <div className="flex-1 p-3 md:p-5 lg:p-6">

        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl shadow-gray-200/60">

          <div className="px-4 pb-8 sm:px-6 md:px-8 lg:px-10">

            {/* PROFILE HEADER */}
            <div className="flex flex-col items-center gap-5 md:flex-row md:items-end md:justify-between">

              {/* LEFT */}
              <div className="flex flex-col items-center gap-4 md:flex-row md:items-end">

                {/* AVATAR */}
                <div className="relative flex-shrink-0">

                  <div className="rounded-full border-[5px] border-white shadow-2xl">

                    {avatarSrc ? (
                      <img
                        src={avatarSrc}
                        alt="profile"
                        className="h-24 w-24 rounded-full object-cover sm:h-28 sm:w-28 md:h-32 md:w-32 lg:h-36 lg:w-36"
                      />
                    ) : (
                      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200 sm:h-28 sm:w-28 md:h-32 md:w-32 lg:h-36 lg:w-36">

                        <span className="text-3xl font-bold text-blue-500 md:text-4xl">
                          {profile?.name?.[0] || "U"}
                        </span>

                      </div>
                    )}

                  </div>

                  {editMode && (
                    <label className="absolute bottom-1 right-1 cursor-pointer rounded-full bg-white p-2 shadow-lg ring-2 ring-gray-100 transition hover:bg-gray-50">

                      <Camera
                        size={15}
                        className="text-gray-600"
                      />

                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleAvatarChange}
                      />

                    </label>
                  )}

                </div>

                {/* INFO */}
                <div className="mb-1 text-center md:text-left">

                  {/* NAME */}
                  {editMode ? (
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-xl font-bold text-gray-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 md:text-2xl"
                    />
                  ) : (
                    <div className="flex items-center justify-center gap-2 md:justify-start">

                      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                        {profile?.name}
                      </h1>

                      <BadgeCheck
                        size={22}
                        className="text-blue-500"
                      />

                    </div>
                  )}

                  {/* USERNAME */}
                  <p className="mt-0.5 text-sm text-gray-500">
                    @{profile?.username || "momentia_user"}
                  </p>

                  {/* BIO */}
                  <div className="mt-2 max-w-lg">

                    {editMode ? (
                      <>
                        <textarea
                          name="bio"
                          value={form.bio}
                          onChange={handleChange}
                          rows={2}
                          placeholder="Write your bio…"
                          className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        />

                        <select
                          name="gender"
                          value={form.gender}
                          onChange={handleChange}
                          className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        >
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="nonbinary">Non-binary</option>
                        </select>
                      </>
                    ) : (
                      <p className="text-sm leading-relaxed text-gray-700">
                        {profile?.bio || "Traveler | Dreamer"}
                      </p>
                    )}

                  </div>

                  {/* META */}
                  {!editMode && (
                    <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-gray-500 md:justify-start">

                      {profile?.location && (
                        <span className="flex items-center gap-1">
                          <MapPin size={13} />
                          {profile.location}
                        </span>
                      )}

                      {profile?.website && (
                        <a
                          href={profile.website}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-blue-500 hover:underline"
                        >
                          <Link2 size={13} />
                          {profile.website}
                        </a>
                      )}

                      {profile?.joinedAt && (
                        <span className="flex items-center gap-1">
                          <Calendar size={13} />

                          Joined{" "}

                          {new Date(
                            profile.joinedAt
                          ).toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      )}

                    </div>
                  )}

                  {/* STATS */}
                  <div className="mt-4 flex justify-center gap-6 md:justify-start md:gap-8">

                    <StatBadge
                      value={profile?.totalPosts || 0}
                      label="Posts"
                    />

                    {/* FOLLOWERS */}
                    <button
                      type="button"
                      onClick={() => setShowFollowers(true)}
                      className="cursor-pointer text-center md:text-left"
                    >
                      <p className="text-xl font-bold text-gray-900">
                        {Number(
                          profile?.followers || 0
                        ).toLocaleString()}
                      </p>

                      <p className="text-xs text-gray-500 hover:text-blue-500">
                        Followers
                      </p>
                    </button>

                    {/* FOLLOWING */}
                    <button
                      type="button"
                      onClick={() => setShowFollowing(true)}
                      className="cursor-pointer text-center md:text-left"
                    >
                      <p className="text-xl font-bold text-gray-900">
                        {Number(
                          profile?.following || 0
                        ).toLocaleString()}
                      </p>

                      <p className="text-xs text-gray-500 hover:text-blue-500">
                        Following
                      </p>
                    </button>

                  </div>

                </div>
              </div>

              {/* BUTTONS */}
              <div className="flex flex-shrink-0 items-center gap-3">

                {isOwnProfile ? (
                  editMode ? (
                    <>
                      <button
                        onClick={handleCancel}
                        className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                      >
                        Cancel
                      </button>

                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white"
                      >
                        {saving ? "Saving…" : "Save"}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setEditMode(true)}
                        className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700"
                      >
                        Edit Profile
                      </button>

                      <button className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">

                        <Plus size={15} />

                        <span className="hidden sm:inline">
                          Create Post
                        </span>

                      </button>
                    </>
                  )
                ) : (
                  // Show Follow/Unfollow button for other users' profiles
                  <FollowButton 
                    userId={profileUserId}
                    isFollowing={isFollowing}
                    onFollowStatusChange={(status) => {
                      // Refresh profile to update follower count
                      fetchProfile();
                    }}
                  />
                )}

              </div>
            </div>

            {/* TABS */}
            <div className="mt-8 border-b border-gray-100">

              <div className="scrollbar-hide flex gap-1 overflow-x-auto">

                {TABS.map(({ key, label, Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 px-4 pb-3 pt-1 text-sm font-semibold transition
                    ${
                      activeTab === key
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    <Icon size={14} />
                    {label}
                  </button>
                ))}

              </div>
            </div>

            {/* POSTS */}
            <div className="mt-6">

              {activeTab === "posts" ? (
                posts.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">

                    {posts.map((post, i) => (
                      <PostCard key={i} post={post} />
                    ))}

                  </div>
                ) : (
                  <EmptyState />
                )
              ) : (
                <EmptyState label={`No ${activeTab} yet`} />
              )}

            </div>

          </div>
        </div>
      </div>

      {/* FOLLOWERS MODAL */}
      {showFollowers && (
        <FollowersModal
          userId={profileUserId}
          onClose={() => setShowFollowers(false)}
          onFollowersUpdate={fetchProfile}
          onFollowersCountUpdate={(count) => {
            setProfile((prev) => prev ? { ...prev, followers: count } : prev);
          }}
        />
      )}

      {/* FOLLOWING MODAL */}
      {showFollowing && (
        <FollowingModal
          userId={profileUserId}
          onClose={() => setShowFollowing(false)}
          onFollowingUpdate={fetchProfile}
          onFollowingCountUpdate={(count) => {
            setProfile((prev) => prev ? { ...prev, following: count } : prev);
          }}
        />
      )}

    </div>
  );
};

/* STAT */
const StatBadge = ({ value, label }) => (
  <div className="text-center md:text-left">
    <p className="text-xl font-bold text-gray-900">
      {Number(value).toLocaleString()}
    </p>

    <p className="text-xs text-gray-500">
      {label}
    </p>
  </div>
);

/* POST CARD */
const PostCard = ({ post }) => {
  const imageSrc =
    post.thumbImage ||
    post.imageUrl ||
    post.images?.[0]?.url ||
    "https://via.placeholder.com/300";

  const likes =
    post.totalLikes ??
    post.likes?.length ??
    0;

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gray-100">

      <img
        src={imageSrc}
        alt="post"
        className="h-40 w-full object-cover transition duration-300 group-hover:scale-105 sm:h-48 md:h-56 lg:h-60"
      />

      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 via-transparent to-transparent p-3 opacity-0 transition duration-200 group-hover:opacity-100">

        <div className="flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-800 shadow">

          <Heart
            size={13}
            className="fill-red-500 text-red-500"
          />

          {likes}

        </div>
      </div>
    </div>
  );
};

/* EMPTY */
const EmptyState = ({
  label = "No moments yet",
}) => (
  <div className="flex flex-col items-center justify-center py-20 text-gray-400">

    <LayoutGrid
      size={44}
      strokeWidth={1}
      className="mb-3 text-gray-200"
    />

    <p className="text-base font-semibold">
      {label}
    </p>

    <p className="mt-1 text-sm text-gray-400">
      Content shared here will appear in this section.
    </p>

  </div>
);

export default Profile;