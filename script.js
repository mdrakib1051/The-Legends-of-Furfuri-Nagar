// Local Storage থেকে মেম্বার ডাটা রিড করা
let members = JSON.parse(localStorage.getItem('groupData')) || [];

document.addEventListener('DOMContentLoaded', () => {
    displayCards();
    initModal();
    document.querySelector('.terminal-id').innerText = 'SYS-' + Math.floor(Math.random() * 9999);
});

// কার্ডগুলো স্ক্রিনে দেখানোর ফাংশন
function displayCards() {
    const grid = document.getElementById('member-grid');
    document.getElementById('total-count').innerText = members.length;
    grid.innerHTML = '';

    members.forEach((m, index) => {
        const statusColor = m.status === 'online' ? '#00ff88' : (m.status === 'busy' ? '#ffcc00' : '#777');
        
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
                    <button onclick="deleteMe(${index})" style="margin-top:20px; background:none; border:1px solid #ff3366; color:#ff3366; padding:5px 10px; border-radius:8px; cursor:pointer; font-size:0.7rem;">DELETE</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });

    // আগের মতোই GSAP এন্ট্রি অ্যানিমেশন
    gsap.to(".member-card", { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" });
}

// প্রোফাইল তৈরির ফর্ম কন্ট্রোল
function initModal() {
    const modal = document.getElementById("profile-modal");
    const openBtn = document.getElementById("open-modal");
    const closeBtn = document.querySelector(".close-btn");
    const form = document.getElementById("member-form");

    openBtn.onclick = () => modal.style.display = "block";
    closeBtn.onclick = () => modal.style.display = "none";
    
    form.onsubmit = (e) => {
        e.preventDefault();
        const newLegend = {
            name: document.getElementById('member-name').value,
            role: document.getElementById('member-role').value,
            bio: document.getElementById('member-bio').value,
            seed: document.getElementById('avatar-seed').value,
            status: document.getElementById('member-status').value
        };
        members.push(newLegend);
        localStorage.setItem('groupData', JSON.stringify(members));
        displayCards();
        modal.style.display = "none";
        form.reset();
    };
}

function deleteMe(index) {
    if(confirm("প্রোফাইলটি মুছে ফেলতে চান?")) {
        members.splice(index, 1);
        localStorage.setItem('groupData', JSON.stringify(members));
        displayCards();
    }
}
