import { lazy, Suspense, useEffect, useState, type CSSProperties } from 'react';
import { Check, Expand, Minus, Plus, RotateCcw } from 'lucide-react';
import { components, byId, topics, type Component, type Mode, type VehicleId } from '../data';

const ThreeVehicle = lazy(() => import('./ThreeVehicle'));
const HoverVideo = lazy(() => import('./HoverVideo'));
const options = [
  { name: 'Studio silver', color: '#c9cfd2', file: 'exterior-polished.png' },
  { name: 'Graphite', color: '#30363c', file: 'config/graphite.png' },
  { name: 'Sky blue', color: '#708fa2', file: 'config/sky-blue.png' },
  { name: 'Electric green', color: '#edff39', file: 'config/electric-green.png' },
  { name: 'Lime green', color: '#9fdc32', file: 'config/lime-green.png' },
];
const common = ['motor', 'battery', 'brakes', 'steering', 'keyless', 'telematics', 'adas', 'charge-port'];

export function VehicleScene({ selected, mode, vehicle, onSelect }: { selected: Component; mode: Mode; vehicle: VehicleId; onSelect: (id: string) => void }) {
  const [view, setView] = useState<'3d' | 'vehicle' | 'map'>('3d'); const [paint, setPaint] = useState(0); const [wheel, setWheel] = useState('');
  const [zoom, setZoom] = useState(1);
  const [preview, setPreview] = useState(false); const [previewLoaded, setPreviewLoaded] = useState(false); const [neutral, setNeutral] = useState(true); const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => { const media = matchMedia('(prefers-reduced-motion: reduce)'); const changed = () => setReduced(media.matches); media.addEventListener('change', changed); return () => media.removeEventListener('change', changed); }, []);
  useEffect(() => { setPreview(false); setZoom(1); }, [selected.id, mode, vehicle]); const [loaded, setLoaded] = useState(true); const [image, setImage] = useState('/media/exterior-polished.png'); const [error, setError] = useState(false);
  const showMap = view === 'map' || mode !== 'Mechanical' || vehicle === 'conventional';
  const canPreview = ['battery', 'motor'].includes(selected.id) && !wheel && paint === 0 && !showMap;
  useEffect(() => { if (showMap) setNeutral(true); }, [showMap]);
  const desired = preview && canPreview && !reduced ? (selected.id === 'battery' ? 'battery' as const : 'drive' as const) : null;
  useEffect(() => {
    const src = `/media/${wheel || options[paint].file}`; let active = true;
    if (src === image) return; setLoaded(false); setError(false); const next = new Image(); next.src = src;
    next.decode().then(() => { if (active) { setImage(src); setLoaded(true); } }).catch(() => { if (active) { setError(true); setLoaded(true); } });
    return () => { active = false; };
  }, [paint, wheel, image]);
  const available = components.filter(c => c.vehicles.includes(vehicle));
  const hotspots = available.filter(c => common.includes(c.id) || c.id === selected.id);
  return <section className="scene" aria-label="Interactive vehicle"><div className="scene-topline"><span className="eyebrow">CX—01 / {showMap ? 'FUNCTIONAL ARCHITECTURE' : 'CONNECTED ELECTRIC CONCEPT'}</span><div className="segmented" aria-label="Visualization"><button aria-pressed={view === '3d' && !showMap} onClick={() => setView('3d')} disabled={mode !== 'Mechanical' || vehicle === 'conventional'}>3D car</button><button aria-pressed={view === 'vehicle' && !showMap} onClick={() => { setView('vehicle'); }} disabled={mode !== 'Mechanical' || vehicle === 'conventional'}>Original study</button><button aria-pressed={showMap} onClick={() => setView('map')}>System map</button></div></div>
    {!showMap && view === '3d' ? <Suspense fallback={<div className="three-placeholder">Loading interactive 3D…</div>}><ThreeVehicle onSelect={onSelect} onFallback={() => setView('vehicle')}/></Suspense> : showMap ? <SystemMap selected={selected} available={available} mode={mode} onSelect={onSelect}/> : <div className="vehicle-plane"><div className="vehicle-image-wrap" style={{ transform: `scale(${zoom})` }}><img src={image} alt="Silver four-door electric vehicle concept in a blue studio; illustrative exterior, not validated engineering geometry" width="1672" height="941" onError={() => setError(true)}/>{previewLoaded && <div className="preview-layer" style={{ visibility: !neutral || desired ? 'visible' : 'hidden' }}><Suspense fallback={null}><HoverVideo desired={desired} mode="overview" reduced={reduced} onNeutral={setNeutral}/></Suspense></div>}{hotspots.map((c, i) => <button key={c.id} className={`hotspot ${selected.id === c.id ? 'selected' : ''}`} style={{ left: `${c.anchor[0]}%`, top: `${c.anchor[1]}%` }} aria-label={`Inspect ${c.name}`} aria-pressed={selected.id === c.id} onClick={() => onSelect(c.id)}><span>{selected.id === c.id ? <Check size={15}/> : <Plus size={15}/>}</span><em>{c.name}</em><span className="sr-only">{i+1}</span></button>)}</div><div className="image-caption">IMAGE-BASED EXPLORER · APPROXIMATE SYSTEM REGIONS</div></div>}
    {error && <p className="notice" role="status">That image could not load. The system map and component list remain available.</p>}
    {!showMap && view === 'vehicle' && <><div className="preview-controls"><button className="text-button" disabled={!canPreview || reduced} aria-pressed={preview} onClick={() => { setPreviewLoaded(true); setPreview(!preview); }}>{preview ? 'Return to exterior' : 'Reveal selected system'}<Plus size={13}/></button><span role="status">{reduced ? 'Still-image mode · reduced motion' : !neutral ? 'Authored cutaway preview · concept art' : canPreview ? 'Select reveal to inspect the concept cutaway' : 'Cutaway previews: electric motor & traction battery'}</span></div><div className="appearance"><div className="paint-options"><span className="eyebrow">FINISH</span>{options.map((option, i) => <button key={option.file} className={`swatch ${i === paint && !wheel ? 'selected' : ''}`} style={{ '--swatch': option.color } as CSSProperties} aria-label={option.name} aria-pressed={i === paint && !wheel} disabled={!neutral} onClick={() => { setWheel(''); setPaint(i); }}><span/></button>)}<span className="finish-name" role="status">{loaded ? wheel ? 'Wheel study' : options[paint].name : 'Loading finish…'}</span></div><label className="wheel-select">WHEELS<select aria-label="Wheel design" disabled={!neutral} value={wheel} onChange={e => { setWheel(e.target.value); setPaint(0); }}><option value="">Multi-spoke</option><option value="config/wheels-aero.png">Aero disc</option><option value="config/wheels-forged.png">Sport forged</option></select></label><div className="scene-zoom"><button className="icon-button" aria-label="Zoom out" disabled={zoom === 1} onClick={() => setZoom(1)}><Minus size={16}/></button><button className="icon-button" aria-label="Zoom in" aria-pressed={zoom > 1} onClick={() => setZoom(1.12)}><Expand size={16}/></button><button className="icon-button" aria-label="Reset appearance" onClick={() => { setPreview(false); setWheel(''); setPaint(0); setZoom(1); }}><RotateCcw size={15}/></button></div></div></>}
    <p className="scene-note">{!showMap && view === '3d' ? 'Hover to lift a panel. Drag to rotate. Tap a part or use the buttons to explore its lesson. Only modeled exterior parts separate.' : showMap ? 'Conceptual relationships, not physical wiring. Select a node or use the component list.' : 'Original concept artwork. Markers identify general regions, not verified component placements. Paint and wheels are independent visual studies.'}</p>
  </section>;
}

