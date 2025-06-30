let step = 0;
const exercises = document.querySelectorAll('.exercise');
const overlay = document.getElementById('transition-overlay');
const msgEl = document.getElementById('transition-message');
const messages = [
  "Great job! Ready for the next exercise?",
  "You're almost there! Just one more!",
  "Excellent work! You've completed your core exercises!",
  "Amazing! Let's add some more exercises to your routine.",
  "Perfect! Here are additional exercises to try.",
  "Fantastic! You're building a great routine.",
  "Outstanding! Keep up the momentum.",
  "Brilliant! You're making excellent progress!"
];

// Additional exercises to show after the initial 3
const additionalExercises = [
  "Tongue Twisters",
  "Breathing Exercises", 
  "Vowel Practice",
  "Consonant Drills",
  "Sentence Repetition",
  "Reading Aloud"
];

function showTransition() {
  msgEl.textContent = messages[step];
  overlay.classList.add('show');
  setTimeout(() => {
    overlay.classList.remove('show');
    goNext();
  }, 1000);
}

function goNext() {
  exercises[step].classList.remove('active');
  exercises[step].classList.add('inactive-left');
  step++;
  
  if (step < exercises.length) {
    exercises[step].classList.remove('inactive-right');
    exercises[step].classList.add('active');
  } else {
    // After completing initial exercises, show additional exercises
    if (step === exercises.length) {
      showAdditionalExercises();
    }
  }
}

