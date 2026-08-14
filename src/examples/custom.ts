import { createShader, createProgram } from '@/utils';

type preparedWorkedProp = {
  canvas: HTMLCanvasElement, vertexShaderSource: string, fragmentShaderSource: string
}

export const doPreparedWorked = ({
  canvas, vertexShaderSource, fragmentShaderSource,
}: preparedWorkedProp) => {
  const gl = canvas.getContext('webgl');
  const vetexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  const program = createProgram(gl, vetexShader, fragmentShader);

  return {
    gl, vetexShader, fragmentShader, program,
  };
};
