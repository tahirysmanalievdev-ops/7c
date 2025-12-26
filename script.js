/* =========================================
   1. DATA & CONFIGURATION
   ========================================= */

// --- MEMORIES CONFIGURATION ---
// Add your photo filenames here. The code looks in the 'memories' folder.
const memoryData = {
  All: [], // Leave empty, code auto-fills this
  Trips: [
    "trip.mp4",
    "trip2.jpg",
    "trip3.jpg",
    "trip4.jpg",
    "trip5.mp4",
    "trip6.jpg",
    "trip7.mp4",
    "trip8.jpg",
    "trip9.jpg",
    "trip10.jpg",
    "trip11.jpg",
    "trip12.jpg",
  ],
  Birthdays: ["bday.jpg", "bday2.jpg", "bday3.jpg", "bday4.mp4"],
  Sleepover: [
    "sleepover1.jpg",
    "sleepover2.jpg",
    "sleepover3.jpg",
    "sleepover4.jpg",
    "sleepover5.jpg",
    "sleepover6.jpg",
    "sleepover7.jpg",
    "sleepover8.jpg",
    "sleepover9.jpg",
  ],
};

// --- CLASS DATA ---
const rawStudents = [
  // Teachers (VIP)
  { name: "Mr. Atay", surname: "", gender: "boy", role: "teacher" },
  { name: "Ms. Smitha", surname: "", gender: "girl", role: "teacher" },

  // Students
  { name: "Tahir", surname: "Ysmanaliev", gender: "boy" },
  { name: "Aidar", surname: "Beyshenaliev", gender: "boy" },
  { name: "Alinur", surname: "Alymbekov", gender: "boy" },
  { name: "Iskhak", surname: "Esentaev", gender: "boy" },
  { name: "Iskhak", surname: "Toktogulov", gender: "boy" },
  { name: "Ali", surname: "Temirbekov", gender: "boy" },
  { name: "Emin", surname: "Ayhan", gender: "boy" },
  { name: "Nursultan", surname: "Talasbaev", gender: "boy" },
  { name: "Omar", surname: "Satybaev", gender: "boy" },
  { name: "Ariet", surname: "Nazarov", gender: "boy" },
  { name: "Adil", surname: "Askarov", gender: "boy" },
  { name: "Imran", surname: "Omurbekov", gender: "boy" },
  { name: "Murat", surname: "Turgumbaev", gender: "boy" },
  // Girls
  { name: "Aruuke", surname: "Sagynalieva", gender: "girl" },
  { name: "Cholponai", surname: "Abdilakimova", gender: "girl" },
  { name: "Adele", surname: "Sultanova", gender: "girl" },
  { name: "Aisezim", surname: "Abdrahmanova", gender: "girl" },
  { name: "Raniya", surname: "Djanybekova", gender: "girl" },
  { name: "Daliya", surname: "Arstanbaeva", gender: "girl" },
  { name: "Skyller", surname: "Samuels", gender: "girl" },
  { name: "Muhlise", surname: "Acikgoz", gender: "girl" },
  { name: "Kamila", surname: "Ashymova", gender: "girl" },
  { name: "Alina", surname: "San", gender: "girl" },
  { name: "Aruuke", surname: "Mirzaeva", gender: "girl" },
  { name: "Nailia", surname: "Soshanlo", gender: "girl" },
  { name: "Safiia", surname: "Kubanychbekova", gender: "girl" },
  { name: "Amira", surname: "Magtymova", gender: "girl" },
  { name: "Jamilya", surname: "Abazbekova", gender: "girl" },
  { name: "New", surname: "Student", gender: "girl" },
];

// Helper colors
function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++)
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return `hsl(${Math.abs(hash) % 360}, 70%, 85%)`;
}
function stringToDarkColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++)
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return `hsl(${Math.abs(hash) % 360}, 70%, 30%)`;
}

