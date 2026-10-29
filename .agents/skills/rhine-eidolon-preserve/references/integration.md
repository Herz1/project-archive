# 运行与整合

## 在完整仓库内

需要 Node.js 22.18+、npm；打包另需 Python 3.10+。根项目没有第三方依赖。

    npm run verify
    npm run setup:rhine
    npm run dev:rhine

另一个终端：

    npm run setup:eidolon
    npm run dev:eidolon

Rhine 在 http://127.0.0.1:5173，Eidolon 在 http://127.0.0.1:3000。运行副本放在被 Git 忽略的 work/，不会修改原始层。开发入口是原始参考体验，不是已经完成的 Herz1 个人网站。

构建检查：

    npm run build:rhine
    npm run build:eidolon
    npm run verify

## 只安装了独立 Skill

    node <skill>/scripts/verify-upstream.mjs
    node <skill>/scripts/materialize-reference.mjs rhine --destination <新的工作目录>

然后在该目录执行 npm ci 和 npm run dev。eidolon 参数生成独立落地页预览。目标必须为空，脚本不会覆盖现有项目。上游字体、模型、音频和源代码已经随包分发；npm 依赖仍按上游锁文件安装。

## 预览适配的精确边界

- Rhine：复制完整随包 Web 运行材料，不修改源程序；未分发的商业字体由原本的字形图稿回退承接。
- Eidolon：保留原始 frontend/src 与依赖锁。生成预览时不拷入登录后的 (app) 路由和 proxy；替换两个页面数据入口，注入 29 位角色的名称、印象色、组合和字幕 fixture；补一个本地登录选项接口及参考说明页。
- 角色图片、语音、立绘与体素地址为空；源码已有回退仍然运行。预览不发起登录、AI 或语音后台请求。
- 原始快照里仍保留完整前端源文件供后续复用；只有生成的预览副本应用适配。适配清单写入副本 reference-kit.json。

## 第二步建议的编辑位置

把选择的参考材料生成到新的 website/ 目录，再在那里实施个人首页。不要重新搭一个无关脚手架。先替换项目数据、链接和品牌，再处理必要的布局或框架接缝；保留 shader、motion、models、fonts 和相应 CSS 的依赖关系。

两套渲染宿主可先各自独立构建或路由隔离。Rhine 的 Vite 与 Eidolon 的 Next/React、两套全局样式以及不同 Three.js 版本不能无检查地混成同一份入口。是否统一宿主属于后续实现决定。

当前包不创建网页部署或定时数据同步。连接真实 GitHub 项目时，按用户指定账号和范围取数据；不把参考角色 fixture 当作真实项目。
