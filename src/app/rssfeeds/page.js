"use client";

import { useState, useEffect } from "react";
import { app } from "../lib/firebase";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  limit,
  where,
} from "firebase/firestore";
import ArticleCard from "../components/articlecard";

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
  const loadArticles = async () => {
    setLoading(true);
    setError(null);
    setSuccessPaths([]);
    setExploring(false);

    try {
      const db = getFirestore();
      let allArticles = [];
      let paths = [];

      if (category === "all_articles") {
        // Try different collection paths based on our investigation
        const possiblePaths = [
          {
            type: "nested",
            collection: "rss_articles",
            subcollections: [
              "technology",
              "business",
              "science",
              "health",
              "politics",
              "entertainment",
              "sports",
            ],
          },
          // Alternative path: maybe all articles are in one collection
          { type: "direct", collection: "rss_articles" },
          // Another possibility: articles collection at root
          { type: "direct", collection: "articles" },
          // Try with different casing
          {
            type: "nested",
            collection: "RSS_Articles",
            subcollections: [
              "technology",
              "business",
              "science",
              "health",
              "politics",
              "entertainment",
              "sports",
            ],
          },
          // Try with categoryML value as document ID
          {
            type: "nested",
            collection: "rss_articles",
            subcollections: [
              "Technology",
              "Business",
              "Science",
              "Health",
              "Politics",
              "Entertainment",
              "Sports",
            ],
          },
        ];

        // Try all possible paths
        for (const path of possiblePaths) {
          if (path.type === "direct") {
            try {
              const articlesRef = collection(db, path.collection);
              const articlesQuery = query(articlesRef, limit(50));
              const snapshot = await getDocs(articlesQuery);

              if (!snapshot.empty) {
                snapshot.forEach((doc) => {
                  allArticles.push({
                    id: doc.id,
                    ...doc.data(),
                    _path: path.collection,
                  });
                });
                paths.push(`Direct collection: ${path.collection}`);
              }
            } catch (e) {
              console.log(`Error with path ${path.collection}:`, e);
            }
          } else if (path.type === "nested") {
            for (const subCol of path.subcollections) {
              try {
                // Try as document -> subcollection
                const nestedPath = `${path.collection}/${subCol}/articles`;
                const articlesRef = collection(
                  db,
                  path.collection,
                  subCol,
                  "articles"
                );
                const articlesQuery = query(articlesRef, limit(20));
                const snapshot = await getDocs(articlesQuery);

                if (!snapshot.empty) {
                  snapshot.forEach((doc) => {
                    allArticles.push({
                      id: doc.id,
                      ...doc.data(),
                      _path: nestedPath,
                      _category: subCol,
                    });
                  });
                  paths.push(`Nested path: ${nestedPath}`);
                }

                // Also try with direct category value as document
                const directCategoryPath = `${path.collection}/${subCol}`;
                const directRef = doc(db, path.collection, subCol);
                const directSnapshot = await getDoc(directRef);

                if (directSnapshot.exists()) {
                  allArticles.push({
                    id: directSnapshot.id,
                    ...directSnapshot.data(),
                    _path: directCategoryPath,
                    _category: subCol,
                  });
                  paths.push(`Direct document: ${directCategoryPath}`);
                }
              } catch (e) {
                console.log(
                  `No articles found for path: ${path.collection}/${subCol}/articles`
                );
              }
            }
          }
        }

        if (allArticles.length > 0) {
          // Sort by date if possible
          allArticles.sort((a, b) => {
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

          setSuccessPaths(paths);
          setArticles(allArticles);
        } else {
          setError("No articles found in any of the typical database paths.");
        }
      } else {
        // Try multiple possible paths for specific category
        const possiblePaths = [
          // Standard path
          { path: `rss_articles/${category}/articles` },
          // Category as collection
          { path: `${category}` },
          // CategoryML may be stored with different casing
          {
            path: `rss_articles/${
              category.charAt(0).toUpperCase() + category.slice(1)
            }/articles`,
          },
          // Maybe just a flat structure
          { path: `rss_articles` },
          // Or articles at root
          { path: `articles` },
        ];

        let categoryArticles = [];
        let foundPath = null;

        // Try each path
        for (const { path } of possiblePaths) {
          try {
            const components = path.split("/");

            if (components.length === 1) {
              // Direct collection
              const collectionRef = collection(db, components[0]);
              let queryRef;

              // For direct collections, try to filter by category if it's the "articles" or "rss_articles" collection
              if (
                components[0] === "articles" ||
                components[0] === "rss_articles"
              ) {
                queryRef = query(
                  collectionRef,
                  where("categoryML", "==", category),
                  limit(50)
                );
              } else {
                queryRef = query(collectionRef, limit(50));
              }

              const snapshot = await getDocs(queryRef);

              if (!snapshot.empty) {
                snapshot.forEach((doc) => {
                  categoryArticles.push({
                    id: doc.id,
                    ...doc.data(),
                    _path: path,
                  });
                });
                foundPath = path;
                break;
              }
            } else if (components.length === 3) {
              // Collection/Document/Subcollection
              const subcollectionRef = collection(
                db,
                components[0],
                components[1],
                components[2]
              );
              const queryRef = query(subcollectionRef, limit(50));
              const snapshot = await getDocs(queryRef);

              if (!snapshot.empty) {
                snapshot.forEach((doc) => {
                  categoryArticles.push({
                    id: doc.id,
                    ...doc.data(),
                    _path: path,
                  });
                });
                foundPath = path;
                break;
              }
            }
          } catch (e) {
            console.log(`Error with path ${path}:`, e);
          }
        }

        if (categoryArticles.length > 0) {
          setSuccessPaths([`Found articles at path: ${foundPath}`]);
          setArticles(categoryArticles);
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
  const exploreDatabase = async () => {
    setLoading(true);
    setError(null);
    setExploring(true);

    try {
      const db = getFirestore();
      const knownCollections = ["rss_articles", "articles", "RSS_Articles"];
      let structure = [];

      for (const collectionId of knownCollections) {
        try {
          const collectionRef = collection(db, collectionId);
          const querySnapshot = await getDocs(query(collectionRef, limit(5)));

          if (!querySnapshot.empty) {
            const collectionData = {
              id: collectionId,
              documents: [],
            };

            querySnapshot.forEach((docSnapshot) => {
              const docData = docSnapshot.data();
              const fields = Object.keys(docData)
                .slice(0, 3)
                .map((key) => {
                  let displayValue = "";
                  const value = docData[key];

                  if (value === null) {
                    displayValue = "null";
                  } else if (typeof value === "object") {
                    displayValue = "Object";
                  } else {
                    displayValue = String(value).substring(0, 50);
                    if (String(value).length > 50) displayValue += "...";
                  }

                  return { key, value: displayValue };
                });

              collectionData.documents.push({
                id: docSnapshot.id,
                fields,
              });
            });

            structure.push(collectionData);
          }
        } catch (error) {
          console.error(`Error exploring collection ${collectionId}:`, error);
        }
      }

      setDatabaseStructure(structure);
    } catch (error) {
      console.error("Error exploring database:", error);
      setError(`Error exploring database: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Search for a specific collection
  const searchCollection = async () => {
    const collectionPath = prompt(
      "Enter collection path (e.g., rss_articles/technology/articles)"
    );
    if (!collectionPath) return;

    setLoading(true);
    setError(null);
    setExploring(true);

    try {
      const db = getFirestore();
      const pathComponents = collectionPath.split("/");
      let querySnapshot;

      if (pathComponents.length === 1) {
        // Simple collection path
        const collectionRef = collection(db, pathComponents[0]);
        querySnapshot = await getDocs(query(collectionRef, limit(10)));
      } else if (pathComponents.length === 3) {
        // Collection > Document > Subcollection
        const subcollectionRef = collection(
          db,
          pathComponents[0],
          pathComponents[1],
          pathComponents[2]
        );
        querySnapshot = await getDocs(query(subcollectionRef, limit(10)));
      } else {
        throw new Error(
          'Invalid path format. Use format: "collection" or "collection/document/subcollection"'
        );
      }

      if (querySnapshot.empty) {
        setError(`No documents found at path: ${collectionPath}`);
      } else {
        const documents = [];
        querySnapshot.forEach((doc) => {
          documents.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setDatabaseStructure([
          {
            id: collectionPath,
            documents,
          },
        ]);
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
              className="px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
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
              onClick={loadArticles}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-sm transition-colors duration-200 font-medium"
            >
              Load Articles
            </button>

            <button
              onClick={exploreDatabase}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg shadow-sm transition-colors duration-200 font-medium"
            >
              Explore Database
            </button>

            <button
              onClick={searchCollection}
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
