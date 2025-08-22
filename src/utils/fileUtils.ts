export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const isValidImageFile = (file: File): boolean => {
  return ALLOWED_FILE_TYPES.includes(file.type);
};

export const isValidFileSize = (file: File): boolean => {
  return file.size <= MAX_FILE_SIZE;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toUpperCase() || '';
};

export const validateFile = (
  file: File
): { isValid: boolean; error?: string } => {
  if (!isValidImageFile(file)) {
    return {
      isValid: false,
      error: `Invalid file type. Only ${ALLOWED_FILE_TYPES.join(', ')} files are allowed.`,
    };
  }

  if (!isValidFileSize(file)) {
    return {
      isValid: false,
      error: `File size ${formatFileSize(file.size)} exceeds the maximum allowed size of ${formatFileSize(MAX_FILE_SIZE)}.`,
    };
  }

  return { isValid: true };
};
