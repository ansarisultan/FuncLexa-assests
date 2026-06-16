import { useState, useCallback } from 'react';

export function useImageProcessor() {
  const [originalSize, setOriginalSize] = useState(0);
  const [processedSize, setProcessedSize] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [blobResult, setBlobResult] = useState(null);
  const [processing, setProcessing] = useState(false);

  const processImage = useCallback(async (file, targetFormat, quality = 0.92, maxWidth = 2048) => {
    setProcessing(true);
    setOriginalSize(file.size);

    // Handle HEIC
    let imageSrc;
    if (file.type === 'image/heic' || file.name.endsWith('.heic')) {
      try {
        const heic2any = (await import('heic2any')).default;
        const result = await heic2any({ blob: file, toType: 'image/png' });
        const blob = Array.isArray(result) ? result[0] : result;
        imageSrc = URL.createObjectURL(blob);
      } catch (e) {
        setProcessing(false);
        throw new Error('HEIC conversion failed.');
      }
    } else {
      imageSrc = URL.createObjectURL(file);
    }

    const img = new Image();
    img.src = imageSrc;
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });

    // Special case: SVG conversion
    if (targetFormat === 'svg') {
      try {
        // Convert image to base64 and embed in SVG
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        // Get image data as base64
        const dataUrl = canvas.toDataURL('image/png');
        
        // Create SVG with embedded base64 image
        const svgContent = `
          <svg xmlns="http://www.w3.org/2000/svg" width="${img.width}" height="${img.height}">
            <image href="${dataUrl}" width="${img.width}" height="${img.height}" />
          </svg>
        `;
        
        const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
        const svgUrl = URL.createObjectURL(svgBlob);
        
        setPreviewUrl(svgUrl);
        setBlobResult(svgBlob);
        setProcessedSize(svgBlob.size);
        setProcessing(false);
        
        return { blob: svgBlob, blobUrl: svgUrl, size: svgBlob.size };
      } catch (e) {
        setProcessing(false);
        throw new Error('SVG conversion failed.');
      }
    }

    // Resize if needed
    let { width, height } = img;
    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);

    // Special handling for ICO
    if (targetFormat === 'ico') {
      const icoCanvas = document.createElement('canvas');
      icoCanvas.width = 32;
      icoCanvas.height = 32;
      const icoCtx = icoCanvas.getContext('2d');
      icoCtx.drawImage(img, 0, 0, 32, 32);
      // ICO in browsers is essentially PNG with different extension
      const blob = await new Promise((res) => icoCanvas.toBlob(res, 'image/png'));
      const blobUrl = URL.createObjectURL(blob);
      setPreviewUrl(blobUrl);
      setBlobResult(blob);
      setProcessedSize(blob.size);
      setProcessing(false);
      return { blob, blobUrl, size: blob.size };
    }

    const mimeType =
      targetFormat === 'jpeg' ? 'image/jpeg' :
      targetFormat === 'webp' ? 'image/webp' : 'image/png';

    const blob = await new Promise((res) => canvas.toBlob(res, mimeType, quality));
    const blobUrl = URL.createObjectURL(blob);
    setPreviewUrl(blobUrl);
    setBlobResult(blob);
    setProcessedSize(blob.size);
    setProcessing(false);
    return { blob, blobUrl, size: blob.size };
  }, []);

  const compressImage = useCallback(async (file, quality) => {
    return await processImage(file, 'webp', quality, 1920);
  }, [processImage]);

  const reset = () => {
    setOriginalSize(0);
    setProcessedSize(0);
    setPreviewUrl(null);
    setBlobResult(null);
    setProcessing(false);
  };

  return { originalSize, processedSize, previewUrl, blobResult, processing, processImage, compressImage, reset };
}