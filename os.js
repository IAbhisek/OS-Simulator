// OS Simulator - Basic HTML/CSS/JS

const apps = [
  {
    id: 'terminal',
    name: 'Terminal',
    icon: '💻',
    content: `<div id='terminal-app'></div>`
  },
  {
    id: 'files',
    name: 'Files',
    icon: '🗂️',
    content: `<div id='file-manager-app'></div>`
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: '⚙️',
    content: `<div>Settings Panel<br><br><label><input type='checkbox' checked disabled> Futuristic Mode</label></div>`
  },
  {
    id: 'browser',
    name: 'Browser',
    icon: '🌐',
    content: `<div id='browser-app'></div>`
  },
  {
    id: 'camera',
    name: 'Camera',
    icon: '📷',
    content: `<div id='camera-app'></div>`
  },
  {
    id: 'notes',
    name: 'Notes',
    icon: '📝',
    content: `<div id='notes-app'></div>`
  }
];

const desktop = document.getElementById('desktop');

// Taskbar
const taskbar = document.createElement('div');
taskbar.className = 'taskbar';

desktop.appendChild(taskbar);

// App Launcher
const launcher = document.createElement('div');
launcher.className = 'app-launcher';
apps.forEach(app => {
  const icon = document.createElement('div');
  icon.className = 'app-icon';
  icon.title = app.name;
  icon.innerHTML = `<span style='font-size:1.5em;'>${app.icon}</span>`;
  icon.onclick = () => openAppWindow(app);
  launcher.appendChild(icon);
});
taskbar.appendChild(launcher);

// Window Management
let zIndexCounter = 20;
function openAppWindow(app) {
  // Prevent duplicate windows
  if (document.getElementById('window-' + app.id)) {
    bringToFront(document.getElementById('window-' + app.id));
    return;
  }
  const win = document.createElement('div');
  win.className = 'window';
  win.id = 'window-' + app.id;
  win.style.left = (80 + Math.random() * 300) + 'px';
  win.style.top = (60 + Math.random() * 120) + 'px';
  win.style.zIndex = zIndexCounter++;

  // Header
  const header = document.createElement('div');
  header.className = 'window-header';
  header.innerHTML = `<span class='window-title'>${app.icon} ${app.name}</span>`;
  // Controls
  const controls = document.createElement('div');
  controls.className = 'window-controls';
  controls.innerHTML = `
    <button class='window-btn min' title='Minimize'></button>
    <button class='window-btn max' title='Maximize'></button>
    <button class='window-btn close' title='Close'></button>
  `;
  header.appendChild(controls);
  win.appendChild(header);

  // Content
  const content = document.createElement('div');
  content.className = 'window-content';
  content.innerHTML = app.content;
  win.appendChild(content);

  // Add to desktop
  desktop.appendChild(win);

  // App logic
  if (app.id === 'terminal') launchTerminal(content);
  if (app.id === 'camera') launchCamera(content);
  if (app.id === 'notes') launchNotes(content);
  if (app.id === 'browser') launchBrowser(content);
  if (app.id === 'files') launchFileManager(content);

  // Dragging
  let isDragging = false, offsetX = 0, offsetY = 0;
  header.onmousedown = function(e) {
    isDragging = true;
    bringToFront(win);
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;
    document.body.style.userSelect = 'none';
  };
  document.onmousemove = function(e) {
    if (isDragging) {
      win.style.left = (e.clientX - offsetX) + 'px';
      win.style.top = (e.clientY - offsetY) + 'px';
    }
  };
  document.onmouseup = function() {
    isDragging = false;
    document.body.style.userSelect = '';
  };

  // Controls
  controls.querySelector('.close').onclick = () => win.remove();
  controls.querySelector('.min').onclick = () => win.style.display = 'none';
  controls.querySelector('.max').onclick = () => {
    if (win.classList.contains('maximized')) {
      win.classList.remove('maximized');
      win.style.left = win.dataset.prevLeft;
      win.style.top = win.dataset.prevTop;
      win.style.width = win.dataset.prevWidth;
      win.style.height = win.dataset.prevHeight;
    } else {
      win.classList.add('maximized');
      win.dataset.prevLeft = win.style.left;
      win.dataset.prevTop = win.style.top;
      win.dataset.prevWidth = win.style.width;
      win.dataset.prevHeight = win.style.height;
      win.style.left = '0px';
      win.style.top = '0px';
      win.style.width = '100vw';
      win.style.height = 'calc(100vh - 48px)';
    }
  };
}

function bringToFront(win) {
  win.style.zIndex = zIndexCounter++;
  win.style.display = '';
}

