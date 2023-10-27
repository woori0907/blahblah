import { Unsubscribe } from "firebase/auth";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { ITweet } from "../components/timeline";
import Tweet from "../components/tweet";
import { useLocation } from "react-router-dom";
export default function SearchForm() {
  const [keyword, setKeyword] = useState("");
  const [tweets, setTweet] = useState<ITweet[]>([]);
  let unsubscribe: Unsubscribe | null = null;
  const location = useLocation();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    if (e.target.value.length === 0) {
      setKeyword("");
      setTweet([]);
    }
  };
  const searchResult = async (key: string) => {
    const tweetQuery = query(
      collection(db, "tweets"),
      orderBy("createdAt", "desc"),
      where("tweet", "==", key),
      limit(25)
    );

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
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    searchResult(keyword);
  };
  useEffect(() => {
    if (location.state.searchKey !== null) {
      setKeyword(location.state.searchKey);
      searchResult(location.state.searchKey);
    } else if (location.state.searchKey === null) {
      setKeyword("");
    }
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  return (
    <>
      <form onSubmit={onSubmit} className="w-full">
        <input
          className="w-full bg-gray-200 h-10 p-6 rounded-full focus:outline-none focus:border-sky-400 focus:border-2"
          type="text"
          name=""
          id=""
          value={keyword}
          placeholder="검색"
          onChange={onChange}
        />
      </form>
      <section>
        {tweets.length !== 0
          ? tweets.map((tweet) => <Tweet key={tweet.id} {...tweet} />)
          : null}
      </section>
    </>
  );
}
