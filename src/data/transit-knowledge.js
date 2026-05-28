const knowledgeBase = [
  {
    question: '¿Qué significa una señal de alto?',
    keywords: ['alto', 'señal', 'pare', 'stop', 'octagonal', 'roja'],
    answer: 'La señal de ALTO (stop) es octagonal y de color rojo. Indica que debes detenerte completamente antes de la línea de parada, ceder el paso a vehículos y peatones, y continuar solo cuando sea seguro.'
  },
  {
    question: '¿Qué significa el semáforo en rojo?',
    keywords: ['semáforo', 'rojo', 'luz roja', 'detenerse', 'parar'],
    answer: 'La luz roja del semáforo significa ALTO TOTAL. Debes detenerte completamente antes de la línea de parada. No debes avanzar hasta que la luz cambie a verde.'
  },
  {
    question: '¿Qué significa el semáforo en amarillo?',
    keywords: ['semáforo', 'amarillo', 'luz amarilla', 'precaución', 'precaucion'],
    answer: 'La luz amarilla del semáforo indica PRECAUCIÓN. Te advierte que la luz cambiará a rojo. Si te aproximas, debes prepararte para detenerte. No aceleres para cruzar.'
  },
  {
    question: '¿Qué significa el semáforo en verde?',
    keywords: ['semáforo', 'verde', 'luz verde', 'avanzar', 'seguir'],
    answer: 'La luz verde del semáforo significa que puedes AVANZAR. Pero siempre debes verificar que no haya vehículos o peatones cruzando antes de continuar.'
  },
  {
    question: '¿Cómo cruzar la calle correctamente?',
    keywords: ['cruzar', 'calle', 'peatón', 'peatonal', 'cruzar la calle', 'paso'],
    answer: 'Para cruzar la calle correctamente: 1) Mira a ambos lados (izquierda, derecha e izquierda de nuevo). 2) Cruza por el paso de cebra o esquina. 3) Espera el semáforo peatonal en verde. 4) No corras ni juegues al cruzar. 5) Mantén contacto visual con los conductores.'
  },
  {
    question: '¿Qué es un paso de cebra?',
    keywords: ['paso de cebra', 'cebra', 'paso peatonal', 'rayas', 'crucero peatonal'],
    answer: 'El paso de cebra es una zona marcada con rayas blancas en el suelo que indica dónde los peatones tienen prioridad para cruzar. Los conductores deben detenerse si hay peatones cruzando.'
  },
  {
    question: '¿Qué significa una señal de ceda el paso?',
    keywords: ['ceda', 'paso', 'triangular', 'invertido', 'triángulo invertido', 'rend'],
    answer: 'La señal de CEDA EL PASO tiene forma de triángulo invertido con borde rojo. Indica que debes reducir la velocidad y ceder el paso a los vehículos que circulan por la vía principal. Puedes continuar si no hay vehículos aproximándose.'
  },
  {
    question: '¿Qué significa una señal de prohibido estacionar?',
    keywords: ['prohibido', 'estacionar', 'aparcar', 'no estacionar', 'E tachada'],
    answer: 'La señal de PROHIBIDO ESTACIONAR es un círculo rojo con una línea diagonal sobre la letra E. Significa que no puedes estacionar tu vehículo en esa zona. Algunas variantes indican días u horarios específicos.'
  },
  {
    question: '¿Qué significa la señal de límite de velocidad?',
    keywords: ['límite', 'velocidad', 'máxima', 'rapidez', 'km/h', 'límite de velocidad'],
    answer: 'La señal de LÍMITE DE VELOCIDAD es un círculo blanco con borde rojo que muestra un número (ej: 50). Ese número es la velocidad máxima permitida en km/h. Debes respetarla para evitar multas y accidentes.'
  },
  {
    question: '¿Cómo se usa el cinturón de seguridad?',
    keywords: ['cinturón', 'seguridad', 'cinturón de seguridad', 'abrochar', 'auto'],
    answer: 'El cinturón de seguridad debe usarse SIEMPRE al viajar en un vehículo. Debe pasar sobre el hombro, cruzando el pecho, y ajustarse en la cadera, nunca en el estómago. Todos los ocupantes deben usarlo, incluidos los asientos traseros.'
  },
  {
    question: '¿Qué significan los colores de las señales de tránsito?',
    keywords: ['colores', 'señales', 'tránsito', 'tráfico', 'significado colores', 'rojo', 'azul', 'verde', 'amarillo'],
    answer: 'Los colores de las señales de tránsito tienen significado: ROJO = prohibición o peligro. AMARILLO = advertencia o precaución. VERDE = información o dirección. AZUL = servicios o indicaciones. BLANCO = regulación. NARANJA = construcción o desvío.'
  },
  {
    question: '¿Qué es un peatón?',
    keywords: ['peatón', 'peatones', 'persona caminando', 'a pie'],
    answer: 'Un peatón es toda persona que camina por la vía pública. Los peatones tienen derechos y obligaciones: deben cruzar por las esquinas o pasos peatonales, respetar los semáforos y usar las aceras.'
  },
  {
    question: '¿Qué significa una señal de zona escolar?',
    keywords: ['escolar', 'zona escolar', 'escuela', 'niños', 'estudiantes', 'colegio'],
    answer: 'La señal de ZONA ESCOLAR advierte que hay una escuela cerca. Debes reducir la velocidad, estar atento a niños cruzando la calle y seguir las indicaciones de los cruces escolares. Generalmente hay un límite de velocidad reducido.'
  },
  {
    question: '¿Qué hacer si un semáforo no funciona?',
    keywords: ['semáforo', 'dañado', 'no funciona', 'apagado', 'sin luz', 'falla'],
    answer: 'Si un semáforo no funciona, debes tratar la intersección como si hubiera una señal de ALTO en todas las direcciones. Detente completamente, cede el paso a los vehículos que ya están en la intersección y avanza con precaución.'
  },
  {
    question: '¿Qué significa una señal de curva peligrosa?',
    keywords: ['curva', 'peligrosa', 'curva peligrosa', 'camino', 'cerrada'],
    answer: 'La señal de CURVA PELIGROSA es un rombo amarillo con una flecha curva. Advierte que más adelante hay una curva cerrada. Debes reducir la velocidad y mantener el control del vehículo.'
  },
  {
    question: '¿Qué significa la señal de no adelantar?',
    keywords: ['adelantar', 'no adelantar', 'rebasamiento', 'prohibido adelantar', 'doble línea'],
    answer: 'La señal de NO ADELANTAR es un círculo rojo con dos vehículos uno al lado del otro. Indica que está prohibido adelantar a otros vehículos en ese tramo. Generalmente se usa en zonas con poca visibilidad o curvas.'
  },
  {
    question: '¿Qué significa la señal de tránsito de peatones?',
    keywords: ['peatones', 'peatón', 'cruzando', 'personas caminando', 'señal peatonal'],
    answer: 'La señal de TRÁNSITO DE PEATONES es un rombo amarillo con una figura de una persona caminando. Advierte a los conductores que hay peatones cruzando frecuentemente en esa zona. Debes reducir la velocidad y estar atento.'
  },
  {
    question: '¿Qué es un carril de bicicletas?',
    keywords: ['bicicleta', 'bici', 'carril', 'ciclismo', 'ciclovía', 'bicisenda', 'carril bici'],
    answer: 'Un carril de bicicletas (ciclovía) es un espacio exclusivo para bicicletas en la vía pública. Los conductores no deben estacionar ni circular por esos carriles. Los ciclistas deben usarlos cuando estén disponibles.'
  },
  {
    question: '¿Qué significa la señal de vía sin salida?',
    keywords: ['sin salida', 'callejón', 'calle sin salida', 'no hay salida', 'T'],
    answer: 'La señal de VÍA SIN SALIDA es un rectángulo azul con un cuadro rojo y una línea horizontal. Indica que la calle no tiene salida, es decir, termina en un callejón sin continuación.'
  },
  {
    question: '¿Qué significa una señal de prohibido girar a la izquierda?',
    keywords: ['girar', 'izquierda', 'vuelta', 'prohibido girar', 'no girar'],
    answer: 'La señal de PROHIBIDO GIRAR A LA IZQUIERDA es un círculo rojo con una flecha curva hacia la izquierda tachada. Prohíbe hacer el giro a la izquierda en esa intersección. Debes seguir recto o girar a la derecha.'
  },
  {
    question: '¿Qué significa una señal de dirección obligatoria?',
    keywords: ['dirección', 'obligatoria', 'flecha', 'solo', 'debes girar', 'recto'],
    answer: 'La señal de DIRECCIÓN OBLIGATORIA es un círculo azul con una flecha blanca. Indica que debes circular solo en la dirección que muestra la flecha (derecha, izquierda o recto). No puedes ir en otra dirección.'
  },
  {
    question: '¿Qué significa la señal de estacionamiento para discapacitados?',
    keywords: ['discapacitado', 'minusválido', 'silla de ruedas', 'estacionamiento', 'inclusivo'],
    answer: 'La señal de ESTACIONAMIENTO PARA DISCAPACITADOS es un rectángulo azul con el símbolo internacional de accesibilidad (silla de ruedas). Solo las personas con discapacidad y el permiso correspondiente pueden estacionar allí.'
  },
  {
    question: '¿Cómo se debe usar el casco en bicicleta?',
    keywords: ['casco', 'bicicleta', 'bici', 'cabeza', 'protección', 'ciclismo'],
    answer: 'El casco para bicicleta debe usarse siempre, ajustado correctamente a la cabeza. Debe quedar nivelado (no inclinado), las correas deben formar una V debajo de las orejas y el broche debe estar firme pero cómodo.'
  },
  {
    question: '¿Qué significa una señal de obras en la vía?',
    keywords: ['obras', 'construcción', 'trabajos', 'vía', 'desvío', 'naranja'],
    answer: 'La señal de OBRAS EN LA VÍA es un rombo naranja con la figura de un trabajador. Advierte que hay trabajos de construcción o mantenimiento más adelante. Debes reducir la velocidad y seguir las indicaciones de los trabajadores.'
  },
  {
    question: '¿Qué significa la señal de sentido único?',
    keywords: ['sentido único', 'una vía', 'dirección única', 'solo un sentido'],
    answer: 'La señal de SENTIDO ÚNICO es un rectángulo con una flecha hacia arriba. Indica que la calle solo se puede circular en una dirección. No debes entrar en dirección contraria.'
  },
  {
    question: '¿Qué significa una señal de zona de peatones?',
    keywords: ['zona peatonal', 'peatones', 'solo peatones', 'peatonal', 'calles'],
    answer: 'La señal de ZONA PEATONAL es un círculo azul con una figura de persona caminando en blanco. Indica que la calle es exclusiva para peatones. Los vehículos no pueden circular por allí (excepto carga en horarios permitidos).'
  },
  {
    question: '¿Qué es la distancia de frenado?',
    keywords: ['frenado', 'distancia', 'frenar', 'detenerse', 'parar vehículo', 'distancia frenado'],
    answer: 'La distancia de frenado es el espacio que recorre un vehículo desde que pisas el freno hasta que se detiene por completo. Depende de la velocidad, el estado del vehículo y las condiciones del camino. A mayor velocidad, mayor distancia de frenado.'
  },
  {
    question: '¿Qué significa conducir en estado de ebriedad?',
    keywords: ['ebriedad', 'alcohol', 'conducir borracho', 'ebrio', 'licor', 'beber y manejar'],
    answer: 'Conducir en estado de ebriedad es PELIGROSO e ILEGAL. El alcohol afecta tus reflejos, coordinación y juicio. Nunca debes conducir después de beber alcohol. Siempre busca un conductor designado o transporte alternativo.'
  },
  {
    question: '¿Qué significa una señal de velocidad mínima?',
    keywords: ['mínima', 'velocidad mínima', 'lento', 'circular lento'],
    answer: 'La señal de VELOCIDAD MÍNIMA es un círculo azul con un número blanco. Indica la velocidad mínima a la que debes circular en esa vía. Si no puedes alcanzar esa velocidad, debes usar una ruta alternativa.'
  },
  {
    question: '¿Qué es un rotonda o glorieta?',
    keywords: ['rotonda', 'glorieta', 'redondel', 'círculo', 'rotary'],
    answer: 'Una rotonda o glorieta es una intersección circular donde los vehículos circulan alrededor de una isla central. Los vehículos que ya están dentro tienen prioridad. Debes ceder el paso al entrar y señalizar tu salida.'
  },
  {
    question: '¿Qué significa una señal de animales en la vía?',
    keywords: ['animal', 'animales', 'vía', 'ganado', 'vaca', 'caballo', 'venado'],
    answer: 'La señal de ANIMALES EN LA VÍA es un rombo amarillo con la silueta de un animal (vaca, venado, etc.). Advierte que pueden cruzar animales sueltos en esa zona. Debes reducir la velocidad y estar alerta.'
  },
  {
    question: '¿Qué significa la señal de túnel?',
    keywords: ['túnel', 'tunel', 'subterráneo', 'bajo tierra'],
    answer: 'La señal de TÚNEL es un rombo amarillo con la figura de un túnel. Advierte que se acerca un túnel. Debes encender las luces del vehículo, reducir la velocidad y mantener la distancia de seguridad.'
  },
  {
    question: '¿Cómo se cruza una intersección sin semáforo?',
    keywords: ['intersección', 'cruce', 'sin semáforo', 'esquina', 'cruzar calle'],
    answer: 'En una intersección sin semáforo, los peatones deben: 1) Mirar a ambos lados antes de cruzar. 2) Hacer contacto visual con los conductores. 3) Cruzar por la esquina o paso de cebra. 4) No confiar en que los conductores te vean.'
  },
  {
    question: '¿Qué es un agente de tránsito?',
    keywords: ['agente', 'tránsito', 'policía', 'tráfico', 'oficial', 'carabinero'],
    answer: 'Un agente de tránsito es un oficial que regula el tráfico en las calles. Sus indicaciones están por encima de las señales y semáforos. Debes obedecer siempre sus instrucciones.'
  },
  {
    question: '¿Qué significa la señal de puente angosto?',
    keywords: ['puente', 'angosto', 'estrecho', 'puente angosto'],
    answer: 'La señal de PUENTE ANGOSTO es un rombo amarillo con la imagen de un puente estrecho. Advierte que el puente más adelante tiene menos ancho que la vía. Debes reducir la velocidad y ceder el paso si es necesario.'
  },
  {
    question: '¿Qué significa la señal de prohibido la vuelta en U?',
    keywords: ['vuelta en U', 'retorno', 'U turn', 'prohibido', 'cambio de sentido'],
    answer: 'La señal de PROHIBIDO LA VUELTA EN U es un círculo rojo con una flecha en forma de U tachada. Prohíbe hacer el giro completo para regresar en dirección contraria. Debes buscar una intersección segura para hacer el retorno.'
  },
  {
    question: '¿Qué es la línea continua en la carretera?',
    keywords: ['línea continua', 'linea continua', 'amarilla', 'blanca', 'raya', 'no adelantar'],
    answer: 'La línea continua en la carretera indica que está PROHIBIDO adelantar o cruzarla. Si la línea es amarilla separa los carriles en sentido contrario. Si es blanca separa carriles del mismo sentido. Debes respetarla siempre.'
  },
  {
    question: '¿Qué significa una señal de paso a nivel (tren)?',
    keywords: ['tren', 'ferrocarril', 'paso a nivel', 'vía del tren', 'barreras', 'locomotora'],
    answer: 'La señal de PASO A NIVEL con FERROCARRIL es un rombo amarillo con la imagen de una locomotora. Advierte que hay una vía de tren cruzando la carretera. Debes mirar a ambos lados, reducir la velocidad y no cruzar si las barreras están bajando.'
  },
  {
    question: '¿Qué significa la señal de estacionamiento permitido?',
    keywords: ['estacionamiento', 'permitido', 'aparcamiento', 'P azul', 'zona de estacionamiento'],
    answer: 'La señal de ESTACIONAMIENTO PERMITIDO es un rectángulo azul con la letra P blanca. Indica una zona donde puedes estacionar. Puede tener restricciones de horario o tiempo máximo.'
  },
  {
    question: '¿Qué significa la señal de descenso peligroso?',
    keywords: ['descenso', 'pendiente', 'bajada', 'peligrosa', 'inclinada', 'fuerte pendiente'],
    answer: 'La señal de DESCENSO PELIGROSO es un rombo amarillo con la figura de un vehículo bajando una pendiente. Advierte que la carretera tiene una bajada pronunciada. Debes reducir la velocidad y usar el freno de motor.'
  },
  {
    question: '¿Qué significa una señal de zona de juegos?',
    keywords: ['juegos', 'parque', 'niños jugando', 'recreación', 'zonas de juegos'],
    answer: 'La señal de ZONA DE JUEGOS advierte que hay un parque o área de juegos infantiles cerca. Los conductores deben extremar la precaución, reducir la velocidad y estar atentos a niños que puedan cruzar corriendo.'
  },
  {
    question: '¿Qué es el alcoholímetro?',
    keywords: ['alcoholímetro', 'alcoholimetro', 'prueba', 'aliento', 'ebriedad', 'control'],
    answer: 'El alcoholímetro es un dispositivo que mide la cantidad de alcohol en el aliento de una persona. Se usa en controles de tránsito para verificar si un conductor ha consumido alcohol. Si superas el límite permitido, recibirás una sanción.'
  },
  {
    question: '¿Qué significa una señal de carril exclusivo para bus?',
    keywords: ['bus', 'autobús', 'colectivo', 'carril exclusivo', 'transporte público', 'bus carril'],
    answer: 'La señal de CARRIL EXCLUSIVO PARA BUS indica que solo los autobuses de transporte público pueden circular por ese carril. Los vehículos particulares no deben invadirlo, o serán multados.'
  },
  {
    question: '¿Qué significa señal de vía resbaladiza?',
    keywords: ['resbaladiza', 'derrapante', 'lluvia', 'hielo', 'piso mojado', 'patinaje'],
    answer: 'La señal de VÍA RESBALADIZA es un rombo amarillo con la imagen de un vehículo derrapando. Advierte que el pavimento puede estar resbaladizo por lluvia, hielo o aceite. Debes reducir la velocidad y evitar frenar bruscamente.'
  },
  {
    question: '¿Qué significa la señal de bicicletas?',
    keywords: ['bicicleta', 'ciclista', 'bici', 'señal bicicleta'],
    answer: 'La señal de BICICLETAS es un rombo amarillo con la silueta de una bicicleta. Advierte a los conductores que hay ciclistas frecuentemente en esa vía. Debes mantener una distancia segura al adelantar a un ciclista (mínimo 1.5 metros).'
  },
  {
    question: '¿Qué significa la señal de altura máxima?',
    keywords: ['altura', 'máxima', 'altura máxima', 'puente bajo', 'túnel', 'camión'],
    answer: 'La señal de ALTURA MÁXIMA es un círculo blanco con borde rojo que muestra un número seguido de "m". Indica la altura máxima permitida para vehículos. Si tu vehículo supera esa altura, debes buscar una ruta alternativa.'
  },
  {
    question: '¿Qué significa la señal de ancho máximo?',
    keywords: ['ancho', 'máximo', 'ancho máximo', 'vehículos anchos', 'camión'],
    answer: 'La señal de ANCHO MÁXIMO es un círculo blanco con borde rojo que muestra un número seguido de "m". Indica el ancho máximo permitido para vehículos en esa vía. Si tu vehículo es más ancho, busca otra ruta.'
  },
  {
    question: '¿Qué significa la señal de peso máximo?',
    keywords: ['peso', 'máximo', 'peso máximo', 'camión', 'carga', 'pesado'],
    answer: 'La señal de PESO MÁXIMO es un círculo blanco con borde rojo que muestra un número seguido de "t". Indica el peso máximo permitido para circular. Los vehículos que excedan ese peso deben usar otra ruta.'
  },
  {
    question: '¿Qué hacer después de un accidente de tránsito?',
    keywords: ['accidente', 'choque', 'colisión', 'siniestro', 'accidente tránsito'],
    answer: 'Después de un accidente de tránsito: 1) Mantén la calma. 2) Verifica si hay heridos y llama a emergencias. 3) Señaliza el lugar (triángulos reflectantes). 4) No muevas a los heridos. 5) Intercambia información con el otro conductor. 6) Espera a las autoridades.'
  },
  {
    question: '¿Qué significa una señal de luz intermitente?',
    keywords: ['intermitente', 'luz', 'parpadeante', 'destellante', 'precaución'],
    answer: 'Una señal de luz intermitente (como un semáforo intermitente) indica advertencia. Si es amarilla intermitente, debes reducir la velocidad y tener precaución. Si es roja intermitente, debes detenerte completamente.'
  },
  {
    question: '¿Qué significa la flecha blanca en el pavimento?',
    keywords: ['flecha', 'pavimento', 'suelo', 'pintura', 'carril'],
    answer: 'Las flechas pintadas en el pavimento indican la dirección obligatoria de circulación para cada carril. Si la flecha apunta hacia la derecha, debes girar a la derecha o seguir recto dependiendo del diseño de la flecha.'
  },
  {
    question: '¿Qué es una zona de seguridad vial?',
    keywords: ['seguridad', 'vial', 'educación', 'zona de seguridad', 'tránsito'],
    answer: 'La educación vial es el conjunto de conocimientos y normas que enseñan a peatones, ciclistas y conductores a comportarse correctamente en la vía pública. Su objetivo es prevenir accidentes y salvar vidas.'
  },
  {
    question: '¿Qué significa una señal de calle sin pavimentar?',
    keywords: ['sin pavimentar', 'tierra', 'grava', 'ripio', 'camino de tierra'],
    answer: 'La señal de CALLE SIN PAVIMENTAR es un rombo amarillo con salpicaduras o textura irregular. Advierte que la vía más adelante no está pavimentada. Debes reducir la velocidad y tener cuidado con piedras sueltas.'
  },
  {
    question: '¿Cómo deben viajar los niños en un auto?',
    keywords: ['niños', 'auto', 'coche', 'asiento', 'infantil', 'silla', 'bebé'],
    answer: 'Los niños deben viajar en el asiento trasero usando sistemas de retención infantil (sillas) apropiados para su edad, peso y altura. Los bebés van en silla orientada hacia atrás. Nunca viajen en el asiento delantero.'
  },
  {
    question: '¿Qué significa usar las luces direccionales?',
    keywords: ['direccionales', 'luces', 'turno', 'intermitente', 'señalizar', 'cambio carril'],
    answer: 'Las luces direccionales (intermitentes) se usan para indicar tus intenciones a otros conductores. Debes señalizar antes de: girar, cambiar de carril, estacionar, o salir del estacionamiento. Señaliza al menos 3 segundos antes.'
  },
  {
    question: '¿Qué significa una señal de cruce de ciclistas?',
    keywords: ['cruce ciclistas', 'bicicletas cruzando', 'ciclistas', 'bici cruce'],
    answer: 'La señal de CRUCE DE CICLISTAS advierte que hay una vía para bicicletas cruzando la carretera. Los conductores deben reducir la velocidad y dar prioridad a los ciclistas que cruzan.'
  },
  {
    question: '¿Qué significa una señal de zona de derrumbe?',
    keywords: ['derrumbe', 'derrumbes', 'deslizamiento', 'roca', 'piedra', 'montaña'],
    answer: 'La señal de ZONA DE DERRUMBE es un rombo amarillo con rocas cayendo. Advierte que hay riesgo de deslizamiento de tierra o caída de rocas. Debes estar atento y no detenerte en la zona.'
  },
  {
    question: '¿Qué significa una señal de niebla?',
    keywords: ['niebla', 'neblina', 'visibilidad', 'empañado', 'difícil ver'],
    answer: 'La señal de NIEBLA advierte que hay bancos de niebla frecuentes en esa zona. Debes reducir la velocidad, encender las luces bajas o antiniebla, aumentar la distancia de seguridad y no adelantar.'
  },
  {
    question: '¿Qué es la regla de los 3 segundos?',
    keywords: ['3 segundos', 'tres segundos', 'distancia', 'seguimiento', 'separación'],
    answer: 'La regla de los 3 segundos es una forma de mantener la distancia segura con el vehículo de adelante. Elige un punto fijo en la carretera; cuando el vehículo de adelante pase, cuenta 3 segundos. Si llegas antes, estás muy cerca.'
  },
  {
    question: '¿Qué significa la señal de uso obligatorio de cadenas?',
    keywords: ['cadenas', 'nieve', 'hielo', 'cadenas para nieve', 'montaña', 'invierno'],
    answer: 'La señal de USO OBLIGATORIO DE CADENAS indica que debes instalar cadenas en las ruedas de tu vehículo para continuar. Generalmente se usa en carreteras de montaña con nieve o hielo en la calzada.'
  },
  {
    question: '¿Qué significa la señal de fin de prohibición?',
    keywords: ['fin', 'prohibición', 'termina', 'final', 'fin de', 'anulación'],
    answer: 'La señal de FIN DE PROHIBICIÓN es un círculo blanco con borde negro y una línea diagonal negra. Indica que termina la restricción anterior (velocidad máxima, prohibición de adelantar, etc.).'
  },
  {
    question: '¿Qué significa una señal de estacionamiento en batería?',
    keywords: ['batería', 'estacionamiento batería', '45 grados', 'inclinado'],
    answer: 'El estacionamiento en batería es aquel donde los vehículos se estacionan en un ángulo de 45° o 90° respecto a la acera. Generalmente permite estacionar más vehículos en el mismo espacio.'
  },
  {
    question: '¿Qué significa una señal de tránsito de ganado?',
    keywords: ['ganado', 'vacas', 'animales', 'campo', 'rural', 'granja'],
    answer: 'La señal de TRÁNSITO DE GANADO advierte que hay animales de granja cruzando la vía frecuentemente. Debes reducir la velocidad, no usar el claxon (podría asustarlos) y esperar a que crucen completamente.'
  },
  {
    question: '¿Qué significa una señal de viento fuerte?',
    keywords: ['viento', 'fuerte', 'viento lateral', 'racha', 'veleta'],
    answer: 'La señal de VIENTO FUERTE advierte que hay ráfagas de viento laterales peligrosas en esa zona. Debes reducir la velocidad, sujetar firmemente el volante y estar preparado para correcciones repentinas de dirección.'
  },
  {
    question: '¿Qué significa la señal de prohibido tocar bocina?',
    keywords: ['bocina', 'claxon', 'ruido', 'prohibido', 'sonido', 'pito'],
    answer: 'La señal de PROHIBIDO TOCAR BOCINA es un círculo rojo con una bocina tachada. Prohíbe usar el claxon en esa zona, generalmente cerca de hospitales, escuelas o zonas residenciales.'
  },
  {
    question: '¿Qué significa una señal de cruce de tranvía?',
    keywords: ['tranvía', 'tranvia', 'tren ligero', 'riel', 'vía tranvía'],
    answer: 'La señal de CRUCE DE TRANVÍA advierte que hay vías de tranvía cruzando la carretera. Debes tener cuidado con los tranvías, que tienen prioridad y no pueden frenar rápidamente. No te detengas sobre las vías.'
  },
  {
    question: '¿Qué es un punto ciego en un vehículo?',
    keywords: ['punto ciego', 'ángulo', 'espejo', 'no veo', 'retrovisor', 'visual'],
    answer: 'El punto ciego es el área alrededor del vehículo que el conductor no puede ver directamente ni a través de los espejos. Debes girar la cabeza para verificar y nunca asumir que un vehículo no está allí.'
  },
  {
    question: '¿Qué es la fatiga al conducir?',
    keywords: ['fatiga', 'cansancio', 'conducir cansado', 'somnolencia', 'dormir'],
    answer: 'La fatiga al conducir es muy peligrosa. Si sientes sueño o cansancio, detente en un lugar seguro cada 2 horas o cada 200 km. Descansa 15-20 minutos, estírate, toma agua o café. Nunca conduzcas con sueño.'
  },
  {
    question: '¿Qué significa la señal de estacionamiento limitado?',
    keywords: ['limitado', 'tiempo', 'horario', 'estacionamiento limitado', 'parquímetro'],
    answer: 'La señal de ESTACIONAMIENTO LIMITADO indica que puedes estacionar solo por un tiempo determinado (ej: 1 hora). Generalmente se usa en zonas comerciales y requiere usar un parquímetro o disco horario.'
  },
  {
    question: '¿Qué significa una señal de cruce de peatones?',
    keywords: ['cruce de peatones', 'paso peatonal', 'peatón cruzando'],
    answer: 'La señal de CRUCE DE PEATONES (paso de cebra) es un rombo amarillo con una persona caminando en las rayas. Los conductores deben detenerse si hay peatones esperando o cruzando. Los peatones tienen prioridad.'
  },
  {
    question: '¿Qué es la licencia de conducir?',
    keywords: ['licencia', 'conducir', 'registro', 'permiso', 'carnet', 'brevete'],
    answer: 'La licencia de conducir es el documento oficial que permite a una persona conducir vehículos. Debes obtenerla aprobando exámenes teóricos y prácticos. Conducir sin licencia es ilegal y peligroso.'
  },
  {
    question: '¿Qué significa la señal de cruce escolar?',
    keywords: ['escolar', 'cruce escolar', 'colegio', 'escuela', 'niños'],
    answer: 'La señal de CRUCE ESCOLAR advierte que hay un cruce de niños cerca de una escuela. Los conductores deben detenerse si hay un guardia escolar o niños cruzando. La velocidad máxima en zona escolar es generalmente 20-30 km/h.'
  },
  {
    question: '¿Qué significa una señal de vía exclusiva para peatones y bicicletas?',
    keywords: ['peatones', 'bicicletas', 'compartida', 'vía peatonal y bici'],
    answer: 'La señal de VÍA COMPARTIDA peatones y bicicletas indica que ambos pueden usar ese espacio. Los ciclistas deben circular a velocidad moderada y dar prioridad a los peatones. Los peatones deben estar atentos a las bicicletas.'
  },
  {
    question: '¿Qué significa un camino compartido?',
    keywords: ['compartido', 'camino compartido', 'peatón y bici'],
    answer: 'Un camino compartido es un espacio donde peatones y ciclistas circulan juntos. Todos deben respetarse mutuamente, los ciclistas deben anunciar su presencia y los peatones no deben obstruir el paso.'
  },
  {
    question: '¿Cómo prevenir accidentes en la vía?',
    keywords: ['prevenir', 'accidentes', 'seguridad', 'evitar', 'choques', 'recomendaciones'],
    answer: 'Para prevenir accidentes: 1) Respeta los límites de velocidad. 2) No uses el teléfono mientras conduces. 3) Mantén la distancia de seguridad. 4) Usa siempre el cinturón. 5) No conduzcas bajo alcohol o drogas. 6) Revisa tu vehículo regularmente.'
  },
  {
    question: '¿Qué es la conducción defensiva?',
    keywords: ['defensiva', 'conducción', 'prevención', 'anticiparse', 'seguro'],
    answer: 'La conducción defensiva es una técnica donde el conductor anticipa situaciones de riesgo y toma decisiones para evitar accidentes. Incluye mantener distancia, estar atento a otros conductores y respetar todas las normas de tránsito.'
  },
  {
    question: '¿Qué significan las luces del auto?',
    keywords: ['luces', 'auto', 'faros', 'altas', 'bajas', 'direccionales', 'emergencia'],
    answer: 'Luces del auto: BAJAS = conducción nocturna normal. ALTAS = carretera oscura (apágalas al ver otro vehículo). DIRECCIONALES = indicar giros. EMERGENCIA (intermitentes) = detención o peligro. NEBLINEROS = niebla o lluvia intensa.'
  },
  {
    question: '¿Qué significa la señal de peligro por obras?',
    keywords: ['obras', 'peligro', 'trabajadores', 'construcción', 'desvío'],
    answer: 'La señal de PELIGRO POR OBRAS es un rombo naranja con la figura de un trabajador excavando. Advierte que hay trabajos viales más adelante. Debes reducir la velocidad, seguir los desvíos y proteger a los trabajadores.'
  },
  {
    question: '¿Qué significa la señal de prioridad al sentido contrario?',
    keywords: ['prioridad', 'contrario', 'ceder paso', 'angosto', 'estrecho'],
    answer: 'La señal de PRIORIDAD AL SENTIDO CONTRARIO es un círculo blanco con borde rojo y dos flechas enfrentadas. Indica que debes ceder el paso a los vehículos que vienen en dirección contraria en un tramo angosto.'
  },
  {
    question: '¿Qué significa la señal de prioridad respecto al sentido contrario?',
    keywords: ['prioridad', 'contrario', 'tengo prioridad', 'paso', 'angosto'],
    answer: 'La señal de PRIORIDAD RESPECTO AL SENTIDO CONTRARIO es un círculo azul con dos flechas. Indica que tienes prioridad de paso sobre los vehículos que vienen en dirección contraria en un tramo angosto.'
  },
  {
    question: '¿Qué son las señales de tránsito?',
    keywords: ['señales', 'tránsito', 'tráfico', 'qué son', 'definición', 'tipos'],
    answer: 'Las señales de tránsito son dispositivos colocados en las vías públicas para regular, advertir o informar a conductores y peatones. Se clasifican en: REGULADORAS (círculos rojos), PREVENTIVAS (rombos amarillos) e INFORMATIVAS (rectángulos azules/verdes).'
  },
  {
    question: '¿Qué significa una señal preventiva?',
    keywords: ['preventiva', 'prevención', 'rombo amarillo', 'advertencia', 'cuidado'],
    answer: 'Las señales PREVENTIVAS son de color amarillo con forma de rombo (cuadrado girado). Advierten sobre peligros o condiciones especiales en la vía más adelante, como curvas, cruces, pendientes o animales.'
  },
  {
    question: '¿Qué significa una señal informativa?',
    keywords: ['informativa', 'información', 'azul', 'verde', 'rectangular'],
    answer: 'Las señales INFORMATIVAS son rectángulos azules o verdes que proporcionan información útil como destinos, distancias, servicios (hospital, gasolinera, restaurante) o lugares de interés.'
  },
  {
    question: '¿Qué significa una señal reguladora?',
    keywords: ['reguladora', 'regulación', 'círculo rojo', 'obligación', 'prohibición'],
    answer: 'Las señales REGULADORAS son circulares con borde rojo (prohibición) o fondo azul (obligación). Indican lo que está prohibido o es obligatorio hacer. Debes obedecerlas siempre.'
  },
  {
    question: '¿Qué significa el color naranja en señales?',
    keywords: ['naranja', 'color naranja', 'señal naranja', 'construcción', 'desvío temporal'],
    answer: 'El color NARANJA en las señales de tránsito indica condiciones temporales como construcción, mantenimiento o desvíos. Estas señales tienen prioridad sobre las señales permanentes cuando hay trabajos en la vía.'
  },
  {
    question: '¿Cómo leer una señal de tránsito?',
    keywords: ['leer', 'entender', 'interpretar', 'significado', 'señales'],
    answer: 'Para leer las señales de tránsito: FORMA: círculo = regulación, rombo = prevención, rectángulo = información. COLOR: rojo = prohibición, amarillo = advertencia, azul = servicio/información. SÍMBOLOS: la figura dentro indica el mensaje específico.'
  },
  {
    question: '¿Qué significa una señal de tránsito temporal?',
    keywords: ['temporal', 'eventual', 'provisional', 'construcción', 'naranja'],
    answer: 'Las señales TEMPORALES son de color naranja y se usan durante obras, eventos o emergencias en la vía. Tienen prioridad sobre las señales permanentes. Debes seguir sus indicaciones hasta que terminen los trabajos.'
  },
  {
    question: '¿Qué es la educación vial?',
    keywords: ['educación', 'vial', 'enseñanza', 'aprender', 'normas', 'conducta'],
    answer: 'La educación vial es el aprendizaje de las normas, señales y comportamientos seguros en la vía pública. Su objetivo es formar ciudadanos responsables que respeten las reglas y prevengan accidentes de tránsito.'
  },
  {
    question: '¿Qué es un paso peatonal elevado?',
    keywords: ['elevado', 'peatonal', 'paso elevado', 'reductor', 'velocidad', 'lomo de toro'],
    answer: 'Un paso peatonal elevado es una zona elevada de la calle que obliga a los vehículos a reducir la velocidad, permitiendo a los peatones cruzar de forma más segura. También se conoce como reductor de velocidad o lomo de toro.'
  },
  {
    question: '¿Qué significa la señal de velocidad controlada por radar?',
    keywords: ['radar', 'foto multa', 'fotomulta', 'control velocidad', 'cámara'],
    answer: 'La señal de RADAR o CONTROL DE VELOCIDAD advierte que hay un dispositivo electrónico que monitorea y registra la velocidad de los vehículos. Si excedes el límite, recibirás una multa. Respeta siempre la velocidad máxima.'
  },
  {
    question: '¿Qué es una zona de pacificación de tráfico?',
    keywords: ['pacificación', 'tráfico', 'zona 30', 'velocidad reducida', 'convivencia'],
    answer: 'Una zona de pacificación (zona 30) es un área residencial donde la velocidad máxima es de 30 km/h. Busca reducir accidentes, ruido y contaminación, y mejorar la convivencia entre vehículos, peatones y ciclistas.'
  },
  {
    question: '¿Qué significa una señal de estacionamiento para carpool?',
    keywords: ['carpool', 'compartido', 'coche compartido', '2 pasajeros', 'HOV'],
    answer: 'La señal de ESTACIONAMIENTO COMPARTIDO o CARPOOL indica un espacio reservado para vehículos con dos o más ocupantes. Fomenta compartir el auto para reducir el tráfico y la contaminación.'
  },
  {
    question: '¿Qué significa una señal de vía concesionada?',
    keywords: ['concesionada', 'pago', 'peaje', 'autopista paga', 'cobro'],
    answer: 'La señal de VÍA CONCESIONADA o DE PEAJE indica que la carretera es de pago (autopista con peaje). Debes pagar una tarifa para usarla. Generalmente tiene una estación de cobro donde puedes pagar en efectivo o con TAG.'
  },
  {
    question: '¿Qué son los puntos de acumulación en la licencia?',
    keywords: ['puntos', 'licencia', 'infracción', 'multa', 'suspensión', 'acumulación'],
    answer: 'El sistema de puntos asigna un puntaje a cada infracción de tránsito. Cuando acumulas cierto número de puntos, tu licencia puede ser suspendida. Respetar las normas evita la pérdida de puntos y de la licencia.'
  },
  {
    question: '¿Qué significa la señal de prohibición de adelantar para camiones?',
    keywords: ['camiones', 'camión', 'adelantar', 'prohibido', 'carga', 'pesado'],
    answer: 'La señal de PROHIBICIÓN DE ADELANTAR PARA CAMIONES es similar a la general pero incluye un ícono de camión. Prohíbe a los vehículos pesados adelantar en ese tramo, aunque otros vehículos sí pueden hacerlo.'
  },
]

export default knowledgeBase
