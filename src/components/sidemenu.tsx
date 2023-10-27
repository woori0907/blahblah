import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function SideMenu() {
  const [searchKey, setKeyword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate("/search", { state: { searchKey } });
  };
  return (
    <section className="w-full basis-1/5 bg-white rounded-xl p-5 flex flex-col gap-7 shadow-lg">
      <form onSubmit={onSubmit} className="w-full">
        <input
          className="w-full bg-gray-200 h-10 p-6 rounded-full focus:outline-none focus:border-sky-400 focus:border-2"
          type="text"
          name=""
          id=""
          placeholder="검색"
          onChange={onChange}
        />
      </form>
    </section>
  );
}
