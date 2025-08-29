// components/AdminAnnouncements.jsx
import { useEffect, useState } from "react";
import axios from "../lib/axios.js";
import { Trash } from "lucide-react";
import { toast } from "react-hot-toast";

const AdminAnnouncements = () => {
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [pinned, setPinned] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const res = await axios.get("/announcements?limit=20&pinnedFirst=true");
      setItems(res.data || []);
    } catch (e) {
      toast.error("Failed to load announcements");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post("/announcements", {
        title,
        message,
        pinned,
      });
      setItems((prev) => [res.data, ...prev]);
      setTitle("");
      setMessage("");
      setPinned(false);
      toast.success("Announcement created");
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to create");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    try {
      await axios.delete(`/announcements/${id}`);
      setItems((prev) => prev.filter((x) => x._id !== id));
      toast.success("Deleted");
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to delete");
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Left: Create form */}
      <div
        className="rounded-xl border border-white/10 bg-white/[0.03] p-5 min-h-[50vh]"
        style={{ height: "40px" }}
      >
        {/* grid grid-cols-1 gap-6 lg:grid-cols-2 min-h-[70vh] */}
        <h3 className="mb-3 text-base font-semibold text-white/90">
          Create announcement
        </h3>
        <form onSubmit={submit} className="grid gap-3">
          <input
            className="rounded-md border border-white/10 bg-white/[0.05] px-3 py-2"
            placeholder="Title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="rounded-md border border-white/10 bg-white/[0.05] px-3 py-2"
            placeholder="Announcement message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={pinned}
              onChange={(e) => setPinned(e.target.checked)}
            />
            Pinned
          </label>
          <button
            type="submit"
            className="self-start rounded-md bg-emerald-600 px-4 py-2 hover:brightness-110 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </form>
      </div>

      {/* Right: List */}
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <h3 className="mb-3 text-base font-semibold text-white/90">
          Existing announcements
        </h3>
        {items.length === 0 ? (
          <div className="text-sm text-white/60">No announcements yet.</div>
        ) : (
          <ul className="space-y-3">
            {items.map((a) => (
              <li
                key={a._id}
                className="flex items-start justify-between gap-4 rounded-lg border border-white/10 bg-white/[0.04] p-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    {a.pinned ? <span>📌</span> : null}
                    {a.title ? (
                      <div className="font-medium">{a.title}</div>
                    ) : null}
                  </div>
                  <div className="mt-1 whitespace-pre-wrap text-sm text-white/85">
                    {a.message}
                  </div>
                  <div className="mt-1 text-xs text-white/60">
                    {a.createdBy?.username ? `by ${a.createdBy.username}` : ""}
                  </div>
                </div>
                <button
                  onClick={() => remove(a._id)}
                  className="p-2 text-white/70 hover:text-red-400"
                  title="Delete"
                >
                  <Trash size={18} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminAnnouncements;
