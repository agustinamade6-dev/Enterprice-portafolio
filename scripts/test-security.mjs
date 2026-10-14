import { isValidExternalUrl, isSafeInternalUrl, isSafeProjectUrl } from "../src/lib/security.ts";

const tests = [
  // Casos válidos HTTPS
  { fn: isValidExternalUrl, input: "https://lv-racing-web.vercel.app/", expected: true, label: "Valid HTTPS URL" },
  { fn: isValidExternalUrl, input: "https://todo-suela.vercel.app/partidos?t=1", expected: true, label: "Valid HTTPS URL with query params" },
  { fn: isValidExternalUrl, input: "https://example.com:8443/test", expected: true, label: "Valid HTTPS URL with custom port" },
  { fn: isValidExternalUrl, input: "http://localhost:3000/demo", expected: true, label: "Localhost HTTP" },
  { fn: isValidExternalUrl, input: "http://127.0.0.1:8000/", expected: true, label: "127.0.0.1 HTTP" },

  // Ataques XSS y esquemas peligrosos
  { fn: isValidExternalUrl, input: "javascript:alert(1)", expected: false, label: "XSS javascript:" },
  { fn: isValidExternalUrl, input: "JAVASCRIPT:alert(document.domain)", expected: false, label: "XSS JAVASCRIPT: uppercase" },
  { fn: isValidExternalUrl, input: "  javascript:void(0)", expected: false, label: "XSS javascript with leading spaces" },
  { fn: isValidExternalUrl, input: "\x00javascript:alert(1)", expected: false, label: "XSS javascript with null byte" },
  { fn: isValidExternalUrl, input: "data:text/html,<script>alert(1)</script>", expected: false, label: "Data URL attack" },
  { fn: isValidExternalUrl, input: "DATA:image/svg+xml,...", expected: false, label: "DATA URL uppercase" },
  { fn: isValidExternalUrl, input: "vbscript:msgbox(1)", expected: false, label: "VBScript protocol" },
  { fn: isValidExternalUrl, input: "file:///etc/passwd", expected: false, label: "File protocol" },
  { fn: isValidExternalUrl, input: "blob:https://example.com/uuid", expected: false, label: "Blob URL" },

  // Malformed / Open redirects
  { fn: isValidExternalUrl, input: "//evil.com/phishing", expected: false, label: "Protocol-relative URL" },
  { fn: isValidExternalUrl, input: "https://", expected: false, label: "Incomplete HTTPS" },
  { fn: isValidExternalUrl, input: "", expected: false, label: "Empty string" },
  { fn: isValidExternalUrl, input: "   ", expected: false, label: "Whitespace string" },
  { fn: isValidExternalUrl, input: null, expected: false, label: "null input" },
  { fn: isValidExternalUrl, input: undefined, expected: false, label: "undefined input" },
  { fn: isValidExternalUrl, input: "not-a-valid-url", expected: false, label: "Arbitrary text" },

  // Rutas internas
  { fn: isSafeInternalUrl, input: "/proyectos/lv-racing/", expected: true, label: "Safe internal project path" },
  { fn: isSafeInternalUrl, input: "/legal/privacidad/", expected: true, label: "Safe legal path" },
  { fn: isSafeInternalUrl, input: "/", expected: true, label: "Safe root path" },
  { fn: isSafeInternalUrl, input: "//evil.com", expected: false, label: "Unsafe protocol-relative internal path" },
  { fn: isSafeInternalUrl, input: "\\\\evil.com", expected: false, label: "Backslash internal path" },
  { fn: isSafeInternalUrl, input: "javascript:alert(1)", expected: false, label: "javascript in internal validator" },

  // isSafeProjectUrl
  { fn: isSafeProjectUrl, input: "/proyectos/todo-suela/", expected: true, label: "isSafeProjectUrl internal" },
  { fn: isSafeProjectUrl, input: "https://todo-suela.vercel.app/", expected: true, label: "isSafeProjectUrl external https" },
  { fn: isSafeProjectUrl, input: "javascript:evil()", expected: false, label: "isSafeProjectUrl rejects javascript:" },
];

let passed = 0;
let failed = 0;

for (const t of tests) {
  const result = t.fn(t.input);
  if (result === t.expected) {
    passed++;
    console.log(`✅ [PASS] ${t.label}`);
  } else {
    failed++;
    console.error(`❌ [FAIL] ${t.label} | Expected: ${t.expected}, Got: ${result} | Input: ${t.input}`);
  }
}

console.log(`\nResultados: ${passed} pasados, ${failed} fallidos.`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log("¡Todas las pruebas de validación de seguridad pasaron exitosamente!");
}
