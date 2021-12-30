
export const vertexShaderSource = `
attribute vec4 a_position;
attribute vec3 a_normal;

uniform vec3 u_lightWorldPosition;
uniform vec3 u_viewWorldPosition;

uniform mat4 u_world;
uniform mat4 u_worldViewProjection;
uniform mat4 u_worldInverseTranspose;

varying vec3 v_normal;
varying vec3 v_surfaceToLight;
varying vec3 v_surfaceToView;

void main() {
  gl_Position = u_worldViewProjection * a_position;

  // 重定向法向量并传递给片断着色器
  v_normal = mat3(u_worldInverseTranspose) * a_normal;

  // 计算表面的世界坐标
  vec3 surfaceWorldPosition = (u_world * a_position).xyz;

  // 计算表面到光源的方向
  // 然后传递到片断着色器
  v_surfaceToLight = u_lightWorldPosition - surfaceWorldPosition;

  // 计算表面到相机的方向
  // 然后传递到片断着色器
  v_surfaceToView = u_viewWorldPosition - surfaceWorldPosition;
}`;

export const fragmentShaderSource = `
precision mediump float;

varying vec3 v_normal;
varying vec3 v_surfaceToLight;
varying vec3 v_surfaceToView;

uniform vec4 u_color;
uniform float u_shininess;

uniform vec3 u_lightColor;
uniform vec3 u_specularColor;

void main() {
  vec3 normal = normalize(v_normal);

  vec3 surfaceToLightDirection = normalize(v_surfaceToLight);
  vec3 surfaceToViewDirection = normalize(v_surfaceToView);
  vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);

  float light = dot(normal, surfaceToLightDirection);

  float specular = 0.0;
  if(light > 0.0) {
    specular = pow(dot(normal, halfVector), u_shininess);
  }

  gl_FragColor = u_color;

  gl_FragColor.rgb *= light * u_lightColor;

  // 加上高光
  gl_FragColor.rgb += specular * u_specularColor;
}`;
