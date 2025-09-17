import React, { useState, useEffect } from "react";
import { Filter } from "../components/index";

function PapersList({ papers, textCSS, buttonCSS }) {
  const [filteredPapers, setFilteredPapers] = useState([]);
  const [isGrouped, setIsGrouped] = useState(false);

  useEffect(() => {
    setFilteredPapers(papers);
    setIsGrouped(false);
  }, [papers]);

  return (
    <div id="papersList" className="mx-20">
      <h2 className={`text-2xl font-bold text-center mb-5 ${textCSS}`}>
        Submitted Papers
      </h2>

      {/* 🔍 Filter */}
      <Filter
        data={papers}
        entityFields={[
          "Title",
          "Student Name",
          "Submission Date",
          "Class",
          "Section",
          "Course",
        ]}
        entityKeys={[
          "title",
          "studentName",
          "submissionDate",
          "class",
          "section",
          "course",
        ]}
        onFilter={(result, grouped) => {
          setFilteredPapers(result);
          setIsGrouped(grouped);
        }}
      />

      {/* 📑 Table */}
      <div className="max-h-80 overflow-y-auto border border-gray-300 rounded-lg p-4 shadow-md bg-white">
        {isGrouped ? (
          // 📂 Grouped mode
          Object.entries(filteredPapers).map(([group, items]) => (
            <div key={group} className="mb-6">
              <h3 className="text-lg font-bold mb-2">{group}</h3>
              <table className="min-w-full border-collapse border-none mb-4">
                <thead className="sticky top-0 bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border">Title</th>
                    <th className="px-4 py-2 border">Student Name</th>
                    <th className="px-4 py-2 border">Class</th>
                    <th className="px-4 py-2 border">Section</th>
                    <th className="px-4 py-2 border">Course</th>
                    <th className="px-4 py-2 border">Submission Date</th>
                    <th className="px-4 py-2 border">Download</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((paper) => (
                    <tr
                      key={paper._id}
                      className="hover:bg-gray-100 transition-all duration-200"
                    >
                      <td className="px-4 py-2 border">{paper.title}</td>
                      <td className="px-4 py-2 border">{paper.studentName}</td>
                      <td className="px-4 py-2 border">{paper.class}</td>
                      <td className="px-4 py-2 border">{paper.section}</td>
                      <td className="px-4 py-2 border">{paper.course}</td>
                      <td className="px-4 py-2 border">
                        {paper.submissionDate}
                      </td>
                      <td className="px-4 py-2 border">
                        <a
                          href={paper.fileLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`px-3 py-1 rounded-lg transition-all duration-200 inline-block font-semibold ${buttonCSS}`}
                        >
                          Download
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        ) : (
          // ➡ Flat list mode
          <table className="min-w-full border-collapse border-none">
            <thead className="sticky top-0 bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Title</th>
                <th className="px-4 py-2 border">Student Name</th>
                <th className="px-4 py-2 border">Class</th>
                <th className="px-4 py-2 border">Section</th>
                <th className="px-4 py-2 border">Course</th>
                <th className="px-4 py-2 border">Submission Date</th>
                <th className="px-4 py-2 border">Download</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(filteredPapers) &&
                filteredPapers.map((paper) => (
                  <tr
                    key={paper._id}
                    className="hover:bg-gray-100 transition-all duration-200"
                  >
                    <td className="px-4 py-2 border">{paper.title}</td>
                    <td className="px-4 py-2 border">{paper.studentName}</td>
                    <td className="px-4 py-2 border">{paper.class}</td>
                    <td className="px-4 py-2 border">{paper.section}</td>
                    <td className="px-4 py-2 border">{paper.course}</td>
                    <td className="px-4 py-2 border">{paper.submissionDate}</td>
                    <td className="px-4 py-2 border">
                      <div className="flex items-center">
                        <a
                          href={paper.fileLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`px-3 py-1 rounded-lg transition-all duration-200 inline-block font-semibold ${buttonCSS}`}
                        >
                          Download
                        </a>
                        <a
                          href={`/delete-paper/${paper._id}`}
                          className="text-red-600 hover:underline ml-3"
                        >
                          Delete
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}

              {Array.isArray(filteredPapers) && filteredPapers.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-gray-500 py-4">
                    No papers submitted yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default PapersList;
