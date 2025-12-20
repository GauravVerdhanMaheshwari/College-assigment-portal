import React, { useEffect, useState } from "react";

function OtherPaperBlock({
  paper,
  textCSS,
  onRequestPermission,
  onDownload,
  userID,
}) {
  const [accessStatus, setAccessStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      fetch(
        `http://localhost:3000/access-control/check/${paper._id}/${userID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => {
          if (response.status === 404) {
            throw new Error("Paper or user not found");
          }
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setAccessStatus(data);
          setLoading(false);
        });
    } catch (error) {
      console.error("Error logging paper:", error);
    }
  }, [paper._id, userID]);

  return loading ? (
    <div className="p-4 bg-white shadow-lg rounded-lg flex justify-between items-center mb-4">
      <p className="text-xl font-semibold text-[#073B4C]">Loading...</p>
    </div>
  ) : (
    <div
      key={paper._id}
      className="p-4 bg-white shadow-lg rounded-lg flex justify-between items-center mb-4"
    >
      <div>
        <p className="text-xl font-semibold text-[#073B4C]">{paper.title}</p>
        <p className="my-2 text-[#073B4C]">
          Assignment: {paper.topic || "General Submission"}
        </p>
        <p className="my-2 text-[#073B4C]">Subject: {paper.subject}</p>
        <p className={`my-2 text-mb font-semibold ${textCSS}`}>
          Submitted by: {paper.studentName}
        </p>
      </div>
      <div>
        {accessStatus.hasAccess === "granted" ? (
          <button
            className="px-3 py-1 rounded bg-blue-400 text-white text-center hover:bg-blue-500 transition-all duration-200 cursor-pointer"
            onClick={() => onDownload(paper._id)}
          >
            Download Paper
          </button>
        ) : accessStatus.hasAccess === "revoked" ? (
          <button
            className="px-3 py-1 rounded bg-green-400 text-white text-center hover:bg-green-500 transition-all duration-200 cursor-pointer"
            onClick={() => onRequestPermission(paper._id, paper.studentId)}
          >
            Ask for Access
          </button>
        ) : accessStatus.hasAccess === "requested" ? (
          <button className="px-3 py-1 rounded bg-yellow-400 text-white text-center cursor-not-allowed">
            Access Requested
          </button>
        ) : (
          <button
            className="px-3 py-1 rounded bg-green-400 text-white text-center hover:bg-green-500 transition-all duration-200 cursor-pointer"
            onClick={() => onRequestPermission(paper._id, paper.studentId)}
          >
            Ask for Access
          </button>
        )}
      </div>
    </div>
  );
}

export default OtherPaperBlock;
