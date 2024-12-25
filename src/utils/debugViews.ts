interface ViewState {
  id: string;
  type: 'page' | 'modal' | 'tab' | 'dialog' | 'dropdown';
  name: string;
  isOpen?: boolean;
  path?: string;
  timestamp: number;
  activeTab?: string;
  parentId?: string; // To track which modal/component the tab belongs to
  pageName?: string;
}

class ViewDebugger {
  private activeViews: Map<string, ViewState> = new Map();
  private lastLogTimestamp: number = 0;
  private LOG_THROTTLE = 100; // ms

  log(component: string, action: string, data?: any) {
    const now = Date.now();
    
    // Throttle logging to prevent duplicates
    if (now - this.lastLogTimestamp < this.LOG_THROTTLE) {
      return;
    }
    
    this.lastLogTimestamp = now;
    const viewId = data?.viewId || `${component}-${now}`;

    console.group(`🔍 ${component} - ${action}`);
    console.log('Timestamp:', new Date().toISOString());
    console.log('View ID:', viewId);
    if (data) console.log('Data:', data);

    // Update view state
    this.updateViewState(component, action, viewId, data);

    // Only log UI state for significant actions
    if (['VIEW_MOUNTED', 'MODAL_STATE', 'TAB_CHANGED', 'DIALOG_OPENED', 'DIALOG_CLOSED'].includes(action)) {
      this.logUIState();
    }

    console.groupEnd();
  }

  private updateViewState(component: string, action: string, viewId: string, data?: any) {
    const now = Date.now();
    
    // Track view state
    switch (action) {
      case 'VIEW_MOUNTED':
        this.activeViews.set(viewId, {
          id: viewId,
          type: this.getViewType(component),
          name: component,
          isOpen: true,
          path: data?.path,
          pageName: data?.pageName,
          timestamp: now
        });
        break;
      case 'MODAL_OPENED':
      case 'MODAL_STATE':
        if (data?.state === 'opened' || action === 'MODAL_OPENED') {
          this.activeViews.set(viewId, {
            id: viewId,
            type: 'modal',
            name: component,
            isOpen: true,
            timestamp: now
          });
        }
        break;
      case 'MODAL_CLOSED':
        this.activeViews.delete(viewId);
        break;
      case 'TAB_CHANGED':
        const tabId = `${viewId}-tab-${data?.newTab}`;
        // Remove old tab if exists
        Array.from(this.activeViews.values())
          .filter(v => v.type === 'tab' && v.parentId === viewId)
          .forEach(v => this.activeViews.delete(v.id));
        
        // Add new tab
        this.activeViews.set(tabId, {
          id: tabId,
          type: 'tab',
          name: data?.newTab || 'unknown',
          isOpen: true,
          parentId: viewId,
          timestamp: now,
          activeTab: data?.newTab
        });
        break;
      case 'DIALOG_OPENED':
        this.activeViews.set(viewId, {
          id: viewId,
          type: 'dialog',
          name: data?.dialogName || component,
          isOpen: true,
          timestamp: now
        });
        break;
      case 'DIALOG_CLOSED':
        this.activeViews.delete(viewId);
        break;
    }
  }

  private getViewType(component: string): ViewState['type'] {
    if (component.includes('Modal')) return 'modal';
    if (component.includes('Dialog')) return 'dialog';
    if (component.includes('Tab')) return 'tab';
    if (component.includes('Dropdown')) return 'dropdown';
    return 'page';
  }

  private logUIState() {
    console.group('🎯 Current UI State');
    
    // Log active pages
    const activePages = Array.from(this.activeViews.values())
      .filter(v => v.type === 'page');
    console.log('📄 Active Pages:', activePages);

    // Log open modals
    const openModals = Array.from(this.activeViews.values())
      .filter(v => v.type === 'modal' && v.isOpen);
    console.log('🪟 Open Modals:', openModals);

    // Log open dialogs
    const openDialogs = Array.from(this.activeViews.values())
      .filter(v => v.type === 'dialog' && v.isOpen);
    console.log('💭 Open Dialogs:', openDialogs);

    // Log active tabs with their parent components
    const activeTabs = Array.from(this.activeViews.values())
      .filter(v => v.type === 'tab' && v.isOpen)
      .map(tab => ({
        ...tab,
        parentComponent: this.activeViews.get(tab.parentId || '')?.name
      }));
    console.log('📑 Active Tabs:', activeTabs);

    // Log open dropdowns
    const openDropdowns = Array.from(this.activeViews.values())
      .filter(v => v.type === 'dropdown' && v.isOpen);
    console.log('📝 Open Dropdowns:', openDropdowns);

    console.groupEnd();
  }

  closeView(viewId: string) {
    this.activeViews.delete(viewId);
    this.logUIState();
  }
}

export const debugViews = new ViewDebugger(); 