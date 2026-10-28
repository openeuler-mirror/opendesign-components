# 领域文档

工程类 skill 在探索代码库时应如何消费本仓库的领域文档。

## 探索前先读这些

- 仓库根目录的 **`GLOSSARY.md`**
- **`docs/adr/`**：阅读与即将工作区域相关的 ADR

任一文件不存在时**静默继续**：不要标记其缺失，也不要预先建议创建。`/domain-modeling` skill（经 `/grill-with-docs` 和 `/improve-codebase-architecture` 触达）会在术语或决策真正落定时惰性创建它们。

## 文件结构（单上下文）

```
/
├── GLOSSARY.md
├── docs/
│   ├── adr/
│   │   ├── 0001-xxx.md
│   │   └── 0002-xxx.md
│   └── agents/          ← 本文件所在目录（agent 基础设施，与 ADR 分开）
└── packages/
```

## ADR 编号冲突处理

ADR 文件名使用 4 位顺序号 `NNNN-<slug>.md`。并行分支各自新增 ADR 时可能撞号，且因文件名不同 git **不会报冲突**（同号不同 slug 会静默并存），合并后必须显式检查：

- 发现同号 ADR 并存时，**后合并的一方**把冲突 ADR 改号为下一个空闲号，并 `grep "ADR-NNNN"` 更新全仓引用
- 正文引用 ADR 时附带文件路径（如 `ADR-0003（docs/adr/0003-xxx.md）`），保证改号时可定位所有引用点
- 改号历史写入 commit message，不写入 ADR 正文

## 使用 glossary 的词汇

输出中出现领域概念时（issue 标题、重构提案、假设、测试名），使用 `GLOSSARY.md` 中定义的术语，不要漂移到该术语明确标注 _Avoid_ 的同义词。

如果所需概念尚未收录，这是一个信号：要么你在发明项目并不使用的语言（请重新考虑），要么存在真实空缺（记录下来交给 `/domain-modeling`）。

## 标记 ADR 冲突

如果输出与既有 ADR 矛盾，显式指出而非静默覆盖：

> _与 ADR-0007（xxx）相悖，但值得重新讨论，因为……_
