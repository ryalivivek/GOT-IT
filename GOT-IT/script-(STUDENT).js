let sin=document.querySelector("#sin");
let sup=document.querySelector("#sup");
let signin=document.querySelector("#sign-in");
let signup=document.querySelector("#sign-up");
let eye=document.querySelector("#tog");
let us=document.querySelector("#us");
let ps=document.querySelector("#ps");
let username=document.querySelector("#username");
let password=document.querySelector("#password");
let ginfo=document.querySelector("#ginfo");
let pinfo=document.querySelector("#pinfo");
let oinfo=document.querySelector("#oinfo");
let message1=document.querySelector("#message1");
let message2=document.querySelector("#message2");
let tellme1=document.querySelector("#tellme1");
let tellme2=document.querySelector("#tellme2");
let roll=document.querySelector("#roll");
let otp=document.querySelector("#otp");
let eroll=document.querySelector("#eroll");
let eotp=document.querySelector("#eotp");
let Name=document.querySelector("#Name");
let eName=document.querySelector("#eName");
let mno=document.querySelector("#mno");
let emno=document.querySelector("#emno");
let nxt=document.querySelector("#next");
let final=document.querySelector("#final");
let doneup=document.querySelector("#doneup");
let donein=document.querySelector("#done");
let suppassword=document.querySelector("#suppassword");
let esuppassword=document.querySelector("#esuppassword");
let conpassword=document.querySelector("#conpassword");
let econpassword=document.querySelector("#econpassword");
let eptog=document.querySelector("#eptog");
let cptog=document.querySelector("#cptog");
let pdf=document.querySelector("#pdf");
let swrong=document.querySelector("#swrong");
let wrong=document.querySelector("#wrong");
let pwrong=document.querySelector("#pwrong");
let owrong=document.querySelector("#owrong");
let pdfflag=0;
let pdfmsg="Select pdf";
done.addEventListener("click",async function(){
    const r=username.value;
    const p=password.value;
    try {
        const response = await fetch('http://192.168.33.35:2000/vroll', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ r }) 
        });
        const result = await response.json();
        if (!result.success) {
            try{
                const response = await fetch('http://192.168.33.35:2000/vsignin', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({ r,p }) 
                });
                const re = await response.json();
                if(re.success){
                    try{
                        const resa=await fetch('http://192.168.33.35:2000/checkaccess', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                            body: new URLSearchParams({ r }) 
                        });
                        const daccess=await resa.json();
                        if(daccess.success){
                            if(daccess.val[0].access==1){
                                swrong.innerText="";
                                done.style.pointerEvents="none";
                                done.innerText="Loading";
                                setTimeout(()=>{
                                    done.innerText="Loading..";
                                    // swrong.style.color='yellow';
                                },1000);
                                setTimeout(()=>{
                                    done.innerText="Loading....";
                                    // swrong.style.color='#8B8000';
                                },2000);
                                setTimeout(()=>{
                                    done.innerText="Loading......";
                                    // swrong.style.color='green';
                                },3000);
                                setTimeout(()=>{
                                    setTimeout(()=>{
                                        window.location.reload();
                                    },500);
                                    swrong.innerText="";
                                    sessionStorage.setItem("loggedIn", "true");
                                    window.open(`/index-(SDashboard).html?name=${encodeURIComponent(result.name)}&roll=${encodeURIComponent(r)}`,"_blank");
                                    done.innerText="Sing-in";
                                    done.style.pointerEvents="auto";
                                },4000);
                            }else{
                                swrong.innerText="!! Access Denied By Admin !!";
                                alert("!! Meet Admin to resolve access issues !!");
                            }
                        }else{
                            alert("success:false (while checking access)");
                        }
                    }catch(er){
                        alert("!! error in checking access !!");
                    }
                    
                }else{
                    swrong.innerText="Wrong Password";
                }
            }catch(err){
                swrong.innerText = "Error in verification process: " + err.message;
            }
        } else {
            swrong.innerText="Not a Verrified please Sign-Up";
        }
    }catch (err) {
        swrong.innerText = "Error in verification process: " + err.message;
    }
});
doneup.addEventListener("click",async function(){
    const o=otp.value.trim();
    const phno=mno.value.trim();
    if(o.length==0){
        owrong.innerText="Enter OTP sent to your mobile";
    }else{
        try {
            const response = await fetch('http://192.168.33.35:2000/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ phno, o }) 
            });
            const data = await response.json();
            if (data.success) {
                owrong.innerText="verified Successfully";
                const roll = document.getElementById("roll").value;
                const name = document.getElementById("Name").value;
                const mno = document.getElementById("mno").value;
                const pdf = document.getElementById("pdf").files[0]; 
                const suppassword = document.getElementById("suppassword").value;
                const conpassword = document.getElementById("conpassword").value;
                const formData = new FormData();
                formData.append("roll", roll);
                formData.append("name", name);
                formData.append("mno", mno);
                formData.append("pdf", pdf);
                formData.append("suppassword", suppassword);
                formData.append("conpassword", conpassword);
                try {
                    const response = await fetch("http://192.168.33.35:2000/signup-data", {
                        method: "POST",
                        body: formData
                    });
                    const result = await response.json();
                    if (result.success) {
                        setTimeout(()=>{
                            window.location.reload();
                        },500);
                        const url = `/index-(SDashboard).html?name=${encodeURIComponent(name)}&roll=${encodeURIComponent(roll)}`;
                        window.open(url, "_blank");
                        alert("hello "+name+" Welcome to GOTIT !!");
                    } else {
                        console.error(result.error);
                    }
                } catch (err) {
                    console.error("Error in submission", err);
                }
            } else {
                owrong.innerText = "Invalid OTP. Please try again.";
            }
        } catch (err) {
            owrong.innerText = "Error in verification process: " + err.message;
        }
    }
});
nxt.addEventListener("click",async function(){
    if(roll.value.trim().length==0||Name.value.trim().length==0||mno.value.trim().length==0){
        wrong.innerText="!! Enter Details !!";
    }else{
        if(roll.value.trim().length!=0){
            if(Name.value.trim().length!=0){
                if(mno.value.trim().length==10&&/^\d+$/.test(mno.value.trim())){
                    const r=roll.value.trim();
                    try {
                        const response = await fetch('http://192.168.33.35:2000/vroll', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                            body: new URLSearchParams({ r }) 
                        });
                        const result = await response.json();
                        if (result.success) {
                            signin.style.zIndex = 0;
                            signup.style.zIndex = 0;
                            ginfo.style.zIndex=0;
                            pinfo.style.zIndex=1;
                            oinfo.style.zIndex=0;
                        } else {
                            wrong.innerText="User with same rollno exits";
                        }
                    }catch (err) {
                        wrong.innerText = "Error in verification process: " + err.message;
                    }
                }else{
                    wrong.innerText="!! Invalid Mobile No !!";
                }
            }else{
                wrong.innerText="!! Invalid Name !!";
            }
        }else{
            wrong.innerText="!! Invalid Roll No !!";
        }
    }
});
final.addEventListener("click",async function(){
    if(pdfflag==1){
        if(suppassword.value===conpassword.value){
            if(suppassword.value.length>=8){
                const hasUppercase = /[A-Z]/.test(suppassword.value);
                const hasNumber = /[0-9]/.test(suppassword.value);
                const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(suppassword.value);
                if (hasUppercase && hasNumber && hasSpecialChar) {
                    signin.style.zIndex = 0;
                    signup.style.zIndex = 0;
                    ginfo.style.zIndex=0;
                    pinfo.style.zIndex=0;
                    oinfo.style.zIndex=1;
                    console.log(mno.value+" is mobile no which we want to send otp !!");
                    const phno=mno.value;
                    try{
                        const response = await fetch('http://192.168.33.35:2000/signup', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                            body: new URLSearchParams({ phno })
                        });
                        if (response.ok) {
                            const data = await response.json();
                            if (data.success) {
                                owrong.innerText="Otp Sent";
                                console.log("Success");
                            } else {
                                alert("Failed to send OTP. Please try again.");
                            }
                        } else {
                            const errorText = await response.text(); 
                            throw new Error(`Server responded with status ${response.status}: ${errorText}`);
                        }
                    }catch(err){
                        alert("eror in script of of : "+err);
                    }
                }else {
                    pwrong.innerText="Set Strong Password";
                }
            }else {
                pwrong.innerText="password length should be >=8"
            }
        }else{
            pwrong.innerText="mismatch between passwords";
        }
    }else{
        pwrong.innerText=`${pdfmsg}`;
    }
})
document.addEventListener('click', (event) => {
    if (!tellme1.contains(event.target) && !message1.contains(event.target)&&message1.style.visibility=="visible"){
        message1.style.visibility = 'hidden';
    }
    if (!tellme2.contains(event.target) && !message2.contains(event.target)&&message2.style.visibility=="visible"){
        message2.style.visibility = 'hidden';
    }
});
tellme1.addEventListener("click",()=>{
    if(message1.style.visibility==="visible")
    message1.style.visibility="hidden";
    else
    message1.style.visibility="visible";
})
tellme2.addEventListener("click",()=>{
    if(message2.style.visibility==="visible")
    message2.style.visibility="hidden";
    else
    message2.style.visibility="visible";
})
sin.addEventListener("click",()=>{
    console.log("singin");
    sin.style.backgroundColor="#222831";
    sup.style.backgroundColor="white";
    sin.style.color="white";
    sup.style.color="#222831";
    signin.style.zIndex = 1;
    signup.style.zIndex = 0;
    ginfo.style.zIndex=0;
    pinfo.style.zIndex=0;
    oinfo.style.zIndex=0;
});
sup.addEventListener("click",()=>{
    console.log("signup");
    sup.style.backgroundColor="#222831";
    sin.style.backgroundColor="white";
    sin.style.color="black";
    sup.style.color="white";
    signin.style.zIndex = 0;
    signup.style.zIndex = 1;
    ginfo.style.zIndex=1;
    pinfo.style.zIndex=0;
    oinfo.style.zIndex=0;
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
    us.style.top="-80px";
    us.style.opacity="1";
})
username.addEventListener('blur', () => {
    const n = username.value;
    if(n.length!=0){
        us.style.top="-80px";
        us.style.opacity="1";
    }else{
        us.style.top="-55px";
        us.style.opacity="0.5";
    }
});
password.addEventListener("focus",()=>{
    ps.style.top="-60px";
    ps.style.opacity="1";
})
password.addEventListener('blur', () => {
    const n = password.value;
    if(n.length!=0){
        ps.style.top="-60px";
        ps.style.opacity="1";
    }else{
        ps.style.top="-35px";
        ps.style.opacity="0.5";
    }
});
roll.addEventListener("focus",()=>{
    eroll.style.top="-60px";
    eroll.style.opacity="1";
})
roll.addEventListener('blur', () => {
    const n = roll.value;
    if(n.length!=0){
        eroll.style.top="-60px";
        eroll.style.opacity="1";
    }else{
        eroll.style.top="-35px";
        eroll.style.opacity="0.5";
    }
});

