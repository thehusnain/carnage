import { z } from 'zod';
import { componentSchema, protectionSchema, threatSchema, topicSchema } from './schema';
import { components } from './components';
import { threats } from './threats';
import { protections } from './protections';
import { topics } from './topics';
import { sources } from './sources';
export { components, threats, protections, topics, sources };
export * from './schema';
export { vehicles } from './vehicles';

export function validateKnowledge(data = { components, threats, protections, topics, sources }) {
  z.array(componentSchema).parse(data.components);
  z.array(threatSchema).parse(data.threats);
  z.array(protectionSchema).parse(data.protections);
  z.array(topicSchema).parse(data.topics);
  const collections = { components: data.components, threats: data.threats, protections: data.protections, topics: data.topics, sources: data.sources };
  for (const [kind, records] of Object.entries(collections)) {
    if (new Set(records.map(r => r.id)).size !== records.length) throw Error(`Duplicate ID in ${kind}`);
  }
  const check = (origin: string, ids: string[], target: keyof typeof collections) => {
    for (const id of ids) if (!collections[target].some(r => r.id === id)) throw Error(`Broken reference ${origin} → ${target}/${id}`);
  };
  for (const c of data.components) {
    check(c.id, c.related, 'components'); check(c.id, c.interfaces, 'topics'); check(c.id, c.prerequisites, 'topics');
    check(c.id, c.threats, 'threats'); check(c.id, c.protections, 'protections'); check(c.id, c.sources, 'sources');
  }
  for (const t of data.threats) { check(t.id, t.components, 'components'); check(t.id, t.protections, 'protections'); check(t.id, t.sources, 'sources'); }
  for (const t of data.topics) { check(t.id, t.components, 'components'); check(t.id, t.sources, 'sources'); }
  for (const p of data.protections) check(p.id, p.sources, 'sources');
  return true;
}
validateKnowledge();

export const findComponent = (id: string) => components.find(c => c.id === id);
export const byId = <T extends { id: string }>(items: readonly T[], id: string): T => {
  const item = items.find(i => i.id === id);
  if (!item) throw Error(`Unknown content ID: ${id}`);
  return item;
};

export type SearchRecord = { id: string; name: string; description: string; kind: string; path: string };
export const searchRecords: SearchRecord[] = [
  ...components.map(c => ({ ...c, kind: 'Component', path: `/systems/${c.id}` })),
  ...topics.map(t => ({ ...t, kind: 'Concept', path: `/knowledge/${t.id}` })),
  ...protections.map(p => ({ ...p, kind: 'Protection', path: `/cybersecurity/${p.id}` })),
  ...threats.map(t => ({ ...t, description: t.definition, kind: 'Threat', path: `/threats/${t.id}` })),
];
export function searchKnowledge(query: string, kind = 'All') {
  const words = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  return searchRecords.filter(r => (kind === 'All' || r.kind === kind) && words.every(word => `${r.name} ${r.description} ${r.id}`.toLocaleLowerCase().includes(word)));
}
