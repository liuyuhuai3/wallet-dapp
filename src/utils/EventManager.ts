// utils/EventManager.ts
export class EventManager<T extends Record<string, any>> {
  private listeners: Map<keyof T, Function[]> = new Map();

  /**
   * 添加事件监听器
   */
  on<K extends keyof T>(event: K, callback: (data: T[K]) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  /**
   * 移除事件监听器
   */
  off<K extends keyof T>(event: K, callback: (data: T[K]) => void): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  /**
   * 触发事件
   */
  emit<K extends keyof T>(event: K, data: T[K]): void {
    const eventListeners = this.listeners.get(event) || [];
    eventListeners.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in event listener for ${String(event)}:`, error);
      }
    });
  }

  /**
   * 添加一次性事件监听器
   */
  once<K extends keyof T>(event: K, callback: (data: T[K]) => void): void {
    const onceCallback = (data: T[K]) => {
      callback(data);
      this.off(event, onceCallback);
    };
    this.on(event, onceCallback);
  }

  /**
   * 移除所有事件监听器
   */
  removeAllListeners<K extends keyof T>(event?: K): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }

  /**
   * 获取事件监听器数量
   */
  listenerCount<K extends keyof T>(event: K): number {
    return this.listeners.get(event)?.length || 0;
  }
}