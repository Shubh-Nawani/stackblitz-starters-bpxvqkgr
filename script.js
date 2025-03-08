const MIN = 100;
const MAX = 999;
const pinInput = document.getElementById('pin');
const sha256HashView = document.getElementById('sha256-hash');
const resultView = document.getElementById('result');

// Store a value in localStorage
function store(key, value) {
  localStorage.setItem(key, value);
}

// Retrieve a value from localStorage
function retrieve(key) {
  return localStorage.getItem(key);
}

// Generate a random 3-digit number
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Clear localStorage
function clearStorage() {
  localStorage.clear();
}

// Generate SHA-256 hash of a given string
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Retrieve or generate the SHA-256 hash for a random 3-digit number
async function getSHA256Hash() {
  let hash = retrieve('sha256');
  let storedNumber = retrieve('randomNumber');

  if (!hash || !storedNumber) {
    const randomNum = getRandomNumber(MIN, MAX).toString();
    hash = await sha256(randomNum);
    store('randomNumber', randomNum);
    store('sha256', hash);
  }

  return hash;
}

// Display the stored SHA-256 hash
async function main() {
  sha256HashView.innerHTML = 'Calculating...';
  const hash = await getSHA256Hash();
  sha256HashView.innerHTML = hash;
}

// PIN verification function
async function test() {
  const pin = pinInput.value;

  if (pin.length !== 3) {
    resultView.innerHTML = '💡 Not 3 digits';
    resultView.classList.remove('hidden');
    return;
  }

  const storedHash = retrieve('sha256');
  const hashedPin = await sha256(pin);

  if (hashedPin === storedHash) {
    resultView.innerHTML = '🎉 Success';
    resultView.classList.add('success');
  } else {
    resultView.innerHTML = '❌ Failed';
  }
  resultView.classList.remove('hidden');
}

// Ensure only numbers are entered & limit input to 3 digits
pinInput.addEventListener('input', (e) => {
  pinInput.value = e.target.value.replace(/\D/g, '').slice(0, 3);
});

// Attach test function to button
document.getElementById('check').addEventListener('click', test);

// Run the main function
main();
