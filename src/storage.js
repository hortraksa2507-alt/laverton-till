/** localStorage-backed shim for environments without window.storage */
export function installStorageShim() {
  if (typeof window === "undefined" || window.storage) return;

  window.storage = {
    async get(key) {
      try {
        const value = localStorage.getItem(key);
        return value !== null ? { value } : null;
      } catch {
        return null;
      }
    },
    async set(key, value) {
      localStorage.setItem(key, value);
    },
    async delete(key) {
      localStorage.removeItem(key);
    },
    async list(prefix) {
      const keys = [];
      try {
        for (let i = 0; i < localStorage.length; i += 1) {
          const key = localStorage.key(i);
          if (key && key.startsWith(prefix)) keys.push(key);
        }
      } catch {
        /* ignore */
      }
      return { keys };
    },
  };
}
