const test=require("node:test"),assert=require("node:assert/strict"),{detectAnomalies}=require("../src/anomalyEngine");
test("healthy input has no anomalies",()=>assert.deepEqual(detectAnomalies({endpoint:"/health",statusCode:200,responseTimeMs:120,recordCount:12,dataValid:true}),[]));
test("500 is critical",()=>{const a=detectAnomalies({endpoint:"/orders",statusCode:500,responseTimeMs:100,recordCount:4});assert.equal(a[0].anomalyType,"SERVER_ERROR");assert.equal(a[0].severity,"critical")});
test("latency and zero records detected",()=>{const a=detectAnomalies({endpoint:"/reports",statusCode:200,responseTimeMs:6000,recordCount:0});assert.ok(a.some(x=>x.anomalyType==="HIGH_LATENCY"));assert.ok(a.some(x=>x.anomalyType==="ZERO_RECORDS"))});
test("invalid data detected",()=>assert.ok(detectAnomalies({endpoint:"/users",statusCode:200,responseTimeMs:200,recordCount:2,dataValid:false}).some(x=>x.anomalyType==="INVALID_DATA")));
