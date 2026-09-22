import fs from 'node:fs/promises';
import {geoContains} from 'd3-geo';
import {feature} from 'topojson-client';
const world=JSON.parse(await fs.readFile('node_modules/world-atlas/land-110m.json','utf8'));
const land=feature(world,world.objects.land);
const points=[];
for(let lat=-85;lat<85;lat+=2)for(let lon=-180;lon<180;lon+=2/Math.cos(lat*Math.PI/180))if(geoContains(land,[lon,lat]))points.push([+lon.toFixed(2),lat]);
await fs.writeFile('public/assets/globe-points.json',JSON.stringify(points));
