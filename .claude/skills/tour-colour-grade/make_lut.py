"""Tour Studios 'Wes' film LUT: warm, pastel, lifted blacks, soft highlights.
Input/output: Rec.709 display-referred RGB. Writes a 33-point .cube file.
python make_lut.py OUT.cube [strength 0..1]"""
import sys, numpy as np
N=33; strength=float(sys.argv[2]) if len(sys.argv)>2 else 1.0
g=np.linspace(0,1,N)
B,G,R=np.meshgrid(g,g,g,indexing='ij')          # .cube order: R fastest
rgb=np.stack([R,G,B],-1).reshape(-1,3)

def to_lin(x): return np.where(x<0.081,x/4.5,((x+0.099)/1.099)**(1/0.45))
def to_709(x):
    x=np.clip(x,0,None); return np.where(x<0.018,4.5*x,1.099*x**0.45-0.099)
M1=np.array([[0.4122214708,0.5363325363,0.0514459929],[0.2119034982,0.6806995451,0.1073969566],[0.0883024619,0.2817188376,0.6299787005]])
M2=np.array([[0.2104542553,0.7936177850,-0.0040720468],[1.9779984951,-2.4285922050,0.4505937099],[0.0259040371,0.7827717662,-0.8086757660]])
def lin2ok(c):
    lms=c@M1.T; lms=np.cbrt(lms); return lms@M2.T
def ok2lin(c):
    lms=c@np.linalg.inv(M2).T; lms=lms**3; return lms@np.linalg.inv(M1).T
def bump(h,c,w):  # smooth weight around hue c (deg), half-width w
    d=np.abs((h-c+180)%360-180); return np.clip(1-(d/w)**2,0,1)**2
def smooth(e0,e1,x):
    t=np.clip((x-e0)/(e1-e0),0,1); return t*t*(3-2*t)

lin=to_lin(rgb)
# 1. warm white balance (cream highlights), keep white <= 1
wb=np.array([1.05,1.0,0.875]); lin=lin*wb
lab=lin2ok(np.clip(lin,0,None))
L,a,b=lab[:,0],lab[:,1],lab[:,2]
C=np.hypot(a,b); h=np.degrees(np.arctan2(b,a))%360
# 2. hue-selective palette moves (OKLCh hue angles)
dh=np.zeros_like(h); sc=np.ones_like(h); dl=np.zeros_like(h)
w=bump(h,22,22);  dh+=-8*w;  sc*=1+0.16*w                    # reds -> coral/pink, richer
w=bump(h,58,20);  dh+=+4*w;  sc*=1-0.02*w;  dl+=0.012*w      # skin/orange: golden, not orange
w=bump(h,95,26);  sc*=1+0.30*w; dl+=0.030*w                   # yellow/mustard pops
w=bump(h,140,30); dh+=-28*w; sc*=1-0.36*w                     # greens -> sage/khaki
w=bump(h,192,24); dh+=(190-h)*0.35*w; sc*=1+0.10*w            # teal/mint
w=bump(h,240,22); dh+=-20*w; sc*=1-0.26*w; dl+=0.050*w        # blues -> powder blue, pastel
w=bump(h,285,26); dh+=+30*w; sc*=1-0.22*w; dl+=0.045*w        # violet/purple -> lavender-pink
w=bump(h,340,22); sc*=1+0.10*w; dl+=0.030*w                   # pinks pastel
lowC=smooth(0.025,0.075,C)                                     # leave near-neutrals (white shirts, walls) alone
h2=h+dh*lowC; C2=C*(1+(sc-1)*lowC); L2=L+dl*lowC*smooth(0.15,0.5,L)
# 3. pastel: soft-compress high chroma, lift saturated colours a touch
C2=C2*(1-0.18*smooth(0.10,0.28,C2)); L2=L2+0.025*smooth(0.08,0.22,C2)*smooth(0.2,0.6,L2)
# 4. film tone curve on L: lifted warm toe, gentle mid contrast, soft shoulder
x=np.clip(L2,0,1.2)
toe=0.10; sh=0.955
y=toe+(sh-toe)*(1/(1+np.exp(-5.2*(x-0.56))) - 1/(1+np.exp(5.2*0.56)))/(1/(1+np.exp(-5.2*(1.0-0.56)))-1/(1+np.exp(5.2*0.56)))
L3=0.55*y+0.45*(toe+(sh-toe)*x)          # blend S-curve with linear lift for a softer, flatter print
# 5. split tone: warm brown shadows, cream highlights
sh_w=1-smooth(0.15,0.45,L3); hi_w=smooth(0.70,0.95,L3)
a3=C2*np.cos(np.radians(h2)); b3=C2*np.sin(np.radians(h2))
a3+=0.008*sh_w+0.003*hi_w; b3+=0.014*sh_w+0.022*hi_w
# 6. slightly lower chroma deep in the shadows (film), keep mids rich
cs=0.88+0.12*smooth(0.12,0.40,L3); a3*=cs; b3*=cs
out=ok2lin(np.stack([L3,a3,b3],-1))
# soft gamut handling: desaturate toward luminance when a channel goes out of range
Y=out@np.array([0.2126,0.7152,0.0722])
for _ in range(3):
    lo=out.min(1); hi=out.max(1)
    k=np.ones_like(lo)
    m=lo<0; k[m]=np.minimum(k[m],Y[m]/np.maximum(Y[m]-lo[m],1e-6))
    m=hi>1; k[m]=np.minimum(k[m],(1-Y[m])/np.maximum(hi[m]-Y[m],1e-6))
    k=np.clip(k,0,1); out=Y[:,None]+(out-Y[:,None])*k[:,None]
out=to_709(np.clip(out,0,1))
out=rgb+(out-rgb)*strength
with open(sys.argv[1],'w') as f:
    f.write('TITLE "Tour Wes Film"\nLUT_3D_SIZE %d\nDOMAIN_MIN 0 0 0\nDOMAIN_MAX 1 1 1\n'%N)
    for r,gg,bb in np.clip(out,0,1): f.write(f"{r:.6f} {gg:.6f} {bb:.6f}\n")
print('wrote',sys.argv[1])
