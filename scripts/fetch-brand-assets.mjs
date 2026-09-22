import fs from 'node:fs/promises';
await fs.mkdir('public/assets/partners',{recursive:true});
const names = ['Bpost','Bol','PostNL','Temu','DHL','Amazon','DPD','Shopify','Correos','UPS','Magento','GLS','WooCommerce','FedEx','DB Schenker','CCV Shop','SnelStart','Exact','Mate','Monkey','Trent','The Tester','101Kruiden','Lightspeed','Kaufland','Amazon NL','Picqer','GoedGepickt','Mirakl','Exact Online','PrestaShop','MijnWebwinkel','Odoo','ChannelDock','StockitUP','Lyra WMS','Microsoft Dynamics','Moneybird','Wix'];
const normalize=s=>s.toLowerCase().replace(/\s/g,'');
const assets={};
for(const f of ['home','integrations']) {
 const s=await fs.readFile(`docs/reference/${f}.html`,'utf8');
 for(const [tag] of s.matchAll(/<img[^>]+>/g)) {
  const alt=tag.match(/alt="([^"]*)/)?.[1], src=tag.match(/src="([^"]+)/)?.[1];
  const name=names.find(n=>normalize(n)===normalize(alt||''));
  if(!name||assets[name]||!src)continue;
  const url=new URL(src,'https://www.zineps.com');
  const file=`/assets/partners/${normalize(name)}.${url.pathname.split('.').pop()}`;
  const res=await fetch(url);if(!res.ok)throw new Error(`${url}: ${res.status}`);
  await fs.writeFile('public'+file,Buffer.from(await res.arrayBuffer()));assets[name]=file;
 }
}
await fs.writeFile('src/data/brands.json',JSON.stringify(assets,null,2));
const pricing=await fs.readFile('docs/reference/pricing.html','utf8');
for(const [tag,src] of pricing.matchAll(/<script[^>]*src="([^"]+)"/g)) {
 if(!src.includes('/app/'))continue;
 const res=await fetch(new URL(src,'https://www.zineps.com'));
 const s=await res.text();await fs.writeFile('docs/reference/'+src.split('/').pop().split('?')[0],s);
 console.log(s.match(/.{0,90}(monthly|yearly|299|159|annual).{0,140}/g)?.slice(0,40));
}
console.log('Downloaded',Object.keys(assets).length,'logos');
