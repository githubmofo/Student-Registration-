const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('.btnLogin-popup');
const iconClose = document.querySelector('.icon-close');

// Popup toggles
registerLink?.addEventListener('click', () => {
    wrapper.classList.add('active');
});

loginLink?.addEventListener('click', () => {
    wrapper.classList.remove('active');
});

btnPopup?.addEventListener('click', () => {
    wrapper.classList.add('active-popup');
    wrapper.style.display = 'flex';
});

iconClose?.addEventListener('click', () => {
    wrapper.classList.remove('active-popup');
    wrapper.style.display = 'none';
});

// Handle section switching
function showSection(id) {
    wrapper.style.display = 'none';
    document.getElementById('upload-section').style.display = 'none';
    document.getElementById('profile-section').style.display = 'none';

    const target = document.getElementById(id);
    if (target) {
        target.style.display = 'flex';
    }
}

// Nav click events
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href').replace('#', '');
        if (targetId === 'upload-section' || targetId === 'profile-section') {
            e.preventDefault();
            showSection(targetId);
        }
    });
});

// File name preview
document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.querySelector('input[type="file"]');
    const fileContainer = document.querySelector('.file-input-container');

    if (fileInput && fileContainer) {
        fileInput.addEventListener('change', function() {
            if (this.files.length > 0) {
                const fileName = this.files[0].name;
                fileContainer.classList.add('has-file');
                fileContainer.setAttribute('data-filename', fileName);
            } else {
                fileContainer.classList.remove('has-file');
                fileContainer.removeAttribute('data-filename');
            }
        });
    }

    // Back to Login from Upload
    const backToLoginUpload = document.getElementById('back-to-login-upload');
    backToLoginUpload?.addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('upload-section').style.display = 'none';
        wrapper.style.display = 'flex';
        wrapper.classList.add('active-popup');
    });

    // Back to Login from Edit Profile
    const backToLogin = document.getElementById('back-to-login-link');
    backToLogin?.addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('profile-section').style.display = 'none';
        wrapper.style.display = 'flex';
        wrapper.classList.add('active-popup');
    });

    // Close buttons
    document.querySelector('.icon-close-upload')?.addEventListener('click', function() {
        document.getElementById('upload-section').style.display = 'none';
    });

    document.querySelector('.icon-close-edit')?.addEventListener('click', function() {
        document.getElementById('profile-section').style.display = 'none';
    });



    // --- FIREBASE AUTHENTICATION ---
    
        // Show message function
    function showMessage(message, isError = false) {
        const messageContainer = document.getElementById('message-container');
        messageContainer.textContent = message;
        messageContainer.style.backgroundColor = isError ? '#ff4444' : '#4CAF50';
        messageContainer.style.display = 'block';
        
        setTimeout(() => {
            messageContainer.style.display = 'none';
        }, 3000);
    }
    const loginForm = document.getElementById('loginForm');
    loginForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                showMessage('Login successful!');
                wrapper.classList.remove('active-popup');
                wrapper.style.display = 'none';
                updateUIForLoggedInUser(userCredential.user);
            })
            .catch((error) => {
                showMessage(error.message, true);
            });
    });

    // Handle Registration Form
    const registerForm = document.getElementById('registerForm');
    registerForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const username = document.getElementById('registerUsername').value;
        
        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Update user profile with username
                return userCredential.user.updateProfile({
                    displayName: username
                });
            })
            .then(() => {
                showMessage('Registration successful! You can now log in.');
                wrapper.classList.remove('active');
                registerForm.reset();
            })
            .catch((error) => {
                showMessage(error.message, true);
            });
    });

    // Handle User Menu Banner
    const userBanner = document.querySelector('.user-banner');
    const userDropdown = document.querySelector('.user-dropdown');
    const userMenuBanner = document.querySelector('.user-menu-banner');

    // Toggle dropdown on banner click
    userBanner?.addEventListener('click', function(e) {
        e.stopPropagation();
        const isVisible = userDropdown.style.display === 'block';
        userDropdown.style.display = isVisible ? 'none' : 'block';
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!userMenuBanner?.contains(e.target)) {
            userDropdown.style.display = 'none';
        }
    });

    // Handle dropdown item clicks
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            const action = this.getAttribute('data-action');
            
            if (action === 'view-documents') {
                const user = auth.currentUser;
                if (user) {
                    showSection('documents-section');
                    loadUserDocuments(user.uid);
                }
            } else if (action === 'sign-out') {
                auth.signOut()
                    .then(() => {
                        showMessage('Signed out successfully!');
                        updateUIForLoggedOutUser();
                    })
                    .catch((error) => {
                        showMessage(error.message, true);
                    });
            }
            
            userDropdown.style.display = 'none';
        });
    });

    // Update UI for logged in user
    function updateUIForLoggedInUser(user) {
        const loginBtn = document.querySelector('.btnLogin-popup');
        const userMenuBanner = document.querySelector('.user-menu-banner');
        const username = document.querySelector('.username');
        const userAvatar = document.querySelector('.user-avatar');
        
        if (loginBtn) loginBtn.style.display = 'none';
        if (userMenuBanner) userMenuBanner.style.display = 'flex';
        
        // Update username and avatar
        if (username) {
            username.textContent = user.displayName || user.email.split('@')[0] || 'User';
        }
        if (userAvatar) {
            userAvatar.textContent = (user.displayName || user.email.split('@')[0] || 'U').charAt(0).toUpperCase();
        }
        
        // Update profile section with user info
        const profileUsername = document.querySelector('#editUsername');
        const profileEmail = document.querySelector('#editEmail');
        
        if (profileUsername) profileUsername.value = user.displayName || '';
        if (profileEmail) profileEmail.value = user.email || '';
    }

    // Update UI for logged out user
    function updateUIForLoggedOutUser() {
        const loginBtn = document.querySelector('.btnLogin-popup');
        const userMenuBanner = document.querySelector('.user-menu-banner');
        const userDropdown = document.querySelector('.user-dropdown');
        
        if (loginBtn) loginBtn.style.display = 'block';
        if (userMenuBanner) userMenuBanner.style.display = 'none';
        if (userDropdown) userDropdown.style.display = 'none';
        
        // Clear forms
        loginForm?.reset();
        registerForm?.reset();
    }

    // Check authentication state on page load
    auth.onAuthStateChanged((user) => {
        if (user) {
            updateUIForLoggedInUser(user);
            loadUserDocuments(user.uid);
        } else {
            updateUIForLoggedOutUser();
        }
    });

    // --- FIREBASE REALTIME DATABASE FOR DOCUMENTS ---
    
    // Handle Upload Form
    const uploadForm = document.getElementById('uploadForm');
    uploadForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fileInput = document.getElementById('fileInput');
        const documentTitle = document.getElementById('documentTitle').value;
        const uploadBtn = document.getElementById('uploadBtn');
        
        if (!fileInput.files[0]) {
            showMessage('Please select a file to upload', true);
            return;
        }
        
        const file = fileInput.files[0];
        const user = auth.currentUser;
        
        if (!user) {
            showMessage('Please log in to upload documents', true);
            return;
        }
        
        // Disable upload button and show loading
        uploadBtn.disabled = true;
        uploadBtn.textContent = 'Uploading...';
        
        // Convert file to base64 for storage
        const reader = new FileReader();
        reader.onload = function(e) {
            const fileData = e.target.result;
            
            // Create document object
            const documentData = {
                title: documentTitle,
                description: '', // Empty description since field was removed
                fileName: file.name,
                fileType: file.type,
                fileSize: file.size,
                fileData: fileData,
                uploadedBy: user.uid,
                uploadedByEmail: user.email,
                uploadedByUsername: user.displayName || 'Anonymous',
                uploadDate: new Date().toISOString(),
                lastModified: new Date().toISOString()
            };
            
            // Save to Firebase Realtime Database
            const userDocumentsRef = database.ref(`users/${user.uid}/documents`);
            const newDocumentRef = userDocumentsRef.push();
            
            newDocumentRef.set(documentData)
                .then(() => {
                    showMessage('Document uploaded successfully!');
                    uploadForm.reset();
                    loadUserDocuments(user.uid);
                })
                .catch((error) => {
                    showMessage('Error uploading document: ' + error.message, true);
                })
                .finally(() => {
                    uploadBtn.disabled = false;
                    uploadBtn.textContent = 'Upload';
                });
        };
        
        reader.readAsDataURL(file);
    });

    // Load user documents
    function loadUserDocuments(userId) {
        const documentsList = document.getElementById('documents-list');
        if (!documentsList) return;
        
        const userDocumentsRef = database.ref(`users/${userId}/documents`);
        
        userDocumentsRef.once('value')
            .then((snapshot) => {
                documentsList.innerHTML = '';
                
                if (!snapshot.exists()) {
                    documentsList.innerHTML = '<p style="text-align: center; color: #666;">No documents uploaded yet.</p>';
                    return;
                }
                
                        snapshot.forEach((childSnapshot) => {
            const docData = childSnapshot.val();
            const documentId = childSnapshot.key;
            
            const documentCard = createDocumentCard(docData, documentId);
            documentsList.appendChild(documentCard);
        });
            })
            .catch((error) => {
                showMessage('Error loading documents: ' + error.message, true);
            });
    }

    // Create document card
    function createDocumentCard(docData, documentId) {
        const card = document.createElement('div');
        card.style.cssText = `
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            background: #f9f9f9;
            position: relative;
        `;
        
        const fileIcon = getFileIcon(docData.fileType);
        const fileSize = formatFileSize(docData.fileSize);
        
        card.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <span style="font-size: 24px; margin-right: 10px;">${fileIcon}</span>
                <div style="flex: 1;">
                    <h4 style="margin: 0; color: #162938;">${docData.title}</h4>
                    <p style="margin: 5px 0; color: #666; font-size: 14px;">${docData.fileName}</p>
                </div>
                <button onclick="deleteDocument('${documentId}')" style="background: #ff4444; color: white; border: none; border-radius: 4px; padding: 5px 10px; cursor: pointer; font-size: 12px;">Delete</button>
            </div>
            ${docData.description ? `<p style="margin: 10px 0; color: #333;">${docData.description}</p>` : ''}
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #666;">
                <span>Size: ${fileSize}</span>
                <span>Uploaded: ${new Date(docData.uploadDate).toLocaleDateString()}</span>
            </div>
            <button onclick="downloadDocument('${documentId}')" style="background: #471396; color: white; border: none; border-radius: 4px; padding: 8px 16px; cursor: pointer; margin-top: 10px; width: 100%;">Download</button>
        `;
        
        return card;
    }

    // Get file icon based on type
    function getFileIcon(fileType) {
        if (fileType.startsWith('image/')) return '🖼️';
        if (fileType.includes('pdf')) return '📄';
        if (fileType.includes('doc')) return '📝';
        if (fileType.includes('txt')) return '📄';
        return '📁';
    }

    // Format file size
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Delete document function (global scope)
    window.deleteDocument = function(documentId) {
        const user = auth.currentUser;
        if (!user) return;
        
        if (confirm('Are you sure you want to delete this document?')) {
            const documentRef = database.ref(`users/${user.uid}/documents/${documentId}`);
            
            documentRef.remove()
                .then(() => {
                    showMessage('Document deleted successfully!');
                    loadUserDocuments(user.uid);
                })
                .catch((error) => {
                    showMessage('Error deleting document: ' + error.message, true);
                });
        }
    };

    // Download document function (global scope)
    window.downloadDocument = function(documentId) {
        const user = auth.currentUser;
        if (!user) return;
        
        const documentRef = database.ref(`users/${user.uid}/documents/${documentId}`);
        
        documentRef.once('value')
            .then((snapshot) => {
                const docData = snapshot.val();
                if (!docData) return;
                
                // Create download link
                const link = document.createElement('a');
                link.href = docData.fileData;
                link.download = docData.fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch((error) => {
                showMessage('Error downloading document: ' + error.message, true);
            });
    };

    // Handle documents section navigation
    document.querySelector('.nav-documents')?.addEventListener('click', function(e) {
        e.preventDefault();
        const user = auth.currentUser;
        if (!user) {
            showMessage('Please log in to view documents', true);
            return;
        }
        
        showSection('documents-section');
        loadUserDocuments(user.uid);
    });

    // Close documents section
    document.querySelector('.icon-close-docs')?.addEventListener('click', function() {
        document.getElementById('documents-section').style.display = 'none';
    });

    // Update showSection function to handle documents section
    const originalShowSection = showSection;
    showSection = function(id) {
        wrapper.style.display = 'none';
        document.getElementById('upload-section').style.display = 'none';
        document.getElementById('profile-section').style.display = 'none';
        document.getElementById('documents-section').style.display = 'none';

        const target = document.getElementById(id);
        if (target) {
            target.style.display = 'flex';
        }
    };

    // --- EDIT PROFILE FUNCTIONALITY ---
    
    // Handle Edit Profile Form
    const editProfileForm = document.getElementById('editProfileForm');
    editProfileForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newUsername = document.getElementById('editUsername').value.trim();
        const newPassword = document.getElementById('editPassword').value;
        const saveBtn = document.getElementById('saveProfileBtn');
        const user = auth.currentUser;
        
        if (!user) {
            showMessage('Please log in to edit profile', true);
            return;
        }
        
        if (!newUsername) {
            showMessage('Username cannot be empty', true);
            return;
        }
        
        // Disable save button and show loading
        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving...';
        
        // Array to track all update promises
        const updatePromises = [];
        
        // Update display name (username)
        if (newUsername !== user.displayName) {
            updatePromises.push(
                user.updateProfile({
                    displayName: newUsername
                })
            );
        }
        
        // Update password if provided
        if (newPassword && newPassword.length >= 6) {
            updatePromises.push(
                user.updatePassword(newPassword)
            );
        } else if (newPassword && newPassword.length < 6) {
            showMessage('Password must be at least 6 characters long', true);
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save Changes';
            return;
        }
        
        // Execute all updates
        Promise.all(updatePromises)
            .then(() => {
                showMessage('Profile updated successfully!');
                
                // Update UI elements with new username
                updateUIForLoggedInUser(user);
                
                // Clear password field
                document.getElementById('editPassword').value = '';
            })
            .catch((error) => {
                let errorMessage = 'Error updating profile: ';
                
                // Handle specific Firebase auth errors
                switch (error.code) {
                    case 'auth/requires-recent-login':
                        errorMessage += 'Please log out and log in again to change your password.';
                        break;
                    case 'auth/weak-password':
                        errorMessage += 'Password is too weak.';
                        break;
                    case 'auth/operation-not-allowed':
                        errorMessage += 'Operation not allowed.';
                        break;
                    default:
                        errorMessage += error.message;
                }
                
                showMessage(errorMessage, true);
            })
            .finally(() => {
                saveBtn.disabled = false;
                saveBtn.textContent = 'Save Changes';
            });
    });

});
