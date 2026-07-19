// Thin wrapper around Judge0 CE — a free, keyless, public code execution API
// (https://ce.judge0.com). No backend of our own is needed: the browser talks
// to Judge0 directly, sends source code + stdin, and gets back stdout/stderr.
// Judge0 CE is community-run and rate-limited, so every call here is
// defensive: short timeouts, clear error messages, and a graceful fallback
// path in the caller if the service is briefly unavailable.

const JUDGE0_BASE = 'https://ce.judge0.com';

// Maps the language values used throughout this app to Judge0 "language_id".
export const LANGUAGE_IDS = {
  javascript: 63, // Node.js
  python: 71,     // Python 3.8.1
  java: 62,       // OpenJDK 13.0.1
  cpp: 54,        // GCC 9.2.0
  c: 50           // GCC 9.2.0
};

export const LANGUAGE_LABELS = {
  javascript: 'JavaScript (Node.js)',
  python: 'Python 3',
  java: 'Java',
  cpp: 'C++',
  c: 'C'
};

const STARTER_SNIPPETS = {
  javascript: '// Read stdin, write your answer to stdout\nconst input = require(\'fs\').readFileSync(0, \'utf8\').trim();\n\nconsole.log(input);\n',
  python: '# Read stdin, write your answer to stdout\nimport sys\ndata = sys.stdin.read().strip()\n\nprint(data)\n',
  java: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        StringBuilder input = new StringBuilder();\n        while (sc.hasNextLine()) input.append(sc.nextLine());\n\n        System.out.println(input.toString());\n    }\n}\n',
  cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    string line, input;\n    while (getline(cin, line)) input += line;\n\n    cout << input << endl;\n    return 0;\n}\n',
  c: '#include <stdio.h>\n\nint main() {\n    char buf[1024];\n    fgets(buf, sizeof(buf), stdin);\n\n    printf("%s", buf);\n    return 0;\n}\n'
};

export const getStarterCode = (lang) => STARTER_SNIPPETS[lang] || '// Write your code here...\n';

// Runs one piece of source code against one stdin string and resolves with a
// normalized result object. Uses Judge0's synchronous "wait=true" mode so we
// don't need to poll — good enough for short student-submitted snippets.
export const runCode = async (lang, sourceCode, stdin = '') => {
  const languageId = LANGUAGE_IDS[lang];
  if (!languageId) {
    return { ok: false, error: `Unsupported language: ${lang}` };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(`${JUDGE0_BASE}/submissions?base64_encoded=false&wait=true`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language_id: languageId,
        source_code: sourceCode,
        stdin,
        cpu_time_limit: 5,
        wall_time_limit: 10
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (res.status === 429) {
      return { ok: false, error: 'The free compiler API is rate-limited right now. Wait a few seconds and try again.' };
    }
    if (!res.ok) {
      return { ok: false, error: `Compiler service returned an error (HTTP ${res.status}).` };
    }

    const data = await res.json();
    const statusDesc = data.status?.description || 'Unknown';
    const output = (data.stdout || '').replace(/\n$/, '');
    const errorOutput = data.stderr || data.compile_output || '';

    return {
      ok: true,
      status: statusDesc,
      statusId: data.status?.id,
      stdout: output,
      stderr: errorOutput,
      time: data.time,
      memory: data.memory,
      success: data.status?.id === 3 // 3 == "Accepted" (ran without error)
    };
  } catch (err) {
    clearTimeout(timeout);
    if (err.name === 'AbortError') {
      return { ok: false, error: 'The compiler took too long to respond. Please try again.' };
    }
    return { ok: false, error: 'Could not reach the free compiler API. Check your connection and try again.' };
  }
};

// Runs source code against a list of {input, output} test cases and reports
// a pass/fail per case. Stops gracefully (marks remaining as "skipped") if
// the API becomes unavailable partway through, instead of throwing.
export const runTestCases = async (lang, sourceCode, testCases = []) => {
  const results = [];
  let apiFailed = false;

  for (const tc of testCases) {
    const expected = (tc.output || '').trim();

    // A test case with no expected output can never meaningfully grade code —
    // treat it as invalid rather than letting any output (including none)
    // count as a pass. This closes the "any code passes" hole caused by
    // exams saved with a blank expected-output field.
    if (!expected) {
      results.push({ input: tc.input, expected: tc.output, actual: '', passed: false, skipped: true, error: 'Test case has no expected output configured — ask your instructor to fix this exam.' });
      continue;
    }

    if (apiFailed) {
      results.push({ input: tc.input, expected: tc.output, actual: '', passed: false, skipped: true });
      continue;
    }

    const run = await runCode(lang, sourceCode, tc.input || '');
    if (!run.ok) {
      apiFailed = true;
      results.push({ input: tc.input, expected: tc.output, actual: '', passed: false, skipped: true, error: run.error });
      continue;
    }

    const actual = (run.stdout || '').trim();
    results.push({
      input: tc.input,
      expected: tc.output,
      actual: run.stdout,
      passed: run.success && actual === expected,
      stderr: run.stderr
    });
  }

  return { results, apiFailed };
};
