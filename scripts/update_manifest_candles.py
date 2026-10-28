with open('assets_v6/asset-manifest.json', 'r', encoding='utf-8') as f:
    text = f.read()

count = text.count('"candle_count_target": 23')
print(f'Found {count} occurrences of candle_count_target: 23')

text = text.replace('"candle_count_target": 23', '"candle_count_target": 2')
text = text.replace('"23 countable candles"', '"canonical two-tier cake with number 23 candles and two flames"')
text = text.replace('"23 distinct candles"', '"canonical two-tier cake with number 23 candles and two flames"')

with open('assets_v6/asset-manifest.json', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated assets_v6/asset-manifest.json successfully')
