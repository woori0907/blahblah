import React, { useEffect, useState } from "react";
import Tweet from "./tweet";
import { auth, db } from "../firebase";
import { ITweet } from "./timeline";
import { Unsubscribe } from "firebase/auth";
import {
  collection,
  documentId,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
type UserProps = {
  userId: string | undefined;
};

export default function UserTimeline({ userId }: UserProps) {
  const user = auth.currentUser;
  const [tweets, setTweet] = useState<ITweet[]>([]);
  const [isAllTweet, setIsAllTweet] = useState(true);
  const toggleTab = (state: boolean) => {
    setIsAllTweet(state);
    console.log(tweets.length);
  };
  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchTweets = async () => {
      let tweetQuery;
      let likedList = [];
      if (isAllTweet) {
        tweetQuery = query(
          collection(db, "tweets"),
          where("userId", "==", userId),
          orderBy("createdAt", "desc"),
          limit(25)
        );
      } else {
        const likedQuery = query(collection(db, `Liked/${userId}/tweet`));

        const snapShot = await getDocs(likedQuery);
        likedList = snapShot.docs.map((doc) => {
          return doc.id;
        });
        if (likedList.length === 0) {
          setTweet([]);
          return;
        }
        tweetQuery = query(
          collection(db, "tweets"),
          where(documentId(), "in", likedList),
          orderBy("createdAt", "desc"),
          limit(25)
        );
      }

      unsubscribe = await onSnapshot(tweetQuery, (snapshot) => {
        const tweets = snapshot.docs.map((doc) => {
          const { tweet, createdAt, userId, username, pic, liked } = doc.data();
          return {
            tweet,
            createdAt,
            userId,
            username,
            pic,
            liked,
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
    <section className=" h-full">
      <section className="flex w-full mb-4">
        <div
          className={
            "cursor-pointer py-4 basis-1/2 text-center hover:bg-gray-200 " +
            (isAllTweet ? "select-line" : "")
          }
          onClick={() => toggleTab(true)}
        >
          게시글
        </div>
        <div
          className={
            "cursor-pointer py-4 basis-1/2 text-center hover:bg-gray-200 " +
            (isAllTweet ? "" : "select-line")
          }
          onClick={() => toggleTab(false)}
        >
          마음에 들어요
        </div>
      </section>
      {tweets.length > 0 ? (
        tweets.map((tweet) => <Tweet key={tweet.id} {...tweet} />)
      ) : (
        <></>
      )}
    </section>
  );
}
