<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

let globalId = 0;
export default defineComponent({
  name: 'OIconNoData',
  svgType: 'color',
  setup() {
    const classNames = ['o-svg-icon', 'o-icon-no-data', 'type-color'];
    const isClient = ref(false);
    onMounted(() => {
      isClient.value = true;
    });
    return {
      isClient,
      classNames,
      globalId: globalId++,
    };
  },
});
</script>
<template>
  <svg fill="none" viewBox="0 0 240 210" :class="classNames">
    <template v-if="isClient">
      <defs><linearGradient :id="`no-data_svg__c_${globalId}`" x1="120" x2="120" y1="152.797" y2="187.814" class="no-data_svg__c" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#949494" stop-opacity=".2"/><stop offset="1" stop-color="#949494" stop-opacity="0"/></linearGradient><filter :id="`no-data_svg__a_${globalId}`" class="no-data_svg__a"><feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"/></filter></defs><mask :id="`no-data_svg__b_${globalId}`" width="240" height="210" x="0" y="0" class="no-data_svg__b" maskUnits="userSpaceOnUse"><g :filter="`url(#no-data_svg__a_${globalId})`"><path fill="#fff" d="M0 0h240v210H0z"/><path d="M.5.5h239v209H.5z"/></g></mask><g :mask="`url(#no-data_svg__b_${globalId})`"><path fill="#d8d8d8" fill-opacity=".004" d="M0 0h240v210H0z"/><path d="M.5.5h239v209H.5z"/><path :fill="`url(#no-data_svg__c_${globalId})`" d="M62.948 152.797c-49.875 9.757-84.698 31.916-84.698 57.689h283.5c0-25.773-34.823-47.932-84.698-57.689a11.19 11.19 0 0 1-9.452 5.189H72.4a11.19 11.19 0 0 1-9.452-5.189"/><path fill="#949494" fill-rule="evenodd" d="M178.811 92.919h-117.6v53.9c0 6.186 5.014 11.2 11.2 11.2h95.2c6.186 0 11.2-5.014 11.2-11.2zm-39.9 17.85h-37.8a4.2 4.2 0 1 0 0 8.4h37.8a4.2 4.2 0 1 0 0-8.4" opacity=".4"/><path fill="#949494" fill-rule="evenodd" d="m61.21 92.92 14.7-33.6v33.6zm102.901-16.8v16.8h14.7l-14.7-33.6z" opacity=".5"/><path fill="#949494" d="M75.906 59.319h88.2v33.6h-88.2z" opacity=".6"/><path fill="#949494" fill-rule="evenodd" d="m106.058 40.386 6.6-3.123-24.15-14.694 2.513 23.232 6.921-2.898 5.036 5.916v-7.274L92.283 27.532z" opacity=".5"/><path d="M103.211 51.97s2.353 21.858 15.582 21.858 17.025-20.063 6.848-20.263c-10.177-.199-11.168 20.195 15.955 23.147 27.122 2.95 13.913 21.365 5.382 21.457" opacity=".5"/><path stroke="#949494" stroke-dasharray="4.24936 4.24936" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.062" d="M103.211 51.97s2.353 21.858 15.582 21.858 17.025-20.063 6.848-20.263c-10.177-.199-11.168 20.195 15.955 23.147 27.122 2.95 13.913 21.365 5.382 21.457" opacity=".5"/><path fill="#949494" fill-rule="evenodd" d="M197.678 132.125q-1.32 2.26-1.971 2.737c-1.234.902-2.376 1.15-3.157 1.19-1.79.094 1.877-.53 3.111-2.062q1.234-1.531 2.872-4.59l-.995.053-1.027 1.437q-.55-.625-1.366-.582c-.818.042-2.91.512-3.597 2.863q-.687 2.352-3.11 4.24 3.73 1.665 7.06-.37 3.329-2.033 2.18-4.916M53.067 76.228q-2.238 3.95-3.344 4.783c-2.095 1.576-4.036 2.006-5.364 2.076-3.043.16 3.19-.925 5.284-3.602q2.095-2.677 4.87-8.023l-1.691.089-1.742 2.513q-.936-1.096-2.325-1.023c-1.389.073-4.944.888-6.107 5.002q-1.163 4.114-5.276 7.411 6.346 2.921 12.001-.629t3.694-8.597m158.09 30.867a.525.525 0 0 1 .549.499c.351 7.397-3.569 13.088-11.671 17.013a.525.525 0 0 1-.458-.945c7.746-3.753 11.41-9.072 11.08-16.018a.525.525 0 0 1 .5-.549" opacity=".3"/></g>
    </template>
  </svg>
</template>