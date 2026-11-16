# attrs 透传判定——送不到根的属性/参数怎么声明(id / aria-\* / title / name / type / tabindex … 及转发给内部子组件的 props)

用户写在组件标签上的 DOM 原生属性,Vue 默认会透传到根元素;用户想配置组件**内部**的元素或子组件(给内部 input 传 aria-\*,给内部虚拟列表传 height),透传同样送到根,送不到。组件要不要把这类东西声明成 prop,就判断一件事:**透传能不能把它送到该去的地方?**

答案是两分支,没有第三种:

- **能送到根元素 → 什么都不声明。** 用户写啥是啥。组件想加工这个值(没传时兜默认、跟内部状态走),读 `useAttrs()` 拿到用户值,computed 里做兜底,模板绑定 computed——**不为此声明 prop**。
- **送不到 → 收拢进对象 prop(「袋」)。** 见下文收拢规则。

也就是说,**prop 的唯一存在理由是拦截透传**:这个属性透传会落到错误的地方(内部元素/内部子组件),必须截下来送过去。「组件要改写值」**不再是**声明 prop 的理由——根元素上的改写一律走「读 attrs + computed 兜底」。

机制本体(runtime-core `setFullProps` 实测):渲染时传给 vnode 的 props key，按三道闸分流——

1. `key`/`ref`/`onVnode*` 等保留字直接丢掉；
2. `camelize(key)` 命中**声明的 props 或 emits** → 进 `props`(驼峰 key,过 default/类型逻辑)，**不再出现在 attrs 里**——这就是「声明 prop = 拦截」的字面意思,也是为什么删掉 prop 后属性才会流进 attrs;props 侧有 default/Boolean 转换,attrs 侧是原样字符串反射,两条通道语义不同,不要混用;
3. 其余(含 `class`/`style`)→ `attrs[key] = value`(原样字符串)——透传与 attrs 是同一通道。

由此一条硬推论:**兜底 computed 读 attrs 的前提就是没声明同名 prop**。声明了 `ariaLabel` prop 后,用户写 `aria-label="x"` 或 `ariaLabel="x"` 都会被 props 截走,attrs 里一个都没有——「保留 prop 同时又读 attrs」是自相矛盾的组合。

> 代价声明(已接受):原「改写值保持平铺 prop」的例外能带来的编译期类型校验(如 `role: 'dialog' | 'tooltip'` 枚举)随 prop 一起消失,attrs 传错值不报错。兜底行为改在组件文档的无障碍小节手写说明,不占 API 表。换来的是 API 面最小:除收拢袋外不新增任何平铺 prop,后续属性再怎么加都不动公共签名,触发 breaking change 的概率最小。

透传为什么送不到,只有三种情况,前两种进袋,第三种读 attrs:

| 送不到的原因                                                  | 例子                                                                                                                             | 处理                                            |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| **落点不在根元素**(透传只送到根)                              | `name` 该落在内部 `<input>` 上;`id` 该绑弹层;根元素是包裹 div、combobox 语义要落在里面的 input 上;`height` 该给内部 OVirtualList | 收拢进袋                                        |
| **属性在根元素上无意义**(用户想给内部元素,透传却把它扔到根上) | 用户传 `type="number"` 想给 input,根是 div,透传会产生 `<div type="number">` 这种废属性                                           | 收拢进袋(即使不改写值也要拦截)                  |
| **落点在根,但组件要改写值**                                   | `tabindex` 跟禁用状态走;`aria-invalid` 跟校验结果走;`aria-label` 没传时兜 i18n 默认名;`type` 随 href 在 anchor/button 间切换     | 读 `useAttrs()` + computed 兜底绑定,不声明 prop |

第二种最容易被忽略:透传不是"没生效",是"生效在错误的地方"——它永远把属性送到根元素,不管那里合不合理。

## 根上改写值的标准写法

```ts
const attrs = useAttrs();
// 用户传了用用户的，没传兜组件默认
const ariaLabel = computed(() => (attrs['aria-label'] as string | undefined) ?? t('o.badge.new'));
```

```html
<span :aria-label="ariaLabel">…</span>
```

**`useAttrs()` 返回的对象（实例 attrs）里的 key，是渲染时传给 vnode 的 props 中、未被已声明 props/emits 截走的原样 key**（runtime-core `setFullProps` 实测：`camelize` 只作用于命中声明 props 的 key，未命中者原样存入 `attrs[key] = value`；不经过「用户模板」这一层的直接映射——SFC 编译成 render 后、`h()`/JSX 里传什么 key 就是什么）。由此四条实操规则：