// Terminal App Implementation
function launchTerminal(container) {
  container.innerHTML = `<div id="terminal-output" style="height:220px;overflow-y:auto;font-family:monospace;font-size:1em;background:#181c2f;color:#0ff;padding:8px 6px 0 6px;border-radius:6px;">Welcome to the OS Terminal!<br>Type <b>help</b> for commands.<br></div>
    <form id="terminal-form" autocomplete="off" style="margin-top:8px;display:flex;gap:6px;">
      <span style="color:#0ff">user@os:~$</span>
      <input id="terminal-input" style="flex:1;background:#232347;color:#fff;border:none;padding:4px 8px;border-radius:4px;font-family:monospace;font-size:1em;outline:none;" autofocus />
    </form>`;
  const output = container.querySelector('#terminal-output');
  const form = container.querySelector('#terminal-form');
  const input = container.querySelector('#terminal-input');

  form.onsubmit = function(e) {
    e.preventDefault();
    const cmd = input.value.trim();
    if (!cmd) return;
    printToTerminal(`<span style='color:#0ff'>user@os:~$</span> <span style='color:#fff'>${escapeHTML(cmd)}</span>`);
    handleCommand(cmd);
    input.value = '';
  };

  function printToTerminal(html) {
    output.innerHTML += html + '<br>';
    output.scrollTop = output.scrollHeight;
  }

  function handleCommand(cmd) {
    const [base, ...args] = cmd.split(' ');
    switch (base) {
      case 'help':
        printToTerminal('Available commands: <b>help</b>, <b>clear</b>, <b>echo</b>, <b>date</b>');
        break;
      case 'clear':
        output.innerHTML = '';
        break;
      case 'echo':
        printToTerminal(args.join(' '));
        break;
      case 'date':
        printToTerminal(new Date().toString());
        break;
      default:
        printToTerminal(`<span style='color:#f55'>Unknown command:</span> ${escapeHTML(base)}`);
    }
  }

  function escapeHTML(str) {
    return str.replace(/[&<>"']/g, function(tag) {
      const chars = {
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
      };
      return chars[tag] || tag;
    });
  }
}

// Camera App Implementation
function launchCamera(container) {
  container.innerHTML = `<video id='cam-video' autoplay playsinline style='width:100%;max-height:180px;border-radius:8px;background:#222'></video><br><button id='cam-snap' style='margin:8px 0 0 0;padding:6px 16px;border-radius:6px;background:#27c93f;color:#fff;border:none;cursor:pointer;'>Take Snapshot</button><div id='cam-photos' style='margin-top:10px;display:flex;gap:8px;flex-wrap:wrap;'></div>`;
  const video = container.querySelector('#cam-video');
  const snapBtn = container.querySelector('#cam-snap');
  const photos = container.querySelector('#cam-photos');
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      video.srcObject = stream;
    }).catch(() => {
      video.style.display = 'none';
      snapBtn.style.display = 'none';
      photos.innerHTML = '<span style="color:#f55">Camera not available.</span>';
    });
  } else {
    video.style.display = 'none';
    snapBtn.style.display = 'none';
    photos.innerHTML = '<span style="color:#f55">Camera not supported.</span>';
  }
  snapBtn.onclick = function() {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const img = document.createElement('img');
    img.src = canvas.toDataURL('image/png');
    img.style.maxWidth = '80px';
    img.style.borderRadius = '6px';
    img.style.border = '1px solid #ccc';
    photos.appendChild(img);
  };
}

// Notes App Implementation
function launchNotes(container) {
  container.innerHTML = `<div style='display:flex;gap:8px;margin-bottom:8px;'><input id='note-input' style='flex:1;padding:6px 8px;border-radius:5px;border:1px solid #ccc;font-size:1em;'><button id='note-add' style='padding:6px 14px;border-radius:5px;background:#3a1c71;color:#fff;border:none;cursor:pointer;'>Add</button></div><ul id='note-list' style='list-style:none;padding:0;margin:0;'></ul>`;
  const input = container.querySelector('#note-input');
  const addBtn = container.querySelector('#note-add');
  const list = container.querySelector('#note-list');
  let notes = JSON.parse(localStorage.getItem('os-notes') || '[]');
  function renderNotes() {
    list.innerHTML = '';
    notes.forEach((note, i) => {
      const li = document.createElement('li');
      li.style.cssText = 'background:#f5f5fa;margin-bottom:6px;padding:7px 10px;border-radius:5px;display:flex;justify-content:space-between;align-items:center;';
      li.innerHTML = `<span>${escapeHTML(note)}</span><button data-i='${i}' style='background:#ff5f56;border:none;border-radius:4px;color:#fff;padding:2px 8px;cursor:pointer;'>Delete</button>`;
      li.querySelector('button').onclick = function() {
        notes.splice(i, 1);
        localStorage.setItem('os-notes', JSON.stringify(notes));
        renderNotes();
      };
      list.appendChild(li);
    });
  }
  addBtn.onclick = function() {
    if (input.value.trim()) {
      notes.push(input.value.trim());
      localStorage.setItem('os-notes', JSON.stringify(notes));
      input.value = '';
      renderNotes();
    }
  };
  renderNotes();
  function escapeHTML(str) {
    return str.replace(/[&<>"']/g, function(tag) {
      const chars = {
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
      };
      return chars[tag] || tag;
    });
  }
}

