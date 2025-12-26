"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";

const SunEditor = dynamic(() => import("suneditor-react"), { ssr: false });

export default function EditBlog() {
  const { id } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch(`/api/blog/${id}`, { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        setTitle(data.title ??"");
        setDescription(data.description ?? "");
        setContent(data.content ?? "");
        
      });
  }, [id]);

  const handleUpdate = async () => {
    const res = await fetch("/api/blog/edit", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id, title, description, content, }),
    });

    if (res.ok) {
      alert("Blog updated");
      router.push("/dashboard/myBlog");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Edit Blog</h1>

      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="w-full p-3 border mb-3"
      />

      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        className="w-full p-3 border mb-3 h-24"
      />

      <SunEditor setContents={content} onChange={setContent} />

      <button
        onClick={handleUpdate}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded"
      >
        Update Blog
      </button>
    </div>
  );
}
