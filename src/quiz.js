



const btn = document.querySelector("#generateBtn");
const notes = document.querySelector("#notes");
const questionNo = document.querySelector("#questions");
const difficulty = document.querySelector("#difficulty");
const questionAny = document.querySelector(".question");
const option1 = document.querySelector(".option1");
const option2 = document.querySelector(".option2");
const option3 = document.querySelector(".option3");
const option4 = document.querySelector(".option4");
const nextbtn = document.querySelector("#nextbtn");
const backbtn = document.querySelector("#backbtn");
const showquiz = document.querySelector(".showquiz");
const numbering = document.querySelector(".numbering");
const submit = document.querySelector("#submit");

// Capture all radio input elements as a list
const radioInputs = document.querySelectorAll('input[type="radio"]');
let currentcount = 0;
let currentIndex = 0;
let quizData = null;

// NEW STATE TRACKER: Saves choice strings at matching indexes (e.g., [ "Option A", null, "Option C" ])
let userAnswers = [];

btn.addEventListener("click", async () => {
    btn.textContent = "Thinking...";
    btn.disabled = true;
    currentcount++;
    numbering.textContent = currentcount;

    const noteValue = notes.value;
    const selecedQ = questionNo.value;
    const selectedD = difficulty.value;

    const prompt = `Create a quiz based on the study content provided below. 

Study Content: ${noteValue} 

Quiz Settings: 
- Number of questions: ${selecedQ} 
- Difficulty: ${selectedD} 

Instructions: 
1. Generate exactly ${selecedQ} multiple-choice questions. 
2. The questions must be based ONLY on the provided study content. 
3. Match the selected difficulty level: ${selectedD}. 
4. Each question must have exactly 4 answer options. 
5. Only ONE option must be correct. 
6. Make the incorrect options plausible but clearly incorrect based on the content. 
7. Do not repeat questions. 
8. Cover different important concepts from the study content. 
9. Do not include explanations unless requested. 
10. Return the result ONLY as valid JSON. 
11. Follow this exact JSON structure: 
{ 
  "questions": [ 
    { 
      "question": "Question text", 
      "options": [ "Option A", "Option B", "Option C", "Option D" ], 
      "correctAnswer": "Option A" 
    } 
  ] 
}`;



    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': window.location.origin,
                'X-OpenRouter-Title': 'My Testing App'
            },
            body: JSON.stringify({
                model: 'nvidia/nemotron-3-nano-30b-a3b:free',
                messages: [
                    { role: 'user', content: prompt },
                ],
            }),
        });

        if (!response.ok) {
            const errorPayload = await response.json().catch(() => ({}));
            const detailedMessage = errorPayload.error?.message || `Status ${response.status}`;
            throw new Error(detailedMessage);
        }

        btn.textContent = "Generating...";
        const data = await response.json();

        if (data.choices && data.choices[0] && data.choices[0].message) {
            const resp = data.choices[0].message.content;
            btn.textContent = "Done!";

            // Reset core application engines
            currentIndex = 0;
            quizData = JSON.parse(resp);
            userAnswers = new Array(quizData.questions.length).fill(null);

            // Ensure layout templates are visible if unhidden from previous runs
            toggleQuizElementsDisplay("flex");
            nextbtn.disabled = false;

            placingElements();
            showquiz.classList.remove("hidden");
        } else {
            throw new Error("Invalid response format received from server.");
        }
    } catch (error) {
        console.error("OpenRouter System Error:", error);
        btn.textContent = `Error: ${error.message}`;
    } finally {
        btn.disabled = false;
    }
});

