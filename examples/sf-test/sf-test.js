require('../examples/sf-client');

var sfuser = process.env.SF_USERNAME;
var sfpass = process.env.SF_SECURITY_TOKEN;

var orgCreds = {
  clientId: process.env.SF_CLIENT_ID,
  clientSecret: process.env.SF_CLIENT_SECRET,
  redirectUri: 'http://localhost:3000/oauth/_callback'
};

var sf = new Cylon.SF.SFClient({
  sfuser: sfuser,
  sfpass: sfpass,
  orgCredentials: orgCreds
});

var cc = 0;

sf.authenticate(function(msg) {
  var string;
  string = "^ Sphero Name: " + msg.sobject.Sphero_Name__c + ",";
  string += " Msg Content:" + msg.sobject.Content__c;
  string += ", SM Id:" + msg.sobject.Id;
  console.log("Printed from callback in client program.program");
  console.log(string + "\n");
});

var myId = null;
var message = "hello";
var detail = "Some Stuff for details";

setInterval(function() {
  cc++;
  myId = cc;
  var data = JSON.stringify({ identifier: "run3" + myId, msg: message });
  sf.push(data);
}, 1000);
