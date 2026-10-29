# 保留地图

## Rhine：实体档案与终端

基线：LBEILC/RhineLabUI @ 12cc5e4013acb9408f753ff71de6b8492299b7c8。

| 必须一起考虑的模块 | 原始位置 | 为什么保留 |
| --- | --- | --- |
| 开场笔画、轨迹、排版 | src/boot*、src/startup*、src/typing-*、src/brand.ts | 节奏来自具体路径和时间点，不是一般淡入动画 |
| 档案与镜头 | src/scene.ts、src/motion.ts、src/archive-*、src/viewport-layout.ts | 阵列、选中波浪、抽取、视角和清晰度共同构成体验 |
| 玻璃内构 | src/appearance.ts、src/glass-reveal.ts、src/internal-optics.ts、public/assets/*.glb | 实际物理材质、几何、厚度和着色器共同产生质感 |
| 可编辑模型 | art/*.blend、art/*.py | 能在原始几何上继续改，而非重建近似物件 |
| 终端排版与语义 | src/main.ts、src/style.css、src/fonts.css、src/responsive.css、src/theme* | 品牌、字段、编号、平面正文与三维空间有固定关系 |
| 反馈与回退 | src/ui-transitions.ts、src/motion-preferences.ts、src/render-quality.ts、src/audio* | 连续切换、焦点、画质和声音设置是完成度的一部分 |
| 真实内容入口 | content/archives.json、scripts/archive-content.mjs、src/data.ts | 原始四十份档案保留供对照，后续在工作副本接项目数据 |

原版五类各八份与阵列逻辑相连。适配个人仓库时保留空间、材质和运动，单独放开分类数、每列数量、筛选与编号映射。不要为了“全部项目”偷偷丢弃 Fork 或归档项目；按用户确定的范围收录并标记。

## Eidolon：连续的光与滚动叙事

基线：Sallyn0225/eidolon-sc @ cd1c61751eddeaf1bd4cdef4133e5e67f3af4ec5。

下列路径均位于 frontend/src/app/(landing)/。

| 模块 | 原始位置 | 保留重点 |
| --- | --- | --- |
| 首屏与字体 | layout.tsx、landing.css、fonts/ | 黑底、首屏字集、衬线对比、CSS 光与 WebGL 光的无缝交接 |
| 叙事与排版 | Landing.tsx、Rail.tsx、Spectrum.tsx、Voice.tsx、Closing.tsx | 原始章节、非对称构图、竖排短文本和横向组合浏览 |
| 光与物理参数 | light.ts、StaticLight.tsx、LightStage.tsx、model/scene.ts、model/color.ts | 着色器、光束几何、颜色派生和滚动进度共同控制画面 |
| 时间线与状态 | model/timeline.ts、stageStore.ts、interactionStore.ts、model/interaction.ts | 统一时间线；逐帧渲染与离散组件状态分离 |
| 局部三维 | phoneStage.ts、phoneLayer.ts、memoryLayer.ts、canvasStage.ts | 手机与记忆场景延迟载入、离场停绘、失败局部回退 |
| 画质与可访问路径 | model/tier.ts、tierScript.ts、LightStage.tsx | 完整、轻量、基本、定格和静态档；聚焦和页内查找仍能定位内容 |

预览适配器只注入角色元数据和无后台的登录状态；没有重写上述视觉组件。第三方在线角色素材缺失时使用原来的颜色块、名字、静止图或无立绘回退。

## 后续个人首页的结合点

优先以原始运行项目为起点。可以选 Rhine 为项目档案主体验，Eidolon 为独立入口；也可以在 Eidolon 主页面中接入项目分组，再把 Rhine 细节查看器作为独立展示。具体宿主由第二步的用户意图与现有代码决定，不预先固定成“通用卡片网格”。

对每项修改记录“原样使用 / 薄适配 / 因实际冲突重构”，说明文件与原因。保留占比应根据文件清单或差异计算，不能把相似截图当作代码复用证明。
