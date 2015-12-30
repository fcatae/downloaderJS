var response;

// $.get('teste.html', function(r) {   
//    response = r;
//    alert(r);    
// });

$.ajax({
    url: 'teste.html',
    type: 'GET',
    dataType: 'html',
    success: function(r) {
        response = r;
        alert(r);
    }
}
);