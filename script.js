// ===== USERS DATABASE =====
var users = {
  'STU2024001': {pass:'student123', name:'BISHWA', role:'student', college:'Campus College', dept:'Computer Science', phone:'9876543210', email:'bishwa@college.com'},
  'STU2024002': {pass:'pass123',    name:'RAHUL',  role:'student', college:'Campus College', dept:'Computer Science', phone:'9876543211', email:'rahul@college.com'},
  'PROF001':    {pass:'prof123',    name:'Prof. Mehta', role:'professor', college:'Campus College', dept:'Computer Science', phone:'9876543212', email:'mehta@college.com'}
};

// ===== LOGIN =====
var role = 'student';

function setRole(r) {
  role = r;
  document.getElementById('bS').className = 'role-btn' + (r==='student' ? ' active-role' : '');
  document.getElementById('bP').className = 'role-btn' + (r==='professor' ? ' active-role' : '');
}

function doLogin() {
  var id = document.getElementById('LI').value.trim();
  var pass = document.getElementById('LP').value.trim();
  var err = document.getElementById('LE');
  fetch('https://campus-saathi-bdzx.onrender.com/api/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({college_id: id, password: pass, role: role})
  })
  .then(r => r.json())
  .then(data => {
    if(data.error) {
      err.style.display = 'block';
    } else {
      document.getElementById('LS').style.display = 'none';
      document.getElementById('WM').innerText = 'Welcome, ' + data.name + ' 👋';
      err.style.display = 'none';
      loadTimetable();
    }
  });
}

function doLogout() {
  document.getElementById('LS').style.display = 'flex';
  document.getElementById('LI').value = '';
  document.getElementById('LP').value = '';
  document.getElementById('LE').style.display = 'none';
}

// ===== SIGNUP =====
var signupRole = 'student';

function setSignupRole(r) {
  signupRole = r;
  var bS = document.getElementById('sbS');
  var bP = document.getElementById('sbP');
  if(r === 'student') {
    bS.className = 'role-btn active-role';
    bP.className = 'role-btn';
  } else {
    bS.className = 'role-btn';
    bP.className = 'role-btn active-role';
  }
}

function showSignup() {
  document.getElementById('LS').style.display = 'none';
  var sp = document.getElementById('SP');
  sp.style.display = 'flex';
  sp.scrollTop = 0;
}

function showLogin() {
  document.getElementById('SP').style.display = 'none';
  document.getElementById('LS').style.display = 'flex';
  document.getElementById('SE').style.display = 'none';
  document.getElementById('SS').style.display = 'none';
}

function doSignup() {
  var name = document.getElementById('s-name').value.trim();
  var gender = document.getElementById('s-gender').value;
  var college = document.getElementById('s-college').value.trim();
  var id = document.getElementById('s-id').value.trim();
  var email = document.getElementById('s-email').value.trim();
  var phone = document.getElementById('s-phone').value.trim();
  var dept = document.getElementById('s-dept').value.trim();
  var pass = document.getElementById('s-pass').value;
  var cpass = document.getElementById('s-cpass').value;
  var err = document.getElementById('SE');
  var errMsg = document.getElementById('SE-msg');
  var succ = document.getElementById('SS');

  if(!name||!gender||!college||!id||!email||!phone||!dept||!pass||!cpass){
    errMsg.textContent='Please fill all fields!';
    err.style.display='block';
    succ.style.display='none';
    return;
  }
  if(pass !== cpass){
    errMsg.textContent='Passwords do not match!';
    err.style.display='block';
    return;
  }

  fetch('https://campus-saathi-bdzx.onrender.com/api/signup', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({name,gender,college,college_id:id,email,phone,dept,password:pass,role:signupRole})
  })
  .then(r => r.json())
  .then(data => {
    if(data.error){
      errMsg.textContent = data.error;
      err.style.display = 'block';
    } else {
      err.style.display = 'none';
      succ.innerHTML = '✅ Account created! Please login.';
      succ.style.display = 'block';
      setTimeout(function(){
        showLogin();
        document.getElementById('LI').value = id;
      }, 2000);
    }
  });
}

// ===== TABS =====
function showTab(name, btn) {
  document.querySelectorAll('.section').forEach(function(s){ s.classList.remove('active'); });
  document.querySelectorAll('.tab').forEach(function(t){ t.classList.remove('active'); });
  document.getElementById(name).classList.add('active');
  btn.classList.add('active');
}

// ===== RIDE SHARE =====

// ===== RIDE JOIN =====
var activeRide = null; // Track current joined ride

function joinRide(btn) {
  // Check if already on a ride
  if(activeRide !== null) {
    alert('⚠️ You are already on a ride!\nPlease cancel your current ride before joining another.');
    return;
  }

  // Join the ride
  activeRide = btn;
  btn.textContent = '✅ Joined!';
  btn.disabled = true;
  btn.style.background = 'rgba(46,204,113,0.2)';
  btn.style.color = '#2ecc71';

  // Add Cancel button next to it
  var cancelBtn = document.createElement('button');
  cancelBtn.className = 'btn-sm';
  cancelBtn.textContent = '❌ Cancel Ride';
  cancelBtn.style.cssText = 'background:rgba(231,76,60,0.2);color:#e74c3c;border:1px solid rgba(231,76,60,0.3);';
  cancelBtn.onclick = function() {
    cancelRide(btn, cancelBtn);
  };
  btn.parentNode.insertBefore(cancelBtn, btn.nextSibling);

  // Show notification
  if('Notification' in window && Notification.permission === 'granted') {
    new Notification('🚗 Ride Joined - Campus साथी', {
      body: 'You have successfully joined a ride! Have a safe journey.',
      icon: 'logo.png'
    });
  }
}

function cancelRide(joinBtn, cancelBtn) {
  // Confirm before cancelling
  if(!confirm('Are you sure you want to cancel this ride?')) return;

  // Reset everything
  activeRide = null;
  joinBtn.textContent = '🚗 Join Ride';
  joinBtn.disabled = false;
  joinBtn.style.background = '';
  joinBtn.style.color = '';
  cancelBtn.remove();

  alert('✅ Ride cancelled! You can now join another ride.');
}

function postRide() {
  var n  = document.getElementById('rN').value;
  var r  = document.getElementById('rR').value;
  var f  = document.getElementById('rF').value;
  var t  = document.getElementById('rT').value;
  var tm = document.getElementById('rTm').value;
  var s  = document.getElementById('rSt').value;
  if(!n||!f||!t||!tm){ alert('Please fill all fields!'); return; }
  var c = r==='Professor' ? 'gold' : 'blue';
  var card = document.createElement('div');
  card.className = 'ride-card';
  card.innerHTML =
    '<div class="ride-avatar">'+n[0].toUpperCase()+'</div>' +
    '<div class="ride-info">' +
      '<h3>'+n+' &nbsp;<span class="badge '+c+'">'+r+'</span></h3>' +
      '<p>📍 From: '+f+' → 🏁 To: '+t+'</p>' +
      '<div class="ride-meta">🕒 '+tm+' | '+s+' seat(s)</div>' +
      '<div class="ride-actions">' +
        '<button class="btn-sm btn-ride" onclick="joinRide(this)">🚗 Join Ride</button>' +
        '<button class="btn-sm btn-msg" onclick="openMsg(\''+n+'\')">💬 Message</button>' +
      '</div>' +
    '</div>';
  document.getElementById('RL').prepend(card);
  document.getElementById('RM').classList.remove('open');
  document.getElementById('rN').value='';
  document.getElementById('rF').value='';
  document.getElementById('rT').value='';
  document.getElementById('rTm').value='';
  checkWaitingPassengers(f, t);
  alert('✅ Ride posted!');
}

