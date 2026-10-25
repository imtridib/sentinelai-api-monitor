const express=require("express"),cors=require("cors"),c=require("./config"),pool=require("./db");
const {detectAnomalies}=require("./anomalyEngine"),{explainAnomaly}=require("./aiExplainer"),repo=require("./alertRepository");
const app=express();app.use(cors({origin:c.frontendOrigin}));app.use(express.json({limit:"1mb"}));
app.use((req,res,next)=>{const t=Date.now();res.on("finish",()=>console.log(JSON.stringify({method:req.method,path:req.path,status:res.statusCode,durationMs:Date.now()-t})));next()});
app.get("/",(_,res)=>res.json({name:"SentinelAI",status:"running",endpoints:["GET /health","POST /monitor","GET /alerts","PATCH /alerts/:id/resolve"]}));
app.get("/health",async(_,res)=>{try{await pool.query("SELECT 1");res.json({status:"ok",database:"connected",ai:c.geminiApiKey?"configured":"fallback-mode"})}catch(e){console.error(e.message);res.status(503).json({status:"error",database:"disconnected"})}});
app.post("/monitor",async(req,res,next)=>{try{const i=req.body||{};if(typeof i.endpoint!=="string"||!i.endpoint.trim())return res.status(400).json({error:"endpoint must be a non-empty string"});
 const anomalies=detectAnomalies(i),alerts=[];for(const a of anomalies){const ai=await explainAnomaly(a);alerts.push({...await repo.createAlert(a,ai.explanation),explanationSource:ai.source})}
 res.status(201).json({monitored:i.endpoint,anomalyCount:anomalies.length,healthy:!anomalies.length,alerts})}catch(e){next(e)}});
app.get("/alerts",async(req,res,next)=>{try{const status=req.query.status;if(status&&!["active","resolved"].includes(status))return res.status(400).json({error:"status must be active or resolved"});
 const n=Number(req.query.limit||100),limit=Number.isInteger(n)?Math.min(Math.max(n,1),200):100;const alerts=await repo.listAlerts({status,limit});res.json({count:alerts.length,alerts})}catch(e){next(e)}});
app.patch("/alerts/:id/resolve",async(req,res,next)=>{try{if(!/^\d+$/.test(req.params.id))return res.status(400).json({error:"id must be an integer"});
 const alert=await repo.resolveAlert(req.params.id);if(!alert)return res.status(404).json({error:"Active alert not found"});res.json({message:"Alert resolved",alert})}catch(e){next(e)}});
app.use((e,req,res,next)=>{console.error("[error]",e.message);res.status(500).json({error:"Internal server error"})});
if(require.main===module){const s=app.listen(c.port,()=>console.log(`SentinelAI API listening on http://localhost:${c.port}`));
 const stop=signal=>{console.log(signal);s.close(async()=>{await pool.end();process.exit(0)});setTimeout(()=>process.exit(1),5000).unref()};
 process.on("SIGINT",()=>stop("SIGINT"));process.on("SIGTERM",()=>stop("SIGTERM"))}
module.exports=app;
