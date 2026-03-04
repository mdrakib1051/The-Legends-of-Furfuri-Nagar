// ১. Firebase Setup (Your Verified URL)
const firebaseConfig = {
    databaseURL: "https://legends-hub-defb6-default-rtdb.firebaseio.com/" 
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();

// ২. Device Security ID
const deviceId = localStorage.getItem('leg_dev_id') || 'UID-' + Math.random().toString(36).substr(2, 9);
localStorage.setItem('leg_dev_id', deviceId);
document.getElementById('device-id').innerText = deviceId;

// ৩. Access Authorization
function checkAccess() {
    const pass = document.getElementById('pass-input').value;
    if (pass === "20262026") {
        gsap.to("#access-portal", { opacity: 0, duration: 0.5, onComplete: () => {
            document.getElementById('access-portal').style.display = 'none';
            document.getElementById('app-content').style.display = 'block';
            startApp();
        }});
    } else {
        alert("ACCESS DENIED!");
    }
}

// ৪. Realtime Logic
function startApp() {
    database.ref('legends').on('value', (snapshot) => {
        const data = snapshot.val();
        const list = data ? Object.entries(data) : [];
        renderCards(list);
    });
}

function renderCards(members) {
    const grid = document.getElementById('member-grid');
    document.getElementById('total-count').innerText = members.length;
    grid.innerHTML = '';

    members.forEach(([key, m]) => {
        const statusColor = m.status === 'online' ? '#00ff88' : (m.status === 'busy' ? '#ffcc00' : '#777');
        const isOwner = m.owner === deviceId;

        const card = document.createElement('div');
        card.className = 'member-card';
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <div style="position:relative">
                        <img src="https://api.dicebear.com/8.x/avataaars/svg?seed=${m.seed}" class="avatar">
                        <span style="position:absolute; bottom:18px; right:10px; height:12px; width:12px; background:${statusColor}; border-radius:50%; border:2px solid #141419;"></span>
                    </div>
                    <h2 class="name">${m.name}</h2>
                    <span class="role">${m.role}</span>
                </div>
                <div class="card-back">
                    <h3 style="font-family:var(--text-en); color:var(--accent-color); font-size:0.7rem; letter-spacing:2px;">BIO DATA</h3>
                    <p class="bio">"${m.bio}"</p>
                    ${isOwner ? `<button onclick="deleteCard('${key}')" class="delete-btn">DELETE PROFILE</button>` : ''}
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
    gsap.from(".member-card", { opacity: 0, y: 30, stagger: 0.1 });
}

// ৫. Generate Card Function
document.getElementById('member-form').onsubmit = function(e) {
    e.preventDefault();
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.innerText = "INITIALIZING...";
    submitBtn.disabled = true;

    const legendData = {
        name: document.getElementById('member-name').value,
        role: document.getElementById('member-role').value,
        bio: document.getElementById('member-bio').value,
        seed: document.getElementById('avatar-seed').value,
        status: document.getElementById('member-status').value,
        owner: deviceId 
    };

    database.ref('legends').push(legendData)
        .then(() => {
            modal.style.display = "none";
            this.reset();
            submitBtn.innerText = "GENERATE CARD";
            submitBtn.disabled = false;
        })
        .catch(err => {
            alert("Database Connection Error. Please check Rules in Firebase.");
            submitBtn.innerText = "GENERATE CARD";
            submitBtn.disabled = false;
        });
};

// Modal Controls
const modal = document.getElementById("profile-modal");
document.getElementById("open-modal").onclick = () => modal.style.display = "block";
document.querySelector(".close-btn").onclick = () => modal.style.display = "none";

function deleteCard(key) {
    if(confirm("প্রোফাইলটি ডিলিট করতে চান?")) {
        database.ref('legends/' + key).remove();
    }
}
