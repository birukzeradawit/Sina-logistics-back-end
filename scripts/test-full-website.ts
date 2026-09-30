import { readFileSync, existsSync } from "fs";
import { resolve, join } from "path";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { spawn } from "child_process";
import http from "http";

// 1. Load Environment Variables
for (const file of [".env.local", ".env"]) {
  try {
    const text = readFileSync(resolve(process.cwd(), file), "utf8");
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq < 1) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {}
}

const prisma = new PrismaClient();

interface TestResult {
  category: string;
  test: string;
  status: "PASS" | "FAIL" | "WARN";
  detail?: string;
}

const results: TestResult[] = [];

function record(category: string, test: string, status: "PASS" | "FAIL" | "WARN", detail?: string) {
  results.push({ category, test, status, detail });
  const icon = status === "PASS" ? "✓" : status === "WARN" ? "⚠" : "✗";
  console.log(`[${status}] ${icon} [${category}] ${test} ${detail ? `(${detail})` : ""}`);
}

// -------------------------------------------------------------
// Test Category 1: Static Asset & Image File Verification
// -------------------------------------------------------------
async function testStaticAssets() {
  console.log("\n--- RUNNING STATIC ASSETS & FILES VERIFICATION ---");
  const publicDir = resolve(process.cwd(), "public");
  const assetsDir = resolve(publicDir, "assets");

  const requiredAssets = [
    "assets/logo-icon.png",
    "assets/procurement-supply.jpg",
    "assets/logistics-1.jpg",
    "assets/logistics-2.jpg",
    "assets/logistics-3.jpg",
    "assets/events.jpg",
    "assets/property-management.jpg",
    "assets/staff-recruitment.jpg",
    "assets/operational-support.jpg",
    "assets/trade-supply.jpg",
    "assets/construction-real-estate.jpg",
    "assets/energy-mining-agriculture.jpg",
    "assets/professional-consulting.jpg",
    "assets/sina-who-we-are.jpg",
    "assets/sina-operations.jpg",
    "assets/boardroom-bw.png",
    "assets/port-sunset.png",
    "assets/port-crane-bw.png",
  ];

  for (const relPath of requiredAssets) {
    const fullPath = join(publicDir, relPath);
    if (existsSync(fullPath)) {
      record("Assets", `File exists: ${relPath}`, "PASS");
    } else {
      record("Assets", `File exists: ${relPath}`, "FAIL", `Missing file at ${fullPath}`);
    }
  }
}

// -------------------------------------------------------------
// Test Category 2: Sector Codes & Business Data Verification
// -------------------------------------------------------------
async function testSectorData() {
  console.log("\n--- RUNNING SECTOR CODES & DB VERIFICATION ---");
  const expectedSectors = [
    { code: "PS - 001", slug: "procurement", name: "Procurement & Supply" },
    { code: "LD - 002", slug: "logistics", name: "Logistics & Delivery" },
    { code: "EO - 003", slug: "events", name: "Event Organizing" },
    { code: "PO - 004", slug: "property", name: "Property Management" },
    { code: "SRO - 005", slug: "staffing", name: "Staff Recruitment & Outsourcing" },
    { code: "AOS - 006", slug: "support", name: "Additional Operational Support" },
    { code: "TSS - 007", slug: "trade", name: "Trade & Supply Scope" },
    { code: "CORS - 008", slug: "construction", name: "Construction & Real Estate" },
    { code: "EMNA - 009", slug: "agriculture", name: "Energy, Mining & Agriculture" },
    { code: "PC - 010", slug: "consulting", name: "Professional Consulting" },
  ];

  try {
    const dbSectors = await prisma.serviceSector.findMany({ orderBy: { sortOrder: "asc" } });
    record("Database", `Sectors count in DB: ${dbSectors.length}`, dbSectors.length >= 10 ? "PASS" : "WARN", `Found ${dbSectors.length} sectors`);

    for (const exp of expectedSectors) {
      const match = dbSectors.find((s) => s.slug === exp.slug || s.code === exp.code);
      if (match) {
        if (match.code === exp.code) {
          record("Sector Codes", `Sector ${exp.slug} has code ${exp.code}`, "PASS", match.name);
        } else {
          record("Sector Codes", `Sector ${exp.slug} code mismatch: expected ${exp.code}, got ${match.code}`, "FAIL");
        }
      } else {
        record("Sector Codes", `Sector ${exp.slug} present in database`, "WARN", "Using fallback memory store");
      }
    }
  } catch (err: any) {
    record("Database", "Database connection and query", "FAIL", err.message);
  }
}

