import subprocess, numpy as np, sys
W,H=1920,1080
def frames(path, fmt, ch, dt):
    p=subprocess.Popen(['ffmpeg','-v','error','-i',path,'-f','rawvideo','-pix_fmt',fmt,'-'],stdout=subprocess.PIPE)
    n=W*H*ch*np.dtype(dt).itemsize
    while True:
        b=p.stdout.read(n)
        if len(b)<n: break
        yield np.frombuffer(b,dt).reshape(H,W,ch)
A='C:/Users/ayush/Videos/CLAUDE/PROJECT/graphics/hyperframes/out/camping8/v3/'
o=frames(A+'card4-c2.mp4','rgb24',3,np.uint8)
t=frames(A+'ctxt-c2.mov','rgba64le',4,np.uint16)
for i,(f,g) in enumerate(zip(o,t)):
    a=g[...,3]/65535.
    if i%10==0:
        ys,xs=np.nonzero(a>0.02)
        bb=(xs.min(),xs.max(),ys.min(),ys.max()) if len(xs) else None
        # where alpha~1, compare colors
        m=a>0.99
        if m.sum():
            d=np.abs(f[m].astype(float)-g[...,:3][m]/257.).mean()
        else: d=None
        print(i,bb,'amax',round(a.max(),3),'n1',m.sum(),'diff@a1',d)
