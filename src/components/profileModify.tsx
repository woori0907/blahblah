import React, { useEffect, useState } from "react";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { ProfileModifyProps } from "../routes/profile";
import { updateProfile } from "firebase/auth";
import { doc, runTransaction, updateDoc } from "firebase/firestore";

export default function ProfileModify({ setModalOpen }: ProfileModifyProps) {
  const user = auth.currentUser;
  const [profilePic, setProfilePic] = useState(user?.photoURL);
  const [prevName, setPrevName] = useState(user?.displayName);
  const [name, setName] = useState(user?.displayName);
  const [pic, setPic] = useState<File>();

  const onUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const onProfileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;
    setPic(e.target.files[0]);
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    try {
      if (pic) {
        const locationRef = ref(storage, `profiles/${user?.uid}`);
        const result = await uploadBytes(locationRef, pic);
        const url = await getDownloadURL(result.ref);
        setProfilePic(url);
        await updateProfile(user, {
          photoURL: url,
        });
      }
      if (name) {
        await updateProfile(user, {
          displayName: name,
        });
      }
      console.log(name);
    } catch (error) {
      console.log(error);
    } finally {
      setModalOpen(false);
    }
  };
  useEffect(() => {
    if (user === null) return;
    setName(user?.displayName);
  }, []);
  return (
    <section className="modal h-2/3 shadow-lg">
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
      <div className="basis-4/5 w-full">
        <form action="" className="flex flex-col gap-3" onSubmit={onSubmit}>
          <label htmlFor="profileUpload" className="cursor-pointer">
            {profilePic ? (
              <div className="w-28 rounded-full overflow-hidden">
                <img src={profilePic} alt="" />
              </div>
            ) : (
              <div className="w-28 rounded-full overflow-hidden">
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
              </div>
            )}
          </label>
          <input
            onChange={onProfileChange}
            className="hidden"
            type="file"
            id="profileUpload"
            accept=".jpg, .png"
          />
          <label htmlFor="name" className="font-bold">
            닉네임
          </label>
          <input
            onChange={onUserNameChange}
            type="text"
            className="rounded-lg border border-gray-200 p-3"
            name=""
            id="name"
            value={name ? name : ""}
          />
          <input
            className="w-28 rounded-full bg-sky-400 text-white font-bold py-3 opacity-50 cursor-pointer hover:opacity-100"
            type="submit"
            value="수정하기"
          />
        </form>
      </div>
    </section>
  );
}