// ===== LOST & FOUND =====
var lfEmojis = {
  'backpack':'🎒','bag':'👜','key':'🔑','phone':'📱',
  'bottle':'💧','book':'📚','wallet':'👛','glasses':'👓','umbrella':'☂️'
};

function postLF() {
  var name   = document.getElementById('lfName').value;
  var status = document.getElementById('lfStatus').value;
  var item   = document.getElementById('lfItem').value;
  var desc   = document.getElementById('lfDesc').value;
  var loc    = document.getElementById('lfLoc').value;
  if(!name||!item||!desc||!loc){ alert('Please fill all fields!'); return; }
  var emoji = '📦';
  for(var k in lfEmojis){ if(item.toLowerCase().includes(k)){ emoji=lfEmojis[k]; break; } }
  var bc = status==='Lost' ? 'red' : 'green';
  var card = document.createElement('div');
  card.className = 'lf-card';
  card.innerHTML =
    '<div class="lf-emoji">'+emoji+'</div>' +
    '<div class="lf-body">' +
      '<span class="badge '+bc+'">'+status+'</span>' +
      '<h3>'+item+'</h3><p>'+desc+'</p>' +
      '<small>📍 '+loc+' | '+name+'</small>' +
    '</div>';
  document.getElementById('LFL').prepend(card);
  document.getElementById('LFM').classList.remove('open');
  document.getElementById('lfName').value='';
  document.getElementById('lfItem').value='';
  document.getElementById('lfDesc').value='';
  document.getElementById('lfLoc').value='';
  alert('✅ Item posted!');
}

// ===== MESSAGE =====
var chatHistory = {};
function openMsg(name) {
  document.getElementById('MR').textContent = name;
  if(document.getElementById('MRAvatar'))
    document.getElementById('MRAvatar').textContent = name.charAt(0).toUpperCase();
  var box = document.getElementById('chatMessages');
  var key = name;
  box.innerHTML = '<div style="text-align:center;"><span style="background:rgba(255,255,255,0.07);color:rgba(255,255,255,0.4);font-size:0.72rem;padding:0.3rem 0.8rem;border-radius:20px;">🔒 Private — only you two can see this</span></div>';
  if(chatHistory[key]) {
    chatHistory[key].forEach(function(m) { appendBubble(m.text, m.mine); });
  }
  document.getElementById('MM').classList.add('open');
  box.scrollTop = box.scrollHeight;
}
function closeMsg() {
  document.getElementById('MM').classList.remove('open');
  document.getElementById('MT').value = '';
}
function sendMsg() {
  var txt = document.getElementById('MT').value.trim();
  if(!txt) return;
  var name = document.getElementById('MR').textContent;
  if(!chatHistory[name]) chatHistory[name] = [];
  chatHistory[name].push({text:txt, mine:true});
  appendBubble(txt, true);
  document.getElementById('MT').value = '';
  var box = document.getElementById('chatMessages');
  box.scrollTop = box.scrollHeight;
}
function appendBubble(text, mine) {
  var box = document.getElementById('chatMessages');
  var div = document.createElement('div');
  div.style.cssText = 'display:flex;justify-content:'+(mine?'flex-end':'flex-start')+';';
  div.innerHTML = '<div style="max-width:75%;background:'+(mine?'linear-gradient(135deg,#c9a84c,#e0b85c);color:#1a2840':'rgba(255,255,255,0.1);color:white')+';padding:0.55rem 0.9rem;border-radius:'+(mine?'14px 14px 4px 14px':'14px 14px 14px 4px')+';font-size:0.85rem;line-height:1.4;">'+text+'</div>';
  box.appendChild(div);
}

// ===== FLOATING STARS =====
function createStars() {
  var emojis = ['✨','⭐','🌟','💫','★','·'];
  for(var i = 0; i < 18; i++) {
    var star = document.createElement('div');
    star.className = 'star-particle';
    star.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    star.style.left = Math.random() * 100 + 'vw';
    star.style.animationDelay = Math.random() * 6 + 's';
    star.style.animationDuration = (4 + Math.random() * 5) + 's';
    star.style.fontSize = (0.5 + Math.random() * 1) + 'rem';
    star.style.color = Math.random() > 0.5 ? '#c9a84c' : 'rgba(255,255,255,0.7)';
    document.body.appendChild(star);
  }
}
createStars();

// ===== PROFILE =====
var currentUserId = '';

function showProfile() {
  currentUserId = document.getElementById('LI').value.trim();
  var user = users[currentUserId];
  if(!user) return;

  // Fill profile info
  document.getElementById('profileAvatar').textContent = user.name.charAt(0).toUpperCase();
  document.getElementById('profileName').textContent = user.name;
  document.getElementById('profileId').textContent = currentUserId;
  document.getElementById('profileEmail').textContent = user.email || '—';
  document.getElementById('profilePhone').textContent = user.phone || '—';
  document.getElementById('profileDept').textContent = user.dept || '—';
  document.getElementById('profileCollegeName').textContent = user.college || '—';
  document.getElementById('profileGender').textContent = user.gender
    ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : '—';

  // Role badge
  var roleEl = document.getElementById('profileRole');
  roleEl.innerHTML = user.role === 'professor'
    ? '<span class="badge gold">👨‍🏫 Professor</span>'
    : '<span class="badge blue">🎒 Student</span>';

  document.getElementById('profileCollege').textContent = user.college || '';

  // Count posted items
  var rideCount = document.querySelectorAll('#RL .ride-card').length;
  var resCount  = document.querySelectorAll('#resourcesList .res-card[data-poster="'+currentUserId+'"]').length;
  var evCount   = document.querySelectorAll('#eventsList .event-card-new[data-poster="'+currentUserId+'"]').length;

  document.getElementById('statRides').textContent = rideCount;
  document.getElementById('statResources').textContent = resCount;
  document.getElementById('statEvents').textContent = evCount;

  // My posted items
  var itemsDiv = document.getElementById('myPostedItems');
  var items = [];

  document.querySelectorAll('#resourcesList .res-card[data-poster="'+currentUserId+'"]').forEach(function(card) {
    var title = card.querySelector('.res-title');
    if(title) items.push({icon:'📚', text: title.textContent, type:'Resource'});
  });

  document.querySelectorAll('#eventsList .event-card-new[data-poster="'+currentUserId+'"]').forEach(function(card) {
    var title = card.querySelector('.event-title');
    if(title) items.push({icon:'🎉', text: title.textContent, type:'Event'});
  });

  document.querySelectorAll('#LFL .lf-card').forEach(function(card) {
    var title = card.querySelector('h3');
    if(title) items.push({icon:'🔍', text: title.textContent, type:'Lost & Found'});
  });

  if(items.length > 0) {
    itemsDiv.innerHTML = items.map(function(item) {
      return '<div style="display:flex;align-items:center;gap:0.75rem;padding:0.6rem 0.8rem;background:rgba(255,255,255,0.05);border-radius:8px;margin-bottom:0.5rem;">' +
        '<span style="font-size:1.1rem;">'+item.icon+'</span>' +
        '<div style="flex:1;"><div style="color:white;font-size:0.85rem;font-weight:600;">'+item.text+'</div>' +
        '<div style="color:rgba(255,255,255,0.4);font-size:0.72rem;">'+item.type+'</div></div>' +
        '</div>';
    }).join('');
  } else {
    itemsDiv.innerHTML = '<p style="color:rgba(255,255,255,0.3);font-size:0.85rem;text-align:center;padding:1rem;">No items posted yet</p>';
  }

  document.getElementById('ProfileModal').style.display = 'block';
  window.scrollTo({top:0, behavior:'smooth'});
}

