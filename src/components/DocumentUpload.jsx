import { useState } from "react";
import React from "react";


export default function DocumentUpload() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("document", file);

    // // Send to backend
    // await fetch("/api/upload", {
    //   method: "POST",
    //   body: formData,
    // });

    alert("Uploaded!");
  };

  return (
    <div className="flex flex-col w-fit gap-2 items-center border-black/10 border p-2 mt-4 rounded-lg">
      <span className="font-semibold text-green-700 mb-1">Upload Floor Plan</span>
      <div className="flex gap-2 items-center">
        <input
          type="file"
          onChange={handleFileChange}
          className="hidden"
          id="fileInput"
        />
        <label
          htmlFor="fileInput"
          className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          Choose File
        </label>
        {file && <span>{file.name}</span>}
        <button
          onClick={handleUpload}
          className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
        >
          Upload
        </button>
      </div>
    </div>
  );
}
