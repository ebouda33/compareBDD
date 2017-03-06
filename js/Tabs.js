/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function Tabs (selector){
    var me = this;
    
    me.selector = selector || "#tabs";
    me.widget = $( me.selector ).tabs();
    
    me.tabCounter = 0;
    me.tabTitle = $( "#tab_title" );
    me.tabContent = $( "#tab_content" );
    me.tabTemplate = "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></li>";
    me.listeSousTab = [];
    me.listeTab = [];
    
    me.close = function(){
        if(me.tabCounter>0){
            me.tabCounter--;
        }
    };
    // Close icon: removing the tab on click
//    me.widget.on( "click", me.selector+" span.ui-icon-close", me.close());
    
    me.existeTab = function(selector){
        return $(selector).length>0;
    };
    me.__create = function(data,activate,parent){
        var tabs = $(me.selector).tabs();
        
        eric = [];
        activate = activate || true;
        var label = data.table.replace(/\s/g,'_')|| "Tab " + me.tabCounter,
        idLabel = data.table.replace(/\s|\(|\)/g,'_'),
        id = "tabs_" + idLabel;
        var index = 0;
        
        //recherche existance et destruction
        if(me.existeTab('#'+id) === false){
        
            li = $( me.tabTemplate.replace( /#\{href\}/g, "#" + id ).replace( /#\{label\}/g, label ) );
            var tabContentHtml = me.tabContent.val() || data.data || data.msg;
            var st = data.stabs || [];  
             ul = "#ul_tabs" ;
//            var niveau = tabs.find(".ui-tabs-nav" );
            if(st.length> 0){
                tabContentHtml ='<div id="stabs_'+idLabel+'" style="width: 100%;">'+
                          '<ul id="ul_stabs_'+idLabel+'"></ul>'+
                          '</div>';
//                
            }
            if(parent !== undefined){
                ul = "#ul_stabs_"+parent;  
            }
            
            tabs.find(ul).append( li );
            tabs.append( "<div id='" + id + "'><p>" + tabContentHtml + "</p></div>" );
            tabs.tabs( "refresh" );

            if(activate){
                me.__activate(me.tabCounter);
            }
            me.tabCounter++;
            me.listeTab.push(id);
            if(st.length> 0){
                var stabs = new Tabs('#tabs_'+idLabel)
                for(var i =0 ; i< st.length;i++){
                        stabs.__create(st[i].data,st[i].activate,idLabel);
                        eric[i] = st[i].data;
                }
                me.ajouterSousTab(stabs);
            }
            index = (me.tabCounter-1);
            
        }else{
            index = me.listeTab.indexOf(id);
        }
        return index;
    };
    me.__activate = function(index){
        $(me.selector).tabs("option","active",index);
    },
            
    me.ajouterSousTab = function (stab){
        me.listeSousTab.push(stab);
    }            
}
