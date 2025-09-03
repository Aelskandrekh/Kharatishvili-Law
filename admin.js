// Admin Console JavaScript
class AdminConsole {
    constructor() {
        this.currentUser = null;
        this.articles = this.loadArticles();
        this.currentEditingId = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthStatus();
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Navigation tabs
        const articlesTab = document.getElementById('articlesTab');
        const settingsTab = document.getElementById('settingsTab');
        
        if (articlesTab) {
            articlesTab.addEventListener('click', (e) => {
                e.preventDefault();
                this.showPanel('articles');
            });
        }
        
        if (settingsTab) {
            settingsTab.addEventListener('click', (e) => {
                e.preventDefault();
                this.showPanel('settings');
            });
        }

        // Article management
        const newArticleBtn = document.getElementById('newArticleBtn');
        if (newArticleBtn) {
            newArticleBtn.addEventListener('click', () => this.showEditor());
        }

        const cancelEdit = document.getElementById('cancelEdit');
        if (cancelEdit) {
            cancelEdit.addEventListener('click', () => this.showPanel('articles'));
        }

        const saveArticle = document.getElementById('saveArticle');
        if (saveArticle) {
            saveArticle.addEventListener('click', () => this.saveArticle());
        }

        // Editor toolbar
        const editorBtns = document.querySelectorAll('.editor-btn');
        editorBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const command = btn.dataset.command;
                const value = btn.dataset.value;
                this.handleEditorCommand(command, value);
            });
        });

        // Update font controls when selection changes
        const editor = document.getElementById('articleContent');
        if (editor) {
            editor.addEventListener('mouseup', () => this.updateFontControls());
            editor.addEventListener('keyup', () => this.updateFontControls());
        }

        // Font controls
        const fontFamily = document.getElementById('fontFamily');
        const fontSize = document.getElementById('fontSize');
        
        if (fontFamily) {
            fontFamily.addEventListener('change', () => {
                this.applyFontStyle('fontName', fontFamily.value);
            });
        }
        
        if (fontSize) {
            fontSize.addEventListener('change', () => {
                this.applyFontSize(fontSize.value + 'px');
            });
        }

        // Settings
        const exportData = document.getElementById('exportData');
        if (exportData) {
            exportData.addEventListener('click', () => this.exportArticles());
        }

        const importData = document.getElementById('importData');
        if (importData) {
            importData.addEventListener('click', () => {
                document.getElementById('importFile').click();
            });
        }

        const importFile = document.getElementById('importFile');
        if (importFile) {
            importFile.addEventListener('change', (e) => this.importArticles(e));
        }

        const clearData = document.getElementById('clearData');
        if (clearData) {
            clearData.addEventListener('click', () => this.clearAllData());
        }

        // Auto-Publishing Settings
        const setupAutoPublish = document.getElementById('setupAutoPublish');
        if (setupAutoPublish) {
            setupAutoPublish.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Setup auto-publish button clicked');
                try {
                    this.showGitHubSetupInstructions();
                } catch (error) {
                    console.error('Error showing GitHub setup:', error);
                    alert('Error opening setup. Please refresh the page and try again.');
                }
            });
        } else {
            console.warn('Setup auto-publish button not found');
        }

        const testPublish = document.getElementById('testPublish');
        if (testPublish) {
            testPublish.addEventListener('click', () => this.testGitHubConnection());
        }

        const removeToken = document.getElementById('removeToken');
        if (removeToken) {
            removeToken.addEventListener('click', () => this.removeGitHubToken());
        }
    }

    // Authentication
    handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Simple authentication
        if (username === 'admin' && password === 'kharatishvili2025') {
            this.currentUser = { username };
            localStorage.setItem('adminSession', JSON.stringify({
                user: this.currentUser,
                timestamp: Date.now()
            }));
            this.showDashboard();
        } else {
            this.showError('Invalid username or password');
        }
    }

    handleLogout() {
        this.currentUser = null;
        localStorage.removeItem('adminSession');
        this.showLogin();
    }

    checkAuthStatus() {
        const session = localStorage.getItem('adminSession');
        if (session) {
            try {
                const sessionData = JSON.parse(session);
                const isValid = (Date.now() - sessionData.timestamp) < (24 * 60 * 60 * 1000);
                
                if (isValid) {
                    this.currentUser = sessionData.user;
                    this.showDashboard();
                    return;
                } else {
                    localStorage.removeItem('adminSession');
                }
            } catch (error) {
                localStorage.removeItem('adminSession');
            }
        }
        this.showLogin();
    }

    showLogin() {
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('adminDashboard').style.display = 'none';
        
        // Clear any error messages
        const errorEl = document.getElementById('loginError');
        if (errorEl) errorEl.textContent = '';
        
        // Clear form fields
        const usernameEl = document.getElementById('username');
        const passwordEl = document.getElementById('password');
        if (usernameEl) usernameEl.value = '';
        if (passwordEl) passwordEl.value = '';
    }

    showDashboard() {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'block';
        this.loadArticlesList();
        this.updateAutoPublishStatus();
        this.showPanel('articles');
    }

    showError(message) {
        const errorElement = document.getElementById('loginError');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            
            setTimeout(() => {
                errorElement.style.display = 'none';
            }, 5000);
        }
    }

    // Panel Navigation
    showPanel(panelName) {
        // Hide all panels
        document.querySelectorAll('.content-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        
        // Remove active from nav links
        document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Show selected panel
        if (panelName === 'articles') {
            document.getElementById('articlesPanel').classList.add('active');
            document.getElementById('articlesTab').classList.add('active');
            this.loadArticlesList();
        } else if (panelName === 'settings') {
            document.getElementById('settingsPanel').classList.add('active');
            document.getElementById('settingsTab').classList.add('active');
        }
    }

    // Article Management
    loadArticles() {
        const stored = localStorage.getItem('kharatishviliLawArticles');
        return stored ? JSON.parse(stored) : [];
    }

    saveArticles() {
        try {
            localStorage.setItem('kharatishviliLawArticles', JSON.stringify(this.articles));
            console.log('Articles saved successfully:', this.articles.length, 'articles');
        } catch (error) {
            console.error('Error saving articles:', error);
        }
    }

    loadArticlesList() {
        const container = document.getElementById('articlesList');
        
        if (this.articles.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>No Articles Yet</h3>
                    <p>Click "New Article" to create your first news article.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.articles.map(article => {
            const practiceInfo = this.getPracticeAreaInfo(article.practiceArea);
            return `
                <div class="article-item">
                    <div class="article-info">
                        <div class="article-header-row">
                            <h4>${article.title}</h4>
                            ${article.practiceArea ? `<span class="practice-badge" style="background-color: ${practiceInfo.bgColor}; color: ${practiceInfo.color}; border: 1px solid ${practiceInfo.color};">${practiceInfo.label}</span>` : ''}
                        </div>
                        <div class="article-meta">
                            ${this.formatDate(article.date)} 
                            <span class="status-badge ${article.status}">${article.status}</span>
                        </div>
                        <p class="article-summary">${article.summary}</p>
                    </div>
                    <div class="article-actions">
                        <button class="btn btn-small btn-outline" onclick="admin.editArticle('${article.id}')">Edit</button>
                        <button class="btn btn-small btn-danger" onclick="admin.deleteArticle('${article.id}')">Delete</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    showEditor(articleId = null) {
        this.currentEditingId = articleId;
        
        // Hide articles panel, show editor
        document.getElementById('articlesPanel').classList.remove('active');
        document.getElementById('editorPanel').classList.add('active');
        
        if (articleId) {
            const article = this.articles.find(a => a.id === articleId);
            if (article) {
                document.getElementById('editorTitle').textContent = 'Edit Article';
                document.getElementById('articleTitle').value = article.title;
                document.getElementById('articleDate').value = article.date;
                document.getElementById('articleSummary').value = article.summary;
                document.getElementById('articleContent').innerHTML = article.content;
                document.getElementById('articleStatus').value = article.status;
                document.getElementById('practiceArea').value = article.practiceArea || '';
            }
        } else {
            document.getElementById('editorTitle').textContent = 'New Article';
            document.getElementById('articleTitle').value = '';
            document.getElementById('articleDate').value = this.formatDateForInput(new Date());
            document.getElementById('articleSummary').value = '';
            document.getElementById('articleContent').innerHTML = '';
            document.getElementById('articleStatus').value = 'draft';
            document.getElementById('practiceArea').value = '';
        }
    }

    saveArticle() {
        try {
            const title = document.getElementById('articleTitle').value.trim();
            const date = document.getElementById('articleDate').value;
            const summary = document.getElementById('articleSummary').value.trim();
            const content = document.getElementById('articleContent').innerHTML;
            const status = document.getElementById('articleStatus').value;
            const practiceArea = document.getElementById('practiceArea').value;

            console.log('Saving article:', { title, date, summary, status, practiceArea });

            if (!title || !date || !summary || !practiceArea) {
                alert('Please fill in all required fields including practice area');
                return;
            }

            const article = {
                id: this.currentEditingId || this.generateId(),
                title,
                date,
                summary,
                content,
                status,
                practiceArea,
                createdAt: this.currentEditingId ? 
                    this.articles.find(a => a.id === this.currentEditingId)?.createdAt || new Date().toISOString() : 
                    new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            if (this.currentEditingId) {
                // Update existing article
                const index = this.articles.findIndex(a => a.id === this.currentEditingId);
                if (index !== -1) {
                    this.articles[index] = article;
                }
            } else {
                // Add new article
                this.articles.unshift(article);
            }

            this.saveArticles();
            console.log('Articles saved to localStorage:', this.articles);
            this.showSuccessMessage('Article saved successfully');
            this.showPanel('articles');
            
            // Update the main website
            this.updateMainWebsite();
        } catch (error) {
            console.error('Error saving article:', error);
            alert('Error saving article: ' + error.message);
        }
    }

    editArticle(id) {
        this.showEditor(id);
    }

    deleteArticle(id) {
        if (confirm('Are you sure you want to delete this article?')) {
            this.articles = this.articles.filter(a => a.id !== id);
            this.saveArticles();
            this.loadArticlesList();
            this.updateMainWebsite();
            this.showSuccessMessage('Article deleted successfully');
        }
    }

    // Editor Functions
    handleEditorCommand(command, value = null) {
        const editor = document.getElementById('articleContent');
        editor.focus();

        if (command === 'createLink') {
            const url = prompt('Enter the URL:');
            if (url) {
                document.execCommand(command, false, url);
            }
        } else if (command === 'insertVideo') {
            this.insertVideo();
        } else if (command === 'insertImage') {
            this.insertImage();
        } else if (command === 'formatBlock') {
            // Handle heading formatting
            document.execCommand(command, false, `<${value}>`);
        } else {
            document.execCommand(command, false, value);
        }
    }

    applyFontStyle(command, value) {
        const editor = document.getElementById('articleContent');
        editor.focus();
        
        const selection = window.getSelection();
        
        if (selection.rangeCount > 0 && !selection.isCollapsed) {
            // Apply font family using execCommand which works better for font names
            if (command === 'fontName') {
                document.execCommand('fontName', false, value);
            }
        } else {
            // Apply to entire editor for future text
            if (command === 'fontName') {
                editor.style.fontFamily = value;
            }
        }
    }

    updateFontControls() {
        const selection = window.getSelection();
        const fontSizeSelect = document.getElementById('fontSize');
        const fontFamilySelect = document.getElementById('fontFamily');
        
        if (selection.rangeCount > 0 && !selection.isCollapsed) {
            // Get the first element in selection
            const range = selection.getRangeAt(0);
            let element = range.commonAncestorContainer;
            
            // If it's a text node, get the parent element
            if (element.nodeType === Node.TEXT_NODE) {
                element = element.parentElement;
            }
            
            // Get computed style
            const computedStyle = window.getComputedStyle(element);
            const currentFontSize = parseInt(computedStyle.fontSize);
            const currentFontFamily = computedStyle.fontFamily;
            
            // Update font size dropdown
            if (fontSizeSelect) {
                // Find closest match or add current size if not in list
                const sizeExists = Array.from(fontSizeSelect.options).some(option => 
                    parseInt(option.value) === currentFontSize
                );
                
                if (sizeExists) {
                    fontSizeSelect.value = currentFontSize.toString();
                } else {
                    // Add current size to dropdown temporarily
                    const option = document.createElement('option');
                    option.value = currentFontSize.toString();
                    option.textContent = currentFontSize.toString();
                    option.selected = true;
                    fontSizeSelect.appendChild(option);
                    
                    // Sort options numerically
                    const options = Array.from(fontSizeSelect.options);
                    options.sort((a, b) => parseInt(a.value) - parseInt(b.value));
                    fontSizeSelect.innerHTML = '';
                    options.forEach(opt => fontSizeSelect.appendChild(opt));
                }
            }
            
            // Update font family dropdown
            if (fontFamilySelect) {
                // Try to match font family
                const fontFamilies = currentFontFamily.split(',').map(f => f.trim().replace(/['"]/g, ''));
                
                for (const font of fontFamilies) {
                    const option = Array.from(fontFamilySelect.options).find(opt => 
                        opt.value.toLowerCase() === font.toLowerCase()
                    );
                    if (option) {
                        fontFamilySelect.value = option.value;
                        break;
                    }
                }
            }
        }
    }

    applyFontSize(size) {
        const editor = document.getElementById('articleContent');
        editor.focus();
        
        const selection = window.getSelection();
        
        if (selection.rangeCount > 0 && !selection.isCollapsed) {
            // Get all elements in the selection
            const range = selection.getRangeAt(0);
            const container = document.createElement('div');
            container.appendChild(range.cloneContents());
            
            // Find all text nodes and elements in the selection
            const walker = document.createTreeWalker(
                container,
                NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
                null,
                false
            );
            
            const nodesToStyle = [];
            let node;
            while (node = walker.nextNode()) {
                if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                    nodesToStyle.push(node);
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    nodesToStyle.push(node);
                }
            }
            
            // Apply font size using CSS custom approach
            const fragment = document.createDocumentFragment();
            const wrapper = document.createElement('span');
            wrapper.style.fontSize = size;
            wrapper.style.lineHeight = 'inherit';
            
            // Process the content while preserving structure
            const processNode = (node) => {
                if (node.nodeType === Node.TEXT_NODE) {
                    const span = document.createElement('span');
                    span.style.fontSize = size;
                    span.style.lineHeight = 'inherit';
                    span.textContent = node.textContent;
                    return span;
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    const clone = node.cloneNode(false);
                    clone.style.fontSize = size;
                    clone.style.lineHeight = 'inherit';
                    
                    // Process child nodes
                    Array.from(node.childNodes).forEach(child => {
                        clone.appendChild(processNode(child));
                    });
                    return clone;
                }
                return node.cloneNode(true);
            };
            
            // Process all nodes in the container
            Array.from(container.childNodes).forEach(child => {
                fragment.appendChild(processNode(child));
            });
            
            // Replace selection
            range.deleteContents();
            range.insertNode(fragment);
            
            // Restore selection
            const newRange = document.createRange();
            newRange.selectNodeContents(fragment);
            selection.removeAllRanges();
            selection.addRange(newRange);
        } else {
            // Apply to entire editor for future text
            editor.style.fontSize = size;
        }
        
        // Update the dropdown to reflect the new size
        setTimeout(() => this.updateFontControls(), 10);
    }

    insertImage() {
        const imageUrl = prompt('Enter image URL or upload path:');
        if (!imageUrl) return;

        const alt = prompt('Enter image description (alt text):') || 'Article image';
        const editor = document.getElementById('articleContent');
        
        const imageHTML = `
            <div class="image-container">
                <img src="${imageUrl}" alt="${alt}" class="article-image">
                <div class="image-caption">
                    <p>${alt}</p>
                </div>
            </div>
        `;

        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            const div = document.createElement('div');
            div.innerHTML = imageHTML;
            range.insertNode(div.firstElementChild);
        } else {
            // Insert at the end if no selection
            editor.insertAdjacentHTML('beforeend', imageHTML);
        }
    }

    insertVideo() {
        const videoUrl = prompt('Enter video URL (YouTube, Vimeo, or direct video file):');
        if (!videoUrl) return;

        const editor = document.getElementById('articleContent');
        let videoHTML = '';

        if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
            // Extract YouTube video ID
            let videoId = '';
            if (videoUrl.includes('youtube.com')) {
                videoId = videoUrl.split('v=')[1]?.split('&')[0];
            } else if (videoUrl.includes('youtu.be')) {
                videoId = videoUrl.split('youtu.be/')[1]?.split('?')[0];
            }
            
            if (videoId) {
                videoHTML = `
                    <div class="video-container">
                        <div class="video-responsive">
                            <iframe src="https://www.youtube.com/embed/${videoId}" 
                                    allowfullscreen 
                                    title="YouTube video">
                            </iframe>
                        </div>
                    </div>
                `;
            }
        } else if (videoUrl.includes('vimeo.com')) {
            // Extract Vimeo video ID
            const videoId = videoUrl.split('vimeo.com/')[1]?.split('/')[0];
            
            if (videoId) {
                videoHTML = `
                    <div class="video-container">
                        <div class="video-responsive">
                            <iframe src="https://player.vimeo.com/video/${videoId}" 
                                    allowfullscreen 
                                    title="Vimeo video">
                            </iframe>
                        </div>
                    </div>
                `;
            }
        } else {
            // Direct video file or other embed code
            if (videoUrl.includes('<iframe') || videoUrl.includes('<video')) {
                // User provided embed code
                videoHTML = `
                    <div class="video-container">
                        <div class="video-responsive">
                            ${videoUrl}
                        </div>
                    </div>
                `;
            } else if (videoUrl.match(/\.(mp4|webm|ogg|mov)$/i)) {
                // Direct video file
                videoHTML = `
                    <div class="video-container">
                        <video controls>
                            <source src="${videoUrl}" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                    </div>
                `;
            } else {
                alert('Please provide a valid YouTube, Vimeo, or direct video file URL.');
                return;
            }
        }

        if (videoHTML) {
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                range.deleteContents();
                const div = document.createElement('div');
                div.innerHTML = videoHTML;
                range.insertNode(div.firstElementChild);
            } else {
                // Insert at the end if no selection
                editor.insertAdjacentHTML('beforeend', videoHTML);
            }
        }
    }

    // Update Main Website
    updateMainWebsite() {
        try {
            // Store articles for the main website to use
            const publishedArticles = this.articles
                .filter(article => article.status === 'published')
                .sort((a, b) => new Date(b.date) - new Date(a.date));
            
            // Store in localStorage (for current browser)
            localStorage.setItem('publishedArticles', JSON.stringify(publishedArticles));
            
            // Try automatic GitHub publishing first
            this.publishToGitHub(publishedArticles);
            
            console.log('Published articles updated:', publishedArticles);
            
            // If we're in an iframe or popup, notify parent window
            if (window.opener) {
                window.opener.postMessage({ type: 'articlesUpdated' }, '*');
            }
        } catch (error) {
            console.error('Error updating main website:', error);
        }
    }

    async publishToGitHub(publishedArticles) {
        const githubToken = localStorage.getItem('githubAccessToken');
        
        if (!githubToken) {
            this.showGitHubSetupInstructions();
            return;
        }

        try {
            this.showPublishingStatus('Publishing to website...', 'info');
            
            // Create the articles data file content
            const articlesDataContent = `// Published Articles Data
// This file is automatically updated when articles are published via admin console
// DO NOT EDIT MANUALLY - Use admin.html to manage articles

window.publishedArticlesData = ${JSON.stringify(publishedArticles, null, 4)};

// Last updated timestamp
window.articlesLastUpdated = ${Date.now()};`;

            // GitHub API configuration
            const repoOwner = 'Aelskandrekh';
            const repoName = 'Kharatishvili-Law';
            const filePath = 'articles-data.js';
            const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

            // Get current file SHA (required for updates)
            const getCurrentFile = await fetch(apiUrl, {
                headers: {
                    'Authorization': `token ${githubToken}`,
                    'Accept': 'application/vnd.github.v3+json',
                }
            });

            let sha = null;
            if (getCurrentFile.ok) {
                const currentFileData = await getCurrentFile.json();
                sha = currentFileData.sha;
            }

            // Prepare commit data
            const commitData = {
                message: `Auto-update articles: ${publishedArticles.length} published articles`,
                content: btoa(unescape(encodeURIComponent(articlesDataContent))), // Base64 encode
                ...(sha && { sha }) // Include SHA if file exists
            };

            // Commit to GitHub
            const response = await fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${githubToken}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(commitData)
            });

            if (response.ok) {
                this.showPublishingStatus('Articles published! Website will update in 1-2 minutes.', 'success');
                this.showDeploymentStatus();
            } else {
                throw new Error(`GitHub API error: ${response.status}`);
            }

        } catch (error) {
            console.error('GitHub publishing error:', error);
            this.showPublishingStatus('Auto-publish failed. Using manual backup...', 'warning');
            
            // Fall back to manual download method
            this.generateDataFile(publishedArticles);
        }
    }

    showGitHubSetupInstructions() {
        console.log('Showing GitHub setup instructions');
        
        const setupHTML = `
            <div class="github-setup-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 1000; display: flex; align-items: center; justify-content: center; font-family: Inter, sans-serif;">
                <div style="background: white; padding: 30px; border-radius: 15px; max-width: 650px; max-height: 85vh; overflow-y: auto; box-shadow: 0 20px 40px rgba(0,0,0,0.3);">
                    <div style="text-align: center; margin-bottom: 25px;">
                        <h2 style="color: #1a2332; margin: 0 0 10px 0;">🚀 Enable Instant Article Publishing</h2>
                        <p style="color: #666; margin: 0;">Set up one-click publishing to make your articles go live automatically!</p>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                        <h3 style="color: #28a745; margin: 0 0 15px 0;">✨ What You'll Get:</h3>
                        <ul style="margin: 0; padding-left: 20px; color: #495057;">
                            <li>Click "Save Article" → Automatically live in 1-2 minutes</li>
                            <li>No more downloading/uploading files</li>
                            <li>Articles visible on ALL browsers instantly</li>
                            <li>Professional publishing workflow</li>
                        </ul>
                    </div>
                    
                    <h3 style="color: #1a2332; margin: 0 0 15px 0;">📋 Quick Setup (2 minutes):</h3>
                    <ol style="color: #495057; line-height: 1.6;">
                        <li><strong>Open GitHub Settings:</strong><br>
                            <a href="https://github.com/settings/tokens" target="_blank" style="color: #007bff; text-decoration: none;">Click here to open GitHub Token Settings →</a></li>
                        <li><strong>Generate Token:</strong> Click "Generate new token (classic)"</li>
                        <li><strong>Token Name:</strong> Enter "Kharatishvili Law Admin"</li>
                        <li><strong>Select Permissions:</strong> Check the ☑ <strong>repo</strong> box (full repository access)</li>
                        <li><strong>Create Token:</strong> Click "Generate token" at bottom</li>
                        <li><strong>Copy & Paste:</strong> Copy the token (starts with "ghp_") and paste below</li>
                    </ol>
                    
                    <div style="margin: 25px 0; padding: 20px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 5px;">
                        <strong style="color: #856404;">⚠️ Important:</strong>
                        <p style="margin: 5px 0 0 0; color: #856404;">Copy the token immediately after generating - GitHub only shows it once!</p>
                    </div>
                    
                    <div style="margin: 20px 0;">
                        <label for="tokenInput" style="display: block; margin-bottom: 10px; font-weight: 600; color: #1a2332;">GitHub Access Token:</label>
                        <input type="password" id="tokenInput" placeholder="ghp_xxxxxxxxxxxxxxxxxxxx" 
                               style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; font-family: 'Courier New', monospace; font-size: 14px; transition: border-color 0.3s;" 
                               onfocus="this.style.borderColor='#007bff'" onblur="this.style.borderColor='#ddd'">
                        <small style="color: #6c757d; display: block; margin-top: 8px;">
                            🔒 Secure: Token is stored locally in your browser and only used for GitHub
                        </small>
                    </div>
                    
                    <div style="text-align: right; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                        <button onclick="closeGitHubSetup()" 
                                style="margin-right: 15px; padding: 12px 24px; background: #6c757d; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500; transition: background-color 0.3s;"
                                onmouseover="this.style.backgroundColor='#545b62'" onmouseout="this.style.backgroundColor='#6c757d'">
                            Skip for Now
                        </button>
                        <button onclick="saveGitHubToken()" 
                                style="padding: 12px 24px; background: #28a745; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500; transition: background-color 0.3s;"
                                onmouseover="this.style.backgroundColor='#218838'" onmouseout="this.style.backgroundColor='#28a745'">
                            🚀 Enable Auto-Publishing
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', setupHTML);
        
        // Add global functions for the modal (preserve 'this' context)
        const self = this;
        window.closeGitHubSetup = () => {
            const modal = document.querySelector('.github-setup-modal');
            if (modal) modal.remove();
            
            // Still generate download file as fallback
            const publishedArticles = self.articles.filter(article => article.status === 'published');
            if (publishedArticles.length > 0) {
                self.generateDataFile(publishedArticles);
            }
        };
        
        window.saveGitHubToken = () => {
            const tokenInput = document.getElementById('tokenInput');
            if (!tokenInput) {
                alert('Token input not found');
                return;
            }
            
            const token = tokenInput.value.trim();
            if (token && token.startsWith('ghp_')) {
                localStorage.setItem('githubAccessToken', token);
                const modal = document.querySelector('.github-setup-modal');
                if (modal) modal.remove();
                
                // Update status and test connection
                self.updateAutoPublishStatus();
                self.showPublishingStatus('Auto-publishing enabled! You can now publish articles automatically.', 'success');
                
                // If there are published articles, try to sync them
                const publishedArticles = self.articles.filter(article => article.status === 'published');
                if (publishedArticles.length > 0) {
                    self.publishToGitHub(publishedArticles);
                }
            } else {
                alert('Please enter a valid GitHub token (should start with "ghp_")');
            }
        };
    }

    showPublishingStatus(message, type = 'info') {
        const statusColors = {
            info: '#17a2b8',
            success: '#28a745', 
            warning: '#ffc107',
            error: '#dc3545'
        };
        
        const statusIcons = {
            info: '⏳',
            success: '✅',
            warning: '⚠️', 
            error: '❌'
        };
        
        // Remove existing status
        const existingStatus = document.querySelector('.publishing-status');
        if (existingStatus) existingStatus.remove();
        
        const statusHTML = `
            <div class="publishing-status" style="background: ${statusColors[type]}; color: white; padding: 15px; border-radius: 5px; margin: 10px 0; animation: fadeIn 0.3s;">
                <strong>${statusIcons[type]} ${message}</strong>
            </div>
        `;
        
        const articlesList = document.getElementById('articlesList');
        if (articlesList && articlesList.parentNode) {
            articlesList.parentNode.insertBefore(
                document.createRange().createContextualFragment(statusHTML).firstElementChild,
                articlesList.nextSibling
            );
        }
        
        // Auto-remove after delay for non-error messages
        if (type !== 'error') {
            setTimeout(() => {
                const status = document.querySelector('.publishing-status');
                if (status && status.textContent.includes(message)) {
                    status.style.opacity = '0';
                    setTimeout(() => status.remove(), 300);
                }
            }, type === 'success' ? 5000 : 3000);
        }
    }

    showDeploymentStatus() {
        let countdown = 120; // 2 minutes
        const updateCountdown = () => {
            const minutes = Math.floor(countdown / 60);
            const seconds = countdown % 60;
            const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            this.showPublishingStatus(`🚀 Deploying... Articles will be live in ~${timeString}`, 'info');
            
            countdown--;
            if (countdown >= 0) {
                setTimeout(updateCountdown, 1000);
            } else {
                this.showPublishingStatus('🎉 Articles should now be live! Check your website.', 'success');
            }
        };
        
        setTimeout(updateCountdown, 3000); // Start countdown after initial success message
    }

    // Auto-Publishing Settings Management
    updateAutoPublishStatus() {
        const statusContainer = document.getElementById('autoPublishStatus');
        const statusIndicator = document.getElementById('statusIndicator');
        const statusDot = statusIndicator.querySelector('.status-dot');
        const statusText = statusIndicator.querySelector('.status-text');
        const setupBtn = document.getElementById('setupAutoPublish');
        const testBtn = document.getElementById('testPublish');
        const removeBtn = document.getElementById('removeToken');

        const githubToken = localStorage.getItem('githubAccessToken');

        if (githubToken) {
            // Token exists, check if it's valid
            this.testGitHubConnection(true).then(isValid => {
                if (isValid) {
                    statusContainer.className = 'auto-publish-status enabled';
                    statusDot.className = 'status-dot enabled';
                    statusText.textContent = 'Auto-publishing is enabled and working';
                    setupBtn.style.display = 'none';
                    testBtn.style.display = 'inline-block';
                    removeBtn.style.display = 'inline-block';
                } else {
                    statusContainer.className = 'auto-publish-status disabled';
                    statusDot.className = 'status-dot disabled';
                    statusText.textContent = 'Auto-publishing token is invalid';
                    setupBtn.style.display = 'inline-block';
                    testBtn.style.display = 'none';
                    removeBtn.style.display = 'inline-block';
                }
            });
        } else {
            statusContainer.className = 'auto-publish-status disabled';
            statusDot.className = 'status-dot disabled';
            statusText.textContent = 'Auto-publishing is not set up';
            setupBtn.style.display = 'inline-block';
            testBtn.style.display = 'none';
            removeBtn.style.display = 'none';
        }
    }

    async testGitHubConnection(silent = false) {
        const githubToken = localStorage.getItem('githubAccessToken');
        
        if (!githubToken) {
            if (!silent) this.showPublishingStatus('No GitHub token found', 'error');
            return false;
        }

        try {
            if (!silent) this.showPublishingStatus('Testing GitHub connection...', 'info');

            const response = await fetch('https://api.github.com/user', {
                headers: {
                    'Authorization': `token ${githubToken}`,
                    'Accept': 'application/vnd.github.v3+json',
                }
            });

            if (response.ok) {
                if (!silent) this.showPublishingStatus('✅ GitHub connection successful!', 'success');
                return true;
            } else {
                if (!silent) this.showPublishingStatus('❌ GitHub token is invalid', 'error');
                return false;
            }
        } catch (error) {
            if (!silent) this.showPublishingStatus('❌ Failed to connect to GitHub', 'error');
            return false;
        }
    }

    removeGitHubToken() {
        if (confirm('Are you sure you want to disable auto-publishing? You will need to set up a new token to re-enable it.')) {
            localStorage.removeItem('githubAccessToken');
            this.updateAutoPublishStatus();
            this.showPublishingStatus('Auto-publishing has been disabled', 'warning');
        }
    }

    generateDataFile(publishedArticles) {
        try {
            // Create JavaScript data file content
            const dataFileContent = `// Published Articles Data
// This file is automatically updated when articles are published via admin console
// DO NOT EDIT MANUALLY - Use admin.html to manage articles

window.publishedArticlesData = ${JSON.stringify(publishedArticles, null, 4)};

// Last updated timestamp
window.articlesLastUpdated = ${Date.now()};`;

            // Create and download the file
            const blob = new Blob([dataFileContent], { type: 'text/javascript' });
            const url = URL.createObjectURL(blob);
            
            // Create download link
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = 'articles-data.js';
            downloadLink.style.display = 'none';
            
            // Add to page and trigger download
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            
            // Clean up
            URL.revokeObjectURL(url);
            
            // Show instructions to user
            this.showDataFileInstructions();
            
        } catch (error) {
            console.error('Error generating data file:', error);
        }
    }

    showDataFileInstructions() {
        const instructions = `
            <div style="background: #e8f5e8; border: 1px solid #4caf50; padding: 15px; margin: 10px 0; border-radius: 5px;">
                <h4 style="margin: 0 0 10px 0; color: #2e7d32;">📁 Articles Data File Generated!</h4>
                <p style="margin: 0 0 10px 0;">A file called <strong>articles-data.js</strong> has been downloaded to your computer.</p>
                <p style="margin: 0 0 10px 0;"><strong>To make articles visible on your website:</strong></p>
                <ol style="margin: 0; padding-left: 20px;">
                    <li>Upload the <strong>articles-data.js</strong> file to your website's root directory</li>
                    <li>Deploy your website to apply the changes</li>
                    <li>Your articles will now be visible to all visitors!</li>
                </ol>
                <p style="margin: 10px 0 0 0; font-size: 14px; color: #666;">
                    This file contains your published articles and will make them appear on the Resources page and Homepage.
                </p>
            </div>
        `;
        
        // Show instructions in the admin interface
        const existingInstructions = document.querySelector('.data-file-instructions');
        if (existingInstructions) {
            existingInstructions.innerHTML = instructions;
        } else {
            const instructionsDiv = document.createElement('div');
            instructionsDiv.className = 'data-file-instructions';
            instructionsDiv.innerHTML = instructions;
            
            // Add after the articles list
            const articlesList = document.getElementById('articlesList');
            if (articlesList && articlesList.parentNode) {
                articlesList.parentNode.insertBefore(instructionsDiv, articlesList.nextSibling);
            }
        }
        
        // Auto-hide after 30 seconds
        setTimeout(() => {
            const instructions = document.querySelector('.data-file-instructions');
            if (instructions) {
                instructions.style.transition = 'opacity 1s';
                instructions.style.opacity = '0';
                setTimeout(() => instructions.remove(), 1000);
            }
        }, 30000);
    }

    // Practice Area Configuration
    getPracticeAreaInfo(practiceArea) {
        const practiceAreas = {
            'immigration': {
                label: 'Immigration',
                color: '#3498db',
                bgColor: 'rgba(52, 152, 219, 0.1)'
            },
            'corporate': {
                label: 'Corporate & Commercial',
                color: '#27ae60',
                bgColor: 'rgba(39, 174, 96, 0.1)'
            },
            'real-estate': {
                label: 'Real Estate',
                color: '#f1c40f',
                bgColor: 'rgba(241, 196, 15, 0.1)'
            },
            'litigation': {
                label: 'Litigation & Arbitration',
                color: '#e74c3c',
                bgColor: 'rgba(231, 76, 60, 0.1)'
            },
            'tax-regulatory': {
                label: 'Tax & Regulatory',
                color: '#7f8c8d',
                bgColor: 'rgba(127, 140, 141, 0.1)'
            },
            'intellectual-property': {
                label: 'Intellectual Property',
                color: '#9b59b6',
                bgColor: 'rgba(155, 89, 182, 0.1)'
            }
        };
        
        return practiceAreas[practiceArea] || {
            label: 'General',
            color: '#7f8c8d',
            bgColor: 'rgba(127, 140, 141, 0.1)'
        };
    }

    // Utility Functions
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    formatDateForInput(date) {
        return date.toISOString().split('T')[0];
    }

    showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `✅ ${message}`;
        
        const content = document.querySelector('.admin-content');
        content.insertBefore(successDiv, content.firstChild);
        
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }

    // Data Management
    exportArticles() {
        const dataStr = JSON.stringify(this.articles, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `kharatishvili-law-articles-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }

    importArticles(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedArticles = JSON.parse(e.target.result);
                if (Array.isArray(importedArticles)) {
                    this.articles = importedArticles;
                    this.saveArticles();
                    this.loadArticlesList();
                    this.updateMainWebsite();
                    this.showSuccessMessage('Articles imported successfully');
                } else {
                    throw new Error('Invalid file format');
                }
            } catch (error) {
                alert('Error importing articles. Please check the file format.');
            }
        };
        reader.readAsText(file);
    }

    clearAllData() {
        if (confirm('Are you sure you want to delete ALL articles? This cannot be undone.')) {
            this.articles = [];
            this.saveArticles();
            this.loadArticlesList();
            this.updateMainWebsite();
            this.showSuccessMessage('All articles cleared');
        }
    }
}

// Initialize admin console
let admin;

document.addEventListener('DOMContentLoaded', function() {
    admin = new AdminConsole();
    
    // Enhanced mobile menu for admin
    const mobileMenuToggle = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        document.addEventListener('click', function(e) {
            const navContainer = document.querySelector('.nav-container');
            if (navContainer && !navContainer.contains(e.target)) {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
});

// Global helper functions for inline event handlers
window.admin = {
    editArticle: (id) => admin.editArticle(id),
    deleteArticle: (id) => admin.deleteArticle(id)
};