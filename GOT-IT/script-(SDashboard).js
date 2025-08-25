let welcome=document.querySelector("#welcome");
let cbot=document.querySelector("#cbot");
let ybot=document.querySelector("#ybot");
let ccomplaints=document.querySelector("#ccomplaints");
let ycomplaints=document.querySelector("#ycomplaints");
let profile=document.querySelector("#profile");
let addycomp=document.querySelector("#addycomp");
let main=document.querySelector("#main");
let cpdf=document.querySelector("#cpdf");
let hpdf=document.querySelector("#hpdf");
let addcompprompt=document.querySelector("#addcompprompt");
let viewcompprompt=document.querySelector("#viewcompprompt");
let helpcompprompt=document.querySelector("#helpcompprompt");
let close_addcompprompt=document.querySelector("#close_addcompprompt");
let close_viewcompprompt=document.querySelector("#close_viewcompprompt");
let close_helpcompprompt=document.querySelector("#close_helpcompprompt");
let close_helpers_data=document.querySelector("#close_helpers_data");
let close_rolls_data=document.querySelector("#close_rolls_data");
let helpers_data=document.querySelector("#helpers_data");
let doneaddcomp=document.querySelector("#doneaddcomp");
let donehelpcomp=document.querySelector("#donehelpcomp");
let lin=document.querySelector("#lin");
let feedback=document.querySelector("#feedback");
let addcwrong=document.querySelector("#addcwrong");
let helpcwrong=document.querySelector("#helpcwrong");
let comprollno=document.querySelector("#comprollno");
let compitemname=document.querySelector("#compitemname");
let compdescr=document.querySelector("#compdescr");
let iplink=document.querySelector("#iplink");
let place=document.querySelector("#place");
let helpphno=document.querySelector("#helpphno");
let rolls=document.querySelector("#rolls");
let rolls_details=document.querySelector("#rolls_details");
let pprompt=document.querySelector("#pprompt");
let pname=document.querySelector("#pname");
let pnot=document.querySelector("#pnot");
let perout=document.querySelector("#perout");
let percircle=document.querySelector("#percircle");
let plogout=document.querySelector("#plogout");
let About=document.querySelector("#About");
let addcomppdfflag=0;
let helpcomppdfflag=0;
const params = new URLSearchParams(window.location.search);
const n = params.get('name');
const roll=params.get("roll");
pname.innerText=`Name : ${n}`;
welcome.innerText=`Hello ${n} : ${roll}`;
About.addEventListener("click",()=>{
    window.open("index-(About).html","_blank");
})
perout.addEventListener("click",async ()=>{
    try{
        const response = await fetch("http://192.168.33.35:2000/notification", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ roll }) // Ensure roll is properly defined
        });
        const data=await response.json();
        if(data.success){
            console.log("changed");
        }else{
            console.log("not changed");
        }
    }catch(err){
        alert("error in chaging the notification");
    }
    if(perout.style.justifyContent==="flex-start"){
        perout.style.justifyContent="flex-end";
        perout.style.backgroundColor="grey";
    }else{
        perout.style.justifyContent="flex-start";
        perout.style.backgroundColor="blue";
    }
});
window.onpopstate = function() {
    if (sessionStorage.getItem("loggedIn") !== "true") {
        window.location.href = "index-(STUDENT).html";
    }
};
plogout.addEventListener("click",()=>{
    sessionStorage.removeItem("loggedIn");
    window.location.href = "index-(STUDENT).html";
})
document.addEventListener("DOMContentLoaded", async function() {
    if (sessionStorage.getItem("loggedIn") !== "true") {
        window.location.href = "index-(STUDENT).html";
    }
    try{
        const response=await fetch("http://192.168.33.35:2000/vnotification",{
            method:"POST",
            headers:{"Content-Type":"application/x-www-form-urlencoded"},
            body:new URLSearchParams({roll})
        });
        const data=await response.json();
        if(data.success){
            if(data.val[0].notification==1){
                perout.style.justifyContent="flex-start";
                perout.style.backgroundColor="blue";
            }else{
                perout.style.justifyContent="flex-end";
                perout.style.backgroundColor="grey";
            }
        }else{
            alert("data json returns success : false");
        }
    }catch(err){
        alert("error in fetching data of profile !!");
    }
    try {
        const response = await fetch('http://192.168.33.35:2000/ccomp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ roll })
        });
        const data = await response.json();
        if (data.result && Array.isArray(data.result) && data.result.length > 0) {
            data.result.forEach(element => {
                let el = document.createElement("div");
                el.classList.add("nele");
                let left = document.createElement("h2");
                left.classList.add("left");
                left.innerText = `${element.roll}'s ${element.itemname}`;
                let right = document.createElement("div");
                right.classList.add("right");
                right.style.visibility="hidden";
                right.style.opacity=0;
                el.addEventListener('mouseenter', () => {
                    right.style.opacity=1;
                    right.style.visibility="visible";
                });
                el.addEventListener('mouseleave', () => {
                    right.style.opacity=0;
                    right.style.visibility="hidden";
                });
                let view = document.createElement("div");
                view.classList.add("view");
                view.innerHTML = "View";
                view.addEventListener("click", function() {
                    main.classList.add("addtomain");
                    comprollno.innerText = `roll : ${element.roll}`;
                    compitemname.innerText =`Lost Item : ${element.itemname}`;
                    compdescr.innerText = `Description : ${element.descr}`;
                    if (element.filepath !== "none") {
                        iplink.querySelector("a").href = element.filepath;
                        iplink.querySelector("a").target = "_blank";
                    } else {
                        iplink.querySelector("a").innerText = "!! Not Avaliable !!";
                    }
                    viewcompprompt.style.visibility = "visible";
                });
                let help = document.createElement("div");
                help.classList.add("help");
                help.innerText = "Help";
                right.appendChild(view);
                right.appendChild(help);
                help.addEventListener("click",async function(){
                    main.classList.add("addtomain");
                    helpcompprompt.style.visibility="visible";
                    donehelpcomp.addEventListener("click",async function(){
                        const regex = /^\d{10}$/;
                        let recoveryplace=place.value.trim();
                        let helperno=helpphno.value.trim();
                        let checkphno=regex.test(helperno);
                        if(recoveryplace.length!=0){
                            if(checkphno){
                                if(helpcomppdfflag){
                                    let f = roll; 
                                    let t = `${element.roll}`; 
                                    let lostitem = `${element.itemname}`;
                                    let recoveryplace = place.value.trim(); 
                                    let helperno = helpphno.value.trim();
                                    let pdf = hpdf.files[0]; 
                                    console.log("Complaint from " + f + " to help " + t);
                                    const formData = new FormData();
                                    formData.append('f', f);
                                    formData.append('t', t);
                                    formData.append('lostitem', lostitem);
                                    formData.append('recoveryplace', recoveryplace);
                                    formData.append('helperno', helperno);
                                    formData.append('pdf', pdf);
                                    for (let [key, value] of formData.entries()) {
                                        console.log(key, value);
                                    }
                                    try {
                                        const response = await fetch('http://192.168.33.35:2000/help', {
                                            method: 'POST',
                                            body: formData
                                        });
                                        const data = await response.json();
                                        if (data.success) {
                                            try{
                                                const r=await fetch('http://192.168.33.35:2000/helpmsg',{
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                                                    body: new URLSearchParams({ f,t,lostitem })
                                                })
                                                const d=await r.json();
                                                if(d.success){
                                                    alert(`Thanks for your success the ${t} was informed by message`);
                                                    helpcwrong.style.color="green";
                                                    helpcwrong.innerText = "!! Thanks for Your Help !!";
                                                    donehelpcomp.style.pointerEvents="none";
                                                    setTimeout(()=>{
                                                        helpcwrong.innerText = "";
                                                        helpcwrong.style.color="red";
                                                        main.classList.remove("addtomain");
                                                        helpcompprompt.style.visibility="hidden";
                                                        donehelpcomp.style.pointerEvents="auto";
                                                        window.location.reload();
                                                    },100);
                                                }else{
                                                    alert("message sending  to respective person success : false");
                                                }
                                            }catch(err){
                                                alert("error in sending msg to victim !!");
                                            }
                                        } else {
                                            helpcwrong.innerText = "Error in submitting help request.";
                                        }
                                    } catch (error) {
                                        helpcwrong.innerText = "Error: " + error.message;
                                    }
                                }else{
                                    helpcwrong.innerText="Required Image Pdf";
                                }
                            }else{
                                helpcwrong.innerText="Invalid Contact Number"
                            }
                        }else{
                            helpcwrong.innerText="Invalid Recoveryplace"
                        }
                    });
                });
                el.appendChild(left);
                el.appendChild(right);
                cbot.appendChild(el);
            });
        } else {
            let el = document.createElement("div");
            let h=document.createElement("h1");
            h.innerText="!! Community Members Didn't Lost Anything !!";
            el.appendChild(h);
            el.classList.add("nottheiranything");
            cbot.style.height=`100px`;
            cbot.appendChild(el);
        }
    } catch (err) {
        alert("Error in fetching complaints of community! Error: " + err);
    }

    try {
        const response = await fetch('http://192.168.33.35:2000/ycomp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ roll })
        });
        const data = await response.json();
        if (data.result && Array.isArray(data.result) && data.result.length > 0) {
            data.result.forEach(element => {
                let el = document.createElement("div");
                el.classList.add("nele");
                let left = document.createElement("h2");
                left.classList.add("left");
                left.innerText = `Your ${element.itemname}`;
                let right = document.createElement("div");
                right.classList.add("righty");
                right.style.visibility="hidden";
                right.style.opacity=0;
                el.addEventListener('mouseenter', () => {
                    right.style.opacity=1;
                    right.style.visibility="visible";
                });
                el.addEventListener('mouseleave', () => {
                    right.style.opacity=0;
                    right.style.visibility="hidden";
                });
                let view = document.createElement("div");
                view.classList.add("viewy");
                view.innerHTML = "View";
                view.addEventListener("click", function() {
                    main.classList.add("addtomain");
                    comprollno.innerText = `roll : ${element.roll}(You)`;
                    compitemname.innerText =`Lost Item : ${element.itemname}`;
                    compdescr.innerText = `Description : ${element.descr}`;
                    if (element.filepath !== "none") {
                        iplink.querySelector("a").href = element.filepath;
                        iplink.querySelector("a").target = "_blank";
                    } else {
                        iplink.querySelector("a").innerText = "!! Not Avaliable !!";
                    }
                    viewcompprompt.style.visibility = "visible";
                });
                let helpers = document.createElement("div");
                helpers.classList.add("helpy");
                helpers.innerText = "Helpers";
                helpers.addEventListener("click",async function(){
                    helpers_data.style.visibility="visible";
                    main.classList.add("addtomain");
                    let lost_person_roll=`${element.roll}`;
                    let lost_person_itemname=`${element.itemname}`;
                    console.log("lost person roll : "+lost_person_roll);
                    console.log("lost persons item : "+lost_person_itemname);
                    try {
                        const response = await fetch('http://192.168.33.35:2000/helpers', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                            body: new URLSearchParams({ lost_person_roll, lost_person_itemname })
                        });
                        const data = await response.json();
                        console.log("data="+data);
                        if (data.success && Array.isArray(data.r) && data.r.length > 0) {
                            data.r.forEach(element => {
                                let helpfrom=`${element.f}`;
                                let helpto=`${element.t}`;
                                let helptogive=`${element.lostitem}`;
                                let recplace=`${element.recoveryplace}`;
                                let helpno=`${element.helperno}`;
                                let filepath=`${element.filepath}`;
                                let el=document.createElement("div");
                                el.classList.add("nhelp");
                                rolls.appendChild(el);
                                let eleft=document.createElement("h2");
                                eleft.innerText=`${helpfrom}`;
                                eleft.style.color="white";
                                let eright=document.createElement("div");
                                eright.classList.add("eright");
                                eright.innerText="view";
                                el.addEventListener("mouseenter",()=>{
                                    eright.style.opacity=1;
                                    eright.style.visibility="visible";
                                });
                                el.addEventListener("mouseleave",()=>{
                                    eright.style.opacity=0;
                                    eright.style.visibility="hidden";
                                });
                                eright.addEventListener("click",()=>{
                                    rolls.style.zIndex=0;
                                    rolls_details.style.zIndex=1;
                                    document.getElementById("help_from_roll").innerText = `MyRollNo: ${helpfrom}`;
                                    document.getElementById("item_recovery_place").innerText = `RecoveryPlace: ${recplace}`;
                                    document.getElementById("helper_phno").innerText = `MyPhno: ${helpno}`;
                                    const helperImgText = document.getElementById("helper_img_text");
                                    helperImgText.innerHTML = `Image: <a href="${filepath}" target="_blank" style="text-decoration:none; color:black;">Click Here To Verify Your Item</a>`;

                                });
                                el.appendChild(eleft);
                                el.appendChild(eright);
                            });
                        } else {
                            document.querySelector("#not_their").style.display="block";
                        }
                    } catch (error) {
                        console.error("Error fetching helpers: " + error);
                        alert("Error fetching helpers. Please try again later.");
                    }
                })
                let del=document.createElement("div");
                del.classList.add("del");
                del.innerText="Delete";
                del.addEventListener("click", async () => {
                    let droll = element.roll;
                    let ditemname = element.itemname;
                    console.log("Delete: " + droll + " " + ditemname);
                    try {
                        const response = await fetch('http://192.168.33.35:2000/delete', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                            body: new URLSearchParams({ droll, ditemname })
                        });
                        const data = await response.json();
                        if (data.success) {
                            window.location.reload();
                            alert("Your complaint deleted successfully hope you got your item back");
                        } else {
                            console.error("Deletion failed:"+data.message);
                        }
                    } catch (error) {
                        console.error("Error:"+error);
                    }
                });
                right.appendChild(view);
                right.appendChild(helpers);
                right.appendChild(del)
                el.appendChild(left);
                el.appendChild(right);
                ybot.appendChild(el);
            });
        } else {
            let el = document.createElement("div");
            let h=document.createElement("h1");
            h.innerText="!! Yoy Didn't Lost Anything !!";
            el.appendChild(h);
            el.classList.add("nottheiranything");
            ybot.style.height=`100px`;
            ybot.appendChild(el);
        }
    } catch (err) {
        alert("Error in fetching complaints of community! Error: " + err);
    }
});

