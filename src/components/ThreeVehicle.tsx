import { Component as ReactComponent, Suspense, useEffect, useMemo, useRef, useState, type ErrorInfo, type ReactNode } from 'react';
import { Canvas, useFrame, useLoader, useThree, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { ArrowLeft, ArrowRight, Layers, RotateCcw, Hand, Plus } from 'lucide-react';

type Part = { id: string; label: string; component: string; names: string[]; offset: [number,number,number] };
const parts: Part[] = [
  {id:'hood',label:'Front body panel',component:'body',names:['BodyHood'],offset:[0,-.2,1.05]},
  {id:'left-door',label:'Left door',component:'body',names:['BodyDoorLColor1'],offset:[1.1,0,.15]},
  {id:'right-door',label:'Right door',component:'body',names:['BodyDoorRColor1'],offset:[-1.1,0,.15]},
  {id:'roof',label:'Roof panel',component:'body',names:['BodyRoofPanel'],offset:[0,0,1.25]},
  {id:'hatch',label:'Rear body assembly',component:'body',names:['BodyRearPanelsColor1'],offset:[0,.45,.75]},
  {id:'wheels',label:'Wheels & tires',component:'tires',names:['WheelFrontL','WheelFrontR','WheelRearL','WheelRearR'],offset:[.85,0,.1]},
];
function partFor(object: THREE.Object3D) {
  let current: THREE.Object3D | null = object;
  while(current) { const part=parts.find(p=>p.names.includes(current!.name));if(part)return part;current=current.parent; }
  return null;
}
function Studio({ command, reduced, exploded }: { command: number; reduced: boolean; exploded: number }) {
  const { gl, scene, camera, invalidate, size }=useThree(); const orbit=useRef<OrbitControls|null>(null);const distance=useRef(7.8);const direction=useMemo(()=>new THREE.Vector3(),[]);
  useEffect(()=>{const aspect=size.width/Math.max(1,size.height);distance.current=Math.max(7.8,2.95/(Math.tan(34*Math.PI/360)*Math.min(aspect,1.65)))*(1+exploded*.30);invalidate();},[size.width,size.height,exploded,invalidate]);
  useEffect(()=>{
    const environment=new RoomEnvironment();const pmrem=new THREE.PMREMGenerator(gl);const target=pmrem.fromScene(environment,.04);scene.environment=target.texture;scene.environmentIntensity=.9;environment.dispose();pmrem.dispose();
    const controls=new OrbitControls(camera,gl.domElement);orbit.current=controls;controls.target.set(0,.65,0);controls.enablePan=false;controls.enableZoom=false;controls.enableDamping=!reduced;controls.dampingFactor=.12;controls.minPolarAngle=.35;controls.maxPolarAngle=Math.PI/2.05;controls.rotateSpeed=.55;
    const change=()=>invalidate();controls.addEventListener('change',change);controls.update();invalidate();
    return()=>{controls.removeEventListener('change',change);controls.dispose();target.dispose();scene.environment=null;};
  },[gl,scene,camera,invalidate,reduced]);
  useEffect(()=>{if(!orbit.current)return;if(command===0||Math.abs(command)>=1000){camera.position.set(5,2.5,5.5);orbit.current.target.set(0,.65,0);}else{const position=camera.position.clone().sub(orbit.current.target);position.applyAxisAngle(new THREE.Vector3(0,1,0),command>0?.4:-.4);camera.position.copy(position.add(orbit.current.target));}orbit.current.update();invalidate();},[command,camera,invalidate]);
  useFrame((_,delta)=>{const controls=orbit.current;if(!controls)return;direction.copy(camera.position).sub(controls.target);const current=direction.length();const next=THREE.MathUtils.lerp(current,distance.current,reduced?1:1-Math.exp(-Math.min(delta,.04)*8));if(Math.abs(next-distance.current)>.001){camera.position.copy(controls.target).add(direction.setLength(next));invalidate();}controls.update();});return null;
}
function Car({ exploded, hovered, pinned, onHover, onPick, reduced, paint, onReady }: { exploded: number; hovered: string|null; pinned: string|null; onHover:(part:Part|null)=>void;onPick:(part:Part)=>void;reduced:boolean;paint:string;onReady:()=>void }) {
  const gltf=useLoader(GLTFLoader,'/models/car-concept.glb');const {invalidate}=useThree();
  const { model, moving }=useMemo(()=>{
    const model=gltf.scene.clone(true);const bounds=new THREE.Box3().setFromObject(model);const size=bounds.getSize(new THREE.Vector3());const scale=5.2/Math.max(size.x,size.z);model.scale.setScalar(scale);model.position.y=-bounds.min.y*scale;
    const materials=new Map<THREE.Material,THREE.Material>();
    model.traverse(object=>{
      if(!(object instanceof THREE.Mesh))return;
      if(/Emblem|License|Engine/.test(object.name))object.visible=false;
      const original=Array.isArray(object.material)?object.material:[object.material];
      const mapped=original.map(mat=>{if(materials.has(mat))return materials.get(mat)!;const copy=mat.clone();materials.set(mat,copy);if(copy instanceof THREE.MeshStandardMaterial){copy.envMapIntensity=1.2;if(/Paint/.test(copy.name)){copy.color.set('#aeb8bb');copy.metalness=.8;copy.roughness=.24;copy.map=null;copy.normalMap=null;if(copy instanceof THREE.MeshPhysicalMaterial){copy.iridescence=0;copy.clearcoat=1;copy.clearcoatRoughness=.18;}}if(/Interior 3/.test(copy.name))copy.color.set('#353d43');if(copy.name==='Glass'&&copy instanceof THREE.MeshPhysicalMaterial){copy.transmission=0;copy.transparent=true;copy.opacity=.28;copy.color.set('#52606b');copy.roughness=.12;copy.depthWrite=false;}}return copy;});object.material=Array.isArray(object.material)?mapped:mapped[0];object.castShadow=true;object.receiveShadow=true;
    });
    const moving=parts.flatMap(part=>part.names.flatMap(name=>{const object=model.getObjectByName(name);if(!object)return [];const offset=new THREE.Vector3(...part.offset);if(part.id==='wheels'&&name.endsWith('R'))offset.x*=-1;return [{object,base:object.position.clone(),offset,part:part.id}];}));
    return {model,moving};
  },[gltf]);
  useEffect(()=>{onReady();return()=>{model.traverse(o=>{if(o instanceof THREE.Mesh){const mats=Array.isArray(o.material)?o.material:[o.material];for(const m of mats)m.dispose();}});};},[model,onReady]);
  useEffect(()=>{model.traverse(o=>{if(o instanceof THREE.Mesh){for(const m of Array.isArray(o.material)?o.material:[o.material])if(m instanceof THREE.MeshStandardMaterial&&/Paint/.test(m.name))m.color.set(paint);}});invalidate();},[model,paint,invalidate]);
  useEffect(()=>{invalidate();},[exploded,hovered,pinned,invalidate]);
  const target=new THREE.Vector3();
  useFrame((_,delta)=>{let active=false;for(const entry of moving){const lift=exploded+(entry.part === hovered ? .18 : 0)+(entry.part === pinned ? .32 : 0);target.copy(entry.base).addScaledVector(entry.offset,lift);const amount=reduced?1:1-Math.exp(-Math.min(delta,.04)*9);entry.object.position.lerp(target,amount);if(entry.object.position.distanceToSquared(target)>.000002)active=true;}if(active)invalidate();});
  const move=(e:ThreeEvent<PointerEvent>)=>{if(e.pointerType==='touch')return;const part=partFor(e.object);if(part){e.stopPropagation();onHover(part);}};
  return <group rotation={[0,-.25,0]}><primitive object={model} onPointerMove={move} onPointerOut={()=>onHover(null)} onClick={(e:ThreeEvent<MouseEvent>)=>{const part=partFor(e.object);if(part){e.stopPropagation();onPick(part);}}} dispose={null}/></group>;
}
class SceneBoundary extends ReactComponent<{children:ReactNode;onFallback:()=>void},{failed:boolean}> {
  state={failed:false};static getDerivedStateFromError(){return{failed:true};}componentDidCatch(error:Error,info:ErrorInfo){console.warn('3D view unavailable',error.message,info.componentStack);}
  render(){return this.state.failed?<div className="three-fallback"><img src="/media/exterior-polished.png" alt="Vehicle illustration"/><p>The 3D view is unavailable on this device.</p><button className="button secondary" onClick={this.props.onFallback}>Use the image explorer</button></div>:this.props.children;}
}
export default function ThreeVehicle({ onSelect, compact=false, onFallback }: { onSelect:(id:string)=>void;compact?:boolean;onFallback?:()=>void }) {
  const [explode,setExplode]=useState(0);const [hovered,setHovered]=useState<Part|null>(null);const [pinned,setPinned]=useState<Part|null>(null);const [ready,setReady]=useState(false);const [command,setCommand]=useState(0);const [paint,setPaint]=useState('#aeb8bb');
  const [reduced,setReduced]=useState(()=>matchMedia('(prefers-reduced-motion:reduce)').matches);
  const markReady=useRef(()=>setReady(true)).current;
  useEffect(()=>{const media=matchMedia('(prefers-reduced-motion:reduce)');const update=()=>setReduced(media.matches);media.addEventListener('change',update);return()=>media.removeEventListener('change',update);},[]);
  const pick=(part:Part)=>{setPinned(p=>p?.id===part.id?null:part);onSelect(part.component);};
  const reset=()=>{setExplode(0);setHovered(null);setPinned(null);setCommand(c=>c>=1000?c+1:1000);};
  return <div className={`three-vehicle ${compact?'compact':''}`}><div className="three-top"><span><i/>Interactive 3D</span><button onClick={reset} aria-label="Reset 3D car"><RotateCcw size={13}/>Reset view</button></div><div className={`three-stage ${hovered?'part-hovered':''}`} role="group" aria-label="Interactive 3D vehicle. Drag to rotate. Hover over a panel to lift it, or choose an accessible part button below." onKeyDown={e=>{if(e.key==='Escape')reset();}}>
  {!ready&&<div className="three-loading" role="status"><span className="loading-cross">╳</span><p>Preparing your 3D vehicle…</p><small>One local model. No account required.</small></div>}
  <SceneBoundary onFallback={()=>onFallback?.()}><Canvas frameloop="demand" dpr={[1,1.5]} camera={{position:[5,2.5,5.5],fov:34,near:.1,far:50}} gl={{antialias:true,alpha:true,powerPreference:'high-performance'}} onCreated={({gl})=>{gl.toneMapping=THREE.ACESFilmicToneMapping;gl.toneMappingExposure=1.25;gl.domElement.setAttribute('aria-hidden','true');}} fallback={<div className="three-fallback"><img src="/media/exterior-polished.png" alt="Vehicle illustration"/><p>WebGL is unavailable. Use the component buttons to continue learning.</p></div>}>
    <ambientLight intensity={.5}/><directionalLight position={[4,7,3]} intensity={3}/><directionalLight position={[-4,3,-4]} intensity={2} color="#d6e8ff"/><directionalLight position={[0,2,-5]} intensity={1.4} color="#ffc774"/>
    <Suspense fallback={null}><Car exploded={explode} hovered={hovered?.id||null} pinned={pinned?.id||null} onHover={part=>setHovered(p=>p?.id===part?.id?p:part)} onPick={pick} reduced={reduced} paint={paint} onReady={markReady}/></Suspense><Studio command={command} reduced={reduced} exploded={explode}/>
    <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.025,0]}><circleGeometry args={[4.2,64]}/><meshBasicMaterial color="#141b20"/></mesh>
  </Canvas></SceneBoundary><div className="three-instruction"><Hand size={14}/>{hovered?`${hovered.label} · click to explore`:'Drag to rotate · move over a part to lift it'}</div><div className="three-orbit-controls"><button aria-label="Rotate car left" onClick={()=>setCommand(c=>c>0?-1:c-1)}><ArrowLeft size={16}/></button><button aria-label="Rotate car right" onClick={()=>setCommand(c=>c<0||c>=1000?1:c+1)}><ArrowRight size={16}/></button></div></div>
  <div className="three-toolbar"><button className={`explode-button ${explode?'active':''}`} aria-pressed={explode>0} onClick={()=>{setExplode(explode?0:1);setPinned(null);}}><Layers size={16}/>{explode?'Bring parts together':'Separate the parts'}<Plus size={14}/></button><label className="explode-slider">Separation<input type="range" aria-label="Part separation" min="0" max="100" value={explode*100} onChange={e=>setExplode(Number(e.target.value)/100)}/></label><div className="three-finishes" aria-label="3D body color">{[['#aeb8bb','Silver'],['#25353d','Graphite'],['#bd7c32','Amber']].map(([color,name])=><button key={name} style={{background:color}} aria-label={`${name} 3D finish`} aria-pressed={paint===color} onClick={()=>setPaint(color)}/>)}</div></div>
  <div className="three-parts" aria-label="Choose a 3D part">{parts.map(part=><button key={part.id} aria-pressed={pinned?.id===part.id} onMouseEnter={()=>setHovered(part)} onMouseLeave={()=>setHovered(null)} onFocus={()=>setHovered(part)} onBlur={()=>setHovered(null)} onClick={()=>pick(part)}>{part.label}</button>)}</div><p className="three-source">3D visual study by Eric Chadwick / DGG, CC BY 4.0. Exterior geometry only; internal vehicle systems are explained separately.</p></div>;
}