// Process Data
const students = rawStudents
  .map((s) => ({
    ...s,
    fullName: s.surname ? `${s.name} ${s.surname}` : s.name,
    photoPath: `photos/${s.name}.jpg`,
    colorBg: stringToColor(s.name),
    colorTxt: stringToDarkColor(s.name),
    role: s.role || "student",
  }))
  .sort((a, b) => {
    if (a.role === "teacher" && b.role !== "teacher") return -1;
    if (a.role !== "teacher" && b.role === "teacher") return 1;
    return a.fullName.localeCompare(b.fullName);
  });

let currentUser = null;

/* =========================================
   2. INITIALIZATION
   ========================================= */
document.addEventListener("DOMContentLoaded", () => {
  initLogin();
  startClock();
  updateGreeting();
  renderCharts();
  loadMemories();
  initMobileTilt();
  initSnow(); // Make sure this is here!
});

/* =========================================
   3. SNOW SYSTEM (FIXED)
   ========================================= */
let snowActive = false;
let snowCanvas, snowCtx;
let particles = [];
let w, h;
let windSpeed = 0;
let animationFrameId;

function initSnow() {
  snowCanvas = document.getElementById("snow-canvas");
  if (!snowCanvas) return;
  snowCtx = snowCanvas.getContext("2d");
  resizeSnow();
  window.addEventListener("resize", resizeSnow);
}

function resizeSnow() {
  w = snowCanvas.width = window.innerWidth;
  h = snowCanvas.height = window.innerHeight;
}

function createParticles() {
  particles = [];
  for (let i = 0; i < 150; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 3 + 1, // Radius
      d: Math.random() * 10 + 2, // Density
    });
  }
}

function drawSnow() {
  if (!snowActive) {
    snowCtx.clearRect(0, 0, w, h);
    cancelAnimationFrame(animationFrameId);
    return;
  }

  snowCtx.clearRect(0, 0, w, h);
  snowCtx.fillStyle = "#FFFFFF"; // Pure White Snow
  snowCtx.beginPath();

  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    snowCtx.moveTo(p.x, p.y);
    snowCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
  }
  snowCtx.fill();
  updateSnow();
  animationFrameId = requestAnimationFrame(drawSnow);
}

function updateSnow() {
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    p.y += Math.cos(p.d) + 1 + p.r / 2; // Gravity
    p.x += Math.sin(0) + 0.5 + windSpeed; // Wind

    // Wrap around
    if (p.x > w + 5 || p.x < -5 || p.y > h) {
      if (i % 3 > 0) {
        particles[i] = { x: Math.random() * w, y: -10, r: p.r, d: p.d };
      } else {
        if (Math.sin(0) > 0)
          particles[i] = { x: -5, y: Math.random() * h, r: p.r, d: p.d };
        else particles[i] = { x: w + 5, y: Math.random() * h, r: p.r, d: p.d };
      }
    }
  }
}

window.toggleSnow = function () {
  snowActive = !snowActive;
  const btn = document.querySelector(".snow-btn");
  const body = document.body;

  if (snowActive) {
    btn.classList.add("active");
    body.classList.add("winter-mode"); // Turn background DARK
    btn.innerHTML = '<i class="ph ph-snowflake"></i> Stop Snow';
    resizeSnow();
    createParticles();
    drawSnow();
  } else {
    btn.classList.remove("active");
    body.classList.remove("winter-mode"); // Turn background LIGHT
    btn.innerHTML = '<i class="ph ph-snowflake"></i> Let it snow';
    snowCtx.clearRect(0, 0, w, h);
  }
};

/* =========================================
   4. LOGIN & DASHBOARD LOGIC
   ========================================= */
function initLogin() {
  const select = document.getElementById("student-select");
  students.forEach((s) => {
    const option = document.createElement("option");
    option.value = s.fullName;
    option.innerText = s.role === "teacher" ? `👑 ${s.fullName}` : s.fullName;
    select.appendChild(option);
  });
}

