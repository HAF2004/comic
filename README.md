# For Putri — Interactive Birthday Surprise Microsite

An editorial, minimal-romantic 3D interactive birthday microsite created for **Putri Hanan Latifah** (22 November 2003).

## Experience Flow (15–20 Seconds)

1. **Envelope (`envelope`)**: Soft morning window light over a warm cream linen surface (`#F8F3EE`), a 3D sealed cotton-paper envelope with a dusty-rose wax seal (`#C77B87`) and dried botanical sprig, and drifting tulip petals. Tapping **Open** begins the surprise.
2. **Birthday Reveal (`birthday_reveal`)**: The envelope flap smoothly rotates open and a letterpress birthday card rises upward reading *"Happy Birthday, Putri."* Automatically transitions after ~3 seconds (or immediately via **Continue**).
3. **Flower Bloom (`flower_bloom`)**: A 12-part procedural 3D pink tulip and white chamomile bouquet blooms into the center of the scene with a dusty-pink satin bow and a hanging kraft gift tag reading *"For Putri ♡"*. Includes a **Read Gift Tag** close-up camera toggle and an **Open Your Gift** button.
4. **Gift Reveal (`gift_reveal`)**: A cream keepsake gift box with a dusty-pink satin ribbon opens its lid to reveal the gift card reading *"A little something for you ♡"*.
5. **Final State (`final_state`)**: The payment QR code card remains cleanly framed beside the bouquet with *"Scan to receive your gift."* until the page is closed.

---

## Supplying Your Actual Payment QR Code (`/assets/qris.png`)

To comply with strict payment safety rules, **this application never fabricates or modifies a payment QR code**:

1. Place your actual QRIS or supported payment QR image at:
   ```text
   public/assets/qris.png
   ```
2. If `public/assets/qris.png` is present, it is displayed automatically with sharp edges (`object-contain`, preserved 1:1 aspect ratio, zero cropping).
3. If `public/assets/qris.png` is not yet placed on disk, a clear placeholder card is displayed with a **Load Actual QR Image** button so you can load and test scanning your real QR image on a separate device right away.

### Optional Custom Audio (`/assets/ambient.mp3`)

- Music is **off by default** and never autoplays.
- Clicking the top-right music button plays `public/assets/ambient.mp3` if present, or synthesizes a warm, gentle acoustic felt-piano progression (`Fmaj7 – Dm7 – Bbmaj7 – C9sus4`) via the Web Audio API.

---

## Local Development & Testing

```bash
# Install dependencies
npm install

# Run unit tests (Node built-in test runner)
node --test src/utils/experienceState.test.ts

# Start development server on port 3000
npm run dev

# Build for production deployment
npm run build
```
