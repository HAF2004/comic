import json

master_audit = {
    "c4b1p1": {
        "status": "PERLU_PERBAIKAN",
        "defects": ["BUBBLE_TYPE"],
        "severity": "MINOR",
        "notes": "Text is narration caption in script ('One last walk beneath the city lights.'), but rendered with speech tail pointing to Tifa's back. Needs caption card treatment without tail."
    },
    "c4b1p2": {
        "status": "OK",
        "defects": [],
        "severity": "NONE",
        "notes": "Night street approach, lamplight key light, character lock and bag charm all pass."
    },
    "c4b2p1": {
        "status": "PERLU_PERBAIKAN",
        "defects": ["DOOR_MISMATCH", "BUBBLE_TAIL_EXCESSIVE"],
        "severity": "BLOCKER",
        "notes": "Door is warm brown wood with peephole and different plate, conflicting with canonical dark navy door (P2, P3). Speech tail length is 30.5% of panel."
    },
    "c4b2p2": {
        "status": "OK",
        "defects": [],
        "severity": "NONE",
        "notes": "Canonical navy door detail with brass plate, lever handle, keyhole, and night garden view. SFX vector pulse active."
    },
    "c4b2p3": {
        "status": "OK",
        "defects": [],
        "severity": "NONE",
        "notes": "Canonical navy door visible on right. Tifa setting down bag and clover charm matches character lock sheet."
    },
    "c4b3p1": {
        "status": "PERLU_PERBAIKAN",
        "defects": ["BUBBLE_TYPE"],
        "severity": "MINOR",
        "notes": "Narration caption ('Just one quiet minute for herself.') rendered as thought bubble. Needs rectangular caption card."
    },
    "c4b3p2": {
        "status": "OK",
        "defects": [],
        "severity": "NONE",
        "notes": "Night desk room, MacBook opening correctly with keyboard in front and inner display facing Tifa."
    },
    "c4b4p1": {
        "status": "PERLU_PERBAIKAN",
        "defects": ["BUBBLE_TAIL_TARGET"],
        "severity": "MAJOR",
        "notes": "Macro shot of screen; speech bubble tail points to empty screen center instead of indicating off-screen speaker."
    },
    "c4b4p2": {
        "status": "PERLU_PERBAIKAN",
        "defects": ["BUBBLE_TAIL_TARGET"],
        "severity": "MAJOR",
        "notes": "Macro shot of screen; speech bubble tail points inside screen where no character is present."
    },
    "c4b4p3": {
        "status": "PERLU_PERBAIKAN",
        "defects": ["BUBBLE_TAIL_HEAD_CONTACT"],
        "severity": "MAJOR",
        "notes": "Speech bubble tail reaches down and touches Tifa's hair parting directly at center (48%, 36%)."
    },
    "c4b5p1": {
        "status": "PERLU_PERBAIKAN",
        "defects": ["OUTFIT_MISMATCH", "LIGHTING_WINDOW_DUSK"],
        "severity": "BLOCKER",
        "notes": "Window in background shows sunset orange/pink sky. Tifa's jacket in cake-startled variant has hoodie drawstrings hanging down, conflicting with canonical zip jacket."
    },
    "c4b5p2": {
        "status": "PERLU_PERBAIKAN",
        "defects": ["ROOM_OBJECT_MISMATCH", "BUBBLE_TAIL_FOREHEAD_CONTACT"],
        "severity": "BLOCKER",
        "notes": "Background has wooden slat chair instead of pink scalloped chair, floral mug instead of pink heart pencil cup. Speech bubble tail ends directly on Tifa's forehead/hair above glasses."
    },
    "c4b6p1": {
        "status": "OK",
        "defects": [],
        "severity": "NONE",
        "notes": "Hero splash cake with exactly 23 countable lit candles, pink scalloped chair, navy jacket, night window."
    },
    "c4b7p1": {
        "status": "OK",
        "defects": [],
        "severity": "NONE",
        "notes": "Friends surprise on pink bed with HAPPY BIRTHDAY banner overlay and fairy lights."
    },
    "c4b7p2": {
        "status": "PERLU_PERBAIKAN",
        "defects": ["BUBBLE_TAIL_HEAD_CONTACT"],
        "severity": "MINOR",
        "notes": "Bubble tail ends on Tifa's top hair parting. Needs shorter curved tail stopping 5% above head."
    },
    "c4b7p3": {
        "status": "PERLU_PERBAIKAN",
        "defects": ["BUBBLE_SPEAKER_TARGET", "WINDOW_DUSK_COLOR"],
        "severity": "MAJOR",
        "notes": "Speech bubble 'Make a wish, Tifa!' tail points to center/Tifa instead of Friend 2. Left window has peach dusk tint."
    },
    "c4b8p1": {
        "status": "OK",
        "defects": [],
        "severity": "NONE",
        "notes": "Splash keepsake restored in boardConfig with caption card and birthday letter card."
    }
}

with open('master_audit.json', 'w', encoding='utf-8') as f:
    json.dump(master_audit, f, indent=2)

print("Saved master_audit.json with full panel-by-panel assessment.")
