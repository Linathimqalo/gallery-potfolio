export const fieldVertex = `attribute vec2 position; void main(){gl_Position=vec4(position,0.,1.);}`;
export const fieldFragment = `precision mediump float;
uniform vec2 resolution; uniform float time; uniform vec3 inkColor;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p); f=f*f*(3.-2.*f); return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float n=0.;float a=.5;for(int i=0;i<5;i++){n+=a*noise(p);p=mat2(.8,-.6,.6,.8)*p*2.03;a*=.5;}return n;}
void main(){vec2 uv=gl_FragCoord.xy/resolution;vec2 p=uv*vec2(resolution.x/resolution.y,1.)*3.2;float t=time*.013;
vec2 q=vec2(fbm(p+vec2(t,-t*.6)),fbm(p+vec2(4.1,2.4)+t*.4));
float f=fbm(p+q*2.7+vec2(-t*.3,t*.5));
float veins=pow(.5+.5*cos(f*73.+q.x*7.),12.);
float fine=pow(.5+.5*cos(f*147.),20.);
float mask=smoothstep(.06,.55,abs(uv.x-.5))*.65+.12;
float ink=(veins*.30+fine*.09)*mask;
gl_FragColor=vec4(inkColor,ink);}`;