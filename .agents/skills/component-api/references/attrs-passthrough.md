# attrs 透传判定——送不到根的属性/参数怎么声明(id / aria-\* / title / name / type / tabindex … 及转发给内部子组件的 props)

用户写在组件标签上的 DOM 原生属性,Vue 默认会透传到根元素;用户想配置组件**内部**的元素或子组件(给内部 input 传 aria-\*,给内部虚拟列表传 height),透传同样送到根,送不到。组件要不要把这类东西声明成 prop,就判断一件事:**透传能不能把它送到该去的地方?** 能,就什么都别做——用户写啥是啥;不能,才接进收拢对象(见下)。

透传送不到该去的地方,只有三种情况:

| 送不到的原因                                                  | 例子                                                                                                                             |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **落点不在根元素**(透传只送到根)                              | `name` 该落在内部 `<input>` 上;`id` 该绑弹层;根元素是包裹 div、combobox 语义要落在里面的 input 上;`height` 该给内部 OVirtualList |
| **组件要改写值**                                              | `tabindex` 跟禁用状态走;`aria-invalid` 跟校验结果走;`type` 随 href 在 anchor/button 间切换                                       |
| **属性在根元素上无意义**(用户想给内部元素,透传却把它扔到根上) | 用户传 `type="number"` 想给 input,根是 div,透传会产生 `<div type="number">` 这种废属性                                           |

第三种最容易被忽略:透传不是"没生效",是"生效在错误的地方"——它永远把属性送到根元素,不管那里合不合理。这种情况即使不改写值,也得拦截,不让废属性落在根上。

## 收拢规则(默认,不是逃生舱)

凡透传**送不到**根元素的属性——落点不在根、根上无意义、要组件转发——**一律收拢进一个接收对象的 prop**,不再逐个声明平铺 prop。这个规则的依据是**扩展封闭性**:逐个声明意味着每加一个新属性(今天 aria,明天 title/maxlength/张三李四,或转发给内部子组件的参数)都要新增 prop,集合无界增长;而"逐 prop 平铺 → 对象收拢"的形态迁移是 breaking change,只能在未发布窗口内免费做。对象收拢一次定型,之后任何新增 key 都是 non-breaking 的增量。

例外只有一个:**组件要改写值**的属性(情况 2)保持逐个声明——改写规则需要独立 prop 的类型 + JSDoc + `@since` 作挂载点,塞进对象就失去类型表达。

对象 prop 的命名与类型约定:

- 命名 `落点 + Props`:`inputProps`(落点内部 input)、`triggerProps`(落点内部触发器)、`virtualListProps`(落点内部虚拟列表)……与库内 `virtualListProps`/`prevButtonProps` 惯例一致;
- 已知 key 的语义(兜底、联动)逐条写在该 prop 的 JSDoc 里;
- 合并优先级**用户 key 赢,组件兜底**:组件内部默认值只填补用户没传的 key(如 `aria-label` 没传才回退 placeholder);
- **组件派生的值不进对象**——跟随内部状态输出的 `role`/`aria-expanded`/`aria-controls`/`aria-activedescendant` 是组件输出,不是用户输入,继续由组件直接绑定。

收拢对象按落点分两类,**类型策略不同**:

**① 落点是 DOM 元素**(内部 input/button/textarea):类型开放不枚举——

```ts
inputProps: {
  type: Object as PropType<Record<string, string | number | boolean | undefined>>,
}
```

```html
<XxxInput :input-props="{ id: 'foo', type: 'number', maxlength: 10, 'aria-label': 'xx' }" />
```

开放 key 正是未来 DOM 属性的容纳口,不要用枚举封死(枚举一封,新增属性又变 breaking,扩展封闭性就白给了)。代价是 key 名拼错不报错,靠测试锁已知 key。

**② 落点是内部子组件**(转发给子组件的 props):类型**完整枚举**——目标 props 类型是已知的,直接引用:

```ts
// OSelect 收拢转发给内部 OVirtualList 的参数(类型引用具名导出 XxxPropsT;
// 目标组件没导出类型时才退 `typeof xxxProps`)
virtualListProps: {
  type: Object as PropType<Partial<VirtualListPropsT>>,
}

// OTour 收拢转发给内部上一步/下一步按钮的参数
prevButtonProps: { type: Object as PropType<TourBtnProps> }
nextButtonProps: { type: Object as PropType<TourBtnProps> }
```

