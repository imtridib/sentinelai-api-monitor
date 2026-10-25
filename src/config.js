require("dotenv").config();
module.exports={port:Number(process.env.PORT||3000),databaseUrl:process.env.DATABASE_URL,
 dbSsl:String(process.env.DB_SSL||"false").toLowerCase()==="true",
 geminiApiKey:process.env.GEMINI_API_KEY||"",geminiModel:process.env.GEMINI_MODEL||"gemini-2.0-flash",
 frontendOrigin:process.env.FRONTEND_ORIGIN||"http://localhost:5173"};
