// src/data/newsData.js
export const NEWS_CATEGORIES = [
  { id: 'all',       label: 'Todas' },
  { id: 'normas',    label: 'Normas' },
  { id: 'seguridad', label: 'Seguridad' },
  { id: 'sanciones', label: 'Sanciones' },
  { id: 'tips',      label: 'Tips' },
]

export const NEWS = [
  {
    id: 1,
    cat: 'normas',
    tag: 'Código de Tránsito',
    emoji: '📋',
    title: 'Velocidades máximas en Colombia: ¿cuánto puedes ir?',
    summary: 'El Código Nacional de Tránsito (Ley 769 de 2002) establece los límites de velocidad según el tipo de vía. Conocerlos es obligatorio para circular legalmente.',
    body: `En Colombia los límites de velocidad están definidos así según el tipo de vía:

• **Vías urbanas**: máximo 50 km/h en zonas residenciales y 60 km/h en vías principales.
• **Carreteras secundarias**: hasta 80 km/h.
• **Autopistas y vías primarias**: hasta 120 km/h.
• **Zonas escolares y hospitalarias**: máximo 30 km/h.

Superar estos límites está sancionado con multas desde $468.900 hasta $4'688.900 dependiendo del exceso. Recuerda que los radares de velocidad están activos en las principales ciudades del país.`,
    date: '2 may 2025',
    readMin: 3,
    color: '#448aff',
  },
  {
    id: 2,
    cat: 'seguridad',
    tag: 'Seguridad Vial',
    emoji: '🦺',
    title: 'El cinturón de seguridad: obligatorio para todos los ocupantes',
    summary: 'Muchos conductores desconocen que el cinturón es obligatorio tanto en la parte delantera como en los asientos traseros del vehículo.',
    body: `La Ley 769 de 2002 establece que el uso del cinturón es **obligatorio para todos los ocupantes del vehículo**, incluyendo los pasajeros de la parte trasera.

**¿Por qué importa?**
En un choque a 50 km/h, una persona sin cinturón de 70 kg genera una fuerza equivalente a 2 toneladas al impactar contra el habitáculo.

**Sanciones:**
No usar cinturón genera multa de $468.900 (4 SMLDV) y 4 puntos en la licencia de conducción.

**Niños menores de 10 años** deben viajar en silla de retención infantil homologada, independientemente de su peso o talla.`,
    date: '28 abr 2025',
    readMin: 4,
    color: '#00e676',
  },
  {
    id: 3,
    cat: 'sanciones',
    tag: 'Multas 2025',
    emoji: '💸',
    title: 'Tabla de multas de tránsito actualizadas para 2025',
    summary: 'Las multas de tránsito en Colombia se actualizan cada año con base en el salario mínimo. Aquí están las más comunes que debes conocer.',
    body: `Con base en el SMMLV 2025 ($1.423.500), estas son las infracciones más frecuentes:

| Infracción | Multa aprox. |
|---|---|
| Exceso de velocidad (hasta 30%) | $568.000 |
| No usar cinturón | $284.000 |
| Usar celular manejando | $568.000 |
| Conducir en estado de embriaguez | $4.700.000 |
| No respetar semáforo en rojo | $568.000 |
| Estacionar en zona prohibida | $284.000 |
| No portar documentos | $284.000 |

Además de la multa económica, muchas infracciones generan **puntos en contra de la licencia**. Acumular 12 puntos resulta en la suspensión de la licencia.`,
    date: '20 abr 2025',
    readMin: 5,
    color: '#ff5252',
  },
  {
    id: 4,
    cat: 'tips',
    tag: 'Consejos',
    emoji: '💡',
    title: '5 errores comunes al girar en intersecciones',
    summary: 'Las intersecciones son el punto más peligroso de cualquier vía urbana. Estos errores los cometen hasta conductores experimentados.',
    body: `**1. No reducir velocidad antes de girar**
Debes reducir antes de llegar a la intersección, no mientras giras. Girar a alta velocidad es causa frecuente de volcamientos.

**2. No ceder el paso al peatón**
En cualquier giro, el peatón que ya cruzó tiene derecho de paso absoluto sobre el vehículo.

**3. Girar desde el carril equivocado**
Los giros a la derecha se hacen desde el carril más a la derecha; los giros a la izquierda, desde el carril más a la izquierda.

**4. No señalizar con suficiente anticipación**
La señal de giro debe activarse mínimo 30 metros antes de la intersección, no justo al llegar.

**5. Cruzar sin asegurarse de que todos pararon**
Aunque el semáforo esté en verde para ti, verifica que los demás vehículos realmente se detuvieron antes de avanzar.`,
    date: '15 abr 2025',
    readMin: 4,
    color: '#ffd740',
  },
  {
    id: 5,
    cat: 'normas',
    tag: 'Código de Tránsito',
    emoji: '🚦',
    title: 'Pico y placa: cómo funciona y qué debes saber',
    summary: 'El pico y placa es una medida de restricción vehicular vigente en varias ciudades colombianas. Aquí te explicamos cómo opera.',
    body: `El **pico y placa** es una medida de restricción de circulación que aplica según el último dígito de la placa del vehículo en determinados horarios.

**¿Cómo saber si te aplica?**
Cada ciudad define sus propios horarios y dígitos. En Bogotá, por ejemplo, aplica en horas pico (generalmente 6–8:30 a.m. y 3–7:30 p.m.) en días hábiles.

**Excepciones comunes:**
- Vehículos de emergencia (ambulancias, bomberos, policía)
- Taxis (en algunos casos tienen pico y placa diferenciado)
- Vehículos eléctricos (exentos en varias ciudades)
- Motos (regulación varía por ciudad)

**Sanción por incumplimiento:** Multa de $568.000 y posible inmovilización del vehículo.

Consulta siempre la normativa vigente en tu ciudad, ya que puede cambiar por temporadas o decisiones administrativas.`,
    date: '10 abr 2025',
    readMin: 4,
    color: '#18ffff',
  },
  {
    id: 6,
    cat: 'seguridad',
    tag: 'Motociclistas',
    emoji: '🏍️',
    title: 'Normas para motociclistas: lo que no puedes olvidar',
    summary: 'Los motociclistas representan uno de los grupos más vulnerables en las vías colombianas. Estas son las normas clave que todo motero debe conocer.',
    body: `**Equipamiento obligatorio:**
- Casco certificado (norma ICONTEC 4533) para conductor Y parrillero
- Chaleco reflectivo con número de placa
- Guantes, rodilleras y botas (recomendado, exigido en carretera)

**Prohibiciones importantes:**
- Circular entre carriles (zigzagueo)
- Llevar más de un parrillero
- Usar audífonos mientras se conduce
- Circular por andenes, separadores o ciclovías

**Luces encendidas:**
Las motos deben circular con luz de cruce (media) encendida en todo momento, incluso de día.

**Revisión técnico-mecánica:**
Las motos también están obligadas a realizar la revisión técnico-mecánica. La periodicidad depende del modelo año del vehículo.`,
    date: '5 abr 2025',
    readMin: 5,
    color: '#ff7043',
  },
  {
    id: 7,
    cat: 'tips',
    tag: 'Consejos',
    emoji: '🌧️',
    title: 'Cómo conducir seguro en lluvia: guía práctica',
    summary: 'En Colombia llueve buena parte del año. Conducir bajo la lluvia requiere técnicas específicas que muchos conductores desconocen.',
    body: `**Antes de salir:**
- Verifica que los limpiaparabrisas funcionan correctamente
- Comprueba la presión y estado de los neumáticos (la lluvia reduce la adherencia)
- Asegúrate de que todas las luces estén operativas

**Durante la lluvia:**
- Reduce la velocidad al menos un 30% respecto al límite normal
- Aumenta la distancia de seguridad al doble (el frenado tarda más en piso mojado)
- Enciende las luces de cruce aunque sea de día
- Evita frenadas bruscas; frena suave y progresivamente

**Charcos y acuaplaning:**
Cuando el neumático pierde contacto con el asfalto por el agua (acuaplaning), no frenes abruptamente. Suelta el acelerador gradualmente y mantén el volante recto hasta recuperar tracción.

**Precaución extra:**
Los primeros 20 minutos de lluvia son los más peligrosos, ya que el agua mezcla el polvo y el aceite del asfalto haciéndolo muy resbaladizo.`,
    date: '1 abr 2025',
    readMin: 5,
    color: '#448aff',
  },
]