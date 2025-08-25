const express = require("express");
const connection = require("./db");
const bodyparser = require("body-parser");
const { Vonage } = require("@vonage/server-sdk");
const path = require("path");
const cors = require("cors");
const multer = require('multer');
const app = express();
const vonageCredentials = {
    "8125855308": ["dbfdba47", "HkTeGwzqeDPWz2zu"],
    "6281843969": ["b43d6089", "1qFYcHREiAejx06y"],
    "8019763325":["d699de9f", "A648H8sGk1BASw5s"],
    "9391792453":["f4f01ceb","6ykj0I1ljDFiJGRU"],
    "7095820438":["1f1f6305","NT2Gdhc0TM4EF1Xh"]
};
app.use(express.static(__dirname));
app.use(cors());
app.use(bodyparser.urlencoded({ extended: true }));
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'spdfs'); 
    },
    filename: (req, file, cb) => {
        const roll = req.body.roll;
        const fileExt = path.extname(file.originalname);
        const newFileName = `${req.body.name}_${roll}${fileExt}`; 
        cb(null, newFileName);
    }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 500 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only PDFs are allowed"));
        }
    }
}).single("pdf");
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index-(HOME_PAGE).html'));
});
app.post("/signup-data", (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.json({ success: false, error: err.message });
        }
        const { roll, name, mno, suppassword, conpassword } = req.body;
        const filePath = `spdfs/${req.file.filename}`;
        const query = `INSERT INTO users (roll, name, mno, password, filepath) VALUES (?, ?, ?, ?, ?)`;
        connection.query(query, [roll, name, mno, suppassword, filePath], (err, result) => {
            if (err) {
                return res.json({ success: false, error: err.message });
            }
            res.json({ success: true });
        });
    });
});
const storage1 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'complaints'); 
    },
    filename: (req, file, cb) => {
        const roll = req.body.roll;
        const fileExt = path.extname(file.originalname);
        const newFileName = `${req.body.name}_${roll}${fileExt}`; 
        cb(null, newFileName);
    }
});

