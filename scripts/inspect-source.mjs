import fs from 'node:fs/promises';
for (const f of ['home','pricing','integrations']) {
 const s=await fs.readFile(`docs/reference/${f}.html`,'utf8');
 const imgs=[...s.matchAll(/<img[^>]+>/g)].map(x=>x[0]);
 await fs.writeFile(`docs/reference/${f}-images.txt`,imgs.join('\n'));
 console.log(f, imgs.slice(0,40).map(x=>({src:x.match(/src="([^"]+)/)?.[1],alt:x.match(/alt="([^"]*)/)?.[1]})));
 if(f==='pricing') console.log(s.match(/.{0,100}(monthly|Monthly|data-month|159|299|annual).{0,160}/g)?.slice(-50));
}
