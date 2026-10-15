import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

export function SpatialPanel({ children, className = "", depth = .2, index = 0, recede = false }: { children: ReactNode; className?: string; depth?: number; index?: number; recede?: boolean }) {
  const ref=useRef<HTMLDivElement>(null);
  const reduced=useReducedMotion();
  const [multiplier,setMultiplier]=useState(1);
  useEffect(()=>{const media=window.matchMedia("(max-width: 768px)");const update=()=>setMultiplier(media.matches?.5:1);update();media.addEventListener("change",update);return()=>media.removeEventListener("change",update);},[]);
  const {scrollYProgress}=useScroll({target:ref,offset:["start end","end start"]});
  const y=useTransform(scrollYProgress,[0,1],[depth*35*multiplier,-depth*35*multiplier]);
  const scale=useTransform(scrollYProgress,[0,.65,1],[1,1,.96]);
  const opacity=useTransform(scrollYProgress,[0,.65,1],[1,1,.6]);
  return <motion.div ref={ref} data-depth={depth} className={`obs-panel-wrap ${className}`} style={reduced ? {} : {y,scale:recede?scale:1,...(recede?{opacity}:{})}}
    initial={reduced||recede?false:{opacity:0}} {...(recede?{}:{whileInView:{opacity:1}})} viewport={{once:true,amount:.08}} transition={{duration:reduced?0:.4,delay:reduced?0:index*.04}}>{children}</motion.div>;
}

export function SpatialEffects() {
  const cursor=useRef<HTMLDivElement>(null);
  const reduced=useReducedMotion();
  const {scrollYProgress}=useScroll();
  useEffect(()=>{
    if(reduced || !window.matchMedia("(pointer: fine) and (min-width: 769px)").matches) return;
    let x=-30,y=-30,tx=-30,ty=-30,frame=0,last=performance.now();
    const move=(e:PointerEvent)=>{tx=e.clientX;ty=e.clientY; if(cursor.current)cursor.current.dataset['visible']="true";};
    const leave=()=>{if(cursor.current)cursor.current.dataset['visible']="false";};
    const tick=(now:number)=>{const factor=1-Math.exp(-(now-last)/80);last=now;x+=(tx-x)*factor;y+=(ty-y)*factor;if(cursor.current)cursor.current.style.transform=`translate3d(${x-4}px,${y-4}px,0)`;frame=requestAnimationFrame(tick);};
    frame=requestAnimationFrame(tick);window.addEventListener("pointermove",move);document.addEventListener("pointerleave",leave);
    return()=>{cancelAnimationFrame(frame);window.removeEventListener("pointermove",move);document.removeEventListener("pointerleave",leave);};
  },[reduced]);
  return <><motion.div className="obs-progress" style={{scaleX:scrollYProgress}} aria-hidden="true"/><div ref={cursor} className="custom-cursor" aria-hidden="true"/></>;
}
