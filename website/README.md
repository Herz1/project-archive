# Herz1 · Project Archive

个人项目总首页：https://herz1.github.io/project-archive/

| 页面 | 源码起点 | 内容 |
| --- | --- | --- |
| `/` | `intro/`，Eidolon 原前端 | 黑底、分光、光谱、手机、浮岛与八幕叙事；真实项目名牌是标准链接 |
| `/archive/` | `archive/`，Rhine 原程序 | 原始开场、玻璃阵列、抽取解密、检索、详情、模型查看、收藏与偏好设置 |
| `/projects/` | `directory/`，档案目录样式 | 所有公开仓库的 HTML 目录，筛选、语言、排序；无 JS 仍有全部源码入口 |
| `/about/` | `intro/` | 来源、许可与数据说明 |

默认保留完整开场。具体项目直链使用 `archive/?project=<GitHub numeric id>&scene=archive`，直接进入该项目详情。两套 Three.js 与全局 CSS 沿用各自边界，构建后合并为同一静态站点。

## 本地运行

Node.js 24、npm。根目录无需安装依赖。

```sh
npm run setup:website
npm run build:website
npm run test:website
npm run preview:website
```

打开 http://127.0.0.1:4173/project-archive/ 。开发单层时分别运行 `npm run dev --prefix website/intro` 或 `npm run dev --prefix website/archive`。依赖锁保持随上游继承的版本。

## 更新项目

`npm run sync:projects` 读取 **Herz1 本人拥有的全部公开仓库**，保留 Fork、归档及空仓库。仓库快照和人工说明分开：

- `content/repositories.generated.json`：GitHub 数字 ID、语言、链接、推送时间、星标与公开状态；分页收全，失败保留旧快照。
- `content/projects.curated.json`：展示名称、分类、简介、稳定档案编号、标签、项目说明和已确认的演示。
- `content/projects.generated.json`：构建时合并的公开数据，也发布为 `/projects.json`。

新仓库自动收录到“开源与工具”，其档案编号由数字仓库 ID 派生；之后可补人工内容。已存在的档案编号不随排序改变。只有人工确认的 `demo` 地址会显示为演示；Fork 的上游主页不会被冒充为个人作品。GitHub `size` 会四舍五入，空仓库由 commits API 的 409 状态确认。已核对的离线快照由人工字段补充这个状态。

发布工作流每次推送或手动运行时更新公开数据并重新构建，浏览器不使用 GitHub token。没有设定时任务。

## 字体与原始层

原始快照保持在 `.agents/skills/rhine-eidolon-preserve/assets/upstream/`，从不修改。`npm run verify` 校验 1,506 个文件的原始字节。

已提交完整字体子集，普通构建不需要 Python。修改中文文案时，可用官方 Noto CJK 的 `NotoSerifSC-SemiBold.otf`、`NotoSansSC-Regular.otf` 和 fonttools/brotli 运行：

```sh
python scripts/prepare-portfolio-fonts.py --font-dir <字体目录>
cd website/intro
npm exec vitest run 'src/app/(landing)/fonts/coverage.test.ts'
```

该工具仅生成个人站工作副本中的 WOFF2 和启动短语 SVG。现有字符优先复用原作给出的轮廓，缺字用 OFL 的 Noto 字形补齐；不需要商业 Novecento 字体文件。

保留范围、适配记录和验证见 [implementation.md](docs/implementation.md)。上游和第三方许可见根目录 `THIRD_PARTY_NOTICES.md`，原字体、手机模型署名随源文件保留。
