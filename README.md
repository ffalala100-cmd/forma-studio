# Forma 格式工坊

中文文件处理工作台。静态部署，文件转换在浏览器本地完成。

## 运行

需要 Node.js 22+。运行 `npm install`、`npm run prepare`、`npm start`，打开 http://127.0.0.1:4173 。通过 HTTP / HTTPS 访问，不支持直接双击 HTML。

`dist/` 为完整可部署目录，包含所有转换依赖和 FFmpeg 单线程引擎。引擎拆分为多个二进制资源，加载时在内存合并。单个资源低于 25 MiB。无需配置 COOP / COEP，也不上传原始文件。

## 功能

- PDF → DOCX / TXT：提取可选文字与分页，不还原复杂表格、图片、布局；扫描件暂不支持 OCR。
- DOCX / TXT / Markdown → PDF：统一排版为图片型 PDF，支持中文；不保留复杂布局。
- 图片 → PNG / JPEG / WebP；GIF 仅首帧；AVIF 解码取决于浏览器。
- 多图合并 PDF；PDF 逐页输出 PNG / JPG，多页打包 ZIP。
- FFmpeg 视频 → MP4 / MOV / WebM / GIF / MP3；音频 → MP3 / WAV / M4A / OGG。
- PPT：提示词或 TXT / Markdown / DOCX / PDF 输入，3 种风格，4–12 页，编辑大纲、下载 Markdown、导出可编辑 PPTX。
- 批量转换、逐文件错误反馈、打包下载、收藏与最近任务。

## AI 配置

默认采用本地模板生成大纲，不是大模型内容创作。用户可在 AI 设置中填写兼容 Chat Completions 的 HTTPS 接口、模型 ID 与 API key。接口需要允许浏览器 CORS 调用。启用后，文字内容直接发往用户指定接口；密钥仅保存在会话内存，刷新即清除。生产环境如需集中计费，应新增服务端代理及鉴权，避免共享管理员密钥给浏览器。

## 隐私与限制

任务元数据和收藏保存在 localStorage；源文件、生成内容和 API 密钥不持久化。下载结果只保留在内存，刷新后释放。文件总量限制为每批 120 MB，视频/音频单文件 80 MB，普通文件单文件 20–30 MB。PDF 最多 100 页。移动设备可能无法处理较大的视频，建议使用最新版桌面 Chrome / Edge。转换失败会报告真实错误，不提供模拟下载。

## 验证

`npm test` 验证文件校验、大纲生成、模型响应校验，以及三种主题的真实 PPTX 结构与可编辑中文内容。`node test/fixtures.mjs` 生成浏览器端到端测试文件。

## 依赖与许可

转换使用 PDF.js、docx、Mammoth、jsPDF、PptxGenJS、JSZip、FFmpeg.wasm。图标使用 Lucide。发布目录包含 THIRD-PARTY-NOTICES.txt 与原始许可证。FFmpeg 构建包含 GPL 组件，对应源代码见列出的上游项目。字体由 Google Fonts 提供，离线时使用设备字体。

## GitHub Pages 发布

已配置 GitHub Actions 自动部署：推送到 main 后，工作流安装锁定的依赖、运行测试、构建 dist，并发布至 Pages。

在仓库 Settings → Pages 中选择 GitHub Actions。转换引擎路径基于模块 URL 解析，支持项目子目录部署。网站的文件处理和 PPT 本地模板无需服务器；AI 扩写仍使用访问者自行填写的模型接口与密钥。
