import * as THREE from 'three';
import {
  createBirthdayCardTexture,
  createGiftBoxCardTexture,
  createGiftTagTexture,
} from './proceduralTextures';

export interface EnvelopeRig {
  group: THREE.Group;
  flapPivot: THREE.Group;
  waxSealGroup: THREE.Group;
  cardGroup: THREE.Group;
}

export interface BouquetRig {
  group: THREE.Group;
  tagGroup: THREE.Group;
  blossomCluster: THREE.Group;
}

export interface GiftBoxRig {
  group: THREE.Group;
  lidGroup: THREE.Group;
  interiorCardGroup: THREE.Group;
  ribbonBowGroup: THREE.Group;
}

export interface PetalInstanceData {
  basePos: THREE.Vector3;
  speed: number;
  phase: number;
  rotSpeed: THREE.Vector3;
  scale: number;
}

/**
 * 1. Composite 9-Part Sealed Envelope & Rising Birthday Card
 * Uses warm dusty-blush, almond-kraft, and rose-taupe tones for strong
 * figure-ground contrast against the #F8F3EE cream background.
 */
export function buildEnvelopeGroup(
  maxAnisotropy: number,
  linenBump: THREE.Texture,
): EnvelopeRig {
  const group = new THREE.Group();
  group.position.set(0, 0.02, 0.2);

  const tiltContainer = new THREE.Group();
  tiltContainer.rotation.x = -0.54;
  tiltContainer.position.set(0, 0.56, 0);
  group.add(tiltContainer);

  const width = 2.08;
  const height = 1.36;

  // Warm dusty-blush bottom pocket & back body
  const paperMat = new THREE.MeshStandardMaterial({
    color: 0xd9b3a9,
    roughness: 0.78,
    metalness: 0.02,
    bumpMap: linenBump,
    bumpScale: 0.008,
  });

  // Deeper rose-taupe side flaps for clear triangular fold contrast
  const sideFlapPaperMat = new THREE.MeshStandardMaterial({
    color: 0xc99c91,
    roughness: 0.76,
    metalness: 0.02,
    bumpMap: linenBump,
    bumpScale: 0.008,
    side: THREE.DoubleSide,
  });

  // Warm rose-champagne top flap
  const flapPaperMat = new THREE.MeshStandardMaterial({
    color: 0xe4c3ba,
    roughness: 0.72,
    metalness: 0.03,
    bumpMap: linenBump,
    bumpScale: 0.008,
    side: THREE.DoubleSide,
  });

  // Rich antique-rose inner envelope lining visible when flap opens
  const innerLiningMat = new THREE.MeshStandardMaterial({
    color: 0xb56d78,
    roughness: 0.64,
    metalness: 0.04,
  });

  // Crisp espresso-rose seam lines along folds
  const seamLineMat = new THREE.LineBasicMaterial({
    color: 0x825550,
    transparent: true,
    opacity: 0.85,
  });

  // Part 1: Back envelope base panel (beveled ExtrudeGeometry)
  const backShape = new THREE.Shape();
  backShape.moveTo(-width / 2, -height / 2);
  backShape.lineTo(width / 2, -height / 2);
  backShape.lineTo(width / 2, height / 2);
  backShape.lineTo(-width / 2, height / 2);
  backShape.closePath();

  const backGeo = new THREE.ExtrudeGeometry(backShape, {
    depth: 0.035,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.012,
    bevelThickness: 0.01,
  });
  const backMesh = new THREE.Mesh(backGeo, paperMat);
  backMesh.castShadow = true;
  backMesh.receiveShadow = true;
  backMesh.position.z = -0.02;
  tiltContainer.add(backMesh);

  // Outer envelope border outline
  const borderPoints = [
    new THREE.Vector3(-width / 2, -height / 2, 0.098),
    new THREE.Vector3(width / 2, -height / 2, 0.098),
    new THREE.Vector3(width / 2, height / 2, 0.098),
    new THREE.Vector3(-width / 2, height / 2, 0.098),
    new THREE.Vector3(-width / 2, -height / 2, 0.098),
  ];
  const borderLine = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(borderPoints),
    seamLineMat,
  );
  tiltContainer.add(borderLine);

  // Part 2: Inner antique-rose lining
  const liningGeo = new THREE.PlaneGeometry(width * 0.94, height * 0.92);
  const liningMesh = new THREE.Mesh(liningGeo, innerLiningMat);
  liningMesh.position.set(0, 0, 0.028);
  tiltContainer.add(liningMesh);

  // Part 3: Rising Letterpress Birthday Card (inside pocket)
  const cardGroup = new THREE.Group();
  cardGroup.position.set(0, 0.02, 0.048);
  const cardTex = createBirthdayCardTexture(maxAnisotropy);
  const cardFaceMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: cardTex,
    roughness: 0.58,
    metalness: 0.03,
  });
  const cardEdgeMat = new THREE.MeshStandardMaterial({
    color: 0xfffdf9,
    roughness: 0.72,
    metalness: 0.02,
  });
  const cardGeo = new THREE.BoxGeometry(width * 0.86, height * 0.86, 0.024);
  const cardMesh = new THREE.Mesh(cardGeo, [
    cardEdgeMat,
    cardEdgeMat,
    cardEdgeMat,
    cardEdgeMat,
    cardFaceMat,
    cardEdgeMat,
  ]);
  cardMesh.castShadow = true;
  cardMesh.receiveShadow = true;
  cardGroup.add(cardMesh);
  tiltContainer.add(cardGroup);

  // Part 4 & 5: Left & Right folded triangular side flaps
  const sideFlapShapeL = new THREE.Shape();
  sideFlapShapeL.moveTo(-width / 2, -height / 2);
  sideFlapShapeL.lineTo(-0.08, 0);
  sideFlapShapeL.lineTo(-width / 2, height / 2);
  sideFlapShapeL.closePath();

  const sideFlapGeoL = new THREE.ExtrudeGeometry(sideFlapShapeL, {
    depth: 0.012,
    bevelEnabled: true,
    bevelSegments: 1,
    bevelSize: 0.005,
    bevelThickness: 0.005,
  });
  const leftFlapMesh = new THREE.Mesh(sideFlapGeoL, sideFlapPaperMat);
  leftFlapMesh.position.z = 0.068;
  leftFlapMesh.castShadow = true;
  tiltContainer.add(leftFlapMesh);

  const rightFlapMesh = leftFlapMesh.clone();
  rightFlapMesh.scale.x = -1;
  tiltContainer.add(rightFlapMesh);

  // Part 6: Bottom folded pocket triangle
  const bottomFlapShape = new THREE.Shape();
  bottomFlapShape.moveTo(-width / 2, -height / 2);
  bottomFlapShape.lineTo(width / 2, -height / 2);
  bottomFlapShape.lineTo(0, 0.12);
  bottomFlapShape.closePath();

  const bottomFlapGeo = new THREE.ExtrudeGeometry(bottomFlapShape, {
    depth: 0.015,
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: 0.006,
    bevelThickness: 0.006,
  });
  const bottomFlapMesh = new THREE.Mesh(bottomFlapGeo, paperMat);
  bottomFlapMesh.position.z = 0.082;
  bottomFlapMesh.castShadow = true;
  bottomFlapMesh.receiveShadow = true;
  tiltContainer.add(bottomFlapMesh);

  const bottomSeamPoints = [
    new THREE.Vector3(-width / 2, -height / 2, 0.104),
    new THREE.Vector3(0, 0.12, 0.104),
    new THREE.Vector3(width / 2, -height / 2, 0.104),
  ];
  tiltContainer.add(
    new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(bottomSeamPoints),
      seamLineMat,
    ),
  );

  // Part 7: Pivoting Top Triangular Envelope Flap
  const flapPivot = new THREE.Group();
  flapPivot.position.set(0, height / 2, 0.098);
  tiltContainer.add(flapPivot);

  const topFlapShape = new THREE.Shape();
  topFlapShape.moveTo(-width / 2, 0);
  topFlapShape.lineTo(width / 2, 0);
  topFlapShape.lineTo(0, -height * 0.62);
  topFlapShape.closePath();

  const topFlapGeo = new THREE.ExtrudeGeometry(topFlapShape, {
    depth: 0.014,
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: 0.006,
    bevelThickness: 0.006,
  });
  const topFlapMesh = new THREE.Mesh(topFlapGeo, flapPaperMat);
  topFlapMesh.castShadow = true;
  flapPivot.add(topFlapMesh);

  const topSeamPoints = [
    new THREE.Vector3(-width / 2, 0, 0.024),
    new THREE.Vector3(0, -height * 0.62, 0.024),
    new THREE.Vector3(width / 2, 0, 0.024),
  ];
  flapPivot.add(
    new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(topSeamPoints),
      seamLineMat,
    ),
  );

  // Part 8: Deep Crimson-Rose Embossed Wax Seal (LatheGeometry)
  const waxSealGroup = new THREE.Group();
  waxSealGroup.position.set(0, -height * 0.56, 0.026);
  flapPivot.add(waxSealGroup);

  const sealPoints = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(0.16, 0),
    new THREE.Vector2(0.18, 0.025),
    new THREE.Vector2(0.22, 0.032),
    new THREE.Vector2(0.23, 0.012),
    new THREE.Vector2(0.19, -0.01),
    new THREE.Vector2(0, -0.01),
  ];
  const sealGeo = new THREE.LatheGeometry(sealPoints, 28);
  sealGeo.rotateX(Math.PI / 2);

  const waxMat = new THREE.MeshPhysicalMaterial({
    color: 0xa6495a,
    roughness: 0.3,
    metalness: 0.12,
    clearcoat: 0.55,
    clearcoatRoughness: 0.25,
  });
  const sealMesh = new THREE.Mesh(sealGeo, waxMat);
  sealMesh.castShadow = true;
  waxSealGroup.add(sealMesh);

  // Embossed floral center inside wax seal
  const stampGeo = new THREE.CylinderGeometry(0.11, 0.12, 0.022, 20);
  stampGeo.rotateX(Math.PI / 2);
  const stampMat = new THREE.MeshPhysicalMaterial({
    color: 0xbf6373,
    roughness: 0.38,
    metalness: 0.16,
    clearcoat: 0.4,
  });
  const stampMesh = new THREE.Mesh(stampGeo, stampMat);
  stampMesh.position.z = 0.014;
  waxSealGroup.add(stampMesh);

  // Part 9: Dried botanical sprig tucked into the wax seal
  const sprigCurve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(-0.04, -0.06, 0.018),
    new THREE.Vector3(0.12, 0.14, 0.025),
    new THREE.Vector3(0.28, 0.34, 0.022),
  );
  const sprigStemGeo = new THREE.TubeGeometry(sprigCurve, 12, 0.009, 6, false);
  const sprigStemMat = new THREE.MeshStandardMaterial({
    color: 0x6e5343,
    roughness: 0.75,
    metalness: 0.05,
  });
  const sprigStemMesh = new THREE.Mesh(sprigStemGeo, sprigStemMat);
  waxSealGroup.add(sprigStemMesh);

  const budGeo = new THREE.SphereGeometry(0.026, 8, 8);
  const budMat = new THREE.MeshStandardMaterial({
    color: 0xfff5f6,
    roughness: 0.45,
    metalness: 0.02,
  });
  const budOffsets: [number, number, number][] = [
    [0.16, 0.2, 0.03],
    [0.22, 0.28, 0.028],
    [0.28, 0.34, 0.026],
    [0.19, 0.15, 0.028],
  ];
  for (const [bx, by, bz] of budOffsets) {
    const bud = new THREE.Mesh(budGeo, budMat);
    bud.position.set(bx, by, bz);
    waxSealGroup.add(bud);
  }

  return {
    group,
    flapPivot,
    waxSealGroup,
    cardGroup,
  };
}

