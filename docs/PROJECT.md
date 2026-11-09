# Memento Vivere · 项目现状与下一步

> 主题死，出路生。知死，是为了知生。
> 本文是项目的单一事实文档：架构、内容结构、已做内容、待完善项。
> 最后更新：对应提交 `2d17f95`（第 13 次提交）。

---

## 一、产品定位

**一句话**：一个讲死亡的中文站点，但每一个讲死亡的入口，都必须把人送回生活。

三条设计公理（已落进代码，不是口号）：

1. **结构即路**。站点结构 = 一条从死亡回到生活的路：觉知 → 凝视 → 整理 → 告别（`src/data/acts.js`）。每幕既有入口内容，也有指向生的出口。
2. **每篇必有出口**。任何一篇讲死的内容读完，必须落到「一个临终之问 + 一个具体行动 + 一个带日期的承诺」。覆盖率 100%（三层兜底，见 2.3）。
3. **只有一条主循环**。`凝视 60 秒 → 读一篇 → 写一行 → 定一个日子 → 某天被它找回来`。所有功能都必须挂在这条环上，否则不做。

**主循环闭环状态**（已实测通）：

```
/today 第1步 凝视60秒 ──recordGaze──→ mv-gaze-log
      ↓
第2步 读今日一篇（与首页同一篇）──markRead──→ mv-read-log
      ↓
第3步 只写一行 ──────────────────→ mv-reflections
      ↓
第4步 定一个日子 ────────────────→ mv-commitments
      ↓
到期日：首页置顶横幅「你有 N 件到期的约定」→ 做了 / 再说（+3 天）
      ↓
做了 → 写回响「那件事后来怎么样？」→ 时间胶囊 7 天后拿旧的那一行质问今天的你
```

---

## 二、技术架构

### 2.1 技术栈与构建

| 项 | 值 |
|---|---|
| 框架 | Vue 3.4（`<script setup>`）+ Vite 5.4 |
| 路由 | vue-router 4，`createWebHistory`，22 条路由全懒加载 |
| 状态 | Pinia 2，7 个 setup-store |
| Markdown | marked 12 + DOMPurify 3（`src/utils/markdown.js`） |
| PWA | vite-plugin-pwa，`navigateFallback: '/index.html'`，precache 268 项 / 约 2.3 MB |
| 部署 | GitHub Pages，自定义域 `death.rendongping.com`（`.github/workflows/deploy.yml`） |
| 体积 | `dist` 约 3.0 MB，其中 `poetry-archive` chunk 约 544 kB |

无后端、无构建期 SSG、无测试脚本、无 lint 配置。所有用户数据都在 `localStorage`。

### 2.2 目录结构

```
content/                 纯内容，md + frontmatter，改内容不碰代码
  articles/  46 篇       stories/  23 篇
  practices/ 21 篇       poetry/   92 首（精选调度池）
src/
  pages/       22 个页面（约 7900 行）
  components/  interactive/ 9 · content/ 3 · layout/ 2 · ui/ 6（约 4100 行）
  stores/      7 个 Pinia store
  composables/ useContent.js —— 唯一的内容加载引擎
  data/        acts · daily · turns · ways-to-live · crisis-resources + 3 个大 JSON
  utils/       keys · storage · markdown · week-of-life · backup · shareImage · crisis
  styles/      variables.css 设计令牌
scripts/       build-poetry-archive.mjs · generate-ways-to-die.py · famous-overrides.json
```

### 2.3 六条核心机制（改动前必读）

**① 内容即数据**（`src/composables/useContent.js`）
`import.meta.glob('../../content/**/*.md', { query: '?raw' })` 懒加载；自带轻量 frontmatter 解析器（flat key/value + 行内数组，浏览器兼容，不依赖 Buffer）；自动估算阅读时长（中文 350 字/分钟）。新增一篇 md，全站列表页/详情页自动出现，无需注册。

**② 「今日」的唯一真相**（`src/data/daily.js`）
`dailySeed = year * 1000 + dayOfYear` → `pickByDay` → `todayPicks()` / `todayPiece()`。
**规则：任何「今日 X」只能来自这个文件。** 首页与 `/today` 共用 `todayPicks`，把今天被选中的那一篇排到首位，所以两处永远一致。
（历史 bug：首页曾自己写 `dayOfYear() % len`，`/today` 用 `pickByDay`，同一天首页给陆游、`/today` 给李白。已修，规则由此而来。）

