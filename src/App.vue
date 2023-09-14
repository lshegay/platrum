<script setup lang="ts">
import Table from './components/Table.vue';
import Form from './components/Form.vue';
import { useStore } from './utils/store';
import { data } from './utils/data';
import { ref } from 'vue';

const value = useStore(data);

const formVisible = ref(false);
</script>

<template>
  <div class="dashboard">
    <div class="card">
      <h2 class="title">Таблица</h2>
      <button :style="{ marginBottom: '20px' }" @click="formVisible = true">
        Добавить
      </button>
      <Table
        v-model="value"
        field-id="name"
        :titles="['Имя', 'Телефон']"
        :fields="['name', 'phone']"
      />
    </div>
  </div>
  <Form v-model="formVisible" v-model:rows="value" />
</template>

<style lang="scss" scoped>
.dashboard {
  background: #f6f8fa;
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  padding: 50px;

  @media screen and (max-width: 600px) {
    padding: 0;
  }

  overflow-y: scroll;
}
</style>
