
# Badminton Shop System

This project is shuttlecock useage recording and calculating the price for each person.

Using Line Login Service to get Players Line UserId to request API for their Line disPlayName
And also Line notify to alert the bill to owner.



## Installation

### Install Require Library
```bash
  npm install
```

### Sync Database
- Change the database information in db.js

### Run server
- To change the host port you can go into bin/www and change it.
  The default is 8000
```bash
  npm start
```

### Create Line Login Channel
[Click Here to create!](https://developers.line.biz/console/channel/new?type=line-login)

- Go to section LIFF --> add LIFF App
- Copy Liff ID to paste to file 
  - public/js/liff/init.js 
