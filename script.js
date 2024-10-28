const mockDatabase = {
    posts: [],
    addPost: (post) => {
        mockDatabase.posts.unshift(post);
    }
};

const sustainableActions = [
    'Using a reusable water bottle',
    'Carrying a cloth shopping bag',
    'Biking instead of driving',
    'Turning off lights when leaving a room',
    'Using a reusable coffee cup',
    'Composting food scraps',
];

let stream = null;
let timeLeft = 15;
let timerInterval = null;

function showHomePage() {
    document.getElementById('homePage').style.display = 'block';
    document.getElementById('postPage').style.display = 'none';
    renderPosts();
}

function showPostPage() {
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('postPage').style.display = 'block';
    startCamera();
}

function renderPosts() {
    const postsContainer = document.getElementById('postsContainer');
    postsContainer.innerHTML = '';
    mockDatabase.posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'card';
        postElement.innerHTML = `
            <div class="card-header">
                <h3 class="card-title">${post.username}</h3>
            </div>
            <div class="card-content">
                <p>${post.prompt}</p>
                <img src="${post.image}" alt="Sustainable action">
            </div>
        `;
        postsContainer.appendChild(postElement);
    });
}

function startCamera() {
    const video = document.getElementById('video');
    const prompt = document.getElementById('prompt');
    prompt.textContent = `Prompt: ${sustainableActions[Math.floor(Math.random() * sustainableActions.length)]}`;

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(mediaStream => {
            stream = mediaStream;
            video.srcObject = stream;
            startTimer();
        })
        .catch(err => {
            console.error("Error accessing camera:", err);
            showAlert('Failed to access camera. Please ensure youve granted the necessary permissions.', 'error');
        });
}

function startTimer() {
    timeLeft = 15;
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft === 0) {
            clearInterval(timerInterval);
        }
    }, 1000);
}

function updateTimerDisplay() {
    document.getElementById('timer').textContent = `${timeLeft}s`;
}

function handleCapture() {
    if (timeLeft === 0) return;

    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const prompt = document.getElementById('prompt').textContent.replace('Prompt: ', '');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const image = canvas.toDataURL('image/jpeg');

    const newPost = {
        prompt,
        image,
        username: 'User',
        timestamp: new Date().toISOString()
    };

    mockDatabase.addPost(newPost);
    showHomePage();
    showAlert('Post added successfully!', 'success');
}

function handleCancel() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    clearInterval(timerInterval);
    showHomePage();
}

function showAlert(message, type) {
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${type}`;
    alertElement.textContent = message;
    document.body.insertBefore(alertElement, document.body.firstChild);
    setTimeout(() => alertElement.remove(), 3000);
}

// Initialize the app
showHomePage();