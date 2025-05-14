import { db } from "../firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

export const getBreakingNews = async () => {
  try {
    const breakingNewsRef = collection(db, "breaking_news");
    const q = query(breakingNewsRef, orderBy("timestamp", "desc"), limit(5));
    const querySnapshot = await getDocs(q);

    const news = [];
    querySnapshot.forEach((doc) => {
      news.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return news;
  } catch (error) {
    console.error("Error fetching breaking news:", error);
    throw error;
  }
};
