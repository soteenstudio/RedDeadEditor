// src/composables/useWorkspace.js
import { ref } from 'vue';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

export function useWorkspace(loadFileContentCallback) {
  const activeFileId = ref('');
  const workspaceItems = ref([]);

  const findFileInTree = (items, id) => {
    for (const item of items) {
      if (item.id === id && item.type === 'file') return item;
      if (item.type === 'directory' && item.children) {
        const found = findFileInTree(item.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const getActiveFile = () => findFileInTree(workspaceItems.value, activeFileId.value);

  const readWorkspaceStorage = async () => {
    try {
      await Filesystem.requestPermissions();
      const result = await Filesystem.readdir({ path: '', directory: Directory.Documents });
      
      workspaceItems.value = result.files.map(file => ({
        id: file.name,
        type: file.type,
        name: file.name,
        path: file.name,
        content: '',
        children: file.type === 'directory' ? [] : null
      }));
    } catch (e) {
      console.error("Gagal membaca storage asli:", e);
    }
  };

  const readSubFolder = async (folderPath) => {
    try {
      const result = await Filesystem.readdir({ 
        path: folderPath, 
        directory: Directory.Documents 
      });

      const updateChildren = (items) => {
        for (let item of items) {
          if (item.id === folderPath && item.type === 'directory') {
            item.children = result.files.map(file => ({
              id: `${folderPath}/${file.name}`,
              type: file.type,
              name: file.name,
              path: `${folderPath}/${file.name}`,
              content: '',
              children: file.type === 'directory' ? [] : null
            }));
            return true;
          }
          if (item.type === 'directory' && item.children) {
            if (updateChildren(item.children)) return true;
          }
        }
        return false;
      };

      updateChildren(workspaceItems.value);
    } catch (e) {
      console.error(`Gagal membaca sub-folder: ${folderPath}`, e);
    }
  };

  const saveFileContent = async (filePath, text) => {
    try {
      await Filesystem.writeFile({
        path: filePath,
        data: text,
        directory: Directory.Documents,
        encoding: Encoding.UTF8
      });
    } catch (e) {
      console.error("Gagal auto-save berkas:", e);
    }
  };

  // REFACTOR: Menerima targetPath (bisa di root atau di dalam sub-folder)
  const createNewFile = async (targetPath = '') => {
    const name = prompt("Masukan nama berkas baru:", "untitled.js");
    if (!name) return;
    
    // Gabungkan path: kalau ada targetPath jadi 'folder/nama.js', kalau kosong jadi 'nama.js'
    const fullPath = targetPath ? `${targetPath}/${name}` : name;
    
    try {
      await Filesystem.writeFile({
        path: fullPath,
        data: `// Berkas ${name}\n`,
        directory: Directory.Documents,
        encoding: Encoding.UTF8
      });
      
      // Refresh tree: kalau bikinnya di dalem folder, reload foldernya aja. Kalau di root, reload root.
      if (targetPath) {
        await readSubFolder(targetPath);
      } else {
        await readWorkspaceStorage();
      }
      
      if (loadFileContentCallback) {
        await loadFileContentCallback(fullPath);
      }
    } catch (e) {
      alert("Gagal membuat berkas fisik!");
    }
  };

  // REFACTOR: Menerima targetPath untuk membuat folder baru
  const createNewFolder = async (targetPath = '') => {
    const name = prompt("Masukan nama folder baru:", "components");
    if (!name) return;
    
    const fullPath = targetPath ? `${targetPath}/${name}` : name;
    
    try {
      await Filesystem.mkdir({ path: fullPath, directory: Directory.Documents, recursive: false });
      
      if (targetPath) {
        await readSubFolder(targetPath);
      } else {
        await readWorkspaceStorage();
      }
    } catch (e) {
      alert("Gagal membuat folder fisik!");
    }
  };

  return {
    activeFileId,
    workspaceItems,
    getActiveFile,
    readWorkspaceStorage,
    readSubFolder,
    saveFileContent,
    createNewFile,
    createNewFolder
  };
}
