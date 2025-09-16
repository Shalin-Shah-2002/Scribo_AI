import { useState, useEffect } from 'react'
import './App.css'

type ActiveTool = 'script' | 'title' | 'caption' | 'hashtag' | 'ideas'

function App() {
  const [activeTool, setActiveTool] = useState<ActiveTool>('script')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showApiKeyModal, setShowApiKeyModal] = useState(false)
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '')
  const [tempApiKey, setTempApiKey] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState('')
  const [inputPrompt, setInputPrompt] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [platform, setPlatform] = useState('')
  const [duration, setDuration] = useState('')
  const [audience, setAudience] = useState('')

  // Show API key modal on first load if no API key is configured
  useEffect(() => {
    if (!apiKey) {
      setTimeout(() => setShowApiKeyModal(true), 500)
    }
  }, [])

  const navigationItems = [
    { id: 'script', name: 'Script', icon: '📝', description: 'Generate full scripts' },
    { id: 'title', name: 'Titles', icon: '🎯', description: 'Catchy, SEO-rich titles' },
    { id: 'caption', name: 'Captions', icon: '💬', description: 'Engaging captions' },
    { id: 'hashtag', name: 'Hashtags', icon: '#️⃣', description: 'Trending hashtags' },
    { id: 'ideas', name: 'Ideas', icon: '💡', description: 'Fresh content ideas' }
  ]

  const templateConfigs = {
    script: {
      templates: [
        { id: 'youtube-educational', name: 'YouTube Educational', prompt: 'Create an educational script for YouTube about [TOPIC] that is [DURATION] long, targeting [AUDIENCE]. Include an engaging hook, clear explanations, and a strong call-to-action.' },
        { id: 'tiktok-viral', name: 'TikTok Viral', prompt: 'Write a viral TikTok script about [TOPIC] that is [DURATION] long for [AUDIENCE]. Make it trendy, engaging with hooks in first 3 seconds.' },
        { id: 'instagram-reel', name: 'Instagram Reel', prompt: 'Create an Instagram Reel script about [TOPIC] that is [DURATION] long for [AUDIENCE]. Include trending music cues and visual directions.' },
        { id: 'podcast-intro', name: 'Podcast Episode', prompt: 'Write a podcast episode script about [TOPIC] that is [DURATION] long, targeting [AUDIENCE]. Include intro, main content, and outro segments.' }
      ],
      platforms: ['YouTube', 'TikTok', 'Instagram', 'Podcast', 'Facebook', 'Twitter'],
      durations: ['30 seconds', '1 minute', '3 minutes', '5 minutes', '10 minutes', '15+ minutes'],
      audiences: ['General', 'Teens (13-19)', 'Young Adults (20-35)', 'Adults (35-50)', 'Seniors (50+)', 'Business Professionals', 'Students', 'Parents']
    },
    title: {
      templates: [
        { id: 'youtube-seo', name: 'YouTube SEO Title', prompt: 'Create SEO-optimized YouTube titles about [TOPIC] for [AUDIENCE] on [PLATFORM]. Make them clickable but not clickbait, under 60 characters.' },
        { id: 'blog-post', name: 'Blog Post Title', prompt: 'Generate compelling blog post titles about [TOPIC] targeting [AUDIENCE] for [PLATFORM]. Include numbers, power words, and SEO keywords.' },
        { id: 'social-media', name: 'Social Media Title', prompt: 'Create attention-grabbing social media titles about [TOPIC] for [AUDIENCE] on [PLATFORM]. Make them shareable and engaging.' },
        { id: 'email-subject', name: 'Email Subject Line', prompt: 'Write compelling email subject lines about [TOPIC] for [AUDIENCE]. Ensure high open rates and avoid spam triggers.' }
      ],
      platforms: ['YouTube', 'Blog', 'Instagram', 'TikTok', 'LinkedIn', 'Twitter', 'Facebook', 'Email'],
      durations: ['Short (under 50 chars)', 'Medium (50-70 chars)', 'Long (70+ chars)'],
      audiences: ['General Public', 'Business Professionals', 'Content Creators', 'Students', 'Tech Enthusiasts', 'Health & Wellness', 'Finance', 'Entertainment']
    },
    caption: {
      templates: [
        { id: 'instagram-post', name: 'Instagram Post', prompt: 'Write an engaging Instagram caption about [TOPIC] for [AUDIENCE]. Include relevant emojis, hashtags, and a call-to-action. Length: [DURATION].' },
        { id: 'linkedin-professional', name: 'LinkedIn Professional', prompt: 'Create a professional LinkedIn caption about [TOPIC] for [AUDIENCE]. Make it thought-provoking and industry-relevant. Length: [DURATION].' },
        { id: 'facebook-casual', name: 'Facebook Casual', prompt: 'Write a casual, friendly Facebook caption about [TOPIC] for [AUDIENCE]. Encourage engagement and discussion. Length: [DURATION].' },
        { id: 'twitter-thread', name: 'Twitter Thread', prompt: 'Create a Twitter thread about [TOPIC] for [AUDIENCE]. Break it into digestible tweets with engaging hooks. Length: [DURATION].' }
      ],
      platforms: ['Instagram', 'Facebook', 'LinkedIn', 'Twitter', 'TikTok', 'Pinterest', 'YouTube Community'],
      durations: ['Short (1-2 sentences)', 'Medium (1 paragraph)', 'Long (2+ paragraphs)', 'Story format'],
      audiences: ['Followers', 'Business Network', 'General Public', 'Customers', 'Community', 'Industry Professionals', 'Friends & Family']
    },
    hashtag: {
      templates: [
        { id: 'trending-mix', name: 'Trending Mix', prompt: 'Generate trending hashtags for [TOPIC] content on [PLATFORM] targeting [AUDIENCE]. Mix of [DURATION] - include popular, niche, and branded hashtags.' },
        { id: 'niche-specific', name: 'Niche Specific', prompt: 'Create niche-specific hashtags for [TOPIC] on [PLATFORM] for [AUDIENCE]. Focus on [DURATION] highly targeted hashtags for better reach.' },
        { id: 'viral-potential', name: 'Viral Potential', prompt: 'Generate hashtags with viral potential for [TOPIC] on [PLATFORM] targeting [AUDIENCE]. Include [DURATION] trending and emerging hashtags.' },
        { id: 'brand-awareness', name: 'Brand Awareness', prompt: 'Create brand awareness hashtags for [TOPIC] on [PLATFORM] for [AUDIENCE]. Mix branded and community hashtags, [DURATION] total.' }
      ],
      platforms: ['Instagram', 'TikTok', 'Twitter', 'LinkedIn', 'YouTube', 'Pinterest', 'Facebook'],
      durations: ['5-10 hashtags', '10-15 hashtags', '15-20 hashtags', '20-30 hashtags'],
      audiences: ['General', 'Niche Community', 'Business Audience', 'Young Demographics', 'Local Community', 'Global Audience', 'Industry Specific']
    },
    ideas: {
      templates: [
        { id: 'content-series', name: 'Content Series', prompt: 'Generate content series ideas about [TOPIC] for [AUDIENCE] on [PLATFORM]. Create [DURATION] related content ideas that can be published over time.' },
        { id: 'trending-topics', name: 'Trending Topics', prompt: 'Suggest trending content ideas about [TOPIC] for [AUDIENCE] on [PLATFORM]. Focus on [DURATION] that align with current trends and viral potential.' },
        { id: 'educational-content', name: 'Educational Content', prompt: 'Create educational content ideas about [TOPIC] for [AUDIENCE] on [PLATFORM]. Generate [DURATION] that teach, inform, and provide value.' },
        { id: 'behind-scenes', name: 'Behind the Scenes', prompt: 'Generate behind-the-scenes content ideas about [TOPIC] for [AUDIENCE] on [PLATFORM]. Create [DURATION] that show process, journey, and authentic moments.' }
      ],
      platforms: ['YouTube', 'Instagram', 'TikTok', 'Blog', 'Podcast', 'LinkedIn', 'Twitter', 'Pinterest'],
      durations: ['5 ideas', '10 ideas', '15 ideas', '20+ ideas'],
      audiences: ['Content Creators', 'Business Owners', 'Influencers', 'Marketers', 'Educators', 'Entrepreneurs', 'General Creators', 'Niche Communities']
    }
  }

  const handleExport = (content: string) => {
    if (!content) return
    setShowExportModal(true)
  }

  const downloadAsText = (content: string) => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `scribo-ai-${activeTool}-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadAsPDF = (content: string) => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Scribo AI - ${activeTool.charAt(0).toUpperCase() + activeTool.slice(1)} Content</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; color: #333; }
            .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #4F46E5; padding-bottom: 20px; }
            .header h1 { color: #4F46E5; margin: 0; font-size: 28px; }
            .header p { color: #666; margin: 5px 0 0 0; font-size: 14px; }
            .meta { margin-bottom: 20px; }
            .meta h2 { color: #333; font-size: 20px; margin-bottom: 10px; text-transform: capitalize; }
            .meta p { color: #666; font-size: 12px; margin: 0; }
            .content { background: #f8f9ff; padding: 20px; border-left: 4px solid #4F46E5; border-radius: 8px; }
            .content pre { white-space: pre-wrap; font-family: inherit; margin: 0; font-size: 14px; line-height: 1.6; }
            .footer { margin-top: 40px; text-align: center; color: #999; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px; }
            @media print { body { margin: 0; } @page { margin: 0.5in; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Scribo AI</h1>
            <p>AI Toolkit for Content Creators</p>
          </div>
          <div class="meta">
            <h2>${activeTool} Content</h2>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </div>
          <div class="content">
            <pre>${content}</pre>
          </div>
          <div class="footer">
            <p>Generated with Scribo AI - AI Toolkit for Content Creators</p>
          </div>
        </body>
      </html>
    `
    
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(htmlContent)
      printWindow.document.close()
      setTimeout(() => {
        printWindow.print()
        setTimeout(() => printWindow.close(), 100)
      }, 250)
    }
  }

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      alert('Content copied to clipboard!')
    }).catch(() => {
      const textArea = document.createElement('textarea')
      textArea.value = content
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      alert('Content copied to clipboard!')
    })
  }

  const handleApiKeySave = () => {
    if (tempApiKey.trim()) {
      localStorage.setItem('gemini_api_key', tempApiKey.trim())
      setApiKey(tempApiKey.trim())
    }
    setShowApiKeyModal(false)
    setTempApiKey('')
  }

  const handleApiKeyRemove = () => {
    localStorage.removeItem('gemini_api_key')
    setApiKey('')
    setShowApiKeyModal(false)
    setTempApiKey('')
  }

  const openApiKeyModal = () => {
    setTempApiKey(apiKey)
    setShowApiKeyModal(true)
  }

  const buildPrompt = () => {
    if (!selectedTemplate) return inputPrompt
    
    const config = templateConfigs[activeTool]
    const template = config.templates.find(t => t.id === selectedTemplate)
    if (!template) return inputPrompt

    let finalPrompt = template.prompt
      .replace('[TOPIC]', inputPrompt || 'the given topic')
      .replace('[PLATFORM]', platform || 'the selected platform')
      .replace('[DURATION]', duration || 'appropriate duration')
      .replace('[AUDIENCE]', audience || 'target audience')

    return finalPrompt
  }

  const generateContent = async (customPrompt?: string) => {
    const finalPrompt = customPrompt || buildPrompt()
    if (!finalPrompt.trim()) return
    
    if (!apiKey) {
      alert('Please configure your Gemini API key first.')
      openApiKeyModal()
      return
    }

    setIsGenerating(true)
    setGeneratedContent('')

    const endpoints = {
      'script': '/generatescript',
      'title': '/generatetitle', 
      'caption': '/generatecaption',
      'hashtag': '/generatehashtag',
      'ideas': '/generateidea'
    }

    try {
      const response = await fetch(`http://localhost:8000${endpoints[activeTool]}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: finalPrompt,
          api_key: apiKey
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Failed to generate content')
      }

      const data = await response.json()
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No content generated'
      setGeneratedContent(content)
    } catch (error) {
      console.error('Error generating content:', error)
      alert(error instanceof Error ? error.message : 'Failed to generate content. Please check your API key and try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="brand">
            <h1 className="app-title">
              <span className="gradient-text">Scribo AI</span>
            </h1>
            <p className="app-subtitle">AI Toolkit for Content Creators</p>
          </div>
          
          <nav className="desktop-nav">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTool(item.id as ActiveTool)}
                className={`nav-item ${activeTool === item.id ? 'active' : ''}`}
                title={item.description}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.name}</span>
              </button>
            ))}
          </nav>

          <div className="header-actions">
            <button
              onClick={openApiKeyModal}
              className={`api-key-btn ${apiKey ? 'configured' : 'not-configured'}`}
              title={apiKey ? 'API Key Configured' : 'Configure API Key'}
            >
              <span className="api-key-icon">🔑</span>
              <span className="api-key-text">{apiKey ? 'API Key' : 'Set API Key'}</span>
            </button>
          </div>

          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="hamburger"></span>
          </button>
        </div>

        {isMobileMenuOpen && (
          <nav className="mobile-nav">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTool(item.id as ActiveTool)
                  setIsMobileMenuOpen(false)
                }}
                className={`mobile-nav-item ${activeTool === item.id ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <div className="nav-content">
                  <span className="nav-text">{item.name}</span>
                  <span className="nav-desc">{item.description}</span>
                </div>
              </button>
            ))}
            
            <button
              onClick={() => {
                openApiKeyModal()
                setIsMobileMenuOpen(false)
              }}
              className={`mobile-nav-item api-key-mobile ${apiKey ? 'configured' : 'not-configured'}`}
            >
              <span className="nav-icon">🔑</span>
              <div className="nav-content">
                <span className="nav-text">{apiKey ? 'API Key' : 'Set API Key'}</span>
                <span className="nav-desc">{apiKey ? 'API Key Configured' : 'Configure your Gemini API key'}</span>
              </div>
            </button>
          </nav>
        )}
      </header>

      <main className="main-content">
        <div className="form-section">
          <div className="form-card">
            <h2 className="form-title">Generate Your {activeTool}</h2>
            
            <div className="form-group">
              <label htmlFor="template-select">Choose Template:</label>
              <select
                id="template-select"
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="form-select"
              >
                <option value="">Select a template...</option>
                {templateConfigs[activeTool].templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="platform-select">Platform:</label>
                <select
                  id="platform-select"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="form-select"
                >
                  <option value="">Select platform...</option>
                  {templateConfigs[activeTool].platforms.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="duration-select">
                  {activeTool === 'script' ? 'Duration:' : activeTool === 'hashtag' ? 'Quantity:' : activeTool === 'ideas' ? 'Number:' : 'Length:'}
                </label>
                <select
                  id="duration-select"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="form-select"
                >
                  <option value="">Select {activeTool === 'script' ? 'duration' : activeTool === 'hashtag' ? 'quantity' : 'length'}...</option>
                  {templateConfigs[activeTool].durations.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="audience-select">Target Audience:</label>
                <select
                  id="audience-select"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="form-select"
                >
                  <option value="">Select audience...</option>
                  {templateConfigs[activeTool].audiences.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="prompt-input">
                Enter your topic/subject:
              </label>
              <textarea
                id="prompt-input"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder={`Describe your topic for ${activeTool} generation...`}
                className="prompt-input"
                rows={3}
              />
            </div>

            {selectedTemplate && (
              <div className="template-preview">
                <h4>Preview:</h4>
                <p className="preview-text">{buildPrompt()}</p>
              </div>
            )}
            
            <button 
              className={`generate-btn ${isGenerating ? 'generating' : ''}`}
              onClick={() => generateContent()}
              disabled={isGenerating || (!inputPrompt.trim() && !selectedTemplate)}
            >
              {isGenerating ? 'Generating...' : `Generate ${activeTool}`}
            </button>
          </div>
        </div>

        <div className="results-section">
          <div className="results-card">
            {generatedContent ? (
              <div className="generated-content">
                <h3>Generated {activeTool}:</h3>
                <div className="content-output">
                  {generatedContent}
                </div>
                <button 
                  className="action-btn export-btn"
                  onClick={() => handleExport(generatedContent)}
                >
                  Export Content
                </button>
              </div>
            ) : (
              <div className="empty-results">
                <div className="empty-results-icon">
                  {navigationItems.find(item => item.id === activeTool)?.icon}
                </div>
                <h3>Ready to Generate</h3>
                <p>Fill out the form and click generate to see your {activeTool} here</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {showExportModal && (
        <div className="export-modal-overlay" onClick={() => setShowExportModal(false)}>
          <div className="export-modal" onClick={(e) => e.stopPropagation()}>
            <div className="export-modal-header">
              <button 
                className="export-modal-close"
                onClick={() => setShowExportModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="export-modal-content">
              <div className="export-section">
                <h4>📁 Download Formats</h4>
                <div className="export-options">
                  <button 
                    className="export-option-btn"
                    onClick={() => {
                      downloadAsPDF(generatedContent)
                      setShowExportModal(false)
                    }}
                  >
                    <span>📄</span> PDF Document
                  </button>
                  <button 
                    className="export-option-btn"
                    onClick={() => {
                      downloadAsText(generatedContent)
                      setShowExportModal(false)
                    }}
                  >
                    <span>📝</span> Text File
                  </button>
                  <button 
                    className="export-option-btn"
                    onClick={() => {
                      copyToClipboard(generatedContent)
                      setShowExportModal(false)
                    }}
                  >
                    <span>📋</span> Copy to Clipboard
                  </button>
                </div>
              </div>
              
              <div className="export-section">
                <h4>🚀 Share to Platforms</h4>
                <div className="export-options">
                  <button className="export-option-btn">
                    <span>📺</span> YouTube Studio
                  </button>
                  <button className="export-option-btn">
                    <span>📱</span> TikTok
                  </button>
                  <button className="export-option-btn">
                    <span>📷</span> Instagram
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showApiKeyModal && (
        <div className="modal-overlay" onClick={() => setShowApiKeyModal(false)}>
          <div className="modal-content api-key-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🔑 Configure Gemini API Key</h3>
              <button 
                className="modal-close"
                onClick={() => setShowApiKeyModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <p className="api-key-info">
                Your API key is stored locally and never sent to our servers. 
                Get your free API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio</a>.
              </p>
              
              <div className="form-group">
                <label htmlFor="api-key-input">Gemini API Key</label>
                <input
                  id="api-key-input"
                  type="password"
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  placeholder="Enter your Gemini API key..."
                  className="api-key-input"
                />
              </div>
              
              <div className="api-key-actions">
                <button 
                  onClick={handleApiKeySave}
                  className="btn-primary"
                  disabled={!tempApiKey.trim()}
                >
                  {apiKey ? 'Update Key' : 'Save Key'}
                </button>
                
                {apiKey && (
                  <button 
                    onClick={handleApiKeyRemove}
                    className="btn-danger"
                  >
                    Remove Key
                  </button>
                )}
                
                <button 
                  onClick={() => setShowApiKeyModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
