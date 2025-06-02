// src/hooks/useImageFilter.js
import { useState } from 'react';

const useImageFilter = () => {
  const [selectedFilter, setSelectedFilter] = useState('none');
  const [filteredImage, setFilteredImage] = useState(null);

  const applyFilter = (imageUrl, filterType) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          switch(filterType) {
            case 'grayscale':
              const avg = 0.299 * r + 0.587 * g + 0.114 * b;
              data[i] = data[i + 1] = data[i + 2] = avg;
              break;
            case 'invert':
              data[i] = 255 - r;
              data[i + 1] = 255 - g;
              data[i + 2] = 255 - b;
              break;
            case 'sepia':
              data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
              data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
              data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
              break;
            case 'contrast':
              const factor = 2.5;
              data[i] = 128 + factor * (r - 128);
              data[i + 1] = 128 + factor * (g - 128);
              data[i + 2] = 128 + factor * (b - 128);
              break;
            case 'brightness':
              const brightness = 50;
              data[i] = r + brightness;
              data[i + 1] = g + brightness;
              data[i + 2] = b + brightness;
              break;
            default:
              break;
          }
        }
        
        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      };
      img.src = imageUrl;
    });
  };

  const normalizeImage = (imageUrl) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        let minR = 255, maxR = 0;
        let minG = 255, maxG = 0;
        let minB = 255, maxB = 0;
        
        for (let i = 0; i < data.length; i += 4) {
          minR = Math.min(minR, data[i]);
          maxR = Math.max(maxR, data[i]);
          minG = Math.min(minG, data[i+1]);
          maxG = Math.max(maxG, data[i+1]);
          minB = Math.min(minB, data[i+2]);
          maxB = Math.max(maxB, data[i+2]);
        }
        
        const rangeR = maxR - minR;
        const rangeG = maxG - minG;
        const rangeB = maxB - minB;
        
        for (let i = 0; i < data.length; i += 4) {
          data[i] = rangeR > 0 ? ((data[i] - minR) / rangeR) * 255 : data[i];
          data[i+1] = rangeG > 0 ? ((data[i+1] - minG) / rangeG) * 255 : data[i+1];
          data[i+2] = rangeB > 0 ? ((data[i+2] - minB) / rangeB) * 255 : data[i+2];
        }
        
        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      };
      img.src = imageUrl;
    });
  };

  const handleFilterSelect = async (filter, file) => {
    if (!file?.originFileObj) return;
    
    setSelectedFilter(filter);
    const imageUrl = URL.createObjectURL(file.originFileObj);
    const filteredUrl = await applyFilter(imageUrl, filter);
    setFilteredImage(filteredUrl);
    URL.revokeObjectURL(imageUrl);
    return filteredUrl;
  };

  const resetFilter = async (file) => {
    if (!file?.originFileObj) return;
    
    setSelectedFilter('none');
    const imageUrl = URL.createObjectURL(file.originFileObj);
    const normalizedUrl = await normalizeImage(imageUrl);
    setFilteredImage(null);
    URL.revokeObjectURL(imageUrl);
    return normalizedUrl;
  };

  return {
    selectedFilter,
    filteredImage,
    applyFilter,
    normalizeImage,
    handleFilterSelect,
    resetFilter,
    setSelectedFilter,
    setFilteredImage
  };
};

export default useImageFilter;