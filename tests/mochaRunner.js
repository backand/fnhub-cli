var Mocha = require("mocha");
var run = function(endCallback, testCallback) {

    var mocha = new Mocha({
        ui: "bdd",
        reporter: "spec",
        timeout: 45000
    });
    mocha.addFile("./tests/signin.js");

    var r = mocha.run().on('fail', function(test, err) {
        testCallback(test, err);
    })
	.on('pass',function(test,err){
		console.log('pass');
		testCallback(test, err);
	})
	.on('end',function(failures){
		console.log('end');
		endCallback(failures);
	});

    //console.log(r);

    return r;
}

 var tests = [];
		
run(function (failures) {
        if (tests.length > 0) {
            var res = {tests: tests}
            console.log(res);
        }
        process.exit(0);
    },
    function (test, err) {
        if(err)
        {	
            console.log(err);
            var errMsg = "'"+JSON.stringify(err)+"'";
            tests.push({test:test.title, error:errMsg});
        }
    });

    