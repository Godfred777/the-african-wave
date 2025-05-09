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
import { app } from "../firebase";

export const loadAllArticles = async () => {
  const db = getFirestore();
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
    { type: "direct", collection: "rss_articles" },
    { type: "direct", collection: "articles" },
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

  let allArticles = [];
  let paths = [];

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

  return { articles: allArticles, paths };
};

export const loadArticlesByCategory = async (category) => {
  const db = getFirestore();
  const possiblePaths = [
    { path: `rss_articles/${category}/articles` },
    { path: `${category}` },
    {
      path: `rss_articles/${
        category.charAt(0).toUpperCase() + category.slice(1)
      }/articles`,
    },
    { path: `rss_articles` },
    { path: `articles` },
  ];

  let categoryArticles = [];
  let foundPath = null;

  for (const { path } of possiblePaths) {
    try {
      const components = path.split("/");

      if (components.length === 1) {
        const collectionRef = collection(db, components[0]);
        let queryRef;

        if (components[0] === "articles" || components[0] === "rss_articles") {
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

  return { articles: categoryArticles, path: foundPath };
};

export const exploreDatabase = async () => {
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

  return structure;
};

export const searchCollection = async (collectionPath) => {
  const db = getFirestore();
  const pathComponents = collectionPath.split("/");
  let querySnapshot;

  if (pathComponents.length === 1) {
    const collectionRef = collection(db, pathComponents[0]);
    querySnapshot = await getDocs(query(collectionRef, limit(10)));
  } else if (pathComponents.length === 3) {
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
    return null;
  }

  const documents = [];
  querySnapshot.forEach((doc) => {
    documents.push({
      id: doc.id,
      data: doc.data(),
    });
  });

  return [
    {
      id: collectionPath,
      documents,
    },
  ];
};
