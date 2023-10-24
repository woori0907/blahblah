import React, { useState } from "react";
import { auth, handleGoogleLogin } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

export default function Login() {
  const [isLoading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPwd] = useState("");
  const [error, setError] = useState("");
  const provider = new GoogleAuthProvider();

  const navigate = useNavigate();
  const handleLogin = async () => {
    await signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result);
        navigate("/");
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
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
    <section>
      <button onClick={handleLogin}>Login With Google</button>
      <form onSubmit={onSubmit}>
        <input
          type="email"
          name="email"
          placeholder="이메일"
          onChange={onChange}
        />
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          onChange={onChange}
        />
        <input type="submit" value="로그인" />
      </form>
      {error !== "" ? <span>{error}</span> : null}
      <div>
        <Link to="/join">계정 만들기</Link>
      </div>
      <div>
        <Link to="/resetpassword">비밀번호 찾기</Link>
      </div>
    </section>
  );
}