ccomplaints.addEventListener("click",()=>{
    addycomp.style.visibility="hidden";
    ybot.style.visibility="hidden";
    cbot.style.visibility="visible";
    ccomplaints.style.backgroundColor="#00ADB5";
    ycomplaints.style.backgroundColor="white";
});
ycomplaints.addEventListener("click",()=>{
    addycomp.style.visibility="visible";
    ybot.style.visibility="visible";
    cbot.style.visibility="hidden";
    ccomplaints.style.backgroundColor="white";
    ycomplaints.style.backgroundColor="#00ADB5";
});
profile.addEventListener("click",()=>{
    if(pprompt.style.visibility==="hidden"){
        pprompt.style.visibility="visible";
        profile.innerText="--close--";
        profile.style.backgroundColor="red";
        profile.style.color="white";
    }else{
        pprompt.style.visibility="hidden";
        profile.innerText="Profile";
        profile.style.backgroundColor="white";
        profile.style.color="black";
    }
});

cpdf.addEventListener("change", () => {
    addcomppdfflag=0;
    if(cpdf.files && cpdf.files.length > 0){
        const file = cpdf.files[0];
        const maxSize = 500 * 1024;
        if(file.size > maxSize){
            document.querySelector("#addcwrong").innerText="Size exceeded";
            cpdf.value = '';
            document.querySelector(".cfilelabel").innerText="Image_pdf(Optional)";
        }else{
            document.querySelector("#addcwrong").innerText="";
            addcomppdfflag=1;
            const fileName = file.name;
            const maxLength = 20;
            if(fileName.length > maxLength){
                document.querySelector(".cfilelabel").innerText=`${fileName.substring(0, maxLength)}...`;
            }else{
                document.querySelector(".cfilelabel").innerText=`${fileName}`;
            }
        }
    }else{
        cpdf.value = '';
        document.querySelector(".cfilelabel").innerText="Image_pdf(Optional)";
        document.querySelector("#addcwrong").innerText="No file selected";
    }
    console.log("addcomppdf status : "+addcomppdfflag);
});
hpdf.addEventListener("change", () => {
    helpcomppdfflag=0;
    if(hpdf.files && hpdf.files.length > 0){
        const file = hpdf.files[0];
        const maxSize = 500 * 1024;
        if(file.size > maxSize){
            document.querySelector("#helpcwrong").innerText="Size exceeded";
            hpdf.value = '';
            document.querySelector(".hfilelabel").innerText="Image_pdf(Mandatory)";
        }else{
            document.querySelector("#helpcwrong").innerText="";
            helpcomppdfflag=1;
            const fileName = file.name;
            const maxLength = 20;
            if(fileName.length > maxLength){
                document.querySelector(".hfilelabel").innerText=`${fileName.substring(0, maxLength)}...`;
            }else{
                document.querySelector(".hfilelabel").innerText=`${fileName}`;
            }
        }
    }else{
        hpdf.value = '';
        document.querySelector(".hfilelabel").innerText="Image_pdf(Mandatory)";
        document.querySelector("#helpcwrong").innerText="No file selected";
    }
    console.log("addcomppdf status : "+addcomppdfflag);
});
addycomp.addEventListener("click",()=>{
    main.classList.add("addtomain");
    addcompprompt.style.visibility="visible";
    addycomp.style.visibility="hidden";
})
close_addcompprompt.addEventListener("click",()=>{
    main.classList.remove("addtomain");
    addcompprompt.style.visibility="hidden";
    addycomp.style.visibility="visible";
});
close_viewcompprompt.addEventListener("click",()=>{
    main.classList.remove("addtomain");
    viewcompprompt.style.visibility="hidden";
});
close_helpcompprompt.addEventListener("click",()=>{
    main.classList.remove("addtomain");
    helpcompprompt.style.visibility="hidden";
});
close_helpers_data.addEventListener("click",()=>{
    const nhelpElements = rolls.querySelectorAll(".nhelp");
    nhelpElements.forEach(element => element.remove());
    main.classList.remove("addtomain");
    helpers_data.style.visibility="hidden";
    document.querySelector("#not_their").style.display="none";
})
close_rolls_data.addEventListener("click",()=>{
    rolls_details.style.zIndex=0;
    rolls.style.zIndex=1;
})
doneaddcomp.addEventListener("click",async function(){
    let name=lin.value.trim();
    let descr=feedback.value.trim();
    if(name.length!=0&&descr.length!=0){
        if(addcomppdfflag){
            try{
                const pdf = document.getElementById("cpdf").files[0]; 
                const formData = new FormData();
                formData.append("roll",roll);
                formData.append("name", name);
                formData.append("flag",addcomppdfflag);
                formData.append("descr", descr);    
                formData.append("pdf", pdf);
                console.log("calling backend");
                console.log("form data : ")
                const response=await fetch("http://192.168.33.35:2000/addcompwithpdf",{
                    method:"POST",
                    body:formData
                });
                const data=await response.json();
                if(data.success){
                    doneaddcomp.style.pointerEvents="none";
                    addcwrong.style.color="green";
                    addcwrong.innerText="added successfully";
                    try{
                        const r = await fetch('http://192.168.33.35:2000/addcompmsg', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                            body: new URLSearchParams({ roll, name })
                        });
                        const d = await r.json();
                        if(d.success){
                            alert("complaint added successfully and messages sent to community members !!");
                            setTimeout(()=>{
                                addcwrong.innerText="";
                                addcwrong.style.color="red";
                                main.classList.remove("addtomain");
                                addcompprompt.style.visibility="hidden";
                                addycomp.style.visibility="visible";
                                doneaddcomp.style.pointerEvents="auto";
                            },400);
                            window.location.reload();
                        }else{
                            alert("message sending d.success : false")
                        }
                    }catch(err){
                        alert("error in sending messages");
                    }
                }else{
                    addcwrong.innerText="Not added successfully";
                }
            }catch(err){
                addcwrong.innerText="Error in Rasing complaint";
            }
        }else{
            try{
                const response=await fetch("http://192.168.33.35:2000/addcompwithoutpdf",{
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({ roll, name,descr }) 
                });
                const data=await response.json();
                if(data.success){
                    doneaddcomp.style.pointerEvents="none";
                    addcwrong.style.color="green";
                    addcwrong.innerText="added successfully";
                    try{
                        const r = await fetch('http://192.168.33.35:2000/addcompmsg', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                            body: new URLSearchParams({ roll, name })
                        });
                        const d = await r.json();
                        if(d.success){
                            alert("complaint added successfully and messages sent to community members !!");
                            setTimeout(()=>{
                                addcwrong.innerText="";
                                addcwrong.style.color="red";
                                main.classList.remove("addtomain");
                                addcompprompt.style.visibility="hidden";
                                addycomp.style.visibility="visible";
                                doneaddcomp.style.pointerEvents="auto";
                            },400);
                            window.location.reload();
                        }else{
                            alert("message sending d.success : false")
                        }
                    }catch(err){
                        alert("error in sending messages");
                    }
                }else{
                    addcwrong.innerText="Not added successfully";
                }
            }catch(err){
                addcwrong.innerText="Error in Rasing complaint";
            }
        }
        
    }else{
        addcwrong.innerText="!! Insufficient Details !!";
    }
})