import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

// CSV headers: commonName,scientificName,audioFile,spectrogramFile,xenoCantoId,recordist,rejected,difficulty,quality
const CSV_COLS = {
  commonName: 0,
  scientificName: 1,
  audioFile: 2,
  spectrogramFile: 3,
  xenoCantoId: 4,
  recordist: 5,
  rejected: 6,
  difficulty: 7,
  quality: 8,
};

function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;
  for (const char of line) {
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      fields.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  fields.push(current);
  return fields;
}

function rebuildJson() {
  execSync("npx tsx scripts/build-recordings.ts", { cwd: __dirname });
}

function quizAdminPlugin(): Plugin {
  const csvPath = join(__dirname, "src/quiz/data/recordings.csv");

  function readCSV() {
    return readFileSync(csvPath, "utf-8");
  }

  function updateRow(
    xenoCantoId: string,
    updates: Partial<Record<string, string>>,
  ) {
    const csv = readCSV();
    const lines = csv.split("\n");
    const updated = lines.map((line, i) => {
      if (i === 0) return line; // header
      const fields = parseCSVLine(line);
      if (fields[CSV_COLS.xenoCantoId] !== xenoCantoId) return line;

      if ("rejected" in updates)
        fields[CSV_COLS.rejected] = updates.rejected ?? "";
      if ("difficulty" in updates)
        fields[CSV_COLS.difficulty] = updates.difficulty ?? "";
      if ("quality" in updates)
        fields[CSV_COLS.quality] = updates.quality ?? "";

      // Re-quote recordist if it contains commas
      const rec = fields[CSV_COLS.recordist];
      if (rec.includes(",")) {
        fields[CSV_COLS.recordist] = `"${rec}"`;
      }
      return fields.join(",");
    });
    writeFileSync(csvPath, updated.join("\n"));
    rebuildJson();
  }

  return {
    name: "quiz-admin",
    configureServer(server) {
      // GET all recordings (raw CSV data)
      server.middlewares.use("/api/recordings", (req, res, next) => {
        if (req.method === "GET") {
          const csv = readCSV();
          const lines = csv.trim().split("\n");
          const headers = parseCSVLine(lines[0]);
          const rows = lines.slice(1).map((line) => {
            const fields = parseCSVLine(line);
            const row: Record<string, string> = {};
            headers.forEach((h, i) => (row[h] = fields[i] ?? ""));
            return row;
          });
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(rows));
          return;
        }
        next();
      });

      // POST update a recording
      server.middlewares.use("/api/recording/update", (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end();
          return;
        }
        let body = "";
        req.on("data", (chunk: Buffer) => (body += chunk));
        req.on("end", () => {
          const { xenoCantoId, ...updates } = JSON.parse(body);
          updateRow(xenoCantoId, updates);
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ ok: true }));
        });
      });

      // Keep the old reject endpoint working
      server.middlewares.use("/api/reject", (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end();
          return;
        }
        let body = "";
        req.on("data", (chunk: Buffer) => (body += chunk));
        req.on("end", () => {
          const { xenoCantoId } = JSON.parse(body);
          updateRow(xenoCantoId, { rejected: "true" });
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ ok: true, xenoCantoId }));
        });
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), quizAdminPlugin()],
});
