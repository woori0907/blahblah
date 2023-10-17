import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";

export default function Join() {
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
      navigate("/login");
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <form action="" onSubmit={onSubmit}>
        <input
          type="text"
          name="username"
          placeholder="이름"
          onChange={onChange}
        />
        <input
          type="email"
          name="email"
          placeholder="이메일"
          onChange={onChange}
        />
        <input
          type="password"
          name="password"
          placeholder="비밀번호(6자 이상)"
          onChange={onChange}
        />
        <input type="submit" value={isLoading ? "Loading..." : "가입하기"} />
      </form>
      {error !== "" ? <span>{error}</span> : null}
      <div>
        <h2>이미 가입하셨나요?</h2>
        <Link to="/login">로그인</Link>
      </div>
    </section>
  );
}
