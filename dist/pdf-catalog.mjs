export const PDF_GROUPS=[
 {id:'organize',name:'整理 PDF',en:'ORGANIZE PDF',color:'coral',icon:'layers'},
 {id:'optimize',name:'优化与识别',en:'OPTIMIZE PDF',color:'green',icon:'scan-text'},
 {id:'to-pdf',name:'转换为 PDF',en:'CONVERT TO PDF',color:'amber',icon:'file-input'},
 {id:'from-pdf',name:'从 PDF 转换',en:'CONVERT FROM PDF',color:'blue',icon:'file-output'},
 {id:'edit',name:'编辑 PDF',en:'EDIT PDF',color:'purple',icon:'pencil-ruler'},
 {id:'security',name:'安全与比较',en:'PDF SECURITY',color:'blue',icon:'shield-check'},
 {id:'intelligence',name:'PDF 智能助手',en:'PDF INTELLIGENCE',color:'violet',icon:'sparkles'},
];
const t=(id,name,en,group,icon,desc,extra={})=>({id,name,en,group,icon,desc,ext:['pdf'],limit:30,mode:'local',...extra});
export const PDF_TOOLS=[
 t('pdf-merge','合并 PDF','Merge PDF','organize','combine','多份文档，按顺序合成一份',{minFiles:2,multiple:true}),
 t('pdf-split','拆分 PDF','Split PDF','organize','split','逐页拆分，或按范围分成多份'),
 t('pdf-remove','删除页面','Remove pages','organize','file-minus-2','选择不需要的页面，从文件中删除'),
 t('pdf-extract','提取页面','Extract pages','organize','files','只导出你需要的那些页面'),
 t('pdf-organize','编排页面','Organize PDF','organize','layout-grid','拖动排序、复制页面，自由调整顺序'),
 t('pdf-scan','扫描成 PDF','Scan to PDF','organize','scan-line','拍摄或上传图片，增强后合成文档',{ext:['jpg','jpeg','png','webp','bmp'],multiple:true}),
 t('pdf-compress','压缩 PDF','Compress PDF','optimize','minimize-2','无损结构优化，或压缩为图像型 PDF'),
 t('pdf-repair','修复 PDF','Repair PDF','optimize','wrench','使用 QPDF 尝试恢复文件结构'),
 t('pdf-ocr','OCR 文字识别','OCR PDF','optimize','scan-text','识别扫描页中的中文与英文，导出文字'),
 t('image-pdf','JPG / 图片转 PDF','JPG to PDF','to-pdf','image','把多张图片装进一份 PDF',{existing:true,ext:['jpg','jpeg','png','webp'],multiple:true}),
 t('word-pdf','Word 转 PDF','Word to PDF','to-pdf','file-text','将 DOCX 文字内容重新排版',{existing:true,ext:['docx','txt','md']}),
 t('ppt-pdf','PowerPoint 转 PDF','PowerPoint to PDF','to-pdf','presentation','将 PPTX 的基础文字与图片转成 PDF',{ext:['pptx']}),
 t('excel-pdf','Excel 转 PDF','Excel to PDF','to-pdf','sheet','将 XLSX 工作表分页排版为 PDF',{ext:['xlsx']}),
 t('html-pdf','HTML 转 PDF','HTML to PDF','to-pdf','code-xml','将本地 HTML 的基础样式排版为 PDF',{ext:['html','htm']}),
 t('pdf-image','PDF 转 JPG / PNG','PDF to JPG','from-pdf','file-image','逐页输出图片，多页自动打包',{existing:true}),
 t('pdf-word','PDF 转 Word','PDF to Word','from-pdf','file-text','提取可选中文字，导出可编辑 DOCX',{existing:true}),
 t('pdf-ppt','PDF 转 PowerPoint','PDF to PowerPoint','from-pdf','presentation','每一页成为一张高清图像幻灯片'),
 t('pdf-excel','PDF 转 Excel','PDF to Excel','from-pdf','sheet','按文字坐标提取行列，导出 XLSX'),
 t('pdf-pdfa','PDF 转 PDF/A','PDF to PDF/A','from-pdf','archive','生成 PDF/A-2b 归档候选文件',{mode:'archive'}),
 t('pdf-rotate','旋转页面','Rotate PDF','edit','rotate-cw','对所选页面旋转 90°、180° 或 270°'),
 t('pdf-numbers','添加页码','Add page numbers','edit','list-ordered','设置起始页码、位置与字号'),
 t('pdf-watermark','添加水印','Add watermark','edit','stamp','自定义文字、透明度与倾斜角度'),
 t('pdf-crop','裁剪页面','Crop PDF','edit','crop','按四边比例裁剪可见范围'),
 t('pdf-edit','添加文字与图片','Edit PDF','edit','pencil','在页面上添加批注文字或图片'),
 t('pdf-forms','PDF 表单','PDF Forms','edit','text-cursor-input','填写已有表单，或创建基础表单字段'),
 t('pdf-unlock','解锁 PDF','Unlock PDF','security','lock-open','输入已知密码，移除文件加密'),
 t('pdf-protect','加密 PDF','Protect PDF','security','lock-keyhole','使用 AES-256 设置打开密码'),
 t('pdf-sign','手写签名','Sign PDF','security','signature','绘制或上传签名，放到指定位置'),
 t('pdf-redact','永久遮盖','Redact PDF','security','eraser','选择敏感区域，移除原内容后输出'),
 t('pdf-compare','比较 PDF','Compare PDF','security','columns-2','逐页比较文字与画面，导出差异报告',{minFiles:2,maxFiles:2,multiple:true}),
 t('pdf-summary','AI 摘要','AI Summarizer','intelligence','sparkles','提炼重点、结论与行动事项',{mode:'ai'}),
 t('pdf-translate','翻译 PDF','Translate PDF','intelligence','languages','翻译文字，重新排版为 DOCX / PDF',{mode:'ai'}),
 t('pdf-markdown','PDF 转 Markdown','PDF to Markdown','intelligence','file-code-2','提取文字，整理为带分页标记的 Markdown'),
];
export const NEW_PDF_TOOLS=PDF_TOOLS.filter(t=>!t.existing);
export function parsePageRange(input,count,{duplicates=false,allowEmpty=false}={}){
 if(!Number.isInteger(count)||count<1)throw new Error('文档页数无效');
 const text=String(input??'').trim().toLowerCase();if(text==='all'||text==='全部'||text==='*')return Array.from({length:count},(_,i)=>i);
 if(!text){if(allowEmpty)return[];throw new Error('请输入页面范围，例如 1-3,5；或输入 all 选择全部');}
 const pages=[];for(const token of text.replaceAll('，',',').split(',')){
  const part=token.trim(),match=/^(\d+)(?:\s*-\s*(\d+))?$/.exec(part);if(!match)throw new Error(`页面范围格式无效：${part||'空值'}`);
  const from=Number(match[1]),to=Number(match[2]||match[1]);if(from<1||to>count||from>count||to<1)throw new Error(`页码必须介于 1 和 ${count} 之间`);
  const step=from<=to?1:-1;for(let page=from;step>0?page<=to:page>=to;page+=step){pages.push(page-1);if(pages.length>300)throw new Error('一次最多编排 300 页');}
 }
 return duplicates?pages:[...new Set(pages)];
}
export function parseSplitGroups(input,count){return String(input).split(/[;；]/).filter(s=>s.trim()).map(s=>parsePageRange(s,count));}
export function diffLines(before,after){
 const a=before.split('\n').map(x=>x.trim()).filter(Boolean).slice(0,1500),b=after.split('\n').map(x=>x.trim()).filter(Boolean).slice(0,1500);
 const ca=new Map(),cb=new Map();for(const x of a)ca.set(x,(ca.get(x)||0)+1);for(const x of b)cb.set(x,(cb.get(x)||0)+1);
 const removed=[],added=[];for(const x of a){if((cb.get(x)||0)>0)cb.set(x,cb.get(x)-1);else removed.push(x);}for(const x of b){if((ca.get(x)||0)>0)ca.set(x,ca.get(x)-1);else added.push(x);}
 return{removed,added,changed:removed.length>0||added.length>0};
}
export function overlayPlacement(box,rotation,xPercent,yPercent,widthPercent,imageRatio){
 const r=((Number(rotation)%360)+360)%360;if(![0,90,180,270].includes(r))throw new Error('页面旋转角度无效');
 const viewWidth=r%180?box.height:box.width,viewHeight=r%180?box.width:box.height;
 const sx=Number(xPercent)/100*viewWidth,sy=Number(yPercent)/100*viewHeight,width=Number(widthPercent)/100*viewWidth,height=width*imageRatio;
 if(![sx,sy,width,height].every(Number.isFinite)||sx<0||sy<0||width<=0||height<=0||sx+width>viewWidth+.1||sy+height>viewHeight+.1)throw new Error('文字或图片超出页面，请调整位置与宽度');
 const bottom=sy+height;let x,y;if(r===0){x=box.x+sx;y=box.y+box.height-bottom;}else if(r===90){x=box.x+bottom;y=box.y+sx;}else if(r===180){x=box.x+box.width-sx;y=box.y+bottom;}else{x=box.x+box.width-bottom;y=box.y+box.height-sx;}
 return{x,y,width,height,rotation:r};
}
