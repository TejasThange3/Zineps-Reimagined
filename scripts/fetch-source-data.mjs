import fs from 'node:fs/promises';
for(const name of ['shipping','logistics-operating-system','ai-shipping-intelligence']){const r=await fetch('https://www.zineps.com/'+name);await fs.writeFile(`docs/reference/${name}.html`,await r.text());}
const html=await fs.readFile('docs/reference/pricing.html','utf8');
for(const [,src] of html.matchAll(/<script[^>]*src="([^"]+)"/g)) {
 const res=await fetch(new URL(src,'https://www.zineps.com'));const s=await res.text();
 if(s.includes('yearlyPrice')||s.includes('300+')){await fs.writeFile('docs/reference/source-'+src.split('/').pop().split('?')[0],s);console.log(s.match(/.{0,60}(yearlyPrice|300\+|100\+|12\+).{0,100}/g)?.slice(0,25));}
}
