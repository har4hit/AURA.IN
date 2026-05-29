import re, json

filepath = r"d:\AURA.IN\website\aura-in-v4.html"
with open(filepath, 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Extract CSS
style_match = re.search(r'<style>(.*?)</style>', html, re.DOTALL)
if style_match:
    css_content = style_match.group(1).strip()
else:
    print("Cannot find style tags")
    exit(1)

# 2. Extract JS
script_match = re.search(r'<script>(.*?)</script>', html, re.DOTALL)
if script_match:
    js_content = script_match.group(1).strip()
else:
    print("Cannot find script tags")
    exit(1)

# 3. Add to CSS
new_css = """
/* === SCROLLBAR === */
::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-track {
  background: var(--bg);
}
::-webkit-scrollbar-thumb {
  background: var(--border-mid);
  border-radius: 5px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--accent-border);
}

/* === MODALS === */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.8);
  backdrop-filter: blur(8px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}
.modal-overlay.open {
  opacity: 1;
  pointer-events: auto;
}
.modal-content {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  transform: translateY(20px) scale(0.95);
  transition: all 0.3s ease;
  padding: 40px;
}
.modal-overlay.open .modal-content {
  transform: translateY(0) scale(1);
}
.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: var(--text-dim);
  font-size: 24px;
  cursor: pointer;
  transition: color var(--t);
}
.modal-close:hover { color: var(--text); }
.modal-body h3 { font-size: 28px; margin-bottom: 12px; color: var(--text); }
.modal-body p { color: var(--text-mid); font-size: 15px; margin-bottom: 20px; line-height: 1.6; }

/* === COOKIE CONSENT === */
#cookie-banner {
  position: fixed;
  bottom: 24px;
  left: 24px;
  max-width: 340px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.5);
  transform: translateY(150%);
  transition: transform 0.4s var(--ease);
}
#cookie-banner.show {
  transform: translateY(0);
}
.cookie-text p {
  font-size: 13px;
  color: var(--text-mid);
  line-height: 1.5;
}
.cookie-text a {
  color: var(--accent-light);
  text-decoration: underline;
}
.cookie-buttons {
  display: flex;
  gap: 12px;
}
.cookie-buttons .btn {
  padding: 8px 16px;
  font-size: 13px;
  flex: 1;
  justify-content: center;
}
@media (max-width: 640px) {
  #cookie-banner { bottom: 16px; right: auto; left: 16px; max-width: calc(100% - 32px); }
  .modal-content { padding: 24px; margin: 16px; }
}

/* === SPINNER & NEW ANIMATIONS === */
.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: none;
}
.btn.loading .spinner { display: inline-block; }
.btn.loading .btn-text { display: none; }

@keyframes slideDownGH {
  from { opacity: 0; transform: translateY(-15px); }
  to { opacity: 1; transform: translateY(0); }
}
.gh-commit-item.new-item {
  animation: slideDownGH 0.4s var(--ease) forwards;
}
"""
css_content += "\n" + new_css

# 4. Add to JS
new_js = """
/* === DYNAMIC COPYRIGHT YEAR === */
(function() {
  const footerEl = document.getElementById('copyYear');
  if (footerEl) {
    footerEl.innerHTML = '&copy; ' + new Date().getFullYear() + ' aura.in. All rights reserved.';
  }
})();

/* === COOKIE BANNER === */
(function() {
  const banner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookieAccept');
  const declineBtn = document.getElementById('cookieDecline');
  if(banner && !localStorage.getItem('cookie_consent')) {
    setTimeout(() => { banner.classList.add('show'); }, 2000);
  }
  if(acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookie_consent', 'true');
      banner.classList.remove('show');
    });
  }
  if(declineBtn) {
    declineBtn.addEventListener('click', () => {
      localStorage.setItem('cookie_consent', 'false');
      banner.classList.remove('show');
    });
  }
})();

/* === PROJECT MODALS === */
(function() {
  const rows = document.querySelectorAll('.project-row');
  const overlay = document.getElementById('projectModal');
  const closeBtn = document.getElementById('modalClose');
  const modalBody = document.getElementById('modalBody');
  
  if(!overlay) return;
  
  rows.forEach(row => {
    row.addEventListener('click', (e) => {
      e.preventDefault();
      const title = row.querySelector('.project-text h3').textContent;
      const desc = row.querySelector('.project-text p').textContent;
      const techHTML = row.querySelector('.tech-badges').innerHTML;
      
      modalBody.innerHTML = `
        <h3>${title}</h3>
        <p>${desc}</p>
        <div style="margin-bottom: 24px;" class="tech-badges">${techHTML}</div>
        <p>This is a deeper dive into ${title}. Our case studies normally break down the challenges faced, technical architecture decisions, and iteration cycles. By optimizing core workflows and cutting latency, we shipped a seamless platform rapidly.</p>
        <a href="#" class="btn btn-primary" style="margin-top: 10px;">View Live Project &rarr;</a>
      `;
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });
  
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
  
  overlay.addEventListener('click', (e) => {
    if(e.target === overlay) {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
})();
"""

# Waitlist Logic modification in JS
js_content = re.sub(
    r"btn\.textContent = 'Joined!';[\s\S]*?btn\.disabled = true;[\s\S]*?input\.value = '';[\s\S]*?msg\.classList\.add\('show'\);[\s\S]*?setTimeout\(\(\) => \{[\s\S]*?btn\.textContent = 'Join →';[\s\S]*?btn\.disabled = false;[\s\S]*?msg\.classList\.remove\('show'\);[\s\S]*?\}, 4000\);",
    """
    btn.disabled = true;
    btn.classList.add('loading');
    setTimeout(() => {
      btn.classList.remove('loading');
      btn.innerHTML = '<span class=\"btn-text\">Joined!</span>';
      input.value = '';
      msg.classList.add('show');
      setTimeout(() => {
        btn.innerHTML = '<span class=\"btn-text\">Join &rarr;</span>';
        btn.disabled = false;
        msg.classList.remove('show');
      }, 4000);
    }, 800);
    """.strip(),
    js_content
)

gh_update = """
    // Prepend new commit to the feed
    const htmlStr = `
      <div class="gh-commit-item new-item">
        <div class="gh-commit-icon">${svgCommit}</div>
        <div class="gh-commit-body">
          <div class="gh-commit-msg">${newCommit.msg}</div>
          <div class="gh-commit-meta">
            <span class="gh-commit-repo">${newCommit.repo}</span>
            <span class="gh-commit-time">${newCommit.time}</span>
            <span class="gh-commit-sha">${newCommit.sha}</span>
          </div>
        </div>
      </div>
    `;
    commitContainer.insertAdjacentHTML('afterbegin', htmlStr);
    
    // Remove last item to keep list same size
    if (commitContainer.children.length > 8) {
      commitContainer.removeChild(commitContainer.lastElementChild);
    }
    
    // Remove new-item class after animation finishes
    setTimeout(() => {
      if(commitContainer.firstElementChild) {
        commitContainer.firstElementChild.classList.remove('new-item');
      }
    }, 500);
"""
js_content = js_content.replace("// Update countEl to simulate live activity", gh_update + "\n    // Update countEl to simulate live activity")

js_content += "\n" + new_js

# Save split files
with open(r"d:\AURA.IN\website\style.css", 'w', encoding='utf-8') as f:
    f.write(css_content)

with open(r"d:\AURA.IN\website\main.js", 'w', encoding='utf-8') as f:
    f.write(js_content)

# Update HTML Structure
new_html = html.replace(style_match.group(0), '<link rel="stylesheet" href="style.css" />')
new_html = new_html.replace(script_match.group(0), '<script src="main.js" defer></script>')

# Add Analytics script
analytics_placeholder = '  <!-- Privacy-first Analytics Placeholder -->\n  <script defer data-domain="aura.in" src="https://plausible.io/js/script.js"></script>'
new_html = new_html.replace('</head>', f'{analytics_placeholder}\n</head>')

# Replace waitlist button
new_html = new_html.replace('<button class="btn btn-primary" id="waitlistBtn">Join &rarr;</button>', '<button class="btn btn-primary" id="waitlistBtn"><span class="btn-text">Join &rarr;</span><span class="spinner"></span></button>')

# Copyright year id
new_html = new_html.replace('<span>&copy; 2026 aura.in. All rights reserved.</span>', '<span id="copyYear">&copy; 2026 aura.in. All rights reserved.</span>')

# Newsletter Checkbox (inject randomly before the submit btn)
contact_btn_idx = new_html.find('<button type="submit" class="btn btn-primary">Send Message &rarr;</button>')
newsletter_html = '''<div class="form-group checkbox-group" style="margin-bottom: 24px;">
              <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; text-transform: none; letter-spacing: normal;">
                <input type="checkbox" id="fnewsletter" style="width: auto; padding: 0; margin: 0; outline: none;" />
                <span style="font-size: 14px; color: var(--text-mid);">Subscribe to quarterly updates for aura.in</span>
              </label>
            </div>
            '''
new_html = new_html[:contact_btn_idx] + newsletter_html + new_html[contact_btn_idx:]

# Modals and Cookie Consent
body_end_idx = new_html.find('</body>')
extra_html = """
  <!-- COOKIE CONSENT -->
  <div id="cookie-banner">
    <div class="cookie-text">
      <p>We use tracking cookies to understand how you interact with our website. By accepting, you agree to our use of these cookies. <a href="#">Learn more</a>.</p>
    </div>
    <div class="cookie-buttons">
      <button class="btn btn-ghost" id="cookieDecline">Decline</button>
      <button class="btn btn-primary" id="cookieAccept">Accept</button>
    </div>
  </div>

  <!-- MODAL CONTAINER -->
  <div class="modal-overlay" id="projectModal">
    <div class="modal-content">
      <button class="modal-close" id="modalClose">&times;</button>
      <div class="modal-body" id="modalBody">
        <!-- Injected content -->
      </div>
    </div>
  </div>
"""
new_html = new_html[:body_end_idx] + extra_html + new_html[body_end_idx:]

with open(r"d:\AURA.IN\website\aura-in-v4.html", 'w', encoding='utf-8') as f:
    f.write(new_html)

# Create 404 page derived from aura-in-v4.html
# Need to swap out the hero section and everything after it up to footer
html_404 = new_html.replace('<title>aura.in — App & Game Development Studio</title>', '<title>404 — Page Not Found | aura.in</title>')
html_404 = html_404.replace('<a href="#hero" class="nav-logo">aura<span>.in</span></a>', '<a href="aura-in-v4.html" class="nav-logo">aura<span>.in</span></a>')

hero_start = html_404.find('<!-- HERO -->')
footer_start = html_404.find('<!-- FOOTER -->')
not_found_hero = '''
  <!-- 404 HERO -->
  <section id="hero" style="min-height: 80vh;">
    <div class="hero-bg-glow"></div>
    <div class="hero-inner reveal in" style="opacity:1; transform:none;">
      <div class="hero-badge" style="color:#ff6b6b; border-color: rgba(255,107,107,0.3); background: rgba(255,107,107,0.1);">Error 404</div>
      <h1>Lost in <span class="hero-accent">space.</span></h1>
      <p class="hero-sub" style="margin-bottom: 32px">The page you're looking for was either unbuilt or deleted. Let's get you back to the shipping dock.</p>
      <div class="hero-buttons">
        <a href="aura-in-v4.html" class="btn btn-primary">&larr; Back to Home</a>
      </div>
    </div>
  </section>
'''
if hero_start > -1 and footer_start > -1:
    html_404 = html_404[:hero_start] + not_found_hero + html_404[footer_start:]

# Remove cookie banner and modals from 404 as well
body_end_404 = html_404.find('<!-- COOKIE CONSENT -->')
if body_end_404 > -1:
    html_404 = html_404[:body_end_404] + "</body>\n</html>"

with open(r"d:\AURA.IN\website\404.html", 'w', encoding='utf-8') as f:
    f.write(html_404)

# Create package.json for minification tasks
pkg = {
  "name": "aurain-website",
  "version": "1.0.0",
  "scripts": {
    "build:css": "npx clean-css-cli -o style.min.css style.css",
    "build:js": "npx terser main.js -c -m -o main.min.js",
    "build:html": "npx html-minifier-terser --collapse-whitespace --remove-comments --remove-optional-tags --remove-redundant-attributes --remove-script-type-attributes --use-short-doctype -o index.min.html aura-in-v4.html",
    "build": "npm run build:css && npm run build:js && npm run build:html"
  }
}

with open(r"d:\AURA.IN\website\package.json", 'w', encoding='utf-8') as f:
    json.dump(pkg, f, indent=2)

print("SUCCESS: Code has been split, updated, and 404 page created.")
