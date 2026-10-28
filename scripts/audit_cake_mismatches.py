import cv2, os, json
import numpy as np

# Load the 4 images
im_b5 = cv2.imread('assets_v5/c4b5p1-background.png')
im_b6 = cv2.imread('assets_v5/c4b6p1-cake-hero.png')
im_b7 = cv2.imread('assets_v5/c4b7p3-friends-cake.png')
im_b8 = cv2.imread('assets_v5/c4b8p1-background.png')

# Precise crops of the cakes
# 1. B5 P1:
crop_b5 = im_b5[300:960, 780:1280] # h=660, w=500
# 2. B6 P1:
crop_b6 = im_b6[450:980, 550:1350] # h=530, w=800
# 3. B7 P3:
crop_b7 = im_b7[500:950, 420:1080] # h=450, w=660
# 4. B8 P1:
crop_b8 = im_b8[480:920, 620:1240] # h=440, w=620

target_h = 320

def prep_crop(crop, name, issues):
    h, w = crop.shape[:2]
    target_w = int(w * (target_h / h))
    resized = cv2.resize(crop, (target_w, target_h), interpolation=cv2.INTER_LANCZOS4)
    
    # Add top banner for panel name
    banner = np.zeros((45, target_w, 3), dtype=np.uint8) + 25
    cv2.putText(banner, name, (15, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
    
    # Add bottom banner for issue tags
    bot_banner = np.zeros((65, target_w, 3), dtype=np.uint8) + 20
    for i, issue in enumerate(issues[:2]):
        color = (50, 50, 255) if 'BLOCKER' in issue else (50, 180, 255)
        cv2.putText(bot_banner, issue, (10, 25 + i * 25), cv2.FONT_HERSHEY_SIMPLEX, 0.45, color, 1)
        
    combined = np.vstack([banner, resized, bot_banner])
    return combined

p5 = prep_crop(crop_b5, "B5 P1 (Emerging)", ["BLOCKER: 2 Tiers (vs 1 tier)", "BLOCKER: Multiple candles (no '23')"])
p6 = prep_crop(crop_b6, "B6 P1 (Hero Desk)", ["BLOCKER: 1 Tier (vs 2 tier)", "BLOCKER: 23 individual candles"])
p7 = prep_crop(crop_b7, "B7 P3 (Party)", ["BLOCKER: 1 Tier flat (vs 2 tier)", "MAJOR: Gold rim, different flowers"])
p8 = prep_crop(crop_b8, "B8 P1 (Keepsake)", ["BLOCKER: 1 Tier wide (vs 2 tier)", "MAJOR: Small flowers, no peonies"])

# Arrange in 2x2 grid
row1 = np.hstack([cv2.resize(p5, (450, 430)), cv2.resize(p6, (450, 430))])
row2 = np.hstack([cv2.resize(p7, (450, 430)), cv2.resize(p8, (450, 430))])
grid = np.vstack([row1, row2])

# Add header title
header = np.zeros((60, 900, 3), dtype=np.uint8) + 15
cv2.putText(header, "AUDIT KONSISTENSI KUE CHAPTER 4 (BASELINE ASSETS_V5)", (30, 40),
            cv2.FONT_HERSHEY_SIMPLEX, 0.75, (0, 255, 255), 2)
final_audit_img = np.vstack([header, grid])

os.makedirs('continuity_evidence', exist_ok=True)
cv2.imwrite('cake_mismatch.png', final_audit_img)
cv2.imwrite('continuity_evidence/cake_mismatch.png', final_audit_img)

audit_data = {
    "audit_timestamp": "2026-10-28T18:25:00+07:00",
    "panels": {
        "c4b5p1": {
            "tier_count": 2,
            "proportions": {"top_tier": "330x120", "bottom_tier": "480x180"},
            "cream_color": "White top, pale pink bottom with darker pink flower pattern",
            "decorations": "Large blooming peonies at base & top tier sides, baby's breath, pink piping",
            "plate": "None (floating through screen portal)",
            "candles": "23 individual candles (8 back, 8 mid, 7 front)",
            "severity": "BLOCKER",
            "findings": "Two tiers with lush peonies; unique emerging floating perspective. Lacks number '23' candle."
        },
        "c4b6p1": {
            "tier_count": 1,
            "proportions": {"tier": "580x180"},
            "cream_color": "Pale ivory frosting with pink side floral pattern and gold dots",
            "decorations": "Cream dollop piping on top and base, pink flowers, green leaves; separate peony bouquet on left",
            "plate": "White/cream scalloped porcelain plate",
            "candles": "23 individual candles (8 back, 8 mid, 7 front)",
            "severity": "BLOCKER",
            "findings": "One tier (mismatch with B5 P1 2-tier design); 23 individual candles instead of number '23'."
        },
        "c4b7p3": {
            "tier_count": 1,
            "proportions": {"tier": "540x160"},
            "cream_color": "White cream with pink flower pattern",
            "decorations": "Rosette piping, pink flowers and leaves along base rim",
            "plate": "Gold/cream scalloped plate",
            "candles": "13 visible individual candles in straight rows",
            "severity": "BLOCKER",
            "findings": "One tier; straight candle row; different flower arrangement."
        },
        "c4b8p1": {
            "tier_count": 1,
            "proportions": {"tier": "480x150"},
            "cream_color": "White cream with dense small flower rim",
            "decorations": "Small pink & white cherry blossom-like flowers",
            "plate": "Gold round plate",
            "candles": "15 visible individual candles in straight rows",
            "severity": "BLOCKER",
            "findings": "One tier; dense small flowers instead of peonies; candles straight and inconsistent."
        }
    },
    "summary": {
        "blockers": 4,
        "primary_mismatch": "Tier count discrepancy (B5 P1 is 2-tier while B6, B7, B8 are 1-tier) AND all panels use multi-candle clusters instead of number '23' candles."
    }
}

with open('cake_audit.json', 'w', encoding='utf-8') as f:
    json.dump(audit_data, f, indent=2)

print("Saved cake_mismatch.png and cake_audit.json")
