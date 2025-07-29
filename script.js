// script.js
// Placeholder for future interactivity (marquee, PFP generator, etc.)

// Hamburger menu toggle
const hamburgerBtn = document.getElementById('hamburger-btn');
const dropdownMenu = document.getElementById('dropdown-menu');
const closeMenuBtn = document.getElementById('close-menu-btn');

if (hamburgerBtn && dropdownMenu) {
  hamburgerBtn.addEventListener('click', () => {
    dropdownMenu.classList.toggle('show');
  });

  // Close menu when clicking the close button
  if (closeMenuBtn) {
    closeMenuBtn.addEventListener('click', () => {
      dropdownMenu.classList.remove('show');
    });
  }

  // Close menu when clicking a link
  dropdownMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      dropdownMenu.classList.remove('show');
    });
  });
}

// Tools popup functionality
const toolsMenuBtn = document.getElementById('tools-menu-btn');
const toolsPopup = document.getElementById('tools-popup');
const closeToolsBtn = document.getElementById('close-tools-btn');

if (toolsMenuBtn && toolsPopup) {
  toolsMenuBtn.addEventListener('click', () => {
    dropdownMenu.classList.remove('show'); // Close main menu
    toolsPopup.classList.add('show'); // Open tools popup
  });

  // Close tools popup when clicking the close button
  if (closeToolsBtn) {
    closeToolsBtn.addEventListener('click', () => {
      toolsPopup.classList.remove('show');
    });
  }

  // Close tools popup when clicking outside
  toolsPopup.addEventListener('click', (e) => {
    if (e.target === toolsPopup) {
      toolsPopup.classList.remove('show');
    }
  });

  // Close tools popup when clicking a tool link
  toolsPopup.querySelectorAll('.tool-link').forEach(link => {
    link.addEventListener('click', () => {
      toolsPopup.classList.remove('show');
    });
  });
}

// Games popup functionality
const gamesMenuBtn = document.getElementById('games-menu-btn');
const gamesPopup = document.getElementById('games-popup');
const closeGamesBtn = document.getElementById('close-games-btn');

if (gamesMenuBtn && gamesPopup) {
  gamesMenuBtn.addEventListener('click', () => {
    dropdownMenu.classList.remove('show'); // Close main menu
    gamesPopup.classList.add('show'); // Open games popup
  });

  // Close games popup when clicking the close button
  if (closeGamesBtn) {
    closeGamesBtn.addEventListener('click', () => {
      gamesPopup.classList.remove('show');
    });
  }

  // Close games popup when clicking outside
  gamesPopup.addEventListener('click', (e) => {
    if (e.target === gamesPopup) {
      gamesPopup.classList.remove('show');
    }
  });

  // Close games popup when clicking a game link
  gamesPopup.querySelectorAll('.game-link').forEach(link => {
    link.addEventListener('click', () => {
      gamesPopup.classList.remove('show');
    });
  });
}

// Click-to-copy for contract address
const contractBox = document.getElementById('contract-address');
const copyMsg = document.getElementById('copyMsg');
if (contractBox && copyMsg) {
  contractBox.addEventListener('click', () => {
    const address = contractBox.textContent.trim();
    navigator.clipboard.writeText(address).then(() => {
      copyMsg.style.display = 'block';
      setTimeout(() => {
        copyMsg.style.display = 'none';
      }, 1500);
    });
  });
}

// PFP Generator Logic
const pfpCanvas = document.getElementById('pfp-canvas');
const pfpCtx = pfpCanvas ? pfpCanvas.getContext('2d') : null;
const profileUpload = document.getElementById('profile-upload');
const charBtns = document.querySelectorAll('.pfp-char-btn');
const downloadBtn = document.getElementById('download-profile');
const shareBtn = document.getElementById('share-x');
const downloadError = document.getElementById('download-error');

let userImg = null;
let userImgObj = null;
let charImgObj = null;
let charName = '';
let charSrc = '';

