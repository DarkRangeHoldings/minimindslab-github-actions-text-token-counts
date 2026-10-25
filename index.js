import { appendFileSync } from 'node:fs';

const payloadRaw = process.env.INPUT_PAYLOAD;
const outputPath = process.env.GITHUB_OUTPUT;

const payload = JSON.parse(payloadRaw);

if (
  payload === null ||
  typeof payload !== 'object' ||
  Array.isArray(payload) ||
  typeof payload.text !== 'string'
) {
  throw new Error('Invalid input');
}

const text = payload.text;
const matches = text.match(/[A-Za-z0-9]+/g) || [];
const counts = Object.create(null);

for (const m of matches) {
  const token = m.toLowerCase();
  counts[token] = (counts[token] || 0) + 1;
}

const tokens = Object.keys(counts)
  .sort()
  .map((t) => [t, counts[t]]);

const result = {
  tokens,
  total: matches.length,
  unique: tokens.length
};

appendFileSync(outputPath, `result=${JSON.stringify(result)}\n`);