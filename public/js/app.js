// This file initializes the PDF Player Online application and manages the overall application flow.

import { initializeTTS } from './tts.js';
import { initializePlayer } from './player.js';
import { initializeProgress } from './progress.js';
import { initializeAds } from './ads.js';
import { initializePremium } from './premium.js';

// Estado global
let pdfDoc = null;
let currentPage = 1;
let totalPages = 0;
let isPlaying = false;
let speechRate = 1;

const pdfInput = document.getElementById('pdfInput');
const startBtn = document.getElementById('startBtn');
const player = document.getElementById('player');
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const elapsed = document.getElementById('elapsed');
const total = document.getElementById('total');
const progressBar = document.getElementById('progressBar');

// Adiciona seletor de velocidade ao player
const speedDiv = document.createElement('div');
speedDiv.className = "flex items-center justify-center gap-4 mt-6";
speedDiv.innerHTML = `
  <label for="speedSelect" class="text-cyan-300 font-semibold">Velocidade:</label>
  <select id="speedSelect" class="bg-blue-900 text-white rounded-lg px-3 py-2 font-bold">
    <option value="0.5">0.5x</option>
    <option value="1" selected>1x</option>
    <option value="1.25">1.25x</option>
    <option value="1.5">1.5x</option>
    <option value="1.75">1.75x</option>
    <option value="2">2x</option>
  </select>
`;
player.appendChild(speedDiv);

const speedSelect = document.getElementById('speedSelect');
speedSelect.addEventListener('change', (e) => {
  speechRate = parseFloat(e.target.value);
  if (isPlaying) {
    window.speechSynthesis.cancel();
    speakPage(currentPage);
  }
});

pdfInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    const arrayBuffer = await file.arrayBuffer();
    pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    totalPages = pdfDoc.numPages;
    currentPage = 1;
    player.style.display = 'block';
    updateProgress();
    startBtn.disabled = false; // Habilita o botão após upload
  }
});

startBtn.addEventListener('click', () => {
  if (pdfDoc) {
    speakPage(currentPage);
  }
});

playPauseBtn.addEventListener('click', () => {
  if (isPlaying) {
    window.speechSynthesis.pause();
    isPlaying = false;
    playPauseBtn.textContent = '▶';
  } else {
    window.speechSynthesis.resume();
    isPlaying = true;
    playPauseBtn.textContent = '⏸';
  }
});

prevBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    window.speechSynthesis.cancel();
    currentPage--;
    speakPage(currentPage);
  }
});

nextBtn.addEventListener('click', () => {
  if (currentPage < totalPages) {
    window.speechSynthesis.cancel();
    currentPage++;
    speakPage(currentPage);
  }
});

function updateProgress() {
  elapsed.textContent = String(currentPage).padStart(2, '0') + ':' + '00';
  total.textContent = String(totalPages).padStart(2, '0') + ':' + '00';
  progressBar.value = Math.round((currentPage / totalPages) * 100);
}

async function speakPage(pageNum) {
  updateProgress();
  const page = await pdfDoc.getPage(pageNum);
  const textContent = await page.getTextContent();
  const text = textContent.items.map(item => item.str).join(' ');
  if (text.trim().length === 0) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = speechRate;
  utter.lang = 'pt-BR';
  utter.onstart = () => {
    isPlaying = true;
    playPauseBtn.textContent = '⏸';
  };
  utter.onend = () => {
    isPlaying = false;
    playPauseBtn.textContent = '▶';
  };
  window.speechSynthesis.speak(utter);
}

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