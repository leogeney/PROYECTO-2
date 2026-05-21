import React, { useState, useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'
import { useNotification } from '../context/NotificationContext'

const ROAD_W = 12
const ROAD_SEGS = 40
const SEG_LEN = 10
const LANES = 3
const LANE_W = ROAD_W / LANES
const LANE_XS = [-4, 0, 4]

// Función para crear un coche REALISTA (sedán deportivo)
function makeRealisticCar(bodyColor, isPlayer, THREE) {
  const group = new THREE.Group()
  
  // Carrocería principal (sedán)
  const bodyGeo = new THREE.BoxGeometry(1.8, 0.45, 4.2)
  const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.3, metalness: 0.85 })
  const body = new THREE.Mesh(bodyGeo, bodyMat)
  body.position.y = 0.25
  body.castShadow = true
  body.receiveShadow = true
  group.add(body)
  
  // Techo (más bajo, más aerodinámico)
  const roofGeo = new THREE.BoxGeometry(1.5, 0.32, 2.4)
  const roofMat = new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.25, metalness: 0.9 })
  const roof = new THREE.Mesh(roofGeo, roofMat)
  roof.position.set(0, 0.55, -0.3)
  roof.castShadow = true
  group.add(roof)
  
  // Capó (más bajo)
  const hoodGeo = new THREE.BoxGeometry(1.6, 0.15, 1.2)
  const hoodMat = new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.2, metalness: 0.9 })
  const hood = new THREE.Mesh(hoodGeo, hoodMat)
  hood.position.set(0, 0.38, 1.4)
  group.add(hood)
  
  // Maletero
  const trunkGeo = new THREE.BoxGeometry(1.6, 0.2, 1.0)
  const trunk = new THREE.Mesh(trunkGeo, bodyMat)
  trunk.position.set(0, 0.35, -1.5)
  group.add(trunk)
  
  // Ventanas (cristal oscuro)
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x1a2a3a, roughness: 0.1, metalness: 0.95, emissive: 0x0a1a2a, emissiveIntensity: 0.3 })
  
  // Luneta delantera
  const frontWindshield = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.28, 0.9), glassMat)
  frontWindshield.position.set(0, 0.62, 0.9)
  group.add(frontWindshield)
  
  // Luneta trasera
  const rearWindshield = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.28, 0.9), glassMat)
  rearWindshield.position.set(0, 0.62, -1.3)
  group.add(rearWindshield)
  
  // Ventanas laterales
  const sideWindowMat = new THREE.MeshStandardMaterial({ color: 0x2a3a4a, roughness: 0.1, metalness: 0.9 })
  const leftWindow = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.3, 1.8), sideWindowMat)
  leftWindow.position.set(-0.95, 0.58, -0.2)
  group.add(leftWindow)
  
  const rightWindow = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.3, 1.8), sideWindowMat)
  rightWindow.position.set(0.95, 0.58, -0.2)
  group.add(rightWindow)
  
  // Faros delanteros
  const headlightMat = new THREE.MeshStandardMaterial({ color: 0xffaa88, emissive: 0xff4422, emissiveIntensity: 0.8 })
  const leftHeadlight = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), headlightMat)
  leftHeadlight.position.set(-0.65, 0.28, 2.05)
  group.add(leftHeadlight)
  
  const rightHeadlight = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), headlightMat)
  rightHeadlight.position.set(0.65, 0.28, 2.05)
  group.add(rightHeadlight)
  
  // Luces traseras
  const tailMat = new THREE.MeshStandardMaterial({ color: 0xcc2200, emissive: 0xff0000, emissiveIntensity: 0.5 })
  const leftTail = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), tailMat)
  leftTail.position.set(-0.68, 0.28, -2.05)
  group.add(leftTail)
  
  const rightTail = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), tailMat)
  rightTail.position.set(0.68, 0.28, -2.05)
  group.add(rightTail)
  
  // Ruedas realistas
  const wheelGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.5, 24)
  const tireMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8, metalness: 0.1 })
  const rimMat = new THREE.MeshStandardMaterial({ color: 0xccccdd, metalness: 0.95, roughness: 0.2 })
  
  const wheelPositions = [
    [-0.9, 0.18, 1.3], [0.9, 0.18, 1.3],
    [-0.9, 0.18, -1.4], [0.9, 0.18, -1.4]
  ]
  
  wheelPositions.forEach(([x, y, z]) => {
    const wheel = new THREE.Mesh(wheelGeo, tireMat)
    wheel.rotation.z = Math.PI / 2
    wheel.position.set(x, y, z)
    wheel.castShadow = true
    group.add(wheel)
    
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.52, 8), rimMat)
    rim.rotation.z = Math.PI / 2
    rim.position.set(x, y, z)
    group.add(rim)
  })
  
  if (isPlayer) {
    // Luces LED diurnas
    const drlMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x88aaff, emissiveIntensity: 1.5 })
    const leftDrl = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.05), drlMat)
    leftDrl.position.set(-0.78, 0.22, 2.08)
    group.add(leftDrl)
    
    const rightDrl = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.05), drlMat)
    rightDrl.position.set(0.78, 0.22, 2.08)
    group.add(rightDrl)
    
    // Escape deportivo
    const exhaustMat = new THREE.MeshStandardMaterial({ color: 0x886644, metalness: 0.9, roughness: 0.3 })
    const exhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.4, 8), exhaustMat)
    exhaust.rotation.x = Math.PI / 2
    exhaust.position.set(0.65, 0.12, -2.1)
    group.add(exhaust)
  }
  
  return group
}