function closeProfile() {
  document.getElementById('ProfileModal').style.display = 'none';
}

function openEditProfile() {
  var user = users[currentUserId];
  if(!user) return;

  // Profile content hide karo
  document.getElementById('profileAvatar').closest('div').style.display = 'none';

  // Edit form seedha profile page mein inject karo
  var modal = document.getElementById('ProfileModal');
  var editDiv = document.getElementById('inlineEditForm');
  if(editDiv) editDiv.remove();

  var form = document.createElement('div');
  form.id = 'inlineEditForm';
  form.style.cssText = 'max-width:700px;margin:0 auto;padding:1.5rem;';
  form.innerHTML =
    '<button onclick="closeInlineEdit()" style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);color:white;padding:0.5rem 1.2rem;border-radius:20px;cursor:pointer;font-size:0.85rem;font-weight:600;margin-bottom:1.5rem;font-family:Plus Jakarta Sans,sans-serif;">← Back</button>' +
    '<div style="background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.12);border-radius:20px;padding:2rem;">' +
      '<h3 style="color:white;font-family:Playfair Display,serif;font-size:1.3rem;margin-bottom:1.5rem;">✏️ Edit Profile</h3>' +
      '<div class="fg"><label style="color:rgba(255,255,255,0.7);">Full Name</label><input type="text" id="ep-name" value="'+(user.name||'')+'" class="login-input" style="margin-bottom:0;"/></div>' +
      '<div class="fg" style="margin-top:0.75rem;"><label style="color:rgba(255,255,255,0.7);">Email</label><input type="email" id="ep-email" value="'+(user.email||'')+'" class="login-input" style="margin-bottom:0;"/></div>' +
      '<div class="fg" style="margin-top:0.75rem;"><label style="color:rgba(255,255,255,0.7);">Phone</label><input type="tel" id="ep-phone" value="'+(user.phone||'')+'" class="login-input" style="margin-bottom:0;"/></div>' +
      '<div class="fg" style="margin-top:0.75rem;"><label style="color:rgba(255,255,255,0.7);">Department</label><input type="text" id="ep-dept" value="'+(user.dept||'')+'" class="login-input" style="margin-bottom:0;"/></div>' +
      '<div class="fg" style="margin-top:0.75rem;"><label style="color:rgba(255,255,255,0.7);">College Name</label><input type="text" id="ep-college" value="'+(user.college||'')+'" class="login-input" style="margin-bottom:0;"/></div>' +
      '<div class="fg" style="margin-top:0.75rem;"><label style="color:rgba(255,255,255,0.7);">Gender</label>' +
        '<select id="ep-gender" class="login-input" style="margin-bottom:0;">' +
          '<option value="male" '+(user.gender==='male'?'selected':'')+'>Male</option>' +
          '<option value="female" '+(user.gender==='female'?'selected':'')+'>Female</option>' +
          '<option value="other" '+(user.gender==='other'?'selected':'')+'>Other</option>' +
        '</select>' +
      '</div>' +
      '<button onclick="saveProfile()" class="btn btn-gold" style="margin-top:1.5rem;width:100%;padding:0.85rem;">Save Changes ✅</button>' +
    '</div>';

  modal.appendChild(form);
  modal.scrollTop = 0;
}

function closeInlineEdit() {
  var editDiv = document.getElementById('inlineEditForm');
  if(editDiv) editDiv.remove();
  document.getElementById('profileAvatar').closest('div').style.display = 'flex';
  showProfile();
}

function saveProfile() {
  var user = users[currentUserId];
  if(!user) return;
  user.name    = document.getElementById('ep-name').value.trim()    || user.name;
  user.email   = document.getElementById('ep-email').value.trim()   || user.email;
  user.phone   = document.getElementById('ep-phone').value.trim()   || user.phone;
  user.dept    = document.getElementById('ep-dept').value.trim()    || user.dept;
  user.college = document.getElementById('ep-college').value.trim() || user.college;
  user.gender  = document.getElementById('ep-gender').value;
  document.getElementById('WM').textContent = 'Welcome, ' + user.name + ' 👋';
  closeInlineEdit();
}

function changePassword() {
  var oldPass  = document.getElementById('cpOld').value;
  var newPass  = document.getElementById('cpNew').value;
  var confirm  = document.getElementById('cpConfirm').value;
  var msgEl    = document.getElementById('cpMsg');
  var user     = users[currentUserId];

  msgEl.style.display = 'block';

  if(!oldPass || !newPass || !confirm) {
    msgEl.style.background = 'rgba(231,76,60,0.2)';
    msgEl.style.color = '#e74c3c';
    msgEl.textContent = '❌ Please fill all fields!';
    return;
  }
  if(user.pass !== oldPass) {
    msgEl.style.background = 'rgba(231,76,60,0.2)';
    msgEl.style.color = '#e74c3c';
    msgEl.textContent = '❌ Current password is wrong!';
    return;
  }
  if(newPass !== confirm) {
    msgEl.style.background = 'rgba(231,76,60,0.2)';
    msgEl.style.color = '#e74c3c';
    msgEl.textContent = '❌ New passwords do not match!';
    return;
  }
  if(newPass.length < 6) {
    msgEl.style.background = 'rgba(231,76,60,0.2)';
    msgEl.style.color = '#e74c3c';
    msgEl.textContent = '❌ Password must be at least 6 characters!';
    return;
  }

  user.pass = newPass;
  msgEl.style.background = 'rgba(46,204,113,0.2)';
  msgEl.style.color = '#2ecc71';
  msgEl.textContent = '✅ Password changed successfully!';

  document.getElementById('cpOld').value = '';
  document.getElementById('cpNew').value = '';
  document.getElementById('cpConfirm').value = '';
}


// ===== TIMETABLE =====
var timeSlots = [
  '9:00 AM – 10:00 AM',
  '10:00 AM – 11:00 AM',
  '11:00 AM – 12:00 PM',
  '12:00 PM – 1:00 PM',
  '1:00 PM – 2:00 PM (Lunch)',
  '2:00 PM – 3:00 PM',
  '3:00 PM – 4:00 PM',
  '4:00 PM – 5:00 PM'
];

var days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var dayShort = ['mon','tue','wed','thu','fri','sat'];

var typeColors = {
  lecture:  {bg:'rgba(52,152,219,0.25)',  color:'#5dade2'},
  lab:      {bg:'rgba(46,204,113,0.25)',  color:'#2ecc71'},
  tutorial: {bg:'rgba(155,89,182,0.25)', color:'#bb8fce'},
  seminar:  {bg:'rgba(243,156,18,0.25)', color:'#f0b27a'},
  free:     {bg:'rgba(231,76,60,0.18)',   color:'#e74c3c'}
};

// Timetable data — per user
var ttData = {};

function getTTKey() {
  var id = document.getElementById('LI').value.trim();
  return 'tt_' + id;
}

function loadTimetable() {
  var key = getTTKey();
  if(!ttData[key]) ttData[key] = {};
  renderTimetable();
  updateTodayBanner();
}