function clearCanvas() {
  if (pfpCtx) {
    pfpCtx.clearRect(0, 0, pfpCanvas.width, pfpCanvas.height);
    pfpCtx.fillStyle = '#fff';
    pfpCtx.fillRect(0, 0, pfpCanvas.width, pfpCanvas.height);
  }
}

function drawPreview() {
  if (!pfpCtx) return;
  clearCanvas();
  // Draw user image
  if (userImgObj) {
    // Fit to canvas
    let scale = Math.min(pfpCanvas.width / userImgObj.width, pfpCanvas.height / userImgObj.height);
    let nw = userImgObj.width * scale;
    let nh = userImgObj.height * scale;
    let x = (pfpCanvas.width - nw) / 2;
    let y = (pfpCanvas.height - nh) / 2;
    pfpCtx.drawImage(userImgObj, x, y, nw, nh);
  }
  // Draw character overlay at bottom left
  if (charImgObj) {
    const iconW = 200;
    const iconH = 200;
    const iconX = 0;
    const iconY = pfpCanvas.height - iconH;
    pfpCtx.drawImage(charImgObj, iconX, iconY, iconW, iconH);
  }
  // Draw 'GOT BONKED!' text vertically on the right side
  pfpCtx.save();
  pfpCtx.font = 'bold 60px "Brett", "Bangers", cursive, sans-serif';
  pfpCtx.fillStyle = '#FFD300';
  pfpCtx.textAlign = 'center';
  pfpCtx.textBaseline = 'middle';
  pfpCtx.translate(pfpCanvas.width - 60, pfpCanvas.height / 2);
  pfpCtx.rotate(-Math.PI / 2);
  pfpCtx.shadowColor = '#000';
  pfpCtx.shadowBlur = 8;
  pfpCtx.fillText('GOT BONKED!', 0, 0);
  pfpCtx.restore();
}

// --- Cropper.js Integration ---
const cropperModal = document.getElementById('cropper-modal');
const cropperImage = document.getElementById('cropper-image');
const cropperConfirm = document.getElementById('cropper-confirm');
let cropper = null;

if (profileUpload) {
  profileUpload.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(evt) {
      cropperImage.src = evt.target.result;
      cropperModal.style.display = 'flex';
      setTimeout(() => {
        if (cropper) cropper.destroy();
        cropper = new Cropper(cropperImage, {
          aspectRatio: 1,
          viewMode: 1,
          autoCropArea: 1,
          background: false,
          movable: true,
          zoomable: true,
          rotatable: false,
          scalable: false,
          responsive: true,
        });
      }, 100);
    };
    reader.readAsDataURL(file);
  });
}

if (cropperConfirm) {
  cropperConfirm.addEventListener('click', function() {
    if (cropper) {
      const canvas = cropper.getCroppedCanvas({ width: 800, height: 800, imageSmoothingQuality: 'high' });
      userImgObj = new window.Image();
      userImgObj.onload = function() {
        drawPreview();
      };
      userImgObj.src = canvas.toDataURL('image/png');
      cropper.destroy();
      cropper = null;
      cropperModal.style.display = 'none';
    }
  });
}

charBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    charBtns.forEach(b => b.classList.remove('selected'));
    this.classList.add('selected');
    charName = this.getAttribute('data-name');
    charSrc = this.getAttribute('data-src');
    charImgObj = new window.Image();
    charImgObj.onload = function() {
      drawPreview();
    };
    charImgObj.src = charSrc;
    // Update selected label and name
    if (selectedCharLabel && selectedCharName) {
      selectedCharLabel.querySelector('.selected-label').textContent = 'SELECTED';
      selectedCharName.textContent = charName;
    }
  });
});

