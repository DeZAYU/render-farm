import { loadVariableFont as loadArchivo } from '@remotion/google-fonts/Archivo';
import { loadFont as loadVT } from '@remotion/google-fonts/VT323';
export const ARCHIVO = loadArchivo('normal', { subsets: ['latin'] }).fontFamily;
export const VT323 = loadVT('normal', { subsets: ['latin'], weights: ['400'] }).fontFamily;