// Browser App Implementation
function launchBrowser(container) {
  container.innerHTML = `<form id='browser-form' style='display:flex;gap:6px;margin-bottom:8px;'><input id='browser-url' style='flex:1;padding:6px 8px;border-radius:5px;border:1px solid #ccc;font-size:1em;' placeholder='Enter URL (https://...)'><button style='padding:6px 14px;border-radius:5px;background:#27c93f;color:#fff;border:none;cursor:pointer;'>Go</button></form><iframe id='browser-frame' style='width:100%;height:220px;border-radius:7px;border:1px solid #ccc;background:#fff;'></iframe>`;
  const form = container.querySelector('#browser-form');
  const urlInput = container.querySelector('#browser-url');
  const frame = container.querySelector('#browser-frame');
  form.onsubmit = function(e) {
    e.preventDefault();
    let url = urlInput.value.trim();
    if (!url) return;
    if (!/^https?:\/\//.test(url)) url = 'https://' + url;
    frame.src = url;
  };
}

// File Manager App Implementation
function launchFileManager(container) {
  // Simple in-memory file system
  let fs = JSON.parse(localStorage.getItem('os-fs') || '{"root":[]}');
  let cwd = 'root';
  container.innerHTML = `<div style='display:flex;gap:8px;margin-bottom:8px;'><button id='fm-up' style='padding:4px 10px;border-radius:5px;background:#3a1c71;color:#fff;border:none;cursor:pointer;'>Up</button><input id='fm-new' style='flex:1;padding:6px 8px;border-radius:5px;border:1px solid #ccc;font-size:1em;' placeholder='New file or folder'><button id='fm-add' style='padding:6px 14px;border-radius:5px;background:#27c93f;color:#fff;border:none;cursor:pointer;'>Add</button></div><ul id='fm-list' style='list-style:none;padding:0;margin:0;'></ul>`;
  const upBtn = container.querySelector('#fm-up');
  const newInput = container.querySelector('#fm-new');
  const addBtn = container.querySelector('#fm-add');
  const list = container.querySelector('#fm-list');
  function renderFS() {
    list.innerHTML = '';
    fs[cwd].forEach((item, i) => {
      const li = document.createElement('li');
      li.style.cssText = 'background:#f5f5fa;margin-bottom:6px;padding:7px 10px;border-radius:5px;display:flex;justify-content:space-between;align-items:center;';
      li.innerHTML = `<span>${item.type === 'folder' ? '📁' : '📄'} <b>${escapeHTML(item.name)}</b></span><span><button data-i='${i}' class='fm-open' style='background:#3a1c71;border:none;border-radius:4px;color:#fff;padding:2px 8px;cursor:pointer;margin-right:4px;'>Open</button><button data-i='${i}' class='fm-del' style='background:#ff5f56;border:none;border-radius:4px;color:#fff;padding:2px 8px;cursor:pointer;'>Delete</button></span>`;
      li.querySelector('.fm-del').onclick = function() {
        fs[cwd].splice(i, 1);
        localStorage.setItem('os-fs', JSON.stringify(fs));
        renderFS();
      };
      li.querySelector('.fm-open').onclick = function() {
        if (item.type === 'folder') {
          if (!fs[item.name]) fs[item.name] = [];
          cwd = item.name;
          renderFS();
        } else {
          alert('Opening file: ' + item.name);
        }
      };
      list.appendChild(li);
    });
  }
  addBtn.onclick = function() {
    const val = newInput.value.trim();
    if (!val) return;
    const isFolder = val.endsWith('/');
    const name = isFolder ? val.slice(0, -1) : val;
    if (!name) return;
    if (fs[cwd].some(item => item.name === name)) return alert('Name exists!');
    fs[cwd].push({ name, type: isFolder ? 'folder' : 'file' });
    if (isFolder && !fs[name]) fs[name] = [];
    localStorage.setItem('os-fs', JSON.stringify(fs));
    newInput.value = '';
    renderFS();
  };
  upBtn.onclick = function() {
    if (cwd !== 'root') {
      // Find parent
      for (let key in fs) {
        if (fs[key].some(item => item.type === 'folder' && item.name === cwd)) {
          cwd = key;
          renderFS();
          break;
        }
      }
    }
  };
  renderFS();
  function escapeHTML(str) {
    return str.replace(/[&<>"']/g, function(tag) {
      const chars = {
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
      };
      return chars[tag] || tag;
    });
  }
} 