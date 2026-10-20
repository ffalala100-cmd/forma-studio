export const TOOLS = [
  {id:'pdf-word',name:'PDF 转 Word',from:'PDF',to:'DOCX',category:'document',desc:'提取 PDF 文字，继续编辑你的文档',icon:'file-text',color:'coral',targetColor:'blue',ext:['pdf'],outputs:['docx'],badge:'热门',note:'提取可选中文字并保留分页，不保留复杂排版、表格和插图。扫描件请通过 PDF 工具中心的 OCR 识别工具导出 Word。',limit:30},
  {id:'word-pdf',name:'Word 转 PDF',from:'DOCX',to:'PDF',category:'document',desc:'将文档内容排版为便于分享的 PDF',icon:'file-text',color:'blue',targetColor:'coral',ext:['docx','txt','md'],outputs:['pdf'],note:'以统一版式重新排版文字内容，支持中文。原始复杂布局、图片、表格和页眉页脚不会保留。',limit:20},
  {id:'image-convert',name:'图片格式转换',from:'JPG',to:'PNG',category:'image',desc:'JPG、PNG、WebP，随需自由切换',icon:'image',color:'green',targetColor:'green',ext:['jpg','jpeg','png','webp','bmp','gif','avif'],outputs:['png','jpg','webp'],badge:'本地处理',note:'支持 JPG、PNG、WebP、BMP、GIF、AVIF 输入。动画只导出第一帧；转 JPG 时透明区域填充白色。AVIF 解码取决于浏览器支持。',limit:30},
  {id:'video-convert',name:'视频格式转换',from:'MP4',to:'MOV',category:'video',desc:'常见视频格式互转，灵活适配设备',icon:'clapperboard',color:'purple',targetColor:'purple',ext:['mp4','mov','webm','mkv','avi','m4v'],outputs:['mp4','mov','webm','gif','mp3'],note:'使用浏览器本地 FFmpeg。首次加载约 31 MB 引擎；视频不上传。建议使用电脑和 80 MB 以内的短视频，转换速度取决于设备。',limit:80},
  {id:'image-pdf',name:'图片转 PDF',from:'JPG',to:'PDF',category:'document',desc:'多张图片合成一份整洁的 PDF',icon:'image',color:'amber',targetColor:'coral',ext:['jpg','jpeg','png','webp','bmp','gif','avif'],outputs:['pdf'],note:'按添加顺序合并图片，每张图片占一页 A4。图片等比居中，动画取第一帧。',limit:30},
  {id:'ppt-create',name:'文件 / 提示词转 PPT',from:'TXT',to:'PPTX',category:'ppt',desc:'把一份文档、一个想法，变成演示',icon:'presentation',color:'blue',targetColor:'green',ext:['txt','md','docx','pdf'],outputs:['pptx'],badge:'新功能',note:'',limit:30},
  {id:'pdf-image',name:'PDF 转图片',from:'PDF',to:'PNG',category:'document',desc:'逐页导出清晰图片，打包轻松分享',icon:'file-image',color:'coral',targetColor:'green',ext:['pdf'],outputs:['png','jpg'],note:'逐页渲染为图片；多页自动打包 ZIP。单个 PDF 最多处理 100 页。',limit:30},
  {id:'audio-convert',name:'音频格式转换',from:'WAV',to:'MP3',category:'video',desc:'转换 MP3、WAV、M4A 等音频格式',icon:'music-2',color:'purple',targetColor:'amber',ext:['mp3','wav','m4a','aac','flac','ogg','opus','mp4','webm'],outputs:['mp3','wav','m4a','ogg'],note:'使用本地 FFmpeg 处理，不上传音频。首次加载约 31 MB 引擎，也支持从 MP4 / WebM 提取音轨。',limit:80},
  {id:'pdf-text',name:'PDF 转文本',from:'PDF',to:'TXT',category:'document',desc:'提取可复制的文字，整理更轻松',icon:'file-text',color:'coral',targetColor:'blue',ext:['pdf'],outputs:['txt'],note:'仅提取可选中的文字，扫描件请先使用 PDF 工具中心的 OCR 识别工具。',limit:30},
];
export const CATEGORY_NAMES={home:'全部工具',document:'文档转换',image:'图片转换',video:'视频与音频',ppt:'PPT 创作',history:'最近任务',favorites:'收藏的工具'};
export const THEMES={green:{name:'自然森绿',bg:'194F3C',accent:'D8EFAE',ink:'28452E',paper:'F5F7EF',muted:'77916A'},dark:{name:'极简黑白',bg:'252A2C',accent:'E8E9DF',ink:'292D30',paper:'F8F8F4',muted:'80867B'},purple:{name:'温柔暮紫',bg:'655375',accent:'E3D6F0',ink:'574464',paper:'F8F4FA',muted:'9E86AA'}};
export function ext(name){return String(name).split('.').pop().toLowerCase()}
export function base(name){return String(name).replace(/\.[^.]+$/,'').replace(/[<>:"/\\|?*\x00-\x1f]/g,'_').slice(0,80)||'forma'}
export function bytes(size){if(size<1024)return size+' B';if(size<1048576)return(size/1024).toFixed(1)+' KB';return(size/1048576).toFixed(1)+' MB'}
export function validateFile(file,tool){if(!tool.ext.includes(ext(file.name)))return `不支持 ${ext(file.name).toUpperCase()} 文件，请选择 ${tool.ext.map(e=>e.toUpperCase()).join('、')}`;if(file.size>tool.limit*1024*1024)return `单个文件不能超过 ${tool.limit} MB`;if(file.size===0)return '文件为空，请选择有效文件';return null}
export function textLines(text){return String(text).replace(/\r/g,'').split('\n').map(x=>x.replace(/^\s*(?:#{1,6}|[-*•]|\d+[.、])\s*/, '').trim()).filter(Boolean)}
export function localOutline(text,count=8,mode='prompt'){
  count=Math.max(4,Math.min(12,Number(count)||8));const lines=textLines(text);if(!lines.length)throw new Error('请先输入主题或导入文件');
  const title=(mode==='file'?lines[0]:(lines[0].match(/[「“《](.+?)[」”》]/)?.[1]||lines[0].replace(/^(请|帮我)?(生成|制作|做)(一个|一份|关于)?/,'').replace(/的?(PPT|ppt|演示文稿)[。！!]?$/,'').split(/[，,。；;！!]/)[0])).slice(0,42)||'我的演示文稿';
  const cover={title,bullets:[mode==='file'?'基于上传文档整理':'演示主题与行动框架',lines[1]?.slice(0,100)||'从想法出发，让表达清晰有序'],kind:'cover'};
  const content=lines.slice(1).flatMap(line=>line.length>180?line.match(/.{1,150}(?:[。；;!?！？]|$)|.{1,150}/gu)||[line]:[line]).slice(0,80);
  const result=[cover];
  if((mode==='file'||lines.length>2)&&content.length){
    const chunks=Math.ceil(content.length/(count-2));
    for(let i=0;i<count-2;i++){const part=content.slice(i*chunks,(i+1)*chunks);result.push({title:part[0]?.length<28?part[0]:`内容梳理 · ${String(i+1).padStart(2,'0')}`,bullets:part.length?part.slice(part[0]?.length<28&&part.length>1?1:0).map(x=>x.slice(0,240)).slice(0,4):['在这里补充这一部分的主要内容','添加来自原始文件的事实、案例或结论'],kind:'content'});}
  }else{
    const plan=[
      ['背景与目标',[`明确「${title.slice(0,24)}」的讨论范围与目标受众`,'梳理当前背景、现状与需要解决的问题','写出本次演示希望达成的具体目标']],
      ['核心问题与机会',['从用户、业务或项目视角列出关键需求','区分已知事实、待验证假设与信息缺口','按影响程度和执行难度明确优先级']],
      ['思路与解决方案',[`围绕「${title.slice(0,24)}」提出可执行的核心思路`,'拆解方案的关键组成与实现方式','结合真实案例说明方案价值，补充来源']],
      ['行动路径与里程碑',['第一阶段：调研与目标确认，明确交付标准','第二阶段：小范围试点，收集反馈并迭代','第三阶段：扩大执行，形成稳定工作流程']],
      ['资源与协作安排',['明确负责人、参与角色及协作边界','评估所需时间、工具与资源投入','建立沟通节奏与阶段评审机制']],
      ['风险与应对',['识别执行过程中的主要不确定性','为关键风险准备替代方案与触发条件','持续记录问题与决策，及时调整执行路径']],
      ['衡量与复盘',['选择能够验证目标达成情况的指标','补充真实基线、目标值与数据来源','根据结果总结经验，确定下一轮优化方向']],
      ['沟通与落地',['让关键信息保持清晰、简洁、可追溯','面向不同角色说明价值与所需行动','确认下一步的负责人、交付物与时间节点']],
      ['长期演进',['沉淀可复用的方法、文档和工具','定期检查方案与目标是否仍然一致','根据新信息持续更新行动优先级']],
      ['讨论与共识',['列出需要参与者共同确认的问题','记录不同意见与尚未解决的分歧','形成清晰的后续行动与决策记录']]
    ];
    for(let i=0;i<count-2;i++)result.push({title:plan[i][0],bullets:plan[i][1],kind:'content'});
  }
  result.push({title:'下一步，让想法发生',bullets:['确认核心观点与需要补充的事实','明确行动负责人和推进时间','谢谢观看 · 欢迎交流'],kind:'closing'});return result;
}
export function validateOutline(value,count){if(!Array.isArray(value)||value.length<2||value.length>15)throw new Error('模型返回的大纲格式无效，请重新生成');return value.slice(0,count).map((s,i)=>{if(typeof s.title!=='string'||!Array.isArray(s.bullets))throw new Error('模型返回的页面缺少标题或要点');return{title:s.title.slice(0,60),bullets:s.bullets.filter(x=>typeof x==='string').slice(0,4).map(x=>x.slice(0,240)),kind:i===0?'cover':i===value.length-1?'closing':'content'}})}
export function buildPresentation(PptxGenJS,outline,themeKey='green'){
  const ppt=new PptxGenJS();ppt.layout='LAYOUT_WIDE';ppt.author='Forma 格式工坊';ppt.subject='由 Forma 生成的可编辑演示文稿';ppt.title=outline[0]?.title||'演示文稿';ppt.company='Forma';ppt.lang='zh-CN';ppt.theme={headFontFace:'Microsoft YaHei',bodyFontFace:'Microsoft YaHei',lang:'zh-CN'};
  const t=THEMES[themeKey]||THEMES.green;const W=13.333,H=7.5;
  outline.forEach((item,i)=>{
    const s=ppt.addSlide();const cover=i===0||i===outline.length-1;s.background={color:cover?t.bg:t.paper};
    const text=(value,opts)=>s.addText(value,{fontFace:'Microsoft YaHei',margin:0,breakLine:false,fit:'shrink',...opts});
    if(cover){
      s.addShape(ppt.ShapeType.ellipse,{x:9.6,y:2.2,w:5.3,h:5.3,line:{color:t.accent,transparency:75,width:1},fill:{color:t.bg,transparency:100}});
      s.addShape(ppt.ShapeType.ellipse,{x:10.1,y:2.7,w:4.3,h:4.3,line:{color:t.accent,transparency:83,width:1},fill:{color:t.bg,transparency:100}});
      text('FORMA  /  IDEAS INTO MOTION',{x:.75,y:.63,w:8,h:.24,fontSize:9,charSpacing:3,color:t.accent});
      s.addShape(ppt.ShapeType.rect,{x:.77,y:2.08,w:.55,h:.065,line:{color:t.accent,transparency:100},fill:{color:t.accent}});
      text(item.title,{x:.75,y:2.55,w:9.8,h:1.7,fontSize:item.title.length>24?31:39,bold:true,color:t.accent,valign:'mid'});
      text(item.bullets.join('\n'),{x:.8,y:4.62,w:9.3,h:1.12,fontSize:15,color:'D8E2CF',breakLine:false,paraSpaceAfterPt:10});
      text('格式工坊 · 让每一个想法，都有清晰的表达',{x:.8,y:6.7,w:9,h:.25,fontSize:9,color:t.accent,transparency:30});
    }else{
      text(`FORMA  /  ${String(i).padStart(2,'0')}`,{x:.75,y:.55,w:9,h:.22,fontSize:8,charSpacing:2,color:t.muted});
      text(item.title,{x:.75,y:1.18,w:11.8,h:.78,fontSize:29,bold:true,color:t.ink});
      s.addShape(ppt.ShapeType.line,{x:.78,y:2.16,w:11.75,h:0,line:{color:'DDE3D5',width:1}});
      const n=Math.max(item.bullets.length,1);const cardH=Math.min(1.05,3.7/n-.14);
      item.bullets.forEach((b,j)=>{
        const y=2.58+j*(cardH+.18);
        s.addShape(ppt.ShapeType.roundRect,{x:.78,y,w:.56,h:.56,rectRadius:.08,line:{color:t.bg,transparency:100},fill:{color:t.bg}});
        text(String(j+1).padStart(2,'0'),{x:.78,y:y+.13,w:.56,h:.25,fontSize:10,bold:true,color:t.accent,align:'center'});
        text(b,{x:1.64,y:y+.02,w:10.55,h:cardH-.05,fontSize:b.length>120?14:18,color:t.ink,valign:'mid',breakLine:false});
      });
      text(outline[0].title,{x:.8,y:6.84,w:10,h:.22,fontSize:8,color:t.muted});
    }
    text(`${String(i+1).padStart(2,'0')} / ${String(outline.length).padStart(2,'0')}`,{x:11.65,y:6.82,w:.9,h:.22,fontSize:8,align:'right',color:cover?t.accent:t.muted});
  });return ppt;
}
