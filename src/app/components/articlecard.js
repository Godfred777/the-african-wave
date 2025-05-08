import React from "react";
import { formatDate, getSentimentClass, getSentimentText } from "../lib/utils";

//Article card component
// Displays the article title, image, source, publication date, sentiment, and category
// Also includes a debug mode that shows the raw data and image URL
const ArticleCard = ({ article, debugMode }) => {
  const hasImage = article.imageUrl && article.imageUrl.startsWith("http");

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-transform hover:-translate-y-1">
      <div className="h-44 bg-gray-100 flex items-center justify-center overflow-hidden">
        {hasImage ? (
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://via.placeholder.com/300x180?text=No+Image";
            }}
          />
        ) : (
          <img
            src="https://via.placeholder.com/300x180?text=No+Image"
            alt="No image available"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600"
          >
            {article.title}
          </a>
        </h3>

        <div className="text-gray-600 mb-1">
          {article.source || "Unknown source"}
        </div>
        <div className="text-gray-500 text-sm mb-2">
          {formatDate(article.pubDate || article.createdAt)}
        </div>

        <div className="flex flex-wrap gap-2">
          <span
            className={`inline-block px-2 py-1 rounded-full text-xs ${
              getSentimentClass(article.sentiment) === "positive"
                ? "bg-green-100 text-green-800"
                : getSentimentClass(article.sentiment) === "negative"
                ? "bg-red-100 text-red-800"
                : "bg-teal-100 text-teal-800"
            }`}
          >
            {getSentimentText(article.sentiment)}
          </span>

          <span className="inline-block px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
            {article.categoryML || "Uncategorized"}
          </span>
        </div>

        {debugMode && (
          <div className="mt-3 p-3 bg-gray-100 rounded-md text-xs text-gray-600 whitespace-pre-wrap overflow-x-auto">
            <strong>Image URL:</strong> {article.imageUrl || "null"}
            <br />
            <strong>Document ID:</strong> {article.id}
            <br />
            <strong>Raw Data:</strong>
            <pre>
              {JSON.stringify(
                article,
                (key, value) => {
                  if (key === "description") return "[Content truncated...]";
                  return value;
                },
                2
              )}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleCard;
