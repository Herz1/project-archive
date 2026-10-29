import type { Metadata } from "next";
import { sitePath } from "@/lib/site";
import projects from "@/data/projects.json";
export const metadata: Metadata = { title: "来源与许可 · Herz1", alternates: { canonical: sitePath("about/") } };
export default function About() {
 return <main className="lp-credits">
  <nav className="lp-credit-nav"><a href={sitePath("")}>← 光谱入口</a><a href={sitePath("projects/")}>全部项目</a><a href={sitePath("archive/?scene=archive")}>档案终端 ↗</a></nav>
  <h1>一份档案，两束来光。</h1>
  <p>这是 Herz1 的项目总首页。公开仓库快照包含 {projects.counts.total} 个项目，最近同步于 {projects.syncedAt.slice(0,10)}。Fork、空仓库、制作中的工程与已经上线的页面分别标注。</p>
  <h2>保留原作的代码与设计</h2>
  <p>光谱入口基于 <a href="https://github.com/Sallyn0225/eidolon-sc">Sallyn0225 / Eidolon-SC</a>（AGPL-3.0-or-later）：沿用棱镜与光束着色器、八幕滚动时间线、光谱、手机模型、浮岛场景和字体体系。公开内容改为真实项目；原作外置的角色、语音及卡图没有随站分发，场景使用原有的无素材回退。</p>
  <p>档案终端基于 <a href="https://github.com/LBEILC/RhineLabUI">LBEILC / RhineLabUI</a>（MIT）：沿用玻璃阵列、镜头、标题运动、抽取与解密、检索、详情及偏好设置。数据改为真实仓库，分类和数量不再固定。品牌文字与档案说明由本站替换。</p>
  <h2>字体、模型与许可</h2>
  <p>字体继续使用 Noto Sans SC、Noto Serif SC、Shippori Mincho B1（SIL OFL）以及 MiSans（小米字体许可）。新增中文字形以 Noto 官方字体生成自托管子集。商业 Novecento 字体没有分发；档案启动画面使用随原作提供的文字轮廓，并对个人品牌所缺的字形使用 Noto 轮廓补齐。手机模型及其他素材沿用上游附带的署名与许可。</p>
  <p>完整来源、固定提交、逐文件校验清单与第三方许可证保存在 <a href="https://github.com/Herz1/project-archive">本站公开源码仓库</a>。本站适配代码以 AGPL-3.0-or-later 分发；上游和第三方文件保留各自许可。</p>
  <h2>访问与本地记录</h2>
  <p>无需登录。页面不接入 AI 对话、支付或用户账号；收藏与终端设置使用当前浏览器的本地存储。项目资料来自公开 GitHub 数据与仓库 README，链接指向各自维护的源码和已确认的演示地址。</p>
 </main>;
}
