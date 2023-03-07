<script setup lang="ts">
import { OButton } from '../index';
</script>
<template>
  <h4>Variant & Color</h4>
  <section style="align-items: flex-start">
    <div>
      <p>color: normal</p>
      <div class="block">
        <div class="row">
          <OButton variant="outline">Outline Button</OButton>
          <OButton variant="solid">Solid Button</OButton>
          <OButton variant="text">Text Button</OButton>
        </div>
        <div class="row">
          <OButton variant="outline" disabled>Outline Button</OButton>
          <OButton variant="solid" disabled>Solid Button</OButton>
          <OButton variant="text" disabled>Text Button</OButton>
        </div>
      </div>
    </div>
    <div>
      <p>color: primary</p>
      <div class="block">
        <div class="row">
          <OButton variant="outline" color="primary">Outline Button</OButton>
          <OButton variant="solid" color="primary">Solid Button</OButton>
          <OButton variant="text" color="primary">Text Button</OButton>
        </div>
        <div class="row">
          <OButton variant="outline" color="primary" disabled>Outline Button</OButton>
          <OButton variant="solid" color="primary" disabled>Solid Button</OButton>
          <OButton variant="text" color="primary" disabled>Text Button</OButton>
        </div>
      </div>
    </div>
    <div>
      <p>color: success</p>
      <div class="block">
        <div class="row">
          <OButton variant="outline" color="success">Outline Button</OButton>
          <OButton variant="solid" color="success">Solid Button</OButton>
          <OButton variant="text" color="success">Text Button</OButton>
        </div>
        <div class="row">
          <OButton variant="outline" color="success" disabled>Outline Button</OButton>
          <OButton variant="solid" color="success" disabled>Solid Button</OButton>
          <OButton variant="text" color="success" disabled>Text Button</OButton>
        </div>
      </div>
    </div>
    <div>
      <p>color: warning</p>
      <div class="block">
        <div class="row">
          <OButton variant="outline" color="warning">Outline Button</OButton>
          <OButton variant="solid" color="warning">Solid Button</OButton>
          <OButton variant="text" color="warning">Text Button</OButton>
        </div>
        <div class="row">
          <OButton variant="outline" color="warning" disabled>Outline Button</OButton>
          <OButton variant="solid" color="warning" disabled>Solid Button</OButton>
          <OButton variant="text" color="warning" disabled>Text Button</OButton>
        </div>
      </div>
    </div>
    <div>
      <p>color: danger</p>
      <div class="block">
        <div class="row">
          <OButton variant="outline" color="danger">Outline Button</OButton>
          <OButton variant="solid" color="danger">Solid Button</OButton>
          <OButton variant="text" color="danger">Text Button</OButton>
        </div>
        <div class="row">
          <OButton variant="outline" color="danger" disabled>Outline Button</OButton>
          <OButton variant="solid" color="danger" disabled>Solid Button</OButton>
          <OButton variant="text" color="danger" disabled>Text Button</OButton>
        </div>
      </div>
    </div>
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
