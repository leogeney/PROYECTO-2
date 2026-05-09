export const SIGN_CATEGORIES = [
  { id: 'all', label: 'Todas las Señales', color: '#ffffff' },
  { id: 'reglamentaria', label: 'Reglamentarias', color: '#ff5252' }, // Rojo
  { id: 'preventiva', label: 'Preventivas', color: '#ffd740' },  // Amarillo
  { id: 'informativa', label: 'Informativas', color: '#448aff' }, // Azul
  { id: 'transitoria', label: 'Transitorias', color: '#ff9100' }, // Naranja
]

export const SIGNS_DB = [
  // REGLAMENTARIAS
  {
    id: 'r1',
    name: 'Pare',
    desc: 'Detención completa obligatoria antes de cruzar la intersección.',
    cat: 'reglamentaria',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdhDvmzUwVjen0McmZcowaHuVommCOixXKpw&s'
  },
  {
    id: 'r2',
    name: 'Ceda el paso',
    desc: 'Reducir la velocidad y ceder el paso a los vehículos de la vía principal.',
    cat: 'reglamentaria',
    img: 'https://jopavisos.com/wp-content/uploads/2021/04/Transito-rojas2-02.png'
  },
  {
    id: 'r3',
    name: 'Prohibido el paso',
    desc: 'Indica que ningún vehículo debe entrar en la vía o calle.',
    cat: 'reglamentaria',
    img: 'https://static.vecteezy.com/system/resources/thumbnails/008/506/476/small/no-entry-for-people-non-staff-icon-free-png.png'
  },
  {
    id: 'r4',
    name: 'No gire a la izquierda',
    desc: 'Prohíbe a los conductores efectuar un giro hacia la izquierda.',
    cat: 'reglamentaria',
    img: 'https://jopavisos.com/wp-content/uploads/2021/04/Transito-rojas2-06.png'
  },
  {
    id: 'r5',
    name: 'Velocidad Máxima (60 km/h)',
    desc: 'Límite de velocidad máxima permitido en esta zona.',
    cat: 'reglamentaria',
    img: 'https://jopavisos.com/wp-content/uploads/2021/04/Transito-rojas-08.png'
  },
  {
    id: 'r6',
    name: 'Prohibido Parquear',
    desc: 'Prohíbe estrictamente estacionar vehículos en esa pared o borde.',
    cat: 'reglamentaria',
    img: 'https://jopavisos.com/wp-content/uploads/2021/04/Transito-rojas-03.png'
  },
  {
    id: 'r7',
    name: 'Solo Dirección Recta',
    desc: 'Obliga a continuar exclusivamente de frente.',
    cat: 'reglamentaria',
    img: 'https://www.shutterstock.com/image-vector/one-way-traffic-road-sign-260nw-2666554741.jpg'
  },
  {
    id: 'r8',
    name: 'Giro a la derecha obligatorio',
    desc: 'Los conductores deben girar obligatoriamente a la derecha.',
    cat: 'reglamentaria',
    img: 'https://lh6.googleusercontent.com/proxy/D5KE-bamIXJSn1L_G8E3A0MIjaI79c16lMGBfyaH7T8CFUT2_L7BBEFp0-BrzKqR2AP34XCv1-Z8slr1RAddlPNbNkQnzykbCyFdFxK-J_dDQMz-osZY'
  },

  // PREVENTIVAS
  {
    id: 'p1',
    name: 'Curva peligrosa a la derecha',
    desc: 'Avisa sobre una fuerte curva próxima hacia el lado derecho.',
    cat: 'preventiva',
    img: 'https://assets.entornovial.com/senales/3a325530-8707-45bc-be17-e2f7e72eff6e/512x512.webp'
  },
  {
    id: 'p2',
    name: 'Resalto o Policía acostado',
    desc: 'Precaución por elevaciones artificiales (reductores de velocidad).',
    cat: 'preventiva',
    img: 'https://assets.entornovial.com/senales/3799ed3a-4612-419b-8827-750bd634617f/512x512.webp'
  },
  {
    id: 'p3',
    name: 'Semáforo adelante',
    desc: 'Aviso previo de que te aproximas a una intersección semaforizada.',
    cat: 'preventiva',
    img: 'https://us.123rf.com/450wm/geargodz/geargodz1207/geargodz120700336/14660596-traffic-light-ahead-warning-sign-on-white-background.jpg'
  },
  {
    id: 'p4',
    name: 'Cruce peatonal',
    desc: 'Advierte zona de alto riesgo por pase de peatones.',
    cat: 'preventiva',
    img: 'https://media.istockphoto.com/id/1346521181/es/vector/cruce-peatonal-se%C3%B1al-de-tr%C3%A1fico-ilustraci%C3%B3n-vectorial.jpg?s=612x612&w=0&k=20&c=SPgsgkrUbYsTLlQPRGctw4Y2ApFBp8U7Qk8qY46kUqE='
  },
  {
    id: 'p5',
    name: 'Zona de Escolares',
    desc: 'Cercanía a una escuela y paso frecuente de niños.',
    cat: 'preventiva',
    img: 'https://jopavisos.com/wp-content/uploads/2021/04/Transito-amarillas-2-14.png'
  },
  {
    id: 'p6',
    name: 'Animales en la vía',
    desc: 'Peligro por posible cruce de animales salvajes o silvestres.',
    cat: 'preventiva',
    img: 'https://jopavisos.com/wp-content/uploads/2021/04/Transito-amarillas-2-18.png'
  },
  {
    id: 'p7',
    name: 'Intersección en T',
    desc: 'La vía en que se transita termina pronto y se cruza con otra principal.',
    cat: 'preventiva',
    img: 'https://jopavisos.com/wp-content/uploads/2021/04/Transito-amarillas-14.png'
  },
  {
    id: 'p8',
    name: 'Vía resbaladiza',
    desc: 'El asfalto tiende a ponerse resbaloso, especialmente lloviendo.',
    cat: 'preventiva',
    img: 'https://www.shutterstock.com/image-vector/slippery-road-wet-roadtraffic-sign-260nw-2425439275.jpg'
  },

  // INFORMATIVAS
  {
    id: 'i1',
    name: 'Hospital / Primeros Auxilios',
    desc: 'Informa la proximidad de un centro médico o de salud.',
    cat: 'informativa',
    img: 'https://i.pinimg.com/236x/5a/f6/1a/5af61a8e7e8c9a38a49ac3a79c4f22c8.jpg'
  },
  {
    id: 'i2',
    name: 'Puesto de Combustible',
    desc: 'Cercanía de una gasolinera o estación de servicio.',
    cat: 'informativa',
    img: 'https://www.shutterstock.com/image-vector/gas-station-sign-service-signs-260nw-2230594665.jpg'
  },
  {
    id: 'i3',
    name: 'Estacionamiento habilitado',
    desc: 'Lugar destinado de manera oficial para que se parqueen vehículos.',
    cat: 'informativa',
    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Brasil_R-6b.svg/250px-Brasil_R-6b.svg.png'
  },
  {
    id: 'i4',
    name: 'Restaurante / Alimentos',
    desc: 'Indica la cercanía de restaurantes o servicios de alimentación al lado de las autopistas.',
    cat: 'informativa',
    img: 'https://media.falabella.com/sodimacCO/508183_1/w=1500,h=1500,fit=coversvg'
  },

  // TRANSITORIAS
  {
    id: 't1',
    name: 'Hombres trabajando',
    desc: 'Por obras en la vía, hay trabajadores cerca y maquinaria, debe reducir con precaución.',
    cat: 'transitoria',
    img: 'http://img.magnific.com/vector-gratis/senal-trafico-mantenimiento_1063-51.jpg'
  },
  {
    id: 't2',
    name: 'Estrechamiento de calzada temporal',
    desc: 'Menos carriles habilitados por reparaciones temporales en la calle.',
    cat: 'transitoria',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTd_Fh0vxcBCJngLaHtjpghG-xaocWIGgYyRg&s'
  }
]
