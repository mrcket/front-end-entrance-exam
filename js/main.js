const MAX_EDUCATION = 4;
const MAX_LANGUAGES = 3;
const MAX_EXPERIENCE = 3;
const MAX_INTERESTS = 10;

function injectCustomStyles() {
  const style = document.createElement('style');
  style.textContent = `
    [contenteditable="true"]:focus {
      outline: none;
      background-color: rgba(40, 217, 121, 0.1);
      border-radius: 4px;
    }
    
    .education-item.favorite [contenteditable="true"]:focus {
      background-color: rgba(0, 0, 0, 0.1);
      color: #000;
    }
    
    .degree-name, .role-name, .featured-points {
      white-space: normal !important;
      overflow: visible !important;
      text-overflow: clip !important;
      display: block;
      word-break: break-word;
    }
    
    .education-item .degree-name, 
    .education-item .school-name {
      -webkit-line-clamp: unset !important;
      -webkit-box-orient: unset !important;
      display: block !important;
    }
    
    .role-name {
      white-space: normal !important;
    }
    
    @keyframes textAppear {
      from { opacity: 0.5; transform: translateY(3px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .new-text {
      animation: textAppear 0.3s ease;
    }
    
    .experience-tag {
      background: rgba(126, 115, 18, 0.4) !important;
      color: #DDF163 !important;
      font-size: 8px !important;
      padding: 2px 8px !important;
      border-radius: 10px !important;
      font-weight: bold !important;
      white-space: nowrap;
      margin-right: 5px;
    }
    
    .experience-topBar-right {
      display: flex;
      align-items: center;
      gap: 5px;
    }
    
    .experience-item:first-child [contenteditable="true"]:focus {
      color: #fff !important;
      text-shadow: 0 0 2px rgba(0,0,0,0.5) !important;
    }
    
    .download-btn {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 10px 20px;
      background-color: var(--color-green);
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      z-index: 1000;
      font-family: var(--font-family-base);
      font-size: 14px;
      transition: background-color 0.3s;
    }
    
    .download-btn:hover {
      background-color: #1ec768;
    }
  `;
  document.head.appendChild(style);
}

function createEducationItem(date = 'Sep 2021 - Jul 2023', degree = 'Master of Interaction Design', school = 'University of Design') {
  const item = document.createElement('div');
  item.className = 'education-item';
  item.innerHTML = `
    <div class="education-topBar">
      <div class="education-date" contenteditable="true">${date}</div>
      <button class="delete-education-btn ripple">✕</button>
    </div>
    <div class="education-content">
      <div class="degree-name" contenteditable="true">${degree}</div>
      <div class="school-name" contenteditable="true">${school}</div>
    </div>
  `;
  
  item.addEventListener('click', function(e) {
    if (e.target.closest('.delete-education-btn') || e.target.closest('[contenteditable="true"]')) return;
    
    document.querySelectorAll('.education-item').forEach(el => {
      el.classList.remove('favorite');
      el.querySelectorAll('[contenteditable="true"]').forEach(textEl => {
        textEl.style.color = '';
        textEl.style.textShadow = '';
      });
    });
    
    this.classList.add('favorite');
    this.querySelectorAll('[contenteditable="true"]').forEach(el => {
      el.style.color = '#fff';
      el.style.textShadow = '0 0 2px rgba(0,0,0,0.5)';
    });
    saveAllData();
  });
  
  item.querySelectorAll('[contenteditable="true"]').forEach(el => {
    el.addEventListener('focus', function() {
      this.style.color = '#000';
      this.style.textShadow = 'none';
      this.classList.add('editing');
    });
    
    el.addEventListener('blur', function() {
      this.classList.remove('editing');
      if (item.classList.contains('favorite')) {
        this.style.color = '#fff';
        this.style.textShadow = '0 0 2px rgba(0,0,0,0.5)';
      }
    });
    
    el.addEventListener('input', function() {
      this.classList.add('new-text');
      setTimeout(() => this.classList.remove('new-text'), 300);
    });
  });
  
  return item;
}

