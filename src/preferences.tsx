import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { z } from 'zod';
import { findComponent, vehicleIds } from './data';

const savedSchema = z.object({
  vehicle: z.enum(vehicleIds).catch('connected'), component: z.string().catch('body'),
  level: z.enum(['beginner', 'technical']).catch('beginner'), bookmarks: z.array(z.string()).catch([]),
  completed: z.array(z.string()).catch([]),
});
export type Preferences = z.infer<typeof savedSchema>;
export function readPreferences(raw: string | null): Preferences {
  try {
    const value = savedSchema.parse(raw ? JSON.parse(raw) : {});
    return { ...value, component: findComponent(value.component) ? value.component : 'body' };
  } catch { return { vehicle: 'connected', component: 'body', level: 'beginner', bookmarks: [], completed: [] }; }
}
type Context = { prefs: Preferences; update: (v: Partial<Preferences>) => void; toggleBookmark: (id: string) => void; toggleComplete: (id: string) => void; storageAvailable: boolean };
const PreferencesContext = createContext<Context | null>(null);
export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState(() => { try { return readPreferences(localStorage.getItem('carnage.preferences.v1')); } catch { return readPreferences(null); } });
  const [storageAvailable, setStorageAvailable] = useState(true);
  useEffect(() => { try { localStorage.setItem('carnage.preferences.v1', JSON.stringify(prefs)); } catch { setStorageAvailable(false); } }, [prefs]);
  const update = (value: Partial<Preferences>) => setPrefs(p => ({ ...p, ...value }));
  const toggle = (field: 'bookmarks' | 'completed', id: string) => setPrefs(p => ({ ...p, [field]: p[field].includes(id) ? p[field].filter(v => v !== id) : [...p[field], id] }));
  return <PreferencesContext value={{ prefs, update, toggleBookmark: id => toggle('bookmarks', id), toggleComplete: id => toggle('completed', id), storageAvailable }}>{children}</PreferencesContext>;
}
export function usePreferences() { const context = useContext(PreferencesContext); if (!context) throw Error('Missing preferences provider'); return context; }
