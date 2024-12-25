import { useEffect, useRef } from 'react';
import { debugViews } from '@/utils/debugViews';

export const useViewLogger = (componentName: string, props?: any) => {
  const viewId = useRef(`${componentName}-${Date.now()}`);

  useEffect(() => {
    debugViews.log(componentName, 'VIEW_MOUNTED', {
      viewId: viewId.current,
      ...props
    });

    return () => {
      debugViews.log(componentName, 'VIEW_UNMOUNTED', {
        viewId: viewId.current
      });
      debugViews.closeView(viewId.current);
    };
  }, [componentName, props]);

  return viewId.current;
}; 