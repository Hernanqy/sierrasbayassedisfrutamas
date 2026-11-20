'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Award, BookOpen, CalendarDays, Check, CheckCircle2, ChevronRight, CircleHelp, Compass, Eye, Flag, Gift, Headphones, Info, KeyRound, Layers, MapPin, Menu, MessageCircle, Mountain, Pause, Play, Puzzle, Search, ShieldCheck, SkipForward, Sparkles, Star, TrainFront, Trophy, Volume2, VolumeX, X } from 'lucide-react';
import { culturales, puntos, servicios, type Punto, type Circuito } from '@/data/sierras';

type Vista = 'bienvenida' | 'zona' | 'juego' | 'final' | 'lugares' | 'album' | 'turismo' | 'eventos';
type Modo = 'tesoro' | 'trivia' | 'puzzle' | 'detective';
type Respuesta = { valor: string; correcto: boolean };
const MODOS: {id:Modo;titulo:string;sub:string;icono:typeof Compass;tono:string;duracion:string}[] = [
  {id:'tesoro',titulo:'Búsqueda del tesoro',sub:'Seguí pistas y encontrá la respuesta',icono:KeyRound,tono:'naranja',duracion:'5 min'},
  {id:'trivia',titulo:'Preguntas y respuestas',sub:'Aprendé jugando',icono:CircleHelp,tono:'violeta',duracion:'3 min'},
  {id:'puzzle',titulo:'Reconstruí la historia',sub:'Ordená las piezas de un mensaje',icono:Puzzle,tono:'menta',duracion:'4 min'},
  {id:'detective',titulo:'Detective del lugar',sub:'Observá y descubrí',icono:Eye,tono:'rosa',duracion:'4 min'},
];
const CLAVE='sb-aventuras-tramo4-v1';
const estacion = puntos.find(p=>p.id==='1') ?? puntos[10];
const nombreCircuito=(c:Circuito)=>c==='historico'?'Histórico':'Aventura';
const opcionesModo = (tipo:Modo, lugar:Punto) => {
  const esEstacion=lugar.id==='1';
  if(tipo==='tesoro') return {
    introduccion:esEstacion?'Primera pista: este lugar forma parte del circuito que conserva testimonios del pasado de la localidad.':'Primera pista: consultá el nombre de esta parada y su circuito del folleto.',
    pregunta:esEstacion?'¿En qué circuito del folleto turístico aparece el Museo de la Estación?':`¿En qué circuito aparece «${lugar.nombre}»?`,
    opciones:['Circuito Aventura','Circuito Histórico','Servicios turísticos'], correcta:lugar.circuito==='historico'?1:0,
    cierre:esEstacion?'Encontraste la primera pieza: la Estación pertenece al Circuito Histórico.':'Encontraste una pista del recorrido real del folleto.'
  };
  if(tipo==='trivia') return {
    introduccion:'Poné a prueba lo que sabés sobre el lugar seleccionado.',
    pregunta:esEstacion?'¿Con qué actividad se relaciona directamente el Museo de la Estación?':`¿Cómo figura clasificado «${lugar.nombre}» en el folleto turístico?`,
    opciones:esEstacion?['Ferrocarril','Astronomía','Navegación marítima']:['Circuito Histórico','Circuito Aventura','Ninguno'],
    correcta:esEstacion?0:lugar.circuito==='historico'?0:1,
    cierre:esEstacion?'¡Exacto! La estación está vinculada con la historia ferroviaria.':'¡Bien! Identificaste el recorrido correspondiente.'
  };
  if(tipo==='detective') return {
    introduccion:'Buscá información en la ficha del lugar. No hace falta que arriesgues tu seguridad para observar nada.',
    pregunta:esEstacion?'¿Cuál de estos lugares figura como espacio cultural en el folleto?':`¿Qué dato del folleto es correcto sobre «${lugar.nombre}»?`,
    opciones:esEstacion?['Museo de la Estación','Puerto de Sierras Bayas','Aeropuerto de Sierras Bayas']:[`Está en el Circuito ${nombreCircuito(lugar.circuito)}`,'Es una terminal aérea','No figura en el folleto'],
    correcta:0,
    cierre:'¡Buena observación! Aprender a reconocer los lugares también es parte de la aventura.'
  };
  return {
    introduccion:'Uní las pistas para reconstruir la información de este lugar.',
    pregunta:esEstacion?'Completá: Museo de la ___ — Circuito ___.':`Completá: «${lugar.nombre}» pertenece al circuito...`,
    opciones:esEstacion?['Estación — Histórico','Piedra — Aventura','Costa — Histórico']:[`Circuito ${nombreCircuito(lugar.circuito)}`,'Circuito marítimo','Circuito inexistente'],
    correcta:0,
    cierre:'¡Reconstrucción completada! Sumaste una pieza a tu pasaporte.'
  };
};