const upload1 = multer({
    storage: storage1,
    limits: { fileSize: 500 * 1024 }, 
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only PDFs are allowed"));
        }
    }
}).single("pdf");
app.post("/addcompwithpdf", upload1, (req, res) => {
    if (req.file) {
        const filePath = path.join('complaints', req.file.filename);
        const { roll, name, descr } = req.body;
        const sql = 'INSERT INTO complaints (roll, itemname, descr, filepath) VALUES (?, ?, ?, ?)';
        const values = [roll, name, descr, filePath];
        connection.query(sql, values, (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ success: false, message: 'Database insertion failed.' });
            }
            res.json({ success: true});
        });
    } else {
        res.status(400).json({ success: false});
    }
});
app.post("/addcompwithoutpdf",(req,res)=>{
    const {roll,name,descr}=req.body;
    const query=`insert into complaints (roll,itemname,descr,filepath) values (?,?,?,"none")`;
    connection.query(query,[roll,name,descr],(error,results)=>{
        if (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Database insertion failed.' });
        }
        res.json({ success: true, message: 'PDF file uploaded and data saved successfully!', filePath: "none" });
    })
})
const storage2 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'helpers'); 
    },
    filename: (req, file, cb) => {
        const toRoll = req.body.t; 
        const lostitem = req.body.lostitem;
        const originalFileName = file.originalname;
        const newFileName = `${toRoll}_${lostitem}_${originalFileName}`; 
        cb(null, newFileName); // Save with this new file name
    }
});
const upload2 = multer({
    storage: storage2,
    limits: { fileSize: 500 * 1024 }, 
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only PDFs are allowed"));
        }
    }
}).single("pdf");
app.post("/help", upload2, (req, res) => {
    if (req.file) {
        const filePath = path.join('helpers', req.file.filename);
        const { f, t, lostitem, recoveryplace, helperno } = req.body;
        const sql = 'INSERT INTO helpers (f, t, lostitem, recoveryplace, helperno, filepath) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [f, t, lostitem, recoveryplace, helperno, filePath];
        connection.query(sql, values, (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ success: false, message: 'Database insertion failed.' });
            }
            res.json({ success: true, message: 'Help request added successfully!' });
        });
    } else {
        res.status(400).json({ success: false, message: 'No file uploaded.' });
    }
});
app.post("/denyAccess", (req, res) => {
    const { mno, adminName, reason } = req.body;
    const credentials = vonageCredentials[mno];
    const [apiKey, apiSecret] = credentials;
    const vonage = new Vonage({
        apiKey: apiKey,
        apiSecret: apiSecret
    });
    const from = "Vonage";
    const to = `+91${mno}`;
    const text = `Your GOTIT Access Denied by ${adminName} (ADMIN)\nReason: ${reason}`;
    vonage.sms.send({ to, from, text })
        .then(response => {
            if (response.messages[0].status === "0") {
                res.json({ success: true, message: 'Access denial message sent successfully' });
            } else {
                console.error(`Message failed with error: ${response.messages[0]['error-text']}`);
                res.status(500).json({ success: false, message: 'Failed to send message', error: response.messages[0]['error-text'] });
            }
        })
        .catch(err => {
            console.error('Vonage error:', err);
            res.status(500).json({ success: false, message: 'Failed to send message', error: err.message });
        });
});
app.post("/allowAccess", (req, res) => {
    const { mno, adminName } = req.body;
    const credentials = vonageCredentials[mno];
    const [apiKey, apiSecret] = credentials;
    const vonage = new Vonage({
        apiKey: apiKey,
        apiSecret: apiSecret
    });
    const from = "Vonage";
    const to = `+91${mno}`;
    const text = `Your GOTIT Access is allowed by ${adminName}`;
    vonage.sms.send({ to, from, text })
        .then(response => {
            if (response.messages[0].status === "0") {
                res.json({ success: true, message: 'Access allowed message sent successfully' });
            } else {
                console.error(`Message failed with error: ${response.messages[0]['error-text']}`);
                res.status(500).json({ success: false, message: 'Failed to send message', error: response.messages[0]['error-text'] });
            }
        })
        .catch(err => {
            console.error('Vonage error:', err);
            res.status(500).json({ success: false, message: 'Failed to send message', error: err.message });
        });
});
app.post("/signup", (req, res) => {
    const { phno } = req.body;
    const credentials = vonageCredentials[phno];
    const [apiKey, apiSecret] = credentials;
    const vonage = new Vonage({
        apiKey: apiKey,
        apiSecret: apiSecret
    });
    const otp = Math.floor(100000 + Math.random() * 900000);
    const query = `
    INSERT INTO Otpdata (phno, otp)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE otp = VALUES(otp);
    `;
    connection.query(query, [phno, otp], (err, result) => {
        if (err) {
            console.error("Database error:", err); 
            return res.status(500).json({ success: false, message: 'Database error', error: err.message });
        }
        const from = "Vonage";
        const to = `+91${phno}`;
        const text = `GOTIT SIGNUP OTP :  ${otp}`;
        vonage.sms.send({ to, from, text })
            .then(response => {
                if (response.messages[0].status === "0") {
                    res.json({ success: true, message: 'OTP sent successfully', otp });
                } else {
                    console.error(`Message failed with error: ${response.messages[0]['error-text']}`);
                    res.status(500).json({ success: false, message: 'Failed to send OTP', error: response.messages[0]['error-text'] });
                }
            })
            .catch(err => {
                console.error('Vonage error:', err);
                res.status(500).json({ success: false, message: 'Failed to send OTP', error: err.message });
            });
    });
});
app.post("/helpmsg", (req, res) => {
    const { f, t, lostitem } = req.body;
    const queryT = `SELECT mno FROM users WHERE roll = ?`;
    connection.query(queryT, [t], (err, tResults) => {
        if (err || tResults.length === 0) {
            return res.status(500).json({ success: false, message: "Failed to fetch recipient's details" });
        }
        const tMno = tResults[0].mno;
        const credentials = vonageCredentials[tMno];
        const [apiKey, apiSecret] = credentials;
        const vonage = new Vonage({ apiKey: apiKey, apiSecret: apiSecret });
        const from = "Vonage";
        const to = `+91${tMno}`;
        const text = `You got a help message from roll ${f} regarding the lost item: ${lostitem} for further details open www.GOTIT.com`;
        vonage.sms.send({ to, from, text })
            .then(response => {
                if (response.messages[0].status === "0") {
                    res.json({ success: true, message: 'Message sent successfully' });
                } else {
                    res.status(500).json({ success: false, message: 'Failed to send message', error: response.messages[0]['error-text'] });
                }
            })
            .catch(err => {
                res.status(500).json({ success: false, message: 'Error sending message', error: err.message });
            });
    });
});
app.post("/addcompmsg", (req, res) => {
    const { roll, name } = req.body;
    const query = `SELECT mno FROM users WHERE notification = 1 AND roll != ?`;
    connection.query(query, [roll], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Failed to fetch members' contact details" });
        }
        const sendMessages = results.map(({ mno }) => {
            const credentials = vonageCredentials[mno];
            const [apiKey, apiSecret] = credentials;
            const vonage = new Vonage({ apiKey: apiKey, apiSecret: apiSecret });
            const from = "GOTIT";
            const to = `+91${mno}`;
            const text = `From: GOTIT\nRoll No: ${roll} lost ${name}`;
            return vonage.sms.send({ to, from, text });
        });
        Promise.all(sendMessages)
            .then(responses => {
                const allMessagesSent = responses.every(response => response.messages[0].status === "0");
                if (allMessagesSent) {
                    res.json({ success: true, message: "Complaint added successfully and messages sent to community members!" });
                } else {
                    res.status(500).json({ success: false, message: "Some messages failed to send." });
                }
            })
            .catch(err => {
                res.status(500).json({ success: false, message: "Error sending messages", error: err.message });
            });
    });
});
app.post("/viewuser",(req,res)=>{
    const{viewroll}=req.body;
    connection.query("select *from users where roll=?",[viewroll],(err,result)=>{
        if(err){
            res.status(500).json({success:false});
        }
        res.json({success:true,val:result});
    })
})
app.post("/vroll",(req,res)=>{
    const {r}=req.body;
    const query='SELECT *FROM users WHERE roll = ?';
    connection.query(query,[r],(err,results)=>{
        if(err){
            console.error("Database error : ",err);app.post("/vroll",(req,res)=>{
                const {r}=req.body;
                const query='SELECT *FROM users WHERE roll = ?';
                connection.query(query,[r],(err,results)=>{
                    if(err){
                        console.error("Database error : ",err);
                        return res.status(500).json({ success: false, message: 'Database error', error: err.message });
                    }
                    if (results.length == 0) {
                        res.json({ success: true, message: 'New User' });
                    } else {
                        res.json({ success: false, message: 'Existing User' ,name:results[0].name});
                    }
                })
            });
            return res.status(500).json({ success: false, message: 'Database error', error: err.message });
        }
        if (results.length == 0) {
            res.json({ success: true, message: 'New User' });
        } else {
            res.json({ success: false, message: 'Existing User' ,name:results[0].name});
        }
    })
});
app.post("/vsignin",(req,res)=>{
    const {r,p}=req.body;
    const query='SELECT *FROM users WHERE roll = ? AND password = ?';
    connection.query(query,[r,p],(err,results)=>{
        if(err){
            console.error("Database error : ",err);
            return res.status(500).json({ success: false, message: 'Database error', error: err.message });
        }
        if (results.length == 1) {
            res.json({ success: true, message: 'New User' });
        } else {
            res.json({ success: false, message: 'Existing User' });
        }
    })
});
app.post("/vnotification",(req,res)=>{
    const {roll}=req.body;
    connection.query("select notification from users where roll=?",[roll],(err,result)=>{
        if(err){
            return res.status(500).json({ success: false, message: 'Database error: ' + err });
        }
        res.json({success:true,val:result});
    });
});
app.post('/notification', (req, res) => {
    const { roll } = req.body;
    const toggleNotificationQuery = `
        UPDATE users 
        SET notification = CASE 
            WHEN notification = 1 THEN 0
            ELSE 1 
        END
        WHERE roll = ?;
    `;
    connection.query(toggleNotificationQuery, [roll], (error, results) => {
        if (error) {
            return res.status(500).json({ success: false, message: 'Database error: ' + error });
        }
        res.json({ success: true });
    });
});  
app.post("/checkaccess",(req,res)=>{
    const {r}=req.body;
    connection.query("select access from users where roll=?",[r],(err,result)=>{
        if(err){
            return res.status(500).json({success:false,message:"internal server error !!"});
        }
        res.json({success:true,val:result});
    })
})
app.post('/access', (req, res) => {
    const { croll } = req.body;
    const toggleaccessQuery = `
        UPDATE users 
        SET access = CASE 
            WHEN access = 1 THEN 0
            ELSE 1 
        END
        WHERE roll = ?;
    `;
    connection.query(toggleaccessQuery, [croll], (error, results) => {
        if (error) {
            return res.status(500).json({ success: false, message: 'Database error: ' + error });
        }
        res.json({ success: true });
    });
}); 
app.post("/verify", (req, res) => {
    const { phno, o } = req.body;
    const query = `SELECT * FROM Otpdata WHERE phno = ? AND otp = ?`;  
    connection.query(query, [phno, o], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ success: false, message: 'Database error', error: err.message });
        }
        if (results.length > 0) {
            res.json({ success: true, message: 'OTP verified successfully' });
        } else {
            res.json({ success: false, message: 'Invalid OTP or phone number' });
        }
    });
});
app.post("/ccomp",(req,res)=>{
    const {roll}=req.body;
    connection.query("select *from complaints where roll!= ? and roll in (select roll from users where access =1)",[roll],(err,result)=>{
        if(err){
            console.error("Database error:", err);
            return res.status(500).json({ success: false, message: 'Database error', error: err.message });
        }
        res.json({result});
    })
});
app.post("/ycomp",(req,res)=>{
    const {roll}=req.body;
    connection.query("select *from complaints where roll= ?",[roll],(err,result)=>{
        if(err){
            console.error("Database error:", err);
            return res.status(500).json({ success: false, message: 'Database error', error: err.message });
        }
        res.json({result});
    })
});