function renderTimetable() {
  var key  = getTTKey();
  var data = ttData[key] || {};
  var body = document.getElementById('ttBody');
  if(!body) return;
  body.innerHTML = '';

  // Highlight today
  var todayIdx = new Date().getDay() - 1; // 0=Mon...5=Sat
  days.forEach(function(day, di) {
    var th = document.getElementById('th-' + dayShort[di]);
    if(!th) return;
    if(di === todayIdx) {
      th.className = 'tt-today-header';
    } else {
      th.className = '';
    }
  });

  timeSlots.forEach(function(slot) {
    var tr = document.createElement('tr');
    // Time column
    var tdTime = document.createElement('td');
    tdTime.style.cssText = 'padding:0.6rem 0.8rem;color:rgba(255,255,255,0.6);font-size:0.75rem;font-weight:600;white-space:nowrap;border-bottom:1px solid rgba(255,255,255,0.06);text-align:left;';
    tdTime.textContent = slot;
    tr.appendChild(tdTime);

    days.forEach(function(day, di) {
      var td = document.createElement('td');
      td.className = 'tt-cell' + (di === todayIdx ? ' tt-today-col' : '');

      var cellKey = slot + '_' + di;
      var cell = data[cellKey];

      if(cell) {
        var colors = typeColors[cell.type] || typeColors.lecture;
        var chip = document.createElement('span');
        chip.className = 'tt-subject';
        chip.style.background = colors.bg;
        chip.style.color = colors.color;
        chip.innerHTML = cell.subject + (cell.room ? '<br><small style="opacity:0.7;font-size:0.65rem;">'+cell.room+'</small>' : '');
        chip.title = 'Click to delete';
        chip.onclick = function() { deleteTTClass(slot, di); };
        td.appendChild(chip);
      } else {
        td.innerHTML = '<span class="tt-empty">—</span>';
      }

      tr.appendChild(td);
    });

    body.appendChild(tr);
  });
}

function updateTodayBanner() {
  var dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  var today = new Date();
  var dayName = dayNames[today.getDay()];
  var dateStr = today.toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'});

  document.getElementById('todayText').textContent = 'Today: ' + dayName + ', ' + dateStr;

  var todayIdx = today.getDay() - 1;
  var key = getTTKey();
  var data = ttData[key] || {};
  var todayClasses = [];

  if(todayIdx >= 0 && todayIdx <= 5) {
    timeSlots.forEach(function(slot) {
      var cellKey = slot + '_' + todayIdx;
      if(data[cellKey]) {
        todayClasses.push(data[cellKey].subject + ' (' + slot + ')');
      }
    });
  }

  if(todayClasses.length > 0) {
    document.getElementById('todayClasses').textContent = '📚 ' + todayClasses.join(' | ');
  } else {
    document.getElementById('todayClasses').textContent = today.getDay() === 0 ? '🎉 Sunday — No classes!' : 'No classes added for today yet.';
  }
}

function addTTClass() {
  var slot    = document.getElementById('ttTime').value;
  var dayIdx  = parseInt(document.getElementById('ttDay').value);
  var subject = document.getElementById('ttSubject').value.trim();
  var type    = document.getElementById('ttType').value;
  var room    = document.getElementById('ttRoom').value.trim();

  if(!subject) { alert('Please enter subject name!'); return; }

  var key = getTTKey();
  if(!ttData[key]) ttData[key] = {};

  var cellKey = slot + '_' + dayIdx;
  if(ttData[key][cellKey]) {
    if(!confirm(days[dayIdx] + ' ' + slot + ' already has "' + ttData[key][cellKey].subject + '". Replace it?')) return;
  }

  ttData[key][cellKey] = {subject:subject, type:type, room:room};
  document.getElementById('TTModal').classList.remove('open');
  document.getElementById('ttSubject').value = '';
  document.getElementById('ttRoom').value = '';
  renderTimetable();
  updateTodayBanner();
  alert('✅ Class added!');
}

function deleteTTClass(slot, dayIdx) {
  if(!confirm('Remove this class from timetable?')) return;
  var key = getTTKey();
  var cellKey = slot + '_' + dayIdx;
  if(ttData[key]) delete ttData[key][cellKey];
  renderTimetable();
  updateTodayBanner();
}


// ===== EVENTS =====
var eventReactions = {};

function eventReact(id, type, btn) {
  var key = id + '-' + type;
  var span = btn.querySelector('span');
  var count = parseInt(span.textContent);

  if(eventReactions[key]) {
    // Toggle off
    eventReactions[key] = false;
    span.textContent = count - 1;
    btn.classList.remove('active');
  } else {
    // Toggle on
    eventReactions[key] = true;
    span.textContent = count + 1;
    btn.classList.add('active');

    // Remove opposite reaction
    var card = btn.closest('.event-card-new');
    if(type === 'like') {
      var intBtn = card.querySelector('.ev-interested');
      var intKey = id + '-interested';
      if(eventReactions[intKey]) {
        eventReactions[intKey] = false;
        var intSpan = intBtn.querySelector('span');
        intSpan.textContent = parseInt(intSpan.textContent) - 1;
        intBtn.classList.remove('active');
      }
    } else if(type === 'interested') {
      var likeBtn = card.querySelector('.ev-like');
      var likeKey = id + '-like';
      if(eventReactions[likeKey]) {
        eventReactions[likeKey] = false;
        var likeSpan = likeBtn.querySelector('span');
        likeSpan.textContent = parseInt(likeSpan.textContent) - 1;
        likeBtn.classList.remove('active');
      }
    }
  }
}

function shareEvent(title) {
  if(navigator.share) {
    navigator.share({
      title: title + ' — Campus साथी',
      text: 'Check out this event on Campus साथी: ' + title,
      url: window.location.href
    });
  } else {
    var dummy = document.createElement('input');
    document.body.appendChild(dummy);
    dummy.value = window.location.href;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
    alert('🔗 Link copied! Share it with your friends.');
  }
}

function deleteEvent(id, poster) {
  var currentId = document.getElementById('LI').value.trim();
  if(currentId !== poster && currentId !== 'ADMIN') {
    alert('❌ You can only delete your own events!');
    return;
  }
  if(!confirm('Are you sure you want to delete this event?')) return;
  var card = document.querySelector('[data-id="'+id+'"]');
  if(card) {
    card.style.animation = 'fadeOut 0.3s ease forwards';
    setTimeout(function(){ card.remove(); }, 300);
  }
}

function toggleEvOther() {
  var val = document.getElementById('evClub').value;
  document.getElementById('evClubOther').style.display = val==='other' ? 'block' : 'none';
}

function toggleEvOpenOther() {
  var val = document.getElementById('evOpen').value;
  document.getElementById('evOpenOther').style.display = val==='other' ? 'block' : 'none';
}

