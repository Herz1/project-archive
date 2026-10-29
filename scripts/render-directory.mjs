import { readFile } from "node:fs/promises";
export const escape = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
export function renderDirectory(data) {
  const e=escape, base=data.basePath, url=base+"/projects/";
  const date=new Intl.DateTimeFormat("zh-CN",{timeZone:"Asia/Singapore",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date(data.syncedAt));
  const languages=[...new Set(data.projects.map(p=>p.language).filter(Boolean))].sort();
  const rows=data.projects.map(p=>`<article class="record" id="repo-${p.id}" data-repo="${p.id}" style="--project-color:${e(p.color)}">
    <div class="record-number"><span>${e(p.archiveId)}</span><i></i></div>
    <div class="record-main"><p class="record-category">${e(p.category)} <span>／ ${e(p.status)}</span>${p.fork?'<b class="flag">FORK</b>':""}${p.empty?'<b class="flag">EMPTY</b>':""}${p.archived?'<b class="flag">ARCHIVED</b>':""}</p>
      <h2><a href="${e(p.url)}" target="_blank" rel="noopener noreferrer">${e(p.displayName)} <span aria-hidden>↗</span></a></h2>
      <p class="repo-name">${e(p.fullName)}</p><p class="record-summary">${e(p.summary)}</p>
      <ul class="tags" aria-label="项目标签">${p.tags.map(t=>`<li>${e(t)}</li>`).join("")}</ul>
    </div>
    <div class="record-meta"><span>${e(p.language||"未指定语言")}</span><time datetime="${e(p.pushedAt)}">${e(p.pushedAt.slice(0,10))}</time><span>★ ${p.stars} <span class="muted">${p.license?e(p.license):"未声明许可"}</span></span></div>
    <div class="record-actions"><a class="source" href="${e(p.url)}" target="_blank" rel="noopener noreferrer">源码 <span>↗</span></a>${p.demo?`<a class="demo" href="${e(p.demo)}" target="_blank" rel="noopener noreferrer">在线演示 <span>↗</span></a>`:""}<a href="${e(p.detailUrl)}">三维档案 <span>→</span></a></div>
  </article>`).join("\n");
  const json=JSON.stringify(data.projects).replaceAll("<","\\u003c");
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light dark"><title>全部项目 · Herz1</title><meta name="description" content="Herz1 的全部公开 GitHub 项目。按方向、语言和名称查找源码、演示与项目档案。"><link rel="canonical" href="${e(data.origin+url)}"><link rel="icon" href="${base}/favicon.svg"><link rel="stylesheet" href="${base}/archive/assets/directory-fonts.css"><link rel="stylesheet" href="directory.css"><script src="directory.js" defer></script></head>
  <body><a class="skip-link" href="#catalog">跳到项目列表</a>
    <header class="topbar"><a class="wordmark" href="${base}/">HERZ1 <span>／ PROJECT ARCHIVE</span></a><nav aria-label="主导航"><a href="${base}/">光谱入口</a><a href="${base}/archive/?scene=archive">档案终端 ↗</a><a href="https://github.com/Herz1" target="_blank" rel="noopener noreferrer">GitHub ↗</a></nav></header>
    <main><section class="intro"><div><p class="eyebrow">PUBLIC REPOSITORIES <span>／ 公开项目</span></p><h1>每个想法，<br>都有一份档案。</h1><p class="lede">网站、创作、工具与实验。这里收录我的全部公开仓库，<br class="desktop-break">也保留那些还在起点的尝试。</p><a class="terminal-link" href="${base}/archive/">重播档案开场 <span>↗</span></a></div><div class="inventory"><span class="inventory-number">${String(data.counts.total).padStart(2,"0")}</span><p>PUBLIC PROJECTS</p><dl><div><dt>方向</dt><dd>${data.categories.length}</dd></div><div><dt>Fork</dt><dd>${data.counts.forks}</dd></div><div><dt>空仓库</dt><dd>${data.counts.empty}</dd></div></dl></div></section>
    <section class="catalog" aria-label="项目目录" id="catalog"><div class="catalog-head"><p>ARCHIVE INDEX <span>／ 全部项目</span></p><span class="sync">公开数据 · ${e(date)}</span></div>
      <form class="controls" data-enhance hidden role="search" autocomplete="off"><label class="search-label"><span>检索项目</span><input type="search" id="search" name="q" placeholder="名称、简介、标签…" aria-keyshortcuts="/"></label><label><span>语言</span><select id="language" name="language"><option value="">全部语言</option>${languages.map(l=>`<option>${e(l)}</option>`).join("")}</select></label><label><span>排序</span><select id="sort" name="sort"><option value="archive">档案编号</option><option value="updated">最近推送</option><option value="stars">星标数量</option><option value="name">仓库名称</option></select></label><button class="clear" type="reset">清除筛选 ↺</button></form>
      <div class="category-filters" data-enhance hidden role="group" aria-label="按分类筛选"><button type="button" data-category="" aria-pressed="true">全部 <small>${data.counts.total}</small></button>${data.categories.map(c=>`<button type="button" data-category="${e(c)}" aria-pressed="false">${e(c)} <small>${data.projects.filter(p=>p.category===c).length}</small></button>`).join("")}</div>
      <div class="result-header"><span id="result-count" role="status" aria-live="polite">${data.counts.total} 个项目</span><span>PROJECT / LANGUAGE / LINKS</span></div>
      <div id="records">${rows}</div><p class="no-results" id="no-results" hidden>没有找到符合条件的项目。<button type="button" id="reset-empty">清除筛选 →</button></p>
      <noscript><p class="noscript">全部项目已完整列出。浏览器开启 JavaScript 后可使用筛选与排序。</p></noscript>
    </section></main>
    <footer><span>HERZ1 <i>／</i> 项目、界面与个人实验</span><div><a href="${base}/about/">来源与许可</a><a href="https://github.com/Herz1/project-archive">本站源码 ↗</a><a href="${base}/projects.json">公开项目数据 ↗</a></div></footer>
    <script type="application/json" id="project-data">${json}</script>
  </body></html>`;
}
if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replaceAll("\\","/"))) console.log(renderDirectory(JSON.parse(await readFile("website/content/projects.generated.json","utf8"))));
