/* 
 * Classe JS permettant de gerer l ajax
 */


Ajax = {
    envoyer : function (url,data,callBackSuccess,callBackFailure,type,method,title,message){
        var me = this;
        me.type = type || 'JSON';
        me.method = method || 'POST';
        me.data = data;
        me.url = url;
        me.title = title|| 'Traitement';
        me.message = message || "Merci de patienter";
        $.ajax({
                        url: me.url,
                        type: me.method,
                        async: true,
                        data: me.data,
                        dataType : me.type,
                        success: function (data) {
                            e = data;
                            if((data.success !== undefined && data.success === true) || (me.type === 'HTML')){
                                    if(callBackSuccess !== undefined){
                                            callBackSuccess(data);
                                    }
                                    
                            }else{
                                    if(callBackFailure !== undefined){
                                            callBackFailure(data);
                                    }
                                    
                            }
                            if (this.ajaxEnCours === 1) {
                                    me.fen.closeAlert();
                            }
                            this.ajaxEnCours--;
                        },
                        error: function (data) {
                            if(callBackFailure !== undefined){
                                    callBackFailure(data);
                            }
                            if (this.ajaxEnCours === 1) {
                                    me.fen.closeAlert();
                            }
                            this.ajaxEnCours--;	
                        }
             });
         }
};