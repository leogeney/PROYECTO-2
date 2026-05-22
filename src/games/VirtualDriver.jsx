import React, { useState, useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'
import { useNotification } from '../context/NotificationContext'

const ROAD_W = 10
const ROAD_SEGS = 30
const SEG_LEN = 8
const LANES = 5
const LANE_W = ROAD_W / LANES
const LANE_XS = [-4, -2, 0, 2, 4]

const OBSTACLE_TYPES = [
  { type: 'hazard', label: 'Barricada', color: 0xff4400, pts: 0 },
  { type: 'hazard', label: 'Bus', color: 0xcc2200, pts: 0 },
  { type: 'hazard', label: 'Camión', color: 0xaa1100, pts: 0 },
  { type: 'bonus', label: 'Nitro', color: 0x00aaff, pts: 25, nitro: true },
  { type: 'bonus', label: 'Diamante', color: 0xffdd00, pts: 50 },
  { type: 'bonus', label: 'Vida', color: 0xff3366, pts: 10, heal: true },
  { type: 'bonus', label: 'Vía libre', color: 0x00ff88, pts: 15 },
]

function makeCarMesh(bodyColor, isPlayer, THREE) {
  const g = new THREE.Group()

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 0.38, 3.4),
    new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.25, metalness: 0.9 })
  )
  body.position.y = 0.22
  body.castShadow = true
  g.add(body)

  const cab = new THREE.Mesh(
    new THREE.BoxGeometry(1.3, 0.32, 1.7),
    new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.15, metalness: 0.9 })
  )
  cab.position.set(0, 0.55, -0.1)
  g.add(cab)

  const glass = new THREE.Mesh(
    new THREE.BoxGeometry(1.1, 0.24, 1.5),
    new THREE.MeshStandardMaterial({
      color: 0x223355,
      roughness: 0.05,
      metalness: 0.8,
      opacity: 0.7,
      transparent: true,
    })
  )
  glass.position.set(0, 0.56, -0.1)
  g.add(glass)

  const wheelGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.18, 12)
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9, metalness: 0.2 })
  const rimMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.2, metalness: 0.9 })

  ;[[-0.82, 0.09, 1.1], [0.82, 0.09, 1.1], [-0.82, 0.09, -1.1], [0.82, 0.09, -1.1]].forEach(([wx, wy, wz]) => {
    const w = new THREE.Mesh(wheelGeo, wheelMat)
    w.rotation.z = Math.PI / 2
    w.position.set(wx, wy, wz)
    g.add(w)

    const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.19, 6), rimMat)
    rim.rotation.z = Math.PI / 2
    rim.position.set(wx, wy, wz)
    g.add(rim)
  })

  if (isPlayer) {
    const hlMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfff8ee, emissiveIntensity: 3 })
    ;[-0.5, 0.5].forEach(ox => {
      const hl = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), hlMat)
      hl.position.set(ox, 0.22, 1.72)
      g.add(hl)
    })

    const spot = new THREE.SpotLight(0xfff8dd, 4, 20, Math.PI / 6, 0.3)
    spot.position.set(0, 0.8, 2)
    spot.target.position.set(0, -1, -10)
    g.add(spot)
    g.add(spot.target)
  }

  const tlMat = new THREE.MeshStandardMaterial({ color: 0xff1111, emissive: 0xff0000, emissiveIntensity: 2 })
  ;[-0.55, 0.55].forEach(ox => {
    const tl = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.06, 0.04), tlMat)
    tl.position.set(ox, 0.22, -1.71)
    g.add(tl)
  })

  return g
}

