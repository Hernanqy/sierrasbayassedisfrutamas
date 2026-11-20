import type { ReactNode } from "react";

const paths = {
 compass:<><circle cx="12" cy="12" r="9"/><path d="m16 8-2.5 5.5L8 16l2.5-5.5L16 8Z"/></>,
 pin:<><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
 book:<><rect x="4" y="3" width="16" height="18" rx="3"/><path d="M8 3v18m3-10 3-2 3 2-1 3h-4z"/></>,
 calendar:<><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 10h18m-12 5h2m3 0h2"/></>,
 info:<><circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.5"/></>,
 key:<><circle cx="8" cy="8" r="5"/><path d="m12 12 9 9m-5-5 3-3m0 6 2-2"/></>,
 quiz:<><circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 0 1 6 0c0 2-3 2-3 4m0 4v.1"/></>,
 puzzle:<path d="M4 4h6a3 3 0 0 1 6 0h4v6a3 3 0 0 0 0 6v4h-6a3 3 0 0 1-6 0H4v-6a3 3 0 0 1 0-6V4Z"/>,
 eye:<><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></>,
 train:<><rect x="5" y="3" width="14" height="15" rx="4"/><path d="M5 10h14m-9 8-3 3m7-3 3 3M9 14h.1m6 0h.1"/></>,
 hill:<><path d="m2 20 8-14 4 7 3-4 5 11H2Z"/><path d="m8 10 2-4 3 5"/></>,
 star:<path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z"/>,
 check:<path d="m5 12 4 4L19 6"/>,
 arrow:<path d="M4 12h16m-6-6 6 6-6 6"/>,
 back:<path d="M20 12H4m6-6-6 6 6 6"/>,
 search:<><circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/></>,
 lock:<><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
 audio:<path d="M3 9h4l5-4v14l-5-4H3zM16 9q4 3 0 6m2-9q7 6 0 12"/>,
 map:<path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2zm6-2v16m6-14v16"/>,
} satisfies Record<string,ReactNode>;
export type IconName=keyof typeof paths;
export function Icon({name,size=24}:{name:IconName;size?:number}) {
 return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
