import React, { useState, useEffect } from "react";
import { ModalProps } from "../routes/join";
import { ITweet } from "./timeline";
import { TweetModifyProps } from "./tweet";
import { ref } from "firebase/storage";
import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";

export default function TweetModify({
  setModalOpen,
  id,
  userId,
  tweet,
}: TweetModifyProps) {
  const [newTweet, setNewTweet] = useState("");
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewTweet(e.target.value);
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const tweetRef = doc(db, "tweets", id);
      await updateDoc(tweetRef, {
        tweet: newTweet,
      });
    } catch (error) {
    } finally {
      setModalOpen(false);
    }
  };
  useEffect(() => {
    setNewTweet(tweet);
  }, []);
  return (
    <section className="modal h-1/3 shadow-lg">
      <div className="w-full basis-1/5">
        <button onClick={() => setModalOpen(false)}>
          <svg
            className="w-6"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div className="basis-4/5 flex flex-col w-full">
        <form action="" onSubmit={onSubmit} className="flex flex-col gap-3">
          <textarea
            className=" rounded-lg border border-gray-200 p-3 resize-none focus:outline-none focus:border-sky-400 focus:border-2 rounded-lg p-5"
            onChange={onChange}
            value={newTweet}
            name="tweet"
            maxLength={200}
            id=""
            rows={3}
            placeholder="무슨 일이 일어나고 있나요?"
          ></textarea>
          <input
            type="submit"
            className="bg-sky-400 text-white cursor-pointer p-3 px-4 rounded-full font-bold opacity-60 hover:opacity-100"
            value="수정하기"
          />
        </form>
      </div>
    </section>
  );
}
