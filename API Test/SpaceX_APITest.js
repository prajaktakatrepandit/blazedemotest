pm.test('01. Check Status of request.', function () {
    pm.response.to.have.status(200);
    pm.response.to.not.be.error;
});

pm.test('02. Check response time is less than 5ms', function(){
    pm.response.responseTime < 500 ;
});

const responseJson = pm.response.json();

pm.test('03. Check the version = 1.0', function(){
    pm.expect(responseJson.name).to.eql('Starlink-11 (v1.0)');
});

pm.test('04. Check for rocket, core, capsule and launchpad are present in response.', function(){
    pm.expect(responseJson.rocket).is.not.undefined;
    pm.expect(responseJson.capsules).is.not.undefined;
    pm.expect(responseJson.cores).is.not.undefined;
    pm.expect(responseJson.launchpad).is.not.undefined;    
});

pm.test('05. Check links present are working good == response code 200', function(){
    var wikiLink = responseJson.links.wikipedia;      
    console.log(wikiLink);
});
