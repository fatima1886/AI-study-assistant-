

export function renderNotes(container, notes, selectedIndex) {

    container.innerHTML = "";

    notes.forEach((note, index) => {

        container.insertAdjacentHTML(
            "beforeend",
            `
            <li
                class="selectitem mt-2 cursor-pointer"
                data-index="${index}"
            >

                <div
                    class="
                    rounded-xl
                    border
                    p-3
                    transition
                    hover:bg-slate-50
                    ${
                        index === selectedIndex
                            ? "bg-indigo-50 border-indigo-300"
                            : "bg-white border-slate-200"
                    }
                    "
                >

                    <div class="flex items-center justify-between">

                        <h3
                            class="
                            truncate
                            text-sm
                            font-semibold
                            text-slate-900
                            "
                        >

                            ${note.title}

                        </h3>

                        <span
                            class="
                            text-xs
                            text-slate-400
                            "
                        >

                            📄

                        </span>

                    </div>

                    <p
                        class="
                        mt-2
                        truncate
                        text-xs
                        text-slate-500
                        "
                    >

                        ${note.body}

                    </p>

                </div>

            </li>
            `
        );

    });

}
