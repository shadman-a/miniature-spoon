import React from 'react';
import { Newspaper, ExternalLink, Clock } from 'lucide-react';

export const NewsFeed: React.FC = () => {
  const articles = [
    {
      id: 1,
      title: "New Study: 7 Hours Sleep Optimal for Longevity",
      source: "Health Daily",
      time: "2h ago",
      category: "Sleep",
      url: "#"
    },
    {
      id: 2,
      title: "Why HIIT Might Be Better Than Steady State Cardio",
      source: "Fitness Mag",
      time: "5h ago",
      category: "Fitness",
      url: "#"
    },
    {
      id: 3,
      title: "The Science of Saunas: Heat Shock Proteins Explained",
      source: "Biohacker News",
      time: "1d ago",
      category: "Recovery",
      url: "#"
    },
    {
      id: 4,
      title: "Magnesium: The Missing Mineral in Modern Diets",
      source: "Nutrition Today",
      time: "2d ago",
      category: "Diet",
      url: "#"
    },
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-white/5 h-full">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Newspaper size={20} className="text-blue-400" /> Latest Health News
      </h3>

      <div className="space-y-4">
        {articles.map((article) => (
          <a
            key={article.id}
            href={article.url}
            className="block group p-4 rounded-xl bg-black/20 hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
          >
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-blue-400 mb-1 block">
                  {article.category} • {article.source}
                </span>
                <h4 className="text-sm font-medium text-gray-200 group-hover:text-white leading-snug">
                  {article.title}
                </h4>
              </div>
              <ExternalLink size={14} className="text-gray-600 group-hover:text-blue-400 transition-colors shrink-0 mt-1" />
            </div>
            <div className="flex items-center gap-1 mt-3 text-[10px] text-gray-500">
              <Clock size={10} />
              <span>{article.time}</span>
            </div>
          </a>
        ))}
      </div>

      <button className="w-full mt-4 py-2 text-xs font-medium text-gray-400 hover:text-white transition-colors border-t border-white/5">
        View All Articles
      </button>
    </div>
  );
};
