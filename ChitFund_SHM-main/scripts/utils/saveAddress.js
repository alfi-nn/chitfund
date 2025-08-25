import fs from 'fs';
import path from 'path';

export function saveAddress(network, data) {
  const dir = path.join(process.cwd(), 'deployments');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  const file = path.join(dir, `${network}.json`);
  let current = {};
  if (fs.existsSync(file)) {
    try { current = JSON.parse(fs.readFileSync(file, 'utf8')); } catch {}
  }
  const merged = { ...current, ...data };
  fs.writeFileSync(file, JSON.stringify(merged, null, 2));
  console.log('Saved deployments to', file);
} 