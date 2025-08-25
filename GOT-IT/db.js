const mysql=require("mysql");
const connectin=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"justchill",
    database:"gotit"
});
connectin.connect((err)=>{
    if(err)
        console.log(err.code);
    else
        console.log("connected to database");
});
module.exports=connectin;