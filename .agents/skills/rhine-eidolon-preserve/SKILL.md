---
name: rhine-eidolon-preserve
description: "Reuse the bundled RhineLabUI archive and Eidolon-SC landing source to build or adapt an immersive project portfolio. Preserve their actual shaders, models, typography, timelines and interaction behavior through small explicit adapters. Use for this source-based portfolio workflow, not generic website generation."
license: "AGPL-3.0-or-later; bundled upstream code and assets retain their own licenses."
---

# Rhine × Eidolon：原样保留与薄适配

默认从随附源码继续做。用户要求最大化保留原来的精髓，允许大段原样保留；不要先搭一套通用首页，再用颜色或截图模拟参考。

## 从哪里开始

- [保留地图](references/preservation-map.md)：选择要沿用的原始模块、画面和交互。
- [运行与整合](references/integration.md)：复现原始体验、创建可编辑工作副本，再连接真实项目数据。
- [素材与许可](references/assets-and-licenses.md)：确认随包素材和原站外部素材的边界。
- 原始源码在 `assets/upstream/rhine/` 和 `assets/upstream/eidolon/`；固定提交、每个文件的 Git blob 与 SHA-256 在 [清单](assets/upstream-manifest.json)。

执行 `node scripts/verify-upstream.mjs` 检查快照。用 `node scripts/materialize-reference.mjs rhine --destination <新的目录>` 或 `eidolon` 创建工作副本。命令路径相对于本 Skill；安装在其他位置时使用脚本绝对路径。不要直接编辑 `assets/upstream/`。

## 做决定的顺序

1. 先运行对应的保留版，查看当前任务涉及的原始状态。优先沿用原文件、原组件与依赖锁；确有冲突才拆出模块或改适配层。
2. 按保留地图确定哪些内容原样继承。Rhine 的档案阵列、玻璃、镜头、滚动标题、检索和详情是一组；Eidolon 的光束、分光、光谱、章节轨、字体及滚动时间线是一组。不要在没有需求或实测问题时简化它们。
3. 先改真实数据、品牌文字、链接与配置，再改布局接缝。Eidolon 预览只替换服务端数据入口和离线接口，视觉组件仍来自上游。
4. 新总首页以真实 GitHub 项目为内容。把外部仓库数据与人工展示字段分开，保留稳定 repository id；需要解除 Rhine 五类各八份的固定编排时，修改数据映射与可见窗口，不用固定假项目填满。
5. 从用户最新要求决定开篇时长、明暗、章节数量和三维占比。首轮研究报告中“缩短开场”“默认重写”的建议已被本次最大化保留源码的要求覆盖，不能自动套用。

## 不能丢掉的实现关系

- 正文、标签、按钮和标准链接保持 DOM 语义；画布负责光与空间。
- 快速切换从当前运动状态接续；关闭过渡完成后再移除面板，恢复焦点和目录上下文。
- 保留减少动态、无 WebGL、素材缺失和局部画布失败的原有回退。
- 字体、模型、音频、着色器及 CSS 一起迁移；仅复制 TSX 或截图不足以保留效果。
- 两套全局样式和 Three.js 版本先保持各自边界。不要直接把 landing.css 的 html/body 规则混入 Rhine 舞台。

## 交付与校验

说明实际复用了哪些文件、哪些是适配代码，以及没有随包的外部素材。验证所改体验的完整路径：进入、选择、详情、返回、快速反向操作、窄屏和减少动态。构建工作副本后再次执行源快照校验，原始层应仍与固定提交一致。

本 Skill 不自行授权创建仓库、发消息或部署；按当前用户任务已有的授权执行。当前仓库是 Skill 与后续网站的共同工作仓库，准备源码包不代表已经完成个人网站。
