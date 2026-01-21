<script setup lang="ts">
import { OFigure, OButton, OLink, OIconChevronRight } from '@opensig/opendesign';
</script>
<template>
  <OFigure src="/card-cover.jpg" hoverable class="plain-image-card c-figure-kunpeng-radius">
    <!-- data-o-theme="k.dark" to use kunpeng dart theme-->
    <div data-o-theme="k.dark" class="main">
      <div class="title">Image card title</div>
      <div class="detail">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit.
        Id minima deserunt distinctio officiis corporis ut,
        atque deleniti tempora perferendis totam eos similique obcaecati magni in voluptatibus,
        animi repudiandae, minus aliquid?
      </div>
      <div class="footer">
        <OButton round="pill" color="primary" size="medium">Button</OButton>
        <OLink tag="span" hover-underline class="c-link-kunpeng"
          >Text Button<template #suffix><OIconChevronRight /></template
        ></OLink>
      </div>
    </div>
  </OFigure>
</template>
<style lang="scss" scoped>
.plain-image-card {
  max-width: 600px;
}
.main {
  padding: var(--o3-gap-6);
}
.title {
  color: var(--o-color-info1);
  font-size: var(--o3-font_size-h2);
  line-height: var(--o3-line_height-h2);
  font-weight: 500;
}
.detail {
  color: var(--o-color-info2);
  margin-top: var(--o3-gap-4);
  font-size: var(--o3-font_size-text2);
  line-height: var(--o3-line_height-text2);
  max-height: calc(var(--o3-line_height-text2) * 2);
  overflow: hidden;
}
.footer {
  display: flex;
  gap: var(--o3-gap-5);
  align-items: center;
  margin-top: var(--o3-gap-5);
  font-size: var(--o3-font_size-text1);
  line-height: var(--o3-line_height-text1);
}
</style>