function createLanguageItem(name = 'New Language', progress = '50%') {
  const item = document.createElement('div');
  item.className = 'language-item';
  item.innerHTML = `
    <button class="delete-language-btn ripple">✕</button>
    <div class="language-name" contenteditable="true">${name}</div>
    <div class="progress-container ripple">
      <div class="progress-bar" style="width: ${progress}"></div>
    </div>
  `;
  return item;
}

function createExperienceItem(
  date = 'Sep 2021 - Present', 
  role = 'Product Designer', 
  company = 'Company name',
  points = '• Point one<br>• Point two<br>• Point three'
) {
  const item = document.createElement('div');
  item.className = 'experience-item';
  
  const isFirst = document.querySelectorAll('.experience-item').length === 0;
  
  item.innerHTML = `
    <div class="experience-topBar">
      <div class="experience-date" contenteditable="true">${date}</div>
      <div class="experience-topBar-right">
        ${isFirst ? '<div class="experience-tag">most recent</div>' : ''}
        <button class="delete-experience-btn ripple">✕</button>
      </div>
    </div>
    <div class="experience-content">
      <div class="job-info">
        <div class="role-name" contenteditable="true">${role}</div>
        <div class="about-job" contenteditable="true">${company}</div>
      </div>
      <div class="featured-points" contenteditable="true">
        ${points}
      </div>
    </div>
  `;
  
  item.querySelectorAll('[contenteditable="true"]').forEach(el => {
    el.addEventListener('focus', function() {
      this.classList.add('editing');
    });
    
    el.addEventListener('blur', function() {
      this.classList.remove('editing');
    });
    
    el.addEventListener('input', function() {
      this.classList.add('new-text');
      setTimeout(() => this.classList.remove('new-text'), 300);
    });
  });
  
  return item;
}

function createInterestItem(text = 'New Interest') {
  const item = document.createElement('div');
  item.className = 'content-tag ripple';
  item.innerHTML = `
    <span contenteditable="true">${text}</span>
    <button class="delete-tag-btn ripple">✕</button>
  `;
  
  const span = item.querySelector('span');
  span.addEventListener('focus', () => span.classList.add('editing'));
  span.addEventListener('blur', () => span.classList.remove('editing'));
  span.addEventListener('input', function() {
    this.classList.add('new-text');
    setTimeout(() => this.classList.remove('new-text'), 300);
  });
  
  return item;
}

function saveAllData() {
  const data = {
    profile: {
      name: document.querySelector('.full-name').textContent,
      role: document.querySelector('.role').textContent,
      email: document.querySelector('.email').textContent,
      avatar: document.querySelector('.prof-img').src
    },
    education: Array.from(document.querySelectorAll('.education-item')).map(item => ({
      date: item.querySelector('.education-date').textContent,
      degree: item.querySelector('.degree-name').textContent,
      school: item.querySelector('.school-name').textContent,
      favorite: item.classList.contains('favorite')
    })),
    languages: Array.from(document.querySelectorAll('.language-item')).map(item => ({
      name: item.querySelector('.language-name').textContent,
      progress: item.querySelector('.progress-bar').style.width
    })),
    experience: Array.from(document.querySelectorAll('.experience-item')).map((item, index) => ({
      date: item.querySelector('.experience-date').textContent,
      role: item.querySelector('.role-name').textContent,
      company: item.querySelector('.about-job').textContent,
      points: item.querySelector('.featured-points').textContent,
      recent: index === 0
    })),
    interests: Array.from(document.querySelectorAll('.content-tag')).map(item => 
      item.querySelector('span').textContent
    )
  };
  
  localStorage.setItem('cvData', JSON.stringify(data));
}

