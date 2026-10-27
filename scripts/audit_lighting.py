import os
import json
import cv2
import numpy as np

panels = [
    ("c4b1p1", "textures/chapters/4/c4b1p1-background.png", "textures/chapters/4/c4b1p1-foreground.png", "textures/chapters/4/c4b1p1-night-walk-rear.png"),
    ("c4b1p2", "textures/chapters/4/c4b1p2-background.png", "textures/chapters/4/c4b1p2-foreground.png", "textures/chapters/4/c4b1p2-night-walk-front.png"),
    ("c4b2p1", "textures/chapters/4/c4b2p1-background.png", "textures/chapters/4/c4b2p1-foreground.png", "textures/chapters/4/c4b2p1-arrive-home.png"),
    ("c4b2p2", "textures/chapters/4/c4b2p2-background.png", "textures/chapters/4/c4b2p2-foreground.png", "textures/chapters/4/c4b2p2-open-door-detail.png"),
    ("c4b2p3", "textures/chapters/4/c4b2p3-background.png", "textures/chapters/4/c4b2p3-foreground.png", "textures/chapters/4/c4b2p3-set-down-bag.png"),
    ("c4b3p1", "textures/chapters/4/c4b3p1-background-night.png", "textures/chapters/4/c4b3p1-foreground.png", "textures/chapters/4/c4b3p1-settle-at-desk.png"),
    ("c4b3p2", "textures/chapters/4/c4b3p2-background-night.png", "textures/chapters/4/c4b3p2-foreground.png", "textures/chapters/4/c4b3p2-open-macbook-correct.png"),
    ("c4b4p1", "textures/chapters/4/c4b4p1-background.png", None, "textures/chapters/4/c4b4p1-golden-mark.png"),
    ("c4b4p2", "textures/chapters/4/c4b4p2-background.png", None, "textures/chapters/4/c4b4p2-petals-from-screen.png"),
    ("c4b4p3", "textures/chapters/4/c4b4p3-background.png", "textures/chapters/4/c4b4p3-foreground.png", "textures/chapters/4/c4b4p3-tifa-curious.png"),
    ("c4b5p1", "textures/chapters/4/c4b5p1-background.png", None, "textures/chapters/4/c4b5p1-cake-emerges.png"),
    ("c4b5p2", "textures/chapters/4/c4b5p2-background.png", "textures/chapters/4/c4b5p2-foreground.png", "textures/chapters/4/c4b5p2-delighted-reaction.png"),
    ("c4b6p1", "textures/chapters/4/c4b6p1-background.png", None, "textures/chapters/4/c4b6p1-cake-hero.png"),
    ("c4b7p1", "textures/chapters/4/c4b7p1-background.png", "textures/chapters/4/c4b7p1-foreground.png", "textures/chapters/4/c4b7p1-friends-surprise.png"),
    ("c4b7p2", "textures/chapters/4/c4b7p2-background.png", None, "textures/chapters/4/c4b7p2-tifa-emotional.png"),
    ("c4b7p3", "textures/chapters/4/c4b7p3-background.png", "textures/chapters/4/c4b7p3-foreground.png", "textures/chapters/4/c4b7p3-friends-cake.png"),
    ("c4b8p1", "textures/chapters/4/c4b8p1-background.png", "textures/chapters/4/c4b8p1-foreground.png", "textures/chapters/4/c4b8p1-keepsake.png")
]

light_audit = {}
contact_thumbs = []

for pid, bg_p, fg_p, comp_p in panels:
    target_img_p = comp_p if os.path.exists(comp_p) else bg_p
    img = cv2.imread(target_img_p)
    if img is None:
        continue
    h, w, _ = img.shape
    # Compute luminance Y in YCrCb or standard formula
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY) / 255.0
    mean_lum = float(np.mean(gray))
    std_lum = float(np.std(gray))
    
    # Face region (approx center-top for character panels)
    face_region = gray[int(h*0.2):int(h*0.45), int(w*0.35):int(w*0.65)]
    face_lum = float(np.mean(face_region))
    
    # Window / sky region (approx top 30%)
    top_region = gray[0:int(h*0.3), 0:int(w*0.4)]
    top_lum = float(np.mean(top_region))
    
    # Dominant Hue in HSV
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    # Filter out near black / white
    sat_mask = (hsv[:, :, 1] > 40) & (hsv[:, :, 2] > 30)
    if np.any(sat_mask):
        median_hue = float(np.median(hsv[:, :, 0][sat_mask]) * 2) # 0-360
    else:
        median_hue = 0.0
        
    # Check if window/sky reads as night vs dusk/day
    # In HSV: Blue/navy is hue ~210-240, orange/sunset is ~15-35
    is_dusk_daylight = False
    notes = []
    
    if pid == "c4b5p1":
        # Check window in c4b5p1
        # Top-left corner
        win_crop = img[0:int(h*0.4), 0:int(w*0.3)]
        win_hsv = cv2.cvtColor(win_crop, cv2.COLOR_BGR2HSV)
        orange_mask = (win_hsv[:, :, 0] >= 10) & (win_hsv[:, :, 0] <= 30) & (win_hsv[:, :, 1] > 100) & (win_hsv[:, :, 2] > 150)
        if np.mean(orange_mask) > 0.15:
            is_dusk_daylight = True
            notes.append("Dusk/sunset orange sky detected in window")
            
    if pid == "c4b5p2":
        # Window on left has stars or pink dusk?
        win_crop = img[0:int(h*0.45), 0:int(w*0.35)]
        win_gray = cv2.cvtColor(win_crop, cv2.COLOR_BGR2GRAY) / 255.0
        if np.mean(win_gray) > 0.40:
            notes.append("Window region is brighter than night spec")
            
    if pid == "c4b2p2":
        # Door crack
        crack = img[int(h*0.1):int(h*0.9), 0:int(w*0.25)]
        crack_gray = cv2.cvtColor(crack, cv2.COLOR_BGR2GRAY) / 255.0
        if np.mean(crack_gray) > 0.45:
            notes.append("Door opening shows bright ground/exterior")

    light_audit[pid] = {
        "file": target_img_p,
        "mean_luminance": round(mean_lum, 3),
        "std_luminance": round(std_lum, 3),
        "face_region_luminance": round(face_lum, 3),
        "top_window_luminance": round(top_lum, 3),
        "dominant_hue_deg": round(median_hue, 1),
        "notes": notes
    }
    
    # Resize for contact sheet (thumb 240x160)
    thumb = cv2.resize(img, (240, 160))
    cv2.putText(thumb, pid, (10, 25), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2, cv2.LINE_AA)
    cv2.putText(thumb, f"L:{round(mean_lum,2)} H:{int(median_hue)}", (10, 145), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1, cv2.LINE_AA)
    contact_thumbs.append(thumb)

# Build contact sheet (3 rows x 6 cols grid, 18 slots)
grid_rows = []
for r in range(3):
    row_imgs = []
    for c in range(6):
        idx = r * 6 + c
        if idx < len(contact_thumbs):
            row_imgs.append(contact_thumbs[idx])
        else:
            row_imgs.append(np.zeros((160, 240, 3), dtype=np.uint8))
    grid_rows.append(np.hstack(row_imgs))

contact_sheet = np.vstack(grid_rows)
cv2.imwrite('continuity_evidence/contact_sheet_ch4.png', contact_sheet)

with open('light_audit.json', 'w', encoding='utf-8') as f:
    json.dump(light_audit, f, indent=2)

print("Saved light_audit.json and continuity_evidence/contact_sheet_ch4.png")
