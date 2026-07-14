const App = {
    init() {
        this.load();
        this.initTheme();
        
        // Add form submit
        document.getElementById('studentForm').onsubmit = (e) => {
            e.preventDefault();
            this.save();
        };
        
        // Search
        document.getElementById('search').oninput = (e) => {
            this.search(e.target.value);
        };
        
        // Toggle sidebar
        document.querySelector('.toggle').onclick = () => {
            document.querySelector('.side').classList.toggle('open');
        };
        
        // Back button - sidebar close
        document.getElementById('backBtn').onclick = (e) => {
            e.preventDefault();
            document.querySelector('.side').classList.remove('open');
        };

        // Sidebar menu click - Active state
        document.querySelectorAll('.side nav a').forEach(link => {
            link.onclick = function(e) {
                e.preventDefault();
                document.querySelectorAll('.side nav a').forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            };
        });

        // Search by Roll Number
        document.getElementById('rollSearchBtn').onclick = () => {
            this.searchByRollNumber();
        };

        document.getElementById('rollSearchInput').onkeypress = (e) => {
            if (e.key === 'Enter') {
                this.searchByRollNumber();
            }
        };

        // ===== THEME TOGGLE =====
        const toggle = document.getElementById('themeToggle');
        toggle.onclick = () => {
            this.toggleTheme();
        };
    },

    // ===== THEME FUNCTIONS =====
    initTheme() {
        const savedTheme = localStorage.getItem('theme');
        const toggle = document.getElementById('themeToggle');
        const icon = toggle?.querySelector('.slider i');
        
        if (savedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            toggle?.classList.add('active');
            if (icon) icon.className = 'fas fa-sun';
        } else {
            document.documentElement.removeAttribute('data-theme');
            toggle?.classList.remove('active');
            if (icon) icon.className = 'fas fa-moon';
        }
    },

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const toggle = document.getElementById('themeToggle');
        const icon = toggle?.querySelector('.slider i');
        
        if (currentTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            toggle?.classList.remove('active');
            if (icon) icon.className = 'fas fa-moon';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            toggle?.classList.add('active');
            if (icon) icon.className = 'fas fa-sun';
        }
    },

    load() {
        const data = Storage.get();
        UI.render(data);
        UI.stats(data);
        
        // Reset form
        document.getElementById('studentForm').reset();
        const btn = document.querySelector('.submit-btn');
        btn.innerHTML = '<i class="fas fa-save"></i> Add Student';
        delete btn.dataset.editId;
        
        // Clear error styles
        document.getElementById('studentNumber').style.borderColor = '';
        document.getElementById('rollNumber').style.borderColor = '';
        
        // Clear roll search result
        document.getElementById('rollSearchResult').innerHTML = '';
        document.getElementById('rollSearchInput').value = '';
    },

    search(q) {
        const data = Storage.get();
        const filtered = q.trim() ? data.filter(s => 
            s.name.toLowerCase().includes(q.toLowerCase()) ||
            s.email.toLowerCase().includes(q.toLowerCase()) ||
            s.course.toLowerCase().includes(q.toLowerCase()) ||
            (s.studentNumber && s.studentNumber.includes(q)) ||
            (s.rollNumber && s.rollNumber.includes(q))
        ) : data;
        UI.render(filtered);
        UI.stats(filtered);
    },

    searchByRollNumber() {
        const rollInput = document.getElementById('rollSearchInput');
        const resultDiv = document.getElementById('rollSearchResult');
        const rollNumber = rollInput.value.trim();

        if (!rollNumber) {
            resultDiv.innerHTML = `
                <div class="validation-msg">
                    <i class="fas fa-exclamation-circle"></i> Please enter a roll number!
                </div>
            `;
            return;
        }

        const students = Storage.get();
        const student = students.find(s => s.rollNumber === rollNumber);

        if (student) {
            resultDiv.innerHTML = `
                <div class="search-result">
                    <div class="result-card">
                        <div class="result-item">
                            <span class="label">Full Name</span>
                            <span class="value">${student.name}</span>
                        </div>
                        <div class="result-item">
                            <span class="label">Email</span>
                            <span class="value">${student.email}</span>
                        </div>
                        <div class="result-item">
                            <span class="label">Student Number</span>
                            <span class="value">${student.studentNumber}</span>
                        </div>
                        <div class="result-item">
                            <span class="label">Course</span>
                            <span class="value">${student.course}</span>
                        </div>
                        <div class="result-item">
                            <span class="label">Roll Number</span>
                            <span class="value">${student.rollNumber}</span>
                        </div>
                        <div class="result-item">
                            <span class="label">Grade</span>
                            <span class="value">${student.grade}%</span>
                        </div>
                        <div class="result-item" style="grid-column: 1 / -1;">
                            <span class="label">Status</span>
                            <span class="value"><span class="tag ${student.status.toLowerCase()}">${student.status}</span></span>
                        </div>
                    </div>
                </div>
            `;
        } else {
            resultDiv.innerHTML = `
                <div class="search-result">
                    <div class="no-result">
                        <i class="fas fa-user-slash"></i>
                        ❌ No student found with Roll Number: <strong>${rollNumber}</strong>
                    </div>
                </div>
            `;
        }
    },

    save() {
        const editId = document.querySelector('.submit-btn').dataset.editId;
        const data = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            course: document.getElementById('course').value,
            studentNumber: document.getElementById('studentNumber').value.trim(),
            rollNumber: document.getElementById('rollNumber').value.trim(),
            grade: document.getElementById('grade').value,
            status: document.getElementById('status').value
        };
        
        // Validation
        if (!data.name || !data.email || !data.studentNumber || !data.rollNumber || !data.grade) {
            alert('Please fill all required fields!');
            return;
        }

        // Student number validation - exactly 10 digits
        if (data.studentNumber.length !== 10) {
            alert('❌ Student number must be exactly 10 digits!\n\nExample: 2024000001');
            document.getElementById('studentNumber').focus();
            document.getElementById('studentNumber').style.borderColor = '#d9534f';
            return;
        }

        // Check if it's all numbers (no letters)
        if (!/^\d+$/.test(data.studentNumber)) {
            alert('❌ Student number must contain only digits (0-9)!');
            document.getElementById('studentNumber').focus();
            document.getElementById('studentNumber').style.borderColor = '#d9534f';
            return;
        }

        // Roll number validation - should not be empty
        if (!data.rollNumber) {
            alert('❌ Please enter a roll number!');
            document.getElementById('rollNumber').focus();
            document.getElementById('rollNumber').style.borderColor = '#d9534f';
            return;
        }

        // Check if student number already exists (only for new students)
        if (!editId) {
            const allStudents = Storage.get();
            const exists = allStudents.some(s => s.studentNumber === data.studentNumber);
            if (exists) {
                alert('❌ This student number already exists!\nPlease use a unique number.');
                document.getElementById('studentNumber').focus();
                document.getElementById('studentNumber').style.borderColor = '#d9534f';
                return;
            }

            // Check if roll number already exists
            const rollExists = allStudents.some(s => s.rollNumber === data.rollNumber);
            if (rollExists) {
                alert('❌ This roll number already exists!\nPlease use a unique roll number.');
                document.getElementById('rollNumber').focus();
                document.getElementById('rollNumber').style.borderColor = '#d9534f';
                return;
            }
        }
        
        if (editId) {
            Storage.update(editId, data);
        } else {
            Storage.add(data);
        }
        
        this.load();
        
        // Scroll to last added
        setTimeout(() => {
            document.querySelector('.last-added').scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());