```html
<OSelect :virtual-list-props="{ height: 200, itemHeight: 34 }" /> <OTour :prev-button-props="{ color: 'primary', round: true }" />
```

子组件 props 的 key 集合就是类型来源(库内惯例:组件 types.ts 导出 `XxxPropsT = ExtractPropTypes<typeof xxxProps>`,优先引用这个导出):宿主转发参数拼错 key 在编译期即报错;子组件新增 prop 时 `Partial<XxxPropsT>` 自动跟随,宿主侧零改动——两种封闭性都占。合并同样用户 key 赢,宿主兜底只填用户没给的(如 disabled 常由宿主状态接管,用户显式传时优先)。

两类各自守住一个极端:DOM 侧开放(属性集无界,只能开放)、组件侧闭合(类型已知,必须闭合);判断只看**落点是什么**,不看属性是什么。

一个 prop 收拢一群属性/参数,API 表只多一行,且这行是终态——后面加 key 不再动 API 面。

## 例一:id

id 不改写值,也没有"根上无意义"的问题,只有两件事:

1. **定一个源头 id。** 用户能给的优先;没给就 `useId()` 兜底。
2. **其余 id 从源头派生,**按 `` `${源头}-${角色}` `` 拼:`-input`、`-message`、`-nav`……不要每个锚点各调一次 `useId()`:散着的 id 跟源头不同源,DOM 上也不可读。用户设了源头 id,派生 id 就可预测(能写 `#my-form-message` 这样的选择器)。

源头 id 怎么拿用户的,只有两种情况:

| 情况                                                                                             | 做法                                                                                                                                      |
| ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| id 绑在根元素上(模板里给根元素写了 `:id`)                                                        | `useAttrs().id` 优先,没传用 `useId()` 兜底,**不声明 `id` prop**。用户写的 `<Xxx id="foo">` 本来就会透传到根元素,读一下它,互链两侧就同源了 |
| id 要绑在非根元素上,或用户需要在自己的代码里引用它(`label for=`/`getElementById`/外部 aria 关联) | 声明 `id` prop,`props.id ?? useId()` 兜底,并在模板里手动绑定到目标元素                                                                    |

派生补充:

- 后缀表达角色(`-input`/`-message`/`-nav`)。后缀不是契约——消费者是内部互链和 agent,开发者业务代码不会写它,改名不算 breaking(只影响 DOM 可读性);真正算契约的是**源头 id**(用户自己传的标识符,组件动它才是 breaking)。测试照旧要锁:用户传 id 时,派生 id 必须是拼出来的那个值,不能被内部 useId 换掉——锁的是互链不断,不是兼容承诺。
- 跨组件用派生 id(如 form-item 的 message 由子组件渲染):父组件定源头并 `provide` 下发,子组件消费;子组件不要自己另调 `useId()`,也别去读父的根元素 id。

id 在通用表之外多一条私有情况:**用户要跨组件引用**——别的属性没有这回事,用户引用 id 是把它当稳定锚点用。

## 例二:aria-\*

透传能送到的(根元素上就该有的)就不声明,靠透传;送不到的按上面的收拢规则进对象 prop。仍逐个声明的只有一种:

- **组件要改写值**——没传时兜默认名(通常是 i18n 的角色名)、跟内部状态走(`aria-expanded` 跟着展开状态)、或按宿主语义抑制输出(宿主已是 `<button>` 这类语义元素,再输出反而重复)。

## 硬约束

- 对象 prop 收拢后,成员不进 `attrs`——组件必须在模板里把对象展开绑定到目标元素或子组件(`v-bind="inputProps"` / `v-bind="virtualListProps"` 或逐 key 绑)。忘绑 = DOM 上没有这个属性/子组件收不到参数,静默失效,不报错。
- 例外保留的逐个 prop(改写值类)同理:声明后 Vue 不再透传它,必须手动绑。
- id 兜底一律用 Vue ≥3.5 的 `useId()`(SSR 友好)。不要用 `Math.random()` 或模块级自增计数器:SSR 下会同页重复,且每次渲染变值。
- 读 attrs 用 `useAttrs()`,不要 `getCurrentInstance()?.attrs`(后者是逃生舱 API,拿 `uid`/`vnode` 这类东西才用)。