/**
 * 2. Composite 12-Part Pink Tulip & White Chamomile Bouquet with Gift Tag
 */
export function buildTulipBouquetGroup(maxAnisotropy: number): BouquetRig {
  const group = new THREE.Group();
  group.position.set(0, 0, 0);

  // Part 1: Gathered Sage Stems at the base
  const stemMat = new THREE.MeshStandardMaterial({
    color: 0x556e4e,
    roughness: 0.68,
    metalness: 0.04,
  });
  const baseStemCluster = new THREE.Group();
  const baseStemGeo = new THREE.CylinderGeometry(0.026, 0.028, 0.68, 8);
  for (let i = 0; i < 11; i++) {
    const angle = (i / 11) * Math.PI * 2;
    const r = i === 0 ? 0 : 0.085;
    const stem = new THREE.Mesh(baseStemGeo, stemMat);
    stem.position.set(Math.cos(angle) * r, 0.34, Math.sin(angle) * r);
    stem.rotation.z = Math.cos(angle) * 0.09;
    stem.rotation.x = Math.sin(angle) * 0.09;
    stem.castShadow = true;
    baseStemCluster.add(stem);
  }
  group.add(baseStemCluster);

  // Part 2: Outer Warm Champagne-Kraft Floral Wrapping Cone (LatheGeometry)
  const wrapPoints = [
    new THREE.Vector2(0.14, 0.18),
    new THREE.Vector2(0.13, 0.52),
    new THREE.Vector2(0.46, 1.05),
    new THREE.Vector2(0.82, 1.48),
    new THREE.Vector2(0.92, 1.56),
  ];
  const outerWrapGeo = new THREE.LatheGeometry(wrapPoints, 28);
  const outerWrapMat = new THREE.MeshPhysicalMaterial({
    color: 0xe2c7b8,
    roughness: 0.58,
    metalness: 0.02,
    clearcoat: 0.14,
    side: THREE.DoubleSide,
  });
  const outerWrapMesh = new THREE.Mesh(outerWrapGeo, outerWrapMat);
  outerWrapMesh.castShadow = true;
  outerWrapMesh.receiveShadow = true;
  group.add(outerWrapMesh);

  // Part 3: Inner Warm Blush-Rose Tissue Paper Layer
  const innerWrapPoints = [
    new THREE.Vector2(0.13, 0.48),
    new THREE.Vector2(0.42, 1.02),
    new THREE.Vector2(0.76, 1.54),
    new THREE.Vector2(0.86, 1.64),
  ];
  const innerWrapGeo = new THREE.LatheGeometry(innerWrapPoints, 20);
  const innerWrapMat = new THREE.MeshStandardMaterial({
    color: 0xd5a8a1,
    roughness: 0.72,
    metalness: 0.02,
    side: THREE.DoubleSide,
  });
  const innerWrapMesh = new THREE.Mesh(innerWrapGeo, innerWrapMat);
  innerWrapMesh.rotation.y = 0.35;
  group.add(innerWrapMesh);

  // Part 4, 5 & 6: Rich Dusty-Rose Satin Ribbon Waist, Bow Loops & Flowing Tails
  const satinRibbonMat = new THREE.MeshPhysicalMaterial({
    color: 0xb35262,
    roughness: 0.24,
    metalness: 0.14,
    clearcoat: 0.45,
    clearcoatRoughness: 0.25,
    side: THREE.DoubleSide,
  });

  const waistBandGeo = new THREE.TorusGeometry(0.155, 0.036, 12, 28);
  waistBandGeo.rotateX(Math.PI / 2);
  const waistBandMesh = new THREE.Mesh(waistBandGeo, satinRibbonMat);
  waistBandMesh.position.y = 0.54;
  waistBandMesh.castShadow = true;
  group.add(waistBandMesh);

  const bowLoopGeo = new THREE.TorusGeometry(0.14, 0.032, 10, 24);
  const leftBowLoop = new THREE.Mesh(bowLoopGeo, satinRibbonMat);
  leftBowLoop.scale.set(1.3, 0.78, 0.65);
  leftBowLoop.position.set(-0.15, 0.55, 0.16);
  leftBowLoop.rotation.set(0.15, 0.25, 0.32);
  leftBowLoop.castShadow = true;
  group.add(leftBowLoop);

  const rightBowLoop = new THREE.Mesh(bowLoopGeo, satinRibbonMat);
  rightBowLoop.scale.set(1.3, 0.78, 0.65);
  rightBowLoop.position.set(0.15, 0.55, 0.16);
  rightBowLoop.rotation.set(0.15, -0.25, -0.32);
  rightBowLoop.castShadow = true;
  group.add(rightBowLoop);

  const leftTailCurve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(-0.03, 0.52, 0.18),
    new THREE.Vector3(-0.16, 0.3, 0.24),
    new THREE.Vector3(-0.24, 0.06, 0.28),
  );
  const rightTailCurve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(0.03, 0.52, 0.18),
    new THREE.Vector3(0.16, 0.3, 0.24),
    new THREE.Vector3(0.25, 0.06, 0.28),
  );
  const leftTailGeo = new THREE.TubeGeometry(leftTailCurve, 12, 0.026, 8, false);
  const rightTailGeo = new THREE.TubeGeometry(rightTailCurve, 12, 0.026, 8, false);
  const leftTailMesh = new THREE.Mesh(leftTailGeo, satinRibbonMat);
  const rightTailMesh = new THREE.Mesh(rightTailGeo, satinRibbonMat);
  leftTailMesh.scale.z = 0.35;
  rightTailMesh.scale.z = 0.35;
  group.add(leftTailMesh, rightTailMesh);

  // Part 7, 8, 9 & 10: Rich Pink Tulip Blossoms, Curved Stems, Sage Leaves & White Chamomile Daisies
  const blossomCluster = new THREE.Group();
  group.add(blossomCluster);

  const tulipCupPoints = [
    new THREE.Vector2(0.001, 0),
    new THREE.Vector2(0.095, 0.04),
    new THREE.Vector2(0.135, 0.14),
    new THREE.Vector2(0.115, 0.26),
    new THREE.Vector2(0.075, 0.33),
  ];
  const tulipOuterGeo = new THREE.LatheGeometry(tulipCupPoints, 14);
  const tulipInnerGeo = new THREE.LatheGeometry(
    tulipCupPoints.map((p) => new THREE.Vector2(p.x * 0.78, p.y * 0.94)),
    12,
  );

  const tulipPalette = [0xd97386, 0xc95e72, 0xe28899, 0xce667a, 0xe89aa9];
  const tulipMaterials = tulipPalette.map(
    (hex) =>
      new THREE.MeshPhysicalMaterial({
        color: hex,
        roughness: 0.38,
        metalness: 0.02,
        clearcoat: 0.2,
        clearcoatRoughness: 0.4,
        side: THREE.DoubleSide,
      }),
  );

  const tulipPlacements: { pos: [number, number, number]; tilt: [number, number, number] }[] = [
    { pos: [0, 1.72, 0.02], tilt: [0.06, 0, 0] },
    { pos: [-0.28, 1.65, 0.18], tilt: [0.22, 0, 0.28] },
    { pos: [0.28, 1.64, 0.16], tilt: [0.2, 0, -0.28] },
    { pos: [-0.46, 1.48, 0.02], tilt: [0.1, 0, 0.44] },
    { pos: [0.46, 1.5, 0.04], tilt: [0.12, 0, -0.42] },
    { pos: [-0.18, 1.56, -0.24], tilt: [-0.25, 0, 0.18] },
    { pos: [0.2, 1.58, -0.22], tilt: [-0.24, 0, -0.2] },
    { pos: [0, 1.46, 0.36], tilt: [0.38, 0, 0] },
    { pos: [-0.36, 1.38, 0.32], tilt: [0.36, 0, 0.34] },
    { pos: [0.35, 1.4, 0.3], tilt: [0.35, 0, -0.32] },
    { pos: [-0.42, 1.42, -0.22], tilt: [-0.22, 0, 0.38] },
    { pos: [0.42, 1.44, -0.2], tilt: [-0.2, 0, -0.38] },
    { pos: [0, 1.54, -0.38], tilt: [-0.36, 0, 0.04] },
  ];

  tulipPlacements.forEach((item, idx) => {
    const flowerGroup = new THREE.Group();
    flowerGroup.position.set(...item.pos);
    flowerGroup.rotation.set(...item.tilt);

    const mat = tulipMaterials[idx % tulipMaterials.length];
    const innerMat = tulipMaterials[(idx + 2) % tulipMaterials.length];

    const outerCup = new THREE.Mesh(tulipOuterGeo, mat);
    outerCup.castShadow = true;
    flowerGroup.add(outerCup);

    const innerCup = new THREE.Mesh(tulipInnerGeo, innerMat);
    innerCup.position.y = 0.015;
    innerCup.rotation.y = 0.5;
    flowerGroup.add(innerCup);

    const stemCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, 0.55, 0),
      new THREE.Vector3(item.pos[0] * 0.5, 1.05, item.pos[2] * 0.5),
      new THREE.Vector3(item.pos[0], item.pos[1], item.pos[2]),
    );
    const stemGeo = new THREE.TubeGeometry(stemCurve, 8, 0.02, 6, false);
    const stemMesh = new THREE.Mesh(stemGeo, stemMat);
    blossomCluster.add(stemMesh);
    blossomCluster.add(flowerGroup);
  });

  // Part 9: Arched Botanical Leaves
  const leafMat = new THREE.MeshStandardMaterial({
    color: 0x4b6345,
    roughness: 0.58,
    metalness: 0.04,
    side: THREE.DoubleSide,
  });
  const leafShape = new THREE.Shape();
  leafShape.moveTo(0, 0);
  leafShape.quadraticCurveTo(0.08, 0.25, 0.02, 0.55);
  leafShape.quadraticCurveTo(-0.06, 0.25, 0, 0);
  const leafGeo = new THREE.ShapeGeometry(leafShape, 8);

  for (let i = 0; i < 10; i++) {
    const angle = (i / 10) * Math.PI * 2;
    const leaf = new THREE.Mesh(leafGeo, leafMat);
    leaf.position.set(Math.cos(angle) * 0.35, 1.15, Math.sin(angle) * 0.35);
    leaf.rotation.y = -angle + Math.PI / 2;
    leaf.rotation.x = 0.42;
    blossomCluster.add(leaf);
  }

  // Part 10: White Chamomile / Daisy Filler Flowers
  const daisyCenterGeo = new THREE.SphereGeometry(0.036, 10, 10);
  const daisyCenterMat = new THREE.MeshStandardMaterial({
    color: 0xd9a843,
    roughness: 0.65,
    metalness: 0.05,
  });
  const daisyPetalGeo = new THREE.CylinderGeometry(0.016, 0.012, 0.095, 6);
  daisyPetalGeo.rotateX(Math.PI / 2);
  const daisyPetalMat = new THREE.MeshStandardMaterial({
    color: 0xfffdf9,
    roughness: 0.45,
    metalness: 0.02,
  });

  const daisyPositions: [number, number, number][] = [
    [-0.16, 1.66, 0.28],
    [0.18, 1.65, 0.26],
    [-0.38, 1.54, 0.22],
    [0.38, 1.53, 0.22],
    [0, 1.58, 0.38],
    [-0.52, 1.38, 0.14],
    [0.52, 1.38, 0.14],
    [-0.24, 1.44, 0.42],
    [0.24, 1.44, 0.42],
    [-0.3, 1.62, -0.08],
    [0.3, 1.62, -0.08],
    [0, 1.68, -0.18],
  ];

  daisyPositions.forEach(([dx, dy, dz]) => {
    const daisy = new THREE.Group();
    daisy.position.set(dx, dy, dz);
    daisy.lookAt(dx * 2, dy + 0.6, dz * 2);

    const center = new THREE.Mesh(daisyCenterGeo, daisyCenterMat);
    center.scale.z = 0.55;
    daisy.add(center);

    for (let p = 0; p < 8; p++) {
      const a = (p / 8) * Math.PI * 2;
      const petal = new THREE.Mesh(daisyPetalGeo, daisyPetalMat);
      petal.position.set(Math.cos(a) * 0.048, Math.sin(a) * 0.048, -0.005);
      petal.rotation.z = a + Math.PI / 2;
      daisy.add(petal);
    }
    blossomCluster.add(daisy);
  });

  // Part 11 & 12: Hanging Kraft Gift Tag ("For Putri") & Twine Cord
  const tagGroup = new THREE.Group();
  tagGroup.position.set(0.42, 1.02, 0.46);
  tagGroup.rotation.set(-0.14, 0.28, -0.08);
  group.add(tagGroup);

  const tagTex = createGiftTagTexture(maxAnisotropy);
  const tagFaceMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: tagTex,
    roughness: 0.72,
    metalness: 0.02,
  });
  const tagBackMat = new THREE.MeshStandardMaterial({
    color: 0xd8bfab,
    roughness: 0.78,
    metalness: 0.02,
  });

  const tagGeo = new THREE.BoxGeometry(0.42, 0.52, 0.014);
  const tagMesh = new THREE.Mesh(tagGeo, [
    tagBackMat,
    tagBackMat,
    tagBackMat,
    tagBackMat,
    tagFaceMat,
    tagBackMat,
  ]);
  tagMesh.castShadow = true;
  tagGroup.add(tagMesh);

  const twineCurve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(0, 0.22, 0.01),
    new THREE.Vector3(-0.06, 0.34, -0.06),
    new THREE.Vector3(-0.14, 0.28, -0.16),
  );
  const twineGeo = new THREE.TubeGeometry(twineCurve, 10, 0.007, 6, false);
  const twineMat = new THREE.MeshStandardMaterial({
    color: 0x876a56,
    roughness: 0.88,
    metalness: 0.02,
  });
  const twineMesh = new THREE.Mesh(twineGeo, twineMat);
  tagGroup.add(twineMesh);

  return {
    group,
    tagGroup,
    blossomCluster,
  };
}

