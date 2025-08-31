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
                this.applyFontStyle('fontSize', fontSize.value);
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

        container.innerHTML = this.articles.map(article => `
            <div class="article-item">
                <div class="article-info">
                    <h4>${article.title}</h4>
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
        `).join('');
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
            }
        } else {
            document.getElementById('editorTitle').textContent = 'New Article';
            document.getElementById('articleTitle').value = '';
            document.getElementById('articleDate').value = this.formatDateForInput(new Date());
            document.getElementById('articleSummary').value = '';
            document.getElementById('articleContent').innerHTML = '';
            document.getElementById('articleStatus').value = 'draft';
        }
    }

    saveArticle() {
        try {
            const title = document.getElementById('articleTitle').value.trim();
            const date = document.getElementById('articleDate').value;
            const summary = document.getElementById('articleSummary').value.trim();
            const content = document.getElementById('articleContent').innerHTML;
            const status = document.getElementById('articleStatus').value;

            console.log('Saving article:', { title, date, summary, status });

            if (!title || !date || !summary) {
                alert('Please fill in all required fields');
                return;
            }

            const article = {
                id: this.currentEditingId || this.generateId(),
                title,
                date,
                summary,
                content,
                status,
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
        } else if (command === 'formatBlock') {
            // Handle heading formatting
            document.execCommand(command, false, `<${value}>`);
        } else {
            document.execCommand(command, false, value);
        }
    }

    applyFontStyle(command, value) {
        const editor = document.getElementById('articleContent');
        
        // Get current selection
        const selection = window.getSelection();
        
        if (selection.rangeCount > 0 && !selection.isCollapsed) {
            // Apply to selected text
            editor.focus();
            document.execCommand(command, false, value);
        } else {
            // Apply to entire editor for future text
            if (command === 'fontName') {
                editor.style.fontFamily = value;
            } else if (command === 'fontSize') {
                editor.style.fontSize = value;
            }
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
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 6); // Show latest 6 articles
            
            localStorage.setItem('publishedArticles', JSON.stringify(publishedArticles));
            console.log('Published articles updated:', publishedArticles);
            
            // If we're in an iframe or popup, notify parent window
            if (window.opener) {
                window.opener.postMessage({ type: 'articlesUpdated' }, '*');
            }
        } catch (error) {
            console.error('Error updating main website:', error);
        }
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