- 取值一律方括号 + 连字符串：`attrs['aria-label']`。`attrs.ariaLabel` / `attrs['ariaLabel']` 都取不到（除非调用方真传了驼峰 key）；
- 用户侧约定唯一形态是连字符串 `aria-label="xx"`——DOM 属性的自然形态，渲染结果两侧一致。组件**不兼容**驼峰写法：attrs 是原样反射，兼容等于自己实现一遍 props 的 camelize，复杂度白捡；且驼峰写法本来就是错的——浏览器把属性名转小写，`ariaLabel` 落到 DOM 是 `arialabel`，连字符丢了，跟 `aria-label` 是两个不同属性，ARIA 根本不生效；
- 兜底用 `??` 不用 `||`：空字符串是合法的用户值（显式清空），`||` 会把它换成兜底值；
- `as` 断言成 `string | undefined` 而不是 `string`：attrs 类型是 `Record<string, unknown>`，不断言后面 `??` 的类型推不对。

关键机制(Vue 3.5 实测，`cloneVNode` + `mergeProps` 后参覆盖前参)：**用户透传的同名属性会覆盖组件模板的显式绑定**。对兜底类无害——computed 读的就是 attrs 里的值，两路同源恒等，覆盖前后结果一致；用户没传时无透传，computed 兜底生效。一个 computed 解决两种情况，模板上不需要再和裸透传拼顺序。

已知边界(接受,不为此开例外):组件**派生**的镜像值(如跟展开状态走的 `aria-expanded`)也是模板直接绑定,用户硬传同名属性同样能覆盖——这是 Vue 透传机制的固有行为,用户显式伪造属于误用。要绝对禁止只有两条路:`inheritAttrs: false` 手动管理全部透传,或为该 key 声明 prop 截停。默认都不做,登记为已知边界。

## 收拢规则(默认,不是逃生舱)

凡透传**送不到**根元素的属性——落点不在根、根上无意义、要组件转发——**一律收拢进一个接收对象的 prop**,不再逐个声明平铺 prop。这个规则的依据是**扩展封闭性**:逐个声明意味着每加一个新属性(今天 aria,明天 title/maxlength/张三李四,或转发给内部子组件的参数)都要新增 prop,集合无界增长;而"逐 prop 平铺 → 对象收拢"的形态迁移是 breaking change,只能在未发布窗口内免费做。对象收拢一次定型,之后任何新增 key 都是 non-breaking 的增量。

没有例外:改写值类不再保留平铺 prop。改写值且落点非根的,袋内 key 由组件 computed 兜底(用户 key 赢,组件填没给的),见「合并优先级」②类。

对象 prop 的命名与类型约定:

- 命名 `落点 + Props`:`inputProps`(落点内部 input)、`triggerProps`(落点内部触发器)、`virtualListProps`(落点内部虚拟列表)……与库内 `virtualListProps`/`prevButtonProps` 惯例一致;
- 已知 key 的语义(兜底、联动)逐条写在该 prop 的 JSDoc 里;
- 合并优先级按 **key 所有权**三分类裁决,同名 key 谁赢不是一个答案能覆盖的——见下文「合并优先级与绑定顺序」一节;
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

## 合并优先级与绑定顺序——同名 key 冲突怎么裁决

「spread 放第一还是最后」是伪问题:优先级不是位置决策,是 **key 所有权**决策。先问这个 key 归谁,模板顺序自然推导。三分类:

| key 类       | 判据                                          | 例子                                                                                                  | 赢者              | 实现机制                                                                           |
| ------------ | --------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ----------------- | ---------------------------------------------------------------------------------- |
| ① 组件建模   | 有 prop 或有逻辑;是受控值、状态镜像或互链锚点 | `value`、`disabled`、`readonly`、`type`、袋内 `id`、派生 `aria-expanded`/`aria-disabled`              | **组件,含缺席**   | 同名绑定放 `v-bind` 之后;对象内同名 key 不生效(JSDoc 写明);用户改值走一等 prop     |
| ② 组件兜底   | 组件提供缺省/联动/拼接,语义源头在用户         | `aria-label` 回退 placeholder、`aria-invalid` 联动 `color="danger"`、`aria-describedby` 拼表单校验 id | 用户 key,组件兜底 | computed 合并:用户输入展开在前、`??`/拼接在后;模板只绑 computed,不与裸 spread 并存 |
| ③ 未建模长尾 | 组件不认识                                    | `name`、`maxlength`、`data-*`                                                                         | 用户(无竞争)      | 模板不出现同名绑定,裸 `v-bind` 即可                                                |

根上直读 attrs 的兜底(见「根上改写值的标准写法」)是②类的根元素版:computed 读 attrs 用户值、`??` 兜底,同一优先级,同一机制。

物理顺序一条规则,可机械检查:**模板上显式绑定了某 key = 宣称所有权 = 放在 `v-bind` 展开之后;裸 spread 恒在前。**「放最后让用户 key 赢」不是合法形态——它等于把「状态镜像可被伪造」写成契约。

①类组件必须赢,因为两个失败模式不对称:用户 key 赢 → 状态镜像被覆盖(`aria-disabled:false` 配真禁用、`value` 脱离受控、`id` 换掉 label 互链锚点),DOM 撒谎,静默难测;组件赢 → 用户 key 被丢弃,失效但 DOM 真实。**谎言比失效贵。**且开放 Record 下用户常整包塞共享配置对象,同名 key 多为顺手带上而非覆盖意图——意图不可假定,一个 key 一个通道。

