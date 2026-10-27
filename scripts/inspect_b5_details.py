import cv2
import numpy as np

# Load B5 P1 composite/layers
b5p1_bg = cv2.imread('textures/chapters/4/c4b5p1-background.png')
b5p1_cake = cv2.imread('textures/chapters/4/c4b5p1-cake-emerges.png')
b5p2_bg = cv2.imread('textures/chapters/4/c4b5p2-background.png')
b5p2_fg = cv2.imread('textures/chapters/4/c4b5p2-foreground.png', cv2.IMREAD_UNCHANGED)
b5p2_comp = cv2.imread('textures/chapters/4/c4b5p2-delighted-reaction.png')

print("B5 P1 BG shape:", b5p1_bg.shape)
print("B5 P1 Cake/FG shape:", b5p1_cake.shape)
print("B5 P2 BG shape:", b5p2_bg.shape)
print("B5 P2 Comp shape:", b5p2_comp.shape)

# Let's save side-by-side comparison of B5 P1 vs B5 P2
# Resize to common width
w = 1200
h1 = int(b5p1_bg.shape[0] * (w / b5p1_bg.shape[1]))
h2 = int(b5p2_comp.shape[0] * (w / b5p2_comp.shape[1]))
r1 = cv2.resize(b5p1_bg, (w, h1))
r2 = cv2.resize(b5p2_comp, (w, h2))

comparison = np.vstack([r1, r2])
cv2.imwrite('continuity_evidence/b5p1_vs_b5p2_comparison.png', comparison)
print("Saved continuity_evidence/b5p1_vs_b5p2_comparison.png")

# Check Tifa outfit in B5 P1: crop Tifa
# In B5 P1, Tifa is on the right side
h, w, _ = b5p1_cake.shape
tifa_b5p1 = b5p1_cake[int(h*0.1):int(h*0.9), int(w*0.5):w]
cv2.imwrite('continuity_evidence/tifa_b5p1_crop.png', tifa_b5p1)

# In B5 P2, Tifa is in center
h2, w2, _ = b5p2_comp.shape
tifa_b5p2 = b5p2_comp[int(h2*0.1):int(h2*0.9), int(w2*0.25):int(w2*0.75)]
cv2.imwrite('continuity_evidence/tifa_b5p2_crop.png', tifa_b5p2)

print("Saved tifa_b5p1_crop.png and tifa_b5p2_crop.png")
