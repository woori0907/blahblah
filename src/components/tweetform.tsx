import { addDoc, collection, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export default function Tweetform() {
  const [isLoading, setLoading] = useState(false);
  const [tweet, setTweet] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const user = auth.currentUser;

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);
  };
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      setFile(files[0]);
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || isLoading || tweet === "" || tweet.length > 200) return;

    try {
      setLoading(true);
      const doc = await addDoc(collection(db, "tweets"), {
        tweet,
        createdAt: Date.now(),
        username: user.displayName || "Anonymous",
        userId: user.uid,
      });
      if (file) {
        const locationRef = ref(
          storage,
          `tweets/${user.uid}-${user.displayName}/${doc.id}`
        );
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        updateDoc(doc, {
          pic: url,
        });
      }
      setTweet("");
      setFile(null);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="flex w-full gap-5 px-5">
      <div className="pt-5">
        {user?.photoURL ? (
          <div className="rounded-full overflow-hidden w-11 h-11">
            <img className="w-full" src={user.photoURL}></img>
          </div>
        ) : (
          <svg
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
      <form className="flex flex-col w-full" onSubmit={onSubmit}>
        <textarea
          className="resize-none focus:outline-none focus:border-sky-400 focus:border-2 rounded-lg p-5"
          onChange={onChange}
          value={tweet}
          name="tweet"
          maxLength={200}
          id=""
          rows={5}
          placeholder="무슨 일이 일어나고 있나요?"
        ></textarea>
        <div className="w-full h-px bg-gray-200 my-5"></div>
        <div className="flex flex-row justify-between">
          <label
            htmlFor="photo"
            className="flex  justify-center items-center w-11 h-11 cursor-pointer transition-colors rounded-full hover:bg-sky-50 p-2"
          >
            <svg
              className="stroke-sky-400 stroke-2"
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
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              ></path>
            </svg>
          </label>
          <input
            className="hidden"
            type="file"
            onChange={onFileChange}
            name="photo"
            id="photo"
            accept="image/*"
          />
          <input
            type="submit"
            className="bg-sky-400 text-white cursor-pointer p-3 px-4 rounded-full font-bold opacity-60 hover:opacity-100"
            value="게시하기"
          />
        </div>
      </form>
    </section>
  );
}