// PFP Generator Carousel Logic
const characterOptions = [
  { name: 'Grok Brett', src: 'assets/Grok Brett.svg' },
  { name: 'Shady Brett', src: 'assets/Shady Brett.svg' },
  { name: 'Angry Brett', src: 'assets/Angry Brett.svg' },
  { name: 'Bonked Brett', src: 'assets/Bonked Brett.svg' },
  { name: 'Crazy Brett', src: 'assets/Crazy Brett.svg' }
];
let charIndex = 0;
const charLeft = document.getElementById('char-left');
const charRight = document.getElementById('char-right');
const charBtn = document.getElementById('carousel-char-btn');
const selectedCharLabel = document.getElementById('selected-character-label');
const selectedCharName = document.getElementById('selected-char-name');

// Set up high-res canvas
if (pfpCanvas) {
  pfpCanvas.width = 800;
  pfpCanvas.height = 800;
  pfpCanvas.style.width = '320px';
  pfpCanvas.style.height = '320px';
}

function updateCarousel() {
  const option = characterOptions[charIndex];
  charBtn.setAttribute('data-name', option.name);
  charBtn.setAttribute('data-src', option.src);
  charBtn.querySelector('img').src = option.src;
  charBtn.querySelector('img').alt = option.name;
  charBtn.classList.add('selected');
  charName = option.name;
  charSrc = option.src;
  charImgObj = new window.Image();
  charImgObj.onload = function() {
    drawPreview();
  };
  charImgObj.src = charSrc;
  // Update selected label and name
  if (selectedCharLabel && selectedCharName) {
    selectedCharLabel.querySelector('.selected-label').textContent = 'SELECTED';
    selectedCharName.textContent = charName;
  }
}

if (charLeft && charRight && charBtn) {
  charLeft.addEventListener('click', () => {
    charIndex = (charIndex - 1 + characterOptions.length) % characterOptions.length;
    updateCarousel();
  });
  charRight.addEventListener('click', () => {
    charIndex = (charIndex + 1) % characterOptions.length;
    updateCarousel();
  });
  charBtn.addEventListener('click', function() {
    // Only update if not already selected
    if (!charBtn.classList.contains('selected')) {
      updateCarousel();
    }
  });
}

if (downloadBtn && pfpCanvas) {
  downloadBtn.disabled = false;
  downloadBtn.style.opacity = '1';
  downloadBtn.style.cursor = 'pointer';
  downloadBtn.addEventListener('click', function() {
    if (downloadError) downloadError.style.display = 'none';
    if (!userImgObj) {
      if (downloadError) {
        downloadError.textContent = 'Please upload a profile picture before downloading.';
        downloadError.style.display = 'block';
      }
      return;
    }
    if (!charImgObj) {
      if (downloadError) {
        downloadError.textContent = 'Please select a character before downloading.';
        downloadError.style.display = 'block';
      }
      return;
    }
    drawPreview(); // Ensure canvas is up-to-date
    setTimeout(() => {
      try {
        const link = document.createElement('a');
        link.download = 'bonked-profile.png';
        link.href = pfpCanvas.toDataURL('image/png');
        if (!link.href || link.href === 'data:,') {
          if (downloadError) {
            downloadError.textContent = 'Download failed. Please try again after uploading a valid image.';
            downloadError.style.display = 'block';
          }
          return;
        }
        link.click();
        if (downloadError) downloadError.style.display = 'none';
      } catch (e) {
        if (downloadError) {
          downloadError.textContent = 'Download failed. Please try again.';
          downloadError.style.display = 'block';
        }
      }
    }, 50); // Small delay to ensure drawPreview completes
  });
}

if (shareBtn && pfpCanvas) {
  shareBtn.addEventListener('click', function() {
    let tweetText = 'I JUST GOT BONKED FAM!%0A';
    if (charName) {
      tweetText += `Check out my new '${charName}' profile picture.%0A`;
    }
    tweetText += '#Brett #BrettOnBonk #GetBonked';
    const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
    window.open(tweetUrl, '_blank');
  });
}

