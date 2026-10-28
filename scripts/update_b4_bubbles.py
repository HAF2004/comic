import json

with open('bubbles.json', 'r', encoding='utf-8') as f:
    b = json.load(f)

# B4 P1: Sharp, lancip curved tail pointing to Tifa
b['c4b4p1']['type'] = 'speech'
b['c4b4p1']['bubble'] = {'x': 8, 'y': 6, 'w': 38, 'h': 14}
b['c4b4p1']['tailCurve'] = 'organic-left'
b['c4b4p1']['tailTarget'] = {'x': 26, 'y': 28}

# B4 P2: Sharp, lancip curved tail pointing to Tifa
b['c4b4p2']['type'] = 'speech'
b['c4b4p2']['bubble'] = {'x': 8, 'y': 6, 'w': 38, 'h': 14}
b['c4b4p2']['tailCurve'] = 'organic-left'
b['c4b4p2']['tailTarget'] = {'x': 26, 'y': 28}

# B4 P3: Fully visible, lancip curved tail pointing to Tifa
b['c4b4p3']['type'] = 'speech'
b['c4b4p3']['bubble'] = {'x': 16, 'y': 6, 'w': 36, 'h': 13}
b['c4b4p3']['tailCurve'] = 'organic-right'
b['c4b4p3']['tailTarget'] = {'x': 46, 'y': 28}

with open('bubbles.json', 'w', encoding='utf-8') as f:
    json.dump(b, f, indent=2)

print('Updated Board 4 bubbles with sharp, lancip tails!')
