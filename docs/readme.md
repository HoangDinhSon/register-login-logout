---
runme:
  id: 01HFW0CEG084FYJ9NGKVQRZJMN
  version: v2.0
---

### How to run project
- check file : .env , .config
- check package.json
- check branch common we have three branch : main / dev
- check connect to DB // we need ensure database connect success 
- auth
after enough step above : 
- npm install 
- npm run start 

```sh {"id":"01HFW4CH53YMNK8QJEXPV3VCXT"}
file .env 
PORT =3056
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

### Organize files in project

- controller handler  req from browser (http request ),
   request client upload have object have header
- models folder
  - use define collection in database
- service 
   - use communication between database and nodejs 
- dbs 
   -use set up connect database 
- utils 
   - handle function reuse for project 
- router 
   - define router 
- core 
   - handle response success and error 
- auth 
   - file authentication for project

------------

### commit login 
- handle login 
- add file reasonPhrases and statusCode to standardized code status and messend send to client
- handle router login  for shop