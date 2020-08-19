function removeAccents(str: string)
{
    return str
        .replace(/[ÀÁÂÃÄÅ]/g,"A")
        .replace(/[àáâãäå]/g,"a")
        .replace(/[ÈÉÊË]/g,"E")
        .replace(/[ìíîï]/g,"i")
        .replace(/[ÌÍÎÏ]/g,"I")
        .replace(/[òóôöõ]/g,"o")
        .replace(/[ÒÓÔÖÕ]/g,"O")
        .replace(/[ùúûü]/g,"u")
        .replace(/[ÙÚÛÜ]/g,"U")
        .replace(/[ç]/g,"c")
        .replace(/[Ç]/g,"C")
        //.... all the rest
}

// function removeAccentsOld(str: string) 
// {

//     var withAccents = "ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝŔÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿŕ";
//     var withoutAccents = "AAAAAAACEEEEIIIIDNOOOOOOUUUUYRsBaaaaaaaceeeeiiiionoooooouuuuybyr";
//     var newStr="";

//     for(var i = 0; i < str.length; i++) {
//         var replace = false;
//         for (var a = 0; a < withAccents.length; a++) {
//             if (str.substr(i,1) == withAccents.substr(a,1)) {
//                 newStr += withoutAccents.substr(a,1);
//                 replace = true;
//                 break;
//             }
//         }
//         if (replace == false) {
//             newStr += str.substr(i,1);
//         }
//     }
//     return newStr;
// }

export default removeAccents;