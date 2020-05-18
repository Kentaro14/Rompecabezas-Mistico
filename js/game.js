var selectedPiece = "";

var url = ""

var movimientos=0;

var seconds = 0;

var timer;

$(document).ready(function () {
    bsCustomFileInput.init();
});

$("#inputGroupFile").on('change', function () {
    var input = $(this)[0];

    // Sacar nombre del archivo

    const nombre = input.files[0].name;

    const size = input.files[0].size;

    if (input.files && input.files[0]) {

        //Validar que sea menos de 2MB

        if (validarTamano(size)) {

            //Validar que sea imagen

            if (validarExtension(nombre)) {

                var reader = new FileReader();

                reader.readAsDataURL(input.files[0]);
                reader.onload = function (e) {

                    //validar que dimensiones sean iguales

                    const image = new Image();
                    image.src = e.target.result;

                    image.onload = function () {
                        var height = this.height;
                        var width = this.width;
                        console.log(`width: ${width} height: ${height}`);
                        if (height != width) {

                            $("#modalMensaje").modal('show');
                            document.getElementById("divalert").innerHTML = "Tu archivo debe tener la misma altura y ancho.";
                            $("#input-form").trigger("reset");

                        } else {

                            url = e.target.result;
                        }
                    }
                }

            } else {

                $("#modalMensaje").modal('show');
                document.getElementById("divalert").innerHTML = "Tu archivo debe ser un imagen ( ej:  .jpg .png .jpeg .jfif )";
                $("#input-form").trigger("reset");
            }

        } else {
            $("#modalMensaje").modal('show');
            document.getElementById("divalert").innerHTML = "Tu archivo debe pesar menos de 2MB";
            $("#input-form").trigger("reset");
        }
    }
});

// VALIDACIONES

//Validar que sea imagen

function validarExtension(name) {
    // Sacar la extension del archivo cargado
    const lastDot = name.lastIndexOf('.');
    var extFile = name.substring(lastDot + 1).toLowerCase();

    // Validar la extension

    if (extFile == "jpg" || extFile == "jpeg" || extFile == "png" || extFile == "svg" || extFile == "gif") {
        return true;
    }
    return false;
}


// Validar el tamaño

function validarTamano(file) {
    const fsize = Math.round((file / 1024));
    if (fsize > 2048) {
        return false;
    }
    return true;
}


function startGame() {

    const text = document.querySelector('#botonIniciar').innerHTML;

    if (text == "Nuevo Juego") {
        resetGame();
    } else {
        if(url==""){
            $("#modalMensaje").modal('show');
            document.getElementById("divalert").innerHTML = "Cargue un imagen iniciar el juego";
        }else{
            randomizePieces();
            loadImages(url);
            GameTimer();
            timer = setInterval(GameTimer, 1000);
            $('#inputGroupFile').attr("disabled",true);
            document.querySelector(`#botonIniciar`).classList.add("nuevo-juego");
            document.querySelector('#botonIniciar').innerHTML = "Nuevo Juego";
        }
    }
}

