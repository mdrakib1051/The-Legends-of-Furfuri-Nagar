// ১. Firebase Setup (তুমি তোমার Firebase Console থেকে এই কনফিগটি আপডেট করে নেবে)
const firebaseConfig = {
    databaseURL: "https://your-project-default-rtdb.firebaseio.com/" 
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// ২. Security & Device ID
const deviceId = localStorage.getItem('leg_dev_id') || 'USER-' + Math.random().toString(36).substr(2, 9);
localStorage.setItem('leg_dev_id', deviceId);
document.getElementById('device-id').innerText = deviceId;

// ৩. Access Control
function checkAccess() {
    const pass = document.getElementById('pass-input').value;
    if (pass === "20262026") {
        gsap.to("#access-portal", { opacity: 0, duration: 0.5, onComplete: () => {
            document.getElementById('access-portal').style.display = 'none';
            document.getElementById('app-content').style.display = 'block';
            initApp();
        }});
    } else {
        alert("ACCESS DENIED");
    }
}

// ৪. App Logic
function initApp() {
    // Realtime Data Fetch
    database.ref('members').on('value', (snapshot) => {
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
                        <span style="position:absolute; bottom:20px; right:10px; height:12px; width:12px; background:${statusColor}; border-radius:50%; border:2px solid #141419;"></span>
                    </div>
                    <h2 class="name">${m.name}</h2>
                    <span class="role">${m.role}</span>
                </div>
                <div class="card-back">
                    <h3 style="font-family:var(--text-en); color:var(--accent-color); font-size:0.7rem; letter-spacing:2px;">BIO DATA</h3>
                    <p class="bio">"${m.bio}"</p>
                    ${isOwner ? `<button onclick="deleteCard('${key}')" class="delete-btn">DELETE</button>` : ''}
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
    gsap.from(".member-card", { opacity: 0, y: 30, stagger: 0.1 });
}

// ৫. Modal & Form
const modal = document.getElementById("profile-modal");
document.getElementById("open-modal").onclick = () => modal.style.display = "block";
document.querySelector(".close-btn").onclick = () => modal.style.display = "none";

document.getElementById('member-form').onsubmit = (e) => {
    e.preventDefault();
    const newMember = {
        name: document.getElementById('member-name').value,
        role: document.getElementById('member-role').value,
        bio: document.getElementById('member-bio').value,
        seed: document.getElementById('avatar-seed').value,
        status: document.getElementById('member-status').value,
        owner: deviceId
    };

    database.ref('members').push(newMember).then(() => {
        modal.style.display = "none";
        e.target.reset();
    });
};

function deleteCard(key) {
    if(confirm("প্রোফাইলটি চিরতরে মুছে ফেলতে চান?")) {
        database.ref('members/' + key).remove();
    }
}
