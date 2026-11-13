import subprocess, numpy as np, cv2, sys
W,H=1920,1080
S=sys.argv[1]; k=int(sys.argv[2])
A='C:/Users/ayush/Videos/CLAUDE/PROJECT/graphics/hyperframes/out/camping8/v3/'
def one(path,fmt,ch,dt):
    b=subprocess.run(['ffmpeg','-v','error','-i',path,'-vf',f'select=eq(n\,{k})','-frames:v','1','-f','rawvideo','-pix_fmt',fmt,'-'],capture_output=True).stdout
    return np.frombuffer(b,dt).reshape(H,W,ch)
f=one(A+'card4-c2.mp4','rgb24',3,np.uint8).astype(float)
g=one(A+'ctxt-c2.mov','rgba64le',4,np.uint16).astype(float)/65535
a=g[...,3:]; T=g[...,:3]*255
print('alpha pct', np.percentile(a,[1,10,50,90,99]))
print('T in low-alpha region mean', T[a[...,0]<0.95].mean(0))
F=(f-T*a)/np.maximum(1-a,1e-3)
ok=(1-a[...,0])>0.15
print('F range in ok', np.percentile(F[ok],[0.5,50,99.5]))
cv2.imwrite(f'{S}/v3/p_orig{k}.png',f[...,::-1].astype(np.uint8))
cv2.imwrite(f'{S}/v3/p_alpha{k}.png',(a[...,0]*255).astype(np.uint8))
cv2.imwrite(f'{S}/v3/p_F{k}.png',np.clip(F*ok[...,None],0,255)[...,::-1].astype(np.uint8))
