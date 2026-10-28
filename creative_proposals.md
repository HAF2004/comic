# Creative Proposals (Improvisasi Terkendali)
Compiled per FASE 6 & ATURAN KERAS.
Strict constraint: Max 3 subtle enhancements per panel, fully compatible with prefers-reduced-motion, toggleable via feature flags, 0 visual disruption to characters or text.

| Proposal ID | Target Panel | Proposed Enhancement | Story Value & Impact | Technical Effort | Collage Risk | Decision |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **PROP-01** | B1 · P1 & P2 | Subtle streetlamp breathing glow & nocturnal petal drift | Enhances nocturnal solitude & atmospheric continuity with the night walk | Low (WebGL uniform + GSAP sine drift) | None (uses CLEARED Ch4 vector sprites & shaders) | **APPROVED & ACTIVE** |
| **PROP-02** | B2 · P2 | Tactile pop-in scale pulse for 'CLICK!' starburst | Provides auditory/tactile satisfaction as Tifa unlocks her door | Very Low (GSAP back.out ease on focus) | None (native SVG vector overlay) | **APPROVED & ACTIVE** |
| **PROP-03** | B3 · P1 | Ambient desk lamp luminance breathe | Establishes the cozy warmth of home after walking in the dark | Low (uniform `uIntensity` subtle oscillation) | None (shader uniform) | **APPROVED & ACTIVE** |
| **PROP-04** | B4 · P2 | Outward magical petal & sparkle radiance from screen | Visually signals the transition from reality into magical birthday celebration | Medium (vector sprite particle emission) | None (CLEARED Ch4 effect sprites) | **APPROVED & ACTIVE** |
| **PROP-05** | B6 · P1 | Organic candlelight shimmer across 23 candles | Gives warmth and vibrant life to the centerpiece cake without hiding candle count | Low (procedural highlight modulation) | None (shader uniform) | **APPROVED & ACTIVE** |
| **PROP-06** | B8 · P1 | Gentle heartbeat pulse on keepsake letter card (2.4s period, 1.8% scale) | Expresses deep personal emotion and gratitude as she reads the friends' letter | Very Low (GSAP timeline on letter overlay) | None (vector keepsake card) | **APPROVED & ACTIVE** |

### Rejected Proposals
1. **Adding Ponpon Sheep or Bar patrons to B7 party**:
   - *Reason for Rejection*: Fails Rights Gate (RESTRICTED 3rd-party assets) and breaks story canon (Chapter 4 is Tifa's personal circle of close human friends, not a crowd of sheep mascots).
2. **Aggressive camera shake on B2P2 CLICK!**:
   - *Reason for Rejection*: Disorienting on mobile viewports; violates Franco-Belgian ligne claire calm reading rhythm.
3. **Floating 3D confetti particles across all panels**:
   - *Reason for Rejection*: Creates visual clutter and occludes hand-lettered dialogue bubbles and character facial expressions.
