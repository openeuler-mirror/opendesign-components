<script setup lang="ts">
import { OButton } from '../index';
</script>
<template>
  <h4>Variant & Color</h4>
  <section style="align-items: flex-start">
    <div>
      <p>color: normal</p>
      <section>
        <OButton variant="outline">Outline Button</OButton>
        <OButton variant="fill">Fill Button</OButton>
        <OButton variant="text">Text Button</OButton>
      </section>
    </div>
    <div>
      <p>color: primary</p>
      <section>
        <OButton variant="outline" color="primary">Outline Button</OButton>
        <OButton variant="fill" color="primary">Fill Button</OButton>
        <OButton variant="text" color="primary">Text Button</OButton>
      </section>
    </div>
    <div>
      <p>color: success</p>
      <section>
        <OButton variant="outline" color="success">Outline Button</OButton>
        <OButton variant="fill" color="success">Fill Button</OButton>
        <OButton variant="text" color="success">Text Button</OButton>
      </section>
    </div>
    <div>
      <p>color: warning</p>
      <section>
        <OButton variant="outline" color="warning">Outline Button</OButton>
        <OButton variant="fill" color="warning">Fill Button</OButton>
        <OButton variant="text" color="warning">Text Button</OButton>
      </section>
    </div>
    <div>
      <p>color: danger</p>
      <section>
        <OButton variant="outline" color="danger">Outline Button</OButton>
        <OButton variant="fill" color="danger">Fill Button</OButton>
        <OButton variant="text" color="danger">Text Button</OButton>
      </section>
    </div>
  </section>
  <h4>Disabled</h4>
  <section>
    <OButton variant="outline" disabled>Outline Button</OButton>
    <OButton variant="fill" disabled>Fill Button</OButton>
    <OButton variant="text" disabled>Text Button</OButton>
  </section>

  <h4>Size</h4>
  <section>
    <OButton color="normal" size="small">Primary Button</OButton>
    <OButton color="normal" size="medium">Success Button</OButton>
    <OButton color="normal" size="large">Warning Button</OButton>

    <OButton color="primary" size="small">Primary Button</OButton>
    <OButton color="primary" size="medium">Success Button</OButton>
    <OButton color="primary" size="large">Warning Button</OButton>
  </section>
</template>
<style lang="scss"></style>