/**
 * 3. Composite 8-Part Keepsake Gift Box with Dusty-Pink Ribbon & Interior Card
 */
export function buildGiftBoxGroup(maxAnisotropy: number): GiftBoxRig {
  const group = new THREE.Group();
  group.position.set(0.32, 0, 0.25);

  const boxWidth = 1.48;
  const boxDepth = 1.36;
  const boxHeight = 0.52;

  const boxPaperMat = new THREE.MeshStandardMaterial({
    color: 0xdcb4ae,
    roughness: 0.74,
    metalness: 0.03,
  });

  const velvetInteriorMat = new THREE.MeshStandardMaterial({
    color: 0xc8938d,
    roughness: 0.88,
    metalness: 0.01,
  });

  const ribbonMat = new THREE.MeshPhysicalMaterial({
    color: 0xb35262,
    roughness: 0.22,
    metalness: 0.15,
    clearcoat: 0.45,
    side: THREE.DoubleSide,
  });

  const baseFloorGeo = new THREE.BoxGeometry(boxWidth, 0.06, boxDepth);
  const baseFloorMesh = new THREE.Mesh(baseFloorGeo, boxPaperMat);
  baseFloorMesh.position.y = 0.03;
  baseFloorMesh.castShadow = true;
  baseFloorMesh.receiveShadow = true;
  group.add(baseFloorMesh);

  const wallThickness = 0.065;
  const frontBackGeo = new THREE.BoxGeometry(boxWidth, boxHeight, wallThickness);
  const frontWall = new THREE.Mesh(frontBackGeo, boxPaperMat);
  frontWall.position.set(0, boxHeight / 2, boxDepth / 2 - wallThickness / 2);
  frontWall.castShadow = true;
  frontWall.receiveShadow = true;

  const backWall = frontWall.clone();
  backWall.position.z = -boxDepth / 2 + wallThickness / 2;

  const leftRightGeo = new THREE.BoxGeometry(
    wallThickness,
    boxHeight,
    boxDepth - wallThickness * 2,
  );
  const leftWall = new THREE.Mesh(leftRightGeo, boxPaperMat);
  leftWall.position.set(-boxWidth / 2 + wallThickness / 2, boxHeight / 2, 0);
  leftWall.castShadow = true;

  const rightWall = leftWall.clone();
  rightWall.position.x = boxWidth / 2 - wallThickness / 2;

  group.add(frontWall, backWall, leftWall, rightWall);

  const cushionGeo = new THREE.BoxGeometry(
    boxWidth - wallThickness * 2.2,
    0.12,
    boxDepth - wallThickness * 2.2,
  );
  const cushionMesh = new THREE.Mesh(cushionGeo, velvetInteriorMat);
  cushionMesh.position.y = 0.1;
  cushionMesh.receiveShadow = true;
  group.add(cushionMesh);

  const interiorCardGroup = new THREE.Group();
  interiorCardGroup.position.set(0, 0.18, 0.04);
  interiorCardGroup.rotation.x = -0.35;
  group.add(interiorCardGroup);

  const qrCardTex = createGiftBoxCardTexture(maxAnisotropy);
  const qrCardFaceMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: qrCardTex,
    roughness: 0.48,
    metalness: 0.04,
  });
  const qrCardFrameMat = new THREE.MeshStandardMaterial({
    color: 0xe6bfba,
    roughness: 0.62,
    metalness: 0.08,
  });

  const frameGeo = new THREE.BoxGeometry(1.06, 1.06, 0.04);
  const frameMesh = new THREE.Mesh(frameGeo, [
    qrCardFrameMat,
    qrCardFrameMat,
    qrCardFrameMat,
    qrCardFrameMat,
    qrCardFaceMat,
    qrCardFrameMat,
  ]);
  frameMesh.castShadow = true;
  interiorCardGroup.add(frameMesh);

  const lidGroup = new THREE.Group();
  lidGroup.position.set(0, boxHeight, -boxDepth / 2);
  group.add(lidGroup);

  const lidW = boxWidth + 0.06;
  const lidD = boxDepth + 0.06;
  const lidH = 0.14;
  const lidTopGeo = new THREE.BoxGeometry(lidW, lidH, lidD);
  const lidTopMesh = new THREE.Mesh(lidTopGeo, boxPaperMat);
  lidTopMesh.position.set(0, lidH / 2, lidD / 2);
  lidTopMesh.castShadow = true;
  lidTopMesh.receiveShadow = true;
  lidGroup.add(lidTopMesh);

  const ribbonBowGroup = new THREE.Group();
  ribbonBowGroup.position.set(0, lidH + 0.005, lidD / 2);
  lidGroup.add(ribbonBowGroup);

  const ribbonStrapX = new THREE.Mesh(
    new THREE.BoxGeometry(lidW + 0.01, 0.012, 0.14),
    ribbonMat,
  );
  const ribbonStrapZ = new THREE.Mesh(
    new THREE.BoxGeometry(0.14, 0.014, lidD + 0.01),
    ribbonMat,
  );
  ribbonBowGroup.add(ribbonStrapX, ribbonStrapZ);

  const topBowGeo = new THREE.TorusGeometry(0.16, 0.034, 10, 24);
  const bowL = new THREE.Mesh(topBowGeo, ribbonMat);
  bowL.scale.set(1.25, 0.72, 0.65);
  bowL.position.set(-0.15, 0.07, 0);
  bowL.rotation.set(0.4, 0.15, 0.3);

  const bowR = new THREE.Mesh(topBowGeo, ribbonMat);
  bowR.scale.set(1.25, 0.72, 0.65);
  bowR.position.set(0.15, 0.07, 0);
  bowR.rotation.set(0.4, -0.15, -0.3);

  ribbonBowGroup.add(bowL, bowR);

  return {
    group,
    lidGroup,
    interiorCardGroup,
    ribbonBowGroup,
  };
}

