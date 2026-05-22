const WM = (file) => `https://commons.wikimedia.org/w/index.php?title=Special:FilePath/${encodeURIComponent(file)}&width=200`

export const SIGN_CATEGORIES = [
  { id: 'all', label: 'Todas', color: '#ffffff' },
  { id: 'reglamentaria', label: 'Reglamentarias', color: '#ff5252' },
  { id: 'preventiva', label: 'Preventivas', color: '#ffd740' },
  { id: 'informativa', label: 'Informativas', color: '#448aff' },
  { id: 'transitoria', label: 'Transitorias', color: '#ff9100' },
]

export const SIGNS_DB = [
  // ═══════════════════════════════════════════════════════════════════
  // REGLAMENTARIAS
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'r1', name: 'Pare', code: 'SR-01',
    desc: 'Detención completa obligatoria antes de cruzar la intersección. No es negociable.',
    detail: 'Debe detener el vehículo completamente antes de la línea de parada. Incluso si no hay tráfico, la detención es obligatoria.',
    cat: 'reglamentaria',
    img: WM('Colombia_road_sign_SR-01.svg')
  },
  {
    id: 'r2', name: 'Ceda el paso', code: 'SR-02',
    desc: 'Reduce la velocidad y cede el paso a los vehículos de la vía principal.',
    detail: 'Si es necesario, deténgase completamente. La prioridad la tienen los vehículos que circulan por la vía a la que va a incorporarse.',
    cat: 'reglamentaria',
    img: WM('Colombia_road_sign_SR-02.svg')
  },
  {
    id: 'r3', name: 'Prohibido el paso', code: 'SR-04',
    desc: 'Indica que ningún vehículo debe entrar en la vía o calle.',
    detail: 'Se usa para indicar que la vía es de sentido contrario o está cerrada al tráfico. Ignorarla es infracción gravísima.',
    cat: 'reglamentaria',
    img: WM('Colombia_road_sign_SR-04.svg')
  },
  {
    id: 'r4', name: 'No gire a la izquierda', code: 'SR-06',
    desc: 'Prohíbe a los conductores girar hacia la izquierda.',
    detail: 'Aunque el semáforo esté en verde, si esta señal está presente, el giro a la izquierda está prohibido.',
    cat: 'reglamentaria',
    img: WM('Colombia_road_sign_SR-06.svg')
  },
  {
    id: 'r5', name: 'Velocidad máxima 60 km/h', code: 'SR-30-60',
    desc: 'Límite de velocidad máxima de 60 km/h en esta zona.',
    detail: 'El número indica la velocidad máxima permitida. Aplica a TODOS los carriles y a cualquier hora del día.',
    cat: 'reglamentaria',
    img: WM('Colombia_road_sign_SR-30-60.svg')
  },
  {
    id: 'r6', name: 'Prohibido parquear', code: 'SR-28',
    desc: 'Prohíbe estacionar vehículos en este sector.',
    detail: 'No puede estacionar el vehículo en el área señalizada. La prohibición aplica para estacionamiento, no para detenerse momentáneamente.',
    cat: 'reglamentaria',
    img: WM('Colombia_road_sign_SR-28.svg')
  },
  {
    id: 'r7', name: 'Siga de frente', code: 'SR-03',
    desc: 'Obliga a continuar exclusivamente de frente.',
    detail: 'En la próxima intersección, la única dirección permitida es seguir recto. No puede girar ni a la izquierda ni a la derecha.',
    cat: 'reglamentaria',
    img: WM('Colombia_road_sign_SR-03.svg')
  },
  {
    id: 'r8', name: 'Giro a la derecha obligatorio', code: 'SR-05',
    desc: 'Los conductores deben girar obligatoriamente a la derecha.',
    detail: 'En la próxima intersección, solo puede girar a la derecha. No puede continuar de frente ni girar a la izquierda.',
    cat: 'reglamentaria',
    img: WM('Colombia_road_sign_SR-05.svg')
  },
  {
    id: 'r9', name: 'No adelantar', code: 'SR-26',
    desc: 'Prohíbe adelantar o sobrepasar otros vehículos.',
    detail: 'No puede adelantar en este tramo. Aplica especialmente en curvas, puentes y zonas de poca visibilidad.',
    cat: 'reglamentaria',
    img: WM('Colombia_road_sign_SR-26.svg')
  },
  {
    id: 'r10', name: 'No giro en U', code: 'SR-10',
    desc: 'Prohíbe realizar la maniobra de giro en U.',
    detail: 'No puede dar la vuelta en U en esta intersección o tramo de vía.',
    cat: 'reglamentaria',
    img: WM('Colombia_road_sign_SR-10.svg')
  },
  {
    id: 'r11', name: 'No pitar', code: 'SR-29',
    desc: 'Prohíbe el uso del pito o claxon.',
    detail: 'Zona de silencio. No use la bocina. Común en zonas hospitalarias y residenciales.',
    cat: 'reglamentaria',
    img: WM('Colombia_road_sign_SR-29.svg')
  },
  {
    id: 'r12', name: 'No motos', code: 'SR-23',
    desc: 'Prohíbe la circulación de motocicletas.',
    detail: 'Las motocicletas no pueden circular por esta vía. Busque una ruta alterna.',
    cat: 'reglamentaria',
    img: WM('Colombia_road_sign_SR-23.svg')
  },
  {
    id: 'r13', name: 'No camiones', code: 'SR-18',
    desc: 'Prohíbe la circulación de camiones y vehículos de carga.',
    detail: 'Los vehículos de carga pesada no pueden transitar por esta vía.',
    cat: 'reglamentaria',
    img: WM('Colombia_road_sign_SR-18.svg')
  },
  {
    id: 'r14', name: 'No peatones', code: 'SR-20',
    desc: 'Prohíbe el paso de peatones.',
    detail: 'Los peatones no deben transitar por esta vía. Usualmente en autopistas y túneles.',
    cat: 'reglamentaria',
    img: WM('Colombia_road_sign_SR-20.svg')
  },
  {
    id: 'r15', name: 'Sentido único', code: 'SR-38-R',
    desc: 'Indica una calle de sentido único.',
    detail: 'La vía tiene una sola dirección. No intente ingresar en sentido contrario.',
    cat: 'reglamentaria',
    img: WM('Colombia_road_sign_SR-38-R.svg')
  },
  {
    id: 'r16', name: 'Altura máxima', code: 'SR-32',
    desc: 'Altura máxima permitida del vehículo.',
    detail: 'Su vehículo no debe superar la altura indicada. Común en túneles y pasos inferiores.',
    cat: 'reglamentaria',
    img: WM('Colombia_road_sign_SR-32.svg')
  },
  {
    id: 'r17', name: 'Ancho máximo', code: 'SR-33',
    desc: 'Ancho máximo permitido del vehículo.',
    detail: 'Su vehículo no debe superar el ancho indicado. Común en puentes y estrechamientos.',
    cat: 'reglamentaria',
    img: WM('Colombia_road_sign_SR-33.svg')
  },
  {
    id: 'r18', name: 'Prohibido adelantar (fin)', code: 'SR-48',
    desc: 'Fin de la prohibición de adelantar.',
    detail: 'A partir de esta señal, la prohibición de adelantar termina. Puede adelantar cuando sea seguro.',
    cat: 'reglamentaria',
    img: WM('Colombia_road_sign_SR-48.svg')
  },

  // ═══════════════════════════════════════════════════════════════════
  // PREVENTIVAS
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'p1', name: 'Curva peligrosa derecha', code: 'SP-02',
    desc: 'Avisa sobre una curva pronunciada hacia la derecha.',
    detail: 'Reduzca la velocidad ANTES de entrar a la curva. Frenar dentro de la curva puede hacerle perder el control.',
    cat: 'preventiva',
    img: WM('Colombia_road_sign_SP-02.svg')
  },
  {
    id: 'p2', name: 'Resalto', code: 'SP-25',
    desc: 'Precaución por elevación artificial en la vía.',
    detail: 'Reduzca la velocidad. Hay un reductor de velocidad tipo resalto o policía acostado.',
    cat: 'preventiva',
    img: WM('Colombia_road_sign_SP-25.svg')
  },
  {
    id: 'p3', name: 'Semáforo adelante', code: 'SP-23',
    desc: 'Avisa que se aproxima una intersección semaforizada.',
    detail: 'Prepárese para detenerse. El semáforo puede estar en rojo al llegar.',
    cat: 'preventiva',
    img: WM('Colombia_road_sign_SP-23.svg')
  },
  {
    id: 'p4', name: 'Cruce peatonal', code: 'SP-46A',
    desc: 'Advierte zona de cruce de peatones.',
    detail: 'Los peatones tienen prioridad. Reduzca la velocidad y esté atento.',
    cat: 'preventiva',
    img: WM('Colombia_road_sign_SP-46A.svg')
  },
  {
    id: 'p5', name: 'Zona escolar', code: 'SP-47',
    desc: 'Cercanía a una institución educativa.',
    detail: 'Niños cruzando. Reduzca la velocidad a 30 km/h o menos en horarios de entrada y salida.',
    cat: 'preventiva',
    img: WM('Colombia_road_sign_SP-47.svg')
  },
  {
    id: 'p6', name: 'Animales en la vía', code: 'SP-49',
    desc: 'Peligro por cruce de animales.',
    detail: 'Posible cruce de animales. Reduzca la velocidad, especialmente de noche cuando son casi invisibles.',
    cat: 'preventiva',
    img: WM('Colombia_road_sign_SP-49 (deer).svg')
  },
  {
    id: 'p7', name: 'Intersección en T', code: 'SP-14',
    desc: 'La vía termina en una intersección en T.',
    detail: 'Prepárese para detenerse o ceder el paso. La vía que usted transita no continúa.',
    cat: 'preventiva',
    img: WM('Colombia_road_sign_SP-14.svg')
  },
  {
    id: 'p8', name: 'Vía resbaladiza', code: 'SP-44',
    desc: 'El pavimento puede estar resbaloso.',
    detail: 'Reduzca la velocidad. El asfalto mojado, hielo o aceite reducen la adherencia.',
    cat: 'preventiva',
    img: WM('Colombia_road_sign_SP-44.svg')
  },
  {
    id: 'p9', name: 'Curva pronunciada izquierda', code: 'SP-01',
    desc: 'Curva peligrosa hacia la izquierda.',
    detail: 'Curva con ángulo pronunciado a la izquierda. Reduce antes de llegar.',
    cat: 'preventiva',
    img: WM('Colombia_road_sign_SP-01.svg')
  },
  {
    id: 'p10', name: 'Curva en S', code: 'SP-05',
    desc: 'Curvas consecutivas, primero a la izquierda.',
    detail: 'Viene una serie de curvas. Mantenga una velocidad moderada.',
    cat: 'preventiva',
    img: WM('Colombia_road_sign_SP-05.svg')
  },
  {
    id: 'p11', name: 'Intersección', code: 'SP-11',
    desc: 'Intersección de dos vías.',
    detail: 'Se aproxima un cruce de vías. Puede haber tráfico cruzando desde ambos lados.',
    cat: 'preventiva',
    img: WM('Colombia_road_sign_SP-11.svg')
  },
  {
    id: 'p12', name: 'Glorieta', code: 'SP-20',
    desc: 'Rotonda o glorieta adelante.',
    detail: 'Reduzca la velocidad. Ceda el paso a los vehículos que ya están dentro de la glorieta.',
    cat: 'preventiva',
    img: WM('Colombia_road_sign_SP-20.svg')
  },
  {
    id: 'p13', name: 'Pavimento irregular', code: 'SP-24',
    desc: 'Superficie de la vía en mal estado.',
    detail: 'Vía con baches o irregularidades. Reduzca la velocidad para evitar daños.',
    cat: 'preventiva',
    img: WM('Colombia_road_sign_SP-24.svg')
  },
  {
    id: 'p14', name: 'Dos sentidos', code: 'SP-39',
    desc: 'Vía de dos sentidos adelante.',
    detail: 'La vía cambia a circulación en ambos sentidos. Puede encontrar tráfico de frente.',
    cat: 'preventiva',
    img: WM('Colombia_road_sign_SP-39.svg')
  },
  {
    id: 'p15', name: 'Derrumbe', code: 'SP-42',
    desc: 'Zona propensa a derrumbes o caída de rocas.',
    detail: 'Tenga precaución con posibles desprendimientos. Especial atención en temporada de lluvias.',
    cat: 'preventiva',
    img: WM('Colombia_road_sign_SP-42.svg')
  },
  {
    id: 'p16', name: 'Túnel', code: 'SP-37',
    desc: 'Túnel adelante.',
    detail: 'Se aproxima un túnel. Encienda las luces, quite las gafas de sol y mantenga la distancia de seguridad.',
    cat: 'preventiva',
    img: WM('Colombia_road_sign_SP-37.svg')
  },

  // ═══════════════════════════════════════════════════════════════════
  // INFORMATIVAS
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 'i1', name: 'Hospital', code: 'SI-16',
    desc: 'Proximidad de un centro médico u hospital.',
    detail: 'Indica la cercanía de un centro de atención médica u hospital.',
    cat: 'informativa',
    img: WM('Colombia_road_sign_SI-16.svg')
  },
  {
    id: 'i2', name: 'Gasolinera', code: 'SI-22',
    desc: 'Estación de servicio o gasolinera cerca.',
    detail: 'Indica la ubicación de una estación de combustible.',
    cat: 'informativa',
    img: WM('Colombia_road_sign_SI-22.svg')
  },
  {
    id: 'i3', name: 'Estacionamiento', code: 'SI-07',
    desc: 'Zona de estacionamiento habilitado.',
    detail: 'Lugar destinado oficialmente para estacionar vehículos.',
    cat: 'informativa',
    img: WM('Colombia_road_sign_SI-07.svg')
  },
  {
    id: 'i4', name: 'Restaurante', code: 'SI-18',
    desc: 'Restaurante o servicio de alimentos cerca.',
    detail: 'Indica la proximidad de restaurantes o servicios de alimentación.',
    cat: 'informativa',
    img: WM('Colombia_road_sign_SI-18.svg')
  },
  {
    id: 'i5', name: 'Teléfono', code: 'SI-19',
    desc: 'Teléfono público disponible.',
    detail: 'Indica la ubicación de un teléfono público.',
    cat: 'informativa',
    img: WM('Colombia_road_sign_SI-19.svg')
  },
  {
    id: 'i6', name: 'Aeropuerto', code: 'SI-14',
    desc: 'Aeropuerto o terminal aérea.',
    detail: 'Indica la cercanía de un aeropuerto o terminal aérea.',
    cat: 'informativa',
    img: WM('Colombia_road_sign_SI-14.svg')
  },
  {
    id: 'i7', name: 'Alojamiento', code: 'SI-15',
    desc: 'Hotel u hospedaje disponible.',
    detail: 'Indica la ubicación de hoteles o lugares de alojamiento.',
    cat: 'informativa',
    img: WM('Colombia_road_sign_SI-15.svg')
  },
  {
    id: 'i8', name: 'Parada de bus', code: 'SI-08',
    desc: 'Parada de autobús.',
    detail: 'Indica una parada de transporte público de autobuses.',
    cat: 'informativa',
    img: WM('Colombia_road_sign_SI-08.svg')
  },
  {
    id: 'i9', name: 'Servicios sanitarios', code: 'SI-17',
    desc: 'Baños públicos disponibles.',
    detail: 'Indica la ubicación de servicios sanitarios o baños públicos.',
    cat: 'informativa',
    img: WM('Colombia_road_sign_SI-17.svg')
  },
  {
    id: 'i10', name: 'Taller mecánico', code: 'SI-21',
    desc: 'Servicio de reparación de vehículos.',
    detail: 'Indica la cercanía de un taller de servicio automotriz.',
    cat: 'informativa',
    img: WM('Colombia_road_sign_SI-21.svg')
  },
  {
    id: 'i11', name: 'Iglesia', code: 'SI-20',
    desc: 'Templo o iglesia cercana.',
    detail: 'Indica la ubicación de una iglesia o templo religioso.',
    cat: 'informativa',
    img: WM('Colombia_road_sign_SI-20.svg')
  },
  {
    id: 'i12', name: 'Bicicleta', code: 'SI-11',
    desc: 'Ruta o carril para bicicletas.',
    detail: 'Indica una ruta o carril destinado para ciclistas.',
    cat: 'informativa',
    img: WM('Colombia_road_sign_SI-11.svg')
  },

  // ═══════════════════════════════════════════════════════════════════
  // TRANSITORIAS
  // ═══════════════════════════════════════════════════════════════════
  {
    id: 't1', name: 'Hombres trabajando', code: 'SP-43',
    desc: 'Obras en la vía con trabajadores presentes.',
    detail: 'Reduzca la velocidad. Hay trabajadores en la vía. Siga las instrucciones del personal.',
    cat: 'transitoria',
    img: WM('Colombia_road_sign_SP-43.svg')
  },
  {
    id: 't2', name: 'Estrechamiento', code: 'SP-28',
    desc: 'La calzada se reduce temporalmente.',
    detail: 'Menos carriles disponibles. Reduzca y prepárese para ceder el paso.',
    cat: 'transitoria',
    img: WM('Colombia_road_sign_SP-28.svg')
  },
  {
    id: 't3', name: 'Desvío', code: 'SP-14-O',
    desc: 'Desvío temporal por obras.',
    detail: 'Siga las indicaciones del desvío. Puede haber cambios en la ruta habitual.',
    cat: 'transitoria',
    img: WM('Colombia_road_sign_SP-14-O.svg')
  },
  {
    id: 't4', name: 'Maquinaria en vía', code: 'SP-45',
    desc: 'Maquinaria agrícola o de construcción en la vía.',
    detail: 'Puede encontrar vehículos lentos o maquinaria pesada. Extreme la precaución.',
    cat: 'transitoria',
    img: WM('Colombia_road_sign_SP-45.svg')
  },
]
