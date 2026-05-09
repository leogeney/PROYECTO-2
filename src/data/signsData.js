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
    img: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Vienna_Convention_sign_C14.svg'
  },
  {
    id: 'r6',
    name: 'Prohibido Estacionar',
    desc: 'Prohíbe estrictamente estacionar vehículos en esa pared o borde.',
    cat: 'reglamentaria',
    img: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Vienna_Convention_sign_C18.svg'
  },
  {
    id: 'r7',
    name: 'Solo Dirección Recta',
    desc: 'Obliga a continuar exclusivamente de frente.',
    cat: 'reglamentaria',
    img: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Vienna_Convention_sign_D1a.svg'
  },
  {
    id: 'r8',
    name: 'Giro a la derecha obligatorio',
    desc: 'Los conductores deben girar obligatoriamente a la derecha.',
    cat: 'reglamentaria',
    img: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Vienna_Convention_sign_D1b.svg'
  },

  // PREVENTIVAS
  {
    id: 'p1',
    name: 'Curva peligrosa a la derecha',
    desc: 'Avisa sobre una fuerte curva próxima hacia el lado derecho.',
    cat: 'preventiva',
    img: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Vienna_Convention_sign_A1b.svg'
  },
  {
    id: 'p2',
    name: 'Resalto o Policía acostado',
    desc: 'Precaución por elevaciones artificiales (reductores de velocidad).',
    cat: 'preventiva',
    img: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Vienna_Convention_sign_A7b.svg'
  },
  {
    id: 'p3',
    name: 'Semáforo adelante',
    desc: 'Aviso previo de que te aproximas a una intersección semaforizada.',
    cat: 'preventiva',
    img: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Vienna_Convention_sign_A16.svg'
  },
  {
    id: 'p4',
    name: 'Cruce peatonal',
    desc: 'Advierte zona de alto riesgo por pase de peatones.',
    cat: 'preventiva',
    img: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Vienna_Convention_sign_A12a.svg'
  },
  {
    id: 'p5',
    name: 'Zona de Escolares',
    desc: 'Cercanía a una escuela y paso frecuente de niños.',
    cat: 'preventiva',
    img: 'https://upload.wikimedia.org/wikipedia/commons/1/14/Vienna_Convention_sign_A13.svg'
  },
  {
    id: 'p6',
    name: 'Animales en la vía',
    desc: 'Peligro por posible cruce de animales salvajes o silvestres.',
    cat: 'preventiva',
    img: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Vienna_Convention_sign_A15a.svg'
  },
  {
    id: 'p7',
    name: 'Intersección en T',
    desc: 'La vía en que se transita termina pronto y se cruza con otra principal.',
    cat: 'preventiva',
    img: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Brazil_warning_sign_A-2b.svg'
  },
  {
    id: 'p8',
    name: 'Vía resbaladiza',
    desc: 'El asfalto tiende a ponerse resbaloso, especialmente lloviendo.',
    cat: 'preventiva',
    img: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Vienna_Convention_sign_A9.svg'
  },

  // INFORMATIVAS
  {
    id: 'i1',
    name: 'Hospital / Primeros Auxilios',
    desc: 'Informa la proximidad de un centro médico o de salud.',
    cat: 'informativa',
    img: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Vienna_Convention_sign_F1a.svg'
  },
  {
    id: 'i2',
    name: 'Puesto de Combustible',
    desc: 'Cercanía de una gasolinera o estación de servicio.',
    cat: 'informativa',
    img: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Vienna_Convention_sign_F4.svg'
  },
  {
    id: 'i3',
    name: 'Estacionamiento habilitado',
    desc: 'Lugar destinado de manera oficial para que se parqueen vehículos.',
    cat: 'informativa',
    img: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Vienna_Convention_sign_E14a.svg'
  },
  {
    id: 'i4',
    name: 'Restaurante / Alimentos',
    desc: 'Indica la cercanía de restaurantes o servicios de alimentación al lado de las autopistas.',
    cat: 'informativa',
    img: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Vienna_Convention_sign_F6.svg'
  },

  // TRANSITORIAS
  {
    id: 't1',
    name: 'Hombres trabajando',
    desc: 'Por obras en la vía, hay trabajadores cerca y maquinaria, debe reducir con precaución.',
    cat: 'transitoria',
    img: 'https://upload.wikimedia.org/wikipedia/commons/d/da/Vienna_Convention_sign_A16_%28yellow%29.svg' // Warning sign workers
  },
  {
    id: 't2',
    name: 'Estrechamiento de calzada temporal',
    desc: 'Menos carriles habilitados por reparaciones temporales en la calle.',
    cat: 'transitoria',
    img: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Vienna_Convention_sign_A4a_%28yellow%29.svg'
  }
]
