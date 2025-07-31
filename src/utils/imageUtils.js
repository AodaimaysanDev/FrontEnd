// /frontend/src/utils/imageUtils.js
/**
 * Utility functions for handling images
 */

/**
 * Validates and optimizes a base64 image string
 * @param {string} base64String - The base64 encoded image
 * @param {Object} options - Configuration options
 * @param {number} options.maxSizeMB - Maximum size in MB (default: 1)
 * @param {number} options.maxWidthOrHeight - Maximum width/height in pixels (default: 1024)
 * @returns {Promise<string>} - Optimized base64 string or null if invalid
 */
export const optimizeBase64Image = async (base64String, options = {}) => {
  if (!base64String || typeof base64String !== 'string') {
    return null;
  }

  const maxSizeMB = options.maxSizeMB || 1;
  const maxWidthOrHeight = options.maxWidthOrHeight || 1024;

  // Create an image from the base64 string
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = function() {
      // Create a canvas to resize the image if needed
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      // Calculate new dimensions while maintaining aspect ratio
      if (width > height) {
        if (width > maxWidthOrHeight) {
          height = Math.round(height * maxWidthOrHeight / width);
          width = maxWidthOrHeight;
        }
      } else {
        if (height > maxWidthOrHeight) {
          width = Math.round(width * maxWidthOrHeight / height);
          height = maxWidthOrHeight;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw the resized image
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to base64 with compression (0.7 quality)
      const optimizedBase64 = canvas.toDataURL('image/jpeg', 0.7);
      
      // Check final size
      const sizeInBytes = optimizedBase64.length * 0.75; // Approximation: base64 is ~33% larger than binary
      const sizeInMB = sizeInBytes / (1024 * 1024);
      
      if (sizeInMB > maxSizeMB) {
        console.warn(`Image still too large (${sizeInMB.toFixed(2)}MB), max allowed is ${maxSizeMB}MB`);
        // Further reduce quality if needed
        resolve(canvas.toDataURL('image/jpeg', 0.5));
      } else {
        resolve(optimizedBase64);
      }
    };
    
    img.onerror = function() {
      console.error('Invalid image data');
      resolve(null);
    };
    
    img.src = base64String;
  });
};

/**
 * Converts a file to base64
 * @param {File} file - The file object
 * @returns {Promise<string>} - Base64 encoded string or null on error
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve) => {
    if (!file) {
      resolve(null);
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = () => {
      resolve(reader.result);
    };
    
    reader.onerror = () => {
      console.error('Error reading file');
      resolve(null);
    };
    
    reader.readAsDataURL(file);
  });
};
