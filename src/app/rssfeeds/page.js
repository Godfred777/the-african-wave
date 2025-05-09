"use client";

import { useState, useEffect } from "react";
import { app, auth } from "../lib/firebase";
import { getFirestore } from "firebase/firestore";
import { signOut } from "firebase/auth";
import ArticleCard from "../components/articlecard";
import { useAuth } from "../lib/AuthContext";
import { useRouter } from "next/navigation";
import {
  loadAllArticles,
  loadArticlesByCategory,
  exploreDatabase,
  searchCollection,
} from "../lib/api/rssFeeds";

export default function RssFeeds() {
  const { user, authLoading } = useAuth();
  const router = useRouter();
  const [category, setCategory] = useState("all_articles");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchPath, setSearchPath] = useState("");
  const [debugMode, setDebugMode] = useState(true);
  const [exploring, setExploring] = useState(false);
  const [databaseStructure, setDatabaseStructure] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/sign-in");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const db = getFirestore(app);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
      setError("Failed to sign out. Please try again.");
    }
  };

  // Load articles based on category
  const handleLoadArticles = async () => {
    setLoading(true);
    setError(null);
    setExploring(false);

    try {
      let result;
      if (category === "all_articles") {
        result = await loadAllArticles();
        if (result.articles.length > 0) {
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
          setArticles(result.articles);
        } else {
          setError("No articles found in any of the typical database paths.");
        }
      } else {
        result = await loadArticlesByCategory(category);
        if (result.articles.length > 0) {
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

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

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

  const handleSearchCollection = async (e) => {
    e.preventDefault();
    if (!searchPath) return;

    setLoading(true);
    setError(null);
    setExploring(true);

    try {
      const result = await searchCollection(searchPath);
      if (!result) {
        setError(`No documents found at path: ${searchPath}`);
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
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-amber-50">
      <main className="p-4 md:p-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b border-green-700/20 pb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-green-900 mb-4 md:mb-0">
            <span className="inline-block">
              <svg
                className="w-8 h-8 mr-2 inline-block text-green-800"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 11a9 9 0 0 1 9 9" />
                <path d="M4 4a16 16 0 0 1 16 16" />
                <circle cx="5" cy="19" r="1" />
              </svg>
              RSS Feed Explorer
            </span>
          </h1>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 text-white bg-green-800 hover:bg-green-900 rounded-lg shadow-md transition-colors duration-200 flex items-center"
          >
            <svg
              className="w-4 h-4 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign Out
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-4 md:p-6 mb-8 space-y-4 border border-green-700/10">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex items-center bg-green-50 rounded-lg p-1 border border-green-100 shadow-sm">
              <svg
                className="w-5 h-5 text-green-700 ml-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              <select
                id="categorySelect"
                value={category}
                onChange={handleCategoryChange}
                className="px-3 py-2 text-green-900 bg-transparent rounded-lg focus:outline-none focus:ring-1 focus:ring-green-700 transition-colors font-medium"
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
            </div>

            <button
              onClick={handleLoadArticles}
              className="bg-green-700 hover:bg-green-800 text-white px-5 py-2 rounded-lg shadow-md transition-colors duration-200 font-medium flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Load Articles
            </button>

            {/* <button
              onClick={handleExploreDatabase}
              className="bg-amber-100 hover:bg-amber-200 text-green-900 border border-amber-200 px-5 py-2 rounded-lg shadow-sm transition-colors duration-200 font-medium flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2 text-green-800"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              Explore Database
            </button> */}

            <form
              onSubmit={handleSearchCollection}
              className="flex-1 flex flex-col md:flex-row gap-2 w-full md:w-auto"
            >
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-green-600"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchPath}
                  onChange={(e) => setSearchPath(e.target.value)}
                  placeholder="Enter collection path (e.g., rss_articles/technology/articles)"
                  className="w-full pl-10 pr-4 py-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 bg-green-50/50 text-green-900 placeholder-green-700/50"
                />
              </div>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-200 font-medium flex items-center justify-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                Search
              </button>
            </form>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-800 p-4 rounded-lg mb-6 border border-red-200 flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-red-600"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        {exploring && databaseStructure ? (
          <div className="bg-white shadow-lg rounded-xl p-4 md:p-6 mb-6 border border-green-700/10">
            <h2 className="text-2xl font-bold mb-4 text-green-900 flex items-center">
              <svg
                className="w-6 h-6 mr-2 text-green-800"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              Database Structure
            </h2>
            {databaseStructure.length === 0 ? (
              <p className="text-green-700">
                No collections found in the database.
              </p>
            ) : (
              <div className="space-y-6">
                {databaseStructure.map((collection) => (
                  <div
                    key={collection.id}
                    className="border border-green-100 rounded-lg p-4 bg-green-50/50 shadow-sm"
                  >
                    <h3 className="text-xl font-semibold mb-3 text-green-900 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-green-700"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                      Collection: {collection.id}
                    </h3>
                    {collection.documents.length === 0 ? (
                      <p className="text-green-600 ml-4">
                        No documents in this collection
                      </p>
                    ) : (
                      <ul className="space-y-4">
                        {collection.documents.map((document) => (
                          <li
                            key={document.id}
                            className="bg-white rounded-lg p-4 border border-green-100 shadow-sm"
                          >
                            <div className="font-medium text-green-800 flex items-center">
                              <svg
                                className="w-4 h-4 mr-2 text-green-600"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                              </svg>
                              Document ID: {document.id}
                            </div>
                            {document.fields ? (
                              <ul className="mt-2 space-y-1 pl-6">
                                {document.fields.map((field, index) => (
                                  <li
                                    key={index}
                                    className="text-green-700 flex"
                                  >
                                    <span className="font-medium min-w-20 mr-2">
                                      {field.key}:
                                    </span>{" "}
                                    <span className="text-green-900">
                                      {field.value}
                                    </span>
                                  </li>
                                ))}
                                {Object.keys(document.data || {}).length >
                                  3 && <li className="text-green-500">...</li>}
                              </ul>
                            ) : (
                              <pre className="mt-2 bg-green-50 p-3 rounded-md overflow-x-auto text-sm text-green-900 border border-green-100">
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
          <>
            {articles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    debugMode={debugMode}
                  />
                ))}
              </div>
            ) : (
              !loading &&
              !error && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <svg
                    className="w-16 h-16 text-green-700/40 mb-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 11a9 9 0 0 1 9 9" />
                    <path d="M4 4a16 16 0 0 1 16 16" />
                    <circle cx="5" cy="19" r="1" />
                  </svg>
                  <h3 className="text-xl font-medium text-green-800 mb-2">
                    No Articles Loaded
                  </h3>
                  <p className="text-green-600 max-w-md">
                    Select a category and click Load Articles to see your RSS
                    feeds.
                  </p>
                </div>
              )
            )}
          </>
        )}
      </main>
    </div>
  );
}
