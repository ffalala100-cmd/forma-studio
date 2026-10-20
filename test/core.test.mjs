import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {TOOLS,validateFile,localOutline,validateOutline,buildPresentation,base} from '../dist/core.mjs';
const require=createRequire(import.meta.url);
const PptxGenJS=require('pptxgenjs'),JSZip=require('jszip');
test('file validation rejects unsupported, empty, and oversized files',()=>{
  const tool=TOOLS.find(t=>t.id==='pdf-word');
  assert.match(validateFile({name:'malware.exe',size:123},tool),/不支持/);
  assert.match(validateFile({name:'empty.pdf',size:0},tool),/为空/);
  assert.match(validateFile({name:'large.pdf',size:31*1024*1024},tool),/超过/);
  assert.equal(validateFile({name:'Report.PDF',size:100},tool),null);
});
test('document outline retains uploaded content and requested page count',()=>{
  const outline=localOutline('# 新产品发布方案\n产品目标：让团队协作更高效\n用户访谈：需要清晰的任务状态\n行动计划：先试点，再持续改进\n复盘机制：每周收集反馈',6,'file');
  assert.equal(outline.length,6);assert.equal(outline[0].title,'新产品发布方案');
  assert.ok(JSON.stringify(outline).includes('先试点'));assert.ok(JSON.stringify(outline).includes('用户访谈'));
});
test('AI response validation rejects malformed outlines and bounds content',()=>{
  assert.throws(()=>validateOutline({slides:[]},8),/格式无效/);
  assert.throws(()=>validateOutline([{title:'a',bullets:[]},{title:4,bullets:[]}],8),/缺少标题/);
  const a=validateOutline([{title:'封面',bullets:['要点']},{title:'结尾',bullets:['1','2','3','4','5']}],8);
  assert.equal(a[1].bullets.length,4);assert.equal(a[1].kind,'closing');
});
test('PPTX export contains requested slide count and editable Chinese text for all themes',async()=>{
  for(const theme of ['green','dark','purple']){
    const outline=localOutline('产品团队用户体验改进计划',8);
    const deck=buildPresentation(PptxGenJS,outline,theme);
    const buffer=await deck.write({outputType:'nodebuffer'});const zip=await JSZip.loadAsync(buffer);
    const slides=Object.keys(zip.files).filter(x=>/^ppt\/slides\/slide\d+\.xml$/.test(x));assert.equal(slides.length,8);
    const xml=await zip.file('ppt/slides/slide1.xml').async('string');assert.match(xml,/产品团队用户体验改进计划/);assert.match(xml,/<a:t>/);
    assert.ok(zip.file('[Content_Types].xml'));assert.ok(zip.file('ppt/presentation.xml'));
  }
});
test('output filenames remove filesystem reserved characters',()=>assert.equal(base('../A:B?.pdf'),'.._A_B_'));
