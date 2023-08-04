$.document.ready(function updateUserName(name) {
    fetch('/getUserData')
        .then(response => response.json())
        .then(data => {
            const userName = document.getElementById('username');
            userName.textContent = data ? data.id + ' 님' : '사용자 명';
        })
        .catch(error => console.error('사용자 정보 가져오기 오류:', error));
})