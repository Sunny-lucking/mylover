import { ref, onMounted, getCurrentInstance } from "vue";
export default function useTaskList() {
  const doneTaskList = ref([]);
  const toDoTaskList = ref([]);
  return {
    doneTaskList,
    toDoTaskList
  }
}
