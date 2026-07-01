<template>
  <div class="file-tree" @click.self="$emit('click-folder', '')">
    <div class="tree-container">
      <div v-for="item in items" :key="item.id" class="tree-item">
        <!-- Render Folder Root -->
        <div v-if="item.type === 'directory'" class="folder-group">
          <div
            class="item-folder row-item"
            :class="{ 'folder-selected': item.id === selectedFolder }"
            @click.stop="$emit('click-folder', item.id)"
          >
            <div class="item-info">
              <span class="icon">
                <font-awesome-icon
                  :icon="isFolderOpen(item.id) ? 'folder-open' : 'folder'"
                />
              </span>
              <span class="name">{{ item.name }}</span>
            </div>
            <button class="menu-trigger" @click.stop="$emit('open-menu', item)">
              ⋮
            </button>
          </div>

          <div
            v-if="isFolderOpen(item.id) && item.children"
            class="folder-children"
            style="padding-left: 15px"
          >
            <div v-for="child in item.children" :key="child.id">
              <div
                v-if="child.type === 'directory'"
                class="item-folder row-item"
                :class="{ 'folder-selected': child.id === selectedFolder }"
                @click.stop="$emit('click-folder', child.id)"
              >
                <div class="item-info">
                  <span class="icon">
                    <font-awesome-icon
                      :icon="isFolderOpen(item.id) ? 'folder-open' : 'folder'"
                    />
                  </span>
                  <span class="name">{{ child.name }}</span>
                </div>
                <button
                  class="menu-trigger"
                  @click.stop="$emit('open-menu', child)"
                >
                  ⋮
                </button>
              </div>
              <div
                v-else
                class="item-file row-item"
                :class="{ active: child.id === activeId }"
                @click.stop="$emit('select-file', child.id)"
              >
                <div class="item-info">
                  <span class="icon">
                    <font-awesome-icon icon="fa-solid fa-file-code" />
                  </span>
                  <span class="name">{{ child.name }}</span>
                </div>
                <button
                  class="menu-trigger"
                  @click.stop="$emit('open-menu', child)"
                >
                  ⋮
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Render File Root -->
        <div
          v-else
          class="item-file row-item"
          :class="{ active: item.id === activeId }"
          @click.stop="$emit('select-file', item.id)"
        >
          <div class="item-info">
            <span class="icon">
              <font-awesome-icon icon="fa-solid fa-file-code" />
            </span>
            <span class="name">{{ item.name }}</span>
          </div>
          <button class="menu-trigger" @click.stop="$emit('open-menu', item)">
            ⋮
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
    activeId: {
      type: String,
      required: true,
    },
    selectedFolder: {
      type: String,
      default: '',
    },
    openedFolders: {
      type: Object,
      required: true,
    },
  },
  emits: ['click-folder', 'select-file', 'open-menu'],

  setup(props) {
    const isFolderOpen = (id) => !!props.openedFolders[id];
    return { isFolderOpen };
  },
};
</script>
