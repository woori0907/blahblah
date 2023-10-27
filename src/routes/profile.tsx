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
import UserTimeline from "../components/userTimeline";
import ProfileModify from "../components/profileModify";

export interface ProfileModifyProps {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Profile() {
  const user = auth.currentUser;
  const [profilePic, setProfilePic] = useState(user?.photoURL);
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);

  const fetchTweets = async () => {
    const tweetQuery = query(
      collection(db, "tweets"),
      where("userId", "==", user?.uid),
      orderBy("createdAt", "desc"),
      limit(25)
    );
    const snapshot = await getDocs(tweetQuery);
    const tweets = snapshot.docs.map((doc) => {
      const { tweet, createdAt, userId, username, pic, liked } = doc.data();
      return { tweet, createdAt, userId, username, pic, id: doc.id, liked };
    });
    setTweets(tweets);
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  return (
    <section className="w-full basis-3/5 bg-white rounded-xl p-5 shadow-lg overflow-y-hidden flex flex-col gap-5">
      <div className="flex flex-col gap-3  py-7 px-5">
        <div className="flex justify-between items-baseline">
          <div className="w-28 rounded-full overflow-hidden">
            {profilePic ? (
              <img src={profilePic} className="w-full" alt="" />
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
          </div>
          <button
            className="py-1 px-5 border-2 border-sky-400 h-12 rounded-full text-sky-400 font-bold hover:bg-sky-400 hover:text-white"
            onClick={() => setModalOpen(true)}
          >
            프로필 수정
          </button>
        </div>
        <h1 className="font-bold text-2xl">
          {user?.displayName ?? "Anonymous"}
        </h1>
      </div>

      <section className="overflow-y-scroll h-full">
        <UserTimeline userId={user?.uid} />
      </section>
      {isModalOpen ? <ProfileModify setModalOpen={setModalOpen} /> : null}
    </section>
  );
}
