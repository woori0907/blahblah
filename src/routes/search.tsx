import { Unsubscribe } from "firebase/auth";
import {
  collection,
  endAt,
  endBefore,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAt,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { ITweet } from "../components/timeline";
import Tweet from "../components/tweet";
export default function Search() {
  const [keyword, setKeyword] = useState("");
  const [tweets, setTweet] = useState<ITweet[]>([]);
  let unsubscribe: Unsubscribe | null = null;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const tweetQuery = query(
      collection(db, "tweets"),
      orderBy("createdAt", "desc"),
      where("tweet", "==", keyword),
      limit(25)
    );

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
  useEffect(() => {
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);
  return (
    <section className="w-full basis-3/5 bg-white rounded-xl p-5 shadow-lg overflow-y-hidden flex flex-col">
      <form onSubmit={onSubmit} className="w-full">
        <input
          className="w-full bg-gray-200 h-10 p-6 rounded-full focus:outline-none focus:border-sky-400 focus:border-2"
          type="text"
          name=""
          id=""
          placeholder="검색"
          onChange={onChange}
        />
      </form>
      <section>
        {tweets.length !== 0
          ? tweets.map((tweet) => <Tweet key={tweet.id} {...tweet} />)
          : null}
      </section>
    </section>
  );
}