// Bonked Brett Bottom Right Logic
const bonkedBtn = document.getElementById('bonked-brett-btn');
const bonkedPopup = document.getElementById('bonked-popup');
const bonkedAudios = [
  { text: 'I HOPE YOU COPE HARD!!!', audio: document.getElementById('bonked-audio-cope') },
  { text: 'OUCH THAT HURT! YOU JEET!', audio: document.getElementById('bonked-audio-jeet') },
  { text: 'YOU BETTER HODL!!!', audio: document.getElementById('bonked-audio-hodl') },
  { text: 'YOU BONKING MAD!!!', audio: document.getElementById('bonked-audio-mad') }
];
let bonkedIndex = 0;
if (bonkedBtn && bonkedPopup) {
  bonkedBtn.addEventListener('click', () => {
    // Stop all audios
    bonkedAudios.forEach(b => { b.audio.pause(); b.audio.currentTime = 0; });
    // Show popup
    const { text, audio } = bonkedAudios[bonkedIndex];
    bonkedPopup.textContent = text;
    bonkedPopup.style.display = 'block';
    audio.play();
    // Hide popup when audio ends
    audio.onended = () => {
      bonkedPopup.style.display = 'none';
    };
    bonkedIndex = (bonkedIndex + 1) % bonkedAudios.length;
  });
}

// Site Loader Overlay Logic
window.addEventListener('DOMContentLoaded', function() {
  const loader = document.getElementById('site-loader');
  function hideLoader() {
    if (loader) loader.classList.add('hide');
    setTimeout(() => { if (loader) loader.style.display = 'none'; }, 600);
  }
  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader);
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const bgMusic = document.getElementById('bg-music');
  const musicBtn = document.getElementById('music-toggle-btn');
  if (!bgMusic || !musicBtn) return;

  // Check if music was playing from pre-page
  const musicState = localStorage.getItem('brettMusicPlaying');
  let isMusicPlaying = false;
  
  if (musicState === 'true') {
    isMusicPlaying = true;
    musicBtn.textContent = '🔊';
    // Try to play music immediately when coming from index page
    bgMusic.play().then(() => {
      console.log('Music started successfully from index page');
    }).catch((error) => {
      console.log('Auto-play prevented, will start on first user interaction:', error);
      // Listen for first user interaction to start music
      const startMusicOnInteraction = () => {
        bgMusic.play().then(() => {
          updateButton();
        });
        window.removeEventListener('pointerdown', startMusicOnInteraction);
      };
      window.addEventListener('pointerdown', startMusicOnInteraction);
    });
  } else {
    bgMusic.pause();
    musicBtn.textContent = '🔇';
  }

  function updateButton() {
    if (bgMusic.paused) {
      musicBtn.textContent = '🔇';
      localStorage.setItem('brettMusicPlaying', 'false');
    } else {
      musicBtn.textContent = '🔊';
      localStorage.setItem('brettMusicPlaying', 'true');
    }
  }

  musicBtn.addEventListener('click', function() {
    if (bgMusic.paused) {
      bgMusic.play().then(() => {
        console.log('Music started on button click');
        updateButton();
      }).catch((error) => {
        console.log('Auto-play prevented on button click:', error);
      });
    } else {
      bgMusic.pause();
      updateButton();
    }
  });

  // Optional: update button if user interacts with audio controls elsewhere
  bgMusic.addEventListener('play', updateButton);
  bgMusic.addEventListener('pause', updateButton);
});

// X API Integration for Social Feed
class TwitterAPI {
  constructor() {
    this.baseURL = 'https://api.twitter.com/2';
    this.bearerToken = 'AAAAAAAAAAAAAAAAAAAAANcU3QEAAAAAQwzSx90Nua3cp1X5yK4OChkx%2FS0%3DGD9cO2ufOBy6bF2eTjwdrdPOz0LsVyXKpb8cG9hu2CA6FkuOML';
    this.isInitialized = false;
  }

  async initialize() {
    // For now, we'll use mock data since you need to set up your API keys
    // In production, you'd get the bearer token from your environment variables
    console.log('Twitter API initialized with mock data');
    this.isInitialized = true;
  }