// Semáforo realista
function makeRealisticTrafficLight(zPos, THREE) {
  const group = new THREE.Group()
  
  // Poste metálico
  const poleMat = new THREE.MeshStandardMaterial({ color: 0x556677, metalness: 0.7, roughness: 0.4 })
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 5.5, 8), poleMat)
  pole.position.set(-ROAD_W / 2 - 0.8, 2.75, 0)
  group.add(pole)
  
  // Brazo horizontal
  const armMat = new THREE.MeshStandardMaterial({ color: 0x667788, metalness: 0.6 })
  const arm = new THREE.Mesh(new THREE.BoxGeometry(ROAD_W + 2.5, 0.15, 0.35), armMat)
  arm.position.set(0, 4.2, 0)
  group.add(arm)
  
  // Caja del semáforo
  const boxMat = new THREE.MeshStandardMaterial({ color: 0x334455, roughness: 0.3, metalness: 0.5 })
  const lightBox = new THREE.Mesh(new THREE.BoxGeometry(0.9, 2.2, 0.5), boxMat)
  lightBox.position.set(0, 4.2, 0.4)
  group.add(lightBox)
  
  // Marco negro alrededor
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.2 })
  const frame = new THREE.Mesh(new THREE.BoxGeometry(1.0, 2.4, 0.55), frameMat)
  frame.position.set(0, 4.2, 0.38)
  group.add(frame)
  
  // Luz ROJA
  const redLightMat = new THREE.MeshStandardMaterial({ color: 0xcc0000, emissive: 0xff0000, emissiveIntensity: 0.8 })
  const redLight = new THREE.Mesh(new THREE.SphereGeometry(0.28, 24, 24), redLightMat)
  redLight.position.set(0, 4.8, 0.65)
  group.add(redLight)
  
  // Luz AMARILLA (centro)
  const yellowLightMat = new THREE.MeshStandardMaterial({ color: 0xcc8800, emissive: 0xffaa00, emissiveIntensity: 0.3 })
  const yellowLight = new THREE.Mesh(new THREE.SphereGeometry(0.28, 24, 24), yellowLightMat)
  yellowLight.position.set(0, 4.2, 0.65)
  group.add(yellowLight)
  
  // Luz VERDE
  const greenLightMat = new THREE.MeshStandardMaterial({ color: 0x00cc00, emissive: 0x00ff00, emissiveIntensity: 0.3 })
  const greenLight = new THREE.Mesh(new THREE.SphereGeometry(0.28, 24, 24), greenLightMat)
  greenLight.position.set(0, 3.6, 0.65)
  group.add(greenLight)
  
  group.position.set(0, 0, zPos)
  
  return { group, redLight, yellowLight, greenLight }
}

