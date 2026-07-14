const UI = {
    render(data) {
        const tbody = document.getElementById('list');
        if (!data.length) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:30px;color:#7a8aa0;">No students</td></tr>`;
            return;
        }
        tbody.innerHTML = data.map(s => `
            <tr>
                <td>
                    <div class="avatar">
                        <span class="init">${this.initials(s.name)}</span>
                        <div>
                            <div class="name">${s.name}</div>
                            <span class="email">${s.email}</span>
                        </div>
                    </div>
                </td>
                <td><strong>${s.studentNumber || 'N/A'}</strong></td>
                <td>${s.course}</td>
                <td>${s.grade}%</td>
                <td><strong>${s.rollNumber || 'N/A'}</strong></td>
                <td class="actions">
                    <i class="fas fa-edit" onclick="UI.edit('${s.id}')"></i>
                    <i class="fas fa-trash" onclick="UI.del('${s.id}')"></i>
                </td>
            </tr>
        `).join('');
    },

    initials(name) {
        return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    },

    stats(data) {
        document.getElementById('total').textContent = data.length;
        document.getElementById('active').textContent = data.filter(s => s.status === 'Active').length;
        document.getElementById('pending').textContent = data.filter(s => s.status === 'Inactive').length;
        const avg = data.length ? (data.reduce((a, b) => a + parseFloat(b.grade), 0) / data.length).toFixed(1) : '0';
        document.getElementById('avg').textContent = avg + '%';
        document.getElementById('count').textContent = `${data.length} students`;
        this.courses(data);
        
        // Last added student
        if (data.length) {
            const last = data[data.length - 1];
            document.getElementById('lastName').textContent = last.name;
        } else {
            document.getElementById('lastName').textContent = 'None yet';
        }
    },

    courses(data) {
        const box = document.getElementById('courseStats');
        const count = {};
        data.forEach(s => count[s.course] = (count[s.course] || 0) + 1);
        const keys = Object.keys(count).sort();
        box.innerHTML = keys.length ? keys.map(c => `
            <span class="badge"><i class="fas fa-book"></i> ${c} <span class="cnt">${count[c]}</span></span>
        `).join('') : '<span style="color:#7a8aa0;font-size:13px;">No courses</span>';
    },

    edit(id) {
        const student = Storage.getById(id);
        if (!student) return;
        
        // Fill form with student data
        document.getElementById('name').value = student.name;
        document.getElementById('email').value = student.email;
        document.getElementById('course').value = student.course;
        document.getElementById('studentNumber').value = student.studentNumber || '';
        document.getElementById('rollNumber').value = student.rollNumber || '';
        document.getElementById('grade').value = student.grade;
        document.getElementById('status').value = student.status;
        
        // Change button text to update
        const btn = document.querySelector('.submit-btn');
        btn.innerHTML = '<i class="fas fa-edit"></i> Update Student';
        btn.dataset.editId = student.id;
        
        // Scroll to form
        document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
    },

    del(id) {
        if (confirm('Delete this student?')) {
            Storage.del(id);
            App.load();
        }
    }
};
