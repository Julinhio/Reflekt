
// Step 1: Select and Prepare DOM Elements
const titleInput = document.getElementById('entry-title');
const contentInput = document.getElementById('entry-content');
const saveButton = document.getElementById('save-entry');
const entriesContainer = document.getElementById('entry-container');

let editingEntry = null; // To track the entry being edited

// Step 2: Event Listener for Saving Entries
saveButton.addEventListener('click', function(event) {
    event.preventDefault(); // Prevents form from refreshing the page
    const title = titleInput.value.trim(); // Get and trim title input
    const content = contentInput.value.trim(); // Get and trim content input
    
    // Check if both fields have content
    if (title && content) {
        if (editingEntry) {
            // Update the existing entry
            const entries = JSON.parse(localStorage.getItem('entries')) || [];

            // Find the index of the entry to edit
            const index = entries.findIndex(e => e.title === editingEntry.title && e.content === editingEntry.content);

            if (index > -1) {
                // Update the entry at this index
                entries[index] = { title, content };
                localStorage.setItem('entries', JSON.stringify(entries));
            }

            editingEntry = null; // Reset the editingEntry variable
        } else {
            // Create a new entry
            const entry = { title, content };
            saveEntryToLocalStorage(entry);
        }

        loadEntries(); // Refresh the display with updated entries

        titleInput.value = '';
        contentInput.value = ''; // Clear both input fields

    // Otherwise, displays alert to fill both fields 
    } else {
        alert('Please fill out both the title and content fields.');
    }
});

// Function to save an entry to local storage
function saveEntryToLocalStorage(entry) {
    let entries = JSON.parse(localStorage.getItem('entries')) || []; // Get existing entries or initialize empty array
    entries.push(entry); // Add the new entry to the entries array
    localStorage.setItem('entries', JSON.stringify(entries)); // Save updated array to local storage
}

// Function to display a single entry in the entries container
function displayEntry(entry) {
    const entryElement = document.createElement('div');
    entryElement.classList.add('entry');

    // Create HTML structure for the entry with delete button
    entryElement.innerHTML = `
        <h3>${entry.title}</h3>
        <p>${entry.content}</p>
        <button class="edit-entry">Edit</button>
        <button class="delete-entry">Delete</button>
    `;

    // Append the entry element to the entries container
    entriesContainer.appendChild(entryElement);

    // Add event listener to delete button
    const deleteButton = entryElement.querySelector('.delete-entry');
    deleteButton.addEventListener('click', function() {
        deleteEntry(entry);
    });

    // Add event listener to edit button
    const editButton = entryElement.querySelector('.edit-entry');
    editButton.addEventListener('click', function() {
        editEntry(entry);
    });
}

function deleteEntry(entryToDelete) {
    // Get current entries from localStorage
    let entries = JSON.parse(localStorage.getItem('entries')) || [];

    // Filter out the entry to be deleted
    entries = entries.filter(entry => entry.title !== entryToDelete.title || entry.content !== entryToDelete.content);

    // Update localStorage with remaining entries
    localStorage.setItem('entries', JSON.stringify(entries));

    // Reload entries to refresh the display
    loadEntries();
}


function editEntry(entry) {
    // Set the form fields with the entry's current title and content
    titleInput.value = entry.title;
    contentInput.value = entry.content;

    // Set the editingEntry variable to the entry being edited
    editingEntry = entry;
}


// Function to load all entries from local storage and display them
function loadEntries() {
    const entries = JSON.parse(localStorage.getItem('entries')) || [];
    entriesContainer.innerHTML = ''; // Clear current entries container

    const noEntriesMessage = document.getElementById('no-entries'); // Get the no-entries element
    
    if (entries.length === 0) {
        if (noEntriesMessage) noEntriesMessage.style.display = 'block'; // Show no entries message if exists
    } else {
        if (noEntriesMessage) noEntriesMessage.style.display = 'none'; // Hide no entries message if exists
        entries.forEach(displayEntry); // Display each entry
    }
}



// Load entries when the page loads
window.addEventListener('load', loadEntries);
