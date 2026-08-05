// import { summarizing } from "./summary.api.js";
// import { marked } from 'https://jsdelivr.net';
// import { marked } from 'https://unpkg.com';


const character = document.querySelector("#characterCount");
const summaryInput = document.querySelector("#notesInput");
const word = document.querySelector("#wordCount");
const time = document.querySelector("#readingTime");
const generateBtn = document.querySelector("#generateBtn");
const hidingElements = document.querySelector("#emptyState");
const showingElements = document.querySelector("#summaryContent");




summaryInput.addEventListener("input", (event) => {
    let characterInput = event.target.value;
    let numberOfCharacter = characterInput.replace(/\s/g, "").length;
    character.textContent = `${numberOfCharacter}`;
    let numberOfWords = characterInput.split(/\s/g).length;
    word.textContent = `${numberOfWords}`;
    const wordPerMint = 225;
    let totalTime = Math.ceil(numberOfWords / wordPerMint);
    time.textContent = `${totalTime}` + " min";
})



// Run when page loads



generateBtn.addEventListener("click", async () => {
    const textInInput = summaryInput.value;
    if (textInInput === "") {
        alert("Please enter some text before generating a summary.");
        return;
    }
    hidingElements.classList.add("hidden");
    showingElements.classList.remove("hidden");
    showingElements.textContent = "Generating summary... please wait..."
    //  fetch AI API

    generateBtn.disabled = true;

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer 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',
                'Content-Type': 'application/json',
                // Mandatory for browser tracking attribution
                'HTTP-Referer': window.location.origin,
                'X-OpenRouter-Title': 'My Testing App'
            },
            body: JSON.stringify({
                // Using a completely free model ensures zero-balance accounts don't throw a 402 error
                model: 'nvidia/nemotron-3-nano-30b-a3b:free',
                messages: [
                    {
                        role: 'user',
                        content: `
You are an expert study assistant.

Summarize the following notes.

Requirements:

- Compress long notes into about 40% of their original length.
- Use headings.
- Use bullet points.
- Highlight important keywords using **bold** Markdown.
- Use simple language.
- Do not add extra information.
- Return valid Markdown.

Notes:

${textInInput}
`,
                    },
                ],
            }),
        });

        // Capture precise network issues instantly
        if (!response.ok) {
            const errorPayload = await response.json().catch(() => ({}));
            const detailedMessage = errorPayload.error?.message || `Status ${response.status}`;
            throw new Error(detailedMessage);
        }

        const data = await response.json();

        // CRITICAL PATH FIX: Ensure choices array index 0 is called explicitly
        if (data.choices && data.choices[0] && data.choices[0].message) {
            const resp = data.choices[0].message.content;
            // showingElements.innerText = resp;
            showingElements.innerHTML = marked.parse(resp);
            // const aiText =resp;
            // const rawHtml = marked.parse(aiText);
            //  const cleanHtml = DOMPurify.sanitize(rawHtml);
            //   showingElements.innerHTML = cleanHtml;
        } else {
            throw new Error("Invalid response format received from server.");
        }

    } catch (error) {
        console.error("OpenRouter System Error:", error);
        // This displays the exact error message text right on the button to help you see what failed
        showingElements.innerText = `Error: ${error.message}`;
    } finally {
        generateBtn.disabled = false;
    }
});

//    const summarizedtextContent = await summarizing(textInInput);
// showingElements.innerText = `${summarizedtextContent}`;
