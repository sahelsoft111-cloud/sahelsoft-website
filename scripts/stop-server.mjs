// Arrête le serveur local lancé par `npm run dev` (ports 5173 à 5193).
// Usage : npm run stop  — à lancer depuis une AUTRE invite de commande.
// Ne tue que les processus node.exe qui écoutent sur ces ports.
import { execSync } from "node:child_process";

const startPort = Number(process.env.PORT || 5173);
const ports = new Set(Array.from({ length: 21 }, (_, i) => String(startPort + i)));

if (process.platform !== "win32") {
  console.log("Script prévu pour Windows. Sinon : Ctrl + C dans le terminal du serveur.");
  process.exit(0);
}

let lignes = "";
try {
  lignes = execSync("netstat -ano -p tcp", { encoding: "utf8" });
} catch {
  console.error("Impossible de lire les ports ouverts (netstat).");
  process.exit(1);
}

const pids = new Set();
for (const ligne of lignes.split(/\r?\n/)) {
  const cols = ligne.trim().split(/\s+/);
  // Format : TCP  127.0.0.1:5173  0.0.0.0:0  LISTENING  12345
  if (cols.length < 5 || cols[3] !== "LISTENING") continue;
  const port = cols[1].split(":").pop();
  if (ports.has(port)) pids.add(cols[4]);
}

let arretes = 0;
for (const pid of pids) {
  if (pid === String(process.pid)) continue;
  let nom = "";
  try {
    nom = execSync(`tasklist /FI "PID eq ${pid}" /FO CSV /NH`, { encoding: "utf8" }).split(",")[0].replace(/"/g, "").trim();
  } catch {}
  if (nom.toLowerCase() !== "node.exe") {
    console.log(`Port occupé par ${nom || "un autre programme"} (PID ${pid}) : ignoré.`);
    continue;
  }
  try {
    execSync(`taskkill /PID ${pid} /F`, { stdio: "ignore" });
    console.log(`Serveur arrêté (PID ${pid}).`);
    arretes++;
  } catch {
    console.log(`Impossible d'arrêter le PID ${pid}.`);
  }
}

if (arretes === 0) console.log("Aucun serveur SahelSoft en cours d'exécution.");
