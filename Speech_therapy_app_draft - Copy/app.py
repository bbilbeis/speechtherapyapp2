from flask import Flask, render_template, request, redirect, url_for, session

app = Flask(__name__)
app.secret_key = 'secret_key'

# ── Your full exercise catalog, now with images ──
all_exercises = [
    {'id':'ex1','name':'Repeat "pa-ta-ka"','image_url':'https://via.placeholder.com/100?text=Pa-ta-ka'},
    {'id':'ex2','name':'Tongue Twister','image_url':'https://via.placeholder.com/100?text=Twister'},
    {'id':'ex3','name':'Sustain "ah"','image_url':'https://via.placeholder.com/100?text="ah"'},
    {'id':'ex4','name':'Lip Trills','image_url':'https://via.placeholder.com/100?text=Lip+Trills'},
    {'id':'ex5','name':'Vowel Stretch','image_url':'https://via.placeholder.com/100?text=Vowel'},
    {'id':'ex6','name':'Consonant Practice','image_url':'https://via.placeholder.com/100?text=Consonant'},
    {'id':'ex7','name':'Breathing Exercise','image_url':'https://via.placeholder.com/100?text=Breathing'},
    {'id':'ex8','name':'Reading Aloud','image_url':'https://via.placeholder.com/100?text=Reading'}
]

# ── Speech-metric sections for the dashboard ──
metrics = [
    'Pitch (F0)',
    'Jitter/Shimmer',
    'Loudness',
    'Speaking Rate / Pauses'
]

@app.route('/')
def onboarding():
    return render_template('index.html')

# ── Main exercise flow (onboarding) ──
@app.route('/session')
def session_flow():
    # if user has chosen a custom set, use that; otherwise default to first 3
    chosen = session.get('selected')
    if chosen:
        exercises = [ex for ex in all_exercises if ex['id'] in chosen]
    else:
        exercises = all_exercises[:3]

    # reset or initialize performance placeholders
    session['performance'] = [0] * len(exercises)
    return render_template('session.html', exercises=exercises)

# ── Exercise session (from dashboard) ──
@app.route('/exercise-session')
def exercise_session():
    # Get user's selected exercises
    selected_ids = session.get('selected', [])
    selected_exercises = [ex for ex in all_exercises if ex['id'] in selected_ids]
    
    # If user has selected exercises, use them; otherwise use first 3
    if selected_exercises:
        exercises = selected_exercises[:3]  # Take first 3 selected exercises
    else:
        exercises = all_exercises[:3]
    
    # Add one new exercise that user hasn't selected
    unselected_exercises = [ex for ex in all_exercises if ex['id'] not in selected_ids]
    if unselected_exercises:
        exercises.append(unselected_exercises[0])  # Add first unselected exercise
    
    # If we don't have 4 exercises, add more from all_exercises
    while len(exercises) < 4:
        for ex in all_exercises:
            if ex not in exercises:
                exercises.append(ex)
                break
    
    # Track session completion
    if 'session_history' not in session:
        session['session_history'] = []
    
    return render_template('exercise_session.html', exercises=exercises)

# ── Complete exercise session ──
@app.route('/complete-session', methods=['POST'])
def complete_session():
    # Add session to history
    if 'session_history' not in session:
        session['session_history'] = []
    
    session['session_history'].append({
        'date': '2024-01-15',  # This would be dynamic in real app
        'exercises_completed': 4,
        'improvement': 15,
        'session_time': 8
    })
    
    # Check if this is first time user
    is_first_time = len(session['session_history']) == 1
    
    if is_first_time:
        return redirect(url_for('goal_selection'))
    else:
        return redirect(url_for('home'))

# ── Goal selection for first-time users ──
@app.route('/goal-selection', methods=['GET', 'POST'])
def goal_selection():
    if request.method == 'POST':
        selected_goal = request.form.get('goal')
        session['user_goal'] = selected_goal
        return redirect(url_for('home'))
    
    return render_template('goal_selection.html')

# ── Initial signup flow ──
@app.route('/choose', methods=['GET','POST'])
def choose_exercises():
    if request.method=='POST':
        session['selected'] = request.form.getlist('exercises')
        return redirect(url_for('schedule'))
    return render_template('choose_exercises.html', exercises=all_exercises)

# ── Modify existing selection ──
@app.route('/modify', methods=['GET','POST'])
def modify_exercises():
    if request.method=='POST':
        session['selected'] = request.form.getlist('exercises')
        return redirect(url_for('home'))
    return render_template(
        'modify_exercises.html',
        exercises=all_exercises,
        selected=session.get('selected', [])
    )

# ── Schedule picker ──
@app.route('/schedule', methods=['GET','POST'])
def schedule():
    times = ['Morning','Afternoon','Evening','Flexible']
    if request.method=='POST':
        session['schedule'] = request.form.get('time')
        return redirect(url_for('home'))
    return render_template('schedule.html', times=times)

# ── Dashboard ──
@app.route('/home')
def home():
    # map selected IDs → names
    selected_ids   = session.get('selected', [])
    selected_names = [ex['name'] for ex in all_exercises if ex['id'] in selected_ids]

    # Get session history
    session_history = session.get('session_history', [])
    
    # overall performance (placeholder)
    overall = session.get('performance', [])
    
    # If user has history, show improvement; otherwise show 0
    if session_history:
        latest_improvement = session_history[-1]['improvement']
        overall = [latest_improvement]  # For now, just show latest
    else:
        overall = [0]

    # prepare per-metric histories (simple placeholders)
    sessions_list = ['Session 1','Session 2','Session 3']
    sections = []
    for metric in metrics:
        # simple ramp example
        history = [20, 50, 80]  
        sections.append({'section': metric, 'labels': sessions_list, 'data': history})

    # leaderboard example
    leaderboard = {
        'You': overall[-1] if overall else 0,
        'Average User': 75,
        'Top Performer': 98
    }

    return render_template(
      'home.html',
      labels=[f"#{i+1}" for i in range(len(overall))],
      data=overall,
      sections=sections,
      leaderboard=leaderboard,
      selected=selected_names,
      schedule=session.get('schedule','Not set'),
      session_history=session_history,
      user_goal=session.get('user_goal', 'Not set')
    )

if __name__=='__main__':
    app.run(debug=True)
