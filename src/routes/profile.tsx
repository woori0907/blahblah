import React, { useEffect, useState } from "react";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { ITweet } from "../components/timeline";
import Tweet from "../components/tweet";

export default function Profile() {
  const user = auth.currentUser;
  const [profilePic, setProfilePic] = useState(user?.photoURL);
  const [tweets, setTweets] = useState<ITweet[]>([]);

  const onProfileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!user) return;
    if (files && files.length === 1) {
      const file = files[0];
      const locationRef = ref(storage, `profiles/${user?.uid}`);
      const result = await uploadBytes(locationRef, file);
      const url = await getDownloadURL(result.ref);
      setProfilePic(url);
      await updateProfile(user, {
        photoURL: url,
      });
    }
  };

  const fetchTweets = async () => {
    const tweetQuery = query(
      collection(db, "tweets"),
      where("userId", "==", user?.uid),
      orderBy("createdAt", "desc"),
      limit(25)
    );
    const snapshot = await getDocs(tweetQuery);
    const tweets = snapshot.docs.map((doc) => {
      const { tweet, createdAt, userId, username, pic } = doc.data();
      return { tweet, createdAt, userId, username, pic, id: doc.id };
    });
    setTweets(tweets);
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  return (
    <section className="w-full basis-3/5 bg-white rounded-xl p-5 shadow-lg overflow-y-hidden flex flex-col">
      <label htmlFor="profileUpload">
        {profilePic ? (
          <img src={profilePic} alt="" />
        ) : (
          <svg
            className="stroke-sky-400"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        )}
      </label>
      <input
        onChange={onProfileChange}
        className="hidden"
        type="file"
        id="profileUpload"
        accept=".jpg, .png"
      />
      <span>{user?.displayName ?? "Anonymous"}</span>
      <section className="overflow-y-scroll h-full">
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </section>
    </section>
  );
}
