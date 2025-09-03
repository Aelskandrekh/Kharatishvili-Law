// Serverless function to update articles-data.js via GitHub API
export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        const { articles, githubToken } = req.body;

        if (!articles || !Array.isArray(articles)) {
            return res.status(400).json({ success: false, error: 'Articles array is required' });
        }

        if (!githubToken) {
            return res.status(400).json({ success: false, error: 'GitHub token is required' });
        }

        // Create the articles data file content
        const articlesDataContent = `// Published Articles Data
// This file is automatically updated when articles are published via admin console
// DO NOT EDIT MANUALLY - Use admin.html to manage articles

window.publishedArticlesData = ${JSON.stringify(articles, null, 4)};

// Last updated timestamp
window.articlesLastUpdated = ${Date.now()};`;

        // GitHub API configuration
        const repoOwner = 'Aelskandrekh';
        const repoName = 'Kharatishvili-Law';
        const filePath = 'articles-data.js';
        const branch = 'main';
        const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

        // Get current file SHA (required for updates)
        const getCurrentFile = await fetch(apiUrl, {
            headers: {
                'Authorization': `token ${githubToken}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Kharatishvili-Law-Admin'
            }
        });

        let sha = null;
        if (getCurrentFile.ok) {
            const currentFileData = await getCurrentFile.json();
            sha = currentFileData.sha;
        }

        // Prepare commit data
        const commitData = {
            message: `Auto-update articles: ${articles.length} published articles

🤖 Generated with Claude Code Admin Console`,
            content: Buffer.from(articlesDataContent, 'utf-8').toString('base64'),
            branch: branch,
            ...(sha && { sha }) // Include SHA if file exists
        };

        // Commit to GitHub
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${githubToken}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
                'User-Agent': 'Kharatishvili-Law-Admin'
            },
            body: JSON.stringify(commitData)
        });

        const responseData = await response.json();

        if (response.ok) {
            return res.status(200).json({ 
                success: true, 
                message: 'Articles published successfully to GitHub',
                commit: responseData.commit?.html_url,
                articlesCount: articles.length
            });
        } else {
            console.error('GitHub API error:', responseData);
            return res.status(400).json({ 
                success: false, 
                error: `GitHub API error: ${responseData.message || 'Unknown error'}`,
                details: responseData
            });
        }

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Internal server error',
            message: error.message 
        });
    }
}