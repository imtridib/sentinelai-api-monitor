const pool=require("./db");
async function createAlert(a,explanation){const r=await pool.query(
 "INSERT INTO alerts(endpoint,severity,anomaly_type,message,details,ai_explanation) VALUES($1,$2,$3,$4,$5::jsonb,$6) RETURNING *",
 [a.endpoint,a.severity,a.anomalyType,a.message,JSON.stringify(a.details||{}),explanation||null]);return r.rows[0]}
async function listAlerts({status,limit=100}){const vals=[];let where="";if(status){vals.push(status);where="WHERE status=$1"}vals.push(limit);
 return (await pool.query(`SELECT * FROM alerts ${where} ORDER BY created_at DESC LIMIT $${vals.length}`,vals)).rows}
async function resolveAlert(id){return (await pool.query("UPDATE alerts SET status='resolved',resolved_at=NOW() WHERE id=$1 AND status='active' RETURNING *",[id])).rows[0]||null}
module.exports={createAlert,listAlerts,resolveAlert};