  async getTweets(query = 'BRETT OR #Brett OR #Bonk', maxResults = 10) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Real API call to get tweets
      const response = await this.makeAPICall('/tweets/search/recent', {
        query: query,
        max_results: maxResults,
        'tweet.fields': 'created_at,public_metrics,author_id',
        'user.fields': 'username,name,profile_image_url',
        expansions: 'author_id'
      });
      
      console.log('Real tweets loaded:', response.data?.length || 0, 'tweets');
      return response.data || [];
    } catch (error) {
      console.log('Using mock tweets as fallback:', error.message);
      // Fallback to mock data if API fails
      return this.getMockTweets();
    }
  }

  async getUserInfo(username = 'BrettOnBonk') {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Real API call to get user info
      const response = await this.makeAPICall(`/users/by/username/${username}`, {
        'user.fields': 'id,username,name,public_metrics,profile_image_url'
      });
      
      console.log('Real user info loaded:', response.data?.name);
      return response.data || {
        id: '123456789',
        username: 'BrettOnBonk',
        name: 'OG BRETT',
        public_metrics: { followers_count: 15420 },
        profile_image_url: 'assets/Brett Head.png'
      };
    } catch (error) {
      console.log('Using mock user data as fallback:', error.message);
      // Fallback to mock data if API fails
      return {
        id: '123456789',
        username: 'BrettOnBonk',
        name: 'OG BRETT',
        public_metrics: { followers_count: 15420 },
        profile_image_url: 'assets/Brett Head.png'
      };
    }
  }

  async getMentions(query = '@BrettOnBonk OR #Brett OR #Bonk', maxResults = 10) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    // Mock mentions data
    return this.getMockMentions();
  }

  getMockTweets() {
    return [
      {
        id: '1',
        text: '🚀 BRETT just hit another ATH! The community is absolutely BONKING! 💎🙌 #Brett #Bonk #Crypto',
        author_id: '123456789',
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        public_metrics: {
          retweet_count: 45,
          reply_count: 12,
          like_count: 234,
          quote_count: 8
        }
      },
      {
        id: '2',
        text: 'Just created the most epic BRETT meme! The community is going to love this one! 🎨🔥 #BrettMeme #Bonk',
        author_id: '123456789',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        public_metrics: {
          retweet_count: 67,
          reply_count: 23,
          like_count: 456,
          quote_count: 15
        }
      },
      {
        id: '3',
        text: 'New game alert! 🎮 Brett\'s BonkMan is now live! Test your skills and compete with the community! #BrettGames #Bonk',
        author_id: '123456789',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
        public_metrics: {
          retweet_count: 89,
          reply_count: 34,
          like_count: 678,
          quote_count: 23
        }
      },
      {
        id: '4',
        text: 'The BRETT calculator is now live! Calculate your token value and see what could happen at different market caps! 📊💡 #BrettTools',
        author_id: '123456789',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
        public_metrics: {
          retweet_count: 123,
          reply_count: 45,
          like_count: 892,
          quote_count: 34
        }
      },
      {
        id: '5',
        text: 'Community update: We\'ve reached 15K followers! Thank you all for being part of this amazing journey! 🙏❤️ #BrettCommunity #Bonk',
        author_id: '123456789',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
        public_metrics: {
          retweet_count: 156,
          reply_count: 67,
          like_count: 1234,
          quote_count: 45
        }
      }
    ];
  }

  getMockMentions() {
    return [
      {
        id: '6',
        text: 'Just bought more $BRETT! This project is absolutely going to the moon! 🚀 #Brett #Bonk',
        author_id: '987654321',
        created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        public_metrics: {
          retweet_count: 12,
          reply_count: 5,
          like_count: 89,
          quote_count: 3
        }
      },
      {
        id: '7',
        text: 'The BRETT meme generator is fire! 🔥 Created the most epic meme ever! #BrettMeme #Bonk',
        author_id: '876543210',
        created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        public_metrics: {
          retweet_count: 23,
          reply_count: 8,
          like_count: 156,
          quote_count: 7
        }
      },
      {
        id: '8',
        text: 'Playing Brett\'s BonkMan game and I\'m addicted! The community is so competitive! 🎮 #BrettGames',
        author_id: '765432109',
        created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        public_metrics: {
          retweet_count: 8,
          reply_count: 3,
          like_count: 67,
          quote_count: 2
        }
      }
    ];
  }

  async makeAPICall(endpoint, params = {}) {
    try {
      // Use Netlify serverless function to avoid CORS issues
      const response = await fetch('/.netlify/functions/twitter-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          endpoint: endpoint,
          params: params
        })
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Netlify function error:', error);
      // Return mock data as fallback
      throw new Error('API unavailable, using mock data');
    }
  }
}

