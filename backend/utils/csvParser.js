import csv    from "csv-parser";
import { Readable } from "stream";

/**
 * parseCSV
 * Parses CSV file content into an array of row objects.
 * Returns array of rows with original header keys.
 */
export const parseCSV = (fileContent) => {
  return new Promise((resolve, reject) => {
    const results = [];

    const stream = Readable.from([fileContent]);

    stream
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end",  () => resolve(results))
      .on("error",(error) => reject(error));
  });
};

/* ─────────────────────────────────────────────────────────────
   HELPER: findColumn
   Searches the raw header keys of a row for a match against
   multiple accepted aliases (case-insensitive, trimmed).
   Returns the ORIGINAL key string so we can do row[key].
───────────────────────────────────────────────────────────── */
const findColumn = (rawKeys, aliases) => {
  const normAliases = aliases.map(a => a.toLowerCase().trim());
  return rawKeys.find(key => normAliases.includes(key.toLowerCase().trim()));
};

/* ─────────────────────────────────────────────────────────────
   validateStudentCSV
   Flexible column validation that accepts multiple aliases
   for each required field.

   Accepted columns (case-insensitive):
     Name / Student Name  → name
     USN / usn             → usn
     Email / email         → email
     Year / year           → year
     Section / section     → section
     Course / Department   → department

   Returns:
     { valid: true, columnMap: { name, usn, email, year, section, department } }
     | { valid: false, message: string }
───────────────────────────────────────────────────────────── */
export const validateStudentCSV = (rows) => {
  if (!rows || rows.length === 0) {
    return {
      valid: false,
      message: "❌ Uploaded CSV file is empty. Please upload a valid CSV file."
    };
  }

  const rawKeys = Object.keys(rows[0]);

  // Each entry: [fieldLabel, [accepted aliases...]]
  const fieldDefs = [
    ["Name",       ["student name", "name", "student_name", "studentname", "full name", "fullname"]],
    ["USN",        ["usn", "student usn", "roll number", "roll no", "rollno", "enrollment", "enrollment no"]],
    ["Email",      ["email", "email id", "emailid", "student email", "email address"]],
    ["Year",       ["year", "academic year", "batch year", "batch"]],
    ["Section",    ["section", "sec", "class section"]],
    ["Course",     ["course", "department", "dept", "course name", "program", "branch"]]
  ];

  const columnMap = {};
  const missing   = [];

  for (const [label, aliases] of fieldDefs) {
    const found = findColumn(rawKeys, aliases);
    if (found) {
      columnMap[label.toLowerCase()] = found; // store original CSV key
    } else {
      missing.push(label);
    }
  }

  if (missing.length > 0) {
    return {
      valid: false,
      message:
        `❌ Invalid Student CSV Format.\n` +
        `Missing columns: ${missing.join(", ")}.\n` +
        `Required columns: Name (or Student Name), USN, Email, Year, Section, Course (or Department).`
    };
  }

  return { valid: true, columnMap };
};

/* ─────────────────────────────────────────────────────────────
   mapStudentRow
   Maps a single CSV row object using the resolved columnMap
   from validateStudentCSV. Returns a clean object ready for
   MongoDB insertion.
───────────────────────────────────────────────────────────── */
export const mapStudentRow = (row, columnMap) => {
  return {
    name:       row[columnMap["name"]]?.trim()                  || "",
    usn:        row[columnMap["usn"]]?.toUpperCase().trim()     || "",
    email:      row[columnMap["email"]]?.toLowerCase().trim()   || "",
    year:       row[columnMap["year"]]?.trim()                  || "",
    section:    row[columnMap["section"]]?.toUpperCase().trim() || "",
    department: row[columnMap["course"]]?.trim()                || "",
    registered: false
  };
};

/* ─────────────────────────────────────────────────────────────
   validateTeacherCSV
   Flexible column validation for teacher CSV uploads.

   Accepted columns (case-insensitive):
     Staff ID / staffid      → staffId
     Teacher Name / Name     → name
     Email ID / Email        → email
     Department / Dept       → department

   Returns:
     { valid: true, columnMap }
     | { valid: false, message: string }
───────────────────────────────────────────────────────────── */
export const validateTeacherCSV = (rows) => {
  if (!rows || rows.length === 0) {
    return {
      valid: false,
      message: "❌ Uploaded CSV file is empty. Please upload a valid CSV file."
    };
  }

  const rawKeys = Object.keys(rows[0]);

  const fieldDefs = [
    ["Staff ID",     ["staff id", "staffid", "staff_id", "teacher id", "teacherid", "id"]],
    ["Teacher Name", ["teacher name", "teachername", "name", "full name", "fullname", "faculty name"]],
    ["Email",        ["email id", "emailid", "email", "email address", "teacher email"]],
    ["Department",   ["department", "dept", "department name", "branch", "subject"]]
  ];

  const columnMap = {};
  const missing   = [];

  for (const [label, aliases] of fieldDefs) {
    const found = findColumn(rawKeys, aliases);
    if (found) {
      columnMap[label.toLowerCase()] = found;
    } else {
      missing.push(label);
    }
  }

  if (missing.length > 0) {
    return {
      valid: false,
      message:
        `❌ Invalid Teacher CSV Format.\n` +
        `Missing columns: ${missing.join(", ")}.\n` +
        `Required columns: Staff ID, Teacher Name (or Name), Email (or Email ID), Department.`
    };
  }

  return { valid: true, columnMap };
};

/* ─────────────────────────────────────────────────────────────
   mapTeacherRow
   Maps a single CSV row using the resolved columnMap.
───────────────────────────────────────────────────────────── */
export const mapTeacherRow = (row, columnMap) => {
  return {
    staffId:    row[columnMap["staff id"]]?.toUpperCase().trim()     || "",
    name:       row[columnMap["teacher name"]]?.trim()               || "",
    email:      row[columnMap["email"]]?.toLowerCase().trim()        || "",
    department: row[columnMap["department"]]?.trim()                  || "",
    registered: false
  };
};
