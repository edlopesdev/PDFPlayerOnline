// This file handles saving and retrieving the reading progress from localStorage. 
// It ensures that the application resumes from the last position when reopened.

const progressKey = 'pdfPlayerProgress';

export function saveProgress(currentTime) {
    localStorage.setItem(progressKey, currentTime);
}

export function getProgress() {
    return localStorage.getItem(progressKey) || 0;
}

export function clearProgress() {
    localStorage.removeItem(progressKey);
}

export function initializeProgress() {
  // Placeholder para Progress
}