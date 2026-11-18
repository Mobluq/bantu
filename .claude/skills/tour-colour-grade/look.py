"""Filter strings for the Tour 'Wes film' look.
hlg(): HDR HLG (iPhone) -> SDR Rec.709 with a soft highlight roll-off, for use per source before scaling.
look(scale): LUT + halation + diffusion + de-sharpen + grain + light vignette, at output size (scale 1 = 1080x1920)."""
import os, subprocess, json
D=os.path.dirname(os.path.abspath(__file__))
LUT=os.path.join(D,'tour-wes.cube')
def is_hlg(path):
    r=subprocess.run(['ffprobe','-v','error','-select_streams','v:0','-show_entries','stream=color_transfer','-of','csv=p=0',path],capture_output=True,text=True)
    return 'arib-std-b67' in r.stdout or 'smpte2084' in r.stdout
def hlg():
    return ("zscale=t=linear:npl=203,format=gbrpf32le,zscale=p=bt709,"
            "tonemap=tonemap=mobius:param=0.35:desat=0,zscale=t=bt709:m=bt709:r=tv,format=yuv420p")
def look(scale=1.0, lut=LUT, grain=7, halation=0.22, diffusion=0.08):
    s=scale
    return (f"format=gbrp,lut3d=file={lut}:interp=tetrahedral,split=3[lk_o][lk_h][lk_d];"
            f"[lk_h]curves=all='0/0 0.72/0 1/1',gblur=sigma={14*s:.1f},colorchannelmixer=rr=1.0:gg=0.40:bb=0.20[lk_hal];"
            f"[lk_d]gblur=sigma={3.5*s:.1f}[lk_dif];"
            f"[lk_o][lk_dif]blend=all_mode=screen:all_opacity={diffusion}[lk_o2];"
            f"[lk_o2][lk_hal]blend=all_mode=screen:all_opacity={halation},"
            f"unsharp=5:5:-0.30:5:5:0,format=yuv420p,noise=c0s={grain}:c0f=t+u,vignette=angle=PI/6")
