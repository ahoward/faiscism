/**
 * faiscism quiz navigation
 * Handles answer selection, score tracking, and navigation
 */

(function() {
  'use strict';

  // Get base path from root element data attribute or default to /
  const BASE_PATH = document.documentElement.dataset.basePath || '/';

  // State management via localStorage
  const STORAGE_KEY = 'faiscism_state';

  function getState() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  }

  function setState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function updatePathState(pathId, questionNum, answerIndex, scores) {
    const state = getState();
    if (!state[pathId]) {
      state[pathId] = { answers: [], scores: {} };
    }

    state[pathId].answers[questionNum - 1] = answerIndex;

    // Merge scores
    for (const [dim, value] of Object.entries(scores)) {
      state[pathId].scores[dim] = (state[pathId].scores[dim] || 0) + value;
    }

    setState(state);
    return state[pathId];
  }

  function getPathState(pathId) {
    return getState()[pathId] || { answers: [], scores: {} };
  }

  function calculateResultCode(pathId) {
    const pathState = getPathState(pathId);
    const scores = pathState.scores;

    // Map dimension scores to levels (0=low, 1=medium, 2=high)
    // Assuming max score per dimension is ~9 (3 questions × 3 points)
    function toLevel(score) {
      if (score <= 3) return 0; // low
      if (score <= 6) return 1; // medium
      return 2; // high
    }

    // Get dimensions based on path
    let dimensions;
    if (pathId === 'chain') {
      dimensions = ['creation', 'consumption', 'feedback'];
    } else if (pathId === 'pillars') {
      dimensions = ['pattern', 'structural', 'centralization'];
    } else if (pathId === 'mirror') {
      dimensions = ['filtering', 'agency', 'systemic'];
    }

    return dimensions.map(d => toLevel(scores[d] || 0)).join('');
  }

  function clearPathState(pathId) {
    const state = getState();
    delete state[pathId];
    setState(state);
  }

  // Question page logic
  function initQuestionPage() {
    const page = document.querySelector('.question-page');
    if (!page) return;

    const pathId = page.dataset.path;
    const questionNum = parseInt(page.dataset.question, 10);
    const form = document.getElementById('question-form');
    const educationalPanel = document.getElementById('educational-panel');
    const nextBtn = document.getElementById('next-btn');

    // Get total questions from data attribute or infer
    const totalQuestions = 10; // All paths have 10 questions

    // Handle option selection - immediately show educational panel or navigate
    form.addEventListener('change', (e) => {
      if (e.target.name === 'answer') {
        const selectedAnswer = parseInt(e.target.value, 10);
        const selectedScores = JSON.parse(e.target.dataset.scores);

        // Save answer
        updatePathState(pathId, questionNum, selectedAnswer, selectedScores);

        // Show educational content if present, otherwise navigate immediately
        if (educationalPanel) {
          educationalPanel.hidden = false;
          // Add revealed class to question for arrow indicator
          const questionText = document.querySelector('.question-text');
          if (questionText) {
            questionText.classList.add('revealed');
          }
        } else {
          navigateNext();
        }
      }
    });

    // Handle next button (after educational)
    if (nextBtn) {
      nextBtn.addEventListener('click', navigateNext);
    }

    function navigateNext() {
      if (questionNum < totalQuestions) {
        // Go to next question
        window.location.href = `${BASE_PATH}${pathId}/${questionNum + 1}/`;
      } else {
        // Calculate result and go to result page
        const resultCode = calculateResultCode(pathId);
        window.location.href = `${BASE_PATH}${pathId}/result/${resultCode}/`;
      }
    }
  }

  // Result page logic
  function initResultPage() {
    const page = document.querySelector('.result-page');
    if (!page) return;

    const copyBtn = document.querySelector('[data-action="copy"]');
    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(window.location.href);
          copyBtn.textContent = 'Copied!';
          setTimeout(() => {
            copyBtn.textContent = 'Copy Link';
          }, 2000);
        } catch {
          // Fallback
          prompt('Copy this link:', window.location.href);
        }
      });
    }
  }

  // Path start page - reset state when starting a quiz
  function initPathStartPage() {
    const startPage = document.querySelector('.path-start');
    if (!startPage) return;

    const pathId = startPage.dataset.path;
    // Always clear state when starting a quiz
    clearPathState(pathId);
  }

  // Initialize on page load
  document.addEventListener('DOMContentLoaded', () => {
    initPathStartPage();
    initQuestionPage();
    initResultPage();
  });
})();
