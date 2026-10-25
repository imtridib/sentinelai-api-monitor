const fs=require("node:fs"),path=require("node:path"),pool=require("../src/db");
(async()=>{try{await pool.query(fs.readFileSync(path.join(__dirname,"..","db","schema.sql"),"utf8"));console.log("Schema initialized")}catch(e){console.error(e.message);process.exitCode=1}finally{await pool.end()}})();
