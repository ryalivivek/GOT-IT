document.addEventListener('DOMContentLoaded', () => {
    const greetingElement = document.querySelector("#greeting");
    async function getCurrentTime() {
    try{
        const response = await fetch('http://worldtimeapi.org/api/timezone/Asia/Kolkata');
        const data = await response.json();
        const currentDateTime = new Date(data.datetime);
        const currentHour = currentDateTime.getHours();
        let greeting;
        if (currentHour >= 5 && currentHour < 12) {
            greeting = 'Good Morning';
        } else if (currentHour >= 12 && currentHour < 17) {
            greeting = 'Good Afternoon';
        }else {
            greeting = 'Good Evening';
        }
        greetingElement.textContent = greeting;
        } catch (error) {
            console.error('Error fetching time:', error);
            greetingElement.textContent = 'Hello!';
        }
    }
    getCurrentTime();
    setInterval(getCurrentTime, 60000);
});
let student=document.querySelector("#stbut");
student.addEventListener("click",()=>{
    window.location.href="index-(STUDENT).html";
});
let admin=document.querySelector("#adbut");
admin.addEventListener("click",()=>{
    window.location.href="index-(ADMIN).html";
});