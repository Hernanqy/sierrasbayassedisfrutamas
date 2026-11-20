'use client';

import { useState } from 'react';
import { Check, Compass, Info, Minus, Plus, RotateCcw } from 'lucide-react';
import { puntos, type Punto, type Circuito } from '@/data/sierras';

// Las posiciones están transcritas visualmente del folleto suministrado.
// NO son coordenadas GPS; esta es una capa esquemática para recorrer el mapa en la app.
// Escala local: x: 0–1000, y: 0–700. Conservar siempre id y código originales.
const posiciones: Record<string,[number,number]> = {
  A:[935,385], B:[852,548], C:[622,476], D:[670,558], E:[534,154],
  F:[258,576], G:[158,655], H:[58,575], I:[155,242], J:[541,330],
  '1':[612,332], '2':[658,311], '3':[702,298], '4':[753,434],
  '5':[536,303], '6':[548,350], '7':[575,222], '8':[435,236],
  '9':[487,306], '10':[482,334], '11':[499,423], '12':[507,455],
  '13':[513,485], '14':[557,413], '15':[400,98], '16':[57,556]
};

const zonas = [
  {x:150,y:224,t:'CERRO AGUIRRE'}, {x:550,y:135,t:'CERRO DEL DIABLO'},
  {x:824,y:505,t:'CERRO MATILDE'}, {x:690,y:586,t:'MONTE DE LOS FRESNOS'},
  {x:153,y:675,t:'CERRO LARGO'}, {x:330,y:525,t:'PASEO RECUPERADO'},
  {x:326,y:166,t:'CANTERA PIATTI'}, {x:815,y:390,t:'CANTERAS'}
];

