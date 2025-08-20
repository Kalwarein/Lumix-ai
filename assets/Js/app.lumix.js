
  window.addEventListener('DOMContentLoaded', function () {
    auth.onAuthStateChanged(user => {
      if (!user) {
        // User not logged in — redirect to login or error page
        window.location.href = 'server.error.html';
      } else {
        const uid = user.uid;

        // Fetch user's Firestore profile securely
        db.collection('users').doc(uid).get().then(doc => {
          if (doc.exists) {
            const data = doc.data();
            document.getElementById('headerUserName').textContent = data.displayName || data.username || user.email;
            document.getElementById('headerUserAvatar').src = data.avatar || 'assets/images/avatar-placeholder.png';
          } else {
            console.warn('User profile not found in Firestore');
          }
        }).catch(error => {
          console.error('Error fetching user data:', error);
        });
      }
    });
  });

  // Dropdown logic
  const avatar = document.getElementById('headerUserAvatar');
  const dropdown = document.getElementById('profileDropdown');

  avatar?.addEventListener('click', function (e) {
    dropdown.classList.toggle('show');
  });

  avatar?.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      dropdown.classList.toggle('show');
    }
  });

  document.addEventListener('click', function (e) {
    if (!avatar?.contains(e.target) && !dropdown?.contains(e.target)) {
      dropdown.classList.remove('show');
    }
  });

  // Logout button
  const logoutBtn = document.getElementById('logoutBtn');
  logoutBtn?.addEventListener('click', function () {
    auth.signOut().then(() => {
      window.location.href = 'Sucess-log-out.html';
    });
  });