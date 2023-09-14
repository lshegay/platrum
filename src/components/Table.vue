<script setup lang="ts">
import { computed, ref, toRaw } from 'vue';
import TableRow from './TableRow.vue';

export type Row = Record<string, any> & { children: Row[] };

type Props = {
  fieldId: string;
  fields: string[];
  titles: string[];
  modelValue: Row[];
};

const props = defineProps<Props>();

const sortKey = ref<number | null>(null);
const sorting = ref<'desc' | 'asc'>('asc');

const renderingValues = computed(() => {
  if (sortKey.value != null) {
    const sortField = props.fields[sortKey.value];
    const recursive = (array: Row[]) => {
      for (let i = 0; i < array.length; i++) {
        const row = array[i];

        row.children = recursive(row.children);
      }

      return array.sort((a, b) =>
        sorting.value == 'asc'
          ? a[sortField].localeCompare(b[sortField])
          : b[sortField].localeCompare(a[sortField]),
      );
    };

    return recursive(structuredClone(toRaw(props.modelValue)));
  }

  return props.modelValue;
});

const setSortingField = (index: number) => {
  if (sortKey.value == index) {
    sorting.value = sorting.value == 'asc' ? 'desc' : 'asc';
    if (sorting.value == 'asc') sortKey.value = null;
    return;
  }

  sortKey.value = index;
  sorting.value = 'asc';
};
</script>

<template>
  <table class="table">
    <div class="table-row table-header">
      <div
        v-for="(title, index) in titles"
        :key="title"
        class="table-col"
        @click="setSortingField(index)"
      >
        <span :style="{ marginRight: '10px' }">{{ title }}</span>
        <VIcon
          v-if="index == sortKey"
          :name="sorting == 'desc' ? 'fa-chevron-up' : 'fa-chevron-down'"
          scale="0.8"
        />
      </div>
    </div>
    <TableRow
      v-for="value in renderingValues"
      :key="value[fieldId]"
      :model-value="value"
      :fields="fields"
      :field-id="fieldId"
      :depth="0"
    />
  </table>
</template>

<style lang="scss" scoped>
.table {
  display: flex;
  flex-direction: column;
  width: 100%;

  .table-row {
    display: flex;
  }

  .table-header {
    background: #f6f8fa;
    border-radius: 10px;
    padding: 10px 20px;
    color: #858c9c;
    cursor: pointer;

    user-select: none;
  }

  .table-col {
    flex: 1;
  }
}
</style>
