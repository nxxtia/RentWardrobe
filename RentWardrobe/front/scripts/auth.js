document.querySelector('.auth-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!res.ok) {
            const err = await res.json();
            alert(err.message || 'Помилка входу');
            return;
        }

        const data = await res.json();
        localStorage.setItem('currentUserEmail', data.user.email);
        window.location.href = 'userProfile.html';
    } catch (err) {
        alert('Помилка авторизації');
        console.error(err);
    }
});