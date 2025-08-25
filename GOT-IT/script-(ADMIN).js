let eye=document.querySelector("#tog");
let us=document.querySelector("#us");
let ps=document.querySelector("#ps");
let username=document.querySelector("#username");
let password=document.querySelector("#password");
let swrong=document.querySelector("#swrong");
let done=document.querySelector("#done");
let tog=document.querySelector("#tog");
if(swrong.innerText.length==0){
    tog.style.top="-145px";
}else{
    tog.style.top="-140px";
}
done.addEventListener("click",()=>{
    console.log("clicked done !!");
    let name=username.value.trim();
    let pass=password.value.trim();
    console.log(name+" "+pass);
    if(name.length!=0&&pass.length!=0){
        if(pass==="GOTIT@123"){
            window.location.href=`index-(ADashboard).html?name=${encodeURIComponent(name)}`;
        }else{
            swrong.innerText="!! Wrong Password !!";
        }
    }else{
        console.log("no data");
        swrong.innerText="!! Enter Details !!";
    }
});
eye.addEventListener("click",()=>{
    let p=document.querySelector("#password");
    let type=p.getAttribute("type")==="password"?"text":"password";
    p.setAttribute("type",type);
    console.log(p.getAttribute("type"));
    if(type=="password"){
        eye.innerHTML='<i class="fa-solid fa-eye"></i>';
    }else{
        eye.innerHTML='<i class="fa-solid fa-eye-slash"></i>';
    }
});
username.addEventListener("focus",()=>{
    us.style.top="-73px";
    us.style.opacity="1";
})
username.addEventListener('blur', () => {
    const n = username.value;
    if(n.length!=0){
        us.style.top="-73px";
        us.style.opacity="1";
    }else{
        us.style.top="-48px";
        us.style.opacity="0.5";
    }
});

password.addEventListener("focus",()=>{
    ps.style.top="-121px";
    ps.style.opacity="1";
})
password.addEventListener('blur', () => {
    const n = password.value;
    if(n.length!=0){
        ps.style.top="-121px";
        ps.style.opacity="1";
    }else{
        ps.style.top="-96px";
        ps.style.opacity="0.5";
    }
});