function SystemMap({ selected, available, mode, onSelect }: { selected: Component; available: Component[]; mode: Mode; onSelect: (id: string) => void }) {
  const related = available.filter(c => selected.related.includes(c.id)).slice(0, 6);
  const middle = available.find(c => c.id === 'gateway');
  const nodes = [selected, ...related];
  if (nodes.length < 4 && middle && !nodes.some(n => n.id === middle.id)) nodes.push(middle);
  return <div className={`system-map mode-${mode.toLowerCase()}`}><div className="map-heading"><span className="eyebrow">{mode.toUpperCase()} LAYER</span><p>{mode === 'Network' ? 'Follow the information.' : mode === 'Threat' ? 'Locate the trust boundary.' : mode === 'Protection' || mode === 'Security' ? 'Understand the safeguards.' : 'See how systems connect.'}</p></div><div className="map-nodes"><button className="map-node primary" onClick={() => onSelect(selected.id)} aria-pressed="true"><span className="node-index">SELECTED SYSTEM</span><strong>{selected.name}</strong><small>{selected.interfaces.length ? selected.interfaces.map(id => byId(topics, id).name.split(' · ')[0]).join(' / ') : 'No direct network interface'}</small></button><div className="map-branches">{nodes.slice(1).map(c => <div className="map-branch" key={c.id}><span className="connection-type">{selected.related.includes(c.id) ? selected.interfaces.some(i => c.interfaces.includes(i)) ? selected.interfaces.filter(i => c.interfaces.includes(i)).map(i => byId(topics, i).name.split(' · ')[0]).join(' / ') : 'Functional relationship' : 'Architecture context'}</span><button className="map-node" onClick={() => onSelect(c.id)} aria-label={`Inspect ${c.name}`}><span className="node-index">{c.category.toUpperCase()}</span><strong>{c.name}</strong><small>{c.purpose}</small></button></div>)}</div></div><div className="map-legend"><span><i/>Selected component</span><span>— Functional link · no routing or control authority implied</span></div></div>;
}
