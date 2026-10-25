const {Pool}=require("pg"); const c=require("./config");
if(!c.databaseUrl){console.error("DATABASE_URL missing; copy .env.example to .env");process.exit(1)}
const pool=new Pool({connectionString:c.databaseUrl,ssl:c.dbSsl?{rejectUnauthorized:false}:false,
 max:10,connectionTimeoutMillis:5000});
pool.on("error",e=>console.error("[db]",e.message)); module.exports=pool;
