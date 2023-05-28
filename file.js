// Get references to the menu button and menu container
const menuBtn = document.querySelector('#menu-btn');
const menuContainer = document.querySelector('#menu-container');

// Get a reference to the close button inside the menu container
const closeBtn = menuContainer.querySelector('#close-btn');

// Add a click event listener to the menu button
menuBtn.addEventListener('click', () => {
  // Show the menu container
  menuContainer.style.display = 'block';
});

// Add a click event listener to the close button
closeBtn.addEventListener('click', () => {
  // Hide the menu container
  menuContainer.style.display = 'none';
});
