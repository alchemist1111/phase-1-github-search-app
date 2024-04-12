window.addEventListener('DOMContentLoaded', function(){
    const githubForm = document.getElementById('github-form');
    const searchInput = document.getElementById('search');
    const userList = document.getElementById('user-list');
    const reposList = document.getElementById('repos-list');
    const toggleSearchBtn = document.getElementById('toggle-search');

    let isUserSearch = true; // Initially search for users

    githubForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const searchTerm = searchInput.value.trim();
      if (searchTerm) {
        if (isUserSearch) {
          searchUsers(searchTerm);
        } else {
          searchRepos(searchTerm);
        }
      }
    });

    toggleSearchBtn.addEventListener('click', () => {
      isUserSearch = !isUserSearch;
      searchInput.placeholder = isUserSearch ? 'Search users...' : 'Search repositories...';
    });

    function searchUsers(searchTerm) {
      axios.get(`https://api.github.com/search/users?q=${searchTerm}`)
        .then(response => {
          const users = response.data.items;
          displayUsers(users);
        })
        .catch(error => console.error(error));
    }

    function displayUsers(users) {
      userList.innerHTML = '';
      users.forEach(user => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
          <img src='${user.avatar_url}' alt='Avatar' style='width: 50px; height: 50px;'>
          <a href='${user.html_url}' target='_blank'>${user.login}</a>
        `;
        userList.appendChild(listItem);
        listItem.addEventListener('click', () => {
          getRepos(user.login);
        });
      });
    }

    function getRepos(username) {
      axios.get(`https://api.github.com/users/${username}/repos`)
        .then(response => {
          const repos = response.data;
          displayRepos(repos);
        })
        .catch(error => console.error(error));
    }

    function displayRepos(repos) {
      reposList.innerHTML = '';
      repos.forEach(repo => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<a href='${repo.html_url}' target='_blank'>${repo.name}</a>`;
        reposList.appendChild(listItem);
      });
    }
})