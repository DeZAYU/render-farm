import json
E="000f4251"
# (tl_start, tl_end, src_in, note)  -- holes between Lucas raw cues; last row of each hole ends on the raw start (flag e)
R=[(4.5,8.0,116.5,"storms back roads"),
 (17.25,19.47,333.0,"flat tire"),(19.47,24.20,339.0,"where they sleep/whoops"),(24.20,28.77,236.0,"calls/bigfoot signal"),
 (28.77,31.69,466.0,"overgrown track to house"),(31.69,35.83,459.0,"recently driven"),(35.83,41.041,649.0,"way back down"),
 (72.6392,79.08,631.0,"shadows/camera caught"),(79.08,84.08,616.5,"knock near house"),(84.08,88.59,805.0,"that night rain fog"),
 (88.59,93.07,970.0,"thermal"),(93.07,97.6642,1010.0,"beam off fog"),
 (131.765,138.36,1040.0,"follow into fog"),(138.36,141.70,1180.0,"along road drop-off"),(141.70,144.37,1204.0,"sign"),(144.37,146.4797,1290.0,"sound behind"),
 (175.2751,178.63,1430.0,"ten minutes"),(178.63,182.42,1450.0,"light moves drops"),(182.42,186.72,1480.0,"one noise"),(186.72,190.09,1520.0,"thud thrown"),
 (190.09,193.08,1560.0,"fog dangerous"),(193.08,196.57,1600.0,"pass own camp"),(196.57,199.96,1650.0,"cliff edge"),(199.96,205.9391,1700.0,"thirty minutes lost"),
 (231.8316,236.73,2083.0,"thermal glowing"),(236.73,240.00,2030.0,"campfire"),(240.00,244.10,2125.0,"own truck"),(244.10,247.85,2185.0,"heat fools camera"),(247.85,250.4836,2163.0,"next sound"),
 (272.5723,276.96,2228.0,"calls reported"),(276.96,284.87,2270.0,"tent bed"),(284.87,288.48,2610.0,"gretchen tomb"),(288.48,291.44,2650.0,"haunted park"),
 (291.44,296.84,2770.0,"hamilton mill bride"),(296.84,302.84,3262.0,"wooden knocker trail"),(302.84,307.2069,3283.0,"jakey whistle"),
 (337.8041,345.73,3203.0,"tree shoved"),(345.73,351.98,3605.0,"rock steps blocked"),(351.98,355.4551,2530.0,"mill flooded")]
RAWSTART={41.041,97.6642,146.4797,205.9391,250.4836,307.2069}
rows=[]
for a,b,s,n in R:
    fl=("e" if b in RAWSTART else "")+("s" if a in (72.6392,131.765,175.2751,231.8316,272.5723,337.8041) else "")
    rows.append([E,s,a,b,fl,n])
json.dump(rows,open("edl_l.json","w"))
with open("vf_l.txt","w") as f:
    for i,(a,b,s,n) in enumerate(R): f.write(f"{i:02d} {s+0.3:.2f} {s+(b-a)/2:.2f} {s+b-a-0.3:.2f} {n}\n")
