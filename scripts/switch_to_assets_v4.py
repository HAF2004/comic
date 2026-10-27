with open('_nuxt/CfE0pqJa.js', 'r', encoding='utf-8') as f:
    code = f.read()

target = 'const c4Assets = ['
start = code.find(target)
if start == -1:
    print('Error: const c4Assets = [ not found')
else:
    end = code.find('];', start) + 2
    c4_section = code[start:end]
    new_c4_section = c4_section.replace("'/textures/chapters/4/", "'/assets_v4/")
    new_code = code[:start] + new_c4_section + code[end:]
    with open('_nuxt/CfE0pqJa.js', 'w', encoding='utf-8') as f:
        f.write(new_code)
    print('Successfully switched c4Assets in _nuxt/CfE0pqJa.js to /assets_v4/.')