**③ 生之出口的三层解析**（`src/data/turns.js`）
```
frontmatter（turn / action_text / action_link）
  > CURATED[slug] 精选覆写（82 条）
    > 幕次默认（DEFAULT_QUESTION / DEFAULT_ACTION）
```
另有 `PRACTICE_EXIT`（12 条）专管练习详情页的出口。入口函数：`resolveTurn`（文章/故事）、`resolvePracticeTurn`、`resolvePoetryTurn`（按日轮转）、`resolveRecTurn`、`resolveArchiveTurn`。渲染统一走 `TurnCard.vue` → 内含 `CommitButton.vue`。
精选判断标准只有一条：这句话能不能让人在三十秒内想到一个具体的人名或一件具体的事。

**④ 承诺闭环**（`src/stores/commitments.js`）
`commit({ action, link, sourceType, sourceSlug, sourceTitle, question, days })` 幂等（同 slug+action 未完成不重复）；`markDone(id, note)` 的 note 是完成后的回响；`postpone` 从当天起算。到期项由 `AppHeader` 角标 + 首页置顶横幅召回。
`sourceType` 现有 9 类：article / story / practice / poem / archive / way / recommendation / memorial / **bucket**。

**⑤ 数据键单一来源**（`src/utils/keys.js`）
16 个 `mv-*` 键全部集中声明，各 store 唯一持有。`backup.js` 按 `mv-` 前缀遍历导出/导入，新增键自动进备份。

**⑥ 生成型数据不可手改**
`ways-to-die.json`（93 条 / 12 类）由 `npm run build:ways`（`scripts/generate-ways-to-die.py`）生成，重跑即覆盖 → 生之出口旁挂在 `src/data/ways-to-live.js`（`WAY_LIVING` 40 条独立出口 + `CATEGORY_LIVING` 12 类默认出口），页面渲染时按 id 合并。
`poetry-archive.json`（2476 首）与 `poetry-famous.json` 由 `npm run build:poetry` 生成，语料在 `scripts/.cache/`（不入库）。
`poetry-archive.json`（2476 首）由 `scripts/build-poetry-archive.mjs` 生成，同理不手改。

### 2.4 路由与导航

| 路由 | 页面 | 作用 |
|---|---|---|
| `/` | HomePage | 到期横幅 → hero → 今日状态条 → 生命倒计时 → 今日读物 → 今日仪式 → 旅程 → 四幕 |
| `/today` | TodayPage | 主循环四步：凝视 / 读一篇 / 写一行 / 定日子 |
| `/acts` | ActsPage | 四幕剧总览 |
| `/articles` `/articles/:slug` | 文章列表/详情 | 46 篇 |
| `/stories` `/stories/:slug` | 故事列表/详情 | 23 篇 |
| `/poetry` | PoetryPage | 诗签 + 92 首精选，支持 `?open=slug` 直达 |
| `/poetry/archive` | PoetryArchivePage | 2476 首悼亡诗词库 |
| `/practices` `/practices/:slug` | 练习列表/详情 | 21 篇 |
| `/ways-to-die` | WaysToDiePage | 93 种死法科普，每条带生之出口 |
| `/bucketlist` | BucketListPage | 遗愿清单，每条可「定个日子」 |
| `/calendar` | CalendarPage | 生命日历（按周点亮） |
| `/letters` | LettersPage | 以防万一的信 |
| `/commitments` | CommitmentsPage | 我的约定（到期/将至/已做到） |
| `/advance-directives` | AdvanceDirectivesPage | 生前预嘱与医疗意愿 |
| `/memorial` | MemorialPage | 哀悼空间（点蜡烛） |
| `/gratitude` | GratitudePage | 感恩时刻 |
| `/recommendations` | RecommendationsPage | 书影音推荐 |
| `/about` | AboutPage | 理念 + 安全声明 + 危机资源 + 数据备份 |
| `/:pathMatch(.*)*` | NotFoundPage | 404 也给一条生之出口 |

顶部导航只放主循环相关的 7 项（今日 / 四幕 / 文章 / 故事 / 诗 / 练习 / 关于）+「我的约定」入口带到期角标，其余靠首页分区与四幕页进入。

### 2.5 状态与存储

