// Recipe Data
const RECIPE = {
    name: 'Classic Margherita Pizza',
    ingredients: [
        { id: '1', name: 'Pizza dough', amount: '1 ball (400g)', checked: false },
        { id: '2', name: 'San Marzano tomatoes', amount: '1 can (400g)', checked: false },
        { id: '3', name: 'Fresh mozzarella', amount: '250g', checked: false },
        { id: '4', name: 'Fresh basil leaves', amount: '1 handful', checked: false },
        { id: '5', name: 'Extra virgin olive oil', amount: '3 tbsp', checked: false },
        { id: '6', name: 'Garlic cloves', amount: '2 cloves', checked: false },
        { id: '7', name: 'Salt', amount: 'to taste', checked: false },
        { id: '8', name: 'Black pepper', amount: 'to taste', checked: false },
        { id: '9', name: 'All-purpose flour', amount: 'for dusting', checked: false },
    ],
    steps: [
        {
            id: '1',
            title: 'Prepare the dough',
            description: 'Remove pizza dough from refrigerator and let it come to room temperature. This makes it easier to stretch. Dust your work surface with flour.',
            duration: 1800, // 30 minutes
            tip: 'Room temperature dough is more elastic and easier to work with!',
        },
        {
            id: '2',
            title: 'Preheat the oven',
            description: 'Preheat your oven to the highest temperature (usually 475-500°F or 245-260°C). If you have a pizza stone, place it in the oven now.',
            duration: 900, // 15 minutes
            tip: 'A very hot oven is the secret to a crispy crust!',
        },
        {
            id: '3',
            title: 'Make the sauce',
            description: 'Crush the tomatoes by hand in a bowl. Mince the garlic and add it to the tomatoes. Add 1 tbsp olive oil, salt, and pepper. Mix well. No cooking needed!',
            duration: 300, // 5 minutes
            tip: 'Keep the sauce simple - the quality of tomatoes matters most.',
        },
        {
            id: '4',
            title: 'Stretch the dough',
            description: 'On a floured surface, gently stretch the dough into a 12-inch circle. Start from the center and work your way out. Leave a slightly thicker edge for the crust.',
            duration: 180, // 3 minutes
            tip: 'Don\'t use a rolling pin - it removes air bubbles that make the crust fluffy!',
        },
        {
            id: '5',
            title: 'Assemble the pizza',
            description: 'Transfer dough to a pizza peel or parchment paper. Spread a thin layer of sauce, leaving a 1-inch border. Tear the mozzarella and distribute evenly. Drizzle with olive oil.',
            duration: 120, // 2 minutes
            tip: 'Less is more - don\'t overload with toppings or the crust won\'t crisp!',
        },
        {
            id: '6',
            title: 'Bake the pizza',
            description: 'Carefully transfer pizza to the hot oven (on the stone if using). Bake until the crust is golden and cheese is bubbling, about 10-12 minutes.',
            duration: 660, // 11 minutes
            tip: 'Watch carefully in the last few minutes to avoid burning!',
        },
        {
            id: '7',
            title: 'Finish and serve',
            description: 'Remove pizza from oven and immediately top with fresh basil leaves. Drizzle with a bit more olive oil if desired. Let cool for 1-2 minutes, then slice and serve.',
            duration: 120, // 2 minutes
            tip: 'Add basil after baking to keep it fresh and vibrant!',
        },
    ],
};

// State
let state = {
    currentView: 'ingredients',
    ingredients: [...RECIPE.ingredients],
    currentStepIndex: 0,
    completedSteps: new Set(),
    timers: {},
};

