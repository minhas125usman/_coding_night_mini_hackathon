let users = [];  
let currentUser = null;

const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

const signupCard = document.getElementById('signup-card');
const loginCard = document.getElementById('login-card');
const goLogin = document.getElementById('go-login');
const goSignup = document.getElementById('go-signup');
const signupBtn = document.getElementById('signup-btn');
const loginBtn = document.getElementById('login-btn');
const authSection = document.getElementById('auth-section');
const welcomeUser = document.getElementById('welcome-user');
const logoutBtn = document.getElementById('logout-btn');

const postBtn = document.getElementById('post-btn');
const postText = document.getElementById('post-text');
const postImage = document.getElementById('post-image');
const postsFeed = document.getElementById('posts-feed');
const searchInput = document.getElementById('search-posts');
const sortSelect = document.getElementById('sort-posts');
const currentUserImg = document.getElementById('current-user-img');

let posts = [];

// Theme Toggle
themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    themeToggle.textContent = body.classList.contains('dark-mode') ? '☀️' : '🌙';
});

// Switch Auth
goLogin.addEventListener('click', () => {
    signupCard.style.display = 'none';
    loginCard.style.display = 'block';
});

goSignup.addEventListener('click', () => {
    loginCard.style.display = 'none';
    signupCard.style.display = 'block';
});

// Update Header UI
function updateUserUI() {
    welcomeUser.textContent = `👋 ${currentUser.name}`;
    currentUserImg.src = currentUser.image;
}

// Signup
signupBtn.addEventListener('click', () => {
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value.trim();
    const image = document.getElementById('signup-image').value.trim() || "assessts/default.jpg";

    if(!name || !email || !password){
        return alert("✋ Please fill all fields!");
    }

    if(users.some(user => user.email === email)){
        return alert("⚠️ Email already exists!");
    }

    const newUser = { name, email, password, image };
    users.push(newUser);
    currentUser = newUser;

    updateUserUI();
    authSection.style.display = 'none';
});

// Login
loginBtn.addEventListener('click', () => {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    const user = users.find(u => u.email === email && u.password === password);

    if(!user) return alert("❌ Invalid email or password!");

    currentUser = user;
    updateUserUI();
    authSection.style.display = 'none';
});

// Logout
logoutBtn.addEventListener('click', () => {
    currentUser = null;
    welcomeUser.textContent = "👋 Guest";
    currentUserImg.src = "assessts/default.jpg";
    authSection.style.display = 'flex';
});

// Create Post
postBtn.addEventListener('click', () => {
    const text = postText.value.trim();
    const image = postImage.value.trim();

    if(!text && !image) return alert("⚠️ Post cannot be empty!");

    posts.unshift({
        id: Date.now(),
        user: currentUser,
        text,
        image,
        likes: 0,
        date: new Date()
    });

    postText.value = "";
    postImage.value = "";
    renderPosts();
});

// Render Posts
function renderPosts(data){
    const postList = data || posts;
    postsFeed.innerHTML = "";

    postList.forEach(post => {
        const postEl = document.createElement('div');
        postEl.classList.add('post');

        postEl.innerHTML = `
            <div class="post-header">
                <img src="${post.user.image}" class="profile-pic">
                <strong>${post.user.name}</strong>
                <small>${post.date.toLocaleString()}</small>
            </div>

            <p>${post.text}</p>

            ${post.image ? `<img src="${post.image}">` : ""}

            <div class="actions">
                <button onclick="toggleLike(${post.id})">❤️ ${post.likes}</button>
                <button onclick="deletePost(${post.id})">🗑️ Delete</button>
            </div>
        `;

        postsFeed.appendChild(postEl);
    });
}

// Like / Unlike
function toggleLike(id){
    posts = posts.map(post => {
        if(post.id === id){
            post.likes = post.likes ? 0 : 1;
        }
        return post;
    });
    renderPosts();
}

// Delete
function deletePost(id){
    if(confirm("❌ Delete this post?")){
        posts = posts.filter(post => post.id !== id);
        renderPosts();
    }
}

// Search
searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase();
    renderPosts(posts.filter(p => p.text.toLowerCase().includes(q)));
});

// Sort
sortSelect.addEventListener('change', () => {
    if(sortSelect.value === "latest") posts.sort((a,b)=>b.id-a.id);
    if(sortSelect.value === "oldest") posts.sort((a,b)=>a.id-b.id);
    if(sortSelect.value === "most-liked") posts.sort((a,b)=>b.likes-a.likes);
    renderPosts();
});
