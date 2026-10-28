// Optional asset export. Generated PNGs are checked in; normal builds need no browser.
import {chromium} from '@playwright/test';
import {readFile} from 'node:fs/promises';
const svg=await readFile('public/icon.svg','utf8');
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
try{
 for(const [name,size] of [['icon-192.png',192],['icon-512.png',512],['apple-touch-icon.png',180]]){
  const page=await browser.newPage({viewport:{width:size,height:size},deviceScaleFactor:1});
  await page.setContent(`<style>body{margin:0;background:#e5eddd}svg{width:${size}px;height:${size}px;display:block}</style>${svg}`);
  await page.screenshot({path:`public/${name}`});
  await page.close();
 }
}finally{await browser.close();}