app.post("/delete", (req, res) => {
    const { droll, ditemname } = req.body;
    connection.query("SET sql_safe_updates = 0", (err) => {
        if (err) {
            console.error("Error disabling sql_safe_updates:", err);
            return res.status(500).json({ success: false, message: 'Error disabling sql_safe_updates', error: err.message });
        }
        let q1 = "DELETE FROM complaints WHERE roll=? AND itemname=?";
        connection.query(q1, [droll, ditemname], (err) => {
            if (err) {
                console.error("Error deleting from complaints:", err);
                return res.status(500).json({ success: false, message: 'Error deleting from complaints', error: err.message });
            }
            let q2 = "DELETE FROM helpers WHERE t=? AND lostitem=?";
            connection.query(q2, [droll, ditemname], (e) => {
                if (e) {
                    console.error("Error deleting from helpers:", e);
                    return res.status(500).json({ success: false, message: 'Error deleting from helpers', error: e.message });
                }
                console.log("Successfully deleted from complaints and helpers.");
                return res.json({ success: true, message: "done deletion" });
            });
        });
    });
});
app.post("/helpers", (req, res) => {
    const { lost_person_roll, lost_person_itemname } = req.body;
    const query = "select * from helpers where t = ? and lostitem = ? and f in (select roll from users where access=1)";
    connection.query(query, [lost_person_roll, lost_person_itemname], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ success: false, message: 'Database error', error: err.message });
        }
        res.json({success:true,r:result});
    });
});
app.post("/aload",(req,res)=>{
    connection.query("select *from users",(err,result)=>{
        if(err){
            return res.status(500).json({success:false});
        }
        res.json({success:true,val:result});
    })
});
app.post("/nelbh",(req,res)=>{
    const{nelbhroll}=req.body;
    connection.query("select *from helpers where f=?",[nelbhroll],(err,result)=>{
        if(err){
            return res.status(500).json({success:false});
        }
        res.json({success:true,rlen:result.length,val:result});
    })
})

app.post("/nelbc",(req,res)=>{
    const {roll}=req.body;
    connection.query("select *from complaints where roll= ?",[roll],(err,result)=>{
        if(err){
            console.error("Database error:", err);
            return res.status(500).json({ success: false, message: 'Database error', error: err.message });
        }
        res.json({success:true,rlen:result.length,val:result});
    })
});
app.listen(2000, '0.0.0.0', () => {
    console.log("Server is running on port 2000");
});