/**
 * 4. InstancedMesh Floating Tulip Petals (> 20 instances for GPU instancing)
 */
export function buildFloatingPetalsInstancedMesh(count = 28): {
  mesh: THREE.InstancedMesh;
  data: PetalInstanceData[];
} {
  const petalShape = new THREE.Shape();
  petalShape.moveTo(0, -0.09);
  petalShape.quadraticCurveTo(0.085, -0.02, 0.065, 0.08);
  petalShape.quadraticCurveTo(0, 0.115, -0.065, 0.08);
  petalShape.quadraticCurveTo(-0.085, -0.02, 0, -0.09);

  const petalGeo = new THREE.ExtrudeGeometry(petalShape, {
    depth: 0.005,
    bevelEnabled: true,
    bevelSegments: 1,
    bevelSize: 0.004,
    bevelThickness: 0.003,
  });

  const petalMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.42,
    metalness: 0.01,
    clearcoat: 0.18,
    side: THREE.DoubleSide,
  });

  const mesh = new THREE.InstancedMesh(petalGeo, petalMat, count);
  mesh.frustumCulled = false;

  const data: PetalInstanceData[] = [];
  const dummy = new THREE.Object3D();
  const color = new THREE.Color();
  const petalTints = [0xe59aa8, 0xd87b8c, 0xcf6a7d, 0xedaebe, 0xc76274];

  for (let i = 0; i < count; i++) {
    const angle = i * 2.39996;
    const radius = 0.65 + ((i * 37) % 100) / 38;
    const isRestingOnTable = i < 8;
    const y = isRestingOnTable ? 0.025 : 0.35 + ((i * 53) % 100) / 34;

    const basePos = new THREE.Vector3(
      Math.cos(angle) * radius,
      y,
      Math.sin(angle) * radius * 0.85,
    );
    const scale = 0.85 + ((i * 19) % 30) / 100;

    dummy.position.copy(basePos);
    dummy.rotation.set(
      isRestingOnTable ? Math.PI / 2 - 0.12 : (i * 0.7) % Math.PI,
      (i * 1.3) % Math.PI,
      (i * 0.9) % Math.PI,
    );
    dummy.scale.setScalar(scale);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);

    color.setHex(petalTints[i % petalTints.length]);
    mesh.setColorAt(i, color);

    data.push({
      basePos,
      speed: isRestingOnTable ? 0 : 0.25 + (i % 5) * 0.08,
      phase: i * 0.85,
      rotSpeed: new THREE.Vector3(
        isRestingOnTable ? 0 : 0.35,
        isRestingOnTable ? 0 : 0.45,
        isRestingOnTable ? 0 : 0.25,
      ),
      scale,
    });
  }

  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  mesh.computeBoundingSphere();

  return { mesh, data };
}
