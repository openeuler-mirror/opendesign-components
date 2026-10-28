# 任务生命周期：spec 的内容流转

约束一个任务从需求到达至合入收尾的完整流转。spec 与 ticket 的落盘位置及分流规则见 `issue-tracker.md`；本文约束**流转本身**：每个阶段必须满足完成判据才可进入下一阶段，判据可检查、不可跳过。

## 六阶段与完成判据

### 1. 需求到达

确认需求来源：上游 AtomGit issue 或本地发起。spec 载体按 `issue-tracker.md` 的分流规则确定（自己的 issue 原地升级 / 别人的 issue 新建 spec issue + 原处评论指引 / 本地发起直接新建）。

- **判据**：spec issue 已存在且可访问；来源为他人 issue 时，原 issue 下已留指引评论。
- 一句话许愿式需求进入**悬而未决**流程（见下节），照常处理。

### 2. 讨论成 spec

`/grill-with-docs` 拷问需求，结论写入 up 上 spec issue 的**正文**（规格），过程留在**评论区**。

- **判据**：每条验收标准可被一条测试或一条人工检查验证；悬而未决区块（若有）无未标注条目。

### 3. 拆 tickets

`/to-tickets` 产出本地 `.scratch/<feature-slug>/issues/<NN>-<slug>.md`，每个 ticket 带 `Spec: <up spec issue URL>` 行。

- **判据**：每个 ticket 自包含——新 session 不读 spec issue 也能开工；依赖以 `Blocked by:` 声明。

### 4. 实现

`/clear` 后按 ticket 推进，红绿测试驱动。

- **判据**：测试全绿；每个 commit 的 body 引用 spec issue URL（不引用本地 ticket 路径，其不入 git）。

### 5. 交付上游

- 交付分支从 `up/main` 建基，把工作分支上的提交**整理为逻辑单元后** cherry-pick 上去，保持线性历史；归并后逐提交核对 body 正确性（归并细则、过程态提交处理、body 核对清单见 `commit-convention` skill 的「线性交付」与「交付提交的 body 正确性清单」）。
- **判据**：`.scratch/` 已被 git 忽略，交付 diff 天然不含过程文件（不使用 `git add -f` 强加）；`git log --merges up/main..HEAD` 输出为空，且 `git log --oneline up/main..HEAD` 中无过程态提交；逐提交 body 满足正确性清单；PR 按 `commit-convention` skill 填声明段。

### 6. 收尾升格

任务合入即 spec 死亡，死前完成三问检查（**收尾三问**）：

1. **决策**：spec 中难逆转的判断（为什么选 X 不选 Y）→ `docs/adr/NNNN-<slug>.md`
2. **术语**：被迫精确定义的词 → 根目录 `GLOSSARY.md`
3. **行为**：公开 API 语义 → `types.ts` JSDoc + 组件 `index.md`（经 `gen:api`）

- **判据**：三问各自得到「本任务无此类内容」的确认，或已给出迁移目标路径；然后在 spec issue 下留一条收尾总结评论（升格去向、最终验收结论）并关闭 issue。关闭的 spec issue 即归档档案，评论区自然保留全部过程记录，供 `/retro` 与事后审计。

## 悬而未决：许愿式需求的处理

一句话许愿式 issue（如「希望能支持 tag」）不代表可开工的规格。处理动作：

- spec 正文开「悬而未决」小节，登记每个模糊点，逐条标注：
  - **已决**：附依据（讨论结论、上游回复、代码证据）；
  - **假设**：需上游确认——到相关 issue（原需求 issue 或 spec issue）评论区发起确认讨论，评论链接回填到悬而未决条目；
- 假设项在 PR 描述中如实声明；
- **判据**：spec 正文中不存在既无「已决」也无「假设」标注的模糊点；所有假设项均有评论链接。

## 载体纪律

- **spec 的持久性由平台保证**：issue 存在于 up 上，换机器、误删本地文件、跨 session 都不受影响；正文是单一权威源，多人协作共享同一份意图。
- **ticket 是执行态，git 忽略**：`.scratch/` 整目录不入版本库，任务完成即废；跨机器续做需依据 spec issue 与代码现状重建。
- **commit 只引用稳定地址**：commit body 与 PR 描述引用 spec issue URL，本地 ticket 路径不进任何 git 产出。

## 分支卫生

任务推进过程中的分支生命周期，每个分支有明确的删除时机，不残留悬空分支：

- **命名**：工作分支 `feat/<slug>`（集成分支）；ticket 工作分支 `feat/<slug>-<NN>`；交付分支 `deliver/<slug>`。任务 slug 与 `.scratch/<feature-slug>/` 一致。
- **ticket 工作分支**（implementer 子代理的 worktree 分支）：merger 并入集成分支后**立即删除**，worktree 同步清理（`implement-spec` 第 9 步的清理范围含分支本身）；
- **集成分支 `feat/<slug>`**：任务的唯一权威工作分支，任务期内不可删；删除时机 = 阶段 6 升格完成**且** PR 合入（或明确放弃任务）之后；
- **交付分支 `deliver/<slug>`**：PR 合入或关闭后立即删除；上游要求改评时，在其上继续更新而非另建；
- **实验分支**（原型、试错）：不进入上述体系，回答完问题即删，或挂 `prototype/<name>` 保留（`/prototype` 约定）。

fork main 不是任务分支的宿主，仅作为个人基线；任务不直接在 main 上开发。

**判据命令**（任务收尾时执行，合入后定期巡检）：

```bash
git worktree list --porcelain | grep -c '^worktree '  # 输出应为 1：仅剩主工作树
git branch --list 'feat/*' 'deliver/*'               # 逐条对照删除时机
```

第一条是硬判据，非 1 即有 worktree 残留。第二条是人工核对清单：cherry-pick 交付产生新 hash，`git branch --merged` 对此误报未合入，故不用它做自动判定；列出任务分支后逐条确认「已到删除时机则删，否则确认其在任务期内」。