function placingElements() {
    if (!quizData || !quizData.questions || quizData.questions.length === 0) return;

    // Control structural view parameters for navigation buttons
    backbtn.disabled = (currentIndex === 0);

    // Reset layout attributes completely on every question load step
    resetSelectionStates();

    // Render active question string components
    const currentQuestionData = quizData.questions[currentIndex];
    questionAny.textContent = currentQuestionData.question;
    option1.textContent = currentQuestionData.options[0];
    option2.textContent = currentQuestionData.options[1];
    option3.textContent = currentQuestionData.options[2];
    option4.textContent = currentQuestionData.options[3];

    // RESTORE STATE: If user already answered this before, recheck it and lock choices
    const savedAnswer = userAnswers[currentIndex];
    if (savedAnswer !== null) {
        radioInputs.forEach(radio => {
            if (radio.nextElementSibling.textContent === savedAnswer) {
                radio.checked = true;
            }
        });
        lockSelectionOptions();
    }
}

// ATTACH REAL-TIME CLICK EVENT ACTION LISTENERS TO THE RADIO BUTTONS
radioInputs.forEach(radio => {
    radio.addEventListener("change", (e) => {
        if (!quizData) return;

        // Save the chosen selection string safely in state array
        userAnswers[currentIndex] = e.target.nextElementSibling.textContent;

        // Lock options down instantly
        lockSelectionOptions();
    });
});

function lockSelectionOptions() {
    radioInputs.forEach(radio => {
        // Disable input click actions
        radio.disabled = true;

        // Target parent label card container
        const parentLabel = radio.closest('label');
        if (parentLabel) {
            // Apply cursor restrictions via utility configurations
            parentLabel.style.cursor = "not-allowed";
            parentLabel.classList.add("opacity-60");
        }
    });
}

function resetSelectionStates() {
    radioInputs.forEach(radio => {
        radio.checked = false;
        radio.disabled = false;

        const parentLabel = radio.closest('label');
        if (parentLabel) {
            parentLabel.style.cursor = "pointer";
            parentLabel.classList.remove("opacity-60");
        }
    });
}

function calculateFinalScore() {
    let finalScore = 0;
    quizData.questions.forEach((question, index) => {
        if (userAnswers[index] === question.correctAnswer) {
            finalScore++;
        }
    });
    return finalScore;
}

function toggleQuizElementsDisplay(displayValue) {
    option1.closest('label').style.display = displayValue;
    option2.closest('label').style.display = displayValue;
    option3.closest('label').style.display = displayValue;
    option4.closest('label').style.display = displayValue;
}

// nextbtn.addEventListener("click", () => {
//     if (!quizData) return;

//     currentIndex++;

//     if (currentIndex < quizData.questions.length) {
//         placingElements();
//     } else {
//         const totalScore = calculateFinalScore();
//         questionAny.textContent = `Quiz Finished! Your total score is: ${totalScore} / ${quizData.questions.length}`;

//         toggleQuizElementsDisplay("none");
//         nextbtn.disabled = true;
//         backbtn.disabled = true;
//     }
// });

nextbtn.addEventListener("click", () => {
    if (!quizData) return;
    // FIX: Check if the user has selected an answer for the current question
    if (userAnswers[currentIndex] === null) {
        alert("Please select an option before moving to the next question!");
        return; // Stop the execution here
    }

    currentIndex++;
    currentcount++;
    numbering.textContent = currentcount;

    if (currentIndex < quizData.questions.length) {
        placingElements();
    } else {
        nextbtn.disabled = true;
        backbtn.disabled = true;
        nextbtn.style.cursor = "not-allowed";
        backbtn.style.cursor = "not-allowed";
    }
});


backbtn.addEventListener("click", () => {
    if (!quizData || currentIndex === 0) return;
    currentIndex--;
    placingElements();
    currentcount--;
    numbering.textContent = currentcount;
});


submit.addEventListener("click", () => {
    const totalScore = calculateFinalScore();
    questionAny.textContent = `Quiz Finished! Your total score is: ${totalScore} / ${quizData.questions.length}`;

    toggleQuizElementsDisplay("none");
    nextbtn.disabled = true;
    backbtn.disabled = true;
})

