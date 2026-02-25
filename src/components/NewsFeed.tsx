import React from 'react';
import { Newspaper, ExternalLink } from 'lucide-react';

export const NewsFeed: React.FC = () => {
  const articles = [
    {
      title: "New Study Links Sleep Duration to Longevity",
      source: "Health Science Journal",
      summary: "Research suggests that consistent 7-8 hours of sleep correlates with a 12% increase in life expectancy.",
      time: "2h ago"
    },
    {
      title: "High-Intensity Interval Training vs. Steady State Cardio",
      source: "Fitness Daily",
      summary: "A comparative analysis on metabolic efficiency and fat loss over a 12-week period.",
      time: "5h ago"
    },
    {
      title: "The Role of Vitamin D in Immune Function",
      source: "Nutrition Today",
      summary: "Why maintaining optimal Vitamin D levels is crucial during the winter months.",
      time: "1d ago"
    },
     {
      title: "Meditation and Cortisol Levels",
      source: "MindBody Research",
      summary: "Just 10 minutes of daily mindfulness practice can significantly lower stress hormones.",
      time: "2d ago"
    }
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl h-full">
      <div className="flex items-center gap-2 mb-6">
        <Newspaper className="text-purple-400" size={20} />
        <h3 className="text-lg font-bold text-white">Health Briefing</h3>
      </div>

      <div className="space-y-4">
        {articles.map((article, i) => (
          <div key={i} className="group cursor-pointer p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
            <div className="flex justify-between items-start mb-1">
              <h4 className="text-sm font-semibold text-gray-200 group-hover:text-blue-400 transition-colors line-clamp-1">
                {article.title}
              </h4>
              <span className="text-[10px] text-gray-600 whitespace-nowrap ml-2">{article.time}</span>
            </div>
            <p className="text-xs text-gray-500 line-clamp-2 mb-2">
              {article.summary}
            </p>
            <div className="flex items-center gap-1 text-[10px] text-gray-600">
               <span className="font-medium text-gray-500">{article.source}</span>
               <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
