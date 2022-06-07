window.onload = boot

const ID_FEEDBACK = "idFeedback"

var oFeedback

function boot(){
    oFeedback = id(ID_FEEDBACK)

    getChuck()
}//boot

CHUCK_URL = "https://api.chucknorris.io/jokes/random"
function getChuck(){
    pedidoAjaxGet(
        CHUCK_URL,
        oFeedback,
        fPiada
    )
}