export default function MapaJuego({circuito,hechos,abrir}:{circuito:Circuito;hechos:string[];abrir:(p:Punto)=>void}) {
  const [zoom,setZoom]=useState(1);
  const [desplazamiento,setDesplazamiento]=useState<[number,number]>([0,0]);
  const [mostrarAmbos,setMostrarAmbos]=useState(false);
  const visible=puntos.filter(p=>mostrarAmbos || p.circuito===circuito);
  const ancho=1000/zoom,alto=700/zoom;
  const cx=500+desplazamiento[0],cy=350+desplazamiento[1];
  const minX=Math.max(0,Math.min(1000-ancho,cx-ancho/2));
  const minY=Math.max(0,Math.min(700-alto,cy-alto/2));
  function mover(dx:number,dy:number){setDesplazamiento(([x,y])=>[Math.max(-450,Math.min(450,x+dx/zoom)),Math.max(-310,Math.min(310,y+dy/zoom))]);}
  function centrar(){setZoom(1);setDesplazamiento([0,0]);}
  return <section className="juego-mapa">
    <div className="juego-mapa-barra">
      <div><Compass size={20}/><strong>Mapa de aventura</strong><small>Basado en el folleto turístico</small></div>
      <div className="juego-mapa-acciones">
        <button onClick={()=>setMostrarAmbos(v=>!v)}>{mostrarAmbos?'Solo circuito':'Ver ambos'}</button>
        <button aria-label="Acercar" onClick={()=>setZoom(v=>Math.min(2.5,+(v+.25).toFixed(2)))}><Plus size={18}/></button>
        <button aria-label="Alejar" onClick={()=>setZoom(v=>Math.max(1,+(v-.25).toFixed(2)))}><Minus size={18}/></button>
        <button aria-label="Vista general" onClick={centrar}><RotateCcw size={17}/></button>
      </div>
    </div>
    <div className="juego-mapa-lienzo">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox={`${minX} ${minY} ${ancho} ${alto}`} role="img" aria-label="Mapa esquemático de los puntos turísticos de Sierras Bayas, digitalizado según el folleto" preserveAspectRatio="xMidYMid meet">
        <defs>
          <pattern id="manzanas" x="0" y="0" width="34" height="36" patternUnits="userSpaceOnUse"><rect width="26" height="27" x="4" y="5" rx="3" fill="#fffdf4" stroke="#bfd1b9" strokeWidth="1"/></pattern>
          <pattern id="arboles" x="0" y="0" width="41" height="42" patternUnits="userSpaceOnUse"><circle cx="20" cy="15" r="6" fill="#b8dba8"/><path d="M20 19v10" stroke="#5f9567" strokeWidth="2"/></pattern>
        </defs>
        <rect width="1000" height="700" fill="#f5efdc"/>
        <path d="M0 0h375l45 260-50 190-30 250H0Z" fill="#e6f0d8"/>
        <path d="M700 0H1000V700H830L768 560 730 398Z" fill="#e8efd8"/>
        <path d="M10 305 84 185 210 150 305 272 350 455 250 693 0 690Z" fill="url(#arboles)" opacity=".65"/>
        <path d="M680 0 967 0 985 700 740 700Z" fill="url(#arboles)" opacity=".55"/>
        <path d="M405 280L684 261 716 685 384 694 355 480Z" fill="url(#manzanas)"/>
        <path d="M540 10 750 10 758 265 554 277Z" fill="url(#manzanas)"/>
        <path d="M385 245l-65 60-42-53 68-72Z" fill="url(#manzanas)"/>
        <path d="M735 370q40-80 78-35t66 8q64-62 75 14t42 90q-92 60-138-10t-65-5q-35 25-58-62Z" fill="#78c5ea"/>
        <path d="M577 367q-49-30-30-60t42 1q23 22-12 59Z" fill="#78c5ea"/>
        <path d="M481 380q-31-31-24-61t30-4q17 18-6 65Z" fill="#78c5ea"/>
        <path d="M0 640q47-49 63 15t80 13q30-11 45 32H0Z" fill="#78c5ea"/>
        <path d="M409 0 480 212 525 375 541 700" fill="none" stroke="#b8a4d8" strokeWidth="9"/>
        <path d="M330 0 407 192 454 267 591 340 770 360 1000 280" fill="none" stroke="#d6bb96" strokeWidth="12"/>
        <path d="M0 588 176 523 355 566 487 540 696 510 861 606 1000 608" stroke="#d8c5a8" strokeWidth="13" fill="none"/>
        <path d="M0 588 176 523 355 566 487 540 696 510 861 606 1000 608" stroke="white" strokeWidth="7" fill="none"/>
        <path d="M375 255 597 255 736 311" stroke="#fff" strokeWidth="10" fill="none"/>
        <path d="M475 242 510 520" stroke="#e2c99d" strokeWidth="6" fill="none"/>
        <path d="M470 240 500 518" stroke="#b98c3a" strokeWidth="3" strokeDasharray="5 7" fill="none"/>
        <path d="M555 0 555 700" stroke="#e1d2b4" strokeWidth="4" fill="none" opacity=".5"/>
        <path d="M55 580 176 516 304 581 385 583 630 545 728 497 865 585 971 548 913 251 629 288 535 294 428 287 362 303 299 478 231 315" fill="none" stroke="#086d50" strokeWidth="7" strokeDasharray="3 12" strokeLinecap="round" opacity={circuito==='aventura'||mostrarAmbos?1:.22}/>
        <path d="M57 557 177 510 357 540 499 495 493 425 488 299 420 232 400 98" fill="none" stroke="#dc9b26" strokeWidth="7" strokeDasharray="3 11" strokeLinecap="round" opacity={circuito==='historico'||mostrarAmbos?1:.2}/>
        <path d="M475 284 510 495" stroke="#e12b94" strokeWidth="5" fill="none"/>
        <path d="M98 255 l29 -45 28 34 35 -25 35 40zM501 190l35 -44 42 50zM799 579l30 -42 27 29 21 -25 35 38zM125 659l30 -41 33 41z" fill="#7aae63" stroke="#5a965e" strokeWidth="2"/>
        {zonas.map(z=><g key={z.t}><rect x={z.x-5} y={z.y-16} width={Math.min(230,z.t.length*8.5)} height="21" rx="7" fill="#f5efdc" fillOpacity=".88"/><text x={z.x} y={z.y} fontSize="14" fontWeight="800" fill="#275c43">{z.t}</text></g>)}
        <text x="54" y="41" fontSize="27" fontFamily="Georgia,serif" fill="#155d49" fontWeight="bold">SIERRAS BAYAS</text>
        <g transform="translate(943 57)"><path d="M0 -27L-8 5 0 0 8 5Z" fill="#046849"/><text x="0" y="22" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#046849">N</text></g>
        {visible.map(p=>{
          const [x,y]=posiciones[p.id]; const done=hechos.includes(p.id); const active=p.circuito===circuito;
          return <g key={p.id} transform={`translate(${x},${y})`} onClick={()=>abrir(p)} className="juego-mapa-punto" role="button" tabIndex={0} aria-label={`Abrir ${p.nombre}`} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();abrir(p)}}}>
            <circle r="23" fill={p.circuito==='aventura'?'#007e52':'#e58d22'} stroke="#fff" strokeWidth="4" opacity={active?1:.75}/>
            <text x="0" y="6" textAnchor="middle" fill="#fff" fontWeight="900" fontSize={p.codigo.length>1?'16':'20'}>{done?'✓':p.codigo}</text>
            <circle r="30" fill="transparent"/>
            <title>{p.codigo} · {p.nombre}{done?' (completado)':''}</title>
          </g>;
        })}
      </svg>
      {zoom>1&&<div className="juego-mapa-pan" aria-label="Mover el mapa"><button onClick={()=>mover(0,-90)}>↑</button><div><button onClick={()=>mover(-90,0)}>←</button><button onClick={()=>mover(90,0)}>→</button></div><button onClick={()=>mover(0,90)}>↓</button></div>}
    </div>
    <div className="juego-mapa-leyenda"><span><i className="leyenda-aventura"/> Circuito Aventura</span><span><i className="leyenda-historico"/> Circuito Histórico</span><span><Check size={16}/> Cromo obtenido</span></div>
    <p className="juego-mapa-nota"><Info size={17}/> Ubicaciones relativas interpretadas del folleto original. Mapa ilustrativo para seleccionar misiones: no usar para navegación, distancias ni verificar presencia. La geolocalización exacta se incorporará después de validar coordenadas.</p>
  </section>;
}
