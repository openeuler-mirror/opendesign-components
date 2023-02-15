<script setup lang="ts">
import { OTag } from '../index';
</script>

<template>
  <h4>Status</h4>
  <section>
    <OTag>Normal Tag</OTag>
    <OTag status="success">Success Tag</OTag>
    <OTag status="warning">Warning Tag</OTag>
    <OTag status="danger">Danger Tag</OTag>
  </section>
</template>

<style>
a {
  color: #b2c0e4;
}
</style>
