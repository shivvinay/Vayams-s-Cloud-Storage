"use client";

import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // ✅ MongoDB PART — UNCHANGED
  const mongoUploadFile = async (data: any) => {
    if (!file) return;

    try {
      setStatus("Uploading to MongoDB...");

      const res = await fetch("/api/craete-db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to upload file to MongoDB");
      }

      setStatus("Upload to MongoDB successful ✅");
    } catch (error) {
      console.error(error);
      setStatus("Error uploading file to MongoDB ❌");
    }
  };

  /* ✅ FIXED UPLOAD (NO CORS)
  const uploadHandle = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    try {
      setStatus("Uploading file...");

      const formData = new FormData();
      formData.append("file", file);

      // 🔥 Upload via Next.js API (CORS-free)
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      // expected:
      // { name, url, mimeType, size, objectName }

      if (!data?.objectName) {
        throw new Error("objectName missing");
      }

      // ✅ Save to MongoDB (AS-IS)
      await mongoUploadFile(data);

      setStatus("Upload successful ✅");
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
    } catch (err) {
      console.error(err);
      setStatus("Upload failed ❌");
    }
  };
*/

  const uploadHandle = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    try {
      setStatus("Requesting upload URL...");

      // 1️⃣ Get signed URL
      const res = await fetch("/api/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
        }),
      });

      const { uploadUrl, key } = await res.json();

      // 2️⃣ Upload directly to MinIO (NO size limit)
      setStatus("Uploading directly to storage...");

      await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      const fileData = {
        name: file.name,
        objectName: key,
        mimeType: file.type,
        size: file.size,
        url: `https://minio.vayams.in/vayam/${key}`,
      };

      // 3️⃣ Save metadata to MongoDB
      await mongoUploadFile(fileData);

      setStatus("Upload successful ✅");
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
    } catch (err) {
      console.error(err);
      setStatus("Upload failed ❌");
    }
  };

  const logout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="p-4 text-black bg-white min-h-screen flex items-center justify-center">
      <img
        src="/favicon.ico"
        alt="Vayams Logo"
        className="fixed top-3 left-3 w-16 h-16 z-50 rounded-2xl"
      />

      <button
        onClick={logout}
        className="text-4xl absolute bottom-5 right-3 border-4 bg-amber-100 border-b-emerald-950 hover:bg-amber-200 rounded-b-lg"
      >
        logout
      </button>

      <button
        onClick={() => (window.location.href = "/files")}
        className="text-4xl absolute top-3 right-3 border-4 bg-amber-100 border-b-emerald-950 hover:bg-amber-200 rounded-b-lg animate-pulse"
      >
        CLOUD
      </button>

      <div className="flex flex-col gap-4 w-96">
        <h1 className="text-xl font-bold text-center top-44">UPLOAD PAGE</h1>

        <input
          ref={inputRef}
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="text-black"
        />

        <button
          type="button"
          onClick={uploadHandle}
          className="bg-orange-600 rounded-3xl py-2"
        >
          Upload
        </button>

        <p>{status}</p>
      </div>
    </div>
  );
};

export default UploadPage;
