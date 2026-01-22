/**
 * faiscism quiz navigation
 * Handles answer selection, score tracking, and navigation
 */

(function() {
  'use strict';

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
    const continueBtn = document.getElementById('continue-btn');
    const educationalPanel = document.getElementById('educational-panel');
    const nextBtn = document.getElementById('next-btn');

    // Get total questions from data attribute or infer
    const totalQuestions = 10; // All paths have 10 questions

    let selectedAnswer = null;
    let selectedScores = null;

    // Handle option selection
    form.addEventListener('change', (e) => {
      if (e.target.name === 'answer') {
        selectedAnswer = parseInt(e.target.value, 10);
        selectedScores = JSON.parse(e.target.dataset.scores);
        continueBtn.disabled = false;
      }
    });

    // Handle continue button
    continueBtn.addEventListener('click', () => {
      if (selectedAnswer === null) return;

      // Save answer
      updatePathState(pathId, questionNum, selectedAnswer, selectedScores);

      // Show educational content if present
      if (educationalPanel) {
        educationalPanel.hidden = false;
        document.body.style.overflow = 'hidden';
      } else {
        navigateNext();
      }
    });

    // Handle next button (after educational)
    if (nextBtn) {
      nextBtn.addEventListener('click', navigateNext);
    }

    function navigateNext() {
      if (questionNum < totalQuestions) {
        // Go to next question
        window.location.href = `/${pathId}/${questionNum + 1}/`;
      } else {
        // Calculate result and go to result page
        const resultCode = calculateResultCode(pathId);
        window.location.href = `/${pathId}/result/${resultCode}/`;
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

  // Landing page - check for existing progress
  function initLandingPage() {
    const landing = document.querySelector('.landing');
    if (!landing) return;

    const state = getState();
    const paths = ['chain', 'pillars', 'mirror'];

    paths.forEach(pathId => {
      const pathState = state[pathId];
      if (pathState && pathState.answers && pathState.answers.length > 0) {
        const card = document.querySelector(`[href="/${pathId}/"]`);
        if (card) {
          const progress = pathState.answers.filter(a => a !== undefined).length;
          if (progress < 10) {
            const indicator = document.createElement('div');
            indicator.className = 'progress-indicator';
            indicator.textContent = `${progress}/10 completed`;
            card.appendChild(indicator);
          } else {
            const indicator = document.createElement('div');
            indicator.className = 'progress-indicator completed';
            indicator.textContent = '✓ Completed';
            card.appendChild(indicator);
          }
        }
      }
    });
  }

  // Path start page - option to continue or restart
  function initPathStartPage() {
    const startPage = document.querySelector('.path-start');
    if (!startPage) return;

    const pathId = startPage.dataset.path;
    const pathState = getPathState(pathId);
    const progress = pathState.answers ? pathState.answers.filter(a => a !== undefined).length : 0;

    if (progress > 0 && progress < 10) {
      const nav = startPage.querySelector('.start-nav');
      if (nav) {
        const continueBtn = document.createElement('a');
        continueBtn.href = `/${pathId}/${progress + 1}/`;
        continueBtn.className = 'btn continue';
        continueBtn.textContent = `Continue (${progress}/10)`;
        nav.prepend(continueBtn);

        const restartBtn = document.createElement('button');
        restartBtn.className = 'btn restart';
        restartBtn.textContent = 'Start Over';
        restartBtn.addEventListener('click', () => {
          clearPathState(pathId);
          window.location.href = `/${pathId}/1/`;
        });
        nav.appendChild(restartBtn);
      }
    }
  }

  // Initialize on page load
  document.addEventListener('DOMContentLoaded', () => {
    initLandingPage();
    initPathStartPage();
    initQuestionPage();
    initResultPage();
  });
})();
