


const notes = document.querySelector("#notes");
const generatebtn = document.querySelector(".generateBtn");
const numFlash = document.querySelector(".mySelect");
const toughselect = document.querySelector(".toughSelect");
const flashcard = document.querySelector("#flashcard");
const question = document.querySelector("#question");
const progress = document.querySelector("#progressLine");
const nextBtn = document.querySelector(".nextbtn");
const previousBtn = document.querySelector(".previousBtn");
const flipBtn = document.querySelector(".flipBtn");
const questionbox = document.querySelector("#questionbox");
const answerbox = document.querySelector("#answerbox");
const flashcardRotate = document.querySelector(".flashcardRotate");
const answer = document.querySelector(".answer")
const showans = document.querySelector(".showans");
// GLOBAL STATE: These variables must sit at the top so both event listeners can read and update them
let globalArrayResp = [];
let currentcardIndex = 0;
let currentWidth = 0;

// Capture the value when the page loads, or move inside event listener if users change it later
const activeOption = numFlash.value;

generatebtn.addEventListener("click", async () => {

  if (notes.value === "") return alert("Paste Your Notes!");
  generatebtn.textContent = "Generating...";
  generatebtn.disabled = true;
  flashcard.classList.remove("hidden");
  question.textContent = "Waiting..."
  // Reset tracking states for a fresh batch of cards
  currentWidth = 0;
  currentcardIndex = 0;
  progress.style.width = "0%";

  const noteText = notes.value;
  const activetough = toughselect.value;
  const activeOption = numFlash.value;

  const prompt = `You are an expert educational flashcard generator.
  
Create flashcards from the notes below.

Requirements:
- Generate exactly ${activeOption} flashcards.
- Difficulty level: ${activetough}.
- Questions should match the selected difficulty.
- Make questions clear and concise.
- Avoid duplicate questions.
- Cover the most important concepts.
- Mix definitions, conceptual understanding, comparisons, and application questions when appropriate.
- Keep answers brief (1–3 sentences).

Return ONLY valid JSON.

JSON format:
[
  {
    "question": "Question here",
    "answer": "Answer here"
  }
]

Do not include markdown.
Do not include explanations.
Do not include any text outside the JSON.

Notes:
${noteText}
`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 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',
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-OpenRouter-Title': 'My Testing App'
      },
      body: JSON.stringify({
        // model: 'nvidia/nemotron-3-nano-30b-a3b:free',
        model: 'inclusionai/ling-3.0-tiny:free',
        messages: [{ role: 'user', content: prompt }],
      }),
    });




    nextBtn.style.cursor = "not-allowed";
    previousBtn.style.cursor = "not-allowed";
    flipBtn.style.cursor = "not-allowed";
    nextBtn.disabled = true;
    previousBtn.disabled = true;
    flipBtn.disabled = true;


    if (!response.ok) {
      const errorPayload = await response.json().catch(() => ({}));
      const detailedMessage = errorPayload.error?.message || `Status ${response.status}`;
      throw new Error(detailedMessage);
    }

    const data = await response.json();



    if (data.choices && data.choices[0] && data.choices[0].message) {
      const resp = data.choices[0].message.content;

      // FIX: Store the results into our global variable instead of a local block variable
      globalArrayResp = JSON.parse(resp.trim());

      if (globalArrayResp.length === 0) return;

      // Load the very first question right away
      question.textContent = globalArrayResp[currentcardIndex].question;

      // Update the progress line immediately to show the initial step
      updateProgress();
      numbering();

    } else {
      throw new Error("Invalid response format received from server.");
    }

  } catch (error) {
    console.error("OpenRouter System Error:", error);
    question.textContent = `Error: ${error.message}`;
  } finally {
    generatebtn.textContent = "Generated!";
    generatebtn.disabled = false;
    nextBtn.style.cursor = "pointer";
    previousBtn.style.cursor = "pointer";
    flipBtn.style.cursor = "pointer";
    nextBtn.disabled = false;
    previousBtn.disabled = false;
    flipBtn.disabled = false;

  }
});









// FIX: Removed arguments since the function can now look directly at the global variables at the top
function updateProgress() {
  if (globalArrayResp.length === 0) return;
  if (currentWidth >= 100) return;
  const progressFraction = 1 / globalArrayResp.length;
  const finalFraction = progressFraction * 100;


  currentWidth += finalFraction;

  // FIX: Force to maximum 100% to avoid minor floating point calculation overflows
  if (currentWidth > 100) currentWidth = 100;

  progress.style.width = currentWidth + "%";

}

function goBack() {
  if (currentWidth === 0) return;
  const newprogressFraction = 1 / globalArrayResp.length;
  const newfinalFraction = newprogressFraction * 100;
  currentWidth -= newfinalFraction;
  progress.style.width = currentWidth + "%";
}

// FIX: Next Button logic to update everything step by step
nextBtn.addEventListener("click", () => {
  numbering();
  // Check if we still have questions left to display
  if (currentcardIndex < globalArrayResp.length - 1) {
    currentcardIndex++; // Increment index first
    question.textContent = globalArrayResp[currentcardIndex].question; // Display next question
    updateProgress(); // Advance progress bar
  } else {
    alert("You have reached the end of the flashcards!");
  }
});
previousBtn.addEventListener("click", () => {
  numbering();
  if (currentcardIndex > 0) {
    goBack();
    currentcardIndex--;
    question.textContent = globalArrayResp[currentcardIndex].question;
  } else {
    return alert("No previous question!")
  }
})

flipBtn.addEventListener("click", () => {
  numbering();
  //  flashcardRotate.classList.toggle("is-flipped");
  answer.classList.toggle("hidden");
  showans.classList.toggle("hidden");
  answer.textContent = globalArrayResp[currentcardIndex].answer;
  // flipBtn.textContent = "Hide Answer";
  if (answer.classList.contains("hidden")) {
    previousBtn.style.cursor = "pointer";
    nextBtn.style.cursor = "pointer";
    nextBtn.disabled = false;
    previousBtn.disabled = false;
    flipBtn.textContent = "Show Answer"
  } else {
    previousBtn.style.cursor = "not-allowed";
    nextBtn.style.cursor = "not-allowed";
    nextBtn.disabled = true;
    previousBtn.disabled = true;
    flipBtn.textContent = "Hide Answer"
  }
})


function numbering() {
  const number = document.querySelector(".currentNUM");
  const total = document.querySelector(".totalNUM");
  const currentNUM = currentcardIndex + 1;
  const totalNUM = globalArrayResp.length;
  number.textContent = currentNUM;
  total.textContent = totalNUM;
}