function selectElement(element) {

    // // pieza afuera seleccionada

    if (element.dataset.pieceo != undefined) {

        if (element.style.backgroundImage != "") {
            if (selectedPiece == element.dataset.pieceo) {
                selectedPiece = "";
                console.log("Piece deselected");
                element.classList.remove("selected-piece");

            } else {
                if (selectedPiece == "") {
                    selectedPiece = element.dataset.pieceo;
                    element.classList.add("selected-piece");
                } else {
                    document.querySelector(`[data-pieceo='${selectedPiece}']`).classList.remove("selected-piece");
                    selectedPiece = element.dataset.pieceo;
                    element.classList.add("selected-piece");
                }
                console.log("Piece selected");
            }


        }

     //Pieza dentro de tablero seleccionada

    } else {
        if (selectedPiece != "") {
            if (element.style.backgroundImage != "") {
                alert("Ya hay una pieza ahi!");
            } else {
                //COLOCAR PIEZA EN TABLERO

                element.setAttribute("data-piece", selectedPiece);
                document.querySelector(`[data-pieceo='${selectedPiece}']`).classList.remove("selected-piece");
                document.querySelector(`[data-pieceo='${selectedPiece}']`).style.removeProperty("background-image");
                element.style.backgroundImage = `url(${url})`
                selectedPiece = "";

                //SUMAR CONTADOR DE MOVIMIENTO

                movimientos++;
                $("#movimientos").html(`Movimientos: ${movimientos}`);

                //VERIFICAR SI GANO

                if (verifyWin()) {
                    document.querySelector(`#puzzle-board`).classList.add("puzzle-win");
                    clearInterval(timer); 
                    setTimeout(() => {
                        $("#modalGanar").modal('show');
                    }, 500);
                }
            }

        } else {

            if (element.style.backgroundImage != "") {

                let currentNum=element.dataset.piece;

                element.style.removeProperty("background-image");
                document.querySelector(`[data-pieceo='${element.dataset.piece}']`).style.backgroundImage = `url(${url})`

                do{
                    let randomNum=getRandomNumber(1,16);
                    element.dataset.piece=randomNum;
                }while(element.dataset.piece==currentNum);

            }
        }

    }
}


function GameTimer() {
    var minutes = Math.round((seconds - 30) / 60);
    var passedSeconds = seconds % 60;

    document.getElementById('timer').innerHTML ="Tiempo: "+ (minutes<10||minutes==null?`0${minutes}`:minutes) + ":" + (passedSeconds<10?`0${passedSeconds}`:passedSeconds);
    seconds++;
}

function resetGame(){
    $("#input-form").trigger("reset");
    $('#inputGroupFile').removeAttr("disabled");
    url = "";
    movimientos=0;
    seconds=0;
    clearInterval(timer); 
    removeImages();
    randomizePieces();
    randomizeBoard();
    document.querySelector(`#puzzle-board`).classList.remove("puzzle-win");
    $("#movimientos").html(`Movimientos: ${movimientos}`);
    $('#timer').html("Tiempo: 00:00");
    document.querySelector('#botonIniciar').innerHTML = "Jugar";
    document.querySelector(`#botonIniciar`).classList.remove("nuevo-juego");
}

function verifyWin() {
    for (i = 1; i < 17; i++) {
        const element = document.querySelector(`[data-position='${i}']`);

        if (element.dataset.position != element.dataset.piece) return false;
    }

    return true;
}

function randomizePieces() {


    for (var a = [], i = 0; i < 16; ++i) a[i] = i + 1;

    a = shuffle(a);

    for (i = 1; i < 17; i++) {
        const element = document.querySelector(`[data-positionO='${i}']`);

        element.setAttribute("data-pieceO", a[i - 1]);
    }
}

function randomizeBoard() {


    for (var a = [], i = 0; i < 16; ++i) a[i] = i + 1;

    a = shuffle(a);

    for (i = 1; i < 17; i++) {
        const element = document.querySelector(`[data-position='${i}']`);

        element.setAttribute("data-piece", a[i - 1]);
    }
}


function shuffle(array) {
    var tmp, current, top = array.length;
    if (top)
        while (--top) {
            current = Math.floor(Math.random() * (top + 1));
            tmp = array[current];
            array[current] = array[top];
            array[top] = tmp;
        }
    return array;
}

function loadImages(url) {
    const elements = document.querySelectorAll(".piece-group>div");
    const length = elements.length;

    for (var i = 0; i < length; i++) {
        elements[i].style.backgroundImage = `url(${url})`;
    }
}

function removeImages() {
    const elements = document.querySelectorAll(".piece-group>div");
    const elementsT = document.querySelectorAll(".puzzle>div");
    const length = elements.length;

    for (var i = 0; i < length; i++) {
        elements[i].style.removeProperty("background-image");
        elementsT[i].style.removeProperty("background-image");
    }
}

function getRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
  }