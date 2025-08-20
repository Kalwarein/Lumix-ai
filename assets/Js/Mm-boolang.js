    // Avatar upload preview
    const avatarInput = document.getElementById('avatarInput');
    const avatarImg = document.getElementById('avatarImg');
    const avatarPreview = document.getElementById('avatarPreview');
    const avatarError = document.getElementById('avatarError');
    const avatarPlaceholderText = document.getElementById('avatarPlaceholderText');
    let avatarUploaded = false;
    avatarPreview.addEventListener('click', function() {
      avatarInput.click();
    });
    avatarInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        if (!file.type.startsWith('image/')) {
          avatarError.textContent = 'Please upload a valid image file.';
          avatarError.style.display = 'block';
          avatarInput.value = '';
          avatarImg.style.display = 'none';
          avatarPlaceholderText.style.display = 'block';
          avatarUploaded = false;
          return;
        }
        const reader = new FileReader();
        reader.onload = function(evt) {
          avatarImg.src = evt.target.result;
          avatarImg.style.display = 'block';
          avatarPlaceholderText.style.display = 'none';
          avatarError.style.display = 'none';
          avatarUploaded = true;
        };
        reader.readAsDataURL(file);
      } else {
        avatarImg.style.display = 'none';
        avatarPlaceholderText.style.display = 'block';
        avatarUploaded = false;
      }
    });
    // Username validation
    const step1Form = document.getElementById('step1-form');
    const usernameInput = document.getElementById('username');
    const usernameError = document.getElementById('usernameError');
    const step2Form = document.getElementById('step2-form');
    const stepper1 = document.getElementById('stepper-1');
    const stepper2 = document.getElementById('stepper-2');

    step1Form.addEventListener('submit', function(e) {
      e.preventDefault();
      let valid = true;
      if (!usernameInput.value.trim()) {
        usernameError.style.display = 'block';
        usernameInput.focus();
        valid = false;
      } else {
        usernameError.style.display = 'none';
      }
      // Google user detection
      const isGoogleUser = auth.currentUser && auth.currentUser.providerData[0].providerId === 'google.com';
      const hasGooglePhoto = isGoogleUser && auth.currentUser.photoURL;
      if (!isGoogleUser) {
        if (!avatarUploaded) {
          avatarError.textContent = 'Please upload a profile image.';
          avatarError.style.display = 'block';
          valid = false;
        } else {
          avatarError.style.display = 'none';
        }
      } else {
        if (hasGooglePhoto) {
          avatarError.style.display = 'none';
        } else {
          avatarError.textContent = 'Google profile has no photo. Please add one to your Google account.';
          avatarError.style.display = 'block';
          valid = false;
        }
      }
      if (!valid) return;
      // Hide Step 1, show Step 2
      step1Form.style.display = 'none';
      step2Form.style.display = 'block';
      stepper1.classList.remove('active');
      stepper1.classList.add('done');
      stepper2.classList.add('active');
    });
    document.getElementById('step2-back').onclick = function() {
      step2Form.style.display = 'none';
      step1Form.style.display = 'block';
      stepper2.classList.remove('active');
      stepper1.classList.remove('done');
      stepper1.classList.add('active');
    };
    const step3Form = document.getElementById('step3-form');
    const stepper3real = document.querySelectorAll('.onboarding-step')[2];

    step2Form.addEventListener('submit', function(e) {
      e.preventDefault();
      // Hide Step 2, show Step 3
      step2Form.style.display = 'none';
      step3Form.style.display = 'block';
      stepper2.classList.remove('active');
      stepper2.classList.add('done');
      stepper3real.classList.add('active');
    });
    document.getElementById('step3-back').onclick = function() {
      step3Form.style.display = 'none';
      step2Form.style.display = 'block';
      stepper3real.classList.remove('active');
      stepper2.classList.remove('done');
      stepper2.classList.add('active');
    };
    // Step 2 card selection logic
    const discoveryCards = document.querySelectorAll('.discovery-card');
    const discoveryInput = document.getElementById('discoveryInput');
    let selectedDiscovery = [];
    const otherDiscoveryField = document.getElementById('otherDiscoveryField');
    const otherDiscoveryCard = Array.from(discoveryCards).find(card => card.getAttribute('data-value') === 'Other');
    function updateOtherField() {
      if (otherDiscoveryCard.classList.contains('selected')) {
        otherDiscoveryField.style.display = '';
      } else {
        otherDiscoveryField.style.display = 'none';
        document.getElementById('otherDiscoveryInput').value = '';
      }
    }
    discoveryCards.forEach(card => {
      card.addEventListener('click', function() {
        const value = this.getAttribute('data-value');
        if (this.classList.contains('selected')) {
          this.classList.remove('selected');
          selectedDiscovery = selectedDiscovery.filter(v => v !== value);
        } else {
          this.classList.add('selected');
          selectedDiscovery.push(value);
        }
        discoveryInput.value = selectedDiscovery.join(', ');
        updateOtherField();
      });
      card.addEventListener('keydown', function(e) {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          this.click();
        }
      });
    });
    // Step 3 card selection logic
    const interestCards = document.querySelectorAll('.interest-card');
    const interestsInput = document.getElementById('interestsInput');
    let selectedInterests = [];
    const otherInterestCard = document.getElementById('interestOtherCard');
    const otherInterestField = document.getElementById('otherInterestField');
    const otherInterestInput = document.getElementById('otherInterestInput');
    function updateOtherInterestField() {
      if (otherInterestCard.classList.contains('selected')) {
        otherInterestField.style.display = '';
      } else {
        otherInterestField.style.display = 'none';
        otherInterestInput.value = '';
      }
    }
    interestCards.forEach(card => {
      card.addEventListener('click', function() {
        const value = this.getAttribute('data-value');
        if (this.classList.contains('selected')) {
          this.classList.remove('selected');
          selectedInterests = selectedInterests.filter(v => v !== value);
        } else {
          this.classList.add('selected');
          selectedInterests.push(value);
        }
        interestsInput.value = selectedInterests.join(', ');
        updateOtherInterestField();
      });
      card.addEventListener('keydown', function(e) {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          this.click();
        }
      });
    });
    // Suggestions toggle
    const suggestionsToggle = document.getElementById('suggestionsToggle');
    const suggestionsLabel = document.getElementById('suggestionsLabel');

    step3Form.addEventListener('submit', function(e) {
      e.preventDefault();
      goToStep4();
    });
    suggestionsToggle.addEventListener('change', function() {
      if (this.checked) {
        suggestionsLabel.textContent = 'Yes';
      } else {
        suggestionsLabel.textContent = 'No';
      }
    });
    const step4Form = document.getElementById('step4-form');
    const reviewAvatarImg = document.getElementById('reviewAvatarImg');
    const reviewAvatarPlaceholder = document.getElementById('reviewAvatarPlaceholder');
    const reviewUsername = document.getElementById('reviewUsername');
    const reviewFullname = document.getElementById('reviewFullname');
    const reviewDiscovery = document.getElementById('reviewDiscovery');
    const reviewDiscoveryOther = document.getElementById('reviewDiscoveryOther');
    const reviewReason = document.getElementById('reviewReason');
    const reviewInterests = document.getElementById('reviewInterests');
    const reviewInterestsOther = document.getElementById('reviewInterestsOther');
    const reviewContentTypes = document.getElementById('reviewContentTypes');
    const reviewSuggestions = document.getElementById('reviewSuggestions');
    const onboardingPopup = document.getElementById('onboardingPopup');
    const confirmBtn = document.getElementById('confirmBtn');
    const confirmBtnText = document.getElementById('confirmBtnText');
    const confirmPreloader = document.getElementById('confirmPreloader');
    const onboardingPopupMsg = document.getElementById('onboardingPopupMsg');
    const onboardingPopupBtn = document.getElementById('onboardingPopupBtn');

    function showOnboardingPopup(msg, step, onGoToStep) {
      onboardingPopupMsg.textContent = msg;
      if (step && typeof onGoToStep === 'function') {
        onboardingPopupBtn.textContent = `Go to Step ${step}`;
        onboardingPopupBtn.style.display = 'inline-block';
        onboardingPopupBtn.onclick = function() {
          onboardingPopup.style.display = 'none';
          onGoToStep();
        };
      } else {
        onboardingPopupBtn.style.display = 'none';
        onboardingPopupBtn.onclick = null;
      }
      onboardingPopup.style.display = 'block';
      setTimeout(() => { onboardingPopup.style.display = 'none'; }, 6000);
    }

    function goToStep4() {
      // Populate review fields
      if (avatarImg.src && avatarImg.style.display !== 'none') {
        reviewAvatarImg.src = avatarImg.src;
        reviewAvatarImg.style.display = 'block';
        reviewAvatarPlaceholder.style.display = 'none';
      } else {
        reviewAvatarImg.style.display = 'none';
        reviewAvatarPlaceholder.style.display = 'block';
      }
      reviewUsername.textContent = '@' + (usernameInput.value || 'username');
      reviewFullname.textContent = fullname.value || '?';
      reviewDiscovery.textContent = discoveryInput.value || '-';
      if (typeof otherDiscoveryCard !== 'undefined' && otherDiscoveryCard.classList.contains('selected')) {
        reviewDiscoveryOther.textContent = otherDiscoveryInput.value ? ' (' + otherDiscoveryInput.value + ')' : '';
      } else {
        reviewDiscoveryOther.textContent = '';
      }
      reviewReason.textContent = signupReason.value || '?';
      reviewInterests.textContent = interestsInput.value || '?';
      if (typeof otherInterestCard !== 'undefined' && otherInterestCard.classList.contains('selected')) {
        reviewInterestsOther.textContent = otherInterestInput.value ? ' (' + otherInterestInput.value + ')' : '';
      } else {
        reviewInterestsOther.textContent = '';
      }
      reviewContentTypes.textContent = contentTypes.value || '?';
      reviewSuggestions.textContent = suggestionsToggle.checked ? 'Yes' : 'No';

      step3Form.style.display = 'none';
      step4Form.style.display = 'block';
      // Progress indicator (optional)
      const stepperSteps = document.querySelectorAll('.onboarding-step');
      stepperSteps[2].classList.remove('active');
      stepperSteps[2].classList.add('done');
      stepperSteps[3].classList.add('active');
    }

    step4Form.addEventListener('submit', async function(e) {
      e.preventDefault();
      // Validate required fields
      if (!avatarImg.src || avatarImg.style.display === 'none') {
        showOnboardingPopup('Please upload a profile image.', 1, function() {
          step4Form.style.display = 'none';
          step1Form.style.display = 'block';
          stepper1.classList.add('active');
          stepper1.classList.remove('done');
          stepper2.classList.remove('active');
          avatarPreview.focus();
        });
        return;
      }
      if (!usernameInput.value.trim()) {
        showOnboardingPopup('Username is required.', 1, function() {
          step4Form.style.display = 'none';
          step1Form.style.display = 'block';
          stepper1.classList.add('active');
          stepper1.classList.remove('done');
          stepper2.classList.remove('active');
          usernameInput.focus();
        });
        return;
      }
      if (!discoveryInput.value.trim()) {
        showOnboardingPopup('Please select how you heard about Lumix.', 2, function() {
          step4Form.style.display = 'none';
          step2Form.style.display = 'block';
          stepper2.classList.add('active');
          stepper2.classList.remove('done');
          stepper1.classList.remove('active');
          document.querySelector('.discovery-card').focus();
        });
        return;
      }
      if (typeof otherDiscoveryCard !== 'undefined' && otherDiscoveryCard.classList.contains('selected') && !otherDiscoveryInput.value.trim()) {
        showOnboardingPopup('Please specify how you heard about Lumix.', 2, function() {
          step4Form.style.display = 'none';
          step2Form.style.display = 'block';
          stepper2.classList.add('active');
          stepper2.classList.remove('done');
          stepper1.classList.remove('active');
          otherDiscoveryInput.focus();
        });
        return;
      }
      if (!signupReason.value.trim()) {
        showOnboardingPopup('Please tell us what made you sign up.', 2, function() {
          step4Form.style.display = 'none';
          step2Form.style.display = 'block';
          stepper2.classList.add('active');
          stepper2.classList.remove('done');
          stepper1.classList.remove('active');
          signupReason.focus();
        });
        return;
      }
      if (!interestsInput.value.trim()) {
        showOnboardingPopup('Please select at least one interest.', 3, function() {
          step4Form.style.display = 'none';
          step3Form.style.display = 'block';
          stepper3real.classList.add('active');
          stepper3real.classList.remove('done');
          stepper2.classList.remove('active');
          document.querySelector('.interest-card').focus();
        });
        return;
      }
      if (typeof otherInterestCard !== 'undefined' && otherInterestCard.classList.contains('selected') && !otherInterestInput.value.trim()) {
        showOnboardingPopup('Please specify your interest.', 3, function() {
          step4Form.style.display = 'none';
          step3Form.style.display = 'block';
          stepper3real.classList.add('active');
          stepper3real.classList.remove('done');
          stepper2.classList.remove('active');
          otherInterestInput.focus();
        });
        return;
      }
      // Show preloader
      confirmBtn.disabled = true;
      confirmBtnText.style.display = 'none';
      confirmPreloader.style.display = 'inline-block';
      try {
        const user = auth.currentUser;
        if (!user) throw new Error('Not authenticated. Please sign in again.');
        // Prepare profile data
        const profileData = {
          username: usernameInput.value.trim(),
          fullname: fullname.value.trim(),
          avatar: avatarImg.src,
          discovery: discoveryInput.value,
          discoveryOther: otherDiscoveryInput ? otherDiscoveryInput.value : '',
          reason: signupReason.value,
          interests: interestsInput.value,
          interestsOther: otherInterestInput ? otherInterestInput.value : '',
          contentTypes: contentTypes.value,
          suggestions: suggestionsToggle.checked,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        await db.collection('users').doc(user.uid).set(profileData, { merge: true });
        showOnboardingPopup('🎉Congratulations🎉');
        setTimeout(() => {
          const user = auth.currentUser;
          if (user) {
            window.location.href = `app.lumix.html`;
          } else {
            window.location.href = 'app.lumix.html';
          }
        }, 1800);
      } catch (err) {
        showOnboardingPopup('Failed to save profile: ' + err.message);
      } finally {
        confirmBtn.disabled = false;
        confirmBtnText.style.display = 'inline';
        confirmPreloader.style.display = 'none';
      }
    });
    // Google profile detection and onboarding avatar logic
    window.addEventListener('DOMContentLoaded', function() {
      auth.onAuthStateChanged(function(user) {
        if (user && user.providerData && user.providerData[0].providerId === 'google.com') {
          // Set avatar to Google photoURL
          if (user.photoURL) {
            avatarImg.src = user.photoURL;
            avatarImg.style.display = 'block';
            avatarPlaceholderText.style.display = 'none';
          }
          // Disable upload
          avatarPreview.style.pointerEvents = 'none';
          avatarPreview.style.opacity = '0.7';
          document.getElementById('avatarInput').disabled = true;
          // Show info message
          let googleMsg = document.getElementById('googleProfileMsg');
          if (!googleMsg) {
            googleMsg = document.createElement('div');
            googleMsg.id = 'googleProfileMsg';
            googleMsg.style.color = '#7b5cff';
            googleMsg.style.fontWeight = '500';
            googleMsg.style.marginTop = '0.5rem';
            googleMsg.style.textAlign = 'center';
            googleMsg.textContent = 'Your Google profile picture will be used!.';
            avatarPreview.parentNode.appendChild(googleMsg);
          }
        } else {
          // Enable upload for non-Google users
          avatarPreview.style.pointerEvents = '';
          avatarPreview.style.opacity = '1';
          document.getElementById('avatarInput').disabled = false;
          const googleMsg = document.getElementById('googleProfileMsg');
          if (googleMsg) googleMsg.remove();
        }
      });
    });
