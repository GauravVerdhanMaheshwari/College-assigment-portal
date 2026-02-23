import React, { useMemo } from "react";
import PremiumMultiSelect from "./PremiumMultiSelect";
import {
  FACULTY_MAP,
  COURSE_OPTIONS,
  SEMESTER_OPTIONS,
  DIVISION_OPTIONS,
} from "../config/facultyMap";

function FacultySmartFields({ value, onChange }) {
  // 🔥 derive subjects based on course + semester
  const subjectOptions = useMemo(() => {
    return [
      ...new Set(
        FACULTY_MAP.filter(
          (f) =>
            (value.course.length === 0 || value.course.includes(f.course)) &&
            (value.semester.length === 0 ||
              value.semester.includes(f.semester)),
        ).map((f) => f.subject),
      ),
    ];
  }, [value.course, value.semester]);

  // 🔥 subject auto-fill
  const handleSubjectChange = (subjects) => {
    const matched = FACULTY_MAP.filter((f) => subjects.includes(f.subject));

    const autoCourses = [...new Set(matched.map((m) => m.course))];
    const autoSemesters = [...new Set(matched.map((m) => m.semester))];

    onChange({
      ...value,
      subject: subjects,
      course: autoCourses.length ? autoCourses : value.course,
      semester: autoSemesters.length ? autoSemesters : value.semester,
    });
  };

  const updateField = (key, val) => {
    onChange({ ...value, [key]: val });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <PremiumMultiSelect
        label="Course"
        options={COURSE_OPTIONS}
        value={value.course}
        onChange={(v) => updateField("course", v)}
      />

      <PremiumMultiSelect
        label="Semester"
        options={SEMESTER_OPTIONS}
        value={value.semester}
        onChange={(v) => updateField("semester", v)}
      />

      <PremiumMultiSelect
        label="Subject"
        options={subjectOptions}
        value={value.subject}
        onChange={handleSubjectChange}
      />

      <PremiumMultiSelect
        label="Division"
        options={DIVISION_OPTIONS}
        value={value.division}
        onChange={(v) => updateField("division", v)}
      />
    </div>
  );
}

export default FacultySmartFields;