// Social Feed Manager
class SocialFeedManager {
  constructor() {
    this.twitterAPI = new TwitterAPI();
    this.tweetsContainer = document.getElementById('tweets-container');
    this.followerCount = document.getElementById('follower-count');
    this.mentionCount = document.getElementById('mention-count');
    this.refreshBtn = document.getElementById('refresh-feed');
    this.isLoading = false;
    
    console.log('SocialFeedManager created');
    console.log('tweetsContainer:', this.tweetsContainer);
    console.log('followerCount:', this.followerCount);
    console.log('mentionCount:', this.mentionCount);
    console.log('refreshBtn:', this.refreshBtn);
  }

  async initialize() {
    await this.twitterAPI.initialize();
    this.setupEventListeners();
    await this.loadFeed();
  }

  setupEventListeners() {
    if (this.refreshBtn) {
      this.refreshBtn.addEventListener('click', () => this.loadFeed());
    }
  }

  async loadFeed() {
    if (this.isLoading) return;
    
    this.isLoading = true;
    this.showLoading();

    try {
      // Load user info and stats
      const userInfo = await this.twitterAPI.getUserInfo();
      this.updateStats(userInfo);

      // Load tweets
      const tweets = await this.twitterAPI.getTweets();
      this.displayTweets(tweets);

    } catch (error) {
      console.error('Error loading feed:', error);
      this.showError('Failed to load tweets. Please try again.');
    } finally {
      this.isLoading = false;
    }
  }

  updateStats(userInfo) {
    if (this.followerCount) {
      const followers = userInfo.public_metrics?.followers_count || userInfo.followers_count || 15420;
      this.followerCount.textContent = this.formatNumber(followers);
    }
    
    if (this.mentionCount) {
      // Mock mention count for now (we can add real mention tracking later)
      this.mentionCount.textContent = this.formatNumber(Math.floor(Math.random() * 50) + 10);
    }
  }

  displayTweets(tweets) {
    if (!this.tweetsContainer) return;

    if (tweets.length === 0) {
      this.tweetsContainer.innerHTML = '<div class="no-tweets">No tweets found. Check back later!</div>';
      return;
    }

    const tweetsHTML = tweets.map(tweet => this.createTweetHTML(tweet)).join('');
    this.tweetsContainer.innerHTML = tweetsHTML;

    // Add click handlers for tweets
    this.tweetsContainer.querySelectorAll('.tweet-item').forEach(tweetEl => {
      tweetEl.addEventListener('click', () => {
        const tweetId = tweetEl.dataset.tweetId;
        window.open(`https://twitter.com/BrettOnBonk/status/${tweetId}`, '_blank');
      });
    });
  }