function postEvent() {
  var title = document.getElementById('evTitle').value.trim();
  var desc  = document.getElementById('evDesc').value.trim();
  var club  = document.getElementById('evClub');
  var date  = document.getElementById('evDate').value;
  var time  = document.getElementById('evTime').value;
  var venue = document.getElementById('evVenue').value.trim();
  var openVal = document.getElementById('evOpen').value;
var open = openVal === 'other'
  ? (document.getElementById('evOpenOther').value.trim() || 'Other')
  : openVal;

  if(!title||!desc||!date||!venue) {
    alert('Please fill all required fields!');
    return;
  }

  var currentId = document.getElementById('LI').value.trim();
  var currentUser = users[currentId] || {name:'User'};
  var evId = 'ev' + Date.now();

  // Format date
  var d = new Date(date);
  var day   = d.getDate().toString().padStart(2,'0');
  var month = d.toLocaleString('en',{month:'short'}).toUpperCase();

  // Format time
  var timeStr = '';
  if(time) {
    var t = new Date('2000-01-01T'+time);
    timeStr = t.toLocaleTimeString('en',{hour:'2-digit',minute:'2-digit'});
  }

  var badgeColor = club.value === 'other' ? 'blue' : club.options[club.selectedIndex].value;
var clubName   = club.value === 'other'
  ? (document.getElementById('evClubOther').value.trim() || 'Other')
  : club.options[club.selectedIndex].text;

  var card = document.createElement('div');
  card.className = 'event-card-new';
  card.dataset.id = evId;
  card.dataset.poster = currentId;

  card.innerHTML =
    '<div class="event-left">' +
      '<div class="event-date">' +
        '<span class="day">'+day+'</span>' +
        '<span class="month">'+month+'</span>' +
      '</div>' +
    '</div>' +
    '<div class="event-right">' +
      '<div class="event-top-row">' +
        '<span class="badge '+badgeColor+'">'+clubName+'</span>' +
        '<div class="event-owner-btns">' +
          '<button class="event-del-btn" onclick="deleteEvent(\''+evId+'\',\''+currentId+'\')">🗑️</button>' +
        '</div>' +
      '</div>' +
      '<h3 class="event-title">'+title+'</h3>' +
      '<p class="event-desc">'+desc+'</p>' +
      '<div class="event-meta">📍 '+venue+' | 🕒 '+(timeStr||'TBD')+' | 👥 '+open+'</div>' +
      '<div class="event-btns-row">' +
        '<button class="ev-btn ev-like" onclick="eventReact(\''+evId+'\',\'like\',this)">👍 Like <span>0</span></button>' +
        '<button class="ev-btn ev-interested" onclick="eventReact(\''+evId+'\',\'interested\',this)">⭐ Interested <span>0</span></button>' +
        '<button class="ev-btn ev-share" onclick="shareEvent(\''+title+'\')">🔗 Share</button>' +
      '</div>' +
    '</div>';

  document.getElementById('eventsList').prepend(card);
  document.getElementById('EventModal').classList.remove('open');

  // Clear form
  ['evTitle','evDesc','evDate','evTime','evVenue'].forEach(function(id){
    document.getElementById(id).value = '';
  });

  alert('✅ Event posted successfully!');
}


// ===== RESOURCES =====
var currentResCat = 'all';
var currentResStream = 'all';
var currentResType = 'all';
var resourceRatings = {r1:[8,9,8,9,8], r2:[9,9,10,8,9], r3:[7,8,7,8,8]};
var resourceReactions = {r1:{likes:12,dislikes:2}, r2:{likes:8,dislikes:1}, r3:{likes:5,dislikes:0}};
var userReactions = {}; // track user reactions per resource
var reportedResources = {};

function setResCat(cat, btn) {
  currentResCat = cat;
  document.querySelectorAll('.res-cat-btn').forEach(function(b){ b.classList.remove('active-cat'); });
  btn.classList.add('active-cat');
  document.getElementById('plus2-filters').style.display = cat==='plus2' ? 'block' : 'none';
  document.getElementById('plus3-filters').style.display = cat==='plus3' ? 'block' : 'none';
  currentResStream = 'all';
  filterResources();
}

function setResStream(stream, btn, cat) {
  currentResStream = stream;
  var parent = btn.parentNode;
  parent.querySelectorAll('.res-sub-btn').forEach(function(b){ b.classList.remove('active-sub'); });
  btn.classList.add('active-sub');

  // Show subject filters for +2
  if(cat === 'plus2') {
    document.getElementById('plus2-science-subs').style.display = stream==='science' ? 'block' : 'none';
    document.getElementById('plus2-commerce-subs').style.display = stream==='commerce' ? 'block' : 'none';
    document.getElementById('plus2-arts-subs').style.display = stream==='arts' ? 'block' : 'none';
  }
  filterResources();
}

function setResSub(sub, btn) {
  var parent = btn.parentNode;
  parent.querySelectorAll('.res-sub-btn').forEach(function(b){ b.classList.remove('active-sub'); });
  btn.classList.add('active-sub');
  currentResStream = sub;
  filterResources();
}

function setResType(type, btn) {
  currentResType = type;
  document.querySelectorAll('.res-type-btn').forEach(function(b){ b.classList.remove('active-type'); });
  btn.classList.add('active-type');
  filterResources();
}

function filterResources() {
  var cards = document.querySelectorAll('#resourcesList .res-card');
  cards.forEach(function(card) {
    var cat    = card.dataset.cat;
    var stream = card.dataset.stream;
    var type   = card.dataset.type;

    var catMatch    = currentResCat === 'all' || cat === currentResCat;
    var streamMatch = currentResStream === 'all' || stream === currentResStream;
    var typeMatch   = currentResType === 'all' || type === currentResType;

    card.style.display = (catMatch && streamMatch && typeMatch) ? 'flex' : 'none';
  });
}

// ===== LIKE / DISLIKE =====

function likeResource(id, btn) {
  var card = btn.closest('.res-card');
  var dislikeBtn = card.querySelector('.dislike-btn');
  resourceReactions[id] = resourceReactions[id] || {likes:0, dislikes:0};

  if(userReactions[id] === 'liked') {
    // Already liked → Unlike (toggle off)
    resourceReactions[id].likes = Math.max(0, resourceReactions[id].likes - 1);
    userReactions[id] = null;
    btn.querySelector('span').textContent = resourceReactions[id].likes;
    btn.style.background = '';
    btn.style.color = '';
  } else {
    // If previously disliked → remove dislike
    if(userReactions[id] === 'disliked') {
      resourceReactions[id].dislikes = Math.max(0, resourceReactions[id].dislikes - 1);
      dislikeBtn.querySelector('span').textContent = resourceReactions[id].dislikes;
      dislikeBtn.style.background = '';
      dislikeBtn.style.color = '';
    }
    // Add like
    resourceReactions[id].likes += 1;
    userReactions[id] = 'liked';
    btn.querySelector('span').textContent = resourceReactions[id].likes;
    btn.style.background = 'rgba(46,204,113,0.25)';
    btn.style.color = '#2ecc71';
  }
}

function dislikeResource(id, btn) {
  var card = btn.closest('.res-card');
  var likeBtn = card.querySelector('.like-btn');
  resourceReactions[id] = resourceReactions[id] || {likes:0, dislikes:0};

  if(userReactions[id] === 'disliked') {
    // Already disliked → Un-dislike (toggle off)
    resourceReactions[id].dislikes = Math.max(0, resourceReactions[id].dislikes - 1);
    userReactions[id] = null;
    btn.querySelector('span').textContent = resourceReactions[id].dislikes;
    btn.style.background = '';
    btn.style.color = '';
  } else {
    // If previously liked → remove like
    if(userReactions[id] === 'liked') {
      resourceReactions[id].likes = Math.max(0, resourceReactions[id].likes - 1);
      likeBtn.querySelector('span').textContent = resourceReactions[id].likes;
      likeBtn.style.background = '';
      likeBtn.style.color = '';
    }
    // Add dislike
    resourceReactions[id].dislikes += 1;
    userReactions[id] = 'disliked';
    btn.querySelector('span').textContent = resourceReactions[id].dislikes;
    btn.style.background = 'rgba(231,76,60,0.25)';
    btn.style.color = '#e74c3c';
  }
}

// ===== RATING =====
function rateResource(id) {
  document.getElementById('ratingResId').value = id;
  document.getElementById('RateModal').classList.add('open');
}

