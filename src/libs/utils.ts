/**
 * 파일 이름 생성 함수
 */
export const generateFileName = (prefix: string = 'photo', extension: string = 'png') => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  return `${prefix}-${timestamp}.${extension}`;
};

/**
 * 캔버스를 URL로 변환하는 함수
 */
export const canvasToDataURL = (canvas: HTMLCanvasElement, type: string = 'image/png'): string => {
  return canvas.toDataURL(type, 1.0);
};

/**
 * 파일 다운로드 함수
 */
export const downloadFile = (dataURL: string, fileName: string) => {
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * 캔버스 이미지를 저장하는 함수
 */
export const saveCanvasImage = (canvas: HTMLCanvasElement, filename?: string) => {
  const dataURL = canvasToDataURL(canvas);
  const suggestedFilename = filename || generateFileName();
  downloadFile(dataURL, suggestedFilename);
};
