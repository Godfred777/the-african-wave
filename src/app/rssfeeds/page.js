"use client";

import { useState, useEffect } from "react";
import { app } from "../lib/firebase";
import { getFirestore } from "firebase/firestore";
import ArticleCard from "../components/articlecard";
import {
  loadAllArticles,
  loadArticlesByCategory,
  exploreDatabase,
  searchCollection,
} from "../lib/api/rssFeeds";

export default function RssFeeds() {
  const [category, setCategory] = useState("all_articles");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successPaths, setSuccessPaths] = useState([]);
  const [debugMode, setDebugMode] = useState(true);
  const [exploring, setExploring] = useState(false);
  const [databaseStructure, setDatabaseStructure] = useState(null);

  useEffect(() => {
    const db = getFirestore(app);
  }, []);

  // Load articles based on category
  const handleLoadArticles = async () => {
    setLoading(true);
    setError(null);
    setSuccessPaths([]);
    setExploring(false);

    try {
      let result;
      if (category === "all_articles") {
        result = await loadAllArticles();
        if (result.articles.length > 0) {
          // Sort by date if possible
          result.articles.sort((a, b) => {
            const dateA = a.createdAt
              ? a.createdAt.toDate
                ? a.createdAt.toDate().getTime()
                : new Date(a.createdAt).getTime()
              : 0;
            const dateB = b.createdAt
              ? b.createdAt.toDate
                ? b.createdAt.toDate().getTime()
                : new Date(b.createdAt).getTime()
              : 0;
            return dateB - dateA;
          });

          setSuccessPaths(result.paths);
          setArticles(result.articles);
        } else {
          setError("No articles found in any of the typical database paths.");
        }
      } else {
        result = await loadArticlesByCategory(category);
        if (result.articles.length > 0) {
          setSuccessPaths([`Found articles at path: ${result.path}`]);
          setArticles(result.articles);
        } else {
          setError(
            `No articles found for category: ${category} in any of the typical paths`
          );
        }
      }
    } catch (error) {
      console.error("Error loading articles:", error);
      setError(`Error loading articles: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  // Explore database structure
  const handleExploreDatabase = async () => {
    setLoading(true);
    setError(null);
    setExploring(true);

    try {
      const structure = await exploreDatabase();
      setDatabaseStructure(structure);
    } catch (error) {
      console.error("Error exploring database:", error);
      setError(`Error exploring database: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Search for a specific collection
  const handleSearchCollection = async () => {
    const collectionPath = prompt(
      "Enter collection path (e.g., rss_articles/technology/articles)"
    );
    if (!collectionPath) return;

    setLoading(true);
    setError(null);
    setExploring(true);

    try {
      const result = await searchCollection(collectionPath);
      if (!result) {
        setError(`No documents found at path: ${collectionPath}`);
      } else {
        setDatabaseStructure(result);
      }
    } catch (error) {
      console.error("Error searching collection:", error);
      setError(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <main className="p-6 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-4">
          RSS Feed Explorer
        </h1>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8 space-y-4">
          <div className="flex flex-wrap gap-4 items-center">
            <select
              id="categorySelect"
              value={category}
              onChange={handleCategoryChange}
              className="px-4 py-2 text-black rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            >
              <option value="all_articles">All Articles</option>
              <option value="technology">Technology</option>
              <option value="business">Business</option>
              <option value="science">Science</option>
              <option value="health">Health</option>
              <option value="politics">Politics</option>
              <option value="entertainment">Entertainment</option>
              <option value="sports">Sports</option>
            </select>

            <button
              onClick={handleLoadArticles}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-sm transition-colors duration-200 font-medium"
            >
              Load Articles
            </button>

            {/* <button
              onClick={handleExploreDatabase}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg shadow-sm transition-colors duration-200 font-medium"
            >
              Explore Database
            </button> */}

            <button
              onClick={handleSearchCollection}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow-sm transition-colors duration-200 font-medium"
            >
              Search Collection
            </button>

            <button
              onClick={() => setDebugMode(!debugMode)}
              className="text-blue-600 hover:text-blue-800 underline text-sm font-medium transition-colors duration-200"
            >
              {debugMode ? "Hide Debug Info" : "Show Debug Info"}
            </button>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {error && (
          <div
            className={`p-4 rounded-lg mb-6 ${
              successPaths.length > 0
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {error}
          </div>
        )}

        {successPaths.length > 0 && (
          <div className="bg-green-50 text-green-800 p-4 rounded-lg mb-6 border border-green-200">
            <h3 className="font-semibold mb-2">Found articles in:</h3>
            <ul className="list-disc list-inside space-y-1">
              {successPaths.map((path, index) => (
                <li key={index}>{path}</li>
              ))}
            </ul>
          </div>
        )}

        {exploring && databaseStructure ? (
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Database Structure
            </h2>
            {databaseStructure.length === 0 ? (
              <p className="text-gray-600">
                No collections found in the database.
              </p>
            ) : (
              <div className="space-y-6">
                {databaseStructure.map((collection) => (
                  <div key={collection.id} className="border rounded-lg p-4">
                    <h3 className="text-xl font-semibold mb-3 text-gray-800">
                      Collection: {collection.id}
                    </h3>
                    {collection.documents.length === 0 ? (
                      <p className="text-gray-600 ml-4">
                        No documents in this collection
                      </p>
                    ) : (
                      <ul className="space-y-4">
                        {collection.documents.map((document) => (
                          <li
                            key={document.id}
                            className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                          >
                            <div className="font-medium text-gray-700">
                              Document ID: {document.id}
                            </div>
                            {document.fields ? (
                              <ul className="mt-2 space-y-1">
                                {document.fields.map((field, index) => (
                                  <li key={index} className="text-gray-600">
                                    <span className="font-medium">
                                      {field.key}:
                                    </span>{" "}
                                    {field.value}
                                  </li>
                                ))}
                                {Object.keys(document.data || {}).length >
                                  3 && <li className="text-gray-500">...</li>}
                              </ul>
                            ) : (
                              <pre className="mt-2 bg-gray-100 p-3 rounded-md overflow-x-auto text-sm">
                                {JSON.stringify(document.data, null, 2)}
                              </pre>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                debugMode={debugMode}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