| store | 键 | 说明 |
|---|---|---|
| reflections | `mv-reflections` | 每日一行；已做补零/非补零 key 归一化 |
| commitments | `mv-commitments` | 约定；日期 key 已补零 |
| bucketlist | `mv-bucketlist` | 遗愿清单 |
| letters | `mv-letters` | 信件 |
| gaze | `mv-gaze-log` | 凝视记录 + streak（**dateKey 未补零，见四.2**） |
| profile | `mv-profile` | 生日、lastRead |
| favorites | `mv-favorites` | 收藏 |

其余 9 个键由页面/工具直接读写：`mv-gratitude`、`mv-birthdate`、`mv-week-notes`、`mv-week-marks`、`mv-advance-directives`、`mv-memorial`、`mv-read-log`、`mv-life-wishes`、`mv-ways-gaze`。

---

## 三、内容结构与已做内容

### 3.1 内容量

| 类型 | 数量 | 分类分布 |
|---|---|---|
| 文章 | 46 | 活出意义 10 · 死亡认知 8 · 哲学思考 8 · 文学与死亡 6 · 临终与告别 6 · 历史文化 4 · 文化与仪式 3 · 个人感悟 1 |
| 生命故事 | 23 | 生命故事 22 · 生者说 1 |
| 生命练习 | 21 | 见下 |
| 精选诗 | 92 | 中外悼亡/生死主题，含 highlight 字段供轮播 |
| 诗词库 | 2476 | 唐宋为主，按朝代/标签聚合 |
| 死法科普 | 93 | 12 类，每条含 prevention（知识）+ living（行动） |

### 3.2 练习清单（21）

直面与冥想：`daily-memento-mori`、`one-minute-breath`、`memento-mori-meditation`、`five-minute-death-meditation`、`fear-inventory`
整理与交代：`life-wheel`、`digital-legacy`、`will-and-wishes`、`death-binder`、`last-day-list`、`organ-donation-talk`、`my-funeral-design`
书写与告别：`eulogy-writing`、`unsent-letter`、`letter-to-loved-one`、`grief-three-lines`、`regret-inventory`
关系与陪伴：`deathbed-dialogue`、`farewell-rehearsal`、`one-week-no-rush`、`evening-gratitude`

### 3.3 出口分流现状

frontmatter 显式声明出口的有 20 篇 md。`action_link` 去向分布：

```
/commitments 6   （只剩字面就是「定日子」的）
/letters 5
/advance-directives 4
/bucketlist 3
/today 1
/gratitude 1
```

`turns.js` 幕次默认出口分布：`/practices/life-wheel` 6 · `/bucketlist` 6 · `/advance-directives` 6 · `/gratitude` 3 · `/letters` 2 · `/practices/daily-memento-mori` 2 · `/memorial` 1 · `/calendar` 1。

**文案与去向严格对齐**：字面「定日子」→ `/commitments`；「约人谈 / 说给谁听」→ `/letters`；「交代身后事 / 医疗意愿」→ `/advance-directives`；「挑一件放进这七天」→ `/bucketlist`；「回到每天那一页」→ `/today`。

### 3.4 已完成的交互闭环

- **今日一页**：凝视 60 秒计时、今日一篇（与首页同源）、只写一行、定日子；四步各自显示完成态。
- **首页**：到期约定置顶横幅（刻意用金/沙渐变，不用警告红）、问候语 + 日期、今日状态条（凝视过 / 写过 / 做到过 + 还差什么）、生命倒计时、今日读物四卡、今日仪式、旅程与四幕。
- **约定页**：待办 / 将至（今天到期 · 明天到期 · 还有 N 天）/ 已做到 + 回响。
- **遗愿清单**：5 类心愿 + 示例库；每条待办可挂承诺；划掉心愿自动兑现对应约定并点亮生命日历那一格。
- **CommitButton**：今天 / 这周内 / 这个月；已有未完成承诺时直接回填回执不重复催；支持 compact 与列表内嵌左对齐形态。
- **时间胶囊**：最近一行满 7 天开启（原 30 天等于永远看不到）。
- **生命日历**：生日 → 一生多少周，完成心愿点亮对应格子。
- **数据**：`mv-*` 全量导出/导入 JSON；分享图生成。

### 3.5 安全与克制（明确已做 + 明确不做）

已做：`SAFETY_NOTE` 全站声明（不提供任何自伤方法）；`CRISIS_RESOURCES` 单一数据源，接入关于页 / 哀悼空间 / 一万种死法 / 分层触达卡片；到期提醒不使用惩罚色。

