import React, { useState, useEffect } from "react";

function OtherStudentPaper({ studentId, textCSS }) {
  const [paper, setPaper] = useState(null);

  const handleDownload = (paperId) => {
    const downloadUrl = `http://localhost:3000/papers/${paperId}/download?studentId=${studentId}&role=student`;
    window.open(downloadUrl, "_blank");
  };

  useEffect(() => {
    try {
      const fetchPaper = async () => {
        const response = await fetch("http://localhost:3000/papers/public");
        const data = await response.json();
        console.log(data);

        setPaper(data.filter((p) => p.studentId !== studentId));
      };

      fetchPaper();
    } catch (error) {
      console.error("Error fetching paper:", error);
    }
  }, [studentId]);

  console.log(paper);

  return (
    <div className="p-4">
      <h1 className="my-2 text-2xl font-bold mb-4 text-[#073B4C]">
        Other Student Paper
      </h1>

      {!paper || paper.length === 0 ? (
        <p className={`${textCSS} italic text-2xl text-center my-4`}>
          No public papers available.
        </p>
      ) : null}

      {paper ? (
        paper.map((p) => (
          <div
            key={p._id}
            className="p-4 bg-white shadow-lg rounded-lg flex justify-between items-center mb-4"
          >
            <div>
              <p className="text-xl font-semibold text-[#073B4C]">{p.title}</p>
              <p className="my-2 text-[#073B4C]">
                Assignment: {p.topic || "General Submission"}
              </p>
              <p className="my-2 text-[#073B4C]">Subject: {p.subject}</p>
              <p className={`my-2 text-mb font-semibold ${textCSS}`}>
                Submitted by: {p.studentName}
              </p>
            </div>
            <div>
              <button
                className="px-3 py-1 rounded bg-blue-400 text-white text-center hover:bg-blue-500 transition-all duration-200 cursor-pointer"
                onClick={() => handleDownload(p._id)}
              >
                Download Paper
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>Loading paper...</p>
      )}
    </div>
  );
}

export default OtherStudentPaper;
