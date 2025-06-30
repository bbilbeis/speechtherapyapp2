let step = 0;
const exercises = document.querySelectorAll('.exercise');
const overlay = document.getElementById('transition-overlay');
const msgEl = document.getElementById('transition-message');
const messages = [
  "Great job! Ready for the next exercise?",
  "You're almost there! Just one more!",
  "Excellent work! You've completed your exercises!",
  "Amazing! You've finished your session!"
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
    // After completing all exercises, show improvement data
    if (step === exercises.length) {
      showImprovementData();
    }
  }
}

function showImprovementData() {
  const container = document.getElementById('session-container');
  container.innerHTML = `
    <div class="improvement-screen">
      <div class="improvement-header">
        <h2>Session Complete!</h2>
        <p>Here's how you're doing</p>
      </div>
      <div class="improvement-content">
        <div class="improvement-chart">
          <canvas id="improvementChart"></canvas>
        </div>
        <div class="improvement-stats">
          <div class="stat-item">
            <div class="stat-icon">
              <i class="fas fa-chart-line"></i>
            </div>
            <div class="stat-info">
              <div class="stat-value">+15%</div>
              <div class="stat-label">Improvement</div>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">
              <i class="fas fa-clock"></i>
            </div>
            <div class="stat-info">
              <div class="stat-value">8 min</div>
              <div class="stat-label">Session Time</div>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">
              <i class="fas fa-star"></i>
            </div>
            <div class="stat-info">
              <div class="stat-value">4/4</div>
              <div class="stat-label">Exercises</div>
            </div>
          </div>
        </div>
      </div>
      <div class="improvement-actions">
        <button class="btn btn-primary btn-large" onclick="completeSession()">
          <i class="fas fa-chart-line"></i>
          Back to Dashboard
        </button>
      </div>
    </div>
  `;
  
  // Initialize the improvement chart
  initializeImprovementChart();
}

function initializeImprovementChart() {
  const ctx = document.getElementById('improvementChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [{
        label: 'Your Progress',
        data: [65, 72, 78, 85],
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: { 
          beginAtZero: true, 
          max: 100,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        },
        x: {
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        }
      }
    }
  });
}

function completeSession() {
  // Send completion data to server
  fetch('/complete-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'completed=true'
  }).then(() => {
    window.location.href = '/home';
  });
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

// Add CSS for improvement screen
const style = document.createElement('style');
style.textContent = `
  .improvement-screen {
    padding: 2rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .improvement-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .improvement-header h2 {
    font-size: 2rem;
    font-weight: 700;
    color: #1a202c;
    margin-bottom: 0.5rem;
  }

  .improvement-header p {
    color: #4a5568;
    font-size: 1.1rem;
  }

  .improvement-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .improvement-chart {
    height: 200px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 12px;
    padding: 1rem;
  }

  .improvement-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    background: rgba(102, 126, 234, 0.1);
    padding: 1rem;
    border-radius: 12px;
  }

  .stat-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .stat-icon i {
    color: white;
    font-size: 1rem;
  }

  .stat-info {
    flex: 1;
  }

  .stat-value {
    font-size: 1.2rem;
    font-weight: 700;
    color: #1a202c;
  }

  .stat-label {
    font-size: 0.8rem;
    color: #4a5568;
  }

  .improvement-actions {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
  }

  @media (max-width: 768px) {
    .improvement-screen {
      padding: 1rem;
    }
    
    .improvement-header h2 {
      font-size: 1.5rem;
    }
    
    .improvement-stats {
      grid-template-columns: 1fr;
      gap: 0.5rem;
    }
    
    .improvement-chart {
      height: 150px;
    }
  }
`;
document.head.appendChild(style); 