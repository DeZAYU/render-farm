// GX-ADmixDD tokens (BUILD_SPEC §1-4)
import { Easing } from 'remotion';
export const C = {
  cyan: '#45FDFC', cyanRim: '#BAFEFF', cyanGlow: 'rgba(69,253,252,0.60)', titleWhite: '#F2F6FF',
  label: '#E8E8E8', labelShadow: 'rgba(0,0,0,0.75)', cursor: '#A51F20', danger: '#FF0A0A',
  black: '#050607', bergTeal: '#0E3A44',
};
export const E = {
  settle: Easing.bezier(0.16, 1, 0.3, 1),
  fadeUp: Easing.bezier(0.3, 0.6, 0.4, 1),
  dive: Easing.bezier(0.5, 0, 0.2, 1),
  exitIn: Easing.bezier(0.55, 0, 1, 0.45),
};
export const PUSH = { footage: 0.012, pullOut: -0.011, berg: 0.035, replay: 0.03 };