function showAdditionalExercises() {
  const container = document.getElementById('session-container');
  container.innerHTML = `
    <div class="additional-exercises">
      <div class="additional-header">
        <h2>Additional Exercises</h2>
        <p>Here are some extra exercises to enhance your speech therapy routine</p>
      </div>
      <div class="exercises-scroll-container">
        <div class="exercises-list">
          ${additionalExercises.map((exercise, index) => `
            <div class="additional-exercise" style="animation-delay: ${index * 0.3}s">
              <div class="exercise-icon">
                <i class="fas fa-microphone-alt"></i>
              </div>
              <h3>${exercise}</h3>
              <p>Practice this exercise to further improve your speech skills</p>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="scroll-indicator">
        <i class="fas fa-chevron-down"></i>
        <span>More exercises coming...</span>
      </div>
    </div>
  `;
  
  // Start the automatic scrolling animation after a delay
  setTimeout(() => {
    startAutoScrolling();
  }, 200);
}

function startAutoScrolling() {
  const scrollContainer = document.querySelector('.exercises-scroll-container');
  const exercisesList = document.querySelector('.exercises-list');
  const scrollIndicator = document.querySelector('.scroll-indicator');
  
  // Hide the scroll indicator
  scrollIndicator.style.opacity = '0';
  
  // Auto-scroll through the exercises list
  let scrollPosition = 0;
  const maxScroll = exercisesList.scrollHeight - scrollContainer.clientHeight;
  const scrollStep = 120; // Height of each exercise card + gap
  const totalSteps = Math.ceil(maxScroll / scrollStep);
  let currentStep = 0;
  
  const autoScrollInterval = setInterval(() => {
    scrollPosition += scrollStep;
    currentStep++;
    
    if (scrollPosition <= maxScroll) {
      exercisesList.style.transform = `translateY(-${scrollPosition}px)`;
      
      // Start fading out 200-500ms before the end
      if (currentStep >= totalSteps - 1) {
        const container = document.getElementById('session-container');
        container.style.transition = 'opacity 1.5s ease, transform 1.5s ease';
        container.style.opacity = '0';
        container.style.transform = 'scale(0.95)';
        
        clearInterval(autoScrollInterval);
        setTimeout(() => {
          showTimeSelection();
        }, 1500);
      }
    } else {
      clearInterval(autoScrollInterval);
      // After scrolling through all exercises, fade out and show time selection
      setTimeout(() => {
        fadeOutAndShowTimeSelection();
      }, 500);
    }
  }, 1000); // Scroll every 1 second
}

function fadeOutAndShowTimeSelection() {
  const container = document.getElementById('session-container');
  container.style.transition = 'opacity 1.5s ease, transform 1.5s ease';
  container.style.opacity = '0';
  container.style.transform = 'scale(0.95)';
  
  setTimeout(() => {
    showTimeSelection();
  }, 1500);
}

function showTimeSelection() {
  const container = document.getElementById('session-container');
  container.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  container.style.opacity = '1';
  container.style.transform = 'scale(1)';
  container.innerHTML = `
    <div class="time-selection">
      <div class="time-header">
        <h2>Choose Your Preferred Time</h2>
        <p>When would you like to practice your speech therapy exercises?</p>
      </div>
      <div class="time-options">
        <div class="time-option" onclick="selectTime('Morning')">
          <i class="fas fa-sun"></i>
          <h3>Morning</h3>
          <p>Start your day with focused practice</p>
        </div>
        <div class="time-option" onclick="selectTime('Afternoon')">
          <i class="fas fa-cloud-sun"></i>
          <h3>Afternoon</h3>
          <p>Midday session for consistent improvement</p>
        </div>
        <div class="time-option" onclick="selectTime('Evening')">
          <i class="fas fa-moon"></i>
          <h3>Evening</h3>
          <p>Wind down with relaxing exercises</p>
        </div>
        <div class="time-option" onclick="selectTime('Flexible')">
          <i class="fas fa-clock"></i>
          <h3>Flexible</h3>
          <p>Practice whenever it fits your schedule</p>
        </div>
      </div>
    </div>
  `;
}

function selectTime(time) {
  const container = document.getElementById('session-container');
  container.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  container.style.opacity = '0';
  container.style.transform = 'scale(0.95)';
  
  setTimeout(() => {
    container.style.opacity = '1';
    container.style.transform = 'scale(1)';
    container.innerHTML = `
      <div class="completion-screen">
        <div class="completion-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <h2>Perfect! You're All Set</h2>
        <p>Your preferred time: <strong>${time}</strong></p>
        <p>You'll be reminded to practice at your chosen time.</p>
        <div class="completion-actions">
          <button class="btn btn-primary btn-large" onclick="goToDashboard()">
            <i class="fas fa-chart-line"></i>
            Go to Dashboard
          </button>
        </div>
      </div>
    `;
  }, 500);
}

function goToDashboard() {
  window.location.href = '/home';
}

document.querySelectorAll('.done-btn').forEach(btn => {
  btn.addEventListener('click', showTransition);
});

// Initialize first exercise
exercises.forEach((ex, idx) => {
  if (idx === 0) ex.classList.add('active');
});

// Add CSS for additional components
const style = document.createElement('style');
style.textContent = `
  .additional-exercises {
    padding: 2rem;
    text-align: center;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .additional-header h2 {
    font-size: 2rem;
    font-weight: 700;
    color: #1a202c;
    margin-bottom: 1rem;
  }

  .additional-header p {
    color: #4a5568;
    margin-bottom: 2rem;
  }

  .exercises-scroll-container {
    height: 300px;
    overflow: hidden;
    position: relative;
    margin-bottom: 1rem;
  }

  .exercises-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    transition: transform 1s ease;
  }

  .additional-exercise {
    background: rgba(102, 126, 234, 0.1);
    border-radius: 12px;
    padding: 1.5rem;
    animation: slideInUp 0.5s ease forwards;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.5s ease;
    height: 100px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .additional-exercise.animate {
    opacity: 1;
    transform: translateY(0);
  }

  @keyframes slideInUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .exercise-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 0.5rem;
  }

  .exercise-icon i {
    color: white;
    font-size: 1rem;
  }

  .additional-exercise h3 {
    font-size: 1rem;
    font-weight: 600;
    color: #1a202c;
    margin-bottom: 0.25rem;
  }

  .additional-exercise p {
    color: #4a5568;
    font-size: 0.8rem;
    line-height: 1.3;
  }

  .scroll-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    color: #667eea;
    font-size: 0.9rem;
    transition: opacity 0.3s ease;
  }

  .scroll-indicator i {
    animation: bounce 2s infinite;
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }

  .time-selection {
    padding: 2rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .time-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .time-header h2 {
    font-size: 2rem;
    font-weight: 700;
    color: #1a202c;
    margin-bottom: 1rem;
  }

  .time-header p {
    color: #4a5568;
  }

  .time-options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .time-option {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 12px;
    padding: 1.5rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid transparent;
  }

  .time-option:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    border-color: #667eea;
  }

  .time-option i {
    font-size: 2rem;
    color: #667eea;
    margin-bottom: 1rem;
  }

  .time-option h3 {
    font-size: 1.2rem;
    font-weight: 600;
    color: #1a202c;
    margin-bottom: 0.5rem;
  }

  .time-option p {
    color: #4a5568;
    font-size: 0.9rem;
  }

  .completion-screen {
    padding: 2rem;
    text-align: center;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .completion-icon {
    width: 100px;
    height: 100px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 2rem;
  }

  .completion-icon i {
    font-size: 3rem;
    color: white;
  }

  .completion-screen h2 {
    font-size: 2rem;
    font-weight: 700;
    color: #1a202c;
    margin-bottom: 1rem;
  }

  .completion-screen p {
    color: #4a5568;
    margin-bottom: 0.5rem;
  }

  .completion-actions {
    margin-top: 2rem;
  }

  @media (max-width: 768px) {
    .exercises-list {
      grid-template-columns: 1fr;
    }
    
    .time-options {
      grid-template-columns: 1fr;
    }
    
    .exercises-scroll-container {
      height: 250px;
    }
    
    .additional-exercise {
      height: 80px;
    }
    
    .time-selection {
      padding: 1rem;
    }
    
    .time-header h2 {
      font-size: 1.5rem;
    }
    
    .completion-screen {
      padding: 1rem;
    }
    
    .completion-screen h2 {
      font-size: 1.5rem;
    }
    
    .completion-icon {
      width: 80px;
      height: 80px;
    }
    
    .completion-icon i {
      font-size: 2.5rem;
    }
  }
`;
document.head.appendChild(style);
