import fs from "node:fs";

/**
 * Convert `title={<>Some sentence.</>}` into `title={["Some", "sentence."]}`.
 *
 * Display needs the lines up front so it can give each one its own optical
 * correction. The break goes at the word boundary nearest the middle, biased
 * towards landing after punctuation so the pause reads naturally.
 */
function split(text) {
  if (text.length <= 24) return [text];
  const words = text.split(" ");
  const mid = text.length / 2;
  let best = null;
  let run = 0;
  for (let i = 0; i < words.length - 1; i++) {
    run += words[i].length + 1;
    const punct = /[.,;:?]$/.test(words[i]);
    const cost = Math.abs(run - mid) - (punct ? 14 : 0);
    if (!best || cost < best.cost) best = { at: i + 1, cost };
  }
  return [words.slice(0, best.at).join(" "), words.slice(best.at).join(" ")];
}

const files = [
  "src/pages/Shipping.tsx",
  "src/pages/Partners.tsx",
  "src/pages/ShippingAI.tsx",
  "src/pages/Integrations.tsx",
  "src/pages/Pricing.tsx",
];

let n = 0;
for (const file of files) {
  let s = fs.readFileSync(file, "utf8");
  s = s.replace(/title=\{<>([^<]+)<\/>\}/g, (m, text) => {
    const clean = text
      .replace(/\s+/g, " ")
      .trim()
      .replace(/&rsquo;/g, "’");
    n++;
    return `title={[${split(clean)
      .map((l) => JSON.stringify(l))
      .join(", ")}]}`;
  });
  fs.writeFileSync(file, s);
}
console.log(n, "block titles converted to line arrays");
