import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {assetURL} from '../dist/engine.mjs';
test('conversion engines load below the GitHub Pages repository path',()=>{
 const base='https://example.github.io/forma-studio/engine.mjs';
 assert.equal(assetURL('pdf.mjs',base),'https://example.github.io/forma-studio/vendor/pdf.mjs');
 assert.equal(assetURL('ffmpeg/ffmpeg.js',base),'https://example.github.io/forma-studio/vendor/ffmpeg/ffmpeg.js');
 assert.equal(assetURL('cmaps/',base),'https://example.github.io/forma-studio/vendor/cmaps/');
});
test('entrypoint and engine contain no origin-root asset paths',()=>{
 const engine=readFileSync(new URL('../dist/engine.mjs',import.meta.url),'utf8');
 const html=readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
 assert.doesNotMatch(engine,/["'`]\/vendor\//);
 assert.doesNotMatch(html,/(?:src|href)="\/(?:vendor|app|styles)/);
});
