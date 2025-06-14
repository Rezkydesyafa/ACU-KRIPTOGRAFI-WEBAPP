const historyList = document.getElementById('historyList');
const sidebar = document.getElementById('sidebar');
const infoOverlay = document.getElementById('infoOverlay');
const infoPopup = document.getElementById('infoPopup');
const chatOverlay = document.getElementById('chatOverlay');
const chatPopup = document.getElementById('chatPopup');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const logoElement = document.getElementById('logo');

const logoImages = [
  '/assets/gatotkaca.png',
  '/assets/kartunjogja.png',
  '/assets/prabu.png',
];

let sidebarVisible = false;
let infoPopupVisible = false;
let chatVisible = false;

// Chat encryption key for demo
const chatKey = 'ACU_SECURE_CHAT_2025';

// Glass Alert System
let alertOverlay = null;
let alertPopup = null;

function createGlassAlert() {
  // Create overlay
  alertOverlay = document.createElement('div');
  alertOverlay.id = 'alertOverlay';
  alertOverlay.className =
    'fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center opacity-0 transition-opacity duration-300';

  // Create popup container
  alertPopup = document.createElement('div');
  alertPopup.id = 'alertPopup';
  alertPopup.className =
    'bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 max-w-md mx-4 shadow-2xl transform scale-90 transition-all duration-300 ease-out';

  alertOverlay.appendChild(alertPopup);
  document.body.appendChild(alertOverlay);

  // Close on overlay click
  alertOverlay.addEventListener('click', (e) => {
    if (e.target === alertOverlay) {
      closeGlassAlert();
    }
  });
}

function showGlassAlert(message, type = 'info', showConfirm = false) {
  return new Promise((resolve) => {
    if (!alertOverlay) {
      createGlassAlert();
    }

    // Icon based on type
    const icons = {
      info: '💡',
      warning: '⚠️',
      error: '❌',
      success: '✅',
      question: '❓',
    };

    // Color classes based on type
    const colors = {
      info: 'text-blue-300',
      warning: 'text-yellow-300',
      error: 'text-red-300',
      success: 'text-green-300',
      question: 'text-purple-300',
    };

    const icon = icons[type] || icons.info;
    const colorClass = colors[type] || colors.info;

    alertPopup.innerHTML = `
      <div class="text-center">
        <div class="text-4xl mb-4">${icon}</div>
        <p class="text-white text-lg mb-6 leading-relaxed">${message}</p>
        <div class="flex gap-3 justify-center">
          ${
            showConfirm
              ? `
            <button id="alertCancel" class="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg text-white transition-all duration-200 hover:scale-105">
              Batal
            </button>
            <button id="alertConfirm" class="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg text-white font-medium transition-all duration-200 hover:scale-105 shadow-lg">
              Ya, Lanjutkan
            </button>
          `
              : `
            <button id="alertOk" class="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg text-white font-medium transition-all duration-200 hover:scale-105 shadow-lg ${colorClass}">
              OK
            </button>
          `
          }
        </div>
      </div>
    `;

    // Show with animation
    alertOverlay.classList.remove('opacity-0');
    alertOverlay.classList.add('opacity-100');
    alertPopup.classList.remove('scale-90');
    alertPopup.classList.add('scale-100');

    // Add pulse animation for emphasis
    alertPopup.style.animation = 'pulse-glow 0.6s ease-out';

    // Event listeners
    if (showConfirm) {
      document.getElementById('alertCancel').addEventListener('click', () => {
        closeGlassAlert();
        resolve(false);
      });
      document.getElementById('alertConfirm').addEventListener('click', () => {
        closeGlassAlert();
        resolve(true);
      });
    } else {
      document.getElementById('alertOk').addEventListener('click', () => {
        closeGlassAlert();
        resolve(true);
      });
    }

    // ESC key to close
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        closeGlassAlert();
        resolve(false);
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
  });
}

function closeGlassAlert() {
  if (alertOverlay) {
    alertOverlay.classList.remove('opacity-100');
    alertOverlay.classList.add('opacity-0');
    alertPopup.classList.remove('scale-100');
    alertPopup.classList.add('scale-90');

    setTimeout(() => {
      if (alertOverlay && alertOverlay.parentNode) {
        alertOverlay.parentNode.removeChild(alertOverlay);
        alertOverlay = null;
        alertPopup = null;
      }
    }, 300);
  }
}

