"use client";
import { useEffect, useState } from "react";

type Song = {
  _id: string;
  name: string;
  url?: string;
  mimeType?: string;
  size?: number;
  objectName: string;
};

export default function SongList() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/craete-db")
      .then((res) => res.json())
      .then((data) => setSongs(data.songs || []))
      .catch(console.error);
  }, []);

  const handleDelete = async (id: string) => {
    if (!id) {
      console.error("Delete called with undefined id");
      return;
    }

    const ok = confirm("Are you sure?");
    if (!ok) return;

    try {
      const res = await fetch(`/api/delete/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Delete error:", text);
        alert("Delete failed");
        return;
      }

      setSongs((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const renderPreview = (song: Song) => {
    if (!song.url || !song.mimeType) {
      return <p className="text-gray-400">No preview available</p>;
    }

    // 🖼 Image
    if (song.mimeType.startsWith("image/")) {
      return (
        <img
          src={song.url}
          alt={song.name}
          className="w-64 rounded-md border"
        />
      );
    }

    // 🎥 Video
    if (song.mimeType.startsWith("video/")) {
      return (
        <video controls className="w-64 rounded-md border">
          <source src={song.url} type={song.mimeType} />
        </video>
      );
    }

    // 🔊 Audio
    if (song.mimeType.startsWith("audio/")) {
      return (
        <audio controls className="w-64">
          <source src={song.url} type={song.mimeType} />
        </audio>
      );
    }

    // 📄 Other files
    return (
      <a href={song.url} target="_blank" className="text-blue-500 underline">
        Open file
      </a>
    );
  };

  return (
    <div className=" relative flex flex-col text-black bg-blue-100 min-h-screen p-12 m-5 items-center border-8 border-amber-700 rounded-md  justify-center px-4 sm:px-6 md:px-8 overflow-auto sm:overflow-auto flex-wrap ">
       <img
        src="/favicon.ico"
        alt="Vayams Logo"
        className="fixed top-3 left-3 w-16 h-16 z-50 rounded-2xl"
      />
      <div className="   ">
        <button
          onClick={() => {
            window.location.href = "/";
          }}
          className="fixed hidden sm:block top-3 right-3  text-lg sm:text-2xl px-6 py-3 border-4 bg-amber-200  border-b-emerald-950 hover:bg-amber-100 rounded-lg "
        >
          upload
        </button>
        <button
          onClick={() => (window.location.href = "/")}
          className="sm:hidden absolute top-3 right-3 flex flex-col gap-1"
        >
          <span className="w-6 h-0.5 bg-amber-200"></span>
          <span className="w-6 h-0.5 bg-amber-200"></span>
          <span className="w-6 h-0.5 bg-amber-200"></span>
        </button>

        <h2 className=" flex justify-center items-center text-lg sm:text-2xl md:text-4xl font-bold p-10 ">
          Uploaded Files
        </h2>

        <ul className="flex flex-col space-y-6  overflow-auto flex-wrap ">
          {songs.map((song) => (
            <li
              key={song._id}
              className="border p-4  rounded-md  bg-purple-100 flex flex-col items-center"
            >
              <p className="font-semibold">{song.name}</p>

              <div className="my-2 ">{renderPreview(song)}</div>

              <p className="text-amber-400">
                Type: {song.mimeType || "Unknown"}
              </p>
              <p className="text-amber-300">
                Size: {song.size ? `${song.size} bytes` : "Unknown"}
              </p>
              <button
                className="text-red-700"
                onClick={() => handleDelete(song._id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