export default function Home(){
 const [vista,setVista]=useState<Vista>('bienvenida');
 const [lugar,setLugar]=useState<Punto>(estacion);
 const [modo,setModo]=useState<Modo>('tesoro');
 const [respuesta,setRespuesta]=useState<number|null>(null);
 const [paso,setPaso]=useState(0);
 const [hechos,setHechos]=useState<string[]>([]);
 const [cargado,setCargado]=useState(false);
 const [menu,setMenu]=useState(false);
 const [buscar,setBuscar]=useState('');
 const [filtro,setFiltro]=useState<'todos'|Circuito>('todos');
 const [voz,setVoz]=useState(false);
 const [revelado,setRevelado]=useState(false);
 useEffect(()=>{
  try { const prev=JSON.parse(localStorage.getItem(CLAVE)||'[]'); if(Array.isArray(prev)) setHechos(prev.filter((x):x is string=>typeof x==='string')); }catch{}
  const parametro=new URLSearchParams(window.location.search).get('lugar');
  const encontrado=puntos.find(p=>p.id===parametro);
  if(encontrado)setLugar(encontrado);
  setCargado(true);
 },[]);
 useEffect(()=>{if(cargado)localStorage.setItem(CLAVE,JSON.stringify(hechos));},[hechos,cargado]);
 useEffect(()=>()=>{if(typeof window!=='undefined'&&'speechSynthesis' in window)window.speechSynthesis.cancel();},[]);
 const datos=useMemo(()=>opcionesModo(modo,lugar),[modo,lugar]);
 const llave=`${lugar.id}:${modo}`;
 const realizado=hechos.includes(llave);
 const puntosTotales=hechos.length*50;
 const cromos=[...new Set(hechos.map(h=>h.split(':')[0]))];
 const textoPersonaje=`¡Hola! Bienvenido a ${lugar.nombre}. Este lugar figura en el Circuito ${nombreCircuito(lugar.circuito)} de Sierras Bayas. Tengo un desafío para vos. Podés elegir cómo jugar, resolverlo y conseguir un sello para tu pasaporte. ¿Te animás?`;
 function detenerVoz(){if('speechSynthesis' in window)window.speechSynthesis.cancel();setVoz(false);}
 function hablar(){if(!('speechSynthesis' in window))return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(textoPersonaje);u.lang='es-AR';u.rate=.97;u.onend=()=>setVoz(false);u.onerror=()=>setVoz(false);window.speechSynthesis.speak(u);setVoz(true);}
 function navegar(v:Vista){detenerVoz();setMenu(false);setVista(v);setRespuesta(null);setPaso(0);setRevelado(false);window.scrollTo({top:0,behavior:'smooth'});}
 function iniciar(m:Modo){setModo(m);setRespuesta(null);setPaso(0);setRevelado(false);navegar('juego');}
 function terminar(){if(!hechos.includes(llave))setHechos(p=>[...p,llave]);navegar('final');}
 function elegirLugar(p:Punto){setLugar(p);navegar('bienvenida');if(typeof window!=='undefined')window.history.replaceState(null,'',`?lugar=${encodeURIComponent(p.id)}`);}
 const visibles=puntos.filter(p=>(filtro==='todos'||p.circuito===filtro)&&p.nombre.toLowerCase().includes(buscar.toLowerCase()));
 return <div className="sb-app">
  <header className="sb-header"><button className="sb-logo" onClick={()=>navegar('bienvenida')} aria-label="Volver al inicio"><strong>Sierras Bayas</strong><span>SE DISFRUTA MÁS</span></button><div className="sb-header-actions"><span className="sb-score"><Star size={16} fill="currentColor"/> {puntosTotales}</span><button className="sb-menu-btn" onClick={()=>setMenu(!menu)} aria-label="Abrir menú">{menu?<X/>:<Menu/>}</button></div></header>
  {menu&&<div className="sb-dropdown">{([{v:'zona',t:'Elegir juego',i:Compass},{v:'lugares',t:'Todas las aventuras',i:MapPin},{v:'album',t:'Mi pasaporte',i:Layers},{v:'eventos',t:'Eventos',i:CalendarDays},{v:'turismo',t:'Información turística',i:Info}] as const).map(x=><button key={x.v} onClick={()=>navegar(x.v)}><x.i size={19}/>{x.t}<ChevronRight size={17}/></button>)}</div>}
  <main className={'sb-main sb-'+vista}>
  {vista==='bienvenida'&&<section className="sb-welcome"><div className="sb-welcome-orbit"><span className="sb-orbit-a"><TrainFront/></span><span className="sb-orbit-b"><Mountain/></span><span className="sb-orbit-c"><Star/></span><div className="sb-mascot"><Compass size={77} strokeWidth={1.5}/><span>¡HOLA!</span></div></div><div className="sb-kicker white">UNA AVENTURA EN EL LUGAR REAL</div><h1>¡Bienvenido a<br/>Sierras Bayas!</h1><p>Hay historias por descubrir. Vos elegís cómo jugar.</p><button className="sb-cta light" onClick={()=>navegar('zona')}>Entrar a la aventura <ArrowRight/></button><button className="sb-link-light" onClick={()=>navegar('turismo')}>Solo quiero conocer Sierras Bayas</button><small className="sb-welcome-note">La voz del personaje se activará únicamente cuando toques «Escuchar».</small></section>}
  {vista==='zona'&&<><section className="sb-character"><div className="sb-personaje"><Compass size={58}/><span>TU ANFITRIÓN</span></div><div className="sb-dialog"><div className="sb-kicker">BIENVENIDO A TU AVENTURA</div><h1>¡Hola, explorador!</h1><p>{textoPersonaje}</p><div className="sb-voice-actions"><button onClick={voz?detenerVoz:hablar}>{voz?<VolumeX size={18}/>:<Volume2 size={18}/>} {voz?'Detener voz':'Escuchar saludo'}</button><span>La voz es opcional · Texto disponible</span></div></div></section><div className="sb-location-strip"><MapPin size={20}/><span><strong>Tu escenario: {lugar.nombre}</strong><small>Circuito {nombreCircuito(lugar.circuito)} · Seleccionado por QR o manualmente</small></span><button onClick={()=>navegar('lugares')}>Cambiar</button></div><div className="sb-section-title"><div className="sb-kicker">TU PRÓXIMO DESAFÍO</div><h2>¿Qué querés jugar?</h2><p>Elegí una modalidad. Cada desafío tiene un final y suma a tu colección.</p></div><div className="sb-modes">{MODOS.map(m=><button key={m.id} className={'sb-mode '+m.tono} onClick={()=>iniciar(m.id)}><span className="sb-mode-icon"><m.icono size={32}/></span><span className="sb-mode-copy"><strong>{m.titulo}</strong><small>{m.sub}</small><em>{m.duracion} · {hechos.includes(`${lugar.id}:${m.id}`)?'Completado':'Disponible'}</em></span><ChevronRight size={22}/></button>)}</div><div className="sb-secondary"><button onClick={()=>navegar('lugares')}><MapPin/> Otras aventuras</button><button onClick={()=>navegar('album')}><Layers/> Mi pasaporte</button></div></>}
  {vista==='juego'&&<><button className="sb-back" onClick={()=>navegar('zona')}><ArrowLeft size={18}/> Volver a los juegos</button><div className="sb-play-head"><span className="sb-kicker">{lugar.nombre.toUpperCase()}</span><h1>{MODOS.find(m=>m.id===modo)?.titulo}</h1><div className="sb-progress"><span className={paso>=0?'filled':''}/><span className={paso>=1?'filled':''}/><span className={paso>=2?'filled':''}/></div><p>Etapa {Math.min(paso+1,3)} de 3</p></div><div className="sb-game-panel">{paso===0&&<><div className="sb-game-emblem"><KeyRound size={50}/></div><div className="sb-kicker">TU MISIÓN</div><h2>¿Te animás a descubrirlo?</h2><p>{datos.introduccion}</p><div className="sb-tip"><Info size={20}/><span>Esta primera versión utiliza información comprobable del folleto. Las pistas de observación presencial se incorporarán tras verificar cada sitio.</span></div><button className="sb-cta" onClick={()=>setPaso(1)}>Comenzar desafío <ArrowRight/></button></>}
  {paso===1&&<><div className="sb-game-emblem"><CircleHelp size={49}/></div><div className="sb-kicker">RESOLVÉ LA PISTA</div><h2>{datos.pregunta}</h2><div className="sb-answers">{datos.opciones.map((x,i)=><button key={x} className={'sb-answer '+(respuesta===i?'chosen':'')} onClick={()=>setRespuesta(i)}><span>{String.fromCharCode(65+i)}</span>{x}{respuesta===i&&<Check size={19}/>}</button>)}</div>{respuesta!==null&&<p className={'sb-feedback '+(respuesta===datos.correcta?'ok':'bad')}>{respuesta===datos.correcta?'¡Correcto! Encontraste la pista.':'Todavía no. Podés intentarlo otra vez.'}</p>}<button className="sb-cta" disabled={respuesta!==datos.correcta} onClick={()=>setPaso(2)}>Continuar <ArrowRight/></button></>}
  {paso===2&&<><div className="sb-game-emblem success"><CheckCircle2 size={55}/></div><div className="sb-kicker">PISTA RESUELTA</div><h2>¡Descubrimiento logrado!</h2><p>{datos.cierre}</p><p>Ahora podés registrar tu sello en el pasaporte de Sierras Bayas.</p><button className="sb-cta" onClick={terminar}>Obtener recompensa <Award/></button></>}</div></>}
  {vista==='final'&&<section className="sb-win"><div className="sb-kicker">MISIÓN COMPLETADA</div><h1>¡Lo lograste!</h1><p>Terminaste tu desafío en <strong>{lugar.nombre}</strong>.</p><div className="sb-stamp"><span>SIERRAS BAYAS</span><Award size={83}/><strong>{lugar.codigo}</strong><small>SELLO DEL LUGAR</small></div><h2>{realizado?'¡Nuevo hallazgo para tu colección!':'¡Ya tenías este sello!'}</h2><p>Los sellos se conservan. Cada modalidad superada suma 50 puntos de prueba, una sola vez.</p><div className="sb-win-actions"><button className="sb-cta" onClick={()=>navegar('zona')}>Jugar otra modalidad <ArrowRight/></button><button className="sb-outline" onClick={()=>navegar('album')}>Ver mi pasaporte</button><button className="sb-textlink" onClick={()=>navegar('lugares')}>Descubrir otras aventuras</button></div></section>}
  {vista==='lugares'&&<><button className="sb-back" onClick={()=>navegar('zona')}><ArrowLeft size={18}/> Volver</button><div className="sb-section-title"><div className="sb-kicker">UN TERRITORIO, MUCHAS HISTORIAS</div><h1>Elegí dónde jugar</h1><p>Paradas con nombres y circuitos del folleto de Sierras Bayas. Su posición exacta todavía no está verificada con GPS.</p></div><div className="sb-filterbar"><button className={filtro==='todos'?'active':''} onClick={()=>setFiltro('todos')}>Todos (26)</button><button className={filtro==='historico'?'active':''} onClick={()=>setFiltro('historico')}>Histórico (16)</button><button className={filtro==='aventura'?'active':''} onClick={()=>setFiltro('aventura')}>Aventura (10)</button></div><div className="sb-search"><Search size={19}/><input placeholder="Buscar un lugar..." value={buscar} onChange={e=>setBuscar(e.target.value)}/></div><div className="sb-place-list">{visibles.map(p=><button key={p.id} onClick={()=>elegirLugar(p)}><span className={'sb-place-tag '+p.circuito}>{p.codigo}</span><span><strong>{p.nombre}</strong><small>Circuito {nombreCircuito(p.circuito)} · {hechos.some(x=>x.startsWith(p.id+':'))?'Con sello':'Por descubrir'}</small></span><ChevronRight size={19}/></button>)}</div><div className="sb-tip"><ShieldCheck size={20}/><span>Para GPS y navegación real incorporaremos una base cartográfica verificada. Por ahora no mostramos ubicaciones inventadas.</span></div></>}
  {vista==='album'&&<><button className="sb-back" onClick={()=>navegar('zona')}><ArrowLeft size={18}/> Volver</button><div className="sb-section-title"><div className="sb-kicker">PASAPORTE DIGITAL</div><h1>Mi colección</h1><p>Un lugar, un sello. Podés volver y jugar otras modalidades para sumar puntos.</p></div><div className="sb-album-summary"><Trophy size={40}/><strong>{cromos.length} / 26</strong><span>sellos descubiertos</span><b>{puntosTotales} puntos de prueba</b></div><div className="sb-stamp-grid">{puntos.map(p=><button key={p.id} className={'sb-mini-stamp '+(cromos.includes(p.id)?'won':'locked')} onClick={()=>elegirLugar(p)}><span>{cromos.includes(p.id)?<Award size={33}/>:<span>?</span>}</span><strong>{cromos.includes(p.id)?p.nombre:'Por descubrir'}</strong><small>{p.codigo} · {nombreCircuito(p.circuito)}</small></button>)}</div><div className="sb-tip"><Gift size={21}/><span>Los puntos y premios son demostrativos. Un futuro canje real requerirá cuenta de usuario, confirmación desde el servidor y control de entregas.</span></div></>}
  {vista==='eventos'&&<><button className="sb-back" onClick={()=>navegar('zona')}><ArrowLeft size={18}/> Volver</button><div className="sb-section-title"><div className="sb-kicker">EXPERIENCIAS QUE CAMBIAN</div><h1>Eventos especiales</h1><p>Más adelante se activarán desafíos temporales en fechas y actividades confirmadas.</p></div><div className="sb-empty"><CalendarDays size={48}/><h2>Próximas activaciones</h2><p>No hay eventos cargados todavía. No mostraremos fechas ni premios sin confirmación.</p></div></>}
  {vista==='turismo'&&<><button className="sb-back" onClick={()=>navegar('zona')}><ArrowLeft size={18}/> Volver</button><div className="sb-section-title"><div className="sb-kicker">TAMBIÉN TE ACOMPAÑAMOS</div><h1>Conocé Sierras Bayas</h1><p>Información complementaria de la localidad, según el folleto suministrado.</p></div><h2 className="sb-small-title">Espacios culturales</h2><div className="sb-tour-list">{culturales.map(x=><div key={x}><BookOpen size={20}/><strong>{x}</strong></div>)}</div><h2 className="sb-small-title">Servicios</h2><div className="sb-tour-list">{servicios.map(x=><div key={x.nombre}><MapPin size={20}/><span><strong>{x.nombre}</strong><small>{x.dato}</small></span></div>)}</div><div className="sb-tip"><Info size={20}/><span>Los datos provienen del folleto aportado. Horarios, direcciones, servicios y teléfonos requieren verificación antes del lanzamiento público.</span></div></>}
  </main>
  {vista!=='bienvenida'&&<nav className="sb-bottom" aria-label="Secciones"><button className={vista==='zona'||vista==='juego'?'active':''} onClick={()=>navegar('zona')}><Compass/><span>Jugar</span></button><button className={vista==='lugares'?'active':''} onClick={()=>navegar('lugares')}><MapPin/><span>Lugares</span></button><button className={vista==='album'||vista==='final'?'active':''} onClick={()=>navegar('album')}><Layers/><span>Álbum</span></button><button className={vista==='eventos'?'active':''} onClick={()=>navegar('eventos')}><CalendarDays/><span>Eventos</span></button><button className={vista==='turismo'?'active':''} onClick={()=>navegar('turismo')}><Info/><span>Turismo</span></button></nav>}
 </div>;
}
