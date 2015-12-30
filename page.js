var response;

// $.get('teste.html', function(r) {   
//    response = r;
//    alert(r);    
// });

// $.ajax({
//     url: 'teste.html',
//     type: 'GET',
//     dataType: 'html',
//     success: function(r) {
//         response = r;
//         alert(r);
//     }
// });

$('h1').load('teste.html', function(r) {
    alert('completed');
});