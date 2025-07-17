/* ===== Global ===== */
let zCounter = 1;
const desktop   = document.getElementById("desktop");
const startMenu = document.getElementById("start-menu");
const startBtn  = document.getElementById("start-btn");
const taskbar   = document.getElementById("taskbar-windows");
const clock     = document.getElementById("clock");

const fileTree = {                // mock file-system
  name:"root",type:"folder",children:[
    {name:"Documents",type:"folder",children:[
      {name:"readme.txt",type:"file",content:"Welcome to Mini-OS!"}
    ]}
  ]
};

/* ===== Applications ===== */
const apps = [
  {name:"File Explorer",icon:"📁",launcher:fileExplorerApp},
  {name:"Text Editor",  icon:"📝",launcher:textEditorApp},
  {name:"Browser",      icon:"🌐",launcher:browserApp},
  {name:"About",        icon:"ℹ️",launcher:aboutApp}
];

/* ===== Desktop Icons ===== */
apps.forEach((app,i) => {
  const icon = document.createElement("div");
  icon.className = "icon";
  icon.style.left = 12 + (i%4)*90 + "px";
  icon.style.top  = 12 + Math.floor(i/4)*100 + "px";
  icon.innerHTML = `${app.icon}<span>${app.name}</span>`;
  icon.ondblclick = () => createWindow(app);
  desktop.appendChild(icon);
});

/* ===== Start Menu ===== */
startBtn.onclick = () => startMenu.style.display =
  startMenu.style.display==="block" ? "none" : "block";

apps.forEach(app=>{
  const li=document.createElement("li");
  li.textContent=app.name;
  li.onclick=()=>{startMenu.style.display="none";createWindow(app);};
  startMenu.appendChild(li);
});
const shut = document.createElement("li");
shut.textContent="Shut Down";
shut.onclick=()=>location.reload();
startMenu.appendChild(shut);

/* ===== Window Factory ===== */
function createWindow(app){
  const win=document.createElement("div");
  win.className="window";
  win.style.top="60px";
  win.style.left="60px";
  win.style.zIndex=++zCounter;

  /* Titlebar */
  const bar=document.createElement("div");
  bar.className="titlebar";
  bar.innerHTML=`<span>${app.name}</span>`;
  const btnBox=document.createElement("div");
  ["_","×"].forEach(sym=>{
    const b=document.createElement("button");
    b.textContent=sym;
    btnBox.appendChild(b);
  });
  bar.appendChild(btnBox);
  win.appendChild(bar);

  /* Content */
  const content=app.launcher();
  win.appendChild(content);
  desktop.appendChild(win);

  /* Dragging */
  let offsetX,offsetY;
  bar.onpointerdown=e=>{
    win.style.zIndex=++zCounter;
    offsetX=e.clientX-win.offsetLeft;
    offsetY=e.clientY-win.offsetTop;
    window.onpointermove=m=>{
      win.style.left=m.clientX-offsetX+"px";
      win.style.top =m.clientY-offsetY+"px";
    };
    window.onpointerup=()=>window.onpointermove=null;
  };                                                  /* Pointer Events for drag [2] */

  /* Taskbar button */
  const tb=document.createElement("button");
  tb.textContent=app.name;
  tb.onclick=()=>toggleMinimize();
  taskbar.appendChild(tb);

  /* Controls */
  const [minBtn,closeBtn]=btnBox.children;
  function toggleMinimize(){
    if(win.style.display==="none"){win.style.display="block";}
    else{win.style.display="none";}
  }
  minBtn.onclick=toggleMinimize;
  closeBtn.onclick=()=>{
    win.remove();
    tb.remove();
  }
}

/* ===== App Implementations ===== */
function fileExplorerApp(){
  const wrap=document.createElement("div");
  wrap.style.display="flex";
  wrap.style.height="300px";

  const treePane=document.createElement("div");
  treePane.style.width="40%";
  treePane.style.overflowY="auto";
  const preview=document.createElement("pre");
  preview.style.flex="1";
  preview.style.margin="0";

  wrap.appendChild(treePane);
  wrap.appendChild(preview);

  function render(node,parentUL){
    const li=document.createElement("li");
    li.textContent=node.name;
    li.onclick=e=>{
      e.stopPropagation();
      if(node.type==="file"){preview.textContent=node.content;}
      else{li.classList.toggle("open");}
    };
    parentUL.appendChild(li);
    if(node.type==="folder"){
      const ul=document.createElement("ul");
      ul.style.display="none";
      li.appendChild(ul);
      li.onclick=e=>{
        e.stopPropagation();
        ul.style.display=ul.style.display==="none"?"block":"none";
      };
      node.children.forEach(child=>render(child,ul));
    }
  }
  const rootUL=document.createElement("ul");
  treePane.appendChild(rootUL);
  render(fileTree,rootUL);
  return wrap;
}

function textEditorApp(){
  const wrap=document.createElement("div");
  wrap.style.display="flex";
  wrap.style.flexDirection="column";
  wrap.style.height="300px";

  const textarea=document.createElement("textarea");
  textarea.style.flex="1";
  const save=document.createElement("button");
  save.textContent="Save";
  save.onclick=()=>{
    const name=prompt("Filename?","new.txt");
    if(!name)return;
    fileTree.children.push({name,type:"file",content:textarea.value});
    alert("Saved to mock FS. Reopen File Explorer to see it.");
  };
  wrap.appendChild(textarea);
  wrap.appendChild(save);
  return wrap;
}

function browserApp(){
  const iframe=document.createElement("iframe");
  iframe.src="https://example.com";
  iframe.style.width="100%";
  iframe.style.height="300px";
  iframe.style.border="none";
  return iframe;
}

function aboutApp(){
  const div=document.createElement("div");
  div.style.padding="8px";
  div.innerHTML="<h3>Mini-OS</h3><p>Pure-HTML desktop simulation demo.</p>";
  return div;
}

/* ===== Live Clock ===== */
setInterval(()=>{
  clock.textContent=new Date().toLocaleTimeString();
},1000);
