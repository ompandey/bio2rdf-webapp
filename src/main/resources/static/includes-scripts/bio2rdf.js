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
        crossDomain : true,
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Accept", "application/rdf+json");
        }
    }).done(function(data, textStatus, jqXHR) {
        if (typeof console !== "undefined" && console.debug) {
            console.debug("[load] Success");
        }

        nextDatabank.load(data);

        if (typeof console !== "undefined" && console.debug) {
            console.debug("[load] Databank size = " + nextDatabank.size());
        }

        successCallback(queryString, nextDatabank);
    }).fail(function(jqXHR, textStatus, errorThrown) {
        failureCallback(queryString, nextDatabank);
    }).always(function(dataORjqXHR, textStatus, jqXHRORerrorThrown) {
        console.debug("[load] Always called");
    });
};

bio2rdf.renderTriplesCallback = function(queryString, nextDatabank) {
    if (typeof console !== "undefined" && console.debug) {
        console.debug("[renderTriplesCallback] queryString = " + queryString);
        console.debug("[renderTriplesCallback] Databank size = " + nextDatabank.size());
    }

    // Find label if possible
    var labelQuery = $.rdf({
        databank : nextDatabank
    })
    // Find all possible child object details for this object type
    .where('?subject rdfs:label ?label');

    var labels = labelQuery.select();

    var label = "";
    $.each(labels, function(index, nextLabel) {
        label += nextLabel.label.value + "<br/>";
        if (index === 0) {
            document.title = label + " : " + bio2rdf.appName;
        }
    });

    $("#label").text(label);

    var myQuery = $.rdf({
        databank : nextDatabank
    })
    // Find all possible child object details for this object type
    .where('?subject ?predicate ?object');

    var bindings = myQuery.select();

    bindings.sort(bio2rdf.sortTriples);
    var table = document.createElement("table");
    $table = $(table);
    $table.addClass("table table-striped");

    var trHeader = document.createElement("tr");
    $trHeader = $(trHeader);

    var thSubject = document.createElement("th");
    $thSubject = $(thSubject);
    $thSubject.text("Subject");
    $trHeader.append($thSubject);

    var thPredicate = document.createElement("th");
    $thPredicate = $(thPredicate);
    $thPredicate.text("Predicate");
    $trHeader.append($thPredicate);

    var thObject = document.createElement("th");
    $thObject = $(thObject);
    $thObject.text("Object");
    $trHeader.append($thObject);

    $table.append($trHeader);

    // Using document.createElement as it has a huge advantage over the jquery
    // method according to:
    // http://jsperf.com/create-dom-element/10
    $.each(bindings, function(index, nextChild) {
        var tr = document.createElement("tr");
        $tr = $(tr);

        var tdSubject = document.createElement("td");
        $tdSubject = $(tdSubject);
        if (nextChild.subject.type === "uri") {
            $tdSubject.attr("about", nextChild.subject.value);
        }
        $tdSubject.text(nextChild.subject.value);
        $tr.append($tdSubject);

        var tdPredicate = document.createElement("td");
        $tdPredicate = $(tdPredicate);
        // TODO: Add RDFa for predicate
        $tdPredicate.text(nextChild.predicate.value);
        $tr.append($tdPredicate);

        var tdObject = document.createElement("td");
        $tdObject = $(tdObject);
        // TODO: Add RDFa for object
        $tdObject.text(nextChild.object.value);
        $tr.append($tdObject);

        $table.append($tr);
    });

    $("#all").append($table);
};

bio2rdf.errorCallback = function(queryString, nextDatabank) {
    if (typeof console !== "undefined" && console.debug) {
        console.debug("[errorCallback] queryString = " + queryString);
        console.debug("[errorCallback] Databank size = " + nextDatabank.size());
    }
    $("<div></div>").addClass("alert alert-block alert-error fade in").val("Could not load data for: " + queryString)
            .appendTo($("#errorMessage"));
};

bio2rdf.sortTriples = function(a, b) {
    if (a.type === 'uri') {
        if (b.type === 'uri') {
            return (a.value > b.value) ? 1 : -1;
        }
        else {
            return -1;
        }
    }
    else if (b.type === 'uri') {
        return 1;
    }

    if (a.type === 'literal') {
        if (b.type === 'literal') {
            return (a.value > b.value) ? 1 : -1;
        }
        else {
            return -1;
        }
    }
    else if (b.type === 'literal') {
        return 1;
    }
    else {
        // Simple comparison on bnode labels
        return (a.value > b.value) ? 1 : -1;
    }
};