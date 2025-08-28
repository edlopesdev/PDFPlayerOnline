// This file initializes the PDF Player Online application and manages the overall application flow.

import { initializeTTS } from './tts.js';
import { initializePlayer } from './player.js';
import { initializeProgress } from './progress.js';
import { initializeAds } from './ads.js';
import { initializePremium } from './premium.js';

// Estado global
let pdfText = '';
let chunks = [];
let currentChunk = 0;
let synth = window.speechSynthesis;
let utterance = null;
let isPlaying = false;
let progressKey = '';
let premium = localStorage.getItem('premium') === 'true';

// Elementos
const pdfInput = document.getElementById('pdfInput');
const startBtn = document.getElementById('startBtn');
const player = document.getElementById('player');
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressBar = document.getElementById('progressBar');
const elapsed = document.getElementById('elapsed');
const total = document.getElementById('total');
const adModal = document.getElementById('adModal');
const closeAdBtn = document.getElementById('closeAdBtn');
const premiumBtn = document.getElementById('premiumBtn');

// Utilidades
function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// PDF Upload e extração
pdfInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async function() {
    const typedarray = new Uint8Array(this.result);
    const pdf = await pdfjsLib.getDocument(typedarray).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map(item => item.str).join(' ') + ' ';
    }
    pdfText = text.replace(/\s+/g, ' ').trim();
    // Divida em chunks de ~400 caracteres para TTS
    chunks = pdfText.match(/.{1,400}(\s|$)/g) || [];
    currentChunk = 0;
    progressKey = file.name + '_progress';
    // Carrega progresso salvo
    const saved = localStorage.getItem(progressKey);
    if (saved) currentChunk = parseInt(saved, 10) || 0;
    // Mostra propaganda se não for premium
    if (!premium) {
      adModal.classList.remove('hidden');
    } else {
      showPlayer();
    }
  };
  reader.readAsArrayBuffer(file);
});

// Propaganda
closeAdBtn.onclick = () => {
  adModal.classList.add('hidden');
  showPlayer();
};
premiumBtn.onclick = () => {
  // Simulação de compra premium
  if (confirm('Comprar versão Premium por R$5,00?')) {
    localStorage.setItem('premium', 'true');
    premium = true;
    adModal.classList.add('hidden');
    showPlayer();
    alert('Obrigado por apoiar! Você é Premium.');
    // Aqui você pode integrar Stripe Checkout
  }
};

// Player
function showPlayer() {
  player.classList.remove('hidden');
  updatePlayer();
}
function updatePlayer() {
  total.textContent = formatTime(chunks.length * 10); // Aproximação: 10s por chunk
  elapsed.textContent = formatTime(currentChunk * 10);
  progressBar.max = chunks.length - 1;
  progressBar.value = currentChunk;
}
function speakChunk(idx) {
  if (idx < 0 || idx >= chunks.length) return;
  stopTTS();
  utterance = new SpeechSynthesisUtterance(chunks[idx]);
  utterance.lang = 'pt-BR';
  utterance.rate = 1;
  utterance.onend = () => {
    isPlaying = false;
    currentChunk++;
    saveProgress();
    updatePlayer();
    if (currentChunk < chunks.length) {
      speakChunk(currentChunk);
    }
  };
  utterance.onerror = () => { isPlaying = false; };
  synth.speak(utterance);
  isPlaying = true;
  updatePlayer();
}
function stopTTS() {
  synth.cancel();
  isPlaying = false;
}
function saveProgress() {
  if (progressKey) localStorage.setItem(progressKey, currentChunk);
}

// Controles
startBtn.onclick = () => {
  if (chunks.length === 0) return;
  currentChunk = currentChunk || 0;
  speakChunk(currentChunk);
  player.classList.remove('hidden');
  updatePlayer();
};
playPauseBtn.onclick = () => {
  if (!isPlaying) {
    speakChunk(currentChunk);
  } else {
    stopTTS();
  }
};
prevBtn.onclick = () => {
  if (currentChunk > 0) {
    currentChunk--;
    saveProgress();
    speakChunk(currentChunk);
  }
};
nextBtn.onclick = () => {
  if (currentChunk < chunks.length - 1) {
    currentChunk++;
    saveProgress();
    speakChunk(currentChunk);
  }
};
progressBar.oninput = (e) => {
  currentChunk = parseInt(e.target.value, 10);
  saveProgress();
  speakChunk(currentChunk);
};

// Retomar progresso ao abrir
window.addEventListener('DOMContentLoaded', () => {
  if (pdfInput.files[0]) {
    const file = pdfInput.files[0];
    progressKey = file.name + '_progress';
    const saved = localStorage.getItem(progressKey);
    if (saved) currentChunk = parseInt(saved, 10) || 0;
  }
});

// Initialize Text-to-Speech
initializeTTS();

// Initialize Player
initializePlayer();

// Initialize Progress
initializeProgress();

// Initialize Ads
initializeAds();

// Initialize Premium Features
initializePremium();