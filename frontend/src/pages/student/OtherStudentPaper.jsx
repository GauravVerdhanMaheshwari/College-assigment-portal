import React, { useState, useEffect } from "react";
import OtherPaperBlock from "../../components/OtherPaperBlock";

function OtherStudentPaper({ studentId, textCSS }) {
  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleDownload = (paperId) => {
    const downloadUrl = `http://localhost:3000/papers/${paperId}/download?studentId=${studentId}&role=student`;
    window.open(downloadUrl, "_blank");
  };

  const handlePermission = (paperId, requestedTo) => {
    try {
      const requestUrl = `http://localhost:3000/access-control/request/`;
      fetch(requestUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paperId: paperId,
          requestedBy: studentId,
          requestedTo: requestedTo,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then(() => {
          alert("Permission requested successfully!");
          window.location.reload();
        });
    } catch (error) {
      console.error("Error requesting permission:", error);
    }
  };

  useEffect(() => {
    try {
      const fetchPaper = async () => {
        const response = await fetch("http://localhost:3000/papers/public");
        const data = await response.json();

        setPaper(data.filter((p) => p.studentId !== studentId));
        setLoading(false);
      };

      fetchPaper();
    } catch (error) {
      console.error("Error fetching paper:", error);
    }
  }, [studentId]);

  return (
    <div className="p-4">
      <h1 className="my-2 text-2xl font-bold mb-4 text-[#073B4C]">
        Other Student Paper
      </h1>
      {loading && (
        <p className={`${textCSS} italic text-2xl text-center my-4`}>
          Loading papers...
        </p>
      )}
      {!paper || paper.length === 0 ? (
        <p className={`${textCSS} italic text-2xl text-center my-4`}>
          No public papers available.
        </p>
      ) : null}
      {paper ? (
        paper.map((p) => (
          <OtherPaperBlock
            key={p._id}
            paper={p}
            textCSS={textCSS}
            onDownload={handleDownload}
            onRequestPermission={handlePermission}
            userID={studentId}
          />
        ))
      ) : (
        <p>Loading paper...</p>
      )}
    </div>
  );
}

export default OtherStudentPaper;