// -------------------------------------------------------------
// Test Category 3: Content Blocks & CMS Verification
// -------------------------------------------------------------
async function testContentBlocks() {
  console.log("\n--- RUNNING CMS CONTENT BLOCKS VERIFICATION ---");
  try {
    const blocks = await prisma.contentBlock.findMany();
    record("CMS", `Content blocks count: ${blocks.length}`, blocks.length > 0 ? "PASS" : "WARN");

    const requiredKeys = [
      "home.hero.heading",
      "about.hero.heading",
      "services.hero.heading",
      "contact.address",
      "contact.email",
      "contact.phone1",
      "contact.phone2",
    ];

    for (const key of requiredKeys) {
      const block = blocks.find((b) => b.key === key);
      if (block) {
        record("CMS", `Key ${key} configured`, "PASS", block.value.slice(0, 40));
      } else {
        record("CMS", `Key ${key} in DB`, "WARN", "Will fallback to code defaults");
      }
    }
  } catch (err: any) {
    record("CMS", "ContentBlock table query", "FAIL", err.message);
  }
}

// -------------------------------------------------------------
// Test Category 4: Authentication Logic Verification
// -------------------------------------------------------------
async function testAuthLogic() {
  console.log("\n--- RUNNING AUTH & CRYPTO LOGIC VERIFICATION ---");
  try {
    const password = "ChangeMe123!";
    const hash = await bcrypt.hash(password, 10);
    const valid = await bcrypt.compare(password, hash);
    const invalid = await bcrypt.compare("WrongPassword", hash);

    if (valid && !invalid) {
      record("Auth", "Bcrypt password hashing and validation", "PASS");
    } else {
      record("Auth", "Bcrypt password hashing and validation", "FAIL");
    }

    const admin = await prisma.staffUser.findUnique({ where: { email: "admin@sinatrading.et" } });
    if (admin) {
      record("Auth", "Admin staff user exists in DB", "PASS", admin.email);
    } else {
      record("Auth", "Admin staff user exists in DB", "WARN", "Run prisma:seed if needed");
    }
  } catch (err: any) {
    record("Auth", "StaffUser query / Auth logic", "FAIL", err.message);
  }
}

