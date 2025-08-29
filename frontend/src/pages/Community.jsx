import { useEffect, useState } from "react";
import axios from "axios";
import { Trash } from "lucide-react";
import { motion } from "framer-motion";
import { useUserStore } from "../stores/useUserStore";

// Constants
const CARD_STYLE =
  "max-h-[460px] overflow-y-auto rounded-2xl border border-white/10 bg-white/[0.03] shadow-lg";
const SCROLLBAR_HIDE = { scrollbarWidth: "none", msOverflowStyle: "none" };

// Utility functions
const timeAgo = (timestamp) => {
  const diff = Math.max(
    0,
    Math.floor((Date.now() - new Date(timestamp)) / 1000)
  );
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const sortByDate = (array) =>
  [...array].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

// Sub-components
const PostForm = ({ content, setContent, handleCreate, currentUser }) => (
  <form
    onSubmit={handleCreate}
    className={`${CARD_STYLE} flex gap-3 items-center p-4`}
  >
    <img
      src={currentUser?.profilePicture || "/default-avatar.png"}
      alt="me"
      className="w-11 h-11 rounded-xl object-cover border border-white/10"
    />
    <input
      type="text"
      value={content}
      onChange={(e) => setContent(e.target.value)}
      placeholder="Share something with the community…"
      className="flex-1 px-4 py-3 rounded-xl text-sm placeholder-white/45 bg-white/[0.05] border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
    />
    <button
      type="submit"
      className="px-5 py-2 rounded-xl text-sm font-medium bg-gradient-to-b from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/25 hover:brightness-110 active:scale-95 transition"
    >
      Post
    </button>
  </form>
);

const UserBadge = ({ role }) => {
  if (!role) return null;

  const badgeStyles =
    role === "customer"
      ? "bg-emerald-500/10 text-emerald-200 border-emerald-400/30"
      : "bg-sky-500/10 text-sky-200 border-sky-400/30";

  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[11px] border ${badgeStyles}`}
    >
      {role}
    </span>
  );
};

const PostItem = ({ post, index, currentUser, onDelete }) => (
  <div
    className={`px-4 py-4 hover:bg-white/20 transition ${
      index > 0 ? "border-t border-white/20" : ""
    }`}
  >
    <div className="flex items-start gap-4">
      <img
        src={post.author?.profilePicture || "/default-avatar.png"}
        alt="avatar"
        className="w-11 h-11 rounded-xl object-cover border border-gray-900/5"
      />
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 text-[13px]">
          <span className="font-medium truncate">
            {post.author?.username || "Unknown"}
          </span>
          <UserBadge role={post.author?.role} />
          <span className="text-white/40">•</span>
          <span className="text-white/75">{timeAgo(post.createdAt)}</span>
        </div>
        <p className="mt-1 text-[15px] text-white/90 leading-relaxed break-words">
          {post.content}
        </p>
      </div>
      {currentUser?._id === post.author?._id && (
        <button
          onClick={() => onDelete(post._id)}
          className="text-white/70 hover:text-red-400 transition p-1.5 rounded-md"
          title="Delete post"
        >
          <Trash size={18} />
        </button>
      )}
    </div>
  </div>
);

const PostsList = ({ posts, currentUser, onDelete }) => (
  <div
    className="max-h-[486px] overflow-y-auto rounded-2xl border border-white/40 bg-white/[0.03] shadow-lg"
    style={SCROLLBAR_HIDE}
  >
    {posts.length === 0 ? (
      <div className="p-10 text-center text-white/75">
        🌱 No posts yet. Be the first!
      </div>
    ) : (
      posts.map((post, index) => (
        <PostItem
          key={post._id}
          post={post}
          index={index}
          currentUser={currentUser}
          onDelete={onDelete}
        />
      ))
    )}
  </div>
);

const AnnouncementItem = ({ announcement }) => (
  <li className="p-4 rounded-lg bg-white/[0.04] border border-white/10">
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          {announcement.pinned && <span>📌</span>}
          {announcement.title && (
            <div className="font-medium">{announcement.title}</div>
          )}
        </div>
        <div className="whitespace-pre-wrap mt-1">{announcement.message}</div>
        <div className="mt-2 text-xs text-white/60">
          {announcement.createdBy?.username &&
            `by ${announcement.createdBy.username} • `}
          {timeAgo(announcement.createdAt)}
        </div>
      </div>
    </div>
  </li>
);

const Announcements = ({ announcements }) => (
  <div
    className="max-h-[400px] p-5 overflow-y-auto rounded-2xl border border-white/10 bg-white/[0.03] shadow-lg"
    style={SCROLLBAR_HIDE}
  >
    <h2 className="text-lg font-semibold mb-4 tracking-tight text-emerald-300">
      Announcements
    </h2>
    {announcements.length === 0 ? (
      <div className="text-white/70 text-sm">No announcements yet.</div>
    ) : (
      <ul className="space-y-3 text-white/85 text-sm">
        {announcements.map((announcement) => (
          <AnnouncementItem
            key={announcement._id}
            announcement={announcement}
          />
        ))}
      </ul>
    )}
  </div>
);

const GuidelineItem = ({ text }) => (
  <div className="flex items-start gap-2">
    <span className="text-emerald-400 mt-0.5">•</span>
    <span>{text}</span>
  </div>
);

const CommunityGuidelines = () => {
  const guidelines = [
    "Be respectful to all members",
    "Don't share person details",
    "No spam or self-promotion",
    "Keep discussions relevant",
  ];

  return (
    <motion.div
      className="space-y-5"
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 60,
        damping: 18,
        delay: 0.4,
      }}
    >
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5 pt-3 pb-2 shadow-2xl">
        <div className="flex items-start gap-0">
          <div className="flex-1 pr-4">
            <h3 className="text-emerald-300 font-semibold mb-3 text-base">
              Community Guidelines
            </h3>
            <div className="space-y-1 text-slate-300 text-sm">
              {guidelines.map((guideline, index) => (
                <GuidelineItem key={index} text={guideline} />
              ))}
            </div>
          </div>
          <div className="w-26 h-30 mt-5 rounded-xl overflow-hidden transform hover:rotate-2 hover:scale-115 transition-all duration-400">
            <img
              src="./at1.png"
              alt="Community Guidelines"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Main component
const Community = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const { user: currentUser } = useUserStore();

  const fetchPosts = async () => {
    try {
      const response = await axios.get("/api/posts");
      setPosts(sortByDate(response.data || []));
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get(
        "/api/announcements?limit=10&pinnedFirst=true"
      );
      const items = response.data?.items || response.data || [];
      setAnnouncements(items);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchAnnouncements();
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();
    if (!content.trim()) return;

    try {
      const response = await axios.post("/api/posts", { content });
      setPosts((prevPosts) => sortByDate([response.data, ...prevPosts]));
      setContent("");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`/api/posts/${postId}`);
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div
      className="min-h-screen mt-15 px-6 py-8 text-white"
      style={{ marginBottom: "-150px" }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {/* LEFT → POSTS */}
        <motion.div
          className="lg:col-span-2 space-y-6"
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 60, damping: 18 }}
        >
          <PostForm
            content={content}
            setContent={setContent}
            handleCreate={handleCreate}
            currentUser={currentUser}
          />
          <PostsList
            posts={posts}
            currentUser={currentUser}
            onDelete={handleDelete}
          />
        </motion.div>

        {/* RIGHT → ANNOUNCEMENTS */}
        <motion.div
          className="space-y-5"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 60,
            damping: 18,
            delay: 0.3,
          }}
        >
          <Announcements announcements={announcements} />
          <CommunityGuidelines />
        </motion.div>
      </div>
    </div>
  );
};

export default Community;
