import { useEffect, useRef } from "react";

const vertex = `attribute vec2 position; void main(){gl_Position=vec4(position,0.,1.);}`;
const fragment = `precision highp float;
uniform vec2 resolution; uniform float time; uniform vec3 ink; uniform vec3 mist; uniform vec3 base;
void main(){
 vec2 uv=(gl_FragCoord.xy-.5*resolution)/resolution.y;
 float phase=time*6.2831853/90.;
 float zoom=1.12+.32*sin(phase);
 vec2 c=uv*zoom+vec2(-.62+.14*cos(phase),.13+.17*sin(phase));
 vec2 z=vec2(0.); float n=0.;
 for(int i=0;i<100;i++){z=vec2(z.x*z.x-z.y*z.y,2.*z.x*z.y)+c; if(dot(z,z)>64.)break; n+=1.;}
 float smoothN=n; if(n<99.)smoothN=n+1.-log2(max(1.,log2(max(1.,length(z)))));
 float bands=.5+.5*cos(smoothN*.47); float edge=pow(clamp(smoothN/38.,0.,1.),.55);
 vec3 color=mix(ink,mist,bands*.65); color=mix(base,color,edge);
 if(n>=99.)color=base;
 gl_FragColor=vec4(color,1.);
}`;

export function FractalSubstrate({ mode }: { mode: "light" | "dark" }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const candidate = ref.current;
    if (!candidate) return;
    const canvas: HTMLCanvasElement = candidate;
    const gl = canvas.getContext("webgl", { alpha: false, antialias: false, powerPreference: "low-power" });
    if (!gl) { canvas.dataset['fallback'] = "true"; return; }
    const shaders: WebGLShader[] = [];
    function compile(type: number, source: string) {
      if (!gl) return null;
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source); gl.compileShader(shader); shaders.push(shader);
      return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
    }
    const vs = compile(gl.VERTEX_SHADER, vertex), fs = compile(gl.FRAGMENT_SHADER, fragment);
    const program = gl.createProgram();
    if (!vs || !fs || !program) { shaders.forEach(s => gl.deleteShader(s)); return; }
    gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);
    const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
    const location = gl.getAttribLocation(program, "position"); gl.enableVertexAttribArray(location); gl.vertexAttribPointer(location,2,gl.FLOAT,false,0,0);
    const res = gl.getUniformLocation(program,"resolution"), t = gl.getUniformLocation(program,"time");
    // Resolve semantic CSS colors to sRGB through the browser, not hardcoded shader colors.
    const probe = document.createElement("canvas").getContext("2d");
    const tokens = getComputedStyle(canvas);
    for (const [uniform, token] of [["ink","--fractal-ink"],["mist","--fractal-mist"],["base","--bg"]] as const) {
      if (!probe) continue;
      probe.fillStyle=tokens.getPropertyValue(token).trim(); probe.fillRect(0,0,1,1);
      const color=probe.getImageData(0,0,1,1).data;
      gl.uniform3f(gl.getUniformLocation(program,uniform),(color[0] ?? 0)/255,(color[1] ?? 0)/255,(color[2] ?? 0)/255);
    }
    const media=window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame=0, last=-100, start=performance.now();
    function resize() {
      const ratio=Math.min(window.devicePixelRatio*.5,1.5);
      canvas.width=Math.max(1,Math.round(window.innerWidth*ratio)); canvas.height=Math.max(1,Math.round(window.innerHeight*ratio));
      gl?.viewport(0,0,canvas.width,canvas.height);
    }
    function draw(now:number) {
      if (!gl) return;
      if (now-last>=1000/30 && !document.hidden) { gl.uniform2f(res,canvas.width,canvas.height); gl.uniform1f(t,media.matches ? 0 : ((now-start)/1000)%90); gl.drawArrays(gl.TRIANGLES,0,6); last=now; }
      if (!media.matches) frame=requestAnimationFrame(draw);
    }
    function restart() { cancelAnimationFrame(frame); last=-100; start=performance.now(); draw(start); }
    function onResize() { resize(); if(media.matches) {last=-100;draw(performance.now());} }
    resize(); restart(); window.addEventListener("resize",onResize); media.addEventListener("change",restart);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize",onResize); media.removeEventListener("change",restart); shaders.forEach(s=>gl.deleteShader(s));gl.deleteBuffer(buffer);gl.deleteProgram(program); };
  }, [mode]);
  return <canvas ref={ref} className="fractal-substrate" aria-hidden="true" />;
}