export function VirtualDriver({ onBack }) {
  const mountRef = useRef(null)
  const threeRef = useRef(null)
  const stateRef = useRef(null)
  const rafRef = useRef(null)
  const floatTimeoutsRef = useRef([])

  const [phase, setPhase] = useState('idle')
  const [hud, setHud] = useState({
    speed: 0,
    rpm: 0,
    gear: 1,
    fuel: 85,
    distance: 0,
    score: 0,
    lives: 3,
    trafficState: '🟢',
    trafficTimer: 0
  })
  const [floats, setFloats] = useState([])
  const { showNotification } = useNotification()

  const addFloat = useCallback((text, color) => {
    const id = Math.random()
    setFloats(f => [...f, { id, text, color }])
    const t = setTimeout(() => {
      setFloats(f => f.filter(ff => ff.id !== id))
    }, 1000)
    floatTimeoutsRef.current.push(t)
  }, [])

  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.setSize(el.clientWidth, el.clientHeight)
    el.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0a1428)
    scene.fog = new THREE.FogExp2(0x0a1428, 0.008)

    // Cámara realista (tercera persona desde atrás)
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 500)
    camera.position.set(0, 2.2, -4.5)

    const resize = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', resize)
    resize()

    // Iluminación realista
    const ambientLight = new THREE.AmbientLight(0x223344, 0.6)
    scene.add(ambientLight)
    
    const mainLight = new THREE.DirectionalLight(0xfff5e0, 1.5)
    mainLight.position.set(10, 20, 5)
    mainLight.castShadow = true
    mainLight.shadow.mapSize.set(2048, 2048)
    scene.add(mainLight)
    
    const fillLight = new THREE.PointLight(0x4466aa, 0.4)
    fillLight.position.set(-5, 5, 10)
    scene.add(fillLight)
    
    const backLight = new THREE.PointLight(0xffaa66, 0.3)
    backLight.position.set(0, 3, -8)
    scene.add(backLight)

    // Carretera
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x1a1a2a, roughness: 0.7, metalness: 0.1 })
    const road = new THREE.Mesh(new THREE.PlaneGeometry(ROAD_W, 500), roadMat)
    road.rotation.x = -Math.PI / 2
    road.position.set(0, -0.05, -250)
    road.receiveShadow = true
    scene.add(road)
    
    // Marcas de carril
    const lineMat = new THREE.MeshStandardMaterial({ color: 0xffdd88, emissive: 0xffaa44, emissiveIntensity: 0.3 })
    for (let i = -250; i < 250; i += 15) {
      const line = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.05, 3), lineMat)
      line.position.set(0, -0.02, i)
      scene.add(line)
    }
    
    // Bordes de carretera
    const edgeMat = new THREE.MeshStandardMaterial({ color: 0x88aacc })
    for (let side of [-6.2, 6.2]) {
      const edge = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.1, 500), edgeMat)
      edge.position.set(side, -0.03, -250)
      scene.add(edge)
    }
    
    // Postes de luz
    const lampMat = new THREE.MeshStandardMaterial({ color: 0x667788, metalness: 0.7 })
    for (let i = -200; i < 200; i += 30) {
      for (let side of [-7, 7]) {
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, 5, 6), lampMat)
        pole.position.set(side, 2.5, i)
        pole.castShadow = true
        scene.add(pole)
        
        const light = new THREE.PointLight(0xffaa66, 0.8, 25)
        light.position.set(side, 4.5, i)
        scene.add(light)
      }
    }
    
    // Árboles
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x8B5A2B })
    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x2d5a27 })
    for (let i = -200; i < 200; i += 25) {
      for (let side of [-9, 9]) {
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 1.5, 6), trunkMat)
        trunk.position.set(side + (Math.random() - 0.5) * 1.5, 0.75, i + (Math.random() - 0.5) * 5)
        trunk.castShadow = true
        scene.add(trunk)
        
        const foliage = new THREE.Mesh(new THREE.ConeGeometry(0.8, 1.2, 8), foliageMat)
        foliage.position.set(side + (Math.random() - 0.5) * 1.5, 1.6, i + (Math.random() - 0.5) * 5)
        foliage.castShadow = true
        scene.add(foliage)
      }
    }
    
    // Coche del jugador
    const playerCar = makeRealisticCar(0xc41e3a, true, THREE)
    playerCar.position.set(0, 0, 0)
    playerCar.castShadow = true
    scene.add(playerCar)
    
    // Semáforos
    const trafficLights = []
    const trafficStates = ['red', 'yellow', 'green']
    let trafficIndex = 0
    let trafficTimer = 0
    
    // Crear semáforos a lo largo del camino
    for (let z = -80; z >= -400; z -= 120) {
      const { group, redLight, yellowLight, greenLight } = makeRealisticTrafficLight(z, THREE)
      scene.add(group)
      trafficLights.push({ group, redLight, yellowLight, greenLight, state: 'red', z })
    }
    
    // Edificios a los lados
    const buildingMat = new THREE.MeshStandardMaterial({ color: 0x3a4a5a, roughness: 0.4 })
    for (let i = -180; i < 180; i += 40) {
      for (let side of [-14, 14]) {
        const height = 5 + Math.random() * 8
        const building = new THREE.Mesh(new THREE.BoxGeometry(3 + Math.random() * 2, height, 4 + Math.random() * 2), buildingMat)
        building.position.set(side, height / 2, i + (Math.random() - 0.5) * 20)
        building.castShadow = true
        scene.add(building)
        
        // Ventanas
        const windowMat = new THREE.MeshStandardMaterial({ color: 0xffaa66, emissive: 0xff8844, emissiveIntensity: 0.2 })
        for (let w = 0; w < 4; w++) {
          const windowGeo = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.2, 0.1), windowMat)
          windowGeo.position.set(side + (Math.random() - 0.5) * 2, 2 + Math.random() * (height - 3), i + (Math.random() - 0.5) * 3)
          scene.add(windowGeo)
        }
      }
    }
    
    threeRef.current = {
      renderer, scene, camera, playerCar, trafficLights,
      clock: new THREE.Clock(), trafficTimer, trafficIndex,
      trafficStates, roadOffset: 0
    }
    
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafRef.current)
      renderer.dispose()
      floatTimeoutsRef.current.forEach(clearTimeout)
    }
  }, [])
  
  useEffect(() => {
    if (phase !== 'playing') return
    
    let animationId
    let lastTime = performance.now()
    
    const gameState = {
      speed: 0,
      targetSpeed: 0,
      rpm: 0,
      gear: 1,
      fuel: 85,
      distance: 0,
      score: 0,
      lives: 3,
      lane: 1,
      laneTarget: 1,
      steering: 0,
      steeringReturn: 0,
      brakingForce: 0,
      trafficTimer: 3,
      trafficState: 'red',
      lastTrafficZ: -80
    }
    
    const T = threeRef.current
    if (!T) return
    
    const animate = () => {
      const now = performance.now()
      let dt = Math.min((now - lastTime) / 1000, 0.033)
      lastTime = now
      if (dt < 0.01) dt = 0.016
      
      // Física realista
      const throttleInput = 0.6 // Aceleración constante
      const brakeInput = gameState.brakingForce
      
      // Aceleración progresiva
      if (throttleInput > 0 && brakeInput === 0) {
        const acceleration = 15 * dt
        gameState.targetSpeed = Math.min(180, gameState.targetSpeed + acceleration)
      } else if (brakeInput > 0) {
        const deceleration = 25 * brakeInput * dt
        gameState.targetSpeed = Math.max(0, gameState.targetSpeed - deceleration)
      }
      
      // Resistencia aerodinámica y fricción
      const drag = 0.015 * gameState.targetSpeed * dt
      gameState.targetSpeed = Math.max(0, gameState.targetSpeed - drag)
      
      // Suavizado de velocidad
      gameState.speed += (gameState.targetSpeed - gameState.speed) * 0.1
      
      // RPM basado en velocidad y marcha
      const speedsPerGear = [0, 45, 85, 130, 180]
      const rpmBase = (gameState.speed / speedsPerGear[gameState.gear]) * 7000
      gameState.rpm = Math.min(7000, Math.max(800, rpmBase))
      
      // Cambio de marcha automático
      if (gameState.rpm > 6500 && gameState.gear < 5) {
        gameState.gear++
        addFloat(`⚙️ ${gameState.gear}ª`, '#88aaff')
      } else if (gameState.rpm < 1200 && gameState.gear > 1) {
        gameState.gear--
        addFloat(`⚙️ ${gameState.gear}ª`, '#88aaff')
      }
      
      // Movimiento de la carretera
      const moveDistance = gameState.speed * dt
      gameState.distance += moveDistance / 100
      
      // Mover semáforos
      for (const tl of T.trafficLights) {
        tl.group.position.z += moveDistance
        if (tl.group.position.z > 20) {
          tl.group.position.z = -380
          // Resetear estado del semáforo
          tl.state = 'red'
          tl.redLight.material.emissiveIntensity = 1.2
          tl.yellowLight.material.emissiveIntensity = 0.1
          tl.greenLight.material.emissiveIntensity = 0.1
        }
        
        // Lógica de cambio de semáforo
        if (tl.group.position.z > -15 && tl.group.position.z < 15) {
          const timeInZone = (Date.now() / 1000) % 12
          let newState = 'red'
          if (timeInZone < 3) newState = 'red'
          else if (timeInZone < 4) newState = 'yellow'
          else newState = 'green'
          
          if (newState !== tl.state) {
            tl.state = newState
            // Actualizar colores
            tl.redLight.material.emissiveIntensity = newState === 'red' ? 1.2 : 0.1
            tl.yellowLight.material.emissiveIntensity = newState === 'yellow' ? 1.0 : 0.1
            tl.greenLight.material.emissiveIntensity = newState === 'green' ? 1.0 : 0.1
            
            // Verificar si el jugador está cerca y el semáforo está en rojo
            if (newState === 'red' && Math.abs(tl.group.position.z) < 25) {
              addFloat('🔴 SEMÁFORO ROJO - FRENA 🔴', '#ff4444')
              if (gameState.speed > 30) {
                gameState.lives--
                addFloat('💥 MULTAS POR PASAR EN ROJO 💥', '#ff0000')
                if (gameState.lives <= 0) {
                  setPhase('dead')
                }
              }
            } else if (newState === 'green' && Math.abs(tl.group.position.z) < 25) {
              addFloat('🟢 SEMÁFORO VERDE - ADELANTE 🟢', '#44ff44')
              gameState.score += 50
            }
          }
        }
      }
      
      // Movimiento de la cámara (realista)
      const targetCamX = gameState.steering * 0.8
      const targetCamY = 2.0 + gameState.speed * 0.002
      T.camera.position.x += (targetCamX - T.camera.position.x) * 0.05
      T.camera.position.y += (targetCamY - T.camera.position.y) * 0.05
      T.camera.position.z = -4.5 + (gameState.speed / 180) * 1.5
      T.camera.lookAt(0, 0.5, gameState.steering * 2)
      
      // Rotación de ruedas (efecto visual)
      const wheelRotation = moveDistance * 3
      
      // Actualizar HUD
      setHud({
        speed: Math.floor(gameState.speed),
        rpm: Math.floor(gameState.rpm),
        gear: gameState.gear,
        fuel: Math.max(0, gameState.fuel - 0.005),
        distance: gameState.distance,
        score: gameState.score,
        lives: gameState.lives,
        trafficState: gameState.trafficState === 'red' ? '🔴' : gameState.trafficState === 'yellow' ? '🟡' : '🟢',
        trafficTimer: Math.ceil(gameState.trafficTimer)
      })
      
      T.renderer.render(T.scene, T.camera)
      animationId = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [phase, addFloat])
  
  // Controles realistas
  useEffect(() => {
    const gameState = { brakingForce: 0, steering: 0, laneTarget: 1, lane: 1 }
    let brakeInterval
    
    const onKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        if (gameState.lane > 0) {
          gameState.laneTarget = gameState.lane - 1
        }
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        if (gameState.lane < 2) {
          gameState.laneTarget = gameState.lane + 1
        }
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        gameState.brakingForce = 0.8
        addFloat('🛑 FRENANDO 🛑', '#ffaa44')
      }
    }
    
    const onKeyUp = (e) => {
      if (e.key === 'ArrowDown') {
        gameState.brakingForce = 0
      }
    }
    
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    
    const moveInterval = setInterval(() => {
      if (stateRef.current) {
        const diff = gameState.laneTarget - gameState.lane
        if (Math.abs(diff) > 0.01) {
          gameState.lane += diff * 0.2
        } else {
          gameState.lane = gameState.laneTarget
        }
        stateRef.current.lane = gameState.lane
        stateRef.current.steering = (gameState.lane - 1) * 0.8
        stateRef.current.brakingForce = gameState.brakingForce
      }
    }, 16)
    
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      clearInterval(moveInterval)
    }
  }, [])
  
  const startGame = () => {
    setPhase('playing')
    setHud({
      speed: 0,
      rpm: 800,
      gear: 1,
      fuel: 85,
      distance: 0,
      score: 0,
      lives: 3,
      trafficState: '🟢',
      trafficTimer: 0
    })
  }
  
  if (phase === 'dead') {
    return (
      <div style={styles.overlay}>
        <div style={styles.gameOverTitle}>GAME OVER</div>
        <div style={styles.resStat}>Puntaje: <span style={styles.gold}>{hud.score}</span></div>
        <div style={styles.resStat}>Distancia: <span style={styles.gold}>{hud.distance.toFixed(1)} km</span></div>
        <button style={styles.startBtn} onClick={startGame}>▶ REINTENTAR</button>
        {onBack && (
          <button style={{ ...styles.startBtn, marginTop: 12 }} onClick={onBack}>← MENÚ</button>
        )}
      </div>
    )
  }
  
  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', background: '#0a1428', overflow: 'hidden' }}>
      <div ref={mountRef} style={{ position: 'absolute', inset: 0 }} />
      
      {phase === 'idle' && (
        <div style={styles.overlay}>
          <div style={{ fontSize: 64, marginBottom: 8 }}>🏎️</div>
          <div style={styles.bigTitle}>DRIVING ACADEMY</div>
          <div style={styles.subtitle}>Realistic Driving Simulator</div>
          <button style={styles.startBtn} onClick={startGame}>▶ START DRIVING</button>
          <div style={styles.hint}>← → cambiar carril &nbsp;•&nbsp; ↓ FRENAR</div>
        </div>
      )}
      
      {phase === 'playing' && (
        <>
          {/* HUD Realista - Velocímetro */}
          <div style={styles.speedometer}>
            <div style={styles.speedValue}>{hud.speed}</div>
            <div style={styles.speedUnit}>km/h</div>
            <div style={styles.rpmBar}>
              <div style={{ ...styles.rpmFill, width: `${(hud.rpm / 7000) * 100}%`, background: hud.rpm > 6000 ? '#ff4444' : '#44ff44' }} />
            </div>
            <div style={styles.gearDisplay}>{hud.gear}ª</div>
          </div>
          
          {/* Panel derecho */}
          <div style={styles.rightPanel}>
            <div style={styles.stat}>❤️ {hud.lives}</div>
            <div style={styles.stat}>⭐ {hud.score}</div>
            <div style={styles.stat}>📊 {hud.distance.toFixed(1)} km</div>
            <div style={styles.trafficLight}>
              <div style={{ ...styles.light, background: hud.trafficState === '🔴' ? '#ff0000' : '#330000', boxShadow: hud.trafficState === '🔴' ? '0 0 10px #ff0000' : 'none' }} />
              <div style={{ ...styles.light, background: hud.trafficState === '🟡' ? '#ffaa00' : '#332200', boxShadow: hud.trafficState === '🟡' ? '0 0 10px #ffaa00' : 'none' }} />
              <div style={{ ...styles.light, background: hud.trafficState === '🟢' ? '#00ff00' : '#003300', boxShadow: hud.trafficState === '🟢' ? '0 0 10px #00ff00' : 'none' }} />
            </div>
          </div>
          
          {/* Mensajes flotantes */}
          {floats.map(f => (
            <div key={f.id} style={{ ...styles.floatText, color: f.color }}>{f.text}</div>
          ))}
        </>
      )}
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
    background: 'rgba(0,0,0,0.9)',
    gap: 12,
  },
  bigTitle: {
    fontFamily: 'monospace',
    fontSize: 42,
    fontWeight: 800,
    color: '#fff',
    letterSpacing: 8,
    textTransform: 'uppercase',
  },
  subtitle: { fontSize: 12, letterSpacing: 4, color: 'rgba(255,255,255,0.4)', marginBottom: 32 },
  startBtn: {
    padding: '14px 48px',
    border: '2px solid #ffd700',
    background: 'transparent',
    color: '#ffd700',
    fontSize: 14,
    letterSpacing: 4,
    cursor: 'pointer',
    textTransform: 'uppercase',
    fontWeight: 700,
    fontFamily: 'monospace',
  },
  hint: { fontSize: 10, letterSpacing: 2, color: 'rgba(255,255,255,0.25)', marginTop: 16 },
  gameOverTitle: {
    fontFamily: 'monospace',
    fontSize: 38,
    fontWeight: 800,
    color: '#fff',
    letterSpacing: 6,
    marginBottom: 24,
  },
  resStat: { fontSize: 14, letterSpacing: 2, color: 'rgba(255,255,255,0.5)', marginBottom: 8, fontFamily: 'monospace' },
  gold: { color: '#ffd700' },
  
  // HUD Realista
  speedometer: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    zIndex: 20,
    background: 'rgba(0,0,0,0.75)',
    backdropFilter: 'blur(8px)',
    borderRadius: 20,
    padding: '16px 24px',
    border: '1px solid rgba(255,255,255,0.15)',
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  speedValue: { fontSize: 48, fontWeight: 800, color: '#44ff44', lineHeight: 1, textShadow: '0 0 20px #44ff44' },
  speedUnit: { fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: 2, marginTop: 4 },
  rpmBar: { width: 120, height: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 2, marginTop: 12, overflow: 'hidden' },
  rpmFill: { height: '100%', transition: 'width 0.05s linear' },
  gearDisplay: { fontSize: 18, fontWeight: 700, color: '#ffd700', marginTop: 8 },
  
  rightPanel: {
    position: 'absolute',
    top: 30,
    right: 30,
    zIndex: 20,
    background: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(8px)',
    borderRadius: 16,
    padding: '12px 20px',
    textAlign: 'right',
    fontFamily: 'monospace',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  stat: { fontSize: 14, color: '#fff', marginBottom: 4 },
  trafficLight: { display: 'flex', gap: 6, marginTop: 12, justifyContent: 'center' },
  light: { width: 20, height: 20, borderRadius: '50%', transition: 'all 0.2s' },
  floatText: {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 100,
    fontFamily: 'monospace',
    fontSize: 20,
    fontWeight: 700,
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
    textShadow: '0 0 10px currentColor',
    animation: 'floatUp 1s ease-out forwards',
  },
}