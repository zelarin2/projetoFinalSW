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


function fPiada(){
    var bMaduro = this.readyState===4 && this.status===200
    if (bMaduro){
        var oResposta = JSON.parse(
            this.responseText 
        )
        var value = oResposta.value

        strHtml ='<h3 align="center">'+value+'</h3>'

        this.mWhereToReply.innerHTML = strHtml
    }
    else{
        this.mWhereToReply.innerHTML = this.readyState
    }
}
