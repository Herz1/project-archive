"""Optional editorial tool. Requires fonttools + brotli; generated WOFF2 are committed.
Pass --font-dir with official Noto CJK SubsetOTF/SC fonts. Never alters vendored sources.
"""
from pathlib import Path
from argparse import ArgumentParser
from copy import deepcopy
import json
from fontTools.ttLib import TTFont
from fontTools import subset
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

parser=ArgumentParser()
parser.add_argument('--font-dir', required=True)
args=parser.parse_args()
root=Path(__file__).resolve().parents[1]
font_dir=Path(args.font_dir)
landing=root/'website/intro/src/app/(landing)'
data=json.loads((root/'website/content/projects.generated.json').read_text(encoding='utf-8'))
text=(root/'website/intro/src/i18n/zh.ts').read_text(encoding='utf-8')
text+=json.dumps(data,ensure_ascii=False)
for path in landing.glob('*.tsx'):
    text+=path.read_text(encoding='utf-8')
text+=(landing/'about/page.tsx').read_text(encoding='utf-8')
text+=''.join(chr(c) for c in range(32,127))
act0='Herz1项目、界面与个人实验。个公开项目·个方向持续记录全部项目进入档案GitHub↗0123456789'
for source,stem in [('NotoSerifSC-SemiBold.otf','noto-serif-sc-600'),('NotoSansSC-Regular.otf','noto-sans-sc-400')]:
    for suffix,content in [('',text),('-act0',act0)]:
        font=TTFont(font_dir/source)
        options=subset.Options()
        options.flavor='woff2'
        tool=subset.Subsetter(options=options)
        tool.populate(text=content)
        tool.subset(font)
        font.flavor='woff2'
        target=landing/'fonts'/f'{stem}{suffix}.woff2'
        font.save(target)
        print(f'{target.name}: {target.stat().st_size} bytes')
    # Editorial coverage manifest, not an external font request.
(landing/'fonts/portfolio-coverage.json').write_text(json.dumps({
    'sources':['https://github.com/notofonts/noto-cjk'],
    'text':''.join(sorted(set(text))), 'act0':act0,
},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

# Keep the original supplied phrase outlines wherever a glyph exists. New brand
# characters use Noto outlines; no licensed commercial font binaries are needed.
up=root/'.agents/skills/rhine-eidolon-preserve/assets/upstream/rhine/src/boot-lettering-art.json'
art=json.loads(up.read_text(encoding='utf-8'))
bank={}
for phrase in art.values():
    for char,glyph in zip(phrase['text'],phrase['letters']):
        bank.setdefault((phrase['weight'],char),glyph)
fallback=TTFont(font_dir/'NotoSansSC-Regular.otf')
glyphs=fallback.getGlyphSet()
cmap=fallback.getBestCmap()
scale=1000/fallback['head'].unitsPerEm
def letter(char,weight):
    if (weight,char) in bank: return deepcopy(bank[weight,char])
    for (existing_weight,existing_char),glyph in bank.items():
        if existing_char==char: return deepcopy(glyph)
    name=cmap.get(ord(char))
    if not name: raise ValueError(f'Missing outline {char}')
    pen=SVGPathPen(glyphs)
    glyphs[name].draw(TransformPen(pen,(scale,0,0,-scale,0,800)))
    return {'width':fallback['hmtx'][name][0]/fallback['head'].unitsPerEm,'path':pen.getCommands()}
replacements={
    'access':'PUBLIC ARCHIVE READY', 'identity':'PROJECTS BY : HERZ1',
    'permission':'PUBLIC ACCESS ENABLED', 'brand':'HERZ1',
    'company':'HERZ1 ARCHIVE','database':'PUBLIC PROJECT ARCHIVE',
}
for key,value in replacements.items():
    entry=art[key]
    entry['text']=value
    entry['letters']=[letter(c,entry['weight']) for c in value]
out=root/'website/archive/src/boot-lettering-art.json'
out.write_text(json.dumps(art,ensure_ascii=False,separators=(',',':'))+'\n',encoding='utf-8')
boot=root/'website/archive/src/boot.ts'
code=boot.read_text(encoding='utf-8')
code=code.replace('ACCESS PERMISSION REQUIRED','PUBLIC ARCHIVE READY').replace('ID CONFIRMED : HERZ1','PROJECTS BY : HERZ1').replace('PERMISSION AUTHORIZED','PUBLIC ACCESS ENABLED')
boot.write_text(code,encoding='utf-8')
print('Prepared personal brand phrase outlines from original SVG glyphs + Noto.')
# Keep the upstream font coverage contract useful for the adapted public page.
coverage={}
for stem in ['shippori-mincho-b1-600','noto-serif-sc-600','noto-sans-sc-400']:
    font=TTFont(landing/'fonts'/f'{stem}.woff2')
    coverage[stem]=''.join(chr(n) for n in sorted(font.getBestCmap()))
(landing/'fonts/subset.json').write_text(json.dumps({'text':''.join(sorted(set(text))),'act0':act0,'glyphs':coverage},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