mergeProps 语义(vue 3.5 实测):后置参数无条件拥有普通 key,**值为 `undefined` 也抹掉前置 key**。对①这是特性(组件连该 key 的缺席都拥有);对未宣称所有权的 key 这是 bug——没建模就别在模板上出现同名绑定。

特例,不参与裁决:**事件与 class/style 在 mergeProps 里是合并不是覆盖**(`onXxx` 数组拼接、`class`/`style` 归一化合并),组件 `@input` 与用户对象里的 `onInput` 都执行,天然双通道,检视时别误判为冲突。

层级组合:宿主把收拢对象转传给内部组件时(如 OInput 组装完传 InInput 的 `inputProps`),每层只裁决自己拥有的 key——宿主 computed 做②类合并,内部组件模板做①类后置绑定,不要在一层替下游裁决。

## 例一:id

id 不改写值,也没有"根上无意义"的问题,只有两件事:

1. **定一个源头 id。** 用户能给的优先;没给就 `useId()` 兜底。
2. **其余 id 从源头派生,**按 `` `${源头}-${角色}` `` 拼:`-input`、`-message`、`-nav`……不要每个锚点各调一次 `useId()`:散着的 id 跟源头不同源,DOM 上也不可读。用户设了源头 id,派生 id 就可预测(能写 `#my-form-message` 这样的选择器)。

源头 id 怎么拿用户的,只看落点:

| 落点                                       | 做法                                                                                                                                      |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| id 绑在根元素上(含 pane/option 这类组件根) | `useAttrs().id` 优先,没传用 `useId()` 兜底,**不声明 `id` prop**。用户写的 `<Xxx id="foo">` 本来就会透传到根元素,读一下它,互链两侧就同源了 |
| id 绑在内部元素上(input/弹层锚点)          | 走袋:`inputProps` 里收 `id` key,组件 computed 读袋内 `id ?? useId()` 兜底,手动绑定到目标元素                                              |

派生补充:

- 后缀表达角色(`-input`/`-message`/`-nav`)。后缀不是契约——消费者是内部互链和 agent,开发者业务代码不会写它,改名不算 breaking(只影响 DOM 可读性);真正算契约的是**源头 id**(用户自己传的标识符,组件动它才是 breaking)。测试照旧要锁:用户传 id 时,派生 id 必须是拼出来的那个值,不能被内部 useId 换掉——锁的是互链不断,不是兼容承诺。
- 跨组件用派生 id(如 form-item 的 message 由子组件渲染):父组件定源头并 `provide` 下发,子组件消费;子组件不要自己另调 `useId()`,也别去读父的根元素 id。

id 在通用表之外多一条私有情况:**用户要跨组件引用**——别的属性没有这回事,用户引用 id 是把它当稳定锚点用。落点在根,读 attrs 即得;落点非根,袋内 `id` key 即得,都不需要平铺 prop。

## 例二:aria-\*

透传能送到的(根元素上就该有的)就不声明,靠透传;送不到的进袋。根上要改写值的(没传兜 i18n 默认名、跟内部状态走、按宿主语义抑制输出)按「根上改写值的标准写法」读 attrs + computed 兜底——**不存在任何"仍需逐个声明平铺 prop"的 aria 属性**。

## 硬约束

- 对象 prop 收拢后,成员不进 `attrs`——组件必须在模板里把对象展开绑定到目标元素或子组件(`v-bind="inputProps"` / `v-bind="virtualListProps"` 或逐 key 绑)。忘绑 = DOM 上没有这个属性/子组件收不到参数,静默失效,不报错。
- 根上直读 attrs 的兜底同理要显式绑定 computed;绑定后用户透传值与 computed 同源恒等(见「根上改写值的标准写法」的机制说明),不需要额外去重。
- id 兜底一律用 Vue ≥3.5 的 `useId()`(SSR 友好)。不要用 `Math.random()` 或模块级自增计数器:SSR 下会同页重复,且每次渲染变值。
- 读 attrs 用 `useAttrs()`,不要 `getCurrentInstance()?.attrs`(后者是逃生舱 API,拿 `uid`/`vnode` 这类东西才用)。
- ①类 key 至少一条「对象同名 key 不生效」测试、②类(含根上 attrs 兜底)至少一条「用户 key 优先于兜底值」测试——合并契约不锁,绑定顺序改动会无声漂移。
- 收拢 prop 的 JSDoc 写所有权矩阵:哪些 key 不生效(①)、哪些有兜底/拼接语义(②)、其余开放(③)。
- 所有权迁移的 breaking 判定:key 从生效变不生效(用户 key 落入①)是 breaking,用户代码里写过的 key 失效;反向放宽 non-breaking——趁未发布窗口把矩阵定成终态。