export function VirtualDriver({ onBack }) {
  const mountRef = useRef(null)
  const threeRef = useRef(null)
  const stateRef = useRef(null)
  const rafRef = useRef(null)
  const cameraTargetRef = useRef(new THREE.Vector3())
  const lookTargetRef = useRef(new THREE.Vector3())
  const shakeTimeoutRef = useRef(null)
  const floatTimeoutsRef = useRef([])

  const [phase, setPhase] = useState('idle')
  const [hud, setHud] = useState({
    score: 0,
    lives: 3,
    distance: 0,
    speed: 5,
    nitroCharge: 0,
    nitroActive: false,
    combo: 1,
  })
  const [floats, setFloats] = useState([])
  const { showNotification } = useNotification()

  useEffect(() => {
    if (phase === 'dead') {
      const dist = stateRef.current?.distance || 0
      if (dist >= 5) {
        showNotification?.('performance', '¡Eres un experto del volante! Recorriste una gran distancia. 🏁', 6000)
      } else if (dist >= 1.5) {
        showNotification?.('performance', '¡Buen recorrido! Cada vez conduces mejor. 🏎️', 5000)
      } else {
        showNotification?.('performance', '¡Cuidado en la vía! Inténtalo de nuevo para llegar más lejos. 💥', 5000)
      }
    }
  }, [phase, showNotification])

  const addFloat = useCallback((text, color, screenX) => {
    const id = Math.random()
    setFloats(f => [...f, { id, text, color, screenX }])
    const t = setTimeout(() => {
      setFloats(f => f.filter(ff => ff.id !== id))
    }, 900)
    floatTimeoutsRef.current.push(t)
  }, [])

  const doShake = useCallback(() => {
    if (!stateRef.current) return
    stateRef.current.shakeAmt = 0.12
    if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current)
    shakeTimeoutRef.current = setTimeout(() => {
      if (stateRef.current) stateRef.current.shakeAmt = 0
    }, 420)
  }, [])

  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    el.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x0a0d14, 0.018)

    const camera = new THREE.PerspectiveCamera(65, 1, 0.1, 300)
    camera.position.set(0, 3.5, 9)
    camera.lookAt(0, 1, -10)

    const resize = () => {
      const W = el.clientWidth || window.innerWidth
      const H = el.clientHeight || window.innerHeight
      renderer.setSize(W, H, false)
      camera.aspect = W / H
      camera.updateProjectionMatrix()
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(el)

    scene.add(new THREE.AmbientLight(0x223366, 1.2))

    const sun = new THREE.DirectionalLight(0xfff0cc, 2.0)
    sun.position.set(30, 40, 20)
    sun.castShadow = true
    sun.shadow.mapSize.set(2048, 2048)
    sun.shadow.camera.left = -40
    sun.shadow.camera.right = 40
    sun.shadow.camera.top = 40
    sun.shadow.camera.bottom = -40
    sun.shadow.camera.far = 200
    scene.add(sun)

    const rim = new THREE.DirectionalLight(0x0055ff, 0.5)
    rim.position.set(-10, 5, 10)
    scene.add(rim)

    const roadSegments = []
    for (let i = 0; i < ROAD_SEGS; i++) {
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(ROAD_W, SEG_LEN),
        new THREE.MeshStandardMaterial({ color: 0x111520, roughness: 0.85, metalness: 0.05 })
      )
      m.rotation.x = -Math.PI / 2
      m.position.set(0, -0.01, -i * SEG_LEN)
      m.receiveShadow = true
      scene.add(m)
      roadSegments.push(m)
    }

    ;[-ROAD_W / 2 + 0.18, ROAD_W / 2 - 0.18].forEach(x => {
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(0.35, ROAD_SEGS * SEG_LEN),
        new THREE.MeshStandardMaterial({ color: 0xff6600, roughness: 0.9 })
      )
      m.rotation.x = -Math.PI / 2
      m.position.set(x, 0, -ROAD_SEGS * SEG_LEN / 2)
      scene.add(m)
    })

    const laneLines = []
    for (let l = 1; l < LANES; l++) {
      const lx = -ROAD_W / 2 + l * LANE_W
      for (let s = 0; s < ROAD_SEGS * 3; s++) {
        const m = new THREE.Mesh(
          new THREE.PlaneGeometry(0.06, 2.8),
          new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8, opacity: 0.3, transparent: true })
        )
        m.rotation.x = -Math.PI / 2
        m.position.set(lx, 0.002, -s * 4.8)
        scene.add(m)
        laneLines.push(m)
      }
    }

    const makeEdge = (x, color) => {
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(0.08, ROAD_SEGS * SEG_LEN * 4),
        new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 2, roughness: 0.1 })
      )
      m.rotation.x = -Math.PI / 2
      m.position.set(x, 0.003, -ROAD_SEGS * SEG_LEN * 2)
      scene.add(m)
      return m
    }

    const leftEdge = makeEdge(-ROAD_W / 2, 0x00ff88)
    const rightEdge = makeEdge(ROAD_W / 2, 0x00ff88)

    const skyDome = new THREE.Mesh(
      new THREE.SphereGeometry(180, 32, 32),
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        uniforms: {
          topColor: { value: new THREE.Color(0x0a0a2e) },
          bottomColor: { value: new THREE.Color(0x1a1a3e) },
          offset: { value: 20 },
          exponent: { value: 0.4 }
        },
        vertexShader: `
          varying vec3 vWorldPosition;
          void main() {
            vec4 worldPos = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPos.xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 topColor;
          uniform vec3 bottomColor;
          uniform float offset;
          uniform float exponent;
          varying vec3 vWorldPosition;
          void main() {
            float h = normalize(vWorldPosition + offset).y;
            gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
          }
        `
      })
    )
    scene.add(skyDome)

    const stars = []
    const starGeo = new THREE.BufferGeometry()
    const starCount = 800
    const starPos = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount * 3; i++) starPos[i] = (Math.random() - 0.5) * 400
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.3, transparent: true, opacity: 0.8 })
    const starMesh = new THREE.Points(starGeo, starMat)
    starMesh.position.y = 50
    scene.add(starMesh)
    stars.push(starMesh)

    const buildings = []
    const bColors = [0x1a2035, 0x131828, 0x1c1a2a, 0x0f1520]
    for (let i = 0; i < 40; i++) {
      const side = i % 2 === 0 ? 1 : -1
      const x = side * (ROAD_W / 2 + 3 + Math.random() * 6)
      const z = -i * 15 - 10
      const h = 4 + Math.random() * 18
      const color = bColors[Math.floor(Math.random() * bColors.length)]
      const bm = new THREE.Mesh(
        new THREE.BoxGeometry(2 + Math.random() * 3, h, 2 + Math.random() * 3),
        new THREE.MeshStandardMaterial({ color, roughness: 0.8, metalness: 0.3 })
      )
      bm.position.set(x, h / 2, z)
      bm.castShadow = true
      scene.add(bm)

      if (h > 8) {
        const winMat = new THREE.MeshStandardMaterial({
          color: 0xffdd88,
          emissive: 0xffaa44,
          emissiveIntensity: 0.3 + Math.random() * 0.4,
          roughness: 0.1,
          metalness: 0.8,
        })
        const wg = new THREE.PlaneGeometry(0.8, 0.8)
        for (let wy = 2; wy < h - 1; wy += 2.2) {
          for (let wx = -0.6; wx <= 0.6; wx += 1.2) {
            const win = new THREE.Mesh(wg, winMat)
            const wxOff = (Math.random() - 0.5) * 0.8
            win.position.set(x + wx + wxOff, wy, z + (side > 0 ? 1.1 : -1.1))
            scene.add(win)
          }
        }
      }

      buildings.push({ mesh: bm })
    }

    const trees = []
    const treeColors = [0x1a5c2a, 0x2d6b3f, 0x3d7a4f]
    for (let i = 0; i < 40; i++) {
      const side = i % 2 === 0 ? 1 : -1
      const x = side * (ROAD_W / 2 + 10 + Math.random() * 14)
      const z = -i * 22 - 20
      const treeG = new THREE.Group()
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.10, 1.2, 6),
        new THREE.MeshStandardMaterial({ color: 0x4a3728, roughness: 0.9 })
      )
      trunk.position.y = 0.6
      treeG.add(trunk)
      const foliage = new THREE.Mesh(
        new THREE.SphereGeometry(0.6 + Math.random() * 0.5, 6, 6),
        new THREE.MeshStandardMaterial({
          color: treeColors[Math.floor(Math.random() * treeColors.length)],
          roughness: 0.9
        })
      )
      foliage.position.y = 1.6 + Math.random() * 0.6
      treeG.add(foliage)
      treeG.position.set(x, 0, z)
      scene.add(treeG)
      trees.push(treeG)
    }

    const lamps = []
    const makeLamp = (x, z) => {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 4, 6), new THREE.MeshStandardMaterial({ color: 0x334455 }))
      pole.position.set(x, 2, z)
      scene.add(pole)

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), new THREE.MeshStandardMaterial({ color: 0xffffaa, emissive: 0xffee88, emissiveIntensity: 2 }))
      head.position.set(x, 4.1, z)
      scene.add(head)

      const pl = new THREE.PointLight(0xffee88, 1.2, 12)
      pl.position.set(x, 4, z)
      scene.add(pl)

      lamps.push({ pole, head, pl })
    }

    for (let i = 0; i < 30; i++) {
      makeLamp(-ROAD_W / 2 - 0.6, -i * 14 - 5)
      makeLamp(ROAD_W / 2 + 0.6, -i * 14 - 5)
    }

    const trafficLights = []
    const createTrafficLight = (z) => {
      const g = new THREE.Group()
      const poleMat = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.4, metalness: 0.7 })
      const beamMat = new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.5, metalness: 0.5 })

      const leftPole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 6, 8), poleMat)
      leftPole.position.set(-ROAD_W / 2 - 0.4, 3, 0)
      g.add(leftPole)

      const rightPole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 6, 8), poleMat)
      rightPole.position.set(ROAD_W / 2 + 0.4, 3, 0)
      g.add(rightPole)

      const beam = new THREE.Mesh(new THREE.BoxGeometry(ROAD_W + 1, 0.08, 0.5), beamMat)
      beam.position.set(0, 5.8, 0)
      g.add(beam)

      const box = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, 2.0, 0.5),
        new THREE.MeshStandardMaterial({ color: 0x181818, roughness: 0.2, metalness: 0.3 })
      )
      box.position.set(0, 4.4, 0.1)
      g.add(box)

      const visorMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.3 })
      const visor = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.12, 0.6), visorMat)
      visor.position.set(0, 5.4, 0.25)
      g.add(visor)

      const lightDefs = [
        { y: 5.2, color: 0xff0000, state: 'red', offColor: 0x330000 },
        { y: 4.4, color: 0xffaa00, state: 'yellow', offColor: 0x332200 },
        { y: 3.6, color: 0x00ff00, state: 'green', offColor: 0x003300 },
      ]
      const lights = lightDefs.map(def => {
        const s = new THREE.Mesh(
          new THREE.SphereGeometry(0.22, 12, 12),
          new THREE.MeshStandardMaterial({ color: def.offColor, emissive: 0x000000, emissiveIntensity: 0, roughness: 0.15 })
        )
        s.position.set(0, def.y, 0.3)
        s.userData = def
        g.add(s)
        return s
      })

      const glowLight = new THREE.PointLight(0x00ff00, 0, 10)
      glowLight.position.set(0, 4.4, 1.2)
      g.add(glowLight)

      g.position.set(0, 0, z)
      scene.add(g)
      const si = 2
      lights[si].material.color.setHex(lightDefs[si].color)
      lights[si].material.emissive.setHex(lightDefs[si].color)
      lights[si].material.emissiveIntensity = 4
      glowLight.color.setHex(0x00ff00)
      glowLight.intensity = 3
      return {
        group: g, lights, lightDefs, glowLight, state: 'green', stateIndex: si,
        timer: 5 + Math.random() * 3, z, passed: false,
      }
    }

    for (let i = 0; i < 5; i++) {
      trafficLights.push(createTrafficLight(-i * 80 - 50))
    }

    const playerCar = makeCarMesh(0xe8251a, true, THREE)
    playerCar.position.set(0, 0.13, 4)
    playerCar.rotation.y = Math.PI
    scene.add(playerCar)

    const flame = new THREE.Mesh(
      new THREE.ConeGeometry(0.15, 1.2, 8),
      new THREE.MeshStandardMaterial({ color: 0x00ccff, emissive: 0x00aaff, emissiveIntensity: 3, opacity: 0.8, transparent: true })
    )
    flame.position.set(0, 0.18, -2.1)
    flame.rotation.x = Math.PI / 2
    flame.visible = false
    playerCar.add(flame)

    const nitroLight = new THREE.PointLight(0x00aaff, 0, 8)
    nitroLight.position.set(0, 0.5, 4)
    scene.add(nitroLight)

    const particles = []
    const activeObstacles = []

    const spawnParticles = (pos, color, count) => {
      for (let i = 0; i < count; i++) {
        const mat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 2, transparent: true, opacity: 1 })
        const m = new THREE.Mesh(new THREE.SphereGeometry(0.07, 4, 4), mat)
        m.position.copy(pos)
        scene.add(m)
        const vel = new THREE.Vector3((Math.random() - 0.5) * 0.3, Math.random() * 0.25, (Math.random() - 0.5) * 0.3)
        particles.push({ mesh: m, vel, life: 1, mat })
      }
    }

    const spawnObstacle = (def, lane) => {
      const laneX = -ROAD_W / 2 + LANE_W * 0.5 + lane * LANE_W
      let mesh
      if (def.type === 'hazard') {
        mesh = makeCarMesh(def.color, false, THREE)
        mesh.rotation.y = 0
        mesh.position.set(laneX, 0.13, -80)
        mesh.castShadow = true
        scene.add(mesh)
      } else {
        mesh = new THREE.Mesh(
          new THREE.BoxGeometry(0.6, 0.6, 0.6),
          new THREE.MeshStandardMaterial({ color: def.color, emissive: def.color, emissiveIntensity: 1.5 })
        )
        mesh.position.set(laneX, 0.5, -80)
        scene.add(mesh)
        const gl = new THREE.PointLight(def.color, 1.5, 4)
        gl.position.copy(mesh.position)
        scene.add(gl)
        mesh._light = gl
      }
      return { mesh, lane, laneX, def }
    }

    threeRef.current = {
      renderer,
      scene,
      camera,
      roadSegments,
      laneLines,
      buildings,
      trees,
      lamps,
      trafficLights,
      playerCar,
      flame,
      nitroLight,
      leftEdge,
      rightEdge,
      activeObstacles,
      particles,
      spawnParticles,
      spawnObstacle,
      skyDome,
      stars,
      clock: new THREE.Clock(),
      cameraTarget: cameraTargetRef.current,
      lookTarget: lookTargetRef.current,
    }

    return () => {
      ro.disconnect()
      cancelAnimationFrame(rafRef.current)
      if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current)
      floatTimeoutsRef.current.forEach(clearTimeout)
      floatTimeoutsRef.current = []

      const disposeObject = obj => {
        if (!obj) return
        obj.traverse?.(child => {
          if (child.geometry) child.geometry.dispose()
          if (child.material) {
            if (Array.isArray(child.material)) child.material.forEach(m => m.dispose?.())
            else child.material.dispose?.()
          }
        })
      }

      disposeObject(scene)
      renderer.dispose()
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement)
      threeRef.current = null
    }
  }, [])

  useEffect(() => {
    if (phase !== 'playing') return

    stateRef.current = {
      lane: 2,
      carX: 0,
      carTargetX: 0,
      driftAngle: 0,
      score: 0,
      lives: 3,
      distance: 0,
      speed: 7,
      maxSpeed: 7,
      nitroCharge: 0,
      nitroActive: false,
      nitroFuel: 0,
      combo: 1,
      comboTimer: 0,
      frameCount: 0,
      spawnTimer: 0,
      shakeAmt: 0,
      brakeActive: false,
    }

    const T = threeRef.current
    if (!T) return

    T.activeObstacles.forEach(o => {
      T.scene.remove(o.mesh)
      if (o.mesh._light) T.scene.remove(o.mesh._light)
    })
    T.activeObstacles.length = 0

    if (T.trafficLights) {
      T.trafficLights.forEach(tl => {
        tl.passed = false
        tl.stateIndex = 2
        tl.state = 'green'
        tl.timer = 4 + Math.random() * 3
        tl.lights.forEach((l, i) => {
          if (i === 2) {
            l.material.color.setHex(tl.lightDefs[i].color)
            l.material.emissive.setHex(tl.lightDefs[i].color)
            l.material.emissiveIntensity = 3
          } else {
            l.material.color.setHex(tl.lightDefs[i].offColor)
            l.material.emissive.setHex(0x000000)
            l.material.emissiveIntensity = 0
          }
        })
        tl.glowLight.color.setHex(0x00ff00)
        tl.glowLight.intensity = 2.5
      })
    }

    const loop = () => {
      rafRef.current = requestAnimationFrame(loop)
      const T = threeRef.current
      const g = stateRef.current
      if (!T || !g) return

      const dt = Math.min(T.clock.getDelta(), 0.05)
      const t = T.clock.elapsedTime
      const sm = g.nitroActive ? 2.2 : 1

      g.frameCount++
      g.distance += g.speed * sm * dt * 0.007
      if (g.speed < 14) g.speed += dt * 0.3
      if (g.brakeActive) {
        g.speed -= dt * 25
        if (g.speed < 0.3) g.speed = 0.3
        T.playerCar.children.forEach(c => {
          if (c.isMesh && c.material && c.material.color && c.material.color.getHex() === 0xff1111) {
            c.material.emissive.setHex(0xff2222)
            c.material.emissiveIntensity = 4
          }
        })
      } else {
        T.playerCar.children.forEach(c => {
          if (c.isMesh && c.material && c.material.color && c.material.color.getHex() === 0xff1111) {
            c.material.emissive.setHex(0xff0000)
            c.material.emissiveIntensity = 2
          }
        })
      }
      g.maxSpeed = Math.max(g.maxSpeed, g.speed)

      const scroll = g.speed * sm * dt * 4

      T.roadSegments.forEach(s => {
        s.position.z += scroll
        if (s.position.z > SEG_LEN) s.position.z -= ROAD_SEGS * SEG_LEN
      })

      T.laneLines.forEach(ll => {
        ll.position.z += scroll
        if (ll.position.z > 2) ll.position.z -= ROAD_SEGS * SEG_LEN * 4
      })

      T.lamps.forEach(l => {
        l.pole.position.z += scroll
        l.head.position.z += scroll
        l.pl.position.z += scroll
        if (l.pole.position.z > 16) {
          const back = -(ROAD_SEGS * SEG_LEN + 10)
          l.pole.position.z += back
          l.head.position.z += back
          l.pl.position.z += back
        }
      })

      T.buildings.forEach(b => {
        b.mesh.position.z += g.speed * sm * dt * 1.5
        if (b.mesh.position.z > 40) b.mesh.position.z -= 700
      })

      T.trees.forEach(tr => {
        tr.position.z += g.speed * sm * dt * 1.5
        if (tr.position.z > 40) tr.position.z -= 900
      })

      T.trafficLights.forEach(tl => {
        tl.group.position.z += scroll
        tl.timer -= dt
        if (tl.timer <= 0) {
          tl.stateIndex = (tl.stateIndex + 1) % 3
          const states = ['red', 'yellow', 'green']
          tl.state = states[tl.stateIndex]
          tl.timer = tl.state === 'yellow' ? 1.8 : 4 + Math.random() * 3
          tl.lights.forEach((l, i) => {
            if (i === tl.stateIndex) {
              l.material.color.setHex(tl.lightDefs[i].color)
              l.material.emissive.setHex(tl.lightDefs[i].color)
              l.material.emissiveIntensity = 3
            } else {
              l.material.color.setHex(tl.lightDefs[i].offColor)
              l.material.emissive.setHex(0x000000)
              l.material.emissiveIntensity = 0
            }
          })
          tl.glowLight.color.setHex(tl.lightDefs[tl.stateIndex].color)
          tl.glowLight.intensity = tl.state === 'red' ? 4 : 2.5
        }
        if (tl.group.position.z > 20) {
          tl.group.position.z -= (ROAD_SEGS * SEG_LEN + 60)
          tl.passed = false
          tl.stateIndex = 2
          tl.state = 'green'
          tl.timer = 4 + Math.random() * 3
          tl.lights.forEach((l, i) => {
            if (i === 2) {
              l.material.color.setHex(tl.lightDefs[2].color)
              l.material.emissive.setHex(tl.lightDefs[2].color)
              l.material.emissiveIntensity = 3
            } else {
              l.material.color.setHex(tl.lightDefs[i].offColor)
              l.material.emissive.setHex(0x000000)
              l.material.emissiveIntensity = 0
            }
          })
          tl.glowLight.color.setHex(0x00ff00)
          tl.glowLight.intensity = 2.5
        }
        if (!tl.passed && tl.group.position.z > 2 && tl.group.position.z < 5.5) {
          tl.passed = true
          if (tl.state === 'red') {
            g.lives--
            doShake()
            addFloat('🔴 SEMÁFORO', '#ff0000', 0)
            if (g.lives <= 0) {
              setPhase('dead')
              setHud(h => ({ ...h, lives: 0 }))
            }
          }
        }
      })

      if (g.nitroActive) {
        g.nitroFuel -= dt * 60
        T.flame.visible = true
        T.flame.scale.y = 0.8 + Math.sin(t * 20) * 0.25
        T.nitroLight.intensity = 4 + Math.sin(t * 15)
        T.leftEdge.material.color.setHex(0x00aaff)
        T.leftEdge.material.emissive.setHex(0x00aaff)
        T.rightEdge.material.color.setHex(0x00aaff)
        T.rightEdge.material.emissive.setHex(0x00aaff)
        if (g.nitroFuel <= 0) {
          g.nitroActive = false
          g.nitroFuel = 0
          T.flame.visible = false
          T.nitroLight.intensity = 0
          T.leftEdge.material.color.setHex(0x00ff88)
          T.leftEdge.material.emissive.setHex(0x00ff88)
          T.rightEdge.material.color.setHex(0x00ff88)
          T.rightEdge.material.emissive.setHex(0x00ff88)
        }
      } else {
        g.nitroCharge = Math.min(100, g.nitroCharge + dt * 18)
        T.flame.visible = false
        T.nitroLight.intensity = 0
      }

      if (g.comboTimer > 0) {
        g.comboTimer -= dt
        if (g.comboTimer <= 0) g.combo = 1
      }

      g.carX += (g.carTargetX - g.carX) * Math.min(1, dt * 9)
      g.driftAngle *= Math.pow(0.1, dt)
      T.playerCar.position.x = g.carX
      T.playerCar.rotation.z = g.driftAngle

      g.spawnTimer += dt
      const spawnRate = Math.max(0.5, 2.5 - g.frameCount * 0.0008)
      if (g.spawnTimer >= spawnRate) {
        g.spawnTimer = 0
        const def = OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)]
        const lane = Math.floor(Math.random() * LANES)
        T.activeObstacles.push(T.spawnObstacle(def, lane))
      }

      const carPos = T.playerCar.position
      for (let i = T.activeObstacles.length - 1; i >= 0; i--) {
        const o = T.activeObstacles[i]
        o.mesh.position.z += g.speed * sm * dt * 4
        if (o.mesh._light) o.mesh._light.position.z = o.mesh.position.z

        if (o.def.type === 'bonus') {
          o.mesh.rotation.y += dt * 2.5
          o.mesh.rotation.x += dt * 1.5
          o.mesh.position.y = 0.5 + Math.sin(t * 3 + i) * 0.12
        }

        if (o.mesh.position.z > 12) {
          T.scene.remove(o.mesh)
          if (o.mesh._light) T.scene.remove(o.mesh._light)
          T.activeObstacles.splice(i, 1)
          continue
        }

        const dx = Math.abs(o.mesh.position.x - carPos.x)
        const dz = Math.abs(o.mesh.position.z - carPos.z)
        if (dx < 1.1 && dz < 2.0) {
          T.spawnParticles(o.mesh.position.clone(), o.def.type === 'hazard' ? 0xff3300 : 0xffdd00, 10)

          if (o.def.type === 'hazard') {
            if (!g.nitroActive) {
              g.lives--
              doShake()
              addFloat(`💥 ${o.def.label}`, '#ff4444', o.laneX / ROAD_W)
              if (g.lives <= 0) {
                setPhase('dead')
                setHud(h => ({ ...h, lives: 0 }))
              }
            }
          } else {
            const comboBefore = g.combo
            const bonus = o.def.pts * comboBefore
            g.score += bonus
            g.combo = Math.min(8, g.combo + 1)
            g.comboTimer = 2.5
            if (o.def.nitro) g.nitroCharge = 100
            if (o.def.heal && g.lives < 3) g.lives++
            addFloat(`+${bonus}${comboBefore > 1 ? ` ×${comboBefore}` : ''}`, o.def.nitro ? '#00ccff' : '#ffd700', o.laneX / ROAD_W)
          }

          T.scene.remove(o.mesh)
          if (o.mesh._light) T.scene.remove(o.mesh._light)
          T.activeObstacles.splice(i, 1)
        }
      }

      for (let i = T.particles.length - 1; i >= 0; i--) {
        const p = T.particles[i]
        p.mesh.position.add(p.vel)
        p.vel.y -= dt * 0.3
        p.life -= dt * 1.8
        p.mat.opacity = p.life
        if (p.life <= 0) {
          T.scene.remove(p.mesh)
          T.particles.splice(i, 1)
        }
      }

      T.cameraTarget.set(g.carX * 0.35, 3.5 + g.speed * 0.03, 9 + g.speed * 0.05)
      T.lookTarget.set(g.carX * 0.1, 0.8, -10)
      T.camera.position.lerp(T.cameraTarget, dt * 5)
      T.camera.lookAt(T.lookTarget)

      if (g.shakeAmt > 0) {
        T.camera.position.x += (Math.random() - 0.5) * g.shakeAmt
        T.camera.position.y += (Math.random() - 0.5) * g.shakeAmt
        g.shakeAmt *= 0.88
        if (g.shakeAmt < 0.002) g.shakeAmt = 0
      }

      T.camera.fov = g.nitroActive ? THREE.MathUtils.lerp(T.camera.fov, 80, dt * 5) : THREE.MathUtils.lerp(T.camera.fov, 65, dt * 3)
      T.camera.updateProjectionMatrix()

      if (g.frameCount % 3 === 0) {
        setHud({
          score: g.score,
          lives: g.lives,
          distance: g.distance,
          speed: g.speed,
          nitroCharge: g.nitroCharge,
          nitroActive: g.nitroActive,
          combo: g.combo,
        })
      }

      T.renderer.render(T.scene, T.camera)
    }

    T.clock.start()
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [phase, addFloat, doShake])

  const moveLane = useCallback((dir) => {
    const g = stateRef.current
    if (!g) return
    g.lane = Math.max(0, Math.min(LANES - 1, g.lane + dir))
    g.carTargetX = LANE_XS[g.lane]
    g.driftAngle = dir * 0.06
  }, [])

  const activateNitro = useCallback(() => {
    const g = stateRef.current
    if (!g || g.nitroCharge < 100 || g.nitroActive) return
    g.nitroActive = true
    g.nitroFuel = 100
    g.nitroCharge = 0
  }, [])

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'ArrowLeft') moveLane(-1)
      if (e.key === 'ArrowRight') moveLane(1)
      if (e.key === ' ') {
        e.preventDefault()
        activateNitro()
      }
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault()
        const g = stateRef.current
        if (g) g.brakeActive = true
      }
    }
    const onKeyUp = e => {
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        const g = stateRef.current
        if (g) g.brakeActive = false
      }
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [moveLane, activateNitro])

  const startGame = useCallback(() => {
    setPhase('playing')
    setFloats([])
    setHud({
      score: 0,
      lives: 3,
      distance: 0,
      speed: 7,
      nitroCharge: 0,
      nitroActive: false,
      combo: 1,
    })
  }, [])

  if (phase === 'dead') {
    const g = stateRef.current || {}
    const dist = g.distance ?? 0
    const starsCount = dist >= 5 ? 3 : dist >= 2.5 ? 2 : dist >= 0.8 ? 1 : 0
    const starIcons = ['★', '★', '★'].map((s, i) =>
      <span key={i} style={{ fontSize: 32, color: i < starsCount ? '#ffd700' : 'rgba(255,255,255,0.12)', textShadow: i < starsCount ? '0 0 20px rgba(255,200,0,0.8)' : 'none', margin: '0 4px' }}>★</span>
    )
    return (
      <div style={styles.overlay}>
        <div style={{ fontSize: 56, marginBottom: 4, animation: 'pulse 1.2s ease-in-out infinite' }}>💥</div>
        <div style={{ ...styles.gameOverTitle, animation: 'fadeIn 0.5s ease-out' }}>GAME OVER</div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>{starIcons}</div>
        <div style={{ width: 220, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,200,0,0.4), transparent)', marginBottom: 16 }} />
        <div style={styles.resStat}>
          <span style={{ opacity: 0.4 }}>🏆</span> Puntaje <span style={styles.gold}>{g.score ?? 0}</span>
        </div>
        <div style={styles.resStat}>
          <span style={{ opacity: 0.4 }}>📏</span> Distancia <span style={styles.gold}>{(g.distance ?? 0).toFixed(1)} km</span>
        </div>
        <div style={styles.resStat}>
          <span style={{ opacity: 0.4 }}>🚀</span> Vel. máx <span style={styles.gold}>{Math.round((g.maxSpeed ?? 12) * 14)} km/h</span>
        </div>
        <div style={styles.resStat}>
          <span style={{ opacity: 0.4 }}>⏱️</span> Tiempo <span style={styles.gold}>{Math.max(1, Math.round(g.frameCount / 60))}s</span>
        </div>
        <div style={{ width: 220, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,200,0,0.4), transparent)', marginBottom: 20, marginTop: 4 }} />
        <button style={{ ...styles.startBtn, animation: 'fadeIn 0.8s ease-out' }} onClick={startGame}>▶ REINTENTAR</button>
        {onBack && (
          <button style={{ ...styles.startBtn, marginTop: 12, fontSize: 12, padding: '10px 32px', borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.4)', animation: 'fadeIn 1s ease-out' }} onClick={onBack}>
            ← MENÚ
          </button>
        )}
      </div>
    )
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        background: '#000',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      <div ref={mountRef} style={{ position: 'absolute', inset: 0 }} />

      {phase === 'idle' && (
        <div style={styles.overlay}>
          <div style={{ fontSize: 56, marginBottom: 8 }}>🏎️</div>
          <div style={styles.bigTitle}>GTX RACING</div>
          <div style={styles.subtitle}>Next-Gen Street Racing</div>
          <button style={styles.startBtn} onClick={startGame}>▶ ARRANCAR</button>
          <div style={styles.hint}>← → cambiar carril &nbsp;•&nbsp; ↓ / S = frenar &nbsp;•&nbsp; ESPACIO = nitro</div>
        </div>
      )}

      {phase === 'playing' && (
        <>
          <div style={styles.topBar}>
            <div>
              <div style={{ ...styles.scoreVal, color: hud.nitroActive ? '#00ffff' : '#ffffff', textShadow: `0 0 30px ${hud.nitroActive ? '#00ffff' : 'rgba(255,200,0,0.8)'}` }}>
                {hud.score}
              </div>
              <div style={styles.label}>PTS</div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              {[1, 2, 3].map(i => (
                <span key={i} style={{ fontSize: 20, filter: i <= hud.lives ? 'drop-shadow(0 0 6px #ff4040)' : 'none', opacity: i <= hud.lives ? 1 : 0.2, transition: 'all 0.3s' }}>
                  ♥
                </span>
              ))}
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'monospace', fontSize: 18, color: '#00e676' }}>{hud.distance.toFixed(1)} km</div>
              <div style={styles.label}>{Math.round(hud.speed * 14)} km/h</div>
            </div>
          </div>

          {hud.combo > 1 && <div style={styles.comboBadge}>×{hud.combo} COMBO</div>}

          <div style={styles.nitroWrap}>
            <div style={styles.nitroLabel}>⚡ NITRO</div>
            <div style={styles.nitroBarBg}>
              <div style={{ ...styles.nitroBarFill, width: `${hud.nitroActive ? (stateRef.current?.nitroFuel ?? 0) : hud.nitroCharge}%` }} />
            </div>
            {hud.nitroCharge >= 100 && !hud.nitroActive && (
              <button style={styles.nitroBtn} onPointerDown={activateNitro}>⚡ BOOST</button>
            )}
          </div>

          {floats.map(f => (
            <div key={f.id} style={{ ...styles.floatText, color: f.color, left: `${(f.screenX * 0.5 + 0.5) * 100}%` }}>
              {f.text}
            </div>
          ))}

          <div style={styles.mobileControls}>
            <button style={styles.mobBtn} onPointerDown={() => moveLane(-1)}>◀</button>
            <button style={{ ...styles.mobBtn, borderColor: 'rgba(255,80,80,0.4)', color: '#ff5555' }} onPointerDown={() => { const g = stateRef.current; if (g) g.brakeActive = true }} onPointerUp={() => { const g = stateRef.current; if (g) g.brakeActive = false }} onPointerLeave={() => { const g = stateRef.current; if (g) g.brakeActive = false }}>⛞</button>
            <button style={{ ...styles.mobBtn, borderColor: hud.nitroCharge >= 100 ? 'rgba(0,200,255,0.7)' : 'rgba(255,255,255,0.15)', color: hud.nitroCharge >= 100 ? '#0af' : '#fff' }} onPointerDown={activateNitro}>⚡</button>
            <button style={styles.mobBtn} onPointerDown={() => moveLane(1)}>▶</button>
          </div>
        </>
      )}

      <style>{`
        @keyframes floatUp {
          0% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-80px) scale(1.5); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'absolute',
    inset: 0,
    zIndex: 50,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0,0,0,0.88)',
    gap: 12,
  },
  bigTitle: {
    fontFamily: 'monospace',
    fontSize: 48,
    fontWeight: 800,
    color: '#fff',
    letterSpacing: 10,
    textTransform: 'uppercase',
    textShadow: '0 0 40px rgba(255,200,0,0.6)',
  },
  subtitle: { fontSize: 12, letterSpacing: 5, color: 'rgba(255,255,255,0.35)', marginBottom: 32 },
  startBtn: {
    padding: '16px 56px',
    border: '2px solid rgba(255,200,0,0.8)',
    background: 'transparent',
    color: '#ffd700',
    fontSize: 15,
    letterSpacing: 6,
    cursor: 'pointer',
    textTransform: 'uppercase',
    fontWeight: 700,
    fontFamily: 'monospace',
  },
  hint: { fontSize: 10, letterSpacing: 3, color: 'rgba(255,255,255,0.2)', marginTop: 8 },
  gameOverTitle: {
    fontFamily: 'monospace',
    fontSize: 40,
    fontWeight: 800,
    color: '#fff',
    letterSpacing: 8,
    marginBottom: 32,
  },
  resStat: { fontSize: 14, letterSpacing: 3, color: 'rgba(255,255,255,0.55)', marginBottom: 8, fontFamily: 'monospace' },
  gold: { color: '#ffd700' },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)',
  },
  scoreVal: { fontFamily: 'monospace', fontSize: 40, fontWeight: 700, lineHeight: 1, transition: 'color 0.3s, text-shadow 0.3s' },
  label: { fontSize: 9, letterSpacing: 4, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginTop: 2 },
  comboBadge: {
    position: 'absolute',
    top: 80,
    right: 24,
    zIndex: 20,
    fontFamily: 'monospace',
    fontSize: 26,
    fontWeight: 700,
    color: '#ffd700',
    textShadow: '0 0 20px rgba(255,200,0,0.9)',
  },
  nitroWrap: {
    position: 'absolute',
    bottom: 100,
    left: 24,
    zIndex: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    width: 180,
  },
  nitroLabel: { fontSize: 10, letterSpacing: 4, color: 'rgba(0,200,255,0.7)', textTransform: 'uppercase', fontFamily: 'monospace' },
  nitroBarBg: { width: '100%', height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' },
  nitroBarFill: { height: '100%', background: 'linear-gradient(90deg,#0af,#07f)', borderRadius: 3, transition: 'width 0.1s' },
  nitroBtn: {
    padding: '10px 20px',
    border: '1px solid #0af',
    background: 'rgba(0,100,200,0.2)',
    color: '#0af',
    fontSize: 12,
    letterSpacing: 3,
    cursor: 'pointer',
    borderRadius: 6,
    textTransform: 'uppercase',
    fontFamily: 'monospace',
    boxShadow: '0 0 20px rgba(0,170,255,0.3)',
  },
  floatText: {
    position: 'absolute',
    top: '40%',
    zIndex: 100,
    fontFamily: 'monospace',
    fontSize: 22,
    fontWeight: 700,
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
    textShadow: '0 0 20px currentColor',
    animation: 'floatUp 0.9s ease-out forwards',
    transform: 'translateX(-50%)',
  },
  mobileControls: {
    position: 'absolute',
    bottom: 24,
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: 12,
    zIndex: 20,
  },
  mobBtn: {
    width: 70,
    height: 56,
    border: '1px solid rgba(255,255,255,0.15)',
    background: 'rgba(255,255,255,0.06)',
    color: '#fff',
    fontSize: 22,
    cursor: 'pointer',
    borderRadius: 10,
    WebkitTapHighlightColor: 'transparent',
  }}