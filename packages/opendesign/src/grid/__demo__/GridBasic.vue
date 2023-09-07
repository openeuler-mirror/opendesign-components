<script setup lang="ts">
import { ORow, OCol } from '../index';
</script>
<template>
  <h4>Basic 1</h4>
  <div class="block">
    <br />
    <p>Block1</p>
    <ORow gap="32px" :laptop="{ gap: '12px 0' }" :pad="{ gap: '0 8px' }" :phone="{ gap: '24px' }" wrap="wrap">
      <OCol class="colored"><div class="box">box</div></OCol>
      <OCol flex="50%" class="colored"><div class="box">box</div></OCol>
      <OCol class="colored"><div class="box">box</div></OCol>
      <OCol flex="0 0 50%" class="colored"><div class="box">box</div></OCol>
      <OCol class="colored"><div class="box">box</div></OCol>
      <OCol class="colored"><div class="box">box</div></OCol>
    </ORow>
    <br />
    <p>Block2</p>
    <ORow gap-x="16px">
      <OCol flex="25%" class="colored">
        <div class="box">box</div>
      </OCol>
      <OCol flex="50%" class="colored">
        <div class="box">box</div>
      </OCol>
      <OCol flex="25%" class="colored">
        <div class="box">box</div>
      </OCol>
    </ORow>

    <br />
    <p>Block3</p>
    <ORow gap="16px">
      <OCol
        v-for="item in 10"
        :key="item"
        flex="10%"
        :laptop="{ flex: '15%' }"
        :pad="{ flex: '20%' }"
        :pad-v="{ flex: '25%' }"
        :phone="{ flex: '33.333333%' }"
        class="colored"
      >
        <div class="box">{{ item }}</div>
      </OCol>
    </ORow>

    <br />
    <p>Block4</p>
    <ORow gap-x="16px" gap-y="16px" :laptop="{ gap: '24px' }" :pad-v="{ gap: '8px' }" :pad="{ gap: '16px' }" :phone="{ gap: '4px' }">
      <OCol v-for="item in 10" :key="item" flex="20%" class="colored">
        <div class="box">111{{ item }}</div>
      </OCol>
    </ORow>

    <br />
    <p>Block5</p>
    <ORow gap="16px">
      <div class="colored"><div class="box">box</div></div>
      <div class="colored"><div class="box">box</div></div>
      <div class="colored"><div class="box">box</div></div>
    </ORow>

    <br />
    <p>Block6</p>
    <ORow gap="16px">
      <OCol class="colored"><div class="box">box</div></OCol>
      <OCol class="colored"><div class="box">box</div></OCol>
      <OCol class="colored"><div class="box">box</div></OCol>
    </ORow>
  </div>
</template>
<style lang="scss">
.colored {
  &:nth-child(4n) {
    .box {
      background-color: rgba(29, 29, 170, 0.469);
    }
  }
  &:nth-child(4n + 1) {
    .box {
      background-color: rgba(38, 140, 144, 0.581);
    }
  }
  &:nth-child(4n + 2) {
    .box {
      background-color: rgba(81, 190, 56, 0.581);
    }
  }
  &:nth-child(4n + 3) {
    .box {
      background-color: rgba(188, 56, 190, 0.581);
    }
  }
}
.box {
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  // width: 25vw;
  height: 48px;
}
</style>
