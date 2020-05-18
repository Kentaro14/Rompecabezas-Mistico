//Script para iniciar el Modal al cargar la pagina
$(window).on('load',function(){
    $('#myModal').modal('show');
});

//Script para que se bloquee cualquier click fuera del Modal
$('#myModal').modal({backdrop: 'static', keyboard: false});
