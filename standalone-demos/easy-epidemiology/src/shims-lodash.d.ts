declare module 'lodash-es' {
  export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait?: number,
    options?: {
      leading?: boolean;
      maxWait?: number;
      trailing?: boolean;
    }
  ): T & { cancel(): void; flush(): void };

  export function throttle<T extends (...args: any[]) => any>(
    func: T,
    wait?: number,
    options?: {
      leading?: boolean;
      trailing?: boolean;
    }
  ): T & { cancel(): void; flush(): void };

  export function cloneDeep<T>(value: T): T;
  export function merge<TObject, TSource>(object: TObject, source: TSource): TObject & TSource;
  export function merge<TObject, TSource1, TSource2>(object: TObject, source1: TSource1, source2: TSource2): TObject & TSource1 & TSource2;
  export function isEqual(value: any, other: any): boolean;
}

declare module 'lodash' {
  import _ from 'lodash';
  export default _;
}
