import React, { useState } from "react";
import { auth, handleGoogleLogin } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import Join from "./join";

export default function Login() {
  const [isLoading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPwd] = useState("");
  const [error, setError] = useState("");
  const [isOpen, setOpen] = useState(false);
  const provider = new GoogleAuthProvider();
  const gitProvider = new GithubAuthProvider();
  const navigate = useNavigate();
  const handleLogin = async (flag: string) => {
    await signInWithPopup(auth, flag === "google" ? provider : gitProvider)
      .then((result) => {
        console.log(result);
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;

    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPwd(value);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading || email === "" || password === "") return;
    setError("");
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="w-screen flex bg-white">
      <div className="h-screen basis-1/2 bg-login bg-cover"></div>
      <div className="basis-1/2 flex flex-col itmes-center justify-center p-8 gap-3">
        <h1 className="text-3xl font-black">지금 일어나고 있는 일</h1>
        <p className="text-2xl">로그인하세요</p>
        <button
          className="flex justify-center  w-80 p-2 border border-gray-200 rounded-full hover:bg-gray-100"
          onClick={() => handleLogin("google")}
        >
          <div className="flex">
            <img src="/Google__G__Logo.svg" className="w-6 mr-3" alt="" />
            <span>Google 계정으로 로그인</span>
          </div>
        </button>
        <button
          className="flex justify-center w-80 p-2 border border-gray-200 rounded-full hover:bg-gray-100"
          onClick={() => handleLogin("git")}
        >
          <div className="flex">
            <img src="/github-logo.svg" className="w-6 mr-3" alt="" />
            <span>Github 계정으로 로그인</span>
          </div>
        </button>
        <div className="w-80 flex items-center">
          <div className="w-full h-0.5 basis 1/3 bg-gray-200"></div>
          <span className=" w-full basis 1/3 text-center">혹은</span>
          <div className="w-full h-0.5 basis 1/3 bg-gray-200"></div>
        </div>
        <form className="flex flex-col w-80 gap-2" onSubmit={onSubmit}>
          <input
            className="rounded-lg border border-gray-200 p-3"
            type="email"
            name="email"
            placeholder="이메일"
            onChange={onChange}
          />
          <input
            className="rounded-lg border border-gray-200 p-3"
            type="password"
            name="password"
            placeholder="비밀번호"
            onChange={onChange}
          />
          <input
            type="submit"
            value="로그인"
            className="flex justify-center w-80 p-2 border border-gray-200 rounded-full hover:bg-gray-100"
          />
        </form>
        {error !== "" ? <span>{error}</span> : null}
        <div>
          <span>계정이 없으신가요? </span>
          <span
            onClick={() => setOpen(true)}
            className="text-sky-400 font-bold"
          >
            계정 만들기
          </span>
        </div>
        <div>
          <span>비밀번호를 잊으셨나요? </span>
          <Link to="/resetpassword" className="text-sky-400 font-bold">
            비밀번호 찾기
          </Link>
        </div>
      </div>
      {isOpen && (
        <div className="w-full h-full absolute bg-gray-600/50">
          <Join setModalOpen={setOpen} />
        </div>
      )}
    </section>
  );
}
