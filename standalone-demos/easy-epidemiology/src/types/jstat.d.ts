declare module 'jstat' {
  interface ChiSquare {
    cdf: (x: number, df: number) => number;
    pdf: (x: number, df: number) => number;
    inv: (p: number, df: number) => number;
  }

  interface Normal {
    cdf: (x: number, mean: number, std: number) => number;
    pdf: (x: number, mean: number, std: number) => number;
    inv: (p: number, mean: number, std: number) => number;
  }

  interface JStat {
    chisquare: ChiSquare;
    normal: Normal;
    mean: (arr: number[]) => number;
    stdev: (arr: number[], flag?: boolean) => number;
    variance: (arr: number[], flag?: boolean) => number;
    median: (arr: number[]) => number;
    sum: (arr: number[]) => number;
  }

  export const jStat: JStat;
}
