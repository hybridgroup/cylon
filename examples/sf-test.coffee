require('./sf-client')

sfuser = "edgarsilva@hybridgroup.com"
sfpass = "password1232YOQR0HQMpQ5f74msKqaPuCD6"
orgCreds = {
  clientId: '3MVG9A2kN3Bn17huqBLyrtmQ9Cgwc.FjKA4769ApTRhNNjgKEetcGv23W97cJQ3ER3VXxzyREIaD0Bp1Or8ou'
  clientSecret: '6079348238616906521'
  redirectUri: 'http://localhost:3000/oauth/_callback'
}

sf = new Cylon.SF.SFClient(sfuser: sfuser, sfpass: sfpass, orgCredentials: orgCreds)

cc = 0
sf.authenticate((msg) ->
  simpleMessageString = "^ Sphero Name: #{msg.sobject.Sphero_Name__c}, Msg Content:#{ msg.sobject.Content__c }, SM Id:#{ msg.sobject.Id }"
  console.log("Printed from callback in client program.program")
  console.log(simpleMessageString + "\n")
)

myId = null
message = "hello"
detail = "Some Stuff for details"

setInterval(() =>
  cc++
  myId = cc
  toSend = "{ \"identifier\" :\"run3#{ myId }\", \"msg\": \"#{ message }\" }"
  sf.push(toSend)
, 1000)