明确不做：死法页不加猎奇分类与动效；不做断裂清零的惩罚式 streak；不做评论区与社区；感恩墙与纪念堂不挂承诺（避免道德绑架）。

---

## 四、下一步可完善的地方

按「投入产出比」排序，P0 最高。

### 4.1 首页 C 位仍是倒计时，不是「已拥有」（P0，体验收口）

现状：`LifeCountdown` 在今日状态条之后，但首页主视觉仍被剩余时间占据；`doneRecent`（已做到的约定）数据已就绪，只在状态条里点亮一个点。
建议：把「你已经做到的 N 件事」提到首屏 C 位，倒计时降为次要信息。主题是把人往「生」推，首屏主指标也应该是生侧。
涉及：`src/pages/HomePage.vue`（`.today-strip` / `LifeCountdown` 顺序与权重）。

### 4.2 存储层统一（P0，越晚越贵）

现状：16 个独立 `mv-*` 键，各自 loadJSON/saveJSON；`gaze.js` 的 `dateKey` 仍未补零（`reflections` 已补零并做了旧 key 归一化，`gaze` 没有）；无 schema 版本号，将来字段变更只能靠猜。
建议：合并为带 `version` 的单一 journal（或至少给每个 store 加 `version` + migrate 钩子），`gaze.dateKey` 复用 `reflections` 里的 `toKey`。备份格式同步升级并保留读旧格式的能力。
涉及：`src/utils/keys.js`、`src/utils/storage.js`、`src/utils/backup.js`、7 个 store。

### 4.3 内容侧的三个空洞（P1）

- **生者说只有 1 篇**：哀悼者视角（丧亲之后怎么过日子）是本站最薄的一环，却是留存最强的动机。建议补到 6–8 篇。
- **故事 22/23 同类**：分类几乎单一，列表页无法按「谁的故事」分流。建议按关系维度重分（早逝者本人 / 家属 / 医护 / 哀悼者）。
- **文章分类与幕次靠映射硬凑**：`CATEGORY_ACT_MAP` 已因覆盖不全出过一次全落第一幕的 bug。建议 frontmatter 直接写 `act`，映射退化为兜底。

### 4.4 回访链路还缺一次「主动触达」（P1）

现状：到期召回完全依赖用户自己打开首页。PWA 已装好但没接推送。
建议（低成本优先）：`beforeunload`/每日首次进入时给一次「你有 N 件事到期」的显式提醒卡片；再考虑订阅提醒（本地 Notification，不引入服务端）。

### 4.5 大 chunk 与首屏（P2）

现状：`poetry-archive` 约 544 kB，`dist` 3.0 MB，precache 2.3 MB。
建议：诗词库按朝代/标签二次分包，或改成构建期输出分页 JSON；诗词库页首屏只加载索引。

### 4.6 工程基建（P2）

- 无测试：出口解析（`resolveTurn` 三层优先级）和 `todayPicks`（同日同结果）是最该锁住的两条不变量，建议加最小单测（Vitest），只测这两个文件。
- 无 lint / 无格式化：CRLF 与格式全靠自觉。
- 逐路由真机复测出口 DOM 仍未做（`fetch` 200 与 iframe 渲染都不能证明组件挂载）。

### 4.7 大文件拆分（P3）

`HomePage.vue` 1166 行、`PoetryPage.vue` 1085 行、`WaysToDiePage.vue` 941 行。建议按区块拆子组件（首页的 due / strip / reads / ritual 各自独立），但只在需要再次改动它们时顺手拆，不专门开一轮。

---

## 五、维护约定（改代码前先看这几条）

1. 「今日 X」一律从 `src/data/daily.js` 取，禁止在页面里再写一套取模逻辑。
2. 新增讲死的内容，出口可以不写 frontmatter（有幕次默认兜底），但只要写就必须与文案语义一致地指向具体工具页。
3. 新 store 的日期 key 必须补零；键名只能加在 `src/utils/keys.js`。
4. `ways-to-die.json` / `poetry-archive.json` 是生成物，改内容改旁挂文件或脚本，不改 JSON。
5. 涉及自伤风险的页面必须保留危机资源；不新增任何自伤方法描述。
6. 验证口径：`npm run build` 通过只是下限，功能正确要靠 `vite preview` + 浏览器实跑断言字符串。
