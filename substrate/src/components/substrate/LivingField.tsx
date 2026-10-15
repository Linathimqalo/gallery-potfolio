import { useEffect, useRef } from 'react';
import { flowNoise } from './flowNoise';
import { fieldVertex, fieldFragment } from './fieldShader';

export function LivingField({ dark }: { dark: boolean }) {
  const fieldRef = useRef<HTMLCanvasElement>(null);
  const particleRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = fieldRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: false });
    if (!gl) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source); gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { gl.deleteShader(shader); return null; }
      return shader;
    };
    const vs = compile(gl.VERTEX_SHADER, fieldVertex), fs = compile(gl.FRAGMENT_SHADER, fieldFragment);
    if (!vs || !fs) { if(vs) gl.deleteShader(vs); if(fs) gl.deleteShader(fs); return; }
    const program = gl.createProgram();
    if (!program) { gl.deleteShader(vs); gl.deleteShader(fs); return; }
    gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
    gl.deleteShader(vs); gl.deleteShader(fs);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { gl.deleteProgram(program); return; }
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const sample = document.createElement('canvas'); sample.width=1; sample.height=1;
    const sampleContext = sample.getContext('2d');
    if (sampleContext) {
      sampleContext.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--field-ink').trim();
      sampleContext.fillRect(0,0,1,1);
      const rgb=sampleContext.getImageData(0,0,1,1).data;
      gl.uniform3f(gl.getUniformLocation(program,'inkColor'),(rgb[0] ?? 0)/255,(rgb[1] ?? 0)/255,(rgb[2] ?? 0)/255);
    }
    let frame=0, previous=0, elapsed=0;
    const draw=()=>{
      gl.uniform2f(gl.getUniformLocation(program,'resolution'),canvas.width,canvas.height);
      gl.uniform1f(gl.getUniformLocation(program,'time'),motion.matches?12:elapsed);
      gl.drawArrays(gl.TRIANGLES,0,6);
    };
    const resize=()=>{
      const ratio=Math.max(.5,window.devicePixelRatio*.5);
      canvas.width=Math.round(window.innerWidth*ratio); canvas.height=Math.round(window.innerHeight*ratio);
      gl.viewport(0,0,canvas.width,canvas.height); draw();
    };
    const paint=(now:number)=>{
      if(document.hidden || motion.matches) return;
      if(!previous || now-previous>=1000/30){
        if(previous) elapsed+=Math.min(now-previous,100)/1000;
        previous=now; draw();
      }
      frame=requestAnimationFrame(paint);
    };
    const resume=()=>{cancelAnimationFrame(frame);previous=0;draw();if(!document.hidden&&!motion.matches)frame=requestAnimationFrame(paint);};
    resize(); resume();
    window.addEventListener('resize',resize); document.addEventListener('visibilitychange',resume); motion.addEventListener('change',resume);
    return()=>{
      cancelAnimationFrame(frame); window.removeEventListener('resize',resize); document.removeEventListener('visibilitychange',resume); motion.removeEventListener('change',resume);
      gl.deleteBuffer(buffer); gl.deleteProgram(program);
    };
  }, [dark]);
  useEffect(() => {
    const canvas=particleRef.current;
    if(!canvas) return;
    const ctx=canvas.getContext('2d');
    if(!ctx) return;
    const small=window.matchMedia('(max-width: 767px)');
    const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
    const color=getComputedStyle(document.documentElement).getPropertyValue('--text-meta').trim();
    let width=0,height=0,frame=0,previous=0,time=0;
    const cursor={x:-1000,y:-1000};
    let particles: {x:number;y:number;r:number;phase:number;cycle:number;opacity:number;vx:number;vy:number}[]=[];
    const resize=()=>{
      width=window.innerWidth;height=window.innerHeight;
      const ratio=window.devicePixelRatio/1.5;
      canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);
      ctx.setTransform(ratio,0,0,ratio,0,0);
      particles=small.matches||motion.matches?[]:Array.from({length:80},()=>({x:Math.random()*width,y:Math.random()*height,r:2+Math.random()*2,phase:Math.random()*Math.PI*2,cycle:8+Math.random()*7,opacity:.15+Math.random()*.15,vx:0,vy:0}));
    };
    const paint=(now:number)=>{
      if(document.hidden||small.matches||motion.matches) return;
      const step=previous?Math.min((now-previous)/(1000/30),2):1;
      if(!previous||now-previous>=1000/30-.5){
        previous=now;time+=step/30;ctx.clearRect(0,0,width,height);
        for(const p of particles){
          const angle=flowNoise(p.x*.001,p.y*.001,time*.015+p.phase)*Math.PI*2;
          const dx=p.x-cursor.x,dy=p.y-cursor.y,distance=Math.hypot(dx,dy);
          const force=distance>0&&distance<150?(1-distance/150)*.7:0;
          const vx=Math.cos(angle)*.11+(distance?dx/distance*force:0);
          const vy=Math.sin(angle)*.11+(distance?dy/distance*force:0);
          p.vx+=(vx-p.vx)*.04;p.vy+=(vy-p.vy)*.04;
          p.x=(p.x+p.vx*step+width)%width;p.y=(p.y+p.vy*step+height)%height;
          const glow=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r);
          glow.addColorStop(0,color);glow.addColorStop(1,'transparent');
          ctx.globalAlpha=p.opacity*(.5-.5*Math.cos(time*Math.PI*2/p.cycle+p.phase));
          ctx.fillStyle=glow;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();
        }
      }
      frame=requestAnimationFrame(paint);
    };
    const resume=()=>{cancelAnimationFrame(frame);previous=0;if(!document.hidden&&!small.matches&&!motion.matches)frame=requestAnimationFrame(paint);};
    const configure=()=>{resize();resume();};
    const move=(e:PointerEvent)=>{cursor.x=e.clientX;cursor.y=e.clientY;};
    const leave=()=>{cursor.x=-1000;cursor.y=-1000;};
    configure();window.addEventListener('resize',configure);window.addEventListener('pointermove',move);document.documentElement.addEventListener('pointerleave',leave);document.addEventListener('visibilitychange',resume);motion.addEventListener('change',configure);
    return()=>{cancelAnimationFrame(frame);window.removeEventListener('resize',configure);window.removeEventListener('pointermove',move);document.documentElement.removeEventListener('pointerleave',leave);document.removeEventListener('visibilitychange',resume);motion.removeEventListener('change',configure);};
  },[dark]);
  return <><canvas ref={fieldRef} className="living-field" aria-hidden="true"/><canvas ref={particleRef} className="particle-field" aria-hidden="true"/></>;
}
