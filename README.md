start: npm start

First time use:
- cd websocket
- npm install
- cd services
- npm install aws-sdk

Test:
 - https://www.piesocket.com/websocket-tester
 - enter: wss://dcm74utml8.execute-api.us-west-1.amazonaws.com/admin
 - open as many browsers as you want, get friends, etc...
 - enter: {"action":"sendmessage", "data":"Hello World"} (or whatever message you want)
 - everyone connected will see the message and receieve it.

 Deploy:
 (This allows us to separate our environments, so when working in dev, it doesn’t break the API for active users.)
- npx sst deploy --stage prod
    
 Cleanup:
 (remove resources)
- npx sst remove
- npx sst remove --stage prod