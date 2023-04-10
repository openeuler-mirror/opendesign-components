<script setup lang="ts">
import { OFlex, OFlexItem } from '../index';
</script>
<template>
  <h4>Basic 1</h4>
  <div class="block">
    <OFlex gap="32px" :xl="{ gap: '18px' }" :lg="{ gap: '12px 0' }" :md="{ gap: '0 8px' }" :sm="{ gap: '24px' }" :xs="{ gap: '0' }" wrap="wrap">
      <OFlexItem class="colored"><div class="box">box</div></OFlexItem>
      <OFlexItem flex="50%" class="colored"><div class="box">box</div></OFlexItem>
      <OFlexItem class="colored"><div class="box">box</div></OFlexItem>
      <OFlexItem flex="0 0 50%" class="colored"><div class="box">box</div></OFlexItem>
      <OFlexItem class="colored"><div class="box">box</div></OFlexItem>
      <OFlexItem class="colored"><div class="box">box</div></OFlexItem>
    </OFlex>
    <br />
    <OFlex gap-x="16px">
      <OFlexItem flex="25%" class="colored">
        <div class="box">box</div>
      </OFlexItem>
      <OFlexItem flex="50%" :shrink="0" class="colored">
        <div class="box">box</div>
      </OFlexItem>
      <OFlexItem flex="25%" class="colored">
        <div class="box">box</div>
      </OFlexItem>
    </OFlex>

    <br />
    <OFlex gap="16px">
      <OFlexItem
        v-for="item in 10"
        :key="item"
        flex="10%"
        :xl="{ flex: '15%' }"
        :lg="{ flex: '20%' }"
        :md="{ flex: '25%' }"
        :sm="{ flex: '33.333333%' }"
        :xs="{ flex: '50%' }"
        class="colored"
      >
        <div class="box">{{ item }}</div>
      </OFlexItem>
    </OFlex>
    <br />
    <OFlex gap-x="16px" gap-y="16px" :xs="{ gap: '4px' }" :sm="{ gap: '8px' }" :md="{ gap: '16px' }" :lg="{ gap: '24px' }" :xl="{ gap: '32px' }">
      <OFlexItem v-for="item in 10" :key="item" flex="20%" class="colored">
        <div class="box">{{ item }}</div>
      </OFlexItem>
    </OFlex>
    <br />
    <OFlex gap="16px">
      <div class="colored"><div class="box">box</div></div>
      <div class="colored"><div class="box">box</div></div>
      <div class="colored"><div class="box">box</div></div>
    </OFlex>
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
