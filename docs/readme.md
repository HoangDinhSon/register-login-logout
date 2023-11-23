---
runme:
  id: 01HFW0CEG084FYJ9NGKVQRZJMN
  version: v2.0
---

folder config : use config for whole project
.env : config but information sensitive

```sh {"id":"01HFW4CH53YMNK8QJEXPV3VCXT"}
PORT =3052
// when run in productions replace dev --> pro
NODE_ENV= dev
# NODE_ENV= pro
// DEV
DEV_APP_PORT= 3000
DEV_DB_HOST= localhost
DEV_DB_HOST= 27017
DEV_DB_NAME= shopDev
// Productuon change empty string
PRO_APP_PORT =''
PRO_DB_HOST  =''
PRO_DB_PORT  =''
PRO_DB_NAME  =''
```

### How to run project

- check file : env , config
- check package.json 
- check branch common we have three branch : main / dev
- check connect to DB 
- check router 
check files below
- src\dbs\init.mongodb.js
- auth 

### Organize files in project

- controller handler  req from browser (http request ),
   request client upload have object have header

### Models use for DB
- model in mongoose is instance of collection in DB , and if you 