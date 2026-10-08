const $=s=>document.querySelector(s),
audio=$("#audio"),
canvas=$("#rain"),
ctx=canvas.getContext("2d");

let drops=[];

const TARGET_DATE="2026-10-09T00:00:00+07:00";

const state={
    title:"HAPPY|BIRTHDAY|ELENN",
    subtitle:"May all good things come your way..",
    rain:"HAPPY BIRTHDAY!",
    c1:"#ff77b7",
    c2:"#8f75ff",
    target:new Date(TARGET_DATE),
    hearts:true,
    rainOn:true
};

function resize(){
    canvas.width=innerWidth;
    canvas.height=innerHeight;

    drops=Array.from(
        {length:Math.max(25,innerWidth/22)},
        ()=>({
            x:Math.random()*innerWidth,
            y:Math.random()*innerHeight,
            s:1+Math.random()*2,
            z:11+Math.random()*7
        })
    );
}

addEventListener("resize",resize);

function rgb(h){
    let n=parseInt(h.slice(1),16);
    return[
        (n>>16)&255,
        (n>>8)&255,
        n&255
    ];
}

function draw(){
    ctx.clearRect(0,0,innerWidth,innerHeight);

    let a=rgb(state.c1),
        b=rgb(state.c2);

    drops.forEach((d,i)=>{
        let t=i/drops.length;

        let c=a.map(
            (v,j)=>Math.round(v+(b[j]-v)*t)
        );

        ctx.fillStyle=
            `rgba(${c[0]},${c[1]},${c[2]},.32)`;

        ctx.font=`${d.z}px Poppins`;
        ctx.fillText(state.rain,d.x,d.y);

        d.y+=d.s;

        if(d.y>innerHeight+20){
            d.y=-20;
            d.x=Math.random()*innerWidth;
        }
    });

    requestAnimationFrame(draw);
}

function title(){
    let x=$("#title");

    x.innerHTML="";

    state.title.split("|").forEach((w,i)=>{
        let s=document.createElement("span");

        s.className="word";
        s.textContent=w;
        s.style.animationDelay=i*.1+"s";

        x.append(s);
    });
}

function hearts(n=25){
    if(!state.hearts)return;

    for(let i=0;i<n;i++){
        let h=document.createElement("span");

        h.className="heart";
        h.textContent=
            ["♥","♡","💗","💖"]
            [Math.floor(Math.random()*4)];

        h.style.left=
            40+Math.random()*20+"vw";

        h.style.bottom=
            15+Math.random()*15+"vh";

        h.style.setProperty(
            "--x",
            (Math.random()*280-140)+"px"
        );

        h.style.animationDelay=
            Math.random()*.35+"s";

        document.body.append(h);

        setTimeout(()=>h.remove(),2500);
    }
}

function toast(t){
    let x=$("#toast");

    x.textContent=t;
    x.classList.add("show");

    setTimeout(
        ()=>x.classList.remove("show"),
        2200
    );
}


/* ==============================
   COUNTDOWN WIB
   Target: 9 Oktober 2026 00:00 WIB
================================ */

function countdown(){

    const now=new Date();
    const target=new Date(TARGET_DATE);

    const d=target-now;

    if(d<=0){
        $("#countdown").textContent="HAPPY BIRTHDAY!";
        $("#introCountdown").textContent="HAPPY BIRTHDAY!";
        return;
    }

    const dd=Math.floor(d/86400000);
    const hh=Math.floor(d/3600000)%24;
    const mm=Math.floor(d/60000)%60;
    const ss=Math.floor(d/1000)%60;

    const text=[
        dd,
        hh,
        mm,
        ss
    ]
    .map(x=>String(x).padStart(2,"0"))
    .join(" : ");

    $("#countdown").textContent=text;
    $("#introCountdown").textContent=text;
}

/* ==============================
   SAVE
================================ */

function save(){

    localStorage.setItem(
        "birthdaySite",
        JSON.stringify({
            ...state,
            target:TARGET_DATE
        })
    );
}


/* ==============================
   START
================================ */

$("#start").onclick=async()=>{
    $("#intro").classList.add("hide");
    $("#nav").classList.remove("hidden");
    $("#main").classList.remove("hidden");

    try{
        await audio.play();
        $("#music").textContent="❚❚";
    }catch(e){
        console.log("Autoplay gagal:",e);
    }

    setTimeout(
        ()=>hearts(30),
        500
    );
};

/* ==============================
   LETTER
================================ */

