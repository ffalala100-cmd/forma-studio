import { createServer } from 'node:http';
import { createReadStream, statSync } from 'node:fs';
import { resolve, extname, sep } from 'node:path';
const root=resolve(import.meta.dirname,'dist');
const prefix=(process.env.BASE_PATH||'').replace(/\/$/,'');
const port=Number(process.env.PORT||4173);
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json','.wasm':'application/wasm','.svg':'image/svg+xml','.bin':'application/octet-stream','.png':'image/png','.bcmap':'application/octet-stream','.ttf':'font/ttf','.pfb':'application/octet-stream'};
const server=createServer((req,res)=>{
  const pathname=new URL(req.url,'http://localhost').pathname;
  if(prefix&&!pathname.startsWith(prefix+'/')){res.writeHead(404);res.end('Not found');return;}
  const qaPath=prefix?pathname.slice(prefix.length):pathname;
  if(qaPath.startsWith('/__qa/')){const relative=qaPath.slice(6);if(!/^([a-z-]+\.html|fixtures\/[a-zA-Z0-9_.-]+)$/.test(relative)){res.writeHead(404);res.end();return;}const local=resolve(import.meta.dirname,'test',relative);try{res.writeHead(200,{'Content-Type':mime[extname(local)]||'application/octet-stream'});createReadStream(local).pipe(res);}catch{res.writeHead(404);res.end();}return;}
  let file;try{file=resolve(root,'.'+decodeURIComponent(qaPath));}catch{res.writeHead(400);res.end();return;}
  if(!file.startsWith(root+sep)&&file!==root){res.writeHead(403);res.end();return;}
  try{if(statSync(file).isDirectory())file=resolve(file,'index.html');const info=statSync(file);res.writeHead(200,{'Content-Type':mime[extname(file)]||'application/octet-stream','Content-Length':info.size,'X-Content-Type-Options':'nosniff'});createReadStream(file).pipe(res);}catch{res.writeHead(404);res.end('Not found');}
});
server.listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port}${prefix}/`));
