import {chromium,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
await fs.mkdir('docs/refinement-qa',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext();const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
const report=[];
for(const width of [390,1440])for(const route of ['/','/pricing','/integrations','/blog','/logistics-operating-system']){
 await page.setViewportSize({width,height:1000});await page.goto('http://127.0.0.1:5173'+route);await page.locator('h1').waitFor();await page.evaluate(()=>document.fonts.ready);
 if(route==='/pricing'){
  await expect(page.locator('.plan-price')).toHaveText(['€0/ month','€20/ month','€55/ month','€127/ month','€239/ month'],{useInnerText:false});
  await page.getByRole('button',{name:'Monthly',exact:true}).click();
  await expect(page.locator('.plan-price')).toHaveText(['€0/ month','€25/ month','€69/ month','€159/ month','€299/ month'],{useInnerText:false});
  await expect(page.locator('.estimate-total')).toContainText('€136.50');
  await page.getByRole('button',{name:'Annual Save 20%'}).click();await expect(page.locator('.estimate-total')).toContainText('€122.50');
 }
 if(route==='/blog'){await expect(page.locator('.article-card')).toHaveCount(6);const arts=await page.locator('.article-card .editorial-art').evaluateAll(es=>es.map(e=>e.className));if(new Set(arts).size!==6)throw new Error('Duplicate article artwork');}
 if(route==='/'){
  await page.locator('.reach-section').scrollIntoViewIfNeeded();await page.waitForTimeout(500);
  const globe=page.locator('.reach-section canvas');const before=await globe.evaluate(e=>e.toDataURL());await page.waitForTimeout(250);const after=await globe.evaluate(e=>e.toDataURL());if(before===after)throw new Error('Globe is static');
  await page.getByRole('button',{name:'Pause globe animation'}).click();await page.waitForTimeout(150);const stopped=await globe.evaluate(e=>e.toDataURL());await page.waitForTimeout(200);if(stopped!==await globe.evaluate(e=>e.toDataURL()))throw new Error('Globe pause failed');
  await page.locator('.reach-section').screenshot({path:`docs/refinement-qa/globe-${width}.png`});
  await page.locator('.trusted-band').screenshot({path:`docs/refinement-qa/brands-${width}.png`});
 }
 await page.evaluate(()=>scrollTo(0,0));
 await page.screenshot({path:`docs/refinement-qa/${route.replaceAll('/','')||'home'}-${width}.png`,fullPage:route==='/blog'});
 const broken=await page.locator('img').evaluateAll(es=>es.filter(e=>e.complete&&e.naturalWidth===0).map(e=>e.src));
 const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
 report.push({width,route,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),broken,violations:axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))});
}
await fs.writeFile('docs/refinement-qa/report.json',JSON.stringify({report,errors},null,2));console.log(JSON.stringify({report,errors},null,2));await browser.close();
