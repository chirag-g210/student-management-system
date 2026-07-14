const Storage = {
    get() {
        const data = localStorage.getItem('students');
        return data ? JSON.parse(data) : [];
    },
    save(data) {
        localStorage.setItem('students', JSON.stringify(data));
    },
    add(s) {
        const data = this.get();
        s.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
        data.push(s);
        this.save(data);
        return s;
    },
    update(id, newData) {
        const data = this.get();
        const idx = data.findIndex(s => s.id === id);
        if (idx !== -1) {
            data[idx] = { ...data[idx], ...newData };
            this.save(data);
            return data[idx];
        }
        return null;
    },
    del(id) {
        let data = this.get();
        data = data.filter(s => s.id !== id);
        this.save(data);
        return data;
    },
    getById(id) {
        const data = this.get();
        return data.find(s => s.id === id) || null;
    }
};