window.handleLogin = function () {
  vibratePhone();
  const val = document.getElementById("student-select").value;
  if (!val) return alert("Select your name.");

  currentUser = students.find((s) => s.fullName === val);

  document.getElementById("user-name").innerText = currentUser.fullName;
  const idCard = document.getElementById("tilt-card");

  if (currentUser.role === "teacher") {
    document.getElementById("user-role").innerText = "Homeroom Teacher";
    document.getElementById("id-number").innerText = "STAFF-001";
    idCard.setAttribute("data-role", "teacher");
  } else {
    document.getElementById("user-role").innerText = "Grade 7 Student";
    document.getElementById("id-number").innerText = `ID-2025-${(
      students.indexOf(currentUser) + 1
    )
      .toString()
      .padStart(2, "0")}`;
    idCard.removeAttribute("data-role");
  }

  const av = document.getElementById("id-avatar");
  const img = new Image();
  img.src = currentUser.photoPath;
  img.onload = () => {
    av.style.backgroundImage = `url('${currentUser.photoPath}')`;
    av.innerText = "";
  };
  img.onerror = () => {
    av.style.background = currentUser.colorBg;
    av.style.color = currentUser.colorTxt;
    av.innerText = currentUser.name.charAt(0);
  };

  document.getElementById("login-screen").style.opacity = "0";
  setTimeout(() => {
    document.getElementById("login-screen").style.display = "none";
    document.getElementById("dashboard").classList.add("active");
    renderStudentList();
  }, 500);
};

/* =========================================
   5. MEMORIES SYSTEM (FIXED SCROLL & LIGHTBOX)
   ========================================= */
function loadMemories() {
  setupFilters();
  renderGallery("All");
}

