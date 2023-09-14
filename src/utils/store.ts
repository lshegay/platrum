import { ref, watch } from 'vue';

export const useStore = (defaultValue: any) => {
  const savedData = localStorage.getItem('value');
  const value = ref(savedData ? JSON.parse(savedData) : defaultValue);

  watch(value, (v) => {
    localStorage.setItem('value', JSON.stringify(v));
  });

  return value;
};
