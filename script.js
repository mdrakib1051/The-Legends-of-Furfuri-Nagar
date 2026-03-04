// ১. Firebase Setup (Replace with your actual Firebase Realtime Database URL)
const firebaseConfig = {
    databaseURL: "https://your-project-id.firebaseio.com/" 
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();

// ২. Device ID (Security)
const deviceId = localStorage.getItem('legend_device_id') || 'UID-' + Math.random().toString(36).substr(2, 9);
localStorage.setItem('legend_device_id', deviceId);
document.getElementById('device-id').innerText = deviceId;

// ৩. Access Authorization
function checkAccess() {
    const pass = document.getElementById('pass-input').value;
    if (pass === "20262026") {
        gsap.to("#access-portal", { opacity: 0, duration: 0.5, onComplete: () => {
            document.getElementById('access-portal').style.display = 'none';
            document.getElementById('app-content').style.display = 'block';
            initLegendsHub();
        }});
    } else {
        alert("ACCESS DENIED: INCORRECT CODE");
    }
}

// ৪. Dashboard Logic
function initLegendsHub() {
    // Listen for global data changes
    database.ref('legends').on('value', (snapshot) => {
        const data = snapshot.val();
        const list = data ? Object.entries(data) : [];
        renderDashboard(list);
    });
}

function renderDashboard(members) {
    const grid = document.getElementById('member-grid');
    document.getElementById('total-count').innerText = members.length;
    grid.innerHTML = '';

    members.forEach(([key, m]) => {
        const statusColor = m.status === 'online' ? '#00ff88' : (m.status === 'busy' ? '#ffcc00' : '#777');
        const isOwner = m.ownerId === deviceId;

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
                    ${isOwner ? `<button onclick="removeLegend('${key}')" class="delete-btn">DELETE PROFILE</button>` : ''}
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
    gsap.from(".member-card", { opacity: 0, y: 30, stagger: 0.1 });
}

// ৫. Modal & Form Logic (Fixing Initialize Card Issue)
const modal = document.getElementById("profile-modal");
document.getElementById("open-modal").onclick = () => modal.style.display = "block";
document.querySelector(".close-btn").onclick = () => modal.style.display = "none";

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
        ownerId: deviceId // Security Token
    };

    // Global Push to Firebase
    database.ref('legends').push(legendData)
        .then(() => {
            modal.style.display = "none";
            this.reset();
            submitBtn.innerText = "GENERATE CARD";
            submitBtn.disabled = false;
        })
        .catch(err => {
            alert("Database Connection Error. Check Firebase URL.");
            submitBtn.disabled = false;
        });
};

function removeLegend(key) {
    if(confirm("Are you sure you want to delete your profile?")) {
        database.ref('legends/' + key).remove();
    }
}
