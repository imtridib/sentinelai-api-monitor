function detectAnomalies(i){
 const out=[],endpoint=String(i.endpoint||"unknown");
 const status=Number(i.statusCode),latency=Number(i.responseTimeMs);
 const count=i.recordCount==null?null:Number(i.recordCount);
 if(!Number.isFinite(status)||status<100||status>599) out.push({endpoint,severity:"high",anomalyType:"INVALID_STATUS_CODE",message:"Missing or invalid HTTP status code",details:{statusCode:i.statusCode}});
 else if(status>=500) out.push({endpoint,severity:"critical",anomalyType:"SERVER_ERROR",message:`Server returned HTTP ${status}`,details:{statusCode:status}});
 else if(status>=400) out.push({endpoint,severity:"medium",anomalyType:"CLIENT_ERROR",message:`Endpoint returned HTTP ${status}`,details:{statusCode:status}});
 if(!Number.isFinite(latency)||latency<0) out.push({endpoint,severity:"high",anomalyType:"INVALID_RESPONSE_TIME",message:"Missing or invalid response time",details:{responseTimeMs:i.responseTimeMs}});
 else if(latency>=5000) out.push({endpoint,severity:"high",anomalyType:"HIGH_LATENCY",message:`Slow response: ${latency} ms`,details:{responseTimeMs:latency,thresholdMs:5000}});
 if(count!==null&&(!Number.isFinite(count)||count<0)) out.push({endpoint,severity:"medium",anomalyType:"INVALID_RECORD_COUNT",message:"Record count is invalid",details:{recordCount:i.recordCount}});
 else if(count===0) out.push({endpoint,severity:"high",anomalyType:"ZERO_RECORDS",message:"Endpoint returned zero records",details:{recordCount:0}});
 if(i.dataValid===false) out.push({endpoint,severity:"high",anomalyType:"INVALID_DATA",message:"Response data failed validation",details:{validationMessage:i.validationMessage||"No details provided"}});
 return out;
} module.exports={detectAnomalies};
