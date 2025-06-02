// useImageFilters.js
import { useState } from 'react';

const useImageFilters = () => {
  const [isFiltering, setIsFiltering] = useState(false);

  const applyFilter = async (imageUrl, filterType) => {
    setIsFiltering(true);
    
    try {
      const result = await new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = function () {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;

          // Helper function to get pixel value at (x,y)
          function getPixel(x, y) {
            if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) {
              return [0, 0, 0]; // Return black for out of bounds
            }
            const offset = (y * canvas.width + x) * 4;
            return [
              imageData.data[offset],
              imageData.data[offset + 1],
              imageData.data[offset + 2]
            ];
          }

          // Convert to grayscale first for edge detection
          if (filterType === "sobel" || filterType === "laplacian") {
            for (let i = 0; i < data.length; i += 4) {
              const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
              data[i] = data[i + 1] = data[i + 2] = gray;
            }
            ctx.putImageData(imageData, 0, 0);
          }

          switch (filterType) {
            case "grayscale":
              for (let i = 0; i < data.length; i += 4) {
                const avg = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
                data[i] = data[i + 1] = data[i + 2] = avg;
              }
              break;
            case "invert":
              for (let i = 0; i < data.length; i += 4) {
                data[i] = 255 - data[i];
                data[i + 1] = 255 - data[i + 1];
                data[i + 2] = 255 - data[i + 2];
              }
              break;
            case "sepia":
              for (let i = 0; i < data.length; i += 4) {
                data[i] = Math.min(255, data[i] * 0.393 + data[i + 1] * 0.769 + data[i + 2] * 0.189);
                data[i + 1] = Math.min(255, data[i] * 0.349 + data[i + 1] * 0.686 + data[i + 2] * 0.168);
                data[i + 2] = Math.min(255, data[i] * 0.272 + data[i + 1] * 0.534 + data[i + 2] * 0.131);
              }
              break;
            case "contrast":
              const contrastFactor = 2.5;
              for (let i = 0; i < data.length; i += 4) {
                data[i] = 128 + contrastFactor * (data[i] - 128);
                data[i + 1] = 128 + contrastFactor * (data[i + 1] - 128);
                data[i + 2] = 128 + contrastFactor * (data[i + 2] - 128);
              }
              break;
            case "brightness":
              const brightness = 50;
              for (let i = 0; i < data.length; i += 4) {
                data[i] = Math.min(255, data[i] + brightness);
                data[i + 1] = Math.min(255, data[i + 1] + brightness);
                data[i + 2] = Math.min(255, data[i + 2] + brightness);
              }
              break;
            case "sobel":
              const sobelData = new Uint8ClampedArray(data.length);
              
              // Sobel kernels
              const sobelX = [
                [-1, 0, 1],
                [-2, 0, 2],
                [-1, 0, 1]
              ];
              
              const sobelY = [
                [-1, -2, -1],
                [0, 0, 0],
                [1, 2, 1]
              ];
              
              for (let y = 0; y < canvas.height; y++) {
                for (let x = 0; x < canvas.width; x++) {
                  let pixelX = 0;
                  let pixelY = 0;
                  
                  // Apply Sobel kernels
                  for (let ky = -1; ky <= 1; ky++) {
                    for (let kx = -1; kx <= 1; kx++) {
                      const pixel = getPixel(x + kx, y + ky);
                      const gray = pixel[0];
                      
                      pixelX += gray * sobelX[ky + 1][kx + 1];
                      pixelY += gray * sobelY[ky + 1][kx + 1];
                    }
                  }
                  
                  const magnitude = Math.min(255, Math.sqrt(pixelX * pixelX + pixelY * pixelY));
                  const offset = (y * canvas.width + x) * 4;
                  sobelData[offset] = sobelData[offset + 1] = sobelData[offset + 2] = magnitude;
                  sobelData[offset + 3] = 255; // Alpha channel
                }
              }
              
              // Copy the result back to the original data
              for (let i = 0; i < data.length; i++) {
                data[i] = sobelData[i];
              }
              break;
            case "laplacian":
              const laplacianData = new Uint8ClampedArray(data.length);
              
              // Laplacian kernel
              const laplacianKernel = [
                [0, 1, 0],
                [1, -4, 1],
                [0, 1, 0]
              ];
              
              for (let y = 0; y < canvas.height; y++) {
                for (let x = 0; x < canvas.width; x++) {
                  let sum = 0;
                  
                  // Apply Laplacian kernel
                  for (let ky = -1; ky <= 1; ky++) {
                    for (let kx = -1; kx <= 1; kx++) {
                      const pixel = getPixel(x + kx, y + ky);
                      const gray = pixel[0];
                      sum += gray * laplacianKernel[ky + 1][kx + 1];
                    }
                  }
                  
                  const magnitude = Math.min(255, Math.abs(sum));
                  const offset = (y * canvas.width + x) * 4;
                  laplacianData[offset] = laplacianData[offset + 1] = laplacianData[offset + 2] = magnitude;
                  laplacianData[offset + 3] = 255; // Alpha channel
                }
              }
              
              // Copy the result back to the original data
              for (let i = 0; i < data.length; i++) {
                data[i] = laplacianData[i];
              }
              break;
            default:
              break;
          }

          ctx.putImageData(imageData, 0, 0);
          resolve(canvas.toDataURL("image/jpeg", 0.9));
        };
        img.src = imageUrl;
      });

      return result;
    } finally {
      setIsFiltering(false);
    }
  };

  return { applyFilter, isFiltering };
};

export default useImageFilters;