function submitRating(score) {
  var id = document.getElementById('ratingResId').value;
  if(!resourceRatings[id]) resourceRatings[id] = [];
  resourceRatings[id].push(score);
  var avg = (resourceRatings[id].reduce(function(a,b){return a+b;},0) / resourceRatings[id].length).toFixed(1);
  var el = document.getElementById('rating-'+id);
  if(el) el.textContent = avg;
  document.getElementById('RateModal').classList.remove('open');
  alert('✅ Thanks for rating! Average: ' + avg + '/10');
}

// ===== REPORT =====
function reportResource(id) {
  if(reportedResources[id]) {
    alert('You have already reported this resource. Our team will review it.'); return;
  }
  var reason = prompt('Please describe why you are reporting this resource:');
  if(reason && reason.trim()) {
    reportedResources[id] = reason;
    alert('🚩 Reported successfully! Our team will review this resource.\nThank you for keeping Campus साथी safe.');
  }
}

// ===== DELETE RESOURCE =====
function deleteResource(id, poster) {
  var currentId = document.getElementById('LI').value.trim();
  if(currentId !== poster && currentId !== 'ADMIN') {
    alert('❌ You can only delete your own resources!'); return;
  }
  if(!confirm('Are you sure you want to delete this resource?')) return;
  var card = document.querySelector('[data-id="'+id+'"]');
  if(card) {
    card.style.animation = 'fadeOut 0.3s ease forwards';
    setTimeout(function(){ card.remove(); }, 300);
  }
}

// ===== POST RESOURCE =====
function openPostResource() {
  document.getElementById('ResModal').classList.add('open');
}

function toggleExtraFields() {
  var type = document.getElementById('resType').value;
  document.getElementById('saleFields').style.display    = type==='sale'     ? 'block' : 'none';
  document.getElementById('pyqFields').style.display     = type==='pyq'      ? 'block' : 'none';
  document.getElementById('syllabusFields').style.display = type==='syllabus' ? 'block' : 'none';
}

function togglePyqExam() {
  var val = document.getElementById('pyqExamType').value;
  document.getElementById('pyqBoardDiv').style.display  = val==='plus2board' ? 'block' : 'none';
  document.getElementById('pyqUnivDiv').style.display   = val==='plus3univ'  ? 'block' : 'none';
  document.getElementById('pyqOtherDiv').style.display  = val==='other'      ? 'block' : 'none';
}

function toggleSyllabusFor() {
  var val = document.getElementById('syllabusFor').value;
  document.getElementById('syllabusBoardDiv').style.display  = val==='plus2board' ? 'block' : 'none';
  document.getElementById('syllabusUnivDiv').style.display   = val==='plus3univ'  ? 'block' : 'none';
  document.getElementById('syllabusOtherDiv').style.display  = val==='other'      ? 'block' : 'none';
}

function postResource() {
  var title   = document.getElementById('resTitle').value.trim();
  var desc    = document.getElementById('resDesc').value.trim();
  var cat     = document.getElementById('resCat').value;
  var stream  = document.getElementById('resStream').value;
  var subject = document.getElementById('resSubject').value.trim();
  var type    = document.getElementById('resType').value;
  var link    = document.getElementById('resLink').value.trim();

  // PYQ extra info
var pyqInfo = '';
if(type === 'pyq') {
  var pyqYear     = document.getElementById('pyqYear').value;
  var pyqExamType = document.getElementById('pyqExamType').value;
  var pyqBoard    = document.getElementById('pyqBoard').value;
  var pyqUniv     = document.getElementById('pyqUniv').value;
  var pyqOther    = document.getElementById('pyqOther').value;
  var examName = pyqExamType==='plus2board' ? 'Board: '+pyqBoard :
                 pyqExamType==='plus3univ'  ? 'University: '+pyqUniv :
                 pyqExamType==='other'      ? 'Exam: '+pyqOther : '';
  pyqInfo = (pyqYear ? '📅 Year: '+pyqYear : '') + (examName ? ' | 🏛️ '+examName : '');
}

// Syllabus extra info
var syllabusInfo = '';
if(type === 'syllabus') {
  var sylFor   = document.getElementById('syllabusFor').value;
  var sylBoard = document.getElementById('syllabusBoard').value;
  var sylUniv  = document.getElementById('syllabusUniv').value;
  var sylOther = document.getElementById('syllabusOther').value;
  var sylYear  = document.getElementById('syllabusYear').value;
  var sylName  = sylFor==='plus2board' ? 'Board: '+sylBoard :
                 sylFor==='plus3univ'  ? 'University: '+sylUniv :
                 sylFor==='other'      ? sylOther : '';
  syllabusInfo = (sylName ? '🏛️ '+sylName : '') + (sylYear ? ' | 📅 '+sylYear : '');
}

  if(!title||!desc||!subject) { alert('Please fill all required fields!'); return; }

  var currentId = document.getElementById('LI').value.trim();
  var currentUser = users[currentId] || {name:'User'};
  var resId = 'r' + Date.now();

  // Type badge
  var typeBadges = {notes:'📄 Notes',pyq:'📝 PYQ',syllabus:'📋 Syllabus',book:'📚 Book',sale:'💰 For Sale'};
  var typeCss = {notes:'notes-badge',pyq:'pyq-badge',syllabus:'syllabus-badge',book:'book-badge',sale:'sale-badge'};
  var catLabel = cat==='plus2' ? '+2 (11th/12th)' : '+3 (Degree)';

  // Sale info
  var saleHTML = '';
  if(type === 'sale') {
    var price   = document.getElementById('resPrice').value;
    var contact = document.getElementById('resContact').value;
    var upi     = document.getElementById('resUPI').value;
    saleHTML =
      '<div style="background:rgba(201,168,76,0.1);border:1px solid rgba(201,168,76,0.2);border-radius:8px;padding:0.6rem;margin:0.5rem 0;font-size:0.8rem;">' +
      (price ? '<div style="color:#c9a84c;font-weight:600;">💰 Price: ₹'+price+'</div>' : '') +
      (contact ? '<div style="color:rgba(255,255,255,0.6);margin-top:0.2rem;">📞 Contact: '+contact+'</div>' : '') +
      (upi ? '<div style="color:rgba(255,255,255,0.6);">💳 UPI: '+upi+'</div>' : '') +
      '</div>';
  }

  var today = new Date().toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});

  var card = document.createElement('div');
  card.className = 'res-card';
  card.dataset.cat = cat;
  card.dataset.stream = stream;
  card.dataset.type = type;
  card.dataset.id = resId;
  card.dataset.poster = currentId;

  card.innerHTML =
    '<div class="res-card-top">' +
      '<span class="res-badge '+typeCss[type]+'">'+typeBadges[type]+'</span>' +
      '<span class="res-badge cat-badge">'+catLabel+'</span>' +
    '</div>' +
    '<h3 class="res-title">'+title+'</h3>' +
    '<p class="res-desc">'+desc+'</p>' +
    '<div class="res-subject">'+subject+' | '+stream.toUpperCase()+'</div>' +
