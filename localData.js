// Backend-free data layer for Day-45. Everything the app needs — accounts,
// exams, and results — lives in Local Storage instead of MongoDB/Express.
// No fetch() calls anywhere in this app talk to a server anymore.

const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

export const getUsers = () => read('lsUsers', []);
export const saveUsers = (users) => write('lsUsers', users);

export const getExams = () => read('lsExams', []);
export const saveExams = (exams) => write('lsExams', exams);

export const getResults = () => read('lsResults', []);
export const saveResults = (results) => write('lsResults', results);

//// A student may attempt any given exam only once. Every place that lets a
// student start/resume/submit an exam should route through this check.
export const hasAttempted = (examId, studentEmail) =>
  getResults().some((r) => r.examId === examId && r.studentEmail === studentEmail);
