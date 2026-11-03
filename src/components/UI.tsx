import { useEffect, useRef, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Bookmark, Check, ArrowRight } from 'lucide-react';
import { byId, sources } from '../data';
import { usePreferences } from '../preferences';

export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const node = ref.current!;
    const observer = new IntersectionObserver(entries => { if (entries.some(e => e.isIntersecting)) { node.animate([{opacity:.3,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:600,easing:'ease-out'}); observer.disconnect(); } }, { threshold: 0.1 });
    observer.observe(node); return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
}
export function SourceList({ ids }: { ids: readonly string[] }) {
  return <div className="source-list"><h3>Sources & further reading</h3>{ids.map(id => { const source = byId(sources, id); return <a key={id} href={source.url} target="_blank" rel="noreferrer">{source.title}<ArrowUpRight size={14}/><small>{source.type}</small></a>; })}</div>;
}
export function BookmarkButton({ id }: { id: string }) {
  const { prefs, toggleBookmark } = usePreferences(); const saved = prefs.bookmarks.includes(id);
  return <button className={`icon-button ${saved ? 'is-saved' : ''}`} aria-label={saved ? 'Remove bookmark' : 'Bookmark this lesson'} aria-pressed={saved} onClick={() => toggleBookmark(id)}><Bookmark size={18} fill={saved ? 'currentColor' : 'none'}/></button>;
}
export function ReadingComplete({ id }: { id: string }) {
  const { prefs, toggleComplete } = usePreferences(); const completed = prefs.completed.includes(id);
  return <button className="button secondary" aria-pressed={completed} onClick={() => toggleComplete(id)}><Check size={16}/>{completed ? 'Marked as read' : 'Mark as read'}</button>;
}
export function Eyebrow({ children }: { children: ReactNode }) { return <p className="eyebrow">{children}</p>; }
export function PageHeading({ index, title, children }: { index: string; title: string; children: ReactNode }) {
  return <div className="page-heading"><Eyebrow>{index} / THE TECHNICAL ATLAS</Eyebrow><h1>{title}</h1><p>{children}</p></div>;
}
export function TopicLink({ to, children }: { to: string; children: ReactNode }) { return <Link className="topic-link" to={to}>{children}<ArrowRight size={15}/></Link>; }

export function Wireframe({ kind }: { kind: 'mechanical' | 'network' | 'security' }) {
  return <svg viewBox="0 0 300 170" className="wireframe" aria-hidden="true"><defs><filter id={`glow-${kind}`}><feGaussianBlur stdDeviation="2"/></filter></defs><g fill="none" stroke="currentColor" strokeWidth="0.8">
    {kind === 'mechanical' && <>{[0, 1, 2, 3, 4].map(i => <ellipse key={i} cx="150" cy="86" rx={66 - i * 9} ry="49" transform={`rotate(${i * 36} 150 86)`}/>)}<ellipse cx="150" cy="86" rx="95" ry="26"/><ellipse cx="150" cy="86" rx="95" ry="26" transform="rotate(-25 150 86)"/><circle cx="150" cy="86" r="5" fill="currentColor"/><circle cx="240" cy="77" r="3" fill="currentColor"/></>}
    {kind === 'network' && <>{[[55, 60], [150, 30], [245, 60], [75, 125], [225, 125]].map(([x, y], i) => <g key={i}><path d={`M150 85L${x} ${y}`} strokeDasharray="3 4"/><path d={`m${x} ${y-17} 18 9v20l-18 9-18-9v-20z`}/><path d={`m${x-18} ${y-8} 18 9 18-9m-18 9v29`}/></g>)}<ellipse cx="150" cy="85" rx="22" ry="14"/><path d="M128 85v18c0 18 44 18 44 0V85"/></>}
    {kind === 'security' && <>{[0, 1, 2, 3].map(i => <path key={i} d={`m${150-i*4} ${20+i*9} 57 19v37c0 34-30 52-57 65-27-13-57-31-57-65V${39+i*9}z`} opacity={1-i*.18}/>)}<path d="m123 82 19 18 34-37" strokeWidth="2"/><path d="M150 20v121M93 39l114 37M93 76l114-37M103 107l94-15" opacity=".4"/></>}
  </g></svg>;
}
