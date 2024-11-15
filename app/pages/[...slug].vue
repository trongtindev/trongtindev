<script lang="ts" setup>
// uses
const route = useRoute();
</script>

<template>
  <main>
    <ContentDoc>
      <template #not-found> not-found {{ route.path }} </template>
    </ContentDoc>
  </main>
</template>
