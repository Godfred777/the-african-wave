"use client";
import { useEffect, useState } from "react";
import { getBreakingNews } from "../lib/api/breakingNews";

export default function BreakingNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBreakingNews = async () => {
      try {
        const breakingNews = await getBreakingNews();
        setNews(breakingNews);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch breaking news");
        setLoading(false);
      }
    };

    fetchBreakingNews();
  }, []);

  if (loading) {
    return (
      <div className="w-full p-4 bg-white rounded-lg shadow-md">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-4 bg-red-50 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-green-800 mb-4">Breaking News</h2>
      <div className="space-y-4">
        {news.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h3 className="font-semibold text-lg text-green-700">
              {item.title}
            </h3>
            <p className="text-gray-600 mt-2">{item.content}</p>
            <div className="mt-2 text-sm text-gray-500">
              {new Date(item.timestamp?.toDate()).toLocaleString()}
            </div>
          </div>
        ))}
        {news.length === 0 && (
          <p className="text-gray-500 text-center">
            No breaking news at the moment.
          </p>
        )}
      </div>
    </div>
  );
}
