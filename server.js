const app = require("./app");
const PORT = 3055
const server= app.listen(PORT,()=>{
    console.log(`WSV eCommerce start width ${PORT}`);
})
process.on("SIGINT",()=>{
    server.close(()=>{
        console.log(`exit server Express`);
    })
})