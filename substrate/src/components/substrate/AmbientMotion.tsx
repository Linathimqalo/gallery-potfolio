import { useEffect } from 'react';

export function AmbientMotion() {
  useEffect(() => {
    const root=document.documentElement;
    const small=window.matchMedia('(max-width: 767px)');
    const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
    const sections=Array.from(document.querySelectorAll<HTMLElement>('.section'));
    let frame=0;
    const update=()=>{
      frame=0;
      const disabled=small.matches||motion.matches;
      const height=window.innerHeight;
      const contact=document.getElementById('contact');
      const end=contact?contact.getBoundingClientRect().top+window.scrollY:root.scrollHeight-height;
      const progress=disabled?0:Math.max(0,Math.min(1,window.scrollY/Math.max(1,end)));
      root.style.setProperty('--hue-drift',String(progress*4));
      for(const section of sections){
        const top=section.getBoundingClientRect().top;
        const enter=disabled?0:Math.max(0,Math.min(1,(height-top)/(height*.45)));
        section.style.setProperty('--section-breath',`${enter*8}px`);
      }
    };
    const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
    update();window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);motion.addEventListener('change',schedule);
    return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);motion.removeEventListener('change',schedule);root.style.removeProperty('--hue-drift');sections.forEach(section=>section.style.removeProperty('--section-breath'));};
  },[]);
  return null;
}