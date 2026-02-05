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

  // 🔴 Report state
  const [showReportBox, setShowReportBox] = useState(false);
  const [reportText, setReportText] = useState("");
  const [reportLoading, setReportLoading] = useState(false);

  // 🔹 Submit report
  const handleReportPaper = async () => {
    if (!reportText.trim()) {
      alert("Report reason cannot be empty");
      return;
    }

    try {
      setReportLoading(true);

      const res = await fetch("http://localhost:3000/reports/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: reportText,
          paperId: paper._id,
          reporterId: userID,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit report");

      alert("Report submitted successfully!");
      setReportText("");
      setShowReportBox(false);
    } catch (error) {
      console.error("Error reporting paper:", error);
      alert("Failed to submit report");
    } finally {
      setReportLoading(false);
    }
  };

  // 🔹 Check access
  useEffect(() => {
    fetch(`http://localhost:3000/access-control/check/${paper._id}/${userID}`)
      .then((res) => res.json())
      .then((data) => {
        setAccessStatus(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [paper._id, userID]);

  if (loading) {
    return (
      <div className="p-4 bg-white shadow-lg rounded-lg mb-4">Loading...</div>
    );
  }

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg mb-4">
      {/* 🔹 Paper info */}
      <div>
        <p className="text-xl font-semibold text-[#073B4C]">{paper.title}</p>
        <p className="my-1 text-[#073B4C]">
          Assignment: {paper.topic || "General Submission"}
        </p>
        <p className="my-1 text-[#073B4C]">Subject: {paper.subject}</p>
        <p className={`my-1 font-semibold ${textCSS}`}>
          Submitted by: {paper.studentName}
        </p>
      </div>

      {/* 🔹 Actions */}
      <div className="mt-4 flex flex-col gap-4">
        {/* 🚩 Report Paper */}
        <button
          className="self-start text-white bg-red-400 hover:bg-red-500 px-3 py-1 rounded"
          onClick={() => setShowReportBox((prev) => !prev)}
        >
          🚩 Report Paper
        </button>

        {/* 📝 Report Box */}
        {showReportBox && (
          <div className="border rounded p-3 bg-red-50">
            <textarea
              rows={3}
              className="w-full border rounded p-2 text-sm"
              placeholder="Explain why you are reporting this paper..."
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
            />

            <div className="flex gap-2 mt-2">
              <button
                onClick={handleReportPaper}
                disabled={reportLoading}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
              >
                {reportLoading ? "Submitting..." : "Submit Report"}
              </button>

              <button
                onClick={() => {
                  setShowReportBox(false);
                  setReportText("");
                }}
                className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* 🔐 Access logic */}
        {accessStatus.hasAccess === "granted" ? (
          <button
            className="px-3 py-1 rounded bg-blue-400 text-white hover:bg-blue-500"
            onClick={() => onDownload(paper._id)}
          >
            Download Paper
          </button>
        ) : accessStatus.hasAccess === "requested" ? (
          <button className="px-3 py-1 rounded bg-yellow-400 text-white cursor-not-allowed">
            Access Requested
          </button>
        ) : (
          <button
            className="px-3 py-1 rounded bg-green-400 text-white hover:bg-green-500"
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
