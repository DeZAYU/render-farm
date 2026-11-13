import sys, subprocess, numpy as np
from PIL import Image, ImageDraw
src, out = sys.argv[1], sys.argv[2]; ts=[float(x) for x in sys.argv[3].split(',')]
cols=6; tw,th=320,180; rows=(len(ts)+cols-1)//cols
sheet=Image.new('RGB',(cols*tw,rows*th))
for i,t in enumerate(ts):
    b=subprocess.run(['ffmpeg','-v','error','-ss',str(t),'-i',src,'-frames:v','1','-vf',f'scale={tw}:{th}','-f','rawvideo','-pix_fmt','rgb24','-'],capture_output=True).stdout
    if len(b)<tw*th*3: continue
    im=Image.frombytes('RGB',(tw,th),b[:tw*th*3]); d=ImageDraw.Draw(im); d.rectangle((0,0,70,16),fill=(0,0,0)); d.text((2,2),f'{t:.1f}',fill=(255,255,0))
    sheet.paste(im,((i%cols)*tw,(i//cols)*th))
sheet.save(out)
