<script setup lang="ts">
import { computed, ref, toRaw } from 'vue';
import type { Row } from './Table.vue';

type Props = {
  modelValue: boolean;
  rows: Row[];
};

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'update:rows', rows: Row[]): void;
}>();

const error = ref('');
const data = ref<{ name: string; phone: string; parent: string | null }>({
  name: '',
  phone: '',
  parent: 'NONE',
});

const parentNames = computed(() => {
  const stack = [...props.rows];
  const values = [];

  while (stack.length > 0) {
    const row = stack[0];

    values.push(stack.shift()?.name);
    if (row.children?.length > 0) {
      stack.unshift(...row.children);
    }
  }

  return values;
});

const parentNamesSet = computed(() => new Set(parentNames.value));

const submit = () => {
  const { name, parent, phone } = data.value;
  const newRow = { name: name.trim(), phone: phone.trim(), children: [] };
  error.value = '';

  if (parentNamesSet.value.has(name)) {
    error.value = 'Такое имя уже существует';
    return;
  }

  if (newRow.name.length == 0) {
    error.value = 'Имя не может отсутствовать';
    return;
  }

  const recursive = (array: Row[]) => {
    for (let i = 0; i < array.length; i++) {
      const row = array[i];

      row.children = recursive(row.children);

      if (row.name == parent) {
        row.children.push(newRow);
      }
    }

    return array;
  };

  if (parent != 'NONE') {
    emit('update:rows', recursive(structuredClone(toRaw(props.rows))));
  } else {
    emit('update:rows', [...toRaw(props.rows), newRow]);
  }

  data.value = {
    name: '',
    phone: '',
    parent: 'NONE',
  };
};
</script>

<template>
  <div v-if="modelValue" class="form">
    <div class="card form-card">
      <div class="form-header">
        <h2 class="title">Добавление пользователя</h2>
        <VIcon
          name="fa-times"
          @click.prevent="
            emit('update:modelValue', false);
            error = '';
          "
        />
      </div>
      <div class="form-row">
        <label for="name" class="form-col">Имя</label>
        <input
          type="text"
          name="name"
          class="form-col"
          :value="data.name"
          @input="data = { ...data, name: ($event.target as any).value }"
        />
      </div>
      <div class="form-row">
        <label for="phone" class="form-col">Телефон</label>
        <input
          type="text"
          name="phone"
          class="form-col"
          :value="data.phone"
          @input="data = { ...data, phone: ($event.target as any).value }"
        />
      </div>
      <div class="form-row">
        <label for="parent" class="form-col">Начальник</label>
        <select
          name="parent"
          class="form-col"
          :value="data.parent"
          @input="data = { ...data, parent: ($event.target as any).value }"
        >
          <option value="NONE"></option>
          <option v-for="name in parentNames" :key="name" :value="name">
            {{ name }}
          </option>
        </select>
      </div>
      <p class="form-error">{{ error }}</p>
      <button type="submit" class="button" @click="submit">Сохранить</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.form {
  display: flex;
  justify-content: center;
  align-items: center;

  position: absolute;
  top: 0;
  left: 0;

  background: rgba(0, 0, 0, 0.4);
  width: 100%;
  height: 100%;

  .form-card {
    width: 400px;

    @media screen and (max-width: 600px) {
      width: 100%;
    }

    .form-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
    }
  }

  .form-row {
    display: flex;
    margin-bottom: 20px;
  }

  .form-col {
    flex: 1;
  }

  .form-error {
    color: rgb(208, 55, 55);
    margin-bottom: 20px;
  }
}
</style>
