 
function id(pId){
    return document.getElementById(pId);
}//id
 
//_.~^~._.~^~._.~^~._.~^~._.~^~._.~^~._.~^~._.~^~._.~^~._.~^~.

function numeroAleatorio(pMin, pMax){
    var iAmp = Math.max(pMin, pMax) - Math.min(pMin, pMax)
    var iJump = Math.random() //[0, 1[
    var iSize = iJump*iAmp
    var iDestin = Math.min(pMin, pMax) + iSize
    return Math.floor(iDestin)
}//numeroAleatorio

//_.~^~._.~^~._.~^~._.~^~._.~^~._.~^~._.~^~._.~^~._.~^~._.~^~.

function pedidoAjaxGet(
    pUrl, //endereço devidamente construido
    pObjetoHtmlOndeMeterResposta,
    pFuncaoAtentaMaturidade
){
    var oPedido = new XMLHttpRequest()
    if (oPedido){
        //configurar o pedido
        oPedido.open(
            "GET", //método
            pUrl, //endpoint (endereço do recurso do qual esperamos resposta)
            true //async / assincronamente
        )
        //not bloqueado
        //readyState controla o estado de maturidade
        //oPedido.onreadystatechange = fAtentaMaturidade
        oPedido.onreadystatechange = pFuncaoAtentaMaturidade
        //opcional
        oPedido.mWhereToReply = pObjetoHtmlOndeMeterResposta

        oPedido.send(null)
    }//if
    return false
}//pedidoAjaxGet