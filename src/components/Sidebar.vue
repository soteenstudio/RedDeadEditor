<template>
  <div class="sidebar-wrapper">
    <!-- Activity Bar -->
    <div class="activity-bar">
      <div class="activity-item active" title="Explorer"><span class="act-icon">📁</span></div>
      <div class="activity-item" title="Search"><span class="act-icon">🔍</span></div>
      <div class="activity-item" title="Source Control"><span class="act-icon">🌿</span></div>
      <div class="activity-item" title="Extensions"><span class="act-icon">🧩</span></div>
    </div>

    <!-- Container Utama Explorer -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <span>EXPLORER: REDDEAD</span>
        <button class="close-btn" @click="$emit('toggle-sidebar')" title="Tutup Sidebar">⌕</button>
      </div>
      
      <div class="sidebar-actions">
        <!-- Mengirim selectedFolder ke Parent pas tombol di-klik -->
        <button @click="$emit('create-file', selectedFolder)" :title="selectedFolder ? `New File di ${selectedFolder}` : 'New File di Root'">📄+</button>
        <button @click="$emit('create-folder', selectedFolder)" :title="selectedFolder ? `New Folder di ${selectedFolder}` : 'New Folder di Root'">📁+</button>
      </div>

      <div class="file-tree" @click.self="selectedFolder = ''">
        <!-- Memakai template rekursif lewat tag berulang atau helper render -->
        <div class="tree-container">
          <div v-for="item in items" :key="item.id" class="tree-item">
            
            <!-- Render Folder -->
            <div v-if="item.type === 'directory'" class="folder-group">
              <div 
                class="item-folder" 
                :class="{ 'folder-selected': item.id === selectedFolder }"
                @click.stop="clickFolder(item.id)"
              >
                <span class="icon">{{ isFolderOpen(item.id) ? '📂' : '📁' }}</span>
                <span class="name">{{ item.name }}</span>
              </div>
              
              <!-- Render Anak di dalam Folder secara berjenjang jika statusnya terbuka -->
              <div v-if="isFolderOpen(item.id) && item.children" class="folder-children" style="padding-left: 15px;">
                <!-- Mengulang item anak -->
                <div v-for="child in item.children" :key="child.id">
                  <div v-if="child.type === 'directory'" class="item-folder" :class="{ 'folder-selected': child.id === selectedFolder }" @click.stop="clickFolder(child.id)">
                    <span class="icon">{{ isFolderOpen(child.id) ? '📂' : '📁' }}</span>
                    <span class="name">{{ child.name }}</span>
                  </div>
                  <div 
                    v-else 
                    class="item-file" 
                    :class="{ active: child.id === activeId }"
                    @click.stop="$emit('select-file', child.id)"
                  >
                    <span class="icon">📄</span>
                    <span class="name">{{ child.name }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Render File Root -->
            <div 
              v-else 
              class="item-file" 
              :class="{ active: item.id === activeId }"
              @click.stop="$emit('select-file', item.id)"
            >
              <span class="icon">📄</span>
              <span class="name">{{ item.name }}</span>
            </div>

          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  props: {
    items: { type: Array, required: true },
    activeId: { type: String, required: true } 
  },
  emits: ['toggle-sidebar', 'create-file', 'create-folder', 'select-file', 'explore-folder'],
  setup(props, { emit }) {
    const openedFolders = ref({});
    const selectedFolder = ref(''); // Mencatat folder mana yang sedang di-klik/dipilih

    const clickFolder = (folderPath) => {
      // Set folder ini sebagai target pembuatan file/folder baru
      selectedFolder.value = folderPath;

      // Toggle status buka-tutup
      openedFolders.value[folderPath] = !openedFolders.value[folderPath];
      
      if (openedFolders.value[folderPath]) {
        emit('explore-folder', folderPath);
      }
    };

    const isFolderOpen = (folderPath) => {
      return !!openedFolders.value[folderPath];
    };

    return {
      selectedFolder,
      clickFolder,
      isFolderOpen
    };
  }
}
</script>

<style scoped>
/* Sedikit tambahan style untuk menandai folder yang lagi aktif ditarget */
.folder-selected {
  background-color: rgba(0, 122, 204, 0.2) !important;
  outline: 1px dashed #007acc;
}
</style>
