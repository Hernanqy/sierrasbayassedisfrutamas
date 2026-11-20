export type Circuito = 'aventura' | 'historico';
export type Punto = { id: string; codigo: string; nombre: string; circuito: Circuito; observacion?: string };
export const puntos: Punto[] = [
  {id:'A',codigo:'A',nombre:'Mirador de Cantera',circuito:'aventura'},
  {id:'B',codigo:'B',nombre:'Cerro Matilde y Parque Matilde Catriel',circuito:'aventura'},
  {id:'C',codigo:'C',nombre:'Mirador del Paseo del Mástil Carlos Medici',circuito:'aventura'},
  {id:'D',codigo:'D',nombre:'Mirador Monte de los Fresnos',circuito:'aventura'},
  {id:'E',codigo:'E',nombre:'Mirador Cerro del Diablo',circuito:'aventura'},
  {id:'F',codigo:'F',nombre:'Paseo Recuperado',circuito:'aventura'},
  {id:'G',codigo:'G',nombre:'Cerro Largo',circuito:'aventura'},
  {id:'H',codigo:'H',nombre:'Boca Sierra',circuito:'aventura'},
  {id:'I',codigo:'I',nombre:'Cerro Aguirre (San Cayetano)',circuito:'aventura'},
  {id:'J',codigo:'J',nombre:'Parque Bicisenda',circuito:'aventura'},
  {id:'1',codigo:'1',nombre:'Museo de la Estación',circuito:'historico'},
  {id:'2',codigo:'2',nombre:'Club San Martín',circuito:'historico'},
  {id:'3',codigo:'3',nombre:'Antiguo Barrio Fábrica',circuito:'historico'},
  {id:'4',codigo:'4',nombre:'Monumento al Primer Despacho de Cemento | Antigua Fábrica de Cemento',circuito:'historico'},
  {id:'5',codigo:'5',nombre:'Iglesia Cristo Rey',circuito:'historico'},
  {id:'6',codigo:'6',nombre:'Monumento Centro del Universo',circuito:'historico',observacion:'Colectividad República Checa'},
  {id:'7',codigo:'7',nombre:'Monumento al Trabajador del Cemento',circuito:'historico'},
  {id:'8',codigo:'8',nombre:'Paraje Huecu Fu Hum',circuito:'historico'},
  {id:'9',codigo:'9',nombre:'Paseo de Las Vagonetas',circuito:'historico'},
  {id:'10',codigo:'10',nombre:'La Calera 1888',circuito:'historico'},
  {id:'11',codigo:'11',nombre:'Antigua Calera La Libertadora',circuito:'historico'},
  {id:'12',codigo:'12',nombre:'Calera Piatti - Mouriño',circuito:'historico'},
  {id:'13',codigo:'13',nombre:'Calera La Victoria',circuito:'historico'},
  {id:'14',codigo:'14',nombre:'Antiguas casas de piedra',circuito:'historico'},
  {id:'15',codigo:'15',nombre:'Réplica Casa Matilde Catriel',circuito:'historico'},
  {id:'16',codigo:'16',nombre:'Boca Sierra',circuito:'historico',observacion:'Primer asentamiento minero en Sierras Bayas'}
];
export const culturales = [
 'Punto Azul Museo', 'Centro Cultural Municipal', 'Taller de Picapedreros y Escultores',
 'Escuela de Cerámica Municipal', 'Museo de la Estación'
];
export const servicios = [
 {nombre:'Hospital',dato:'Smirnoff 2363'},
 {nombre:'Policía',dato:'Av. San Martín 2160'},
 {nombre:'Bomberos',dato:'Emergencias: 100'},
 {nombre:'Oficina de información turística',dato:'Rivadavia casi Colombo'},
 {nombre:'Estación de servicio',dato:'Smirnoff y Av. Centenario'},
 {nombre:'Banco',dato:'Smirnoff y Zeballos'},
 {nombre:'Delegación Municipal',dato:'Av. San Martín 1696'}
];
export const retos = [
 { q:'¿A cuál de los recorridos oficiales corresponde este lugar?', respuestas:['Circuito Aventura','Circuito Histórico'], correcta:0 },
 { q:'¿A cuál de los recorridos oficiales corresponde este lugar?', respuestas:['Circuito Aventura','Circuito Histórico'], correcta:1 }
];
