import fs from 'fs';
import path from 'path';

function readJson(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf-8'));
  } catch (e) {
    return null;
  }
}

function isSemverLike(v) {
  if (!v || typeof v !== 'string') return false;
  // Allow common range operators and pre-release/build metadata
  return /^(\^|~|>=|<=|>|<)?\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(v);
}

function collectPackages(root) {
  const pkg = readJson(path.join(root, 'package.json'));
  if (!pkg || !pkg.workspaces) {
    return [root];
  }
  const results = [root];
  const patterns = pkg.workspaces;
  for (const pat of patterns) {
    const base = pat.replace(/\*.*$/, '');
    const abs = path.join(root, base);
    if (!fs.existsSync(abs)) continue;
    for (const name of fs.readdirSync(abs)) {
      const p = path.join(abs, name);
      if (fs.statSync(p).isDirectory()) {
        const pj = path.join(p, 'package.json');
        if (fs.existsSync(pj)) results.push(p);
      }
    }
  }
  return results;
}

function checkAll(root) {
  const dirs = collectPackages(root);
  const issues = [];
  for (const dir of dirs) {
    const pj = path.join(dir, 'package.json');
    const pkg = readJson(pj);
    if (!pkg) continue;
    // Check the package's own version field
    if (!pkg.version || !/^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(pkg.version)) {
      issues.push({ dir, name: pkg.name, field: 'version', dep: pkg.name, ver: String(pkg.version || '') });
    }
    const checkMap = (map, kind) => {
      if (!map) return;
      for (const [dep, ver] of Object.entries(map)) {
        const ok = isSemverLike(ver) || ['latest', 'next', 'canary'].includes(ver) || ver.startsWith('npm:') || ver.startsWith('github:');
        if (!ok) {
          issues.push({ dir, name: pkg.name, field: kind, dep, ver });
        }
      }
    };
    checkMap(pkg.dependencies, 'dependencies');
    checkMap(pkg.devDependencies, 'devDependencies');
    checkMap(pkg.peerDependencies, 'peerDependencies');
    checkMap(pkg.optionalDependencies, 'optionalDependencies');
  }
  return issues;
}

const root = process.cwd();
const issues = checkAll(root);
if (!issues.length) {
  console.log('No invalid versions found.');
} else {
  console.log('Found invalid versions:');
  for (const i of issues) {
    console.log(`- ${i.name} (${i.dir}): ${i.field} -> ${i.dep} = ${i.ver}`);
  }
  process.exit(1);
}