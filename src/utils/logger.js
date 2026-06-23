const fs = require("fs");
const path = require("path");

const logFile = path.resolve(__dirname, "../../server.log");
const stream = fs.createWriteStream(logFile, { flags: "a" });

function write(level, args) {
  const timestamp = new Date().toISOString();
  const message = args
    .map((a) => (typeof a === "object" ? JSON.stringify(a, null, 2) : String(a)))
    .join(" ");
  stream.write(`[${timestamp}] [${level}] ${message}\n`);
}

console.log = (...args) => write("INFO", args);
console.error = (...args) => write("ERROR", args);
console.warn = (...args) => write("WARN", args);
console.info = (...args) => write("INFO", args);
console.debug = (...args) => write("DEBUG", args);
