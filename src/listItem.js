// export function ForListItem() {
//     listItems.insertAdjacentHTML('beforeend', `
//         <li>
//           <a href="#" class="flex items-start gap-3 rounded-lg bg-indigo-50 p-3 text-left transition hover:bg-slate-50">
//             <div class="flex-shrink-0">
//               <div class="flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-indigo-600 border border-slate-200">📄</div>
//             </div>
//             <div class="min-w-0 flex-1">
//               <div class="flex items-center justify-between gap-4">
//                 <p class="title truncate text-sm font-semibold text-slate-900">${parsedData.title}</p>
//                 <p class="ml-2 text-xs text-slate-500">2h ago</p>
//               </div>
//               <p class="body mt-1 truncate text-xs text-slate-600">${parsedData.body}</p>
//             </div>
//           </a>
//         </li>
//     `);
// }

// 1. Imports must always be at the top of the file
export function ForListItem(containerElement, noteData) {
    // Prevent errors if the container element doesn't exist on the page
    if (!containerElement) return; 

    containerElement.insertAdjacentHTML('afterbegin', `
        <li class="mt-2">
          <a href="#" class="flex items-start gap-3 rounded-lg bg-indigo-50 p-3 text-left transition hover:bg-slate-50">
            <div class="flex-shrink-0">
              <div class="flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-indigo-600 border border-slate-200">📄</div>
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-center justify-between gap-4">
                <p class="title truncate text-sm font-semibold text-slate-900">${noteData.title}</p>
                <p class="ml-2 text-xs text-slate-500">Just now</p>
              </div>
              <p class="body mt-1 truncate text-xs text-slate-600">${noteData.body}</p>
            </div>
          </a>
        </li>
    `);
}
