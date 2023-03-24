<script setup lang="ts">
import { ORow, OCol } from '../index';
</script>
<template>
  <h4>Basic 1</h4>
  <div class="block">
    <ORow justify="space-between">
      <OCol class="colored"><div class="box">box</div></OCol>
      <OCol width="50%" :shrink="0" class="colored"><div class="box">box</div></OCol>
      <OCol class="colored"><div class="box">box</div></OCol>
    </ORow>
    <br />
    <ORow justify="space-between" gap-x="16px">
      <OCol width="25%" class="colored">
        <div class="box">box</div>
      </OCol>
      <OCol width="50%" :shrink="0" class="colored">
        <div class="box">box</div>
      </OCol>
      <OCol width="25%" class="colored">
        <div class="box">box</div>
      </OCol>
    </ORow>

    <br />
    <ORow gap-x="16px" gap-y="16px" wrap="wrap">
      <OCol
        v-for="item in 10"
        :key="item"
        width="100%"
        :l="{ width: '20%' }"
        :m="{ width: '25%' }"
        :s="{ width: '33.333333%' }"
        :xs="{ width: '50%' }"
        class="colored"
      >
        <div class="box">{{ item }}</div>
      </OCol>
    </ORow>
    <br />
    <ORow
      gap-x="16px"
      gap-y="16px"
      wrap="wrap"
      :xs="{ gapX: '4px', gapY: '4px' }"
      :s="{ gapX: '8px', gapY: '8px' }"
      :m="{ gapX: '16px', gapY: '16px' }"
      :l="{ gapX: '24px', gapY: '24px' }"
      :xl="{ gapX: '32px', gapY: '32px' }"
      :xxl="{ gapX: '48px', gapY: '48px' }"
    >
      <OCol v-for="item in 10" :key="item" width="20%" class="colored">
        <div class="box">{{ item }}</div>
      </OCol>
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

  height: 48px;
}
</style>
