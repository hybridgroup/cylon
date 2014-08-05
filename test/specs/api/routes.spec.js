'use strict'

var Cylon = source('cylon');
var API = source('api');

var request= require('supertest');

var app = new API().express

var sinonSandbox = null;

describe("API endpoints", function(){

  // Helpers
  var resetCylon = function (){
    this.robots = {}
    this.commands = {};
  }.bind(Cylon);

  var commonAPIExpectations = function (res) {
    if (!(res.status == 200)) return "Expected to return 200";
    if (!(/application\/json/.test(res.headers['content-type']))) return "Not a json response";
  }

  var hasMCPObject = function (res){
    var keys = Object.keys(res.body);
    if (!(keys[0] == 'MCP')) return "JSON response should be wrapped in an object called MCP";
  }

  before(function(){
    resetCylon();
    sinonSandbox = sinon.sandbox.create();
  });

  beforeEach(function(){
      Cylon.robot({
        name: 'TestBot',
        connections: [{name: 'loopback', adaptor: 'loopback'}],
        devices: [{name: 'dev1', driver: 'ping'}],
        commands: ['cmd1', 'cmd2'],
        cmd1: function(name){
          return "hello " + name;
        }
      });

      Cylon.commands.hello = function(name) {
        return "hello " + name;
      }

  });

  after(function(){
    resetCylon();
    sinonSandbox.restore();
  });

  describe("GET /", function(){

    it('returns the full list of robots and commands', function(done){

      request(app)
        .get('/api/')
        .expect(commonAPIExpectations)
        .expect(hasMCPObject)
        .end(function(err, res){
          if (err) return done(err);

          var mcp = JSON.stringify(res.body.MCP);
          var jsonCylon =JSON.stringify(Cylon.toJSON());

          expect(mcp).to.be.eql(jsonCylon);
          done();
        });
    });

  });

  describe('GET /commands', function(){

    it('returns the full list of commands', function(done){

      request(app)
        .get('/api/commands')
        .expect(commonAPIExpectations)
        .end(function(err, res){
          if (err) return done(err);

          expect(res.body).to.include.key('commands');
          expect(res.body.commands).to.be.eql(['hello']);

          done();
        })
    });

  });

  describe('POST /commands/:command', function(){

    it('executes :command', function(done){

      sinonSandbox.spy(Cylon.commands, 'hello');

      request(app)
        .post('/api/commands/hello')
        .send({name: 'bot'})
        .expect(commonAPIExpectations)
        .end(function(err, res){
          if (err) return done(err);

          expect(Cylon.commands.hello).to.have.been.calledWith('bot');
          expect(res.body).to.include.key('result');
          expect(res.body.result).to.be.eql('hello bot');

          done();
        });
    });
  });

  describe('GET /api/robots', function(){

    it('returns an array of all robots', function(done){

      request(app)
        .get('/api/robots')
        .expect(commonAPIExpectations)
        .end(function(err, res){
          if (err) return done(err);

          expect(res.body).to.include.key('robots');

          var robotsInResponse = JSON.stringify(res.body.robots);
          var robotsInCylon = JSON.stringify(Cylon.toJSON().robots);

          expect(robotsInResponse).to.be.eql(robotsInCylon);

          done();
        });
    });
  });

  describe('GET /api/robots/:robot', function(){

    it('returns an object containing info of :robot', function(done){

      request(app)
        .get('/api/robots/TestBot')
        .expect(commonAPIExpectations)
        .end(function(err, res){
          if (err) return done(err);

          expect(res.body).to.include.key('robot');

          var robotInResponse = JSON.stringify(res.body.robot);
          var robotInCylon = JSON.stringify(Cylon.robots['TestBot']);

          expect(robotInResponse).to.be.eql(robotInCylon);

          done();
        });
    });
  });

  describe('GET /api/robots/:robot/commands', function(){

    it('returns an array of commands defined in :robot', function(done){

      request(app)
        .get('/api/robots/TestBot/commands')
        .expect(commonAPIExpectations)
        .end(function(err, res){
          if (err) return done(err);

          expect(res.body).to.include.key('commands');

          var commandsInResponse = JSON.stringify(res.body.commands);
          var commandsInRobot = JSON.stringify(Cylon.robots['TestBot'].commands);

          expect(commandsInResponse).to.be.eql(commandsInRobot);

          done();
        });
    });

  });

  describe('ALL /api/robots/:robot/commands/:command', function(){

    var itExecutesRobotsCommandViaMethod = function(method) {

      it("executes :robot's :command", function(done){

        var robot = Cylon.robots['TestBot'];
        sinonSandbox.spy(robot, 'cmd1');

        request(app)[method]('/api/robots/TestBot/commands/cmd1')
          .send({name: 'bot'})
          .expect(commonAPIExpectations)
          .end(function(err, res){
            if (err) return done(err);

            expect(robot.cmd1).to.have.been.calledWith('bot');
            expect(res.body).to.include.key('result');
            expect(res.body.result).to.be.eql('hello bot');

            done();
          });
      });
    }

    describe('GET', function(){
      itExecutesRobotsCommandViaMethod('get');
    });

    describe('POST', function(){
      itExecutesRobotsCommandViaMethod('post');
    });

    describe('PUT', function(){
      itExecutesRobotsCommandViaMethod('put');
    });

    describe('PATCH', function(){
      itExecutesRobotsCommandViaMethod('patch');
    });

    describe('DELETE', function(){
      itExecutesRobotsCommandViaMethod('delete');
    });
  });

  describe('GET /api/robots/:robot/devices', function() {

    it("returns an array containing information about :robot's devices", function(done) {

      request(app)
        .get('/api/robots/TestBot/devices')
        .expect(commonAPIExpectations)
        .end(function(err, res){
          if (err) return done(err);

          expect(res.body).to.include.key('devices');

          var devicesInResponse = JSON.stringify(res.body.devices);
          var devicesInRobot = JSON.stringify(Cylon.robots['TestBot'].toJSON().devices);

          expect(devicesInResponse).to.be.eql(devicesInRobot);
          done();
        });
    });
  });

  describe('GET /api/robots/:robot/devices/:device', function () {

    it('returns an object containing information about :device in :robot', function(done) {

      request(app)
        .get('/api/robots/TestBot/devices/dev1')
        .expect(commonAPIExpectations)
        .end(function(err, res){
          if (err) return done(err);

          expect(res.body).to.include.key('device');

          var deviceInResponse = JSON.stringify(res.body.device);
          var deviceInRobot = JSON.stringify(Cylon.robots.TestBot.devices.dev1);

          expect(deviceInResponse).to.be.eql(deviceInRobot);
          done();
        });
    });
  });

  describe('GET /api/robots/:robot/devices/:device/events/:event', function(){
    it('opens a Server-Sent Events stream tha hooks into :event on :device');
  });

  describe('GET /api/robots/:robot/devices/:device/commands', function(){

    it('returns an array of commands defined in :device', function(done){

      request(app)
        .get('/api/robots/TestBot/devices/dev1/commands')
        .expect(commonAPIExpectations)
        .end(function(err, res){
          if (err) return done(err);

          var robot = Cylon.robots['TestBot'];
          expect(res.body).to.include.key('commands');

          var commandsInResponse = JSON.stringify(res.body.commands);
          var commandsInDevice = JSON.stringify(robot.devices.dev1.toJSON().commands);

          expect(commandsInResponse).to.be.eql(commandsInDevice);

          done();
        });
    });

  });

  describe('ALL /api/robots/:robot/devices/:device/commands/:command', function(){

    var itExecutesDevicesCommandViaMethod = function(method) {

      it("executes :device's :command", function(done){

        var device = Cylon.robots['TestBot'].devices.dev1;
        sinonSandbox.spy(device, 'ping');

        request(app)[method]('/api/robots/TestBot/devices/dev1/commands/ping')
          .expect(commonAPIExpectations)
          .end(function(err, res){
            if (err) return done(err);

            expect(device.ping).to.have.been.called;
            expect(res.body).to.include.key('result');

            done();
          });
      });
    }

    describe('GET', function(){
      itExecutesDevicesCommandViaMethod('get');
    });

    describe('POST', function(){
      itExecutesDevicesCommandViaMethod('post');
    });

    describe('PUT', function(){
      itExecutesDevicesCommandViaMethod('put');
    });

    describe('PATCH', function(){
      itExecutesDevicesCommandViaMethod('patch');
    });

    describe('DELETE', function(){
      itExecutesDevicesCommandViaMethod('delete');
    });
  });

  describe('GET /api/robots/:robot/connections', function() {

    it('returns an array of connections', function(done) {

      request(app)
        .get('/api/robots/TestBot/connections')
        .expect(commonAPIExpectations)
        .end(function(err, res){
          if (err) return done(err);

          expect(res.body).to.include.key('connections');

          var connectionsInResponse = JSON.stringify(res.body.connections)
          var connectionsInRobot = JSON.stringify(Cylon.robots.TestBot.toJSON().connections);

          expect(connectionsInResponse).to.be.eql(connectionsInRobot);
          done();
        });
    });
  });

  describe('GET /api/robots/:robot/connections/:connection', function(){

    it('returns object containing information about :connection', function(done){

      var robotConnections = Cylon.robots.TestBot.connections

      request(app)
        .get('/api/robots/TestBot/connections/loopback')
        .expect(commonAPIExpectations)
        .end(function(err, res){
          if (err) return done(err);

          expect(res.body).to.include.key('connection');

          var connectionInResponse = JSON.stringify(res.body.connection);
          var connectionInRobot = JSON.stringify(robotConnections.loopback);

          expect(connectionInResponse).to.be.eql(connectionInRobot);

          done();
        });
    });
  });
});
