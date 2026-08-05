
// export async function summarizing(textInInput, showingElements) {
//     const apikey ="AQ.Ab8RN6JSirvv7nBpaaNBX1na1y3ng2kbaKGFoahslv439MfOzg"
//  let datareceived =  await fetch(apikey, {
//       method: "POST",
//       headers: {
//         // "Authorization": "Bearer YOUR_HUGGING_FACE_TOKEN",
//         "Content-Type": "application/json"
//       },
//      body: JSON.stringify({
//     contents: [
//         {
//             parts: [
//                 {
//                     text: textInInput
//                 }
//             ]
//         }
//     ]
// })
//     })
//     .then(response => response.json())
//     .then(data => {
//       showingElements.textContent = data?.[0]?.summary_text || JSON.stringify(data);
//       return data;
//     })
//     .catch(error => {
//       console.error("Error:", error);
//       throw error;
//     });
// }


export async function summarizing(textInInput) {

    const API_KEY = "YOUR_GEMINI_API_KEY";

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

    try {

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: `Summarize the following text:\n\n${textInInput}`
                            }
                        ]
                    }
                ]
            })
        });

        const data = await response.json();

        return data.candidates[0].content.parts[0].text;

    } catch (error) {

        console.error(error.message);

        return "Failed to generate summary.";

    }

}