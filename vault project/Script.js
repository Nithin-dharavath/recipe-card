document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const toggleIngredients = document.getElementById('toggleIngredients');
    const ingredientsList = document.getElementById('ingredientsList');
    const toggleInstructions = document.getElementById('toggleInstructions');
    const instructionsList = document.getElementById('instructionsList');
    const startCookingBtn = document.getElementById('startCookingBtn');
    const nextStepBtn = document.getElementById('nextStepBtn');
    const progressBar = document.getElementById('progressBar');
    const prepMinutesSpan = document.getElementById('prep-minutes'); // Original prep minutes from HTML
    const currentTimerDisplay = document.getElementById('current-timer'); // New: for the live timer

    let currentStep = 0;
    const instructions = Array.from(instructionsList.children);
    const totalSteps = instructions.length;

    let timerInterval; // Variable to hold the interval for the timer
    const totalPrepTimeSeconds = parseInt(prepMinutesSpan.textContent) * 60; // Get original prep time in seconds
    let remainingTimeSeconds = totalPrepTimeSeconds;

    // --- Utility function to format time for display (MM:SS) ---
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // --- Timer Update Function ---
    function updateTimer() {
        if (remainingTimeSeconds <= 0) {
            clearInterval(timerInterval);
            currentTimerDisplay.textContent = '00:00';
            alert('Time for this recipe has elapsed!');
            // You might want to disable next button or prompt for completion here
            // nextStepBtn.disabled = true;
            return;
        }
        currentTimerDisplay.textContent = formatTime(remainingTimeSeconds);
        remainingTimeSeconds--;
    }

    // --- 1. Toggle Visibility (Ingredients & Instructions) ---
    toggleIngredients.addEventListener('click', () => {
        ingredientsList.classList.toggle('show');
        const icon = toggleIngredients.querySelector('.toggle-icon');
        icon.textContent = ingredientsList.classList.contains('show') ? '-' : '+';
    });

    toggleInstructions.addEventListener('click', () => {
        instructionsList.classList.toggle('show');
        const icon = toggleInstructions.querySelector('.toggle-icon');
        icon.textContent = instructionsList.classList.contains('show') ? '-' : '+';
    });

    // --- 2. "Start Cooking" Button Functionality ---
    startCookingBtn.addEventListener('click', () => {
        // Ensure instructions are visible
        if (!instructionsList.classList.contains('show')) {
            instructionsList.classList.add('show');
            toggleInstructions.querySelector('.toggle-icon').textContent = '-';
        }

        // Disable Start Cooking and enable Next Step
        startCookingBtn.disabled = true;
        nextStepBtn.disabled = false;

        // Reset timer and start it
        clearInterval(timerInterval); // Clear any existing timer
        remainingTimeSeconds = totalPrepTimeSeconds; // Reset time
        updateTimer(); // Display initial time
        timerInterval = setInterval(updateTimer, 1000); // Start timer, update every second

        // Reset and highlight the first step
        currentStep = 0;
        highlightStep(currentStep);
        updateProgressBar();
    });

    // --- 3. "Next Step" Button Functionality ---
    nextStepBtn.addEventListener('click', () => {
        if (currentStep < totalSteps - 1) {
            currentStep++;
            highlightStep(currentStep);
            updateProgressBar();
        } else {
            // Last step reached
            alert('Congratulations! You have completed the recipe!');
            nextStepBtn.disabled = true; // Disable next button
            startCookingBtn.disabled = false; // Allow restarting
            instructions.forEach(step => step.classList.remove('highlighted'));
            progressBar.style.width = '100%'; // Ensure it's full
            currentStep = totalSteps; // Indicate completion for the bar

            // Stop the timer when recipe is completed
            clearInterval(timerInterval);
            currentTimerDisplay.textContent = formatTime(0); // Set to 00:00
        }
    });

    // --- Helper Function: Highlight current step ---
    function highlightStep(stepIndex) {
        instructions.forEach(step => step.classList.remove('highlighted'));
        if (instructions[stepIndex]) {
            instructions[stepIndex].classList.add('highlighted');
            instructions[stepIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // --- Helper Function: Update Progress Bar ---
    function updateProgressBar() {
        if (totalSteps === 0) {
            progressBar.style.width = '0%';
            return;
        }
        const progressPercentage = (currentStep + 1) / totalSteps * 100;
        progressBar.style.width = `${progressPercentage}%`;
    }

    // Initial state setup
    nextStepBtn.disabled = true;
    updateProgressBar();
    currentTimerDisplay.textContent = formatTime(totalPrepTimeSeconds); // Display initial total time
});