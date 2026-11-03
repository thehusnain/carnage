import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { ArrowUpRight, Menu, Search, X } from 'lucide-react';
import { usePreferences } from '../preferences';

const nav = [['Explore', '/explore'], ['Vehicle systems', '/systems'], ['Cybersecurity', '/cybersecurity'], ['Threat atlas', '/threats'], ['Knowledge', '/knowledge']] as const;
export function Layout() {
  const location = useLocation(); const [open, setOpen] = useState(false); const toggle = useRef<HTMLButtonElement>(null);
  const { storageAvailable } = usePreferences();
  useEffect(() => { setOpen(false); window.scrollTo({ top: 0 }); const title = (document.querySelector('h1') as HTMLElement | null)?.innerText.replace(/\s+/g, ' '); document.title = `${location.pathname === '/' ? 'See the Machine. Understand the Security.' : title || 'Explore the Machine'} — CARNAGE X-RAY`; }, [location.pathname]);
  useEffect(() => { if (!open) return; const close = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); toggle.current?.focus(); } }; window.addEventListener('keydown', close); return () => window.removeEventListener('keydown', close); }, [open]);
  return <><a className="skip-link" href="#main">Skip to content</a><header className="site-header"><Link className="brand" to="/" aria-label="Carnage X-Ray home"><span className="brand-mark" aria-hidden="true">╳</span><span>CARNAGE<span className="brand-sub">X-RAY</span></span></Link><nav className={open ? 'main-nav open' : 'main-nav'} aria-label="Main navigation" id="primary-nav">{nav.map(([label, path]) => <NavLink key={path} to={path}>{label}</NavLink>)}<NavLink className="mobile-about" to="/about">About the project</NavLink></nav><div className="nav-actions"><Link className="icon-button search-link" to="/knowledge" aria-label="Search knowledge"><Search size={18}/></Link><Link className="nav-cta" to="/explore">Open explorer<ArrowUpRight size={15}/></Link><button ref={toggle} className="icon-button menu-toggle" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="primary-nav" onClick={() => setOpen(!open)}>{open ? <X size={21}/> : <Menu size={21}/>}</button></div></header>
  {!storageAvailable && <p className="storage-notice" role="status">Browser storage is unavailable. Preferences will last for this visit only.</p>}
  <main id="main" tabIndex={-1}><Outlet/></main><footer className="site-footer"><Link className="footer-brand" to="/">CARNAGE <span>X-RAY</span></Link><p>See the Machine. Understand the Security.</p><div><Link to="/about">About & sources<ArrowUpRight size={13}/></Link><span>thecarnage.xyz · Independent education</span></div></footer></>;
}
