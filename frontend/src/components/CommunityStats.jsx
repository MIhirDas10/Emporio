// CommunityStats.jsx
import { Users, MessageSquare, Megaphone } from "lucide-react";

const CommunityStats = ({ postsCount, announcementsCount, activeUsers }) => {
  return (
    <div className="w-full max-w-sm rounded-lg shadow-lg bg-white/[0.03] border border-white/10 p-5 text-white">
      <h2 className="text-lg font-semibold mb-4 text-emerald-300">
        Community Stats
      </h2>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <Users className="mx-auto mb-1 text-emerald-400" />
          <p className="text-sm">Active</p>
          <p className="font-bold">{activeUsers}</p>
        </div>
        <div>
          <MessageSquare className="mx-auto mb-1 text-sky-400" />
          <p className="text-sm">Posts</p>
          <p className="font-bold">{postsCount}</p>
        </div>
        <div>
          <Megaphone className="mx-auto mb-1 text-yellow-400" />
          <p className="text-sm">Announcements</p>
          <p className="font-bold">{announcementsCount}</p>
        </div>
      </div>
    </div>
  );
};

export default CommunityStats;
