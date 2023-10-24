import {
  collection,
  collectionGroup,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import Tweet from "./tweet";
import { Unsubscribe } from "firebase/auth";

export interface ITweet {
  id: string;
  pic: string;
  tweet: string;
  userId: string;
  username: string;
  createdAt: number;
}

export default function Timeline() {
  const user = auth.currentUser;
  const [tweets, setTweet] = useState<ITweet[]>([]);
  const [isAllTweet, setIsAllTweet] = useState(true);
  const toggleTab = (state: boolean) => {
    setIsAllTweet(state);
  };

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchTweets = async () => {
      let tweetQuery;
      let followList = [];
      if (isAllTweet) {
        tweetQuery = query(
          collection(db, "tweets"),
          orderBy("createdAt", "desc"),
          limit(25)
        );
      } else {
        const followQuery = query(
          collection(db, `follows/${user?.uid}/followList`)
        );
        const snapShot = await getDocs(followQuery);
        followList = snapShot.docs.map((doc) => {
          return doc.id;
        });

        tweetQuery = query(
          collection(db, "tweets"),
          where("userId", "in", followList),
          orderBy("createdAt", "desc"),
          limit(25)
        );
      }

      unsubscribe = await onSnapshot(tweetQuery, (snapshot) => {
        const tweets = snapshot.docs.map((doc) => {
          const { tweet, createdAt, userId, username, pic } = doc.data();
          return {
            tweet,
            createdAt,
            userId,
            username,
            pic,
            id: doc.id,
          };
        });
        setTweet(tweets);
      });
    };
    fetchTweets();
    return () => {
      unsubscribe && unsubscribe();
    };
  }, [isAllTweet]);
  return (
    <section className="overflow-y-scroll h-full">
      <section className="flex w-full">
        <div className="basis-1/2 text-center" onClick={() => toggleTab(true)}>
          추천
        </div>
        <div className="basis-1/2 text-center" onClick={() => toggleTab(false)}>
          팔로우
        </div>
      </section>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </section>
  );
}
