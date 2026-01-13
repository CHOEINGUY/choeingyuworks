/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, any>, Record<string, any>, any>
  export default component
}

declare module 'hwp.js' {
  const hwp: any;
  export default hwp;
}
declare module 'papaparse';
declare module 'file-saver';
declare module 'xlsx';
declare module 'echarts';
declare module 'lodash-es';

// Extend Window interface for legacy support if needed
interface Window {
  storeBridge?: any;
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: any;
}