// -------------------------------------------------------------
// Test Category 5: Live HTTP Endpoint Testing
// -------------------------------------------------------------
function makeRequest(url: string, options: http.RequestOptions = {}, postData?: string): Promise<{ statusCode?: number; body: string; headers: http.IncomingHttpHeaders }> {
  return new Promise((resolvePromise, rejectPromise) => {
    const u = new URL(url);
    const reqOptions: http.RequestOptions = {
      hostname: u.hostname,
      port: u.port,
      path: u.pathname + u.search,
      method: options.method || "GET",
      headers: options.headers || {},
      timeout: 10000,
    };

    const req = http.request(reqOptions, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        resolvePromise({
          statusCode: res.statusCode,
          body: data,
          headers: res.headers,
        });
      });
    });

    req.on("error", (err) => rejectPromise(err));
    req.on("timeout", () => {
      req.destroy();
      rejectPromise(new Error("Request timed out"));
    });

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function testHttpEndpoints(port: number) {
  console.log("\n--- RUNNING HTTP ENDPOINTS & ROUTE INTEGRITY TESTS ---");
  const baseUrl = `http://localhost:${port}`;

  const routesToTest = [
    { path: "/", expectedStatus: 200, checks: ["SINA", "Your goods, our priority", "Procurement &amp; Supply", "PS - 001"] },
    { path: "/about", expectedStatus: 200, checks: ["Who We Are", "Ethiopia", "Why Clients Choose SINA"] },
    { path: "/services", expectedStatus: 200, checks: ["PS - 001", "LD - 002", "EO - 003", "PO - 004", "SRO - 005", "AOS - 006", "TSS - 007", "CORS - 008", "EMNA - 009", "PC - 010"] },
    { path: "/contact", expectedStatus: 200, checks: ["Tell us what", "Get Directions (Google Maps)", "9.010820,38.876480", "Request a Quote", "Lemi Kura"] },
    { path: "/login", expectedStatus: 200, checks: ["Client Access", "Login to your", "portal"] },
    { path: "/signup", expectedStatus: 200, checks: ["Client Registration", "Create your", "portal account"] },
    { path: "/portal", expectedStatus: 200, checks: ["portal"] },
    { path: "/staff/login", expectedStatus: 200, checks: ["Staff", "Sign in"] },
    { path: "/robots.txt", expectedStatus: 200, checks: ["user-agent", "sitemap"] },
    { path: "/sitemap.xml", expectedStatus: 200, checks: ["urlset", "http"] },
    { path: "/llms.txt", expectedStatus: 200, checks: ["SINA", "procurement", "logistics"] },
    { path: "/llms-full.txt", expectedStatus: 200, checks: ["SINA Trading PLC", "PS - 001", "PC - 010"] },
    { path: "/api/sectors", expectedStatus: 200, checks: ["PS - 001", "procurement", "CORS - 008", "PC - 010"] },
    { path: "/api/content?page=home", expectedStatus: 200, checks: ["home.hero.heading", "Your goods, our priority"] },
  ];

  for (const route of routesToTest) {
    try {
      const res = await makeRequest(`${baseUrl}${route.path}`);
      if (res.statusCode === route.expectedStatus) {
        let allChecksPassed = true;
        const lowerBody = res.body.toLowerCase();
        for (const check of route.checks) {
          const lowerCheck = check.toLowerCase();
          if (!res.body.includes(check) && !lowerBody.includes(lowerCheck)) {
            allChecksPassed = false;
            record("HTTP Route", `GET ${route.path} content check: "${check}"`, "FAIL", `Body missing substring "${check}"`);
          }
        }
        if (allChecksPassed) {
          record("HTTP Route", `GET ${route.path} -> ${res.statusCode} OK (All content verified)`, "PASS");
        }
      } else {
        record("HTTP Route", `GET ${route.path}`, "FAIL", `Status ${res.statusCode}, expected ${route.expectedStatus}`);
      }
    } catch (err: any) {
      record("HTTP Route", `GET ${route.path}`, "FAIL", err.message);
    }
  }

  // Security tests: Protected routes redirect or block unauthenticated access
  const protectedRoutes = [
    { path: "/staff", expectedStatus: 307 },
    { path: "/staff/admin", expectedStatus: 307 },
    { path: "/staff/content", expectedStatus: 307 },
    { path: "/staff/sectors", expectedStatus: 307 },
    { path: "/staff/mfa", expectedStatus: 307 },
    { path: "/api/inquiries/export", expectedStatus: 401 },
    { path: "/api/staff/users", expectedStatus: 403 },
  ];

  for (const p of protectedRoutes) {
    try {
      const res = await makeRequest(`${baseUrl}${p.path}`);
      if (res.statusCode === p.expectedStatus || (p.expectedStatus === 307 && (res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 303))) {
        record("Security & Auth Guard", `Protected route ${p.path} requires auth (Status ${res.statusCode})`, "PASS");
      } else {
        record("Security & Auth Guard", `Protected route ${p.path} guard check`, "FAIL", `Expected ${p.expectedStatus}, got ${res.statusCode}`);
      }
    } catch (err: any) {
      record("Security & Auth Guard", `Protected route ${p.path} guard check`, "FAIL", err.message);
    }
  }

  // Test POST /api/inquiries validation
  try {
    const invalidInquiryRes = await makeRequest(`${baseUrl}/api/inquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }, JSON.stringify({ firstName: "" }));

    if (invalidInquiryRes.statusCode === 400) {
      record("API Validation", "POST /api/inquiries with empty payload correctly returns 400 Bad Request", "PASS");
    } else {
      record("API Validation", "POST /api/inquiries with empty payload", "WARN", `Returned status ${invalidInquiryRes.statusCode}`);
    }
  } catch (err: any) {
    record("API Validation", "POST /api/inquiries validation test", "FAIL", err.message);
  }

  // Test POST /api/inquiries with valid payload
  try {
    const validInquiryRes = await makeRequest(`${baseUrl}/api/inquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }, JSON.stringify({
      firstName: "Test",
      lastName: "Automated",
      email: "test.automated@example.com",
      phone: "+251911000000",
      sector: "procurement",
      message: "This is an automated system verification inquiry test.",
    }));

    if (validInquiryRes.statusCode === 201 || validInquiryRes.statusCode === 200) {
      record("API Flow", "POST /api/inquiries creates inquiry successfully (201/200)", "PASS");
    } else {
      record("API Flow", "POST /api/inquiries valid submission", "WARN", `Status ${validInquiryRes.statusCode}: ${validInquiryRes.body.slice(0, 100)}`);
    }
  } catch (err: any) {
    record("API Flow", "POST /api/inquiries valid submission", "FAIL", err.message);
  }

  // Test POST /api/auth/client/signup validation
  try {
    const invalidSignup = await makeRequest(`${baseUrl}/api/auth/client/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }, JSON.stringify({ email: "invalid", password: "123" }));

    if (invalidSignup.statusCode === 400) {
      record("API Validation", "POST /api/auth/client/signup with invalid data returns 400 Bad Request", "PASS");
    } else {
      record("API Validation", "POST /api/auth/client/signup validation", "WARN", `Status ${invalidSignup.statusCode}`);
    }
  } catch (err: any) {
    record("API Validation", "POST /api/auth/client/signup validation", "FAIL", err.message);
  }
}

// -------------------------------------------------------------
// Master Orchestrator
// -------------------------------------------------------------
async function runAll() {
  console.log("=================================================");
  console.log("   SINA TRADING PLC - FULL SYSTEM TEST SUITE     ");
  console.log("=================================================");

  await testStaticAssets();
  await testSectorData();
  await testContentBlocks();
  await testAuthLogic();

  // Next, launch a test server
  const testPort = 3088;
  console.log(`\nStarting Next.js production server on port ${testPort}...`);

  const serverProc = spawn("cmd.exe", ["/c", "npx", "next", "start", "-p", String(testPort)], {
    cwd: process.cwd(),
    env: { ...process.env, PORT: String(testPort) },
  });

  serverProc.stdout.on("data", (d) => {
    // console.log(`[server] ${d.toString()}`);
  });
  serverProc.stderr.on("data", (d) => {
    console.error(`[server err] ${d.toString()}`);
  });

  // Wait for server to become responsive
  let ready = false;
  for (let attempt = 0; attempt < 45; attempt++) {
    await new Promise((r) => setTimeout(r, 1000));
    try {
      const ping = await makeRequest(`http://localhost:${testPort}/robots.txt`);
      if (ping.statusCode === 200) {
        ready = true;
        break;
      }
    } catch {}
  }

  if (ready) {
    record("Server", `Server started on http://localhost:${testPort}`, "PASS");
    await testHttpEndpoints(testPort);
  } else {
    record("Server", `Server start on port ${testPort}`, "FAIL", "Timed out waiting for server ready");
  }

  // Cleanup server
  try {
    if (serverProc.pid) {
      const { execSync } = await import("child_process");
      execSync(`taskkill /PID ${serverProc.pid} /F /T`, { stdio: "ignore" });
    }
  } catch {
    try {
      serverProc.kill("SIGTERM");
    } catch {}
  }

  console.log("\n=================================================");
  console.log("             TEST SUMMARY & RESULTS              ");
  console.log("=================================================");
  const passed = results.filter((r) => r.status === "PASS").length;
  const failed = results.filter((r) => r.status === "FAIL").length;
  const warned = results.filter((r) => r.status === "WARN").length;

  console.log(`TOTAL TESTS: ${results.length}`);
  console.log(`PASSED:      ${passed} ✓`);
  console.log(`WARNINGS:    ${warned} ⚠`);
  console.log(`FAILED:      ${failed} ✗`);

  if (failed > 0) {
    console.error("\nFAILURES IDENTIFIED:");
    for (const f of results.filter((r) => r.status === "FAIL")) {
      console.error(`- [${f.category}] ${f.test}: ${f.detail || ""}`);
    }
  }

  await prisma.$disconnect();
  process.exit(failed > 0 ? 1 : 0);
}

runAll().catch((err) => {
  console.error("Test runner encountered critical error:", err);
  process.exit(1);
});
