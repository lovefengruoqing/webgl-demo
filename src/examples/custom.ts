import { createShader, createProgram } from '@/utils';

type preparedWorkedProp = {
  canvas: HTMLCanvasElement, vetexShaderSource: string, fragmentShaderSource: string
}

export const doPreparedWorked = ({
  canvas, vetexShaderSource, fragmentShaderSource,
}: preparedWorkedProp) => {
  const gl = canvas.getContext('webgl');
  const vetexShader = createShader(gl, gl.VERTEX_SHADER, vetexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  const program = createProgram(gl, vetexShader, fragmentShader);

  return {
    gl, vetexShader, fragmentShader, program,
  };
};
