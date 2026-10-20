import { ext, base } from './core.mjs';
const scriptPromises=new Map();
export const assetURL=(name,moduleURL=import.meta.url)=>new URL('./vendor/'+name,moduleURL).href;
export function loadScript(name){if(!scriptPromises.has(name)){scriptPromises.set(name,new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=assetURL(name);s.onload=resolve;s.onerror=()=>{scriptPromises.delete(name);s.remove();reject(new Error('组件加载失败，请检查网络后重试'));};document.head.append(s);}));}return scriptPromises.get(name)}
let pdfModule;
export async function pdfDocument(file){
  if(!pdfModule){pdfModule=await import(assetURL('pdf.mjs'));pdfModule.GlobalWorkerOptions.workerSrc=assetURL('pdf.worker.mjs');}
  const task=pdfModule.getDocument({data:new Uint8Array(await file.arrayBuffer()),cMapUrl:assetURL('cmaps/'),cMapPacked:true,standardFontDataUrl:assetURL('standard_fonts/'),wasmUrl:assetURL('wasm/'),useSystemFonts:true,isEvalSupported:false});
  task.onPassword=()=>task.destroy();
  try{const doc=await task.promise;if(doc.numPages>100){await doc.loadingTask.destroy();throw new Error('此 PDF 超过 100 页，请拆分后再处理');}return doc;}catch(e){if(/password|destroyed/i.test(e.message))throw new Error('文件可能受密码保护，请先移除密码后再试');throw e;}
}
export async function pdfPagesText(file,update=()=>{}){
  const doc=await pdfDocument(file),pages=[];
  try{for(let p=1;p<=doc.numPages;p++){const page=await doc.getPage(p),content=await page.getTextContent();let text='',lastY=null;
    for(const item of content.items){if(typeof item.str!=='string')continue;const y=item.transform?.[5];if(lastY!==null&&Math.abs(lastY-y)>3&&!text.endsWith('\n'))text+='\n';text+=item.str+(item.hasEOL?'\n':' ');lastY=y;}pages.push(text.trim());page.cleanup();update(p/doc.numPages);}
    if(!pages.some(p=>p.trim()))throw new Error('没有检测到可提取文字。此文件可能是扫描件；请先使用 OCR 识别后重试。');return pages;
  }finally{await doc.loadingTask.destroy();}
}
export async function readText(file,update){const e=ext(file.name);if(['txt','md'].includes(e))return file.text();if(e==='pdf')return(await pdfPagesText(file,update)).join('\n\n');if(e==='docx'){await loadScript('mammoth.js');const r=await window.mammoth.extractRawText({arrayBuffer:await file.arrayBuffer()});if(!r.value.trim())throw new Error('文档没有可提取的文字');return r.value;}throw new Error('请选择 TXT、Markdown、DOCX 或可提取文字的 PDF');}
export async function imageData(file,type='png',quality=.9){
  const url=URL.createObjectURL(file),img=new Image();
  try{await new Promise((res,rej)=>{img.onload=res;img.onerror=()=>rej(new Error('浏览器无法读取这张图片，请尝试 JPG、PNG 或 WebP 格式'));img.src=url;});
    if(img.naturalWidth*img.naturalHeight>50e6)throw new Error('图片超过 5000 万像素，请缩小后重试');
    const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;const ctx=c.getContext('2d');if(type==='jpg'){ctx.fillStyle='#fff';ctx.fillRect(0,0,c.width,c.height);}ctx.drawImage(img,0,0);const mime=type==='jpg'?'image/jpeg':`image/${type}`;
    const blob=await new Promise(resolve=>c.toBlob(resolve,mime,quality));if(!blob)throw new Error('图片编码失败，请换一种格式');if(blob.type!==mime)throw new Error('当前浏览器不支持此输出格式，请选择 PNG 或 JPG');return{blob,width:c.width,height:c.height};
  }finally{URL.revokeObjectURL(url);}
}
async function pdfToWord(file,update){const pages=await pdfPagesText(file,update);await loadScript('docx.js');const {Document,Packer,Paragraph,TextRun}=window.docx;const children=[];
  pages.forEach((p,i)=>{const lines=p.split('\n');lines.forEach((line,j)=>children.push(new Paragraph({pageBreakBefore:i>0&&j===0,children:[new TextRun({text:line,font:'Microsoft YaHei',size:22})],spacing:{after:130,line:320}})));});
  return{blob:await Packer.toBlob(new Document({sections:[{properties:{},children}]})),name:base(file.name)+'.docx'};}
