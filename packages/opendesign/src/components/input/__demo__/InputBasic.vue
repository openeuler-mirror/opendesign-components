<script setup lang="ts">
import { ref } from 'vue';
import { OInput } from '../index';
import { IconDone } from '../../icons';

const val1 = ref('');
const val2 = ref('this is input value');
const val3 = ref(`${12345}`);
setTimeout(() => {
  val2.value += '---';
}, 2000);
</script>
<template>
  <div>val1:{{ val1 }}</div>
  <div>val2:{{ val2 }}</div>
  <div>val3:{{ val3 }}</div>
  <h4>type</h4>
  <section>
    <div>
      <div class="row">
        <p>text:</p>
        <OInput v-model="val3" />
        <p>password:</p>
        <OInput v-model="val3" type="password" />
      </div>
    </div>
  </section>
  <h4>color & variant</h4>
  <section>
    <div class="row">
      <OInput v-model="val1" placeholder="outline + normal" />
      <OInput v-model="val1" placeholder="outline + success" color="success" />
      <OInput v-model="val1" placeholder="outline + warning" color="warning" />
      <OInput v-model="val1" placeholder="outline + danger" color="danger" />
    </div>
    <div class="row">
      <OInput v-model="val1" color="normal" placeholder="outline + normal">
        <template #prepend>+86</template>
        <template #append>手机</template>
      </OInput>
      <OInput v-model="val1" color="success" placeholder="outline + success">
        <template #prepend>+86</template>
        <template #append>手机</template>
      </OInput>
      <OInput v-model="val1" color="warning" placeholder="outline + warning">
        <template #prepend>+86</template>
        <template #append>手机</template>
      </OInput>
      <OInput v-model="val1" color="danger" placeholder="outline + danger">
        <template #prepend>+86</template>
        <template #append>手机</template>
      </OInput>
    </div>
    <div class="row">
      <OInput v-model="val1" variant="solid" placeholder="solid + normal" />
      <OInput v-model="val1" variant="solid" placeholder="solid + success" color="success" />
      <OInput v-model="val1" variant="solid" placeholder="solid + warning" color="warning" />
      <OInput v-model="val1" variant="solid" placeholder="solid + danger" color="danger" />
    </div>

    <div class="row">
      <OInput v-model="val1" color="normal" variant="solid" placeholder="solid + normal">
        <template #prepend>+86</template>
        <template #append>手机</template>
      </OInput>
      <OInput v-model="val1" color="success" variant="solid" placeholder="solid + success">
        <template #prepend>+86</template>
        <template #append>手机</template>
      </OInput>
      <OInput v-model="val1" color="warning" variant="solid" placeholder="solid + warning">
        <template #prepend>+86</template>
        <template #append>手机</template>
      </OInput>
      <OInput v-model="val1" color="danger" variant="solid" placeholder="solid + danger">
        <template #prepend>+86</template>
        <template #append>手机</template>
      </OInput>
    </div>
  </section>
  <h4>Size</h4>
  <section>
    <OInput v-model="val2" size="small" />
    <OInput v-model="val2" />
    <OInput v-model="val3" size="large" />
  </section>
  <h4>Readonly</h4>
  <section>
    <div>val1:{{ val1 }}</div>
    <OInput v-model="val2" readonly />
    <OInput v-model="val2" readonly>
      <template #prefix>
        <IconDone />
      </template>
    </OInput>
    <OInput v-model="val2" readonly>
      <template #suffix>
        <IconDone />
      </template>
    </OInput>
    <OInput v-model="val2" :clearable="false" readonly>
      <template #suffix> 元 </template>
    </OInput>
  </section>
  <h4>Disabled</h4>
  <section>
    <div class="row">
      <OInput v-model="val3" placeholder="outline + normal" disabled />
      <OInput v-model="val3" placeholder="outline + success" color="success" disabled />
      <OInput v-model="val3" placeholder="outline + warning" color="warning" disabled />
      <OInput v-model="val3" placeholder="outline + danger" color="danger" disabled />
    </div>
    <div class="row">
      <OInput v-model="val3" variant="solid" placeholder="solid + normal" disabled />
      <OInput v-model="val3" variant="solid" placeholder="solid + success" color="success" disabled />
      <OInput v-model="val3" variant="solid" placeholder="solid + warning" color="warning" disabled />
      <OInput v-model="val3" variant="solid" placeholder="solid + danger" color="danger" disabled />
    </div>

    <div class="row">
      <OInput v-model="val1" color="normal" variant="solid" placeholder="solid + normal" disabled>
        <template #prepend>+86</template>
        <template #append>手机</template>
      </OInput>
      <OInput v-model="val1" color="success" variant="solid" placeholder="solid + success" disabled>
        <template #prepend>+86</template>
        <template #append>手机</template>
      </OInput>
      <OInput v-model="val1" color="warning" variant="solid" placeholder="solid + warning" disabled>
        <template #prepend>+86</template>
        <template #append>手机</template>
      </OInput>
      <OInput v-model="val1" color="danger" variant="solid" placeholder="solid + danger" disabled>
        <template #prepend>+86</template>
        <template #append>手机</template>
      </OInput>
    </div>
  </section>
</template>
<style lang="scss"></style>
