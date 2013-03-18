function validaCPF(cpf) {
    if (cpf.length < 11) return false
    var nonNumbers = /\D/
    if (nonNumbers.test(cpf))return false
    if (cpf == "00000000000" || cpf == "11111111111" ||
        cpf == "22222222222" || cpf == "33333333333" ||
        cpf == "44444444444" || cpf == "55555555555" ||
        cpf == "66666666666" || cpf == "77777777777" ||
        cpf == "88888888888" || cpf == "99999999999")
            return false
    var a = []
    var b = new Number
    var c = 11
    for (i=0; i<11; i++){
            a[i] = cpf.charAt(i)
            if (i < 9) b += (a[i] * --c)
    }
    if ((x = b % 11) < 2) { a[9] = 0 } else { a[9] = 11-x }
    b = 0
    c = 11
    for (y=0; y<10; y++) b += (a[y] * c--)
    if ((x = b % 11) < 2) { a[10] = 0 } else { a[10] = 11-x }
    if ((cpf.charAt(9) != a[9]) || (cpf.charAt(10) != a[10]))return false
    return true
}

function vCPF(t){
    try{
        if(t=="")return true
        return validaCPF(t.replace(/\D/g,""))
    }catch(e){alert(e)}
}

function vNumero(t){
    return t.replace(/\d*/,"")==""
}

function vObrigatorio(t){
    return t!=""
}

function vEmail(t){
    return t.replace(/^\w[\w\.\+-]+@\w[\w\.\+-]+\.\w\w+$/,"")==""
}

function vCEP(t){
    return t.replace(/^\d{5}-\d{3}$/,"")==""
}

function vConfirma(t,i){
    return i.value==i.form.elements[i.name+"2"].value
}

function vSlug(t){
  return t.replace(/\w/g,'')==''
}

function vData(t){
    if(t=="")return true
    var dat=/^[0123]?\d\/[01]?\d\/\d{4}$/
    if(!dat.test(t))return false
    dat=t.split("/")
    var d=new Date()
    d.setFullYear(parseFloat(dat[2]))
    d.setMonth(parseFloat(dat[1])-1)
    d.setDate(parseFloat(dat[0]))
    return d.getMonth()==parseFloat(dat[1])-1
}

validadores={
    "vNumero":vNumero,
    "vEmail":vEmail,
    "vCPF":vCPF,
    "vCEP":vCEP,
    "vConfirma":vConfirma,
    "vData":vData,
    "vSlug":vSlug,
    "vObrigatorio":vObrigatorio
}

erros={
    "vNumero":"o campo permite apenas números",
    "vEmail":"digite corretamente o e-mail",
    "vCEP":"digite corretamente o CEP",
    "vCPF":"número de CPF inválido",
    "vConfirma":"digite corretamente a confirmação",
    "vData":"digite corretamente a data",
    "vSlug":"digite apenas letras, números e _",
    "vObrigatorio":"o campo precisa ser preenchido"
}

mascaras={
    "vMaskNumero":[ [/\D/g,""]                                        , false      ],
    "vMaskSlug":  [ [/\W/g,""]                                        , false      ],
    "vMaskCPF":   [ [/^(\d{3})(\d{3})(\d{3})(\d{2})$/,"$1.$2.$3-$4"]  , [/\D/g,""] ],
    "vMaskData":  [ [/^(\d{2})(\d{2})(\d{4})$/,"$1/$2/$3"]            , [/\D/g,""] ],
    "vMaskCEP":   [ [/^(\d{5})(\d{3})$/,"$1-$2"]                      , [/\D/g,""] ]
}

function showErros(er){
    var txterr="Por favor, corrija os seguintes erros:\n"
    for(var i=0;i<er.length;i++){
        txterr += " * " + $(er[i][0])
                            .parent().clone()        // get the label and clone it. Don't want to change the original
                            .find('select').remove() // remove the select
                            .andSelf().eq(1)         // and get the label again
                            .text().trim()           // get the result text
               + ": " + er[i][1] + "\n"
        er[i][0].parentNode.className+=" vErro"
    }
    alert(txterr)
}

function validaForm(){
    this.ferros=[]
    $(this).find("label")
      .removeClass("vErro")
      .each(function(){
        var vals=this.className.split(" ")
        for(var i=0;i<vals.length;i++)
            try{
                var fn=validadores[vals[i]]
                var inp=$(this).find("input, select")[0]
                if(!fn(inp.value,inp)){
                    $(this).parents("form")[0].ferros.push([inp,erros[vals[i]]])
                }
            }catch(e){}
      })
    if(this.ferros.length>0){
        showErros(this.ferros)
        return false
    }
}

function mascarar(inp,n){
    var lbl=inp.parentNode
    var vals=lbl.className.split(" ")
    for(var j=0;j<vals.length;j++){
        try{
            var fn=mascaras[vals[j]]
            inp.value=inp.value.replace(fn[n][0],fn[n][1])
        }catch(e){}
    }
}

$(function(){
  $("form.vForm")
    .submit(validaForm)
    .find("label input, label select")
      .blur(function(){mascarar(this,1),mascarar(this,0)})
      .focus(function(){mascarar(this,1)})
})
