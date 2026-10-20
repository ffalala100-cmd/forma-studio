import { mkdirSync, copyFileSync, cpSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
const root = import.meta.dirname;
const vendor = path.join(root, 'dist/vendor');
mkdirSync(vendor, { recursive: true });
const copies = {
  'lucide/dist/umd/lucide.min.js': 'lucide.js',
  'docx/dist/index.iife.js': 'docx.js',
  'mammoth/mammoth.browser.min.js': 'mammoth.js',
  'jspdf/dist/jspdf.umd.min.js': 'jspdf.js',
  'html2canvas/dist/html2canvas.min.js': 'html2canvas.js',
  'pptxgenjs/dist/pptxgen.bundle.js': 'pptxgen.js',
  'jszip/dist/jszip.min.js': 'jszip.js',
  'pdfjs-dist/build/pdf.mjs': 'pdf.mjs',
  'pdfjs-dist/build/pdf.worker.mjs': 'pdf.worker.mjs',
  '@ffmpeg/util/dist/umd/index.js': 'ffmpeg-util.js',
};
for (const [from, to] of Object.entries(copies)) copyFileSync(path.join(root, 'node_modules', from), path.join(vendor, to));
cpSync(path.join(root, 'node_modules/@ffmpeg/ffmpeg/dist/umd'), path.join(vendor, 'ffmpeg'), {recursive:true,filter:p=>!p.endsWith('.map')});
for (const folder of ['cmaps','standard_fonts','wasm']) cpSync(path.join(root,'node_modules/pdfjs-dist',folder),path.join(vendor,folder),{recursive:true});
const corePath=path.join(root,'node_modules/@ffmpeg/core/dist/umd');
if(existsSync(corePath)){
  copyFileSync(path.join(corePath,'ffmpeg-core.js'),path.join(vendor,'ffmpeg-core.js'));
  const core=readFileSync(path.join(corePath,'ffmpeg-core.wasm'));
  const chunk=8*1024*1024;let parts=0;
  for(let offset=0;offset<core.length;offset+=chunk) writeFileSync(path.join(vendor,`ffmpeg-core-${parts++}.bin`),core.subarray(offset,offset+chunk));
  writeFileSync(path.join(vendor,'ffmpeg-core.json'),JSON.stringify({parts,size:core.length}));
}
const pkg=JSON.parse(readFileSync(path.join(root,'package.json'),'utf8'));
pkg.description='Forma 格式工坊 — 浏览器本地文件转换与 PPT 生成';
pkg.type='module';
pkg.scripts={prepare:'node prepare.mjs',start:'node server.mjs',test:'node --test test/*.test.mjs'};
writeFileSync(path.join(root,'package.json'),JSON.stringify(pkg,null,2)+'\n');
console.log('Bundled browser conversion libraries.');
const notices=['Forma third-party software notices','', 'FFmpeg core includes GPL components. Corresponding source and build scripts:','https://github.com/ffmpegwasm/ffmpeg.wasm/tree/main/packages/core','https://github.com/FFmpeg/FFmpeg','https://github.com/ffmpegwasm/ffmpeg.wasm/blob/main/LICENSE',''];
mkdirSync(path.join(vendor,'licenses'),{recursive:true});
for(const name of Object.keys(pkg.dependencies||{})){
  const dir=path.join(root,'node_modules',name);const dep=JSON.parse(readFileSync(path.join(dir,'package.json'),'utf8'));notices.push(`${name} ${dep.version} — ${dep.license||'See package license'}`);
  for(const file of ['LICENSE','LICENSE.md','LICENSE.txt','LICENSE-MIT','COPYING','COPYING.GPLv2','COPYING.GPLv3'])if(existsSync(path.join(dir,file)))copyFileSync(path.join(dir,file),path.join(vendor,'licenses',name.replaceAll('/','_')+'_'+file));
}
writeFileSync(path.join(root,'dist/THIRD-PARTY-NOTICES.txt'),notices.join('\n')+'\n');
