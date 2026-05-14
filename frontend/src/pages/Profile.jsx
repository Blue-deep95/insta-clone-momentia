import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import FollowersModal from "../components/FollowersModal.jsx";
import FollowingModal from "../components/FollowingModal.jsx";
import FollowButton from "../components/FollowButton.jsx";
import {
  Camera, Heart, MapPin, Link2, Calendar, BadgeCheck,
  LayoutGrid, User, Images, Bookmark, ThumbsUp, Plus,
  Settings, Share2, MoreHorizontal, Zap,
} from "lucide-react";

/* ─── TABS ─────────────────────────────────────────────────── */
const TABS = [
  { key: "posts",  label: "Posts",  Icon: LayoutGrid },
  { key: "about",  label: "About",  Icon: User       },
  { key: "photos", label: "Photos", Icon: Images     },
  { key: "saved",  label: "Saved",  Icon: Bookmark   },
  { key: "liked",  label: "Liked",  Icon: ThumbsUp   },
];

/* ─── CSS ───────────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Fraunces:ital,wght@0,300;0,400;0,700;1,300;1,400&display=swap');
  * { box-sizing: border-box; }

  @keyframes fadeUp   { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
  @keyframes fadeIn   { from { opacity:0 } to { opacity:1 } }
  @keyframes pulse    { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.35;transform:scale(.7)} }
  @keyframes spin     { to { transform:rotate(360deg) } }
  @keyframes shimmer  { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
  @keyframes gridPulse{ 0%,100%{opacity:0.04} 50%{opacity:0.09} }
  @keyframes rotateSlow { from{transform:rotate(0)} to{transform:rotate(360deg)} }
  @keyframes rotateSlowR{ from{transform:rotate(0)} to{transform:rotate(-360deg)} }
  @keyframes floatUp  { 0%{transform:translateY(0)} 100%{transform:translateY(-10px)} }
  @keyframes orbitDot { 0%{transform:rotate(0deg) translateX(110px)} 100%{transform:rotate(360deg) translateX(110px)} }
  @keyframes avatarGlow { 0%,100%{box-shadow:0 0 0 0 rgba(110,231,183,0)} 50%{box-shadow:0 0 28px 6px rgba(110,231,183,0.25)} }
  @keyframes scanLine { 0%{top:-2px} 100%{top:100%} }
  @keyframes countUp  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

  .profile-root { font-family:'Plus Jakarta Sans',sans-serif; min-height:100vh; background:#04050F; display:flex; }
  .profile-body { flex:1; padding:24px; overflow-y:auto; }

  /* cover */
  .cover-wrap { position:relative; height:200px; border-radius:24px 24px 0 0; overflow:hidden; }
  @media(min-width:768px){ .cover-wrap{height:260px;} }

  /* grid bg */
  .grid-bg {
    position:absolute; inset:0; z-index:0;
    animation:gridPulse 5s ease-in-out infinite;
    background-image: linear-gradient(rgba(110,231,183,0.07) 1px,transparent 1px),
                      linear-gradient(90deg,rgba(110,231,183,0.07) 1px,transparent 1px);
    background-size:42px 42px;
  }

  /* card */
  .profile-card {
    background:rgba(255,255,255,0.03);
    border:1px solid rgba(110,231,183,0.1);
    border-radius:24px;
    overflow:hidden;
    backdrop-filter:blur(10px);
    animation:fadeUp .6s cubic-bezier(.22,1,.36,1) both;
  }

  /* tab */
  .tab-btn { transition:all .2s; border-bottom:2px solid transparent; white-space:nowrap; }
  .tab-btn.active { border-color:#10B981; color:#10B981; }
  .tab-btn:not(.active) { color:rgba(255,255,255,0.4); }
  .tab-btn:not(.active):hover { color:rgba(255,255,255,0.75); }

  /* post card */
  .post-card { position:relative; overflow:hidden; border-radius:16px; background:rgba(255,255,255,0.04); border:1px solid rgba(110,231,183,0.08); cursor:pointer; transition:transform .25s,border-color .25s; }
  .post-card:hover { transform:translateY(-4px); border-color:rgba(110,231,183,0.3); }
  .post-card img { width:100%; height:100%; object-fit:cover; display:block; transition:transform .4s; }
  .post-card:hover img { transform:scale(1.06); }
  .post-overlay { position:absolute;inset:0;background:linear-gradient(to top,rgba(4,5,15,0.75) 0%,transparent 55%);opacity:0;transition:opacity .25s;display:flex;align-items:flex-end;padding:12px; }
  .post-card:hover .post-overlay { opacity:1; }

  /* edit input */
  .edit-input {
    background:rgba(255,255,255,0.05); border:1.5px solid rgba(110,231,183,0.2);
    border-radius:12px; padding:12px 16px; color:#fff; font-family:'Plus Jakarta Sans',sans-serif;
    font-size:14px; outline:none; width:100%; transition:border-color .2s,box-shadow .2s;
  }
  .edit-input:focus { border-color:#10B981; box-shadow:0 0 0 4px rgba(16,185,129,0.12); }
  .edit-input::placeholder { color:rgba(255,255,255,0.3); }

  /* btn */
  .btn-primary {
    background:linear-gradient(135deg,#059669 0%,#10B981 55%,#34D399 100%);
    border:none; border-radius:12px; color:#fff; font-family:'Plus Jakarta Sans',sans-serif;
    font-weight:600; font-size:13px; padding:10px 20px; cursor:pointer;
    transition:transform .2s,box-shadow .2s;
    box-shadow:0 6px 20px -4px rgba(16,185,129,0.4);
  }
  .btn-primary:hover { transform:translateY(-1.5px); box-shadow:0 12px 32px -6px rgba(16,185,129,0.55); }
  .btn-secondary {
    background:rgba(255,255,255,0.05); border:1.5px solid rgba(255,255,255,0.1);
    border-radius:12px; color:rgba(255,255,255,0.75); font-family:'Plus Jakarta Sans',sans-serif;
    font-weight:600; font-size:13px; padding:10px 20px; cursor:pointer; transition:all .2s;
  }
  .btn-secondary:hover { background:rgba(255,255,255,0.1); border-color:rgba(255,255,255,0.2); }

  /* stat */
  .stat-item { text-align:center; cursor:pointer; padding:8px 16px; border-radius:14px; transition:background .2s; }
  .stat-item:hover { background:rgba(110,231,183,0.07); }

  /* shimmer skeleton */
  .skeleton { background:linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.08) 50%,rgba(255,255,255,0.04) 75%); background-size:400px 100%; animation:shimmer 1.4s infinite; border-radius:8px; }

  /* avatar ring */
  .avatar-ring { animation:avatarGlow 3s ease-in-out infinite; }

  /* scrollbar */
  ::-webkit-scrollbar { width:4px; height:4px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:rgba(110,231,183,0.2); border-radius:4px; }

  /* responsive */
  @media(max-width:768px) {
    .profile-body { padding:12px; }
    .cover-wrap { height:150px; }
    .hide-mobile { display:none !important; }
  }
`;

/* ─── MAIN ───────────────────────────────────────────────────── */
const Profile = () => {
  const { user } = useSelector((s) => s.auth);
  const { userId } = useParams();

  const profileUserId = userId || user?.id;
  const isOwnProfile  = !userId || userId === user?.id;

  const [profile,      setProfile]      = useState(null);
  const [posts,        setPosts]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [isFollowing,  setIsFollowing]  = useState(false);
  const [editMode,     setEditMode]     = useState(false);
  const [activeTab,    setActiveTab]    = useState("posts");
  const [avatarFile,   setAvatarFile]   = useState(null);
  const [avatarPrev,   setAvatarPrev]   = useState(null);
  const [saving,       setSaving]       = useState(false);
  const [showFollowers,setShowFollowers]= useState(false);
  const [showFollowing,setShowFollowing]= useState(false);
  const [form, setForm] = useState({ name:"", bio:"", gender:"" });

  const fetchProfile = async () => {
    try {
      const res  = await api.get(`/profile/get-profile/${profileUserId}`);
      const data = res.data.profile;
      setProfile(data);
      if (res.data.following !== undefined) setIsFollowing(res.data.following);
      setForm({ name: data.name||"", bio: data.bio||"", gender: data.gender||"" });
    } catch (err) { console.error(err); }
  };

  const fetchProfilePosts = async () => {
    try {
      const res = await api.get(`/profile/get-userposts/${profileUserId}`);
      setPosts(res.data.posts || []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (!profileUserId) return;
    (async () => {
      setLoading(true);
      await Promise.all([fetchProfile(), fetchProfilePosts()]);
      setLoading(false);
    })();
  }, [profileUserId]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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
      setEditMode(false); setAvatarFile(null); setAvatarPrev(null);
      fetchProfile();
    } finally { setSaving(false); }
  };

  const handleCancel = () => {
    setEditMode(false); setAvatarFile(null); setAvatarPrev(null);
    setForm({ name: profile?.name||"", bio: profile?.bio||"", gender: profile?.gender||"" });
  };

  /* LOADING */
  if (loading) return (
    <>
      <style>{css}</style>
      <div className="profile-root" style={{ alignItems:"center", justifyContent:"center" }}>
        <div style={{ textAlign:"center" }}>
          <div style={{ width:48, height:48, border:"2px solid rgba(110,231,183,0.2)", borderTop:"2px solid #10B981", borderRadius:"50%", animation:"spin .8s linear infinite", margin:"0 auto 16px" }} />
          <p style={{ color:"rgba(255,255,255,0.4)", fontSize:13, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Loading profile…</p>
        </div>
      </div>
    </>
  );

  const avatarSrc = avatarPrev || profile?.profilePicture?.profileView || null;

  return (
    <>
      <style>{css}</style>
      <div className="profile-root">

        {/* SIDEBAR */}
        <div className="hide-mobile">
          <Sidebar />
        </div>

        {/* BODY */}
        <div className="profile-body" style={{ paddingLeft: 24 }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>

            {/* ── PROFILE CARD ── */}
            <div className="profile-card">

              {/* COVER / HERO */}
              <div className="cover-wrap">
                {/* Grid bg */}
                <div className="grid-bg" />

                {/* Scan line */}
                <div style={{ position:"absolute", left:0, right:0, height:"1px", zIndex:2,
                  background:"linear-gradient(90deg,transparent 0%,rgba(110,231,183,0.5) 50%,transparent 100%)",
                  animation:"scanLine 10s linear infinite" }} />

                {/* Decorative rings */}
                <div style={{ position:"absolute", top:"50%", left:"50%", width:340, height:340,
                  marginLeft:-170, marginTop:-170, borderRadius:"50%",
                  border:"1px solid rgba(110,231,183,0.06)", animation:"rotateSlow 50s linear infinite" }} />
                <div style={{ position:"absolute", top:"50%", left:"50%", width:220, height:220,
                  marginLeft:-110, marginTop:-110, borderRadius:"50%",
                  border:"1px dashed rgba(99,102,241,0.12)", animation:"rotateSlowR 28s linear infinite" }} />

                {/* Orbit dot */}
                <div style={{ position:"absolute", top:"50%", left:"50%", width:0, height:0, zIndex:3 }}>
                  <div style={{ width:6, height:6, borderRadius:"50%", background:"#6EE7B7",
                    boxShadow:"0 0 10px 3px rgba(110,231,183,0.7)",
                    animation:"orbitDot 8s linear infinite" }} />
                </div>

                {/* Diagonal lines */}
                <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", zIndex:0 }} preserveAspectRatio="none">
                  <line x1="0" y1="30%" x2="100%" y2="72%" stroke="rgba(110,231,183,0.05)" strokeWidth="1" />
                  <line x1="0" y1="70%" x2="100%" y2="20%" stroke="rgba(99,102,241,0.04)" strokeWidth="0.8" />
                  <line x1="20%" y1="0" x2="80%" y2="100%" stroke="rgba(110,231,183,0.03)" strokeWidth="0.6" />
                </svg>

                {/* Corner brackets */}
                {[
                  { top:14, left:14,   borderTop:"1.5px solid rgba(110,231,183,0.4)", borderLeft:"1.5px solid rgba(110,231,183,0.4)"   },
                  { top:14, right:14,  borderTop:"1.5px solid rgba(110,231,183,0.4)", borderRight:"1.5px solid rgba(110,231,183,0.4)"  },
                  { bottom:14, left:14, borderBottom:"1.5px solid rgba(110,231,183,0.4)", borderLeft:"1.5px solid rgba(110,231,183,0.4)" },
                  { bottom:14, right:14,borderBottom:"1.5px solid rgba(110,231,183,0.4)", borderRight:"1.5px solid rgba(110,231,183,0.4)"},
                ].map((s, i) => (
                  <div key={i} style={{ position:"absolute", width:22, height:22, zIndex:2, ...s }} />
                ))}

                {/* Live badge */}
                <div style={{ position:"absolute", top:18, left:"50%", transform:"translateX(-50%)",
                  display:"inline-flex", alignItems:"center", gap:6, padding:"4px 12px", borderRadius:20,
                  background:"rgba(110,231,183,0.06)", border:"1px solid rgba(110,231,183,0.15)", zIndex:3 }}>
                  <span style={{ width:5, height:5, borderRadius:"50%", background:"#6EE7B7",
                    display:"inline-block", animation:"pulse 2s ease infinite" }} />
                  <span style={{ fontSize:9.5, color:"#6EE7B7", letterSpacing:"1.5px", textTransform:"uppercase",
                    fontWeight:500, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Momentia</span>
                </div>

                {/* Cover gradient overlay at bottom */}
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, transparent 40%, rgba(4,5,15,0.95) 100%)", zIndex:1 }} />
              </div>

              {/* ── AVATAR + INFO ROW ── */}
              <div style={{ padding:"0 28px 28px", position:"relative" }}>

                {/* Avatar — overlaps cover */}
                <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between",
                  marginTop:-52, position:"relative", zIndex:4, flexWrap:"wrap", gap:16 }}>

                  {/* LEFT: avatar + name */}
                  <div style={{ display:"flex", alignItems:"flex-end", gap:20, flexWrap:"wrap" }}>

                    {/* AVATAR */}
                    <div style={{ position:"relative", flexShrink:0 }}>
                      <div className="avatar-ring" style={{ width:108, height:108, borderRadius:"50%",
                        border:"3px solid rgba(110,231,183,0.5)", padding:3, background:"#04050F" }}>
                        {avatarSrc ? (
                          <img src={avatarSrc} alt="avatar"
                            style={{ width:"100%", height:"100%", borderRadius:"50%", objectFit:"cover", display:"block" }} />
                        ) : (
                          <div style={{ width:"100%", height:"100%", borderRadius:"50%",
                            background:"linear-gradient(135deg, rgba(110,231,183,0.15) 0%, rgba(99,102,241,0.1) 100%)",
                            display:"flex", alignItems:"center", justifyContent:"center" }}>
                            <span style={{ fontFamily:"'Fraunces',serif", fontSize:36, fontWeight:700, color:"#6EE7B7" }}>
                              {profile?.name?.[0] || "U"}
                            </span>
                          </div>
                        )}
                      </div>

                      {editMode && (
                        <label style={{ position:"absolute", bottom:4, right:4, width:28, height:28,
                          borderRadius:"50%", background:"#10B981", border:"2px solid #04050F",
                          display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
                          <Camera size={13} color="#fff" />
                          <input type="file" hidden accept="image/*" onChange={handleAvatarChange} />
                        </label>
                      )}
                    </div>

                    {/* NAME + USERNAME + BIO */}
                    <div style={{ paddingBottom:6 }}>
                      {editMode ? (
                        <input className="edit-input" name="name" value={form.name} onChange={handleChange}
                          placeholder="Your name" style={{ fontSize:20, fontWeight:700, marginBottom:8 }} />
                      ) : (
                        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                          <h1 style={{ fontFamily:"'Fraunces',serif", fontSize:26, fontWeight:700, color:"#fff",
                            letterSpacing:"-0.5px", margin:0 }}>
                            {profile?.name}
                          </h1>
                          <BadgeCheck size={20} color="#10B981" />
                        </div>
                      )}

                      <p style={{ fontSize:12, color:"rgba(255,255,255,0.35)", fontFamily:"'Plus Jakarta Sans',sans-serif", margin:"0 0 8px" }}>
                        @{profile?.username || "momentia_user"}
                      </p>

                      {!editMode && (
                        <p style={{ fontSize:13, color:"rgba(255,255,255,0.6)", fontFamily:"'Plus Jakarta Sans',sans-serif",
                          maxWidth:380, lineHeight:1.6, margin:0 }}>
                          {profile?.bio || "Traveler · Dreamer · Moment collector ✨"}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* RIGHT: action buttons */}
                  <div style={{ display:"flex", alignItems:"center", gap:10, paddingBottom:6 }}>
                    {isOwnProfile ? (
                      editMode ? (
                        <>
                          <button className="btn-secondary" onClick={handleCancel}>Cancel</button>
                          <button className="btn-primary" onClick={handleSave} disabled={saving}>
                            {saving ? (
                              <span style={{ display:"flex", alignItems:"center", gap:8 }}>
                                <span style={{ width:12, height:12, border:"2px solid rgba(255,255,255,0.3)", borderTop:"2px solid #fff", borderRadius:"50%", animation:"spin .7s linear infinite", display:"inline-block" }} />
                                Saving…
                              </span>
                            ) : "Save Changes"}
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="btn-secondary" onClick={() => setEditMode(true)}
                            style={{ display:"flex", alignItems:"center", gap:6 }}>
                            <Settings size={13} />
                            Edit Profile
                          </button>
                          <button className="btn-primary" style={{ display:"flex", alignItems:"center", gap:6 }}>
                            <Plus size={14} />
                            <span>Create Post</span>
                          </button>
                        </>
                      )
                    ) : (
                      <FollowButton userId={profileUserId} isFollowing={isFollowing}
                        onFollowStatusChange={() => fetchProfile()} />
                    )}

                    <button style={{ width:38, height:38, borderRadius:10,
                      background:"rgba(255,255,255,0.05)", border:"1.5px solid rgba(255,255,255,0.1)",
                      display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
                      <MoreHorizontal size={16} color="rgba(255,255,255,0.6)" />
                    </button>
                  </div>
                </div>

                {/* ── EDIT FIELDS ── */}
                {editMode && (
                  <div style={{ marginTop:20, display:"grid", gap:12, gridTemplateColumns:"1fr 1fr",
                    animation:"fadeUp .3s cubic-bezier(.22,1,.36,1) both" }}>
                    <div style={{ gridColumn:"1/-1" }}>
                      <label style={{ fontSize:10, fontWeight:600, color:"rgba(255,255,255,0.35)", letterSpacing:"0.9px",
                        textTransform:"uppercase", display:"block", marginBottom:6, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Bio</label>
                      <textarea className="edit-input" name="bio" value={form.bio} onChange={handleChange}
                        rows={3} placeholder="Write your bio…" style={{ resize:"none" }} />
                    </div>
                    <div>
                      <label style={{ fontSize:10, fontWeight:600, color:"rgba(255,255,255,0.35)", letterSpacing:"0.9px",
                        textTransform:"uppercase", display:"block", marginBottom:6, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Gender</label>
                      <select className="edit-input" name="gender" value={form.gender} onChange={handleChange}>
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="nonbinary">Non-binary</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* ── META ROW ── */}
                {!editMode && (
                  <div style={{ marginTop:16, display:"flex", flexWrap:"wrap", gap:16,
                    alignItems:"center", borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:16 }}>

                    {profile?.location && (
                      <span style={{ display:"flex", alignItems:"center", gap:5, fontSize:12,
                        color:"rgba(255,255,255,0.4)", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                        <MapPin size={12} color="#10B981" /> {profile.location}
                      </span>
                    )}
                    {profile?.website && (
                      <a href={profile.website} target="_blank" rel="noreferrer"
                        style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:"#10B981",
                          fontFamily:"'Plus Jakarta Sans',sans-serif", textDecoration:"none" }}>
                        <Link2 size={12} /> {profile.website}
                      </a>
                    )}
                    {profile?.joinedAt && (
                      <span style={{ display:"flex", alignItems:"center", gap:5, fontSize:12,
                        color:"rgba(255,255,255,0.4)", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                        <Calendar size={12} color="#10B981" />
                        Joined {new Date(profile.joinedAt).toLocaleDateString("en-US",{month:"long",year:"numeric"})}
                      </span>
                    )}

                    {/* Spacer */}
                    <div style={{ flex:1 }} />

                    {/* Share */}
                    <button style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:"rgba(255,255,255,0.4)",
                      background:"none", border:"none", cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                      <Share2 size={13} /> Share profile
                    </button>
                  </div>
                )}

                {/* ── STATS ROW ── */}
                <div style={{ marginTop:20, display:"flex", gap:4, background:"rgba(255,255,255,0.02)",
                  border:"1px solid rgba(110,231,183,0.08)", borderRadius:16, padding:"4px 8px",
                  width:"fit-content", animation:"countUp .5s .2s both" }}>

                  <StatItem value={profile?.totalPosts || 0} label="Posts" onClick={null} />
                  <div style={{ width:1, background:"rgba(255,255,255,0.07)", margin:"8px 0" }} />
                  <StatItem value={profile?.followers || 0} label="Followers" onClick={() => setShowFollowers(true)} />
                  <div style={{ width:1, background:"rgba(255,255,255,0.07)", margin:"8px 0" }} />
                  <StatItem value={profile?.following || 0} label="Following" onClick={() => setShowFollowing(true)} />
                </div>
              </div>

              {/* ── TABS ── */}
              <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)", padding:"0 28px" }}>
                <div style={{ display:"flex", gap:0, overflowX:"auto" }}>
                  {TABS.map(({ key, label, Icon }) => (
                    <button key={key} className={`tab-btn ${activeTab === key ? "active" : ""}`}
                      onClick={() => setActiveTab(key)}
                      style={{ display:"flex", alignItems:"center", gap:6, padding:"14px 18px",
                        fontSize:12, fontWeight:600, fontFamily:"'Plus Jakarta Sans',sans-serif",
                        background:"none", border:"none", borderBottom:"2px solid transparent", cursor:"pointer" }}>
                      <Icon size={13} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── CONTENT ── */}
              <div style={{ padding:"24px 28px 28px" }}>
                {activeTab === "posts" ? (
                  posts.length > 0 ? (
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(170px,1fr))", gap:12 }}>
                      {posts.map((post, i) => (
                        <PostCard key={i} post={post} style={{ animationDelay: `${i * 0.05}s` }} />
                      ))}
                    </div>
                  ) : <EmptyState />
                ) : (
                  <EmptyState label={`No ${activeTab} yet`} />
                )}
              </div>

            </div>
          </div>
        </div>
      </div>

      {showFollowers && (
        <FollowersModal userId={profileUserId} onClose={() => setShowFollowers(false)} onFollowersUpdate={fetchProfile} />
      )}
      {showFollowing && (
        <FollowingModal userId={profileUserId} onClose={() => setShowFollowing(false)} onFollowingUpdate={fetchProfile} />
      )}
    </>
  );
};

/* ─── STAT ITEM ─────────────────────────────────────────────── */
const StatItem = ({ value, label, onClick }) => (
  <div className="stat-item" onClick={onClick}
    style={{ cursor: onClick ? "pointer" : "default" }}>
    <p style={{ fontFamily:"'Fraunces',serif", fontSize:20, fontWeight:700, color:"#fff", margin:0, lineHeight:1.1 }}>
      {Number(value).toLocaleString()}
    </p>
    <p style={{ fontSize:10, color: onClick ? "rgba(110,231,183,0.7)" : "rgba(255,255,255,0.35)",
      fontFamily:"'Plus Jakarta Sans',sans-serif", margin:"2px 0 0", letterSpacing:"0.5px", textTransform:"uppercase" }}>
      {label}
    </p>
  </div>
);

/* ─── POST CARD ─────────────────────────────────────────────── */
const PostCard = ({ post }) => {
  const imageSrc = post.thumbImage || post.imageUrl || post.images?.[0]?.url || "https://via.placeholder.com/300";
  const likes    = post.totalLikes ?? post.likes?.length ?? 0;

  return (
    <div className="post-card" style={{ aspectRatio:"1", animation:"fadeUp .4s both" }}>
      <img src={imageSrc} alt="post" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
      <div className="post-overlay">
        <div style={{ display:"flex", alignItems:"center", gap:5,
          background:"rgba(4,5,15,0.7)", backdropFilter:"blur(8px)",
          border:"1px solid rgba(110,231,183,0.2)", borderRadius:20,
          padding:"5px 10px" }}>
          <Heart size={11} fill="#10B981" color="#10B981" />
          <span style={{ fontSize:11, fontWeight:600, color:"#fff",
            fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{likes}</span>
        </div>
      </div>
    </div>
  );
};

/* ─── EMPTY STATE ───────────────────────────────────────────── */
const EmptyState = ({ label = "No moments yet" }) => (
  <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
    padding:"60px 20px", textAlign:"center" }}>
    <div style={{ width:64, height:64, borderRadius:"50%",
      background:"rgba(110,231,183,0.06)", border:"1px solid rgba(110,231,183,0.15)",
      display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16 }}>
      <LayoutGrid size={24} color="rgba(110,231,183,0.4)" />
    </div>
    <p style={{ fontFamily:"'Fraunces',serif", fontSize:18, color:"rgba(255,255,255,0.5)", margin:"0 0 6px" }}>
      {label}
    </p>
    <p style={{ fontSize:12, color:"rgba(255,255,255,0.25)", fontFamily:"'Plus Jakarta Sans',sans-serif", margin:0 }}>
      Content shared here will appear in this section.
    </p>
  </div>
);

export default Profile;
