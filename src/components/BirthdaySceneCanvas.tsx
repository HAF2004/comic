import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  ExperienceStepId,
  computeExponentialDamp,
  getStepConfig,
} from '../utils/experienceState';
import {
  createLinenBumpTexture,
  createRadialContactShadowTexture,
  createTabletopSunlightTexture,
} from '../three/proceduralTextures';
import {
  buildEnvelopeGroup,
  buildFloatingPetalsInstancedMesh,
  buildGiftBoxGroup,
  buildTulipBouquetGroup,
} from '../three/proceduralModels';

interface BirthdaySceneCanvasProps {
  currentStep: ExperienceStepId;
  reducedMotion: boolean;
  onScenePrimaryInteract: () => void;
}

// Module-scope pre-allocated math helpers for zero GC inside requestAnimationFrame
const _targetCamPos = new THREE.Vector3(0, 3.45, 4.65);
const _currentLookAt = new THREE.Vector3(0, 0.38, 0.1);
const _targetLookAt = new THREE.Vector3(0, 0.38, 0.1);
const _dummyObj = new THREE.Object3D();
const _raycaster = new THREE.Raycaster();
const _pointerNdc = new THREE.Vector2();

export function BirthdaySceneCanvas({
  currentStep,
  reducedMotion,
  onScenePrimaryInteract,
}: BirthdaySceneCanvasProps) {
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const requestRenderRef = useRef<(() => void) | null>(null);

  const stateRef = useRef({
    currentStep,
    reducedMotion,
    onScenePrimaryInteract,
  });

  useEffect(() => {
    stateRef.current = {
      currentStep,
      reducedMotion,
      onScenePrimaryInteract,
    };
    if (requestRenderRef.current) {
      requestRenderRef.current();
    }
  }, [currentStep, reducedMotion, onScenePrimaryInteract]);

  useEffect(() => {
    const container = canvasMountRef.current;
    if (!container) return;

    const isHeadless =
      navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isHeadless,
        powerPreference: 'high-performance',
        preserveDrawingBuffer: isHeadless,
      });
    } catch {
      return;
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.96;
    renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isHeadless;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f3ee);
    scene.fog = new THREE.FogExp2(0xf8f3ee, 0.065);

    // Subtle Studio PBR Environment Reflection
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.24;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 45);
    camera.position.set(0, 3.45, 4.65);
    camera.lookAt(0, 0.38, 0.1);

    // Balanced Studio 3-Point Lighting with Warm/Cool Contrast
    const hemiLight = new THREE.HemisphereLight(0xfffdf9, 0xeadcd3, 0.56);
    hemiLight.position.set(0, 12, 0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff5e8, 1.05);
    keyLight.position.set(3.8, 6.2, 3.4);
    keyLight.castShadow = !isHeadless;
    const d = 4.2;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 16;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xf5d6dc, 0.32);
    rimLight.position.set(-3.5, 4.2, -3.2);
    scene.add(rimLight);

    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const linenBump = createLinenBumpTexture();
    const tableMap = createTabletopSunlightTexture(maxAniso);

    // Expansive 64x64 Tabletop Ground Plane blended seamlessly into #F8F3EE fog (zero horizon line)
    const tableGeo = new THREE.PlaneGeometry(64, 64);
    tableGeo.rotateX(-Math.PI / 2);
    const tableMat = new THREE.MeshStandardMaterial({
      color: 0xfffcf8,
      map: tableMap,
      roughness: 0.94,
      metalness: 0.0,
      bumpMap: linenBump,
      bumpScale: 0.004,
    });
    const tableMesh = new THREE.Mesh(tableGeo, tableMat);
    tableMesh.receiveShadow = true;
    scene.add(tableMesh);

    // Soft Radial Contact Shadow Discs (y = 0.015, depthWrite = false)
    const shadowTex = createRadialContactShadowTexture();
    const contactShadowGeo = new THREE.CircleGeometry(1.55, 32);
    contactShadowGeo.rotateX(-Math.PI / 2);
    const contactShadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.52,
      depthWrite: false,
    });
    const primaryContactShadow = new THREE.Mesh(contactShadowGeo, contactShadowMat);
    primaryContactShadow.position.set(0, 0.015, 0.22);
    scene.add(primaryContactShadow);

    const secondaryContactShadow = new THREE.Mesh(
      contactShadowGeo,
      contactShadowMat.clone(),
    );
    secondaryContactShadow.position.set(-1.25, 0.014, -0.45);
    secondaryContactShadow.scale.setScalar(0.01);
    scene.add(secondaryContactShadow);

    // Build Composite 3D Models
    const envelopeRig = buildEnvelopeGroup(maxAniso, linenBump);
    scene.add(envelopeRig.group);

    const bouquetRig = buildTulipBouquetGroup(maxAniso);
    bouquetRig.group.scale.setScalar(0.001);
    bouquetRig.group.visible = false;
    scene.add(bouquetRig.group);

    const giftBoxRig = buildGiftBoxGroup(maxAniso);
    giftBoxRig.group.scale.setScalar(0.001);
    giftBoxRig.group.visible = false;
    scene.add(giftBoxRig.group);

    const petalsRig = buildFloatingPetalsInstancedMesh(28);
    scene.add(petalsRig.mesh);

    // Pre-warm shaders once
    renderer.compile(scene, camera);

    const initialStepCfg = getStepConfig(stateRef.current.currentStep);
    const initialTargets = initialStepCfg.sceneTargets;

    const animState = {
      envelopeScale: initialTargets.envelopeOpacity,
      flapRatio: initialTargets.flapOpenRatio,
      cardRise: initialTargets.cardRiseRatio,
      bouquetScale: initialTargets.bouquetScale,
      bouquetX: initialTargets.bouquetOffsetX,
      bouquetZ: initialTargets.bouquetOffsetZ,
      giftBoxScale: initialTargets.giftBoxScale,
      giftBoxOpen: initialTargets.giftBoxOpenRatio,
      pointerX: 0,
      pointerY: 0,
    };

    const applyScenePose = (dt: number, elapsed: number, snapImmediate: boolean) => {
      const { currentStep: activeStep, reducedMotion: rm } = stateRef.current;

      const stepCfg = getStepConfig(activeStep);
      const targets = stepCfg.sceneTargets;
      const activeCamPose = stepCfg.camera;

      // Responsive portrait scaling so envelope & bouquet fit comfortably on mobile
      const aspect = camera.aspect || 1;
      const isPortrait = aspect < 0.88;
      const mobileDistFactor = isPortrait
        ? Math.min(1.38, 1 / Math.pow(aspect, 0.38))
        : 1.0;
      const mobileModelScale = isPortrait ? 0.8 : 1.0;

      const dampLambda = snapImmediate || rm ? 120 : 4.5;

      const parallaxX = snapImmediate || rm ? 0 : animState.pointerX * 0.14;
      const parallaxY = snapImmediate || rm ? 0 : -animState.pointerY * 0.08;

      _targetCamPos.set(
        activeCamPose.position[0] + parallaxX,
        activeCamPose.position[1] * (isPortrait ? 1.05 : 1.0) + parallaxY,
        activeCamPose.position[2] * mobileDistFactor,
      );
      _targetLookAt.set(
        activeCamPose.lookAt[0],
        activeCamPose.lookAt[1],
        activeCamPose.lookAt[2],
      );

      if (snapImmediate) {
        camera.position.copy(_targetCamPos);
        _currentLookAt.copy(_targetLookAt);
        animState.envelopeScale = targets.envelopeOpacity;
        animState.flapRatio = targets.flapOpenRatio;
        animState.cardRise = targets.cardRiseRatio;
        animState.bouquetScale = targets.bouquetScale;
        animState.bouquetX = targets.bouquetOffsetX;
        animState.bouquetZ = targets.bouquetOffsetZ;
        animState.giftBoxScale = targets.giftBoxScale;
        animState.giftBoxOpen = targets.giftBoxOpenRatio;
      } else {
        camera.position.x = computeExponentialDamp(
          camera.position.x,
          _targetCamPos.x,
          dampLambda,
          dt,
        );
        camera.position.y = computeExponentialDamp(
          camera.position.y,
          _targetCamPos.y,
          dampLambda,
          dt,
        );
        camera.position.z = computeExponentialDamp(
          camera.position.z,
          _targetCamPos.z,
          dampLambda,
          dt,
        );

        _currentLookAt.x = computeExponentialDamp(
          _currentLookAt.x,
          _targetLookAt.x,
          dampLambda,
          dt,
        );
        _currentLookAt.y = computeExponentialDamp(
          _currentLookAt.y,
          _targetLookAt.y,
          dampLambda,
          dt,
        );
        _currentLookAt.z = computeExponentialDamp(
          _currentLookAt.z,
          _targetLookAt.z,
          dampLambda,
          dt,
        );

        animState.envelopeScale = computeExponentialDamp(
          animState.envelopeScale,
          targets.envelopeOpacity,
          dampLambda,
          dt,
        );
        animState.flapRatio = computeExponentialDamp(
          animState.flapRatio,
          targets.flapOpenRatio,
          rm ? 80 : 3.8,
          dt,
        );
        animState.cardRise = computeExponentialDamp(
          animState.cardRise,
          targets.cardRiseRatio,
          rm ? 80 : 3.2,
          dt,
        );
        animState.bouquetScale = computeExponentialDamp(
          animState.bouquetScale,
          targets.bouquetScale,
          rm ? 80 : 3.6,
          dt,
        );
        animState.bouquetX = computeExponentialDamp(
          animState.bouquetX,
          targets.bouquetOffsetX,
          dampLambda,
          dt,
        );
        animState.bouquetZ = computeExponentialDamp(
          animState.bouquetZ,
          targets.bouquetOffsetZ,
          dampLambda,
          dt,
        );
        animState.giftBoxScale = computeExponentialDamp(
          animState.giftBoxScale,
          targets.giftBoxScale,
          rm ? 80 : 4.2,
          dt,
        );
        animState.giftBoxOpen = computeExponentialDamp(
          animState.giftBoxOpen,
          targets.giftBoxOpenRatio,
          rm ? 80 : 2.8,
          dt,
        );
      }

      camera.lookAt(_currentLookAt);

      // Update Envelope & Rising Card (Ensuring open flap stays behind rising card!)
      envelopeRig.group.visible = animState.envelopeScale > 0.02;
      if (envelopeRig.group.visible) {
        const s = Math.max(0.001, animState.envelopeScale * mobileModelScale);
        envelopeRig.group.scale.setScalar(s);
        envelopeRig.group.position.y = 0.02 - (1 - animState.envelopeScale) * 0.4;

        // Rotate flap full 180 deg (-Math.PI) and shift Z behind the rising card
        envelopeRig.flapPivot.rotation.x = -animState.flapRatio * Math.PI * 0.99;
        envelopeRig.flapPivot.position.z = 0.098 - animState.flapRatio * 0.088;

        const sealScale = Math.max(0.001, 1 - animState.flapRatio * 0.92);
        envelopeRig.waxSealGroup.scale.setScalar(sealScale);

        // Card rises cleanly in front of the open flap and tilts slightly toward camera for readability
        envelopeRig.cardGroup.position.y = 0.02 + animState.cardRise * 0.62;
        envelopeRig.cardGroup.position.z = 0.048 + animState.cardRise * 0.032;
        envelopeRig.cardGroup.rotation.x = animState.cardRise * 0.14;
        primaryContactShadow.scale.setScalar(mobileModelScale);
      }

      // Update Tulip Bouquet
      bouquetRig.group.visible = animState.bouquetScale > 0.02;
      if (bouquetRig.group.visible) {
        const bs = Math.max(
          0.001,
          animState.bouquetScale * (isPortrait ? 0.82 : 1.0),
        );
        bouquetRig.group.scale.setScalar(bs);
        bouquetRig.group.position.set(animState.bouquetX, 0, animState.bouquetZ);
        if (!rm && !snapImmediate) {
          bouquetRig.blossomCluster.rotation.z = Math.sin(elapsed * 0.9) * 0.022;
          bouquetRig.tagGroup.rotation.z = -0.08 + Math.sin(elapsed * 1.3) * 0.035;
        }
        secondaryContactShadow.position.set(
          animState.bouquetX,
          0.014,
          animState.bouquetZ,
        );
        secondaryContactShadow.scale.setScalar(bs * 0.95);
      } else {
        secondaryContactShadow.scale.setScalar(0.001);
      }

      // Update Keepsake Gift Box
      giftBoxRig.group.visible = animState.giftBoxScale > 0.02;
      if (giftBoxRig.group.visible) {
        const gs = Math.max(0.001, animState.giftBoxScale * mobileModelScale);
        giftBoxRig.group.scale.setScalar(gs);
        giftBoxRig.lidGroup.rotation.x = -animState.giftBoxOpen * 1.18;
        giftBoxRig.lidGroup.position.y = 0.52 + animState.giftBoxOpen * 0.16;
        giftBoxRig.interiorCardGroup.position.y = 0.18 + animState.giftBoxOpen * 0.28;
      }

      // Update Drifting 3D Petals
      if (!rm && !snapImmediate && targets.petalDriftSpeed > 0) {
        const driftRate = targets.petalDriftSpeed;
        for (let i = 0; i < petalsRig.data.length; i++) {
          const p = petalsRig.data[i];
          if (p.speed === 0) continue;
          const yCycle =
            ((p.basePos.y - elapsed * p.speed * driftRate) % 2.8 + 2.8) % 2.8;
          const curY = 0.18 + yCycle;
          const swayX = p.basePos.x + Math.sin(elapsed * 0.7 + p.phase) * 0.22;
          const swayZ = p.basePos.z + Math.cos(elapsed * 0.55 + p.phase) * 0.16;

          _dummyObj.position.set(swayX, curY, swayZ);
          _dummyObj.rotation.set(
            elapsed * p.rotSpeed.x + p.phase,
            elapsed * p.rotSpeed.y + p.phase,
            elapsed * p.rotSpeed.z,
          );
          _dummyObj.scale.setScalar(p.scale);
          _dummyObj.updateMatrix();
          petalsRig.mesh.setMatrixAt(i, _dummyObj.matrix);
        }
        petalsRig.mesh.instanceMatrix.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    requestRenderRef.current = () => {
      if (isHeadless) {
        applyScenePose(0.016, 0, true);
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      animState.pointerX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      animState.pointerY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    const handlePointerUp = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      _pointerNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      _pointerNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      _raycaster.setFromCamera(_pointerNdc, camera);

      const { currentStep: stepNow } = stateRef.current;
      const interactTargets: THREE.Object3D[] = [];
      if (envelopeRig.group.visible) interactTargets.push(envelopeRig.group);
      if (bouquetRig.group.visible) interactTargets.push(bouquetRig.group);
      if (giftBoxRig.group.visible) interactTargets.push(giftBoxRig.group);

      const hits = _raycaster.intersectObjects(interactTargets, true);
      if (hits.length > 0 && stepNow !== 'final_state') {
        stateRef.current.onScenePrimaryInteract();
      }
    };

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      if (isHeadless) {
        applyScenePose(0.016, 0, true);
      }
    };

    renderer.domElement.addEventListener('pointermove', handlePointerMove, {
      passive: true,
    });
    renderer.domElement.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('resize', handleResize);

    // Initial immediate render
    applyScenePose(0.016, 0, true);

    let rafId = 0;
    const startTimeMs = performance.now();
    let prevTimeMs = startTimeMs;

    if (!isHeadless) {
      const tick = (nowMs: number) => {
        rafId = window.requestAnimationFrame(tick);
        const dt = Math.min((nowMs - prevTimeMs) / 1000, 0.1);
        prevTimeMs = nowMs;
        const elapsed = (nowMs - startTimeMs) / 1000;
        applyScenePose(dt, elapsed, false);
      };
      rafId = window.requestAnimationFrame(tick);
    }

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      requestRenderRef.current = null;
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('pointerup', handlePointerUp);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={canvasMountRef}
      data-testid="three-scene-canvas"
      aria-hidden="true"
      className="fixed inset-0 w-screen h-screen overflow-hidden pointer-events-auto z-0"
    />
  );
}
