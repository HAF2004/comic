import json

with open('bubbles.json', 'r', encoding='utf-8') as f:
    b = json.load(f)

# c4b2p1: Dialogue bubble pointing to Tifa
b['c4b2p1']['type'] = 'speech'
b['c4b2p1']['bubble'] = {'x': 6, 'y': 6, 'w': 34, 'h': 14}
b['c4b2p1']['tailTarget'] = {'x': 42, 'y': 24}
b['c4b2p1']['tailCurve'] = 'organic-right'

# c4b4p1: Dialogue bubble pointing to Tifa on the left
b['c4b4p1']['type'] = 'speech'
b['c4b4p1']['bubble'] = {'x': 8, 'y': 6, 'w': 38, 'h': 14}
b['c4b4p1']['tailTarget'] = {'x': 22, 'y': 24}
b['c4b4p1']['tailCurve'] = 'organic-left'

# c4b4p2: Dialogue bubble pointing to Tifa on the left
b['c4b4p2']['type'] = 'speech'
b['c4b4p2']['bubble'] = {'x': 8, 'y': 6, 'w': 38, 'h': 14}
b['c4b4p2']['tailTarget'] = {'x': 22, 'y': 24}
b['c4b4p2']['tailCurve'] = 'organic-left'

# c4b4p3: Dialogue bubble shifted slightly left, tail points toward Tifa stopping safely above hair
b['c4b4p3']['type'] = 'speech'
b['c4b4p3']['bubble'] = {'x': 16, 'y': 6, 'w': 36, 'h': 13}
b['c4b4p3']['tailTarget'] = {'x': 38, 'y': 20}
b['c4b4p3']['tailCurve'] = 'organic-right'

# c4b5p2: Dialogue bubble pointing down-right toward Tifa, stopping 5% before hair/glasses
b['c4b5p2']['type'] = 'speech'
b['c4b5p2']['bubble'] = {'x': 8, 'y': 6, 'w': 32, 'h': 14}
b['c4b5p2']['tailTarget'] = {'x': 36, 'y': 24}
b['c4b5p2']['tailCurve'] = 'organic-right'

with open('bubbles.json', 'w', encoding='utf-8') as f:
    json.dump(b, f, indent=2)

print('Updated bubbles.json with perfected tail anchors and gap clearance.')