// DOM Elements
const ingredientsTab = document.getElementById('ingredientsTab');
const cookingTab = document.getElementById('cookingTab');
const ingredientsView = document.getElementById('ingredientsView');
const cookingView = document.getElementById('cookingView');
const ingredientsList = document.getElementById('ingredientsList');
const startCookingBtn = document.getElementById('startCookingBtn');
const startBtnText = document.getElementById('startBtnText');
const ingredientsBadge = document.getElementById('ingredientsBadge');
const stepsBadge = document.getElementById('stepsBadge');
const ingredientsProgress = document.getElementById('ingredientsProgress');
const ingredientsProgressBar = document.getElementById('ingredientsProgressBar');
const stepCounter = document.getElementById('stepCounter');
const stepsProgress = document.getElementById('stepsProgress');
const stepsProgressBar = document.getElementById('stepsProgressBar');
const stepIndicators = document.getElementById('stepIndicators');
const stepCard = document.getElementById('stepCard');
const completionCard = document.getElementById('completionCard');
const newRecipeBtn = document.getElementById('newRecipeBtn');
const backToIngredientsBtn = document.getElementById('backToIngredientsBtn');

// Initialize
function init() {
    renderIngredients();
    renderStepIndicators();
    renderStep();
    updateUI();
    attachEventListeners();
}

// Render Ingredients
function renderIngredients() {
    ingredientsList.innerHTML = state.ingredients.map(ingredient => `
        <button class="ingredient-item ${ingredient.checked ? 'checked' : ''}" data-id="${ingredient.id}">
            <div class="ingredient-icon">
                ${ingredient.checked ? `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                ` : `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                    </svg>
                `}
            </div>
            <div class="ingredient-details">
                <div class="ingredient-name">${ingredient.name}</div>
                <div class="ingredient-amount">${ingredient.amount}</div>
            </div>
        </button>
    `).join('');

    // Add click listeners
    document.querySelectorAll('.ingredient-item').forEach(item => {
        item.addEventListener('click', () => {
            toggleIngredient(item.dataset.id);
        });
    });
}

// Toggle Ingredient
function toggleIngredient(id) {
    const ingredient = state.ingredients.find(i => i.id === id);
    if (ingredient) {
        ingredient.checked = !ingredient.checked;
        renderIngredients();
        updateUI();
    }
}

// Render Step Indicators
function renderStepIndicators() {
    stepIndicators.innerHTML = RECIPE.steps.map((step, index) => `
        <div class="step-indicator ${state.completedSteps.has(step.id) ? 'completed' : ''} ${index === state.currentStepIndex ? 'current' : ''}" 
             data-index="${index}" 
             title="Step ${index + 1}: ${step.title}"></div>
    `).join('');

    // Add click listeners
    document.querySelectorAll('.step-indicator').forEach(indicator => {
        indicator.addEventListener('click', () => {
            state.currentStepIndex = parseInt(indicator.dataset.index);
            renderStep();
            updateUI();
        });
    });
}

