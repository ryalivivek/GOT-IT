let welcome=document.querySelector("#welcome");
let bot=document.querySelector("#bot");
let main=document.querySelector("#main");
let main2=document.querySelector("#main2");
let viewuser=document.querySelector("#viewuser");
let viewuserbot=document.querySelector("#viewuserbot");
let closeviewuser=document.querySelector("#closeviewuser");
let helpedto=document.querySelector("#helpedto");
let helpedtof=document.querySelector("#helpedtof");
let closehelpedto=document.querySelector("#closehelpedto");
let helpedtofbot=document.querySelector("#helpedtofbot");
let helpedtob=document.querySelector("#helpedtob");
let closehelpedtob=document.querySelector("#closehelpedtob");
let helpedtobbot=document.querySelector("#helpedtobbot");
let complaints=document.querySelector("#complaints");
let complaintsf=document.querySelector("#complaintsf");
let complaintsfbot=document.querySelector("#complaintsfbot");
let closecomplaints=document.querySelector("#closecomplaints");
let complaintsb=document.querySelector("#complaintsb");
let complaintsbbot=document.querySelector("#complaintsbbot");
let closecomplaintsb=document.querySelector("#closecomplaintsb");
let restrict=document.querySelector("#restrict");
let restrictname=document.querySelector("#restrictname");
let closerestrict=document.querySelector("#closerestrict");
let restrictinput=document.querySelector("#restrictinput");
let erestrictinput=document.querySelector("#erestrictinput");
let restrictdone=document.querySelector("#restrictdone");
let logout=document.querySelector("#logout");
let params=new URLSearchParams(window.location.search);
let adminName=params.get("name");
welcome.innerText=`Hello : ${adminName} (ADMIN)`;
logout.addEventListener("click",()=>{
    window.location.href="index-(ADMIN).html";
})
document.addEventListener("DOMContentLoaded",async ()=>{
    try{
        const response=await fetch("http://192.168.33.35:2000/aload",{
            method:"POST",
            headers:{"Content-Type":"application/x-www-from-urlencoded"}
        });
        const data= await response.json();
        if(data.success&&data.val.length>0){
            data.val.forEach((d)=>{
                let nel=document.createElement("div");
                nel.classList.add("nel");
                let nelf=document.createElement("div");
                nelf.classList.add("nelf");
                nelf.style.visibility="visible";
                let nelfh=document.createElement("h4");
                nelfh.innerText=`${d.roll}`;
                nelf.appendChild(nelfh);
                let nelfi=document.createElement("div");
                nelfi.classList.add("nelfi");
                nelfi.innerHTML=`<i class="fa-solid fa-ellipsis-vertical"></i>`;
                nelf.appendChild(nelfi);
                let nelb=document.createElement("div");
                nelb.classList.add("nelb");
                nelb.style.visibility="hidden";
                let nelbv=document.createElement("div");
                nelbv.classList.add("nelbv");
                nelbv.innerText="View";
                let nelbh=document.createElement("div");
                nelbh.classList.add("nelbh");
                nelbh.innerText="helped To";
                let nelbc=document.createElement("div");
                nelbc.classList.add("nelbc");
                nelbc.innerText="Complaints";
                let accessdiv=document.createElement("div");
                accessdiv.classList.add("accessdiv");
                let accessheading=document.createElement("h3");
                accessheading.innerText="Access :";
                let access=document.createElement("div");
                access.classList.add("access");
                let accesstoggle=document.createElement("div");
                accesstoggle.classList.add("accesstoggle");
                access.appendChild(accesstoggle);
                accessdiv.appendChild(accessheading);
                accessdiv.appendChild(access);
                let closenelb=document.createElement("div");
                closenelb.classList.add("closenelb");
                closenelb.innerHTML=`<i class="fa-solid fa-xmark"></i>`;
                nelb.appendChild(nelbv);
                nelb.appendChild(nelbh);
                nelb.appendChild(nelbc);
                nelb.appendChild(accessdiv);
                nelb.appendChild(closenelb);
                nel.appendChild(nelf);
                nel.appendChild(nelb);
                bot.appendChild(nel);
                if(d.access==1){
                    access.style.justifyContent="flex-start";
                    access.style.backgroundColor="blue";
                }else{
                    access.style.justifyContent="flex-end";
                    access.style.backgroundColor="grey";
                }
                nelfi.addEventListener("click",()=>{
                    nelb.style.visibility="visible";
                    nelf.style.visibility="hidden";
                })
                closenelb.addEventListener("click",()=>{
                    nelb.style.visibility="hidden";
                    nelf.style.visibility="visible";
                })
                access.style.cursor="pointer";
                access.addEventListener("click",async ()=>{
                    try{
                        if(access.style.justifyContent==="flex-start"){
                            console.log("trying to off");
                            restrict.style.visibility="visible";
                            main2.style.display="block";
                            main.classList.add("addtomain");
                            restrictname.innerText=`${d.roll}'s Restriction :`;
                            restrictdone.addEventListener("click",async ()=>{
                                let msg=erestrictinput.value.trim();
                                if(msg.length>0){
                                    let reason=msg;
                                    let croll=d.roll;
                                    let mno=d.mno;
                                    const dr=await fetch("http://192.168.33.35:2000/denyAccess",{
                                        method:"post",
                                        headers:{"Content-Type":"application/x-www-form-urlencoded"},
                                        body:new URLSearchParams({mno,adminName,reason})
                                    })
                                    const response=await fetch("http://192.168.33.35:2000/access",{
                                        method:"POST",
                                        headers:{"Content-Type":"application/x-www-form-urlencoded"},
                                        body:new URLSearchParams({croll})
                                    })     
                                    rd(d.roll,d.mno);
                                    alert("!! Access Denied and informed to User !!");
                                    restrict.style.visibility="hidden";
                                    main2.style.display="none";
                                    main.classList.remove("addtomain");
                                    window.location.reload();               
                                }else{
                                    restrictinput.style.color="red";
                                    erestrictinput.style.borderColor="red";
                                    setTimeout(()=>{
                                        restrictinput.style.color="#222831"
                                        erestrictinput.style.borderColor="#222831";
                                    },200)
                                }
                            });
                        }else{
                            console.log("trying to on");
                            let croll=d.roll;
                            let mno=d.mno;
                            const aa=await fetch("http://192.168.33.35:2000/allowAccess",{
                                method:"POST",
                                headers:{"Content-Type":"application/x-www-form-urlencoded"},
                                body:new URLSearchParams({mno,adminName})
                            })
                            const response=await fetch("http://192.168.33.35:2000/access",{
                                method:"POST",
                                headers:{"Content-Type":"application/x-www-form-urlencoded"},
                                body:new URLSearchParams({croll})
                            })   
                            access.style.justifyContent="flex-start";
                            access.style.backgroundColor="blue";
                        }
                    }catch(err){
                        alert("error in try block to change the access !!");
                    }
                })
                nelbv.style.cursor="pointer";
                nelbv.addEventListener("click",async ()=>{
                    viewuser.style.visibility="visible";
                    main2.style.display="block";
                    main.classList.add("addtomain");
                    let viewroll=d.roll;
                    try{
                        const viewresponse=await fetch("http://192.168.33.35:2000/viewuser",{
                            method:"POST",
                            headers:{"Content-Type":"application/x-www-form-urlencoded"},
                            body:new URLSearchParams({viewroll})
                        })
                        const da=await viewresponse.json();
                        viewuserbot.innerHTML = `
                            <p><strong>Roll Number:</strong> ${da.val[0].roll}</p>
                            <p><strong>Name:</strong> ${da.val[0].name}</p>
                            <p><strong>Mobile Number:</strong> ${da.val[0].mno}</p>
                            <p><strong>Password:</strong> ${da.val[0].password}</p>
                            <p><strong>Notifications:</strong> ${da.val[0].notification === 1 ? 'On' : 'Off'}</p>
                            <p><strong>Access:</strong> ${da.val[0].access === 1 ? 'On' : 'Off'}</p>
                            <p><strong>ID_PROOF File:</strong> <a href="${da.val[0].filepath}" target="_blank">Click Here to See</a></p>
                        `;      
                    }catch(e){
                        alert("fetching error in try block to view");
                    }
                })
                nelbh.style.cursor="pointer";
                nelbh.addEventListener("click",async ()=>{
                    helpedto.style.visibility="visible";
                    helpedtof.style.visibility="visible";
                    main2.style.display="block";
                    main.classList.add("addtomain");
                    let nelbhroll=d.roll;
                    try{
                        const nelbhres=await fetch("http://192.168.33.35:2000/nelbh",{
                            method:"POST",
                            headers:{"Content-Type":"application/x-www-form-urlencoded"},
                            body:new URLSearchParams({nelbhroll})
                        })
                        const nelbhd=await nelbhres.json();
                        if(nelbhd.success){
                            if(nelbhd.rlen>0){
                                nelbhd.val.forEach((d)=>{
                                    let nhel=document.createElement("div");
                                    nhel.classList.add("nhel");
                                    let h=document.createElement("h3");
                                    h.innerText=`${d.t}'s ${d.lostitem}`;
                                    h.style.color="white";
                                    let vh=document.createElement("div");
                                    vh.classList.add("vh");
                                    vh.innerText="view";
                                    nhel.appendChild(h);
                                    nhel.appendChild(vh);
                                    helpedtofbot.appendChild(nhel);
                                    vh.addEventListener("click",()=>{
                                        helpedtob.style.visibility="visible";
                                        helpedtobbot.innerHTML = `
                                            <p><strong>Help To:</strong> ${d.t}</p>
                                            <p><strong>Lost Item:</strong> ${d.lostitem}</p>
                                            <p><strong>Recovery Place:</strong> ${d.recoveryplace}</p>
                                            <p><strong>Helper Contact:</strong> ${d.helperno}</p>
                                            <p><strong>Item Image/File:</strong> <a href="${d.filepath}" target="_blank">Click Here to View</a></p>
                                        `;
                                    })
                                })
                            }else{
                                helpedtofbot.innerHTML="<h2>!! Not Helped To AnyOne !!</h2>";
                            }
                        }else{
                            alert("success :false at /nelhbd endpoint");
                        }
                    }catch(erro){
                        alert("error in try block in nelbh event listener");
                    }
                })
                nelbc.style.cursor="pointer";
                nelbc.addEventListener("click",async ()=>{
                    complaints.style.visibility="visible";
                    complaintsf.style.visibility="visible";
                    main2.style.display="block";
                    main.classList.add("addtomain");
                    let roll=d.roll;
                    try{
                        const nelbcres=await fetch("http://192.168.33.35:2000/nelbc",{
                            method:"POST",
                            headers:{"Content-Type":"application/x-www-form-urlencoded"},
                            body:new URLSearchParams({roll})
                        })
                        const nelbcd=await nelbcres.json();
                        if(nelbcd.success){
                            if(nelbcd.rlen>0){
                                nelbcd.val.forEach((d)=>{
                                    let nhel=document.createElement("div");
                                    nhel.classList.add("nhel");
                                    let h=document.createElement("h3");
                                    h.innerText=`${d.roll}'s ${d.itemname}`;
                                    h.style.color="white";
                                    let vh=document.createElement("div");
                                    vh.classList.add("vh");
                                    vh.innerText="view";
                                    nhel.appendChild(h);
                                    nhel.appendChild(vh);
                                    complaintsfbot.appendChild(nhel);
                                    vh.addEventListener("click",()=>{
                                        complaintsb.style.visibility="visible";
                                        complaintsbbot.innerHTML = `
                                            <p><strong>Roll Number:</strong> ${d.roll}</p>
                                            <p><strong>Item Name:</strong> ${d.itemname}</p>
                                            <p><strong>Description:</strong> ${d.descr}</p>
                                            <p><strong>Item Image/File:</strong> ${d.filepath!="none" ? `<a href="${d.filepath}" target="_blank">Click Here to View</a>` : 'Not Available'}</p>
                                        `;
                                    })
                                })
                            }else{
                                complaintsfbot.innerHTML="<h2>!! Not Complaints To User !!</h2>";
                            }
                        }else{
                            alert("success :false at /nelhcd endpoint");
                        }
                    }catch(erro){
                        alert("error in try block in nelbh event listener");
                    }
                })
            })
        }else{
            if(data.val.length==0){
                let h=document.createElement("h1");
                h.innerText="!! No Users Exist !!"
                h.style.marginTop="20px";
                bot.appendChild(h);
            }else{
                console.log("data.success: false");
            }
        }
    }catch(err){
        console.error(err);
        alert("error in loading data "+err);
    }
})
function rd(name,mno){
    console.log("hello");
    console.log(`clicked on ${name}'s ${mno}`);
}
closerestrict.addEventListener("click",()=>{
    restrict.style.visibility="hidden";
    main2.style.display="none";
    main.classList.remove("addtomain");
    window.location.reload();
})
closeviewuser.addEventListener("click",()=>{
    main.classList.remove("addtomain");
    main2.style.display="none";
    viewuser.style.visibility="hidden";
})
closehelpedto.addEventListener("click",()=>{
    helpedtofbot.innerHTML="";
    main.classList.remove("addtomain");
    main2.style.display="none";
    helpedto.style.visibility="hidden";
    helpedtof.style.visibility="hidden";
})
closecomplaints.addEventListener("click",()=>{
    complaintsfbot.innerHTML="";
    main.classList.remove("addtomain");
    main2.style.display="none";
    complaints.style.visibility="hidden";
    complaintsf.style.visibility="hidden";
})
closehelpedtob.addEventListener("click",()=>{
    helpedtob.style.visibility="hidden";
})
closecomplaintsb.addEventListener("click",()=>{
    complaintsb.style.visibility="hidden";
})