(pyqInfo ? '<div style="background:rgba(155,89,182,0.15);border-radius:8px;padding:0.4rem 0.7rem;font-size:0.75rem;color:#bb8fce;margin-top:0.3rem;">'+pyqInfo+'</div>' : '') +
(syllabusInfo ? '<div style="background:rgba(26,188,156,0.15);border-radius:8px;padding:0.4rem 0.7rem;font-size:0.75rem;color:#48c9b0;margin-top:0.3rem;">'+syllabusInfo+'</div>' : '') +
    saleHTML +
    '<div class="res-actions-bar">' +
      '<button class="res-action-btn like-btn" onclick="likeResource(\''+resId+'\',this)">👍 <span>0</span></button>' +
      '<button class="res-action-btn dislike-btn" onclick="dislikeResource(\''+resId+'\',this)">👎 <span>0</span></button>' +
      '<button class="res-action-btn" onclick="rateResource(\''+resId+'\')">⭐ <span id="rating-'+resId+'">-</span>/10</button>' +
      '<button class="res-action-btn report-btn" onclick="reportResource(\''+resId+'\')">🚩</button>' +
      '<button class="res-action-btn" onclick="deleteResource(\''+resId+'\',\''+currentId+'\')" style="color:#e74c3c;">🗑️</button>' +
    '</div>' +
    '<div class="res-footer">' +
      '<small>👤 '+currentUser.name+' | 📅 '+today+'</small>' +
      (link ? '<a href="'+link+'" target="_blank" class="btn" style="padding:0.3rem 0.8rem;font-size:0.78rem;">⬇️ Download</a>' :
              '<span style="color:rgba(255,255,255,0.3);font-size:0.75rem;">No link</span>') +
    '</div>';

  document.getElementById('resourcesList').prepend(card);
  document.getElementById('ResModal').classList.remove('open');

  // Clear form
  ['resTitle','resDesc','resSubject','resLink','resPrice','resContact','resAccNo','resIFSC','resBranch','resUPI'].forEach(function(id){
    var el = document.getElementById(id);
    if(el) el.value='';
  });

  alert('✅ Resource posted successfully!');
  filterResources();
}

// ===== CONTACT SELLER =====
function contactSeller(phone, name) {
  document.getElementById('sellerDetails').innerHTML =
    '<div style="background:#f7f9ff;border-radius:12px;padding:1rem;margin-bottom:1rem;">' +
      '<p style="font-weight:600;color:#0f1f3d;margin-bottom:0.5rem;">👤 '+name+'</p>' +
      '<a href="tel:'+phone+'" style="display:block;background:#2ecc71;color:white;padding:0.7rem;border-radius:10px;text-decoration:none;font-weight:700;margin-bottom:0.5rem;">📞 Call: '+phone+'</a>' +
      '<a href="https://wa.me/91'+phone+'" target="_blank" style="display:block;background:#25D366;color:white;padding:0.7rem;border-radius:10px;text-decoration:none;font-weight:700;">💬 WhatsApp</a>' +
    '</div>';
  document.getElementById('SellerModal').classList.add('open');
}


// ===== RIDE SEARCH =====
var waitingPassengers = []; // Store waiting passengers

function searchRide() {
  var from = document.getElementById('searchFrom').value.trim();
  var to   = document.getElementById('searchTo').value.trim();
  var result = document.getElementById('rideSearchResult');

  if(!from || !to) {
    result.style.display = 'block';
    result.innerHTML = '<p style="color:#f39c12;font-size:0.88rem;">⚠️ Please enter both From and To locations!</p>';
    return;
  }

  // Get current user gender
  var currentId = document.getElementById('LI').value.trim();
  var currentUser = users[currentId];
  var gender = currentUser ? currentUser.gender : 'male';
  var salutation = (gender === 'female') ? 'Ma\'am' : 'Sir';

  // Check if any ride matches
  var rideCards = document.querySelectorAll('#RL .ride-card');
  var found = false;

  rideCards.forEach(function(card) {
    var text = card.innerText.toLowerCase();
    if(text.includes(to.toLowerCase()) || text.includes(from.toLowerCase())) {
      found = true;
    }
  });

  result.style.display = 'block';

  if(found) {
    result.innerHTML =
      '<div style="background:rgba(46,204,113,0.15);border:1px solid rgba(46,204,113,0.3);border-radius:12px;padding:1rem;color:white;">' +
      '<p style="font-weight:600;font-size:0.95rem;">✅ Rides available for your route!</p>' +
      '<p style="font-size:0.82rem;color:rgba(255,255,255,0.7);margin-top:0.3rem;">Scroll down to see available rides 👇</p>' +
      '</div>';
  } else {
    // No ride found — show Ola/Uber style sorry message
    result.innerHTML =
      '<div style="background:rgba(231,76,60,0.12);border:1px solid rgba(231,76,60,0.25);border-radius:12px;padding:1.2rem;text-align:center;">' +
        '<div style="font-size:2.5rem;margin-bottom:0.5rem;">😔</div>' +
        '<p style="color:white;font-weight:700;font-size:1rem;margin-bottom:0.3rem;">Sorry ' + salutation + '!</p>' +
        '<p style="color:rgba(255,255,255,0.7);font-size:0.85rem;margin-bottom:1rem;">We currently don\'t have any ride available from <strong style="color:#c9a84c;">' + from + '</strong> to <strong style="color:#c9a84c;">' + to + '</strong>.</p>' +
        '<p style="color:rgba(255,255,255,0.5);font-size:0.78rem;margin-bottom:1rem;">We\'ll notify you as soon as a ride is posted for this route! 🔔</p>' +
        '<button onclick="waitForRide(\'' + from + '\',\'' + to + '\')" style="background:linear-gradient(135deg,#c9a84c,#e0b85c);color:#1a2840;border:none;padding:0.6rem 1.5rem;border-radius:20px;cursor:pointer;font-weight:700;font-size:0.85rem;">🔔 Notify Me</button>' +
      '</div>';
  }
}

function waitForRide(from, to) {
  var currentId = document.getElementById('LI').value.trim();
  var currentUser = users[currentId];
  var gender = currentUser ? currentUser.gender : 'male';
  var salutation = (gender === 'female') ? 'Ma\'am' : 'Sir';
  var name = currentUser ? currentUser.name : 'User';

  // Add to waiting list
  waitingPassengers.push({name:name, from:from.toLowerCase(), to:to.toLowerCase(), salutation:salutation});

  // Change button to confirmed
  var result = document.getElementById('rideSearchResult');
  result.innerHTML =
    '<div style="background:rgba(46,204,113,0.15);border:1px solid rgba(46,204,113,0.3);border-radius:12px;padding:1rem;text-align:center;">' +
      '<div style="font-size:2rem;margin-bottom:0.4rem;">✅</div>' +
      '<p style="color:white;font-weight:700;">You\'re on the waitlist ' + salutation + ' ' + name + '!</p>' +
      '<p style="color:rgba(255,255,255,0.6);font-size:0.82rem;margin-top:0.3rem;">We\'ll notify you when a ride is available from <strong style="color:#c9a84c;">' + from + '</strong> to <strong style="color:#c9a84c;">' + to + '</strong> 🔔</p>' +
    '</div>';

  // Request notification permission
  if('Notification' in window && Notification.permission !== 'granted') {
    Notification.requestPermission();
  }
}

// ===== CHECK WAITING PASSENGERS WHEN NEW RIDE POSTED =====
function checkWaitingPassengers(from, to) {
  waitingPassengers.forEach(function(p) {
    if(to.toLowerCase().includes(p.to) || from.toLowerCase().includes(p.from)) {
      // Show notification
      if('Notification' in window && Notification.permission === 'granted') {
        new Notification('🚗 Ride Available - Campus साथी', {
          body: 'A ride from ' + from + ' to ' + to + ' is now available! Check the app.',
          icon: 'logo.png'
        });
      }
      // Show alert as fallback
      alert('🔔 Good news ' + p.salutation + ' ' + p.name + '! A ride from ' + from + ' to ' + to + ' has been posted!');
    }
  });
}