function loadSavedData() {
  const savedData = localStorage.getItem('cvData');
  if (!savedData) return false;
  
  const data = JSON.parse(savedData);
  
  if (data.profile) {
    document.querySelector('.full-name').textContent = data.profile.name || 'Kartnik SR';
    document.querySelector('.role').textContent = data.profile.role || 'UX/UI Designer';
    document.querySelector('.email').textContent = data.profile.email || 'Your email';
    if (data.profile.avatar) {
      document.querySelector('.prof-img').src = data.profile.avatar;
    }
  }
  
  const educationList = document.querySelector('.education-list');
  if (data.education?.length) {
    educationList.innerHTML = '';
    data.education.forEach(edu => {
      const item = createEducationItem(edu.date, edu.degree, edu.school);
      if (edu.favorite) {
        item.classList.add('favorite');
        item.querySelectorAll('[contenteditable="true"]').forEach(el => {
          el.style.color = '#fff';
          el.style.textShadow = '0 0 2px rgba(0,0,0,0.5)';
        });
      }
      educationList.appendChild(item);
    });
  }
  
  const languagesContainer = document.querySelector('.listLanguages');
  if (data.languages?.length) {
    languagesContainer.innerHTML = '';
    data.languages.forEach(lang => {
      languagesContainer.appendChild(createLanguageItem(lang.name, lang.progress));
    });
  }
  
  const experienceList = document.querySelector('.job-list');
  if (data.experience?.length) {
    experienceList.innerHTML = '';
    [...data.experience].reverse().forEach(exp => {
      experienceList.appendChild(createExperienceItem(
        exp.date, 
        exp.role, 
        exp.company, 
        exp.points
      ));
    });
  }
  
  const interestsContainer = document.querySelector('.content-tags-container');
  if (data.interests?.length) {
    interestsContainer.innerHTML = '';
    data.interests.forEach(interest => {
      interestsContainer.appendChild(createInterestItem(interest));
    });
  }
  
  return true;
}

function updateAddButtonsState() {
  const educationCount = document.querySelectorAll('.education-item').length;
  const languagesCount = document.querySelectorAll('.language-item').length;
  const experienceCount = document.querySelectorAll('.experience-item').length;
  const interestsCount = document.querySelectorAll('.content-tag').length;
  
  const addEducationBtn = document.getElementById('addEducationBtn');
  addEducationBtn.disabled = educationCount >= MAX_EDUCATION;
  addEducationBtn.textContent = educationCount >= MAX_EDUCATION ? 'Maximum reached' : '+ Add Education';
  addEducationBtn.classList.toggle('disabled', educationCount >= MAX_EDUCATION);
  
  const addLanguageBtn = document.getElementById('addLanguageBtn');
  addLanguageBtn.classList.toggle('disabled', languagesCount >= MAX_LANGUAGES);
  
  const addExperienceBtn = document.getElementById('addExperienceBtn');
  addExperienceBtn.disabled = experienceCount >= MAX_EXPERIENCE;
  addExperienceBtn.textContent = experienceCount >= MAX_EXPERIENCE ? 'Maximum reached' : '+ Add Experience';
  addExperienceBtn.classList.toggle('disabled', experienceCount >= MAX_EXPERIENCE);
  
  const addInterestBtn = document.getElementById('addInterestBtn');
  addInterestBtn.classList.toggle('disabled', interestsCount >= MAX_INTERESTS);
}

function downloadPDF() {
  if (typeof html2pdf === 'undefined') {
    console.error('html2pdf library not loaded');
    alert('PDF generation library not loaded. Please try again later.');
    return;
  }

  const element = document.querySelector('.container');
  
  const opt = {
    margin: 10,
    filename: 'resume.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      logging: false,
      scrollX: 0,
      scrollY: 0
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait',
      putOnlyUsedFonts: true
    }
  };

  html2pdf().set(opt).from(element).save();
}

function initProgressBars() {
  document.querySelectorAll('.progress-container').forEach(container => {
    container.addEventListener('click', function(e) {
      const containerRect = this.getBoundingClientRect();
      const percentage = Math.min(100, Math.max(0, Math.round((e.clientX - containerRect.left) / containerRect.width * 100)));
      
      const progressBar = this.querySelector('.progress-bar');
      progressBar.style.width = `${percentage}%`;
      
      progressBar.classList.add('progress-change');
      setTimeout(() => progressBar.classList.remove('progress-change'), 500);
      
      saveAllData();
    });
  });
}

function initEventHandlers() {
  document.addEventListener('input', (e) => {
    if (e.target.closest('[contenteditable="true"]')) {
      clearTimeout(window.resumeSaveTimer);
      window.resumeSaveTimer = setTimeout(saveAllData, 500);
    }
  });
  
  document.getElementById('avatarInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        document.querySelector('.prof-img').src = event.target.result;
        saveAllData();
      };
      reader.readAsDataURL(file);
    }
  });
  
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-education-btn')) {
      const item = e.target.closest('.education-item');
      item.classList.add('removing');
      setTimeout(() => {
        item.remove();
        saveAllData();
        updateAddButtonsState();
      }, 300);
    }
    
    if (e.target.classList.contains('delete-language-btn')) {
      const item = e.target.closest('.language-item');
      item.classList.add('removing');
      setTimeout(() => {
        item.remove();
        saveAllData();
        updateAddButtonsState();
      }, 300);
    }
    
    if (e.target.classList.contains('delete-experience-btn')) {
      const item = e.target.closest('.experience-item');
      item.classList.add('removing');
      setTimeout(() => {
        item.remove();
        
        const firstItem = document.querySelector('.experience-item');
        if (firstItem && !firstItem.querySelector('.experience-tag')) {
          const tag = document.createElement('div');
          tag.className = 'experience-tag';
          tag.textContent = 'most recent';
          firstItem.querySelector('.experience-topBar-right').prepend(tag);
        }
        
        saveAllData();
        updateAddButtonsState();
      }, 300);
    }
    
    if (e.target.classList.contains('delete-tag-btn')) {
      const item = e.target.closest('.content-tag');
      item.classList.add('removing');
      setTimeout(() => {
        item.remove();
        saveAllData();
        updateAddButtonsState();
      }, 300);
    }
  });
  
  document.getElementById('addLanguageBtn').addEventListener('click', () => {
    if (document.querySelectorAll('.language-item').length >= MAX_LANGUAGES) return;
    
    document.querySelector('.listLanguages').appendChild(createLanguageItem());
    saveAllData();
    updateAddButtonsState();
    initProgressBars();
  });
  
  document.getElementById('addExperienceBtn').addEventListener('click', () => {
    if (document.querySelectorAll('.experience-item').length >= MAX_EXPERIENCE) return;
    
    const container = document.querySelector('.job-list');
    const firstItem = container.querySelector('.experience-item');
    
    if (firstItem) {
      const tag = firstItem.querySelector('.experience-tag');
      if (tag) tag.remove();
    }
    
    container.insertBefore(createExperienceItem(), container.firstChild);
    saveAllData();
    updateAddButtonsState();
  });
  
  document.getElementById('addEducationBtn').addEventListener('click', () => {
    if (document.querySelectorAll('.education-item').length >= MAX_EDUCATION) return;
    
    document.querySelector('.education-list').appendChild(createEducationItem());
    saveAllData();
    updateAddButtonsState();
  });
  
  document.getElementById('addInterestBtn').addEventListener('click', () => {
    if (document.querySelectorAll('.content-tag').length >= MAX_INTERESTS) return;
    
    document.querySelector('.content-tags-container').appendChild(createInterestItem());
    saveAllData();
    updateAddButtonsState();
  });
  
  document.getElementById('downloadPdfBtn').addEventListener('click', downloadPDF);
}

function initApp() {
  injectCustomStyles();
  
  const downloadBtn = document.createElement('button');
  downloadBtn.id = 'downloadPdfBtn';
  downloadBtn.className = 'download-btn';
  downloadBtn.textContent = 'Скачать PDF';
  document.body.appendChild(downloadBtn);
  
  if (!loadSavedData()) {
    document.querySelector('.education-list').appendChild(createEducationItem());
    document.querySelector('.listLanguages').appendChild(createLanguageItem('English', '80%'));
    document.querySelector('.listLanguages').appendChild(createLanguageItem('Russian', '100%'));
    document.querySelector('.job-list').appendChild(createExperienceItem());
    document.querySelector('.content-tags-container').appendChild(createInterestItem('Design'));
    document.querySelector('.content-tags-container').appendChild(createInterestItem('Photography'));
  }
  
  initEventHandlers();
  initProgressBars();
  updateAddButtonsState();
}

document.addEventListener('DOMContentLoaded', initApp);