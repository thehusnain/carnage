import { describe, expect, it } from 'vitest';
import { components, threats, protections, topics, sources, validateKnowledge, searchKnowledge } from './index';
import { readPreferences } from '../preferences';

describe('Knowledge integrity', () => {
  it('validates the complete graph with minimum release coverage', () => { expect(validateKnowledge()).toBe(true); expect(components.length).toBeGreaterThanOrEqual(15); expect(threats.length).toBeGreaterThanOrEqual(10); expect(protections.length).toBeGreaterThanOrEqual(10); });
  it('rejects a broken component relationship', () => { const altered = components.map((c,i) => i ? c : {...c, related:['nonexistent']}); expect(()=>validateKnowledge({components:altered, threats,protections,topics,sources})).toThrow(/Broken reference/); });
  it('rejects duplicate stable IDs', () => { expect(()=>validateKnowledge({components:[...components,components[0]], threats,protections,topics,sources})).toThrow(/Duplicate/); });
  it('derives reciprocal component-threat and protection relationships', () => { for(const threat of threats) for(const id of threat.components) { const c=components.find(c=>c.id===id)!; expect(c.threats).toContain(threat.id); for(const p of threat.protections) expect(c.protections).toContain(p); } });
  it('does not pretend the initial battery EV contains a combustion engine', () => { for(const id of ['engine','engine-ecu','fuel','exhaust','transmission','hybrid']) expect(components.find(c=>c.id===id)!.vehicles).not.toContain('connected'); expect(components.filter(c=>c.vehicles.includes('connected')).length).toBeGreaterThanOrEqual(15); });
  it('keeps passive systems free from fabricated digital attack mappings', () => { for(const id of ['body','suspension','tires','reduction']) expect(components.find(c=>c.id===id)!.threats).toEqual([]); });
});
describe('Search and stored preferences', () => {
  it('finds CAN across concepts and threats, ignoring case and whitespace', () => { expect(searchKnowledge('  CAN  ').some(r=>r.id==='can')).toBe(true); expect(searchKnowledge('CAN', 'Threat').some(r=>r.id==='can-injection')).toBe(true); expect(searchKnowledge('CAN','Component').every(r=>r.kind==='Component')).toBe(true); });
  it('returns a true empty result for unmatched text', () => { expect(searchKnowledge('absolutely-no-such-topic')).toEqual([]); });
  it('recovers from malformed or unavailable local preferences', () => { expect(readPreferences('{bad')).toEqual(readPreferences(null)); expect(readPreferences('{"component":"deleted","vehicle":"spaceship"}').component).toBe('body'); expect(readPreferences('{"vehicle":"spaceship"}').vehicle).toBe('connected'); });
  it('preserves valid saved learning state', () => { const p=readPreferences(JSON.stringify({vehicle:'conventional',component:'engine',level:'technical',bookmarks:['threat:relay'],completed:['concept:can']})); expect(p.level).toBe('technical'); expect(p.component).toBe('engine'); expect(p.bookmarks).toContain('threat:relay'); });
});
