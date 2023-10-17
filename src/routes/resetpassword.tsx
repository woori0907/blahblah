import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase";
import { FirebaseError } from "firebase/app";

export default function Resetpassword() {
  const [email, setEmail] = useState("");
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    setEmail(value);
  };
  const onEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section>
      <form action="" onSubmit={onEmailSubmit}>
        <input type="email" name="email" id="" onChange={onChange} />
        <input type="submit" value="전송" />
      </form>
    </section>
  );
}
