# 本地验证 · 2026-10-29

| 检查 | 结果 |
| --- | --- |
| 官方 Skill quick_validate.py | 通过 |
| npm run verify | 1,506 个原始文件与固定提交的 Git blob / SHA-256 一致 |
| npm test | 2 项通过：真实组件/fixture 的工作副本生成；已有目录和源码目录保护 |
| npm run setup:rhine | 按原始锁安装成功，保留 rolling-number 的上游安装补丁 |
| npm run build:rhine | TypeScript、Vite、PWA 构建通过；818 项离线资源约 33.8 MiB |
| npm run setup:eidolon | 按原始锁安装成功 |
| npm run build:eidolon | Next.js 编译、TypeScript、页面数据收集与静态产物生成通过 |
| 本地 HTTP | 两个首页与本地登录选项接口均返回 200 |
| 浏览器 | Rhine 入口、阵列、详情和解密；Eidolon 首屏、29 位角色的八幕内容与棱镜分光 |

截图为本地工作副本的实际浏览器输出，1440×1000。Eidolon 使用开发服务器，左下角的 Next 开发标记不属于生产页面。

- [Rhine 原始详情](rhine-preserved.png)
- [Eidolon 原始首屏](eidolon-preserved.png)
- [Eidolon 原始分光](eidolon-prism-preserved.png)

没有改写原有视觉模块，没有为“完整预览”下载未随仓库分发的角色素材。此验证证明所保留的源码与适配层可运行，不表示两套程序已合并成个人网站，也不宣称与线上部署逐像素一致。

窄屏与减少动态的原始参考研究见 research/phase-1/；本轮没有做移动设备实机、完整性能基准或真实登录/语音测试。
