import { useEffect, useRef, useState } from 'react';
export const heroUrl = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260729_102822_0e6c87e8-c141-4744-bf32-ad30db296371.mp4';
export function ScrollVideo() {
  const video = useRef<HTMLVideoElement>(null); const canvas = useRef<HTMLCanvasElement>(null);
  const [decoded, setDecoded] = useState(false); const [cached, setCached] = useState(false);
  useEffect(() => {
    const visible = video.current!; const surface = canvas.current!; const ctx = surface.getContext('2d');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)'); const frames: ImageBitmap[] = [];
    const extractor = document.createElement('video'); extractor.crossOrigin = 'anonymous'; extractor.muted = true; extractor.playsInline = true; extractor.preload = 'auto';
    let disposed = false, ready = false, smoothed = 0, target = 0, raf = 0, started = false, timer = 0;
    const fit = () => { const dpr = Math.min(devicePixelRatio, 2); surface.width = Math.round(innerWidth * dpr); surface.height = Math.round(innerHeight * dpr); requestDraw(); };
    const cover = (frame: ImageBitmap) => { if (!ctx) return; const scale = Math.max(surface.width / frame.width, surface.height / frame.height); ctx.drawImage(frame, (surface.width - frame.width * scale) / 2, (surface.height - frame.height * scale) / 2, frame.width * scale, frame.height * scale); };
    function draw() {
      raf = 0; if (disposed) return;
      smoothed = reduced.matches ? 0 : smoothed + (target - smoothed) * .12;
      if (ready && frames.length) cover(frames[Math.min(frames.length - 1, Math.round(smoothed * (frames.length - 1)))]);
      else if (visible.readyState >= 2 && Number.isFinite(visible.duration) && !visible.seeking) { const t = smoothed * (visible.duration - .05); if (Math.abs(t-visible.currentTime) > .04) visible.currentTime = t; }
      if (!reduced.matches && Math.abs(target - smoothed) > .0001) raf = requestAnimationFrame(draw);
    }
    function requestDraw() { if (!raf) raf = requestAnimationFrame(draw); }
    const scroll = () => { target = Math.min(1, Math.max(0, scrollY / Math.max(1, document.documentElement.scrollHeight-innerHeight))); requestDraw(); };
    const event = (node: HTMLVideoElement, name: string) => new Promise<void>((resolve, reject) => {
      const timeout = window.setTimeout(() => { cleanup(); reject(Error('Video event timed out')); }, 12000);
      const done = () => { cleanup(); resolve(); }; const fail = () => { cleanup(); reject(Error('Video decode failed')); };
      const cleanup = () => { clearTimeout(timeout); node.removeEventListener(name, done); node.removeEventListener('error', fail); };
      node.addEventListener(name, done, { once: true }); node.addEventListener('error', fail, { once: true });
    });
    const extract = async () => {
      if (started || disposed || reduced.matches) return; started = true;
      try {
        extractor.src = heroUrl; const metadata = event(extractor, 'loadedmetadata'); extractor.load(); await metadata;
        const count = Math.min(90, Math.max(24, Math.round(extractor.duration*12))); const width = Math.min(960, extractor.videoWidth); const height = Math.round(width*extractor.videoHeight/extractor.videoWidth);
        const buffer = document.createElement('canvas'); buffer.width = width; buffer.height = height; const context = buffer.getContext('2d')!;
        for (let i=0; i<count && !disposed; i++) {
          const sought = event(extractor, 'seeked'); extractor.currentTime = Math.max(.001, i/(count-1)*(extractor.duration-.05)); await sought;
          if (disposed) break; context.drawImage(extractor,0,0,width,height); const frame = await createImageBitmap(buffer);
          if (disposed) { frame.close(); break; } frames.push(frame);
        }
        if (!disposed && frames.length === count) { ready = true; cover(frames[0]); setCached(true); requestDraw(); }
      } catch { for (const f of frames.splice(0)) f.close(); /* visible decoded video remains the fallback */ }
    };
    const loaded = () => { setDecoded(true); requestDraw(); timer = window.setTimeout(extract,300); };
    visible.addEventListener('loadeddata', loaded); visible.addEventListener('seeked', requestDraw); if (visible.readyState >= 2) loaded();
    addEventListener('scroll',scroll,{passive:true}); addEventListener('resize',fit); reduced.addEventListener('change',scroll); fit(); scroll();
    return () => { disposed = true; clearTimeout(timer); cancelAnimationFrame(raf); visible.removeEventListener('loadeddata',loaded); visible.removeEventListener('seeked',requestDraw); removeEventListener('scroll',scroll); removeEventListener('resize',fit); reduced.removeEventListener('change',scroll); extractor.pause(); extractor.removeAttribute('src'); extractor.load(); for(const frame of frames) frame.close(); };
  }, []);
  return <div className="scroll-background"><img src="/references/nova-ai/hero-poster.jpg" alt="" className={decoded || cached ? 'faded' : ''}/><video ref={video} src={heroUrl} muted playsInline preload="auto" crossOrigin="anonymous" className={decoded && !cached ? 'visible' : ''}/><canvas ref={canvas} className={cached ? 'visible' : ''}/></div>;
}
