<!-- src/components/ContextMenu.vue -->
<template>
  <div v-if="show" class="context-overlay" @click.stop="closeMenu">
    <div class="context-menu" @click.stop>
      <div v-if="title" class="menu-header">
        {{ title }}
      </div>
      <div
        v-for="opt in options"
        :key="opt.id"
        class="menu-item"
        :class="{ delete: opt.danger }"
        @click="handleAction(opt.id)"
      >
        <font-awesome-icon :icon="opt.icon" />
        {{ opt.label }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: { type: Boolean, required: true },
    title: { type: String, default: 'Unknown' },
    options: { type: Array, required: true },
  },
  emits: ['close', 'action'],
  setup(props, { emit }) {
    const closeMenu = () => emit('close');
    const handleAction = (id) => {
      emit('action', id);
      emit('close');
    };
    return { handleAction, closeMenu };
  },
};
</script>
<!-- (Style tetap sama, cuma tambahin kelas .delete kalau opt.danger true) -->

<style scoped>
.context-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
.context-menu {
  background: #1e1e1e;
  border: 1px solid #454545;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  border-radius: 6px;
  z-index: 9999;
  min-width: 200px;
  max-width: 300px;
  padding: 4px 0;
}
.menu-header {
  padding: 10px 16px;
  font-size: 12px;
  color: #888;
  border-bottom: 1px solid #333;
  margin-bottom: 4px;
}
.menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  color: #cccccc;
  font-size: 13px;
  cursor: pointer;
}
.menu-item:hover {
  background: #2a2d2e;
  color: #ffffff;
}
.menu-item.delete:hover {
  background: #a82020;
  color: #ffffff;
}
.menu-icon {
  font-size: 14px;
}
</style>