// Render Current Step
function renderStep() {
    const step = RECIPE.steps[state.currentStepIndex];
    const isCompleted = state.completedSteps.has(step.id);
    const isLastStep = state.currentStepIndex === RECIPE.steps.length - 1;
    const isFirstStep = state.currentStepIndex === 0;

    stepCard.innerHTML = `
        <div class="step-header">
            <div style="flex: 1;">
                <div class="step-number">Step ${state.currentStepIndex + 1}</div>
                <h2 class="step-title">${step.title}</h2>
            </div>
            ${isCompleted ? `
                <div class="step-completed-badge">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    <span>Completed</span>
                </div>
            ` : ''}
        </div>

        <p class="step-description">${step.description}</p>

        ${step.tip ? `
            <div class="tip-box">
                <div class="tip-content">
                    <div class="tip-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
                            <path d="M9 18h6"/>
                            <path d="M10 22h4"/>
                        </svg>
                    </div>
                    <div class="tip-text">
                        <h3>Pro Tip</h3>
                        <p>${step.tip}</p>
                    </div>
                </div>
            </div>
        ` : ''}

        ${step.duration ? `
            <div id="timer-${step.id}" class="timer" data-step-id="${step.id}" data-duration="${step.duration}">
                <div class="timer-header">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span id="timer-header-${step.id}">Timer</span>
                </div>
                <div class="timer-display">
                    <div class="timer-time" id="timer-time-${step.id}">00:00</div>
                    <div class="timer-duration">${formatDuration(step.duration)}</div>
                </div>
                <div class="timer-progress">
                    <div class="timer-progress-fill" id="timer-progress-${step.id}"></div>
                </div>
                <div class="timer-controls">
                    <button class="btn-primary" id="timer-play-${step.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="5 3 19 12 5 21 5 3"/>
                        </svg>
                        Start
                    </button>
                    <button class="btn-secondary" id="timer-reset-${step.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="1 4 1 10 7 10"/>
                            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
                        </svg>
                        Reset
                    </button>
                </div>
                <div class="timer-complete-text hidden" id="timer-complete-${step.id}">
                    Time's up! Move on when ready.
                </div>
            </div>
        ` : ''}

        <div class="step-navigation">
            <button class="btn-secondary" id="prevStepBtn" ${isFirstStep ? 'disabled' : ''}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="15 18 9 12 15 6"/>
                </svg>
                Previous
            </button>
            <button class="btn-primary" id="nextStepBtn" ${isLastStep ? 'disabled' : ''}>
                Next Step
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"/>
                </svg>
            </button>
        </div>
    `;

    // Initialize timer if exists
    if (step.duration) {
        initTimer(step.id, step.duration);
    }

    // Add navigation listeners
    const prevBtn = document.getElementById('prevStepBtn');
    const nextBtn = document.getElementById('nextStepBtn');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (state.currentStepIndex > 0) {
                state.currentStepIndex--;
                renderStep();
                updateUI();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (state.currentStepIndex < RECIPE.steps.length - 1) {
                state.completedSteps.add(step.id);
                state.currentStepIndex++;
                renderStep();
                updateUI();
            }
        });
    }
}

// Timer Functions
function initTimer(stepId, duration) {
    if (!state.timers[stepId]) {
        state.timers[stepId] = {
            duration: duration,
            remaining: duration,
            isRunning: false,
            isCompleted: false,
            interval: null,
        };
    }

    const timer = state.timers[stepId];
    updateTimerDisplay(stepId);

    const playBtn = document.getElementById(`timer-play-${stepId}`);
    const resetBtn = document.getElementById(`timer-reset-${stepId}`);

    playBtn.addEventListener('click', () => toggleTimer(stepId));
    resetBtn.addEventListener('click', () => resetTimer(stepId));
}

function toggleTimer(stepId) {
    const timer = state.timers[stepId];
    if (timer.remaining === 0) return;

    if (timer.isRunning) {
        // Pause
        clearInterval(timer.interval);
        timer.isRunning = false;
    } else {
        // Start
        timer.isRunning = true;
        timer.interval = setInterval(() => {
            timer.remaining--;
            updateTimerDisplay(stepId);

            if (timer.remaining <= 0) {
                clearInterval(timer.interval);
                timer.isRunning = false;
                timer.isCompleted = true;
                state.completedSteps.add(stepId);
                updateTimerDisplay(stepId);
                updateUI();

                // Show notification
                if ('Notification' in window && Notification.permission === 'granted') {
                    new Notification('Timer Complete!', {
                        body: `${RECIPE.steps.find(s => s.id === stepId).title} is done!`,
                    });
                }
            }
        }, 1000);
    }

    updateTimerDisplay(stepId);
}

function resetTimer(stepId) {
    const timer = state.timers[stepId];
    clearInterval(timer.interval);
    timer.remaining = timer.duration;
    timer.isRunning = false;
    timer.isCompleted = false;
    updateTimerDisplay(stepId);
}