// Add CSS for pulse glow animation
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse-glow {
    0% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
    }
    50% {
      transform: scale(1.02);
      box-shadow: 0 0 0 10px rgba(59, 130, 246, 0.2);
    }
    100% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
    }
  }
`;
document.head.appendChild(style);

window.addEventListener('DOMContentLoaded', () => {
  sidebar.classList.add('-translate-x-full');
});

function toggleSidebar() {
  sidebarVisible = !sidebarVisible;

  if (sidebarVisible) {
    sidebar.classList.remove('-translate-x-full');
    sidebar.classList.add('translate-x-0');
  } else {
    sidebar.classList.remove('translate-x-0');
    sidebar.classList.add('-translate-x-full');
  }
}

function toggleInfoPopup() {
  infoPopupVisible = !infoPopupVisible;

  if (infoPopupVisible) {
    infoOverlay.classList.remove('hidden');
    infoPopup.classList.add('animate-popup');
    setTimeout(() => {
      infoPopup.classList.remove('animate-popup');
    }, 500);
  } else {
    infoPopup.classList.add('animate-fade-out');
    setTimeout(() => {
      infoOverlay.classList.add('hidden');
      infoPopup.classList.remove('animate-fade-out');
    }, 200);
  }
}

function toggleLiveChat() {
  chatVisible = !chatVisible;

  if (chatVisible) {
    chatOverlay.classList.remove('hidden');
    chatPopup.classList.add('animate-chat-fade-in');
    setTimeout(() => {
      chatPopup.classList.remove('animate-chat-fade-in');
      chatInput.focus();
    }, 500);
  } else {
    chatPopup.classList.add('animate-chat-fade-out');
    setTimeout(() => {
      chatOverlay.classList.add('hidden');
      chatPopup.classList.remove('animate-chat-fade-out');
    }, 300);
  }
}

function handleChatKeypress(event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
}

function sendMessage() {
  const message = chatInput.value.trim();
  if (!message) return;

  // Encrypt the message for display
  const encryptedMessage = CryptoJS.AES.encrypt(message, chatKey).toString();

  // Add user message
  addChatMessage(message, encryptedMessage, 'user');

  // Clear input
  chatInput.value = '';

  // Simulate system response
  setTimeout(() => {
    const responses = [
      'Pesan Anda telah dienkripsi dengan aman!',
      'Data terenkripsi berhasil diterima sistem.',
      'Enkripsi AES-256 aktif untuk pesan ini.',
      'Sistem keamanan ACU melindungi komunikasi Anda.',
      'Pesan terenkripsi dan tersimpan dengan aman.',
    ];
    const randomResponse =
      responses[Math.floor(Math.random() * responses.length)];
    const encryptedResponse = CryptoJS.AES.encrypt(
      randomResponse,
      chatKey
    ).toString();
    addChatMessage(randomResponse, encryptedResponse, 'system');
  }, 1000);
}

function addChatMessage(originalMessage, encryptedMessage, type) {
  const messageDiv = document.createElement('div');
  const isUser = type === 'user';
  const time = new Date().toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

  messageDiv.className = `${
    isUser ? 'chat-bubble-user' : 'chat-bubble-system'
  } p-3 rounded-lg max-w-xs`;
  messageDiv.innerHTML = `
                <p class="text-sm">${originalMessage}</p>
                <details class="mt-2">
                    <summary class="font-sans text-xs ri-lock-fill text-gray-300 cursor-pointer hover:text-white">
                      Lihat Data Terenkripsi
                    </summary>
                    <div class="mt-1 p-2 bg-black/30 rounded text-xs font-mono break-all">
                        ${encryptedMessage}
                    </div>
                </details>
                <span class="text-xs text-gray-300 block mt-1">
                    ${isUser ? 'Anda' : 'System'} • ${time}
                </span>
            `;

  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Close popups when clicking overlay
infoOverlay.addEventListener('click', (e) => {
  if (e.target === infoOverlay) {
    toggleInfoPopup();
  }
});

chatOverlay.addEventListener('click', (e) => {
  if (e.target === chatOverlay) {
    toggleLiveChat();
  }
});

function addToHistory(type, input, output) {
  const li = document.createElement('li');
  li.className = 'bg-white/10 p-3 rounded-xl';
  li.innerHTML = `
            <strong>${type}</strong><br>
            <div class="text-xs text-gray-300">Input:</div>
            <div class="truncate w-full max-w-[240px] text-sm">${input}</div>
            <div class="text-xs text-gray-300 mt-1">Output:</div>
            <div class="truncate w-full max-w-[240px] text-sm">${output}</div>`;
  if (historyList.querySelector('li.text-gray-400')) {
    historyList.innerHTML = '';
  }
  historyList.prepend(li);
}

async function encryptText() {
  const text = document.getElementById('inputText').value.trim();
  const key = document.getElementById('key').value.trim();
  const publicKey = document.getElementById('publicKey').value.trim();
  const algorithm = document.getElementById('algorithm').value;

  if (!text || (!key && algorithm !== 'RSA')) {
    await showGlassAlert('Masukkan teks dan kunci yang valid.', 'warning');
    return;
  }

  let encrypted = '';
  try {
    switch (algorithm) {
      case 'AES':
        encrypted = CryptoJS.AES.encrypt(text, key).toString();
        break;
      case 'RC4':
        encrypted = CryptoJS.RC4.encrypt(text, key).toString();
        break;
      case 'RSA':
        if (!publicKey.startsWith('-----BEGIN PUBLIC KEY-----')) {
          await showGlassAlert(
            'Public Key RSA tidak valid. Harus diawali dengan -----BEGIN PUBLIC KEY-----',
            'error'
          );
          return;
        }
        const rsaEncrypt = new JSEncrypt();
        rsaEncrypt.setPublicKey(publicKey);
        encrypted = rsaEncrypt.encrypt(text);
        if (!encrypted) {
          await showGlassAlert(
            'Gagal mengenkripsi dengan RSA. Pastikan public key valid dan panjang teks tidak terlalu besar.',
            'error'
          );
          return;
        }
        break;
    }

    document.getElementById('outputText').value = encrypted;
    previewHash(encrypted);
    addToHistory('🔒 Enkripsi', text, encrypted);
    await showGlassAlert('Enkripsi berhasil dilakukan!', 'success');
  } catch (error) {
    await showGlassAlert(
      'Terjadi kesalahan saat enkripsi: ' + error.message,
      'error'
    );
  }
}

async function decryptText() {
  const text = document.getElementById('inputText').value.trim();
  const key = document.getElementById('key').value.trim();
  const algorithm = document.getElementById('algorithm').value;

  if (!text || !key) {
    await showGlassAlert('Masukkan teks dan kunci yang valid.', 'warning');
    return;
  }

  let decrypted = '';
  try {
    switch (algorithm) {
      case 'AES':
        const bytesAES = CryptoJS.AES.decrypt(text, key);
        decrypted = bytesAES.toString(CryptoJS.enc.Utf8);
        break;
      case 'RC4':
        const bytesRC4 = CryptoJS.RC4.decrypt(text, key);
        decrypted = bytesRC4.toString(CryptoJS.enc.Utf8);
        break;
      case 'RSA':
        if (
          !key.startsWith('-----BEGIN PRIVATE KEY-----') &&
          !key.startsWith('-----BEGIN RSA PRIVATE KEY-----')
        ) {
          await showGlassAlert('Private Key RSA tidak valid.', 'error');
          return;
        }
        const rsaDecrypt = new JSEncrypt();
        rsaDecrypt.setPrivateKey(key);
        decrypted = rsaDecrypt.decrypt(text);
        if (!decrypted) {
          await showGlassAlert(
            'Gagal mendekripsi dengan RSA. Pastikan private key valid dan teks terenkripsi benar.',
            'error'
          );
          return;
        }
        break;
    }

    if (!decrypted) {
      throw new Error('Dekripsi gagal');
    }

    document.getElementById('outputText').value = decrypted;
    previewHash(decrypted);
    addToHistory('🔓 Dekripsi', text, decrypted);
    await showGlassAlert('Dekripsi berhasil dilakukan!', 'success');
  } catch (error) {
    await showGlassAlert(
      'Gagal mendekripsi. Pastikan kunci dan teks terenkripsi benar.',
      'error'
    );
  }
}

function previewHash(text) {
  const sha256 = CryptoJS.SHA256(text).toString();
  const md5 = CryptoJS.MD5(text).toString();
  document.getElementById('sha256').textContent = sha256;
  document.getElementById('md5').textContent = md5;
}

// animasi logo
let currentIndex = 0;

setInterval(() => {
  currentIndex = (currentIndex + 1) % logoImages.length;
  logoElement.classList.remove('animate-fade');
  logoElement.offsetHeight; // trigger reflow
  logoElement.src = logoImages[currentIndex];
  logoElement.classList.add('animate-fade');
}, 2000);

function saveHistoryToLocalStorage() {
  const historyItems = [];
  const historyElements = document.querySelectorAll(
    '#historyList li:not(.text-gray-400)'
  );

  historyElements.forEach((item) => {
    const strongElement = item.querySelector('strong');
    const divElements = item.querySelectorAll('div');

    if (strongElement && divElements.length >= 4) {
      historyItems.push({
        type: strongElement.textContent,
        input: divElements[1].textContent,
        output: divElements[3].textContent,
        timestamp: new Date().toISOString(),
      });
    }
  });

  localStorage.setItem('acuAppHistory', JSON.stringify(historyItems));
}

function loadHistoryFromLocalStorage() {
  const savedHistory = localStorage.getItem('acuAppHistory');
  if (savedHistory) {
    const historyItems = JSON.parse(savedHistory);
    const historyList = document.getElementById('historyList');

    // Clear existing history
    historyList.innerHTML = '';

    historyItems.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'bg-white/10 p-3 rounded-xl';
      li.innerHTML = `
                <strong>${item.type}</strong><br>
                <div class="text-xs text-gray-300">Input:</div>
                <div class="truncate w-full max-w-[240px] text-sm">${
                  item.input
                }</div>
                <div class="text-xs text-gray-300 mt-1">Output:</div>
                <div class="truncate w-full max-w-[240px] text-sm">${
                  item.output
                }</div>
                <div class="text-xs text-gray-400 mt-1">${new Date(
                  item.timestamp
                ).toLocaleString('id-ID')}</div>
            `;
      historyList.appendChild(li);
    });

    if (historyItems.length === 0) {
      historyList.innerHTML =
        '<li class="text-gray-400 italic">Belum ada riwayat...</li>';
    }
  }
}

// Fungsi untuk menyimpan dan memuat pesan chat
function saveChatToLocalStorage() {
  const chatMessages = [];
  const messageElements = document.querySelectorAll(
    '#chatMessages > div:not(.chat-bubble-system:first-child)'
  );

  messageElements.forEach((messageDiv) => {
    const messageText = messageDiv.querySelector('p').textContent;
    const encryptedData =
      messageDiv.querySelector('details div')?.textContent || '';
    const isUser = messageDiv.classList.contains('chat-bubble-user');
    const timeSpan = messageDiv.querySelector('span');
    const timestamp = timeSpan
      ? timeSpan.textContent
      : new Date().toLocaleTimeString('id-ID');

    chatMessages.push({
      message: messageText,
      encrypted: encryptedData,
      isUser: isUser,
      timestamp: timestamp,
      fullTimestamp: new Date().toISOString(),
    });
  });

  localStorage.setItem('acuAppChatMessages', JSON.stringify(chatMessages));
}

function loadChatFromLocalStorage() {
  const savedChat = localStorage.getItem('acuAppChatMessages');
  if (savedChat) {
    const chatMessages = JSON.parse(savedChat);
    const chatMessagesContainer = document.getElementById('chatMessages');

    // Keep only the welcome message
    const welcomeMessage = chatMessagesContainer.querySelector(
      '.chat-bubble-system'
    );
    chatMessagesContainer.innerHTML = '';
    if (welcomeMessage) {
      chatMessagesContainer.appendChild(welcomeMessage);
    }

    chatMessages.forEach((msg) => {
      addSavedChatMessage(
        msg.message,
        msg.encrypted,
        msg.isUser ? 'user' : 'system',
        msg.timestamp
      );
    });
  }
}

function addSavedChatMessage(
  originalMessage,
  encryptedMessage,
  type,
  timestamp
) {
  const messageDiv = document.createElement('div');
  const isUser = type === 'user';

  messageDiv.className = `${
    isUser ? 'chat-bubble-user' : 'chat-bubble-system'
  } p-3 rounded-lg max-w-xs`;
  messageDiv.innerHTML = `
        <p class="text-sm">${originalMessage}</p>
        <details class="mt-2">
            <summary class="text-xs text-gray-300 cursor-pointer ri-lock-fill hover:text-white">
              Lihat Data Terenkripsi
            </summary>
            <div class="mt-1 p-2 bg-black/30 rounded text-xs font-mono break-all">
                ${encryptedMessage}
            </div>
        </details>
        <span class="text-xs text-gray-300 block mt-1">
            ${timestamp}
        </span>
    `;

  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Fungsi untuk menghapus semua data - Updated with glass alert
async function clearAllLocalStorage() {
  const confirmed = await showGlassAlert(
    'Apakah Anda yakin ingin menghapus semua riwayat dan pesan chat?',
    'question',
    true
  );

  if (confirmed) {
    localStorage.removeItem('acuAppHistory');
    localStorage.removeItem('acuAppChatMessages');

    // Reset UI
    const historyList = document.getElementById('historyList');
    historyList.innerHTML =
      '<li class="text-gray-400 italic">Belum ada riwayat...</li>';

    const chatMessagesContainer = document.getElementById('chatMessages');
    chatMessagesContainer.innerHTML = `
            <div class="chat-bubble-system p-3 rounded-lg max-w-xs">
                <p class="text-sm">Selamat datang di Live Chat terenkripsi ACU!</p>
                <span class="text-xs text-gray-300 block mt-1">System • sekarang</span>
            </div>
        `;

    await showGlassAlert('Semua data berhasil dihapus!', 'success');
  }
}

// Modifikasi fungsi addToHistory yang sudah ada
function addToHistory(type, input, output) {
  const li = document.createElement('li');
  li.className = 'bg-white/10 p-3 rounded-xl';
  li.innerHTML = `
        <strong>${type}</strong><br>
        <div class="text-xs text-gray-300">Input:</div>
        <div class="truncate w-full max-w-[240px] text-sm">${input}</div>
        <div class="text-xs text-gray-300 mt-1">Output:</div>
        <div class="truncate w-full max-w-[240px] text-sm">${output}</div>
        <div class="text-xs text-gray-400 mt-1">${new Date().toLocaleString(
          'id-ID'
        )}</div>
    `;

  if (historyList.querySelector('li.text-gray-400')) {
    historyList.innerHTML = '';
  }
  historyList.prepend(li);

  // Simpan ke localStorage setelah menambah riwayat
  saveHistoryToLocalStorage();
}

// Modifikasi fungsi addChatMessage yang sudah ada
function addChatMessage(originalMessage, encryptedMessage, type) {
  const messageDiv = document.createElement('div');
  const isUser = type === 'user';
  const time = new Date().toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

  messageDiv.className = `${
    isUser ? 'chat-bubble-user' : 'chat-bubble-system'
  } p-3 rounded-lg max-w-xs`;
  messageDiv.innerHTML = `
        <p class="text-sm">${originalMessage}</p>
        <details class="mt-2">
            <summary class="text-xs text-gray-300 ri-lock-fill cursor-pointer hover:text-white">
                Lihat Data Terenkripsi
            </summary>
            <div class="mt-1 p-2 bg-black/30 rounded text-xs font-mono break-all">
                ${encryptedMessage}
            </div>
        </details>
        <span class="text-xs text-gray-300 block mt-1">
            ${isUser ? 'Anda' : 'System'} • ${time}
        </span>
    `;

  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // Simpan ke localStorage setelah menambah pesan
  saveChatToLocalStorage();
}

function downloadResult() {
  const historyData = localStorage.getItem('acuAppHistory') || '[]';
  const chatData = localStorage.getItem('acuAppChatMessages') || '[]';

  const exportObj = {
    history: JSON.parse(historyData),
    chat: JSON.parse(chatData),
    exportDate: new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(exportObj, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ACU-Result_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// Event listener untuk memuat data saat halaman dimuat
window.addEventListener('DOMContentLoaded', function () {
  loadHistoryFromLocalStorage();
  loadChatFromLocalStorage();
});