async function textToPdf(file,update){
  const text=await readText(file);if(!text.trim())throw new Error('文档中没有可转换的文字');await loadScript('jspdf.js');await document.fonts.ready;
  const {jsPDF}=window.jspdf,pdf=new jsPDF({unit:'mm',format:'a4'});const canvas=document.createElement('canvas');canvas.width=1240;canvas.height=1754;const ctx=canvas.getContext('2d');const margin=100,lineH=36,bottom=1620;let y=margin,page=0;
  function clear(){ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle='#263327';ctx.font='23px "Noto Sans SC", "Microsoft YaHei", sans-serif';ctx.textBaseline='top';}
  function flush(){ctx.fillStyle='#91a08a';ctx.font='16px sans-serif';ctx.fillText(`${++page}`,canvas.width/2,1670);if(page>1)pdf.addPage();pdf.addImage(canvas.toDataURL('image/jpeg',.92),'JPEG',0,0,210,297);clear();y=margin;}
  clear();let done=0;const paras=text.replace(/\r/g,'').split('\n');
  for(const para of paras){let line='';for(const char of para){if(ctx.measureText(line+char).width>canvas.width-margin*2){if(y>bottom)flush();ctx.fillText(line,margin,y);y+=lineH;line=char;}else line+=char;}if(y>bottom)flush();ctx.fillText(line,margin,y);y+=lineH*1.25;update(++done/paras.length);if(page>100)throw new Error('排版超过 100 页，请拆分文件后重试');}if(y>margin)flush();return{blob:pdf.output('blob'),name:base(file.name)+'.pdf'};
}
export async function imagesToPdf(files,update){await loadScript('jspdf.js');const pdf=new window.jspdf.jsPDF({unit:'mm',format:'a4'});
  for(let i=0;i<files.length;i++){const {blob,width,height}=await imageData(files[i],'jpg',.93);const data=await blobDataURL(blob);if(i)pdf.addPage();const scale=Math.min(190/width,277/height);const w=width*scale,h=height*scale;pdf.addImage(data,'JPEG',(210-w)/2,(297-h)/2,w,h);update((i+1)/files.length);}return{blob:pdf.output('blob'),name:files.length===1?base(files[0].name)+'.pdf':'图片合集.pdf'};
}
export function blobDataURL(blob){return new Promise((r,j)=>{const f=new FileReader();f.onload=()=>r(f.result);f.onerror=j;f.readAsDataURL(blob);})}
async function pdfToImages(file,type,quality,update){const pdf=await pdfDocument(file);const outputs=[];try{for(let p=1;p<=pdf.numPages;p++){const page=await pdf.getPage(p);let scale=1.65;const orig=page.getViewport({scale});if(orig.width*orig.height>20e6)scale*=Math.sqrt(20e6/(orig.width*orig.height));const v=page.getViewport({scale});const c=document.createElement('canvas');c.width=Math.ceil(v.width);c.height=Math.ceil(v.height);await page.render({canvasContext:c.getContext('2d'),viewport:v,background:'#ffffff'}).promise;const blob=await new Promise(r=>c.toBlob(r,type==='jpg'?'image/jpeg':'image/png',quality));if(!blob)throw new Error('页面渲染失败');outputs.push({blob,name:`${base(file.name)}_${String(p).padStart(3,'0')}.${type}`});c.width=0;c.height=0;page.cleanup();update(p/pdf.numPages);}return outputs.length===1?outputs[0]:zipOutputs(outputs,base(file.name)+'_图片.zip');}finally{await pdf.loadingTask.destroy();}}
export async function zipOutputs(outputs,name='转换结果.zip'){await loadScript('jszip.js');const zip=new window.JSZip();const names=new Set();for(const f of outputs){let name=f.name,index=2;while(names.has(name))name=base(f.name)+'_'+index++ +'.'+ext(f.name);names.add(name);zip.file(name,f.blob);}return{blob:await zip.generateAsync({type:'blob'}),name};}
let ffmpeg,loadingFFmpeg,ffmpegProgress=()=>{};
export function stopVideoEngine(){ffmpeg?.terminate();ffmpeg=null;loadingFFmpeg=null;}
async function videoEngine(update){if(ffmpeg?.loaded)return ffmpeg;if(loadingFFmpeg)return loadingFFmpeg;
  loadingFFmpeg=(async()=>{update(0,'正在加载本地视频引擎（约 31 MB，首次加载较慢）');await loadScript('ffmpeg/ffmpeg.js');
    const instance=new window.FFmpegWASM.FFmpeg();ffmpeg=instance;const config=await fetch(assetURL('ffmpeg-core.json')).then(r=>{if(!r.ok)throw new Error('视频引擎文件不可用');return r.json();});const parts=[];
    for(let i=0;i<config.parts;i++){const r=await fetch(assetURL(`ffmpeg-core-${i}.bin`));if(!r.ok)throw new Error('视频引擎下载失败，请刷新重试');parts.push(await r.arrayBuffer());update((i+1)/config.parts*.12,'正在准备本地视频引擎…');}
    const core=await fetch(assetURL('ffmpeg-core.js')).then(r=>r.blob());const jsURL=URL.createObjectURL(new Blob([core],{type:'text/javascript'})),wasmURL=URL.createObjectURL(new Blob(parts,{type:'application/wasm'}));
    try{await instance.load({coreURL:jsURL,wasmURL});}finally{URL.revokeObjectURL(jsURL);URL.revokeObjectURL(wasmURL);}
    instance.on('progress',({progress})=>ffmpegProgress(Math.max(0,Math.min(.99,progress))));return instance;
  })().catch(e=>{stopVideoEngine();throw new Error('视频引擎初始化失败，请使用最新版桌面 Chrome / Edge 并重试。'+(e.message||''));});
  return loadingFFmpeg;
}
async function convertMedia(file,type,quality,update){const f=await videoEngine(update);ffmpegProgress=p=>update(p,'正在本地转换，保持此页面打开…');const input='input.'+ext(file.name),output='output.'+type;
  try{await f.writeFile(input,new Uint8Array(await file.arrayBuffer()));let args=['-i',input];const crf=quality>.9?'20':quality>.75?'25':'30';
    if(type==='mp4'||type==='mov')args.push('-map','0:v:0','-map','0:a?','-c:v','libx264','-preset','ultrafast','-crf',crf,'-vf','scale=trunc(iw/2)*2:trunc(ih/2)*2','-pix_fmt','yuv420p','-c:a','aac','-movflags','+faststart');
    else if(type==='webm')args.push('-c:v','libvpx','-b:v','1M','-deadline','realtime','-cpu-used','5','-c:a','libvorbis');
    else if(type==='gif')args.push('-an','-vf','fps=12,scale=640:-1:flags=lanczos');
    else if(type==='mp3')args.push('-vn','-c:a','libmp3lame','-q:a','2');
    else if(type==='wav')args.push('-vn','-c:a','pcm_s16le');
    else if(type==='m4a')args.push('-vn','-c:a','aac','-b:a','192k');
    else if(type==='ogg')args.push('-vn','-c:a','libvorbis','-q:a','5');
    args.push('-y',output);update(.02,'正在本地转换，保持此页面打开…');const code=await f.exec(args,300000);if(code!==0)throw new Error('无法完成转换。请确认文件未损坏；提取音频时原视频需包含音轨。转换最长为 5 分钟。');const data=await f.readFile(output);const mime={mp4:'video/mp4',mov:'video/quicktime',webm:'video/webm',gif:'image/gif',mp3:'audio/mpeg',wav:'audio/wav',m4a:'audio/mp4',ogg:'audio/ogg'}[type];return{blob:new Blob([data],{type:mime}),name:base(file.name)+'.'+type};
  }finally{ffmpegProgress=()=>{};try{await f.deleteFile(input);await f.deleteFile(output);}catch{}}
}
export async function convertFile(file,tool,type,quality,update=()=>{}){
  switch(tool.id){
    case 'image-convert':{const {blob}=await imageData(file,type,quality);update(1);return{blob,name:base(file.name)+'.'+type};}
    case 'pdf-word':return pdfToWord(file,update);
    case 'pdf-text':{const text=(await pdfPagesText(file,update)).join('\n\n');return{blob:new Blob(['\ufeff'+text],{type:'text/plain;charset=utf-8'}),name:base(file.name)+'.txt'};}
    case 'word-pdf':return textToPdf(file,update);
    case 'pdf-image':return pdfToImages(file,type,quality,update);
    case 'video-convert':case 'audio-convert':return convertMedia(file,type,quality,update);
    default:throw new Error('请先选择转换工具');
  }
}