  createTweetHTML(tweet) {
    const timeAgo = this.getTimeAgo(tweet.created_at);
    const metrics = tweet.public_metrics || {};
    
    // Get user info from tweet or use default
    const username = tweet.author_id === '123456789' ? 'OG BRETT' : 'Community Member';
    const handle = tweet.author_id === '123456789' ? '@BrettOnBonk' : '@user';
    const avatar = tweet.author_id === '123456789' ? 'assets/Brett Head.png' : 'assets/Brett Head.png';

    return `
      <div class="tweet-item" data-tweet-id="${tweet.id}">
        <div class="tweet-header">
          <img src="${avatar}" alt="${username}" class="tweet-avatar">
          <div class="tweet-user-info">
            <div class="tweet-username">${username}</div>
            <div class="tweet-handle">${handle}</div>
          </div>
          <div class="tweet-time">${timeAgo}</div>
        </div>
        <div class="tweet-content">${this.formatTweetText(tweet.text)}</div>
        <div class="tweet-actions">
          <div class="tweet-action">
            <span class="tweet-action-icon">💬</span>
            <span>${this.formatNumber(metrics.reply_count || 0)}</span>
          </div>
          <div class="tweet-action">
            <span class="tweet-action-icon">🔄</span>
            <span>${this.formatNumber(metrics.retweet_count || 0)}</span>
          </div>
          <div class="tweet-action">
            <span class="tweet-action-icon">❤️</span>
            <span>${this.formatNumber(metrics.like_count || 0)}</span>
          </div>
          <div class="tweet-action">
            <span class="tweet-action-icon">📊</span>
            <span>${this.formatNumber(metrics.quote_count || 0)}</span>
          </div>
        </div>
      </div>
    `;
  }

  formatTweetText(text) {
    // Convert URLs to clickable links
    text = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" style="color: #ffd700;">$1</a>');
    
    // Convert hashtags to styled elements
    text = text.replace(/#(\w+)/g, '<span style="color: #ffd700; font-weight: bold;">#$1</span>');
    
    // Convert mentions to styled elements
    text = text.replace(/@(\w+)/g, '<span style="color: #ffd700;">@$1</span>');
    
    return text;
  }

  getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
  }

  formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  showLoading() {
    if (this.tweetsContainer) {
      this.tweetsContainer.innerHTML = `
        <div class="loading-tweets">
          <div class="loading-spinner"></div>
          <p>Loading BRETT tweets...</p>
        </div>
      `;
    }
  }

  showError(message) {
    if (this.tweetsContainer) {
      this.tweetsContainer.innerHTML = `
        <div class="error-message">
          ${message}
        </div>
      `;
    }
  }
}

// Initialize Social Feed when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM loaded, initializing social feed...');
  
  try {
    // Initialize Social Feed
    const socialFeed = new SocialFeedManager();
    await socialFeed.initialize();
    console.log('Social feed initialized successfully!');
  } catch (error) {
    console.error('Error initializing social feed:', error);
  }
});

// Auto-refresh feed every 5 minutes
setInterval(async () => {
  try {
    const socialFeed = new SocialFeedManager();
    await socialFeed.loadFeed();
  } catch (error) {
    console.error('Error refreshing feed:', error);
  }
}, 5 * 60 * 1000);