// ===== SEARCH =====
var searchData = [
  // Rides
  {type:'🚗 Ride', title:'Rahul Sharma', desc:'College Gate → Railway Station | Today 5:00 PM', tab:'rideshare'},
  {type:'🚗 Ride', title:'Prof. Priya Mehta', desc:'College Gate → City Mall | Today 6:30 PM', tab:'rideshare'},

  // Notices
  {type:'📢 Notice', title:'Exam Schedule Released', desc:'Semester exams start from 20th March', tab:'notices'},
  {type:'📢 Notice', title:'Library Timing Change', desc:'Library will now close at 8 PM', tab:'notices'},
  {type:'📢 Notice', title:'Annual Sports Day Registration', desc:'Register before 15th March', tab:'notices'},

  // Resources
  {type:'📚 Resource', title:'DBMS Notes - Unit 1', desc:'ER Diagrams, Relational Model, Keys', tab:'resources'},
  {type:'📚 Resource', title:'OS Notes - Unit 2', desc:'Process Management, Scheduling', tab:'resources'},
  {type:'📚 Resource', title:'CN Previous Year Paper', desc:'2023 Question Paper with Solutions', tab:'resources'},
  {type:'📚 Resource', title:'Math Formula Sheet', desc:'All important formulas for exams', tab:'resources'},

  // Lost & Found
  {type:'🔍 Lost & Found', title:'Black Backpack', desc:'Lost near Library on 4th March', tab:'lostandfound'},
  {type:'🔍 Lost & Found', title:'Key Chain', desc:'Found in Canteen. Red keychain', tab:'lostandfound'},
  {type:'🔍 Lost & Found', title:'Water Bottle', desc:'Blue Milton bottle lost in CS lab', tab:'lostandfound'},

  // Events
  {type:'🎉 Event', title:'Hackathon 2026', desc:'24-hour coding challenge. Prize ₹50,000!', tab:'events'},
  {type:'🎉 Event', title:'Annual Sports Day', desc:'Cricket, Football, Athletics', tab:'events'},
  {type:'🎉 Event', title:'Cultural Fest - Rang 2026', desc:'Dance, music, drama', tab:'events'},
];

function toggleSearch() {
  var bar = document.getElementById('searchBar');
  if(bar.style.display === 'none' || bar.style.display === '') {
    bar.style.display = 'block';
    document.getElementById('searchInput').focus();
  } else {
    closeSearch();
  }
}

function closeSearch() {
  document.getElementById('searchBar').style.display = 'none';
  document.getElementById('searchInput').value = '';
  document.getElementById('searchResults').style.display = 'none';
  document.getElementById('searchList').innerHTML = '';
}

function doSearch(query) {
  var list = document.getElementById('searchList');
  var results = document.getElementById('searchResults');
  list.innerHTML = '';

  if(query.length < 2) {
    results.style.display = 'none';
    return;
  }

  var q = query.toLowerCase();
  var found = searchData.filter(function(item) {
    return item.title.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q) || item.type.toLowerCase().includes(q);
  });

  if(found.length === 0) {
    list.innerHTML = '<div style="color:rgba(255,255,255,0.5);font-size:0.85rem;padding:0.75rem;">No results found for "' + query + '"</div>';
    results.style.display = 'block';
    return;
  }

  found.forEach(function(item) {
    var div = document.createElement('div');
    div.style.cssText = 'background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:0.75rem 1rem;cursor:pointer;transition:background 0.2s;display:flex;align-items:center;gap:0.75rem;';
    div.innerHTML =
      '<span style="font-size:0.75rem;background:rgba(201,168,76,0.2);color:#c9a84c;padding:0.2rem 0.6rem;border-radius:20px;white-space:nowrap;font-weight:600;">' + item.type + '</span>' +
      '<div style="flex:1;">' +
        '<div style="color:white;font-size:0.88rem;font-weight:600;">' + item.title + '</div>' +
        '<div style="color:rgba(255,255,255,0.5);font-size:0.75rem;">' + item.desc + '</div>' +
      '</div>' +
      '<span style="color:rgba(255,255,255,0.3);font-size:0.8rem;">→</span>';
    div.onmouseover = function(){ this.style.background = 'rgba(255,255,255,0.14)'; };
    div.onmouseout  = function(){ this.style.background = 'rgba(255,255,255,0.08)'; };
    div.onclick = function() {
      var tabs = document.querySelectorAll('.tab');
      tabs.forEach(function(t){ t.classList.remove('active'); });
      document.querySelectorAll('.section').forEach(function(s){ s.classList.remove('active'); });
      document.getElementById(item.tab).classList.add('active');
      tabs.forEach(function(t){
        if(t.getAttribute('onclick') && t.getAttribute('onclick').includes(item.tab)) {
          t.classList.add('active');
        }
      });
      closeSearch();
      window.scrollTo({top:0, behavior:'smooth'});
    };
    list.appendChild(div);
  });

  results.style.display = 'block';
}

// ===== PERMISSIONS =====
function requestPermissions() {
  document.getElementById('PM').classList.add('open');
}

function requestLocation() {
  var btn = document.getElementById('locBtn');
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function(pos) {
        btn.textContent = '✅ Allowed';
        btn.style.background = '#2ecc71';
        btn.disabled = true;
        alert('📍 Location access granted! Lat: ' + pos.coords.latitude.toFixed(4) + ', Lng: ' + pos.coords.longitude.toFixed(4));
      },
      function() {
        btn.textContent = '❌ Denied';
        btn.style.background = '#e74c3c';
      }
    );
  } else {
    alert('Location not supported on this browser!');
  }
}

function requestNotification() {
  var btn = document.getElementById('notifBtn');
  if('Notification' in window) {
    Notification.requestPermission().then(function(perm) {
      if(perm === 'granted') {
        btn.textContent = '✅ Allowed';
        btn.style.background = '#2ecc71';
        btn.disabled = true;
        new Notification('Campus साथी 🚗', {
          body: 'Notifications enabled! You will be alerted for ride updates.',
          icon: 'logo.png'
        });
      } else {
        btn.textContent = '❌ Denied';
        btn.style.background = '#e74c3c';
      }
    });
  } else {
    alert('Notifications not supported on this browser!');
  }
}

// ===== CALL RIDER =====
function callRider(name, phone) {
  document.getElementById('callName').textContent = '📞 Calling ' + name;
  document.getElementById('callNumber').textContent = phone;
  document.getElementById('callLink').href = 'tel:' + phone;
  document.getElementById('CM').classList.add('open');
}

// ===== MODE SWITCHER =====
function setMode(mode) {
  // Remove all modes
  document.body.classList.remove('day-mode', 'night-mode');

  // Remove active from all buttons
  document.getElementById('mDefault').classList.remove('active-mode');
  document.getElementById('mDay').classList.remove('active-mode');
  document.getElementById('mNight').classList.remove('active-mode');

  // Apply selected mode
  if(mode === 'day') {
    document.body.classList.add('day-mode');
    document.getElementById('mDay').classList.add('active-mode');
  } else if(mode === 'night') {
    document.body.classList.add('night-mode');
    document.getElementById('mNight').classList.add('active-mode');
  } else {
    document.getElementById('mDefault').classList.add('active-mode');
  }

  // Save preference
  localStorage.setItem('campusMode', mode);
}

// Load saved mode on startup
var savedMode = localStorage.getItem('campusMode');
if(savedMode) setMode(savedMode);
function togglePass(id, eye) {
  var input = document.getElementById(id);
  if(input.type === 'password') {
    input.type = 'text';
    eye.textContent = '🙈';
  } else {
    input.type = 'password';
    eye.textContent = '👁️';
  }
}