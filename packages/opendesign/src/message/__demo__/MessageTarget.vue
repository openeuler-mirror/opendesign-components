<script setup lang="ts">
import { ref } from 'vue';
import '../style';
import { useMessage } from '../use-message';

import { OButton } from '../../button';
import '../../button/style';

const btn1 = ref();
const btn2 = ref();
const btn3 = ref();
const btn4 = ref();
const btn5 = ref();
const btn6 = ref();
const btn7 = ref();
const btn8 = ref();
const btn9 = ref();
const btn10 = ref();
const message1 = useMessage(btn1);
const message2 = useMessage(btn2);
const message3 = useMessage(btn3);
const message4 = useMessage(btn4);
const message5 = useMessage(btn5);
const message6 = useMessage(btn6);
const message7 = useMessage(btn7);
const message8 = useMessage(btn8);
const message9 = useMessage(btn9);
const message10 = useMessage(btn10);

const handleInfoBtnClick = () => {
  message1.info({
    content: '用于表示普通操作信息提示，3秒后消失',
    duration: 0,
  });
};

const handleSuccessBtnClick = () => {
  message2.close();
  message2.success({
    content: '用于表示操作顺利达成，3秒后消失',
  });
};

const handleWarningBtnClick = () => {
  message3.warning({
    content: '用于表示操作引起一定后果，3秒后消失',
  });
};

const handleDangerBtnClick = () => {
  message4.danger({
    content: '用于表示操作引起严重的后果，3秒后消失',
  });
};

const handleLoadingBtnClick = () => {
  message5.show({
    content: '排队中，请稍后',
    status: 'loading',
  });
};

const handleInfoBtnClick2 = () => {
  message6.info({
    content: '用于表示普通操作信息提示，3秒后消失',
    position: 'bottom',
  });
};

const handleSuccessBtnClick2 = () => {
  message7.success({
    content: '用于表示操作顺利达成，3秒后消失',
    position: 'bottom',
  });
};

const handleWarningBtnClick2 = () => {
  message8.warning({
    content: '用于表示操作引起一定后果，3秒后消失',
    position: 'bottom',
  });
};

const handleDangerBtnClick2 = () => {
  message9.danger({
    content: '用于表示操作引起严重的后果，3秒后消失',
    position: 'bottom',
  });
};

const handleLoadingBtnClick2 = () => {
  message10.show({
    content: '排队中，请稍后',
    status: 'loading',
    position: 'bottom',
  });
};
</script>

<template>
  <h4>Target 显示到指定元素 上方</h4>
  <section>
    <OButton ref="btn1" color="primary" @click="handleInfoBtnClick">Info Message</OButton>
    <OButton ref="btn2" color="success" @click="handleSuccessBtnClick">Success Message</OButton>
    <OButton ref="btn3" color="warning" @click="handleWarningBtnClick">Warning Message</OButton>
    <OButton ref="btn4" color="danger" @click="handleDangerBtnClick">Danger Message</OButton>
    <OButton ref="btn5" color="primary" @click="handleLoadingBtnClick">Loading Message</OButton>
  </section>

  <h4>Target 显示到指定元素 下方</h4>
  <section>
    <OButton ref="btn6" color="primary" @click="handleInfoBtnClick2">Info Message</OButton>
    <OButton ref="btn7" color="success" @click="handleSuccessBtnClick2">Success Message</OButton>
    <OButton ref="btn8" color="warning" @click="handleWarningBtnClick2">Warning Message</OButton>
    <OButton ref="btn9" color="danger" @click="handleDangerBtnClick2">Danger Message</OButton>
    <OButton ref="btn10" color="primary" @click="handleLoadingBtnClick2">Loading Message</OButton>
  </section>
</template>
