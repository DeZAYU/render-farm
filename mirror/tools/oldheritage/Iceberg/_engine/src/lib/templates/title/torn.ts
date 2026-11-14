// torn-paper clip-path polygon (VV photo-card edges; = wp3 refsys tornPath)
export const tornClip = (w: number, h: number, seed = 3, amp = 7) => {
  let s = seed;
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const pts: string[] = [];
  const step = 14;
  for (let x = 0; x <= w; x += step) pts.push(`${x}px ${(r() * amp).toFixed(1)}px`);
  for (let y = 0; y <= h; y += step) pts.push(`${(w - r() * amp).toFixed(1)}px ${y}px`);
  for (let x = w; x >= 0; x -= step) pts.push(`${x}px ${(h - r() * amp).toFixed(1)}px`);
  for (let y = h; y >= 0; y -= step) pts.push(`${(r() * amp).toFixed(1)}px ${y}px`);
  return `polygon(${pts.join(",")})`;
};
