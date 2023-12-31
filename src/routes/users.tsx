import React, { useEffect, useState } from "react";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref } from "firebase/storage";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { ITweet } from "../components/timeline";
import Tweet from "../components/tweet";
import { useLocation } from "react-router-dom";
import UserTimeline from "../components/userTimeline";

export default function Users() {
  const user = auth.currentUser;
  const { state } = useLocation();
  const [profilePic, setProfilePic] = useState("");
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const [isFollow, setFollow] = useState(false);

  const fetchTweets = async () => {
    const tweetQuery = query(
      collection(db, "tweets"),
      where("userId", "==", state.userId),
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

  const InitUserProfile = async () => {
    // 다른 유저 프로필 페이지 들어갔을 때 상태 불러오는 함수
    const url = await getDownloadURL(ref(storage, `profiles/${state.userId}`));
    const snapshot = await getDoc(
      doc(db, `follows/${user?.uid}/followList`, state.userId)
    );
    setFollow(snapshot.exists());
    setProfilePic(url);
  };

  const toggleFollowState = async () => {
    if (user === null) return;
    if (isFollow === false) {
      //문서에 랜덤 아이디가 아니라 특정 아이디를 부여하고 싶다면 addDoc이 아니라 setDoc함수 사용하면 됨!
      await setDoc(doc(db, `follows/${user.uid}/followList`, state.userId), {
        isFollow: true,
      });
      setFollow(true);
    } else {
      await deleteDoc(doc(db, `follows/${user.uid}/followList`, state.userId));
      setFollow(false);
    }
  };

  useEffect(() => {
    InitUserProfile();

    fetchTweets();
  }, []);

  return (
    <section className="w-full basis-3/5 bg-white rounded-xl p-5 shadow-lg overflow-y-hidden flex flex-col">
      <section className="flex flex-col gap-3  py-7 px-5">
        <div className="flex justify-between items-baseline">
          <div className="w-28 rounded-full overflow-hidden">
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
          </div>

          {isFollow ? (
            <button
              className="py-1 px-5 border-2 border-sky-400 bg-sky-400 h-12 rounded-full text-white font-bold hover:bg-sky-400 hover:text-white hover:content-['언팔로우']"
              onClick={toggleFollowState}
            >
              팔로잉
            </button>
          ) : (
            <button
              className="py-1 px-5 border-2 border-sky-400 h-12 rounded-full text-sky-400 font-bold hover:bg-sky-400 hover:text-white"
              onClick={toggleFollowState}
            >
              팔로우
            </button>
          )}
        </div>
        <h1 className="font-bold text-2xl">{state.username ?? "Anonymous"}</h1>
      </section>
      <section className="overflow-y-scroll h-full">
        <UserTimeline userId={state.userId} />
      </section>
    </section>
  );
}
