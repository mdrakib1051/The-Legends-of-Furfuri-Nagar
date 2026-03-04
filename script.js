// ==========================================
// 1. মেম্বারদের ডাটা লিস্ট (JSON Structure)
// এভাবেই তুমি ৩০ জন মেম্বারের তথ্য এখানে অ্যাড করবে।
// ছবি হিসেবে আমি অটোমেটিক অ্যাভাটার API ব্যবহার করেছি।
// ==========================================
const members = [
    {
        name: "আহমেদ ফাহিম",
        role: "Lead Developer",
        bio: "কোডিং আমার নেশা, আর কফি আমার ভালোবাসা। ভবিষ্যতের জন্য নিজেকে তৈরি করছি।",
        status: "online", // online, busy, offline
        avatar_seed: "Felix", // অ্যাভাটার জেনারেট করার জন্য যেকোনো ইউনিক নাম
        social: { fb: "#", github: "#" }
    },
    {
        name: "নুসরাত জাহান",
        role: "UI/UX Designer",
        bio: "ডিজাইন দিয়ে মানুষের সমস্যা সমাধান করাই আমার লক্ষ্য। ড্রয়িং করতে ভালোবাসি।",
        status: "busy",
        avatar_seed: "Aneka",
        social: { fb: "#", github: "#" }
    },
    {
        name: "রাহুল দেওয়ান",
        role: "Security Expert",
        bio: "সাইবার ওয়ার্ল্ড নিরাপদ রাখাই আমার কাজ। সিস্টেম ব্রেক করা আমার শখ।",
        status: "online",
        avatar_seed: "Raji",
        social: { fb: "#", github: "#" }
    },
    // তুমি জাস্ট উপরের মতো কপি করে এখানে আরও ২৭ জন মেম্বার অ্যাড করো...
];

// ==========================================
// 2. কার্ড জেনারেট করার ফাংশন
// ==========================================
function generateCards() {
    const grid = document.getElementById('member-grid');
    const totalCounter = document.getElementById('total-members');
    
    // লোডার রিমুভ করা
    grid.innerHTML = '';
    
    // মেম্বার সংখ্যা আপডেট করা
    totalCounter.innerText = members.length;

    // প্রতিটি মেম্বারের জন্য HTML তৈরি করা
    members.forEach(member => {
        // স্ট্যাটাস কালার সেট করা
        let statusColor = "#ccc"; // default offline
        if(member.status === "online") statusColor = "#00ff88";
        if(member.status === "busy") statusColor = "#ffcc00";

        const cardHTML = `
            <div class="member-card">
                <div class="card-inner">
                    <div class="card-front">
                        <div class="avatar-wrapper">
                            <img src="https://api.dicebear.com/8.x/avataaars/svg?seed=${member.avatar_seed}" alt="${member.name}" class="avatar">
                            <span class="status-dot" style="background: ${statusColor}; box-shadow: 0 0 10px ${statusColor};"></span>
                        </div>
                        <h2 class="name">${member.name}</h2>
                        <span class="role">${member.role}</span>
                    </div>
                    <div class="card-back">
                        <h3 class="back-title">Classified Bio</h3>
                        <p class="bio">"${member.bio}"</p>
                        <div class="social-links">
                            <a href="${member.social.fb}" target="_blank">FB</a>
                            <a href="${member.social.github}" target="_blank">GH</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        // গ্রিডে অ্যাড করা
        grid.innerHTML += cardHTML;
    });

    // কার্ড তৈরি হওয়ার পর অ্যানিমেশন শুরু করা
    startAnimations();
}

// ==========================================
// 3. GSAP প্রিমিয়াম অ্যানিমেশনস
// ==========================================
function startAnimations() {
    // ওয়েবসাইট লোড হওয়ার সময় কার্ডগুলো একটার পর একটা ভেসে উঠবে
    gsap.to(".member-card", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1, // প্রতিটি কার্ডের মাঝে দেরি
        ease: "power2.out",
        start: "top bottom",
    });
}

// ==========================================
// 4. ইনিশিয়ালাইজেশন
// ==========================================
// পেজ লোড হলে কার্ড জেনারেট করা শুরু করো
window.addEventListener('DOMContentLoaded', generateCards);

// ফুটারের জন্য একটা র‍্যান্ডম আইডি তৈরি করা
document.querySelector('.terminal-id').innerText = 'LEG-' + Math.floor(Math.random() * 10000);
