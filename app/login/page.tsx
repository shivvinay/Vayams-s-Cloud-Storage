"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setMsg(data.message);

    router.push("/files");
  };

  return (
    <div className="flex min-h-screen bg-white justify-center items-center px-4">
      <img
        src="/favicon.ico"
        alt="Vayams Logo"
        className="fixed top-3 left-3 w-16 h-16 z-50 rounded-2xl"
      />

      <div className="w-full max-w-md sm:max-w-lg bg-black p-6 sm:p-8 rounded-xl">
        <h2 className="text-3xl sm:text-5xl lg:text-6xl text-center mb-8">
          Login
        </h2>

        <form onSubmit={submit}>
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

          <button className="w-full text-lg sm:text-2xl py-3 border-4 bg-amber-800 border-b-emerald-950 hover:bg-amber-400 rounded-lg">
            Login
          </button>
        </form>

        <p className="text-center mt-6">{msg}</p>
      </div>
    </div>
  );
}
