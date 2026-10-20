import createQpdf from './vendor/qpdf/qpdf.mjs';
self.onmessage=async({data:{id,input,args}})=>{
 let q;try{q=await createQpdf({noInitialRun:true,locateFile:name=>new URL('./vendor/qpdf/'+name,import.meta.url).href,print:()=>{},printErr:()=>{}});q.FS.writeFile('/input.pdf',new Uint8Array(input));try{q.callMain(args);}catch(e){if(e.status!==0&&e.status!==3)throw new Error('QPDF 处理失败，请检查文件及密码');}const output=q.FS.readFile('/output.pdf');self.postMessage({id,output:output.buffer},[output.buffer]);}catch(e){self.postMessage({id,error:e.message||'文件无法处理，请检查密码或文档完整性'});}
};
