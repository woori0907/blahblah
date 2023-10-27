import React, { useState, useEffect } from "react";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import {
  deleteDoc,
  doc,
  getDoc,
  increment,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { deleteObject, getDownloadURL, ref } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import TweetModify from "./tweetModify";

export interface TweetModifyProps {
  id: string;
  tweet: string;
  userId: string;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Tweet({
  username,
  pic,
  tweet,
  userId,
  id,
  liked,
}: ITweet) {
  const user = auth.currentUser;
  const [profilePic, setProfilePic] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();
  const onDeleteClick = async () => {
    if (user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "tweets", id));
      if (pic) {
        const picRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(picRef);
      }
    } catch (error) {
    } finally {
    }
  };
  const onModifyClick = async () => {
    if (user?.uid !== userId) return;
    try {
      const newTweet = prompt("수정할 내용을 입력하세요");
      const tweetRef = doc(db, "tweets", id);
      await updateDoc(tweetRef, {
        tweet: newTweet,
      });
    } catch (error) {
    } finally {
    }
  };
  const getUserProfilePic = async () => {
    const url = await getDownloadURL(ref(storage, `profiles/${userId}`));
    setProfilePic(url);
  };
  const handleUserClick = async () => {
    if (userId === user?.uid) {
      navigate("/profile");
    } else {
      const userInfo: object = { username, userId };
      navigate(`/${userId}`, { state: userInfo });
    }
  };
  const onLikeClick = async () => {
    await handleLiked();
  };

  const handleLiked = async () => {
    if (user === null) return;
    const tweetRef = doc(db, "tweets", id);
    try {
      if (isLiked) {
        await deleteDoc(doc(db, `Liked/${user.uid}/tweet`, id));
        await updateDoc(tweetRef, {
          liked: increment(-1),
        });
        setIsLiked(false);
      } else if (!isLiked) {
        await setDoc(doc(db, `Liked/${user.uid}/tweet`, id), {
          isLiked: true,
          addedAt: Date.now(),
        });
        await updateDoc(tweetRef, {
          liked: increment(1),
        });
        setIsLiked(true);
      }
    } catch (error) {}
  };

  const getLikeInfo = async () => {
    const snapshot = await getDoc(doc(db, `Liked/${user?.uid}/tweet`, id));
    setIsLiked(snapshot.exists());
  };

  const initTweet = () => {
    getLikeInfo();
    getUserProfilePic();
  };

  useEffect(() => {
    initTweet();
  }, []);
  return (
    <section className="border-b-2 border-gray-200 py-7 px-5 gap-5 w-full flex ">
      <div
        onClick={handleUserClick}
        className="cursor-pointer w-10 h-10 rounded-full overflow-hidden flex justify-center items-center"
      >
        {profilePic ? (
          <div>
            <img className="w-full" src={profilePic} />
          </div>
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
      <div className="w-full">
        <span
          className=" cursor-pointer font-extrabold"
          onClick={handleUserClick}
        >
          {username}
        </span>
        <p className="mb-3">{tweet}</p>
        <div className="w-72 rounded-xl overflow-hidden">
          {pic ? <img src={pic}></img> : null}
        </div>
        <div className="w-full flex justify-between pt-5">
          <div className="flex">
            <span className="w-8 h-8 cursor-pointer" onClick={onLikeClick}>
              {isLiked ? (
                <svg
                  className="w-6 fill-rose-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                </svg>
              ) : (
                <svg
                  className="w-6 stroke-2 stroke-gray-300"
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
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
              )}
            </span>
            <span>{liked}</span>
          </div>
          <div>
            {userId === user?.uid
              ? [
                  <button
                    onClick={() => setModalOpen(true)}
                    className="w-7 h-7 mr-2"
                  >
                    <svg
                      className="stroke-gray-400 hover:stroke-sky-400"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      ></path>
                    </svg>
                  </button>,
                  <button onClick={onDeleteClick} className="w-7 h-7 ">
                    <svg
                      className="stroke-gray-400 hover:stroke-sky-400"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      ></path>
                    </svg>
                  </button>,
                ]
              : null}
          </div>
        </div>
      </div>
      {isModalOpen ? (
        <TweetModify
          id={id}
          userId={userId}
          tweet={tweet}
          setModalOpen={setModalOpen}
        />
      ) : null}
    </section>
  );
}
