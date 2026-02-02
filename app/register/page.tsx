"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    setMsg(data.message);
  };

  const login = async () => {
    window.location.href = "/login";
  };

  return (
  <div className="flex min-h-screen bg-white justify-center items-center px-4">
     <img
        src="/favicon.ico"
        alt="Vayams Logo"
        className="fixed top-3 left-3 w-16 h-16 z-50 rounded-2xl"
      />
    <form
      onSubmit={submit}
      className="bg-black p-6 sm:p-8 rounded-xl w-full max-w-md sm:max-w-lg"
    >
      <h2 className="text-3xl sm:text-5xl lg:text-6xl text-center mb-8">
        Register
      </h2>

      <input
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
        className="w-full text-lg sm:text-2xl p-3 mb-4 border-2 rounded-lg"
      />

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        className="w-full text-lg sm:text-2xl p-3 mb-4 border-2 rounded-lg"
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        className="w-full text-lg sm:text-2xl p-3 mb-6 border-2 rounded-lg"
      />

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          type="submit"
          className="text-lg sm:text-2xl px-6 py-3 border-4 bg-amber-800 border-b-emerald-950 hover:bg-amber-400 rounded-lg"
        >
          SIGN UP
        </button>

        <button
          type="button"
          onClick={login}
          className="text-lg sm:text-2xl px-6 py-3 border-4 bg-amber-800 border-b-emerald-950 hover:bg-amber-400 rounded-lg"
        >
          Login
        </button>
      </div>

      <p className="text-center mt-6">{msg}</p>
    </form>
  </div>
);

}
