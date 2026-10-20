# Forma 格式工坊

**在线使用：** https://ffalala100-cmd.github.io/forma-studio/#pdf

## PDF 工具中心

现已整合七组、33 个 PDF 工具，包含顶部全部工具菜单、分类搜索、页面预览、页码范围、页面编排与处理结果下载。原有图片、视频、音频与 PPT 创作入口保留。

- **整理：** 合并、拆分、删除、提取、编排页面、图片扫描为 PDF。
- **优化：** 无损结构优化、图像压缩、QPDF 结构修复、中英文 OCR。
- **转换：** JPG / DOCX / PPTX / XLSX / HTML 转 PDF；PDF 转图片、Word、图像型 PPTX、基于文字坐标的 Excel、PDF/A-2b 候选文件。
- **编辑：** 旋转、页码、水印、可见区域裁剪、添加文字与图片、填写或创建基础表单。
- **安全与比较：** AES-256 打开密码、已知密码解锁、手写图像签名、永久区域遮盖、逐页文字与画面比较。
- **智能：** 使用访问者自行配置的 AI 接口生成摘要与译文；本地 PDF 转 Markdown。

### 处理范围

大部分功能在浏览器内处理，PDF 默认最多 100 页。OCR 每次最多 20 页，比较每次最多 20 页。引擎仅在需要时加载。OCR 默认关闭语言数据缓存，不持久化用户文件。

Office / HTML 转换是基础内容排版，不保证复杂版式、母版、动画、图表和合并单元格一致。PDF 转 PPT 以页面图像为内容，页内文字不可单独编辑。OCR 导出 TXT / DOCX，当前不向原 PDF 写入搜索层。

永久遮盖会重新渲染全部页面，删除原始文字、表单、图层与元数据；裁剪仅改变可见区域，不适用于删除敏感信息。手写签名为图像签名，不含数字证书或身份认证。加密仅使用本次输入的密码，解锁需要已知密码。

PDF/A 输出由 Ghostscript 按 PDF/A-2b 参数生成，包含归档 XMP 标识和 sRGB OutputIntent；不提供合规认证，正式归档前请通过 veraPDF 验证。

AI 摘要 / 翻译仅在用户点击后将提取的前 60,000 字发送至其配置的接口。API 密钥仅保留在页面会话内，刷新即清除；没有预置共享密钥。

### PDF 验证

`npm test` 包含页面范围、重复页面、比较与旋转坐标测试。运行 `node test/fixtures.mjs`、`node test/pdf-fixtures.mjs` 生成合成文件后，可通过本地 `/__qa/pdf-runner.html` 和 `/__qa/ui-runner.html` 检查处理引擎及交互。QA 页面不在 dist 中，不发布到线上。AI 交互测试使用内存中的假接口响应，不调用付费模型。

新增引擎：PDF-lib、ExcelJS、Tesseract.js、QPDF WASM、Ghostscript WASM、DOMPurify。Ghostscript 使用 AGPL-3.0；上游代码见 https://github.com/jsscheller/ghostscript-wasm 和 https://github.com/ArtifexSoftware/ghostpdl 。依赖许可证与引擎说明会随网站一起发布。

中文文件处理工作台。静态部署，文件转换在浏览器本地完成。

## 运行

需要 Node.js 22+。运行 `npm install`、`npm run prepare`、`npm start`，打开 http://127.0.0.1:4173 。通过 HTTP / HTTPS 访问，不支持直接双击 HTML。

`dist/` 为完整可部署目录，包含所有转换依赖和 FFmpeg 单线程引擎。引擎拆分为多个二进制资源，加载时在内存合并。单个资源低于 25 MiB。无需配置 COOP / COEP，也不上传原始文件。

## 功能

- PDF → DOCX / TXT：提取可选文字与分页，不还原复杂表格、图片、布局；扫描件请先使用 PDF 工具中心的 OCR。
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