// TOP OPTIONS BAR (Trading Simulator)
document.addEventListener('DOMContentLoaded', function() {
  // Fast Forward Button
  const fastForwardBtn = document.getElementById('fast-forward-btn');
  if (fastForwardBtn) {
    fastForwardBtn.addEventListener('click', () => {
              if (window.tradingSimulator && typeof window.tradingSimulator.triggerFastForward === 'function') {
          // Show fast forward options modal
        const modal = document.createElement('div');
        modal.className = 'fastforward-modal';
        modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:3000;display:flex;align-items:center;justify-content:center;';
        modal.innerHTML = `
          <div style="background:#222;border-radius:18px;padding:2rem;box-shadow:0 8px 32px rgba(0,0,0,0.35);text-align:center;min-width:260px;">
            <button style="position:absolute;top:10px;right:16px;font-size:1.5rem;background:none;border:none;color:#FFD300;cursor:pointer;" onclick="this.parentElement.parentElement.remove()">×</button>
            <h3 style="margin-bottom:1rem;color:#fff;">Fast Forward</h3>
            <div style="display:flex;flex-direction:column;gap:0.7rem;align-items:center;">
              <button class="ff-option" data-time="1week" style="background:linear-gradient(45deg,#FFD300,#FF6B35);color:#000;border:none;border-radius:12px;padding:0.7rem 1.5rem;font-family:Bangers,cursive;font-size:1rem;cursor:pointer;box-shadow:0 4px 15px rgba(255,211,0,0.3);transition:all 0.2s;">⏩ 1 WEEK</button>
              <button class="ff-option" data-time="2weeks" style="background:linear-gradient(45deg,#FFD300,#FF6B35);color:#000;border:none;border-radius:12px;padding:0.7rem 1.5rem;font-family:Bangers,cursive;font-size:1rem;cursor:pointer;box-shadow:0 4px 15px rgba(255,211,0,0.3);transition:all 0.2s;">⏩ 2 WEEKS</button>
              <button class="ff-option" data-time="1month" style="background:linear-gradient(45deg,#FFD300,#FF6B35);color:#000;border:none;border-radius:12px;padding:0.7rem 1.5rem;font-family:Bangers,cursive;font-size:1rem;cursor:pointer;box-shadow:0 4px 15px rgba(255,211,0,0.3);transition:all 0.2s;">⏩ 1 MONTH</button>
              <button class="ff-option" data-time="2months" style="background:linear-gradient(45deg,#FFD300,#FF6B35);color:#000;border:none;border-radius:12px;padding:0.7rem 1.5rem;font-family:Bangers,cursive;font-size:1rem;cursor:pointer;box-shadow:0 4px 15px rgba(255,211,0,0.3);transition:all 0.2s;">⏩ 2 MONTHS</button>
              <button class="ff-option" data-time="3months" style="background:linear-gradient(45deg,#FFD300,#FF6B35);color:#000;border:none;border-radius:12px;padding:0.7rem 1.5rem;font-family:Bangers,cursive;font-size:1rem;cursor:pointer;box-shadow:0 4px 15px rgba(255,211,0,0.3);transition:all 0.2s;">⏩ 3 MONTHS</button>
            </div>
          </div>
        `;
        document.body.appendChild(modal);
        
        // Add event listeners to fast forward options
        const ffOptions = modal.querySelectorAll('.ff-option');
        ffOptions.forEach(btn => {
          btn.addEventListener('click', function() {
            const timeFrame = this.getAttribute('data-time');
            if (window.tradingSimulator && typeof window.tradingSimulator.triggerFastForward === 'function') {
              window.tradingSimulator.triggerFastForward(timeFrame);
            }
            modal.remove();
          });
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
          if (e.target === modal) modal.remove();
        });
      }
    });
  }
  
  // Tips Button
  const tipsBtn = document.getElementById('tips-btn-top');
  if (tipsBtn) {
    tipsBtn.addEventListener('click', () => {
      alert('💡 TRADING TIPS:\n\n• Buy low, sell high!\n• Don\'t invest more than you can afford to lose\n• Watch the news feed for market signals\n• Use stop losses to protect your profits\n• Practice with the prediction game\n• Fast forward to see long-term trends');
    });
  }
  
  // Settings Button
  const settingsBtn = document.getElementById('settings-btn');
  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      alert('⚙️ SETTINGS:\n\n• Sound effects: ON\n• Auto-save: Enabled\n• Leaderboard updates: Real-time\n• Chart timeframes: Available\n• Fast forward: Available\n\nSettings saved automatically!');
    });
  }
  
  // Timeframe buttons
  const timeframeBtns = document.querySelectorAll('.timeframe-btn');
  timeframeBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // Remove active class from all buttons
      timeframeBtns.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      this.classList.add('active');
      
      const timeframe = this.getAttribute('data-timeframe');
      if (window.tradingSimulator && typeof window.tradingSimulator.changeTimeframe === 'function') {
        window.tradingSimulator.changeTimeframe(timeframe);
      }
    });
  });
  
  // Whale announcement close
  const whaleAnn = document.getElementById('whale-announcement');
  const closeWhaleBtn = document.querySelector('.close-whale-announcement');
  if (whaleAnn && closeWhaleBtn) {
    closeWhaleBtn.addEventListener('click', () => {
      whaleAnn.style.display = 'none';
    });
  }
});