function setupFilters() {
  const filterContainer = document.getElementById("memory-filters");
  if (!filterContainer) return;
  filterContainer.innerHTML = "";

  const allFiles = new Set();
  Object.keys(memoryData).forEach((cat) => {
    if (cat !== "All") memoryData[cat].forEach((file) => allFiles.add(file));
  });
  memoryData["All"] = Array.from(allFiles);

  Object.keys(memoryData).forEach((cat) => {
    if (memoryData[cat].length === 0) return;
    const btn = document.createElement("button");
    btn.className = `filter-btn ${cat === "All" ? "active" : ""}`;
    btn.innerText = cat;
    btn.onclick = () => {
      document
        .querySelectorAll(".filter-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderGallery(cat);
    };
    filterContainer.appendChild(btn);
  });
}

function renderGallery(category) {
  const container = document.getElementById("gallery-container");
  container.innerHTML = "";

  const files = memoryData[category] || [];
  if (files.length === 0) {
    container.innerHTML = `<div style="grid-column:1/-1; text-align:center; color:#888;">No memories found.</div>`;
    return;
  }

  files.forEach((filename) => {
    const div = document.createElement("div");
    div.className = "memory-card";
    const path = `memories/${filename}`;

    const isVideo =
      filename.toLowerCase().endsWith(".mp4") ||
      filename.toLowerCase().endsWith(".mov") ||
      filename.toLowerCase().endsWith(".webm");

    if (isVideo) {
      div.innerHTML = `
                <video src="${path}#t=0.1" preload="metadata" playsinline></video>
                <div class="play-overlay"><i class="ph ph-play-circle"></i></div>
            `;
      div.onclick = () => openLightbox(path, "video");
    } else {
      const img = document.createElement("img");
      img.className = "memory-img";
      img.src = path;
      img.loading = "lazy";
      img.onerror = () => {
        div.style.display = "none";
      };
      div.appendChild(img);
      div.onclick = () => openLightbox(path, "image");
    }
    container.appendChild(div);
  });
}

function openLightbox(src, type) {
  const lightbox = document.getElementById("lightbox");
  const container = document.getElementById("lightbox-media-container");
  container.innerHTML = "";

  if (type === "video") {
    container.innerHTML = `
            <video controls autoplay playsinline style="max-width:100%; max-height:90vh; border-radius:8px;">
                <source src="${src}" type="video/mp4">
            </video>
        `;
  } else {
    const img = document.createElement("img");
    img.src = src;
    container.appendChild(img);
  }
  lightbox.classList.add("active");
}

window.closeLightbox = function () {
  const lightbox = document.getElementById("lightbox");
  const container = document.getElementById("lightbox-media-container");
  lightbox.classList.remove("active");
  setTimeout(() => {
    container.innerHTML = "";
  }, 300);
};

/* =========================================
   6. UTILITIES
   ========================================= */
window.openModal = (id) => {
  document.getElementById("modal-overlay").classList.add("active");
  document.getElementById(id).classList.add("active");
};
window.closeModal = (id) => {
  document.getElementById("modal-overlay").classList.remove("active");
  document.getElementById(id).classList.remove("active");
};
window.vibratePhone = function () {
  if (navigator.vibrate) navigator.vibrate(10);
};

function renderStudentList(filter = "") {
  const grid = document.getElementById("student-list");
  grid.innerHTML = "";
  students.forEach((s) => {
    if (!s.fullName.toLowerCase().includes(filter.toLowerCase())) return;
    const isMe = currentUser && s.fullName === currentUser.fullName;
    const card = document.createElement("div");
    card.className = "s-card";
    let tagHtml = "";
    if (s.role === "teacher")
      tagHtml = '<div class="tag-me" style="background:#F59E0B">TEACHER</div>';
    else if (isMe) tagHtml = '<div class="tag-me">YOU</div>';

    card.innerHTML = `<div class="s-avatar-small" style="background:${
      s.colorBg
    }; color:${s.colorTxt}">${s.name.charAt(0)}</div><div class="s-info"><h5>${
      s.fullName
    }</h5>${tagHtml}</div>`;
    const img = new Image();
    img.src = s.photoPath;
    img.onload = () => {
      card.querySelector(".s-avatar-small").innerHTML = "";
      card.querySelector(
        ".s-avatar-small"
      ).style.backgroundImage = `url('${s.photoPath}')`;
    };
    grid.appendChild(card);
  });
}
window.filterStudents = () =>
  renderStudentList(document.getElementById("search-input").value);

function startClock() {
  setInterval(() => {
    document.getElementById("clock").innerText = new Date().toLocaleTimeString(
      [],
      { hour: "2-digit", minute: "2-digit" }
    );
  }, 1000);
  document.getElementById("full-date").innerText =
    new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
}
function updateGreeting() {
  const h = new Date().getHours();
  document.getElementById("greeting-text").innerText =
    h < 12 ? "Good Morning" : h < 17 ? "Good Afternoon" : "Good Evening";
}

function renderCharts() {
  const boyCount = students.filter(
    (s) => s.gender === "boy" && s.role !== "teacher"
  ).length;
  const girlCount = students.filter(
    (s) => s.gender === "girl" && s.role !== "teacher"
  ).length;
  new Chart(document.getElementById("genderChart"), {
    type: "doughnut",
    data: {
      labels: ["Boys", "Girls"],
      datasets: [
        {
          data: [boyCount, girlCount],
          backgroundColor: ["#0071e3", "#8b5cf6"],
          borderWidth: 0,
        },
      ],
    },
    options: { cutout: "75%", plugins: { legend: { display: false } } },
  });
}

// Mobile Tilt & Snow Wind
function initMobileTilt() {
  const card = document.getElementById("tilt-card");
  if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", function (event) {
      const x = Math.min(Math.max(event.gamma, -20), 20);
      const y = Math.min(Math.max(event.beta - 45, -20), 20);
      if (x && y)
        card.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg)`;
      if (snowActive) windSpeed = event.gamma / 10;
    });
  }
}
// Desktop Tilt
const tiltCard = document.getElementById("tilt-card");
tiltCard.addEventListener("mousemove", (e) => {
  if (window.innerWidth < 900) return;
  const rect = tiltCard.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;
  tiltCard.style.transform = `perspective(1000px) rotateY(${
    x / 20
  }deg) rotateX(${-y / 20}deg)`;
});
tiltCard.addEventListener(
  "mouseleave",
  () => (tiltCard.style.transform = "none")
);

// Cursor
const cursor = document.getElementById("cursor-dot");
let mx = 0,
  my = 0,
  cx = 0,
  cy = 0;
document.addEventListener("mousemove", (e) => {
  mx = e.clientX;
  my = e.clientY;
});
function animCursor() {
  cx += (mx - cx) * 0.2;
  cy += (my - cy) * 0.2;
  cursor.style.left = cx + "px";
  cursor.style.top = cy + "px";
  requestAnimationFrame(animCursor);
}
animCursor();
