<script setup lang="ts">
import type { Row } from './Table.vue';

type Props = {
  fieldId: string;
  fields: string[];
  modelValue: Row;
  depth: number;
};

defineProps<Props>();

defineOptions({
  name: 'TableRow',
});
</script>

<template>
  <div
    class="table-row table-content-row"
    :style="{ marginLeft: `${depth * 40}px` }"
  >
    <div v-for="field in fields" :key="field" class="table-col">
      {{ modelValue[field] }}
    </div>
  </div>
  <TableRow
    v-for="value in modelValue.children"
    :key="value[fieldId]"
    :model-value="value"
    :fields="fields"
    :field-id="fieldId"
    :depth="depth + 1"
  />
</template>

<style lang="scss" scoped>
.table-row {
  display: flex;
}

.table-content-row {
  border-bottom: 1px solid #f7f8fa;
  padding: 20px 20px;
}

.table-col {
  flex: 1;
}
</style>
