// ==================== PROJECT SLIDER ====================

// Get the project slider and navigation buttons
const slider = document.getElementById("projectsSlider");
const prevButton = document.getElementById("prevProject");
const nextButton = document.getElementById("nextProject");

// Track the currently displayed project
let currentProject = 0;

// Decide how many project cards to show based on screen width
function getVisibleProjects() {
  if (window.innerWidth >= 1024) return 3;
  if (window.innerWidth >= 768) return 2;
  return 1;
}

// Update the slider layout and position
function updateSlider() {
  if (!slider || !prevButton || !nextButton) return;

  const cards = Array.from(slider.children);
  if (cards.length === 0) return;

  const container = slider.parentElement;
  const containerWidth = container.clientWidth;
  const gap = parseFloat(getComputedStyle(slider).columnGap) || 0;
  const visibleProjects = getVisibleProjects();
  const isMobile = window.innerWidth < 768;

  // Find the maximum slide position
  const maxProject = Math.max(0, cards.length - visibleProjects);
  currentProject = Math.max(0, Math.min(currentProject, maxProject));

  // Calculate each card's width
  const cardWidth = isMobile
    ? Math.min(containerWidth * 0.85, 260)
    : (containerWidth - gap * (visibleProjects - 1)) / visibleProjects;

  // Apply slider layout and animation
  slider.style.display = "flex";
  slider.style.width = "max-content";
  slider.style.gap = `${gap}px`;
  slider.style.transition = "transform 0.5s ease-in-out";

  // Set a consistent width for every project card
  cards.forEach((card) => {
    card.style.flex = `0 0 ${cardWidth}px`;
    card.style.width = `${cardWidth}px`;
    card.style.minWidth = "0";
    card.style.boxSizing = "border-box";
  });

  // Calculate how far the slider should move
  let offset = currentProject * (cardWidth + gap);

  // Center the project card on mobile screens
  if (isMobile) {
    offset -= (containerWidth - cardWidth) / 2;
  }

  slider.style.transform = `translateX(-${offset}px)`;

  // Disable navigation buttons at the beginning and end
  prevButton.disabled = currentProject === 0;
  nextButton.disabled = currentProject === maxProject;

  // Update button appearance based on its state
  prevButton.classList.toggle("opacity-40", prevButton.disabled);
  nextButton.classList.toggle("opacity-40", nextButton.disabled);
  prevButton.classList.toggle("cursor-not-allowed", prevButton.disabled);
  nextButton.classList.toggle("cursor-not-allowed", nextButton.disabled);
}

// Handle project slider navigation
if (slider && prevButton && nextButton) {
  // Show the previous project
  prevButton.addEventListener("click", () => {
    if (currentProject > 0) {
      currentProject--;
      updateSlider();
    }
  });

  // Show the next project
  nextButton.addEventListener("click", () => {
    const maxProject = Math.max(
      0,
      slider.children.length - getVisibleProjects()
    );

    if (currentProject < maxProject) {
      currentProject++;
      updateSlider();
    }
  });

  // Recalculate the slider when the screen size changes
  window.addEventListener("resize", updateSlider);

  // Set the initial slider position
  updateSlider();
}


// ==================== FOOTER YEAR ====================

// Automatically display the current year in the footer
const currentYear = document.getElementById("currentYear");

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}


// ==================== DARK AND LIGHT MODE ====================

// Get the theme toggle button, icon, and HTML element
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const html = document.documentElement;

if (themeToggle && themeIcon) {
  // SVG paths for the sun and moon icons
  const sunIcon = `
    <circle cx="12" cy="12" r="4"></circle>
    <path d="M12 2v2"></path>
    <path d="M12 20v2"></path>
    <path d="m4.93 4.93 1.42 1.42"></path>
    <path d="m17.65 17.65 1.42 1.42"></path>
    <path d="M2 12h2"></path>
    <path d="M20 12h2"></path>
    <path d="m6.35 17.65-1.42 1.42"></path>
    <path d="m19.07 4.93-1.42 1.42"></path>
  `;

  const moonIcon = `
    <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.463.402.807a6.5 6.5 0 0 0 8.268 8.268c.344-.215.829-.003.803.397"></path>
  `;

  // Apply the selected theme and save it in localStorage
  function setTheme(theme) {
    const isDark = theme === "dark";

    html.classList.toggle("dark", isDark);
    html.style.colorScheme = theme;
    localStorage.setItem("theme", theme);

    // Show the opposite theme's icon
    themeIcon.innerHTML = isDark ? sunIcon : moonIcon;

    // Update accessibility text for the toggle button
    themeToggle.setAttribute(
      "aria-label",
      isDark ? "Switch to light mode" : "Switch to dark mode"
    );

    themeToggle.title = isDark ? "Switch to light mode" : "Switch to dark mode";
  }

  // Restore the previously selected theme, or use dark mode by default
  setTheme(localStorage.getItem("theme") === "light" ? "light" : "dark");

  // Switch themes when the button is clicked
  themeToggle.addEventListener("click", () => {
    setTheme(html.classList.contains("dark") ? "light" : "dark");
  });
}


// ==================== CONTACT FORM VALIDATION ====================

// Get the contact form
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  // Validate the form when the user submits it
  contactForm.addEventListener("submit", function (event) {
    // Prevent the page from refreshing
    event.preventDefault();

    // Get the values entered by the user
    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const message = document.getElementById("message");

    // Get the elements where error messages will appear
    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const messageError = document.getElementById("messageError");
    const formStatus = document.getElementById("formStatus");

    // Clear previous error and status messages
    nameError.textContent = "";
    emailError.textContent = "";
    messageError.textContent = "";
    formStatus.textContent = "";

    let isValid = true;

    // Validate the name field
    if (name.value.trim() === "") {
      nameError.textContent = "Please enter your name.";
      isValid = false;
    } else if (name.value.trim().length < 2) {
      nameError.textContent = "Name must contain at least 2 characters.";
      isValid = false;
    }

    // Validate the email field
    if (email.value.trim() === "") {
      emailError.textContent = "Please enter your email address.";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      emailError.textContent = "Please enter a valid email address.";
      isValid = false;
    }

    // Validate the message field
    if (message.value.trim() === "") {
      messageError.textContent = "Please enter your message.";
      isValid = false;
    } else if (message.value.trim().length < 10) {
      messageError.textContent = "Message must contain at least 10 characters.";
      isValid = false;
    }

    // Stop if any validation error exists
    if (!isValid) return;

    // Display a success message when all fields are valid
    formStatus.textContent = "Form validated successfully!";
    formStatus.className = "text-sm text-green-400";

    // Clear the form after successful validation
    contactForm.reset();
  });

  // Clear each field's error message when the user starts typing
  ["name", "email", "message"].forEach(function (id) {
    document.getElementById(id).addEventListener("input", function () {
      document.getElementById(id + "Error").textContent = "";
      document.getElementById("formStatus").textContent = "";
    });
  });
}