import type { CSSProperties } from 'react';

const paths = {
  arrow: 'M5 12h14m-6-6 6 6-6 6',
  diagonal: 'M6 18 18 6M6 6h12v12',
  pulse: 'M2 12h4l3-8 5 16 3-8h5',
  orbit: 'M3 16C0 9 18 1 21 8s-15 15-18 8M8 3a10 10 0 0 1 13 13M16 21A10 10 0 0 1 3 8',
  book: 'M12 5v15M3 4c4-1 6 0 9 2 3-2 5-3 9-2v15c-4-1-6 0-9 2-3-2-5-3-9-2Z',
  layers: 'm12 3 9 5-9 5-9-5Zm-9 9 9 5 9-5M3 17l9 5 9-5',
  play: 'm8 5 11 7-11 7Z',
  pause: 'M8 5v14M16 5v14',
  volume: 'M11 4 6 8H2v8h4l5 4ZM15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14',
  mute: 'M11 4 6 8H2v8h4l5 4Zm5 5 6 6m0-6-6 6',
  expand: 'M8 3H3v5M16 3h5v5M3 16v5h5m8 0h5v-5',
  check: 'm5 12 4 4L20 5',
  shield: 'M12 3 3 7v6c0 5 9 9 9 9s9-4 9-9V7Zm-5 9 3 3 7-7',
  chevron: 'm9 5 7 7-7 7',
  download: 'M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5',
  close: 'm6 6 12 12M18 6 6 18',
  restart: 'M3 11a9 9 0 1 1 2 7M3 4v7h7',
  heart: 'M20 4c-3-2-6 0-8 3-2-3-5-5-8-3-4 3-1 8 8 16 9-8 12-13 8-16Z',
  lungs: 'M12 3v9m0-2-5 5m5-5 5 5M8 7C3 8 2 15 3 20c2 2 6-1 6-4V7ZM16 7c5 1 6 8 5 13-2 2-6-1-6-4V7Z',
  temp: 'M9 14V5a3 3 0 0 1 6 0v9a5 5 0 1 1-6 0Zm3-7v10m5-11h3m-3 4h3',
  sun: 'M12 2v2m0 16v2M2 12h2m16 0h2M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  moon: 'M20 15A9 9 0 0 1 9 3a9 9 0 1 0 11 12Z',
  grid: 'M3 3h7v7H3Zm11 0h7v7h-7ZM3 14h7v7H3Zm11 0h7v7h-7Z',
  signal: 'M3 20v-4m6 4v-8m6 8V8m6 12V4',
  info: 'M12 11v6m0-10v.1M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
  cross: 'M12 3v18M3 12h18',
  astronaut: 'M17 7a5 5 0 1 1-10 0 5 5 0 0 1 10 0M8 15H5l-2 6m13-6h3l2 6M9 14v8m6-8v8M9 18h6M8 6h8',
} as const;

export type IconName = keyof typeof paths;
export function Icon({name, size=20, style, className=''}:{name:IconName;size?:number;style?:CSSProperties;className?:string}) {
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={style}><path d={paths[name]}/></svg>;
}

export function AstralMark({size=34}:{size?:number}) {
  return <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true"><path d="M20 1 24.5 14.5 39 20 24.5 25.5 20 39 15.5 25.5 1 20 15.5 14.5Z" fill="currentColor"/><circle cx="20" cy="20" r="4" fill="#080c10"/></svg>;
}
