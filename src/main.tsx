import { Component, Suspense, lazy, type ErrorInfo, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { PreferencesProvider } from './preferences';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import { About, Article, Directory, Knowledge, NotFound } from './pages/Library';
import './styles.css';
const Explore = lazy(() => import('./pages/Explore'));

class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error('Carnage X-Ray rendering error', error, info.componentStack); }
  render() { return this.state.failed ? <main className="section-wrap error-page"><h1>The explorer could not start.</h1><p>A content or rendering error occurred. Reload to retry. Your saved preferences remain in this browser.</p><button className="button primary" onClick={() => location.reload()}>Reload application</button><p>Content can also be read in the version-controlled src/data directory.</p></main> : this.props.children; }
}
createRoot(document.getElementById('root')!).render(<ErrorBoundary><PreferencesProvider><BrowserRouter><Suspense fallback={<p className="loading" role="status">Opening the vehicle explorer…</p>}><Routes><Route element={<Layout/>}><Route index element={<Home/>}/><Route path="explore" element={<Explore/>}/><Route path="systems" element={<Directory kind="systems"/>}/><Route path="systems/:id" element={<Article kind="component"/>}/><Route path="cybersecurity" element={<Directory kind="cybersecurity"/>}/><Route path="cybersecurity/:id" element={<Article kind="protection"/>}/><Route path="threats" element={<Directory kind="threats"/>}/><Route path="threats/:id" element={<Article kind="threat"/>}/><Route path="knowledge" element={<Knowledge/>}/><Route path="knowledge/:id" element={<Article kind="concept"/>}/><Route path="about" element={<About/>}/><Route path="*" element={<NotFound/>}/></Route></Routes></Suspense></BrowserRouter></PreferencesProvider></ErrorBoundary>);
