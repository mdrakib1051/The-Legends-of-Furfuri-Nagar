// ১. পাসওয়ার্ড প্রোটেকশন
const accessPass = prompt("এন্টার এক্সেস কোড:");
if (accessPass === "20262026") {
    document.getElementById("main-body").style.display = "block";
} else {
    alert("ভুল পাসওয়ার্ড! এক্সেস ডিনাইড।");
    window.location.reload();
}

// ২. Firebase কনফিগারেশন (ডেমো - তুমি পরে নিজেরটা বসাতে পারো)
const firebaseConfig = {
    databaseURL: "https://YOUR-PROJECT-ID.firebaseio.com" // এখানে তোমার ডাটাবেস ইউআরএল বসবে
};
// নিচের অংশে Firebase সেটআপ না করা থাকলে এটা LocalStorage এ চলবে, 
// কিন্তু Firebase কানেক্ট করলে গ্লোবাল হয়ে যাবে।
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// ডিভাইসের ইউনিক আইডি (নিজেস্ব কার্ড চেনার জন্য)
const userId = localStorage.getItem('unique_user_id') || 'ID-' + Math.random().toString(36).substr(2, 9);
localStorage.setItem('unique_user_id', userId);

// ৩. ডাটা লোড করা (Realtime)
database.ref('members').on('value', (snapshot) => {
    const data = snapshot.val();
    const membersList = data ? Object.entries(data) : [];
    renderCards(membersList);
});

function renderCards(members) {
    const grid = document.getElementById('member-grid');
    document.getElementById('total-count').innerText = members.length;
    grid.innerHTML = '';

    members.forEach(([key, m]) => {
        const statusColor = m.status === 'online' ? '#00ff88' : (m.status === 'busy' ? '#ffcc00' : '#777');
        
        // শুধু কার্ডের মালিক ডিলিট বাটন দেখতে পাবে
        const deleteBtn = (m.ownerId === userId) 
            ? `<button onclick="deleteCard('${key}')" class="delete-btn">DELETE</button>` 
            : '';

        const card = document.createElement('div');
        card.className = 'member-card';
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <div style="position:relative">
                        <img src="https://api.dicebear.com/8.x/avataaars/svg?seed=${m.seed}" class="avatar">
                        <span class="status-dot" style="background:${statusColor};"></span>
                    </div>
                    <h2 class="name">${m.name}</h2>
                    <span class="role">${m.role}</span>
                </div>
                <div class="card-back">
                    <h3 class="bio-head">BIO DATA</h3>
                    <p class="bio">"${m.bio}"</p>
                    ${deleteBtn}
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
    gsap.to(".member-card", { opacity: 1, y: 0, stagger: 0.1 });
}

// ৪. কার্ড তৈরি এবং সেভ করা
document.getElementById('member-form').onsubmit = (e) => {
    e.preventDefault();
    const newLegend = {
        name: document.getElementById('member-name').value,
        role: document.getElementById('member-role').value,
        bio: document.getElementById('member-bio').value,
        seed: document.getElementById('avatar-seed').value,
        status: document.getElementById('member-status').value,
        ownerId: userId // এই ডিভাইসের আইডি সেভ হচ্ছে
    };

    database.ref('members').push(newLegend);
    document.getElementById("profile-modal").style.display = "none";
    e.target.reset();
};

function deleteCard(key) {
    if(confirm("আপনি কি নিশ্চিত?")) {
        database.ref('members/' + key).remove();
    }
}

// Modal Toggle (আগের মতোই)
const modal = document.getElementById("profile-modal");
document.getElementById("open-modal").onclick = () => modal.style.display = "block";
document.querySelector(".close-btn").onclick = () => modal.style.display = "none";