$("#openLetter").onclick=()=>{
    $("#letterArea")
        .scrollIntoView({behavior:"smooth"});
};

$("#read").onclick=()=>{
    $("#book").classList.add("open");
    hearts(15);
};

$("#closeBook").onclick=()=>{
    $("#book").classList.remove("open");
};

$("#heartBtn").onclick=()=>{
    hearts(40);
};


/* ==============================
   WISH
================================ */

$("#makeWish").onclick=()=>{
    $("#wishBtn").scrollIntoView({
        behavior:"smooth",
        block:"center"
    });
};

$("#wishBtn").onclick=()=>{
    hearts(60);
    toast("May your hopes become reality. ✨");
};


/* ==============================
   SETTINGS
================================ */

/*$("#settings").onclick=()=>{
    $("#panel").classList.add("show");
};

$("#closeSettings").onclick=()=>{
    $("#panel").classList.remove("show");
};


/* ==============================
   MUSIC
================================ */

$("#music").onclick=async()=>{
    if(!audio.src){
        toast("Masukkan musik lewat Pengaturan.");
        return;
    }

    if(audio.paused){
        await audio.play();
        $("#music").textContent="❚❚";
    }else{
        audio.pause();
        $("#music").textContent="▶";
    }
};


/* ==============================
   APPLY SETTINGS
================================ */

$("#apply").onclick=()=>{

    state.title=
        $("#titleInput").value||state.title;

    state.subtitle=
        $("#subtitleInput").value||state.subtitle;

    state.rain=
        $("#rainInput").value||"LOVE";

    state.c1=$("#color1").value;
    state.c2=$("#color2").value;

    state.hearts=
        $("#heartToggle").checked;

    state.rainOn=
        $("#rainToggle").checked;


    /* Target countdown TETAP */
    state.target=new Date(TARGET_DATE);


    $("#subtitle").textContent=
        state.subtitle;

    $("#rain").style.display=
        state.rainOn?"block":"none";

    title();

    save();

    toast("Pengaturan diterapkan");

    $("#panel").classList.remove("show");
};


/* ==============================
   RESET
================================ */

$("#reset").onclick=()=>{
    localStorage.removeItem("birthdaySite");
    location.reload();
};


/* ==============================
   PHOTO
================================ */

$("#photo").onchange=e=>{

    let f=e.target.files[0];

    if(f){
        $("#heroImg").src=
            URL.createObjectURL(f);
    }
};


/* ==============================
   LANGUAGE
================================ */

/*$("#lang").onclick=()=>{

    let en=$("#lang").dataset.en!=="1";

    $("#lang").dataset.en=
        en?"1":"0";

    if(en){

        $("#eyebrow").textContent=
            "Today is your special day";

        $("#subtitle").textContent=
            "May every good thing find its way to you.";

        $("#countLabel").textContent=
            "Until the special moment";

    }else{

        $("#eyebrow").textContent=
            "Hari ini adalah harimu";

        $("#subtitle").textContent=
            state.subtitle;

        $("#countLabel").textContent=
            "Menuju momen spesial";
    }
};
/*

/* ==============================
   STARS
================================ */

for(let i=0;i<45;i++){

    let s=document.createElement("i");

    s.style.cssText=
        `position:absolute;
        width:3px;
        height:3px;
        border-radius:50%;
        background:white;
        opacity:.4;
        left:${Math.random()*100}%;
        top:${Math.random()*100}%;
        animation:twinkle 3s infinite;
        animation-delay:${Math.random()*3}s`;

    $("#stars").append(s);
}


/* ==============================
   LOAD SAVED SETTINGS
================================ */

let saved=
    localStorage.getItem("birthdaySite");

if(saved){

    try{

        let s=JSON.parse(saved);

        Object.assign(state,s);

        /*
         * Jangan gunakan target lama
         * dari localStorage.
         */
        state.target=
            new Date(TARGET_DATE);

        $("#titleInput").value=
            state.title;

        $("#subtitleInput").value=
            state.subtitle;

        $("#rainInput").value=
            state.rain;

        $("#color1").value=
            state.c1;

        $("#color2").value=
            state.c2;

        $("#heartToggle").checked=
            state.hearts;

        $("#rainToggle").checked=
            state.rainOn;

    }catch{}
}


/* ==============================
   INITIALIZE
================================ */

state.target=
    new Date(TARGET_DATE);

$("#subtitle").textContent=
    state.subtitle;

$("#target").value=
    new Date(TARGET_DATE)
        .getTime();

title();

resize();

draw();

countdown();

setInterval(countdown,1000);