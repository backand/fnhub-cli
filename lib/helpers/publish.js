module.exports.publish = publish;

function startPublish(name, version, callback){
    global.Backand.fn.post("publish", {name:name, version:version, status:'start'})
    .then(function(response){
        callback(null, response)
    })
    .catch(function(err){
        callback(err, null);
    });
}

function uploadToS3(callback){
    callback(null, {});
}

function endPublish(versionId, callback){
    global.Backand.fn.post("publish", {versionId:versionId, status:'end'})
    .then(function(response){
        callback(null, response)
    })
    .catch(function(err){
        callback(err, null);
    });
}

function publish(name, version, callback){
    startPublish(name, version, function(err, response){
        if (err) callback(err, null);
        else {
            var versionId = response.data.version.__metadata.id;
            uploadToS3(function(err, response){
                if (err) callback(err, null);
                else {
                    endPublish(versionId, callback);
                }
            })
        }
    })
}