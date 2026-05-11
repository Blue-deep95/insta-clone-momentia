import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useSelector } from "react-redux";
import Sidebar from "../components/Sidebar.jsx";
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
  { key: "posts",  label: "Posts",  Icon: LayoutGrid },
  { key: "about",  label: "About",  Icon: User       },
  { key: "photos", label: "Photos", Icon: Images     },
  { key: "saved",  label: "Saved",  Icon: Bookmark   },
  { key: "liked",  label: "Liked",  Icon: ThumbsUp   },
];

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  const [profile,    setProfile]    = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [editMode,   setEditMode]   = useState(false);
  const [activeTab,  setActiveTab]  = useState("posts");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPrev, setAvatarPrev] = useState(null);
  const [saving,     setSaving]     = useState(false);
  const [form, setForm] = useState({ name: "", bio: "", gender: "" });

  const fetchProfile = async () => {
    try {
      const res  = await api.get(`/profile/get-profile/${user.id}`);
      const data = res.data.profile;
      setProfile(data);
      setForm({ name: data.name || "", bio: data.bio || "", gender: data.gender || "" });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (user?.id) fetchProfile(); }, [user]);

  const handleChange       = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPrev(URL.createObjectURL(file));
  };

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

  const handleCancel = () => {
    setEditMode(false);
    setAvatarFile(null);
    setAvatarPrev(null);
    setForm({ name: profile?.name || "", bio: profile?.bio || "", gender: profile?.gender || "" });
  };

  /* loading screen */
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f7fb]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
          <p className="text-sm font-medium text-gray-400">Loading profile…</p>
        </div>
      </div>
    );
  }

  const avatarSrc = avatarPrev || profile?.profilePicture?.profileView || null;

  return (
    <div className="flex min-h-screen bg-[#f4f7fb] lg:pl-20">

      {/* ── SIDEBAR ── */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* ── PAGE BODY ── */}
      <div className="flex-1 p-3 md:p-5 lg:p-6">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl shadow-gray-200/60">

          {/* ─── COVER ─── */}
          <div className="relative h-48 sm:h-60 md:h-72 lg:h-80">
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80"
              alt="cover"
              className="h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

            <button className="absolute right-4 top-4 flex items-center gap-2 rounded-xl bg-white/90 px-3 py-2 text-sm font-semibold text-gray-700 shadow backdrop-blur-sm transition hover:bg-white hover:shadow-md active:scale-95">
              <Camera size={15} />
              <span className="hidden sm:inline">Edit Cover</span>
            </button>
          </div>

          {/* ─── PROFILE SECTION ─── */}
          <div className="relative px-4 pb-8 sm:px-6 md:px-8 lg:px-10">

            {/*
              LAYOUT:
              • Mobile  → column, avatar centred on top of cover edge
              • ≥ md    → row, avatar + info left, buttons right
            */}
            <div className="-mt-14 flex flex-col items-center gap-5 sm:-mt-16 md:-mt-20 md:flex-row md:items-end md:justify-between">

              {/* LEFT: avatar + text */}
              <div className="flex flex-col items-center gap-4 md:flex-row md:items-end">

                {/* AVATAR */}
                <div className="relative flex-shrink-0">
                  <div className="rounded-full border-[5px] border-white shadow-2xl">
                    {avatarSrc ? (
                      <img
                        src={avatarSrc}
                        alt="profile"
                        className="h-24 w-24 rounded-full object-cover
                                   sm:h-28 sm:w-28 md:h-32 md:w-32 lg:h-36 lg:w-36"
                      />
                    ) : (
                      <div className="flex h-24 w-24 items-center justify-center rounded-full
                                      bg-gradient-to-br from-blue-100 to-blue-200
                                      sm:h-28 sm:w-28 md:h-32 md:w-32 lg:h-36 lg:w-36">
                        <span className="text-3xl font-bold text-blue-500 md:text-4xl">
                          {profile?.name?.[0] || "U"}
                        </span>
                      </div>
                    )}
                  </div>

                  {editMode && (
                    <label className="absolute bottom-1 right-1 cursor-pointer rounded-full bg-white p-2
                                      shadow-lg ring-2 ring-gray-100 transition hover:bg-gray-50">
                      <Camera size={15} className="text-gray-600" />
                      <input type="file" hidden accept="image/*" onChange={handleAvatarChange} />
                    </label>
                  )}
                </div>

                {/* TEXT INFO */}
                <div className="mb-1 text-center md:text-left">

                  {/* name */}
                  {editMode ? (
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2
                                 text-xl font-bold text-gray-900 outline-none
                                 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 md:text-2xl"
                    />
                  ) : (
                    <div className="flex items-center justify-center gap-2 md:justify-start">
                      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                        {profile?.name}
                      </h1>
                      <BadgeCheck size={22} className="text-blue-500" />
                    </div>
                  )}

                  {/* handle */}
                  <p className="mt-0.5 text-sm text-gray-500">
                    @{profile?.username || "momenti_user"}
                  </p>

                  {/* bio */}
                  <div className="mt-2 max-w-lg">
                    {editMode ? (
                      <>
                        <textarea
                          name="bio"
                          value={form.bio}
                          onChange={handleChange}
                          rows={2}
                          placeholder="Write your bio…"
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm
                                     text-gray-700 outline-none resize-none
                                     focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        />
                        <select
                          name="gender"
                          value={form.gender}
                          onChange={handleChange}
                          className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2
                                     text-sm text-gray-700 outline-none
                                     focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                        >
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="nonbinary">Non-binary</option>
                          <option value="prefer_not">Prefer not to say</option>
                        </select>
                      </>
                    ) : (
                      <p className="text-sm leading-relaxed text-gray-700">
                        {profile?.bio || "Traveler | Photographer | Dreamer"}
                      </p>
                    )}
                  </div>

                  {/* meta row — location / website / joined */}
                  {!editMode && (
                    <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-gray-500 md:justify-start">
                      {profile?.location && (
                        <span className="flex items-center gap-1">
                          <MapPin size={13} /> {profile.location}
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
                          {profile.website.replace(/^https?:\/\//, "")}
                        </a>
                      )}
                      {profile?.joinedAt && (
                        <span className="flex items-center gap-1">
                          <Calendar size={13} />
                          Joined{" "}
                          {new Date(profile.joinedAt).toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                  )}

                  {/* STATS */}
                  <div className="mt-4 flex justify-center gap-6 md:justify-start md:gap-8">
                    <StatBadge value={profile?.totalPosts || 0} label="Posts"     />
                    <StatBadge value={profile?.followers  || 0} label="Followers" />
                    <StatBadge value={profile?.following  || 0} label="Following" />
                  </div>
                </div>
              </div>

              {/* RIGHT: action buttons */}
              <div className="flex flex-shrink-0 items-center gap-3">
                {editMode ? (
                  <>
                    <button
                      onClick={handleCancel}
                      className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold
                                 text-gray-600 transition hover:bg-gray-50 active:scale-95"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white
                                 shadow-md shadow-blue-200 transition hover:bg-blue-700
                                 active:scale-95 disabled:opacity-60"
                    >
                      {saving ? "Saving…" : "Save"}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setEditMode(true)}
                      className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold
                                 text-gray-700 transition hover:bg-gray-50 active:scale-95"
                    >
                      Edit Profile
                    </button>
                    <button
                      className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2
                                 text-sm font-semibold text-white shadow-md shadow-blue-200
                                 transition hover:bg-blue-700 active:scale-95"
                    >
                      <Plus size={15} />
                      <span className="hidden sm:inline">Create Post</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* ─── TABS ─── */}
            <div className="mt-8 border-b border-gray-100">
              <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                {TABS.map(({ key, label, Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 px-4 pb-3 pt-1
                                text-sm font-semibold transition
                                ${activeTab === key
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

            {/* ─── POSTS GRID ─── */}
            <div className="mt-6">
              {activeTab === "posts" ? (
                profile?.posts?.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {profile.posts.map((post, i) => (
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
    </div>
  );
};

/* ─────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────── */

const StatBadge = ({ value, label }) => (
  <div className="text-center md:text-left">
    <p className="text-xl font-bold text-gray-900">{Number(value).toLocaleString()}</p>
    <p className="text-xs text-gray-500">{label}</p>
  </div>
);

const PostCard = ({ post }) => (
  <div className="group relative overflow-hidden rounded-2xl bg-gray-100">
    <img
      src={post.imageUrl}
      alt="post"
      className="h-40 w-full object-cover transition duration-300 group-hover:scale-105
                 sm:h-48 md:h-56 lg:h-60"
    />
    <div
      className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50
                 via-transparent to-transparent p-3 opacity-0 transition
                 duration-200 group-hover:opacity-100"
    >
      <div className="flex items-center gap-1 rounded-full bg-white/90 px-3 py-1
                      text-xs font-semibold text-gray-800 shadow">
        <Heart size={13} className="fill-red-500 text-red-500" />
        {post?.likes?.length || 0}
      </div>
    </div>
  </div>
);

const EmptyState = ({ label = "No moments yet" }) => (
  <div className="flex flex-col items-center justify-center py-20 text-gray-400">
    <LayoutGrid size={44} strokeWidth={1} className="mb-3 text-gray-200" />
    <p className="text-base font-semibold">{label}</p>
    <p className="mt-1 text-sm text-gray-400">Content shared here will appear in this section.</p>
  </div>
);

export default Profile;