function updateTimerDisplay(stepId) {
    const timer = state.timers[stepId];
    const timerEl = document.getElementById(`timer-${stepId}`);
    const timeEl = document.getElementById(`timer-time-${stepId}`);
    const progressEl = document.getElementById(`timer-progress-${stepId}`);
    const playBtn = document.getElementById(`timer-play-${stepId}`);
    const headerEl = document.getElementById(`timer-header-${stepId}`);
    const completeEl = document.getElementById(`timer-complete-${stepId}`);

    if (!timerEl || !timeEl || !progressEl || !playBtn) return;

    // Update time display
    timeEl.textContent = formatTime(timer.remaining);

    // Update progress
    const progress = ((timer.duration - timer.remaining) / timer.duration) * 100;
    progressEl.style.width = `${progress}%`;

    // Update classes
    timerEl.classList.toggle('running', timer.isRunning);
    timerEl.classList.toggle('completed', timer.isCompleted);

    // Update button
    if (timer.remaining === 0) {
        playBtn.disabled = true;
        playBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            Start
        `;
    } else if (timer.isRunning) {
        playBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16"/>
                <rect x="14" y="4" width="4" height="16"/>
            </svg>
            Pause
        `;
    } else {
        playBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            Start
        `;
    }

    // Update header
    if (headerEl) {
        headerEl.textContent = timer.isCompleted ? 'Timer Complete!' : 'Timer';
    }

    // Show/hide complete text
    if (completeEl) {
        completeEl.classList.toggle('hidden', !timer.isCompleted);
    }
}

// Update UI
function updateUI() {
    const checkedCount = state.ingredients.filter(i => i.checked).length;
    const allChecked = checkedCount === state.ingredients.length;

    // Update ingredients progress
    const ingredientProgress = (checkedCount / state.ingredients.length) * 100;
    ingredientsProgressBar.style.width = `${ingredientProgress}%`;
    ingredientsProgress.textContent = `${checkedCount} of ${state.ingredients.length}`;
    ingredientsBadge.textContent = `${checkedCount}/${state.ingredients.length}`;

    // Update start button
    startCookingBtn.disabled = !allChecked;
    startBtnText.textContent = allChecked ? "Let's Start Cooking!" : 'Check off all ingredients to start';

    // Update steps progress
    const stepsProgressPercent = ((state.currentStepIndex + 1) / RECIPE.steps.length) * 100;
    stepsProgressBar.style.width = `${stepsProgressPercent}%`;
    stepsProgress.textContent = `${Math.round(stepsProgressPercent)}% Complete`;
    stepCounter.textContent = `Step ${state.currentStepIndex + 1} of ${RECIPE.steps.length}`;
    stepsBadge.textContent = `${state.currentStepIndex}/${RECIPE.steps.length}`;

    // Update step indicators
    renderStepIndicators();

    // Check if all steps completed
    const allStepsCompleted = state.completedSteps.size === RECIPE.steps.length;
    completionCard.classList.toggle('hidden', !allStepsCompleted);
}

// Attach Event Listeners
function attachEventListeners() {
    // Tab switching
    ingredientsTab.addEventListener('click', () => switchView('ingredients'));
    cookingTab.addEventListener('click', () => switchView('cooking'));

    // Start cooking
    startCookingBtn.addEventListener('click', () => {
        const allChecked = state.ingredients.every(i => i.checked);
        if (!allChecked) {
            alert('Please check off all ingredients before starting!');
            return;
        }
        switchView('cooking');
    });

    // Back to ingredients
    backToIngredientsBtn.addEventListener('click', () => {
        state.currentStepIndex = 0;
        switchView('ingredients');
    });

    // New recipe
    newRecipeBtn.addEventListener('click', () => {
        state.currentStepIndex = 0;
        switchView('ingredients');
    });

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

// Switch View
function switchView(view) {
    state.currentView = view;

    if (view === 'ingredients') {
        ingredientsTab.classList.add('active');
        cookingTab.classList.remove('active');
        ingredientsView.classList.add('active');
        cookingView.classList.remove('active');
    } else {
        ingredientsTab.classList.remove('active');
        cookingTab.classList.add('active');
        ingredientsView.classList.remove('active');
        cookingView.classList.add('active');
    }

    updateUI();
}

// Utility Functions
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function formatDuration(seconds) {
    if (seconds >= 60) {
        const mins = Math.floor(seconds / 60);
        return `${mins} minute${mins !== 1 ? 's' : ''}`;
    }
    return `${seconds} seconds`;
}

// Initialize app
init();