otp.addEventListener("focus",()=>{
    eotp.style.top="-113px";
    eotp.style.opacity="1";
})
otp.addEventListener('blur', () => {
    const n = otp.value;
    if(n.length!=0){
        eotp.style.top="-113px";
        eotp.style.opacity="1";
    }else{
        eotp.style.top="-88px";
        eotp.style.opacity="0.5";
    }
});
Name.addEventListener("focus",()=>{
    eName.style.top="-60px";
    eName.style.opacity="1";
})
Name.addEventListener('blur', () => {
    const n = Name.value;
    if(n.length!=0){
        eName.style.top="-60px";
        eName.style.opacity="1";
    }else{
        eName.style.top="-35px";
        eName.style.opacity="0.5";
    }
});
mno.addEventListener("focus",()=>{
    emno.style.top="-60px";
    emno.style.opacity="1";
})
mno.addEventListener('blur', () => {
    const n = mno.value;
    if(n.length!=0){
        emno.style.top="-60px";
        emno.style.opacity="1";
    }else{
        emno.style.top="-35px";
        emno.style.opacity="0.5";
    }
});
suppassword.addEventListener("focus",()=>{
    eptog.style.opacity="1";
    esuppassword.style.top="-90px";
    esuppassword.style.opacity="1";
})
suppassword.addEventListener('blur', () => {
    eptog.style.opacity="0.5";
    const n = suppassword.value;
    if(n.length!=0){
        esuppassword.style.top="-90px";
        esuppassword.style.opacity="1";
    }else{
        esuppassword.style.top="-65px";
        esuppassword.style.opacity="0.5";
    }
});
conpassword.addEventListener("focus",()=>{
    cptog.style.opacity="1";
    econpassword.style.top="-85px";
    econpassword.style.opacity="1";
})
conpassword.addEventListener('blur', () => {
    cptog.style.opacity="0.5";
    const n = conpassword.value;
    if(n.length!=0){
        econpassword.style.top="-85px";
        econpassword.style.opacity="1";
    }else{
        econpassword.style.top="-60px";
        econpassword.style.opacity="0.5";
    }
});
eptog.addEventListener("click",()=>{
    let p=document.querySelector("#suppassword");
    let type=p.getAttribute("type")==="password"?"text":"password";
    p.setAttribute("type",type);
    console.log(p.getAttribute("type"));
    if(type=="password"){
        eptog.innerHTML='<i class="fa-solid fa-eye"></i>';
    }else{
        eptog.innerHTML='<i class="fa-solid fa-eye-slash"></i>';
    }
});
cptog.addEventListener("click",()=>{
    let p=document.querySelector("#conpassword");
    let type=p.getAttribute("type")==="password"?"text":"password";
    p.setAttribute("type",type);
    console.log(p.getAttribute("type"));
    if(type=="password"){
        cptog.innerHTML='<i class="fa-solid fa-eye"></i>';
    }else{
        cptog.innerHTML='<i class="fa-solid fa-eye-slash"></i>';
    }
});

pdf.addEventListener("change", () => {
    pdfflag=0;
    pdfmsg="";
    if(pdf.files && pdf.files.length > 0){
        const file = pdf.files[0];
        const maxSize = 500 * 1024;
        if(file.size > maxSize){
            document.querySelector("#pwrong").innerText="Size exceeded";
            pdfmsg="Pdf Size exceeded";
            pdf.value = '';
            document.querySelector(".filelabel").innerText="Choose File";
        }else{
            document.querySelector("#pwrong").innerText="";
            pdfflag=1;
            const fileName = file.name;
            const maxLength = 20;
            if(fileName.length > maxLength){
                document.querySelector(".filelabel").innerText=`${fileName.substring(0, maxLength)}...`;
            }else{
                document.querySelector(".filelabel").innerText=`${fileName}`;
            }
        }
    }else{
        pdfmsg="Insert Pdf";
        pdf.value = '';
        document.querySelector(".filelabel").innerText="Choose File";
        document.querySelector("#pwrong").innerText="No file selected";
    }
});