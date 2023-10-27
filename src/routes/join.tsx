import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";

export interface ModalProps {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Join({ setModalOpen }: ModalProps) {
  const [isLoading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPwd] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;

    if (name === "username") {
      setName(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPwd(value);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading || name === "" || email === "" || password === "") return;
    setError("");
    try {
      setLoading(true);
      const credential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(credential.user, {
        displayName: name,
      });
      await sendEmailVerification(credential.user);
      alert("이메일 인증을 해주세요");
      setModalOpen(false);
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="modal">
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
      <div className="w-full basis-3/5 flex flex-col gap-3">
        <h1 className="text-2xl font-black">계정을 생성하세요</h1>
        <form className="flex flex-col gap-3" action="" onSubmit={onSubmit}>
          <input
            className="rounded-lg border border-gray-200 p-3"
            type="text"
            name="username"
            required
            placeholder="이름"
            onChange={onChange}
          />
          <input
            className="rounded-lg border border-gray-200 p-3"
            type="email"
            name="email"
            required
            placeholder="이메일"
            onChange={onChange}
          />
          <input
            className="rounded-lg border border-gray-200 p-3"
            type="password"
            name="password"
            required
            placeholder="비밀번호(6자 이상)"
            onChange={onChange}
          />
          <input
            className="bg-sky-400 text-white cursor-pointer p-3 px-4 rounded-full font-bold opacity-60 hover:opacity-100"
            type="submit"
            value={isLoading ? "Loading..." : "가입하기"}
          />
        </form>
        {error !== "" ? <span>{error}</span> : null}
      </div>
      <div className="w-full basis-1/5 flex">
        <p>이미 가입하셨나요? &nbsp;</p>
        <span
          className="text-sky-400 font-bold"
          onClick={() => setModalOpen(false)}
        >
          로그인
        </span>
      </div>
    </section>
  );
}
