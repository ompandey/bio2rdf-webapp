bio2rdf.newDatabank = function() {
    var nextDatabank = $.rdf.databank();
    nextDatabank.base(bio2rdf.baseUrl)
    nextDatabank.prefix('rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#');
    nextDatabank.prefix('rdfs', 'http://www.w3.org/2000/01/rdf-schema#');
    nextDatabank.prefix("xsd", "http://www.w3.org/2001/XMLSchema#");
    nextDatabank.prefix("dcterms", "http://purl.org/dc/terms/");
    nextDatabank.prefix("dc", "http://purl.org/dc/elements/1.1/");
    nextDatabank.prefix('owl', 'http://www.w3.org/2002/07/owl#');
    nextDatabank.prefix("foaf", "http://xmlns.com/foaf/0.1/");

    return nextDatabank;
};

bio2rdf.load = function(queryString, nextDatabank, successCallback, failureCallback) {
    var requestUrl = bio2rdf.baseUrl + queryString;
    
    $.ajax({
        url : requestUrl,
        type : 'GET',
        dataType : 'json', // what is expected back
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Accept", "application/rdf+json");
        },
        done : function(data, textStatus, jqXHR) {
            if (typeof console !== "undefined" && console.debug) {
                console.debug("[load] Success");
            }
            
            nextDatabank.load(data);
    
            if (typeof console !== "undefined" && console.debug) {
                console.debug("[load] Databank size = " + nextDatabank.size());
            }
    
            successCallback(nextDatabank);
        },
        fail : failureCallback
    });
}