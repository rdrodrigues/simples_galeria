(function($){    
    $.fn.simpGaleria = function(options){
        var defaults        = {     
            'mostrar'       : 3,        // quantas imagens irá mostrar caso por linha   
            'speed'         : 5000,     // tempo de transição das imagens
            'nr_linha'      : 1,        // numero de linhas - caso seja escolhido mais de 
                                        //1 linha será multiplicado a linha pela quantidade mostrada 
            'seta_naveg'    : 0,        // mostrar ou não a seta de navagação 0= não / 1 = sim
            'auto_play'     : 0,        // iniciar automaticamente            
            'active_borda'  : 5         // se as thumbs ativa mostrará borda
        };        
        
        var settings        = $.extend( {}, defaults, options );          
        var totalItem       = 0;
        var urlImg          = new Array(); // array que armazena a url das imagens
        var urlImgThumbs    = new Array(); // array que armazena a url das thumbs
        var textoImg        = new Array(); // array que armazena o texto
        var tamanhoDiv      = 0;
        
                
        //pega todos as imagem 
        $('.item-sg',this).each(function(i){            
            totalItem               = (i+1);   // total de item            
            urlImg[ (i+1) ]         = $('img',this).attr('src'); // pega a url da imagem
            urlImgThumbs[ (i+1) ]   = $('img',this).attr('data-thumbs'); // pega a url da thumbs
            textoImg[ (i+1) ]       = $('#titulo',this).html();  // pega o conteudo texto           
        });        
        
        // cria a div simpgaleria
        $(this).parent().append('<div id="simpgaleria"></div>');
        
        // cria a div onde fica a imagem e as thumbs
        $("#simpgaleria").append('<div id="sg-foto"></div>')
                .append('<div id="sg-thumbs"></div>');
        $("#sg-thumbs ").append('<div class="geral-foto"><div class="bar1"></div><div class="bar2"><div id="sg-navege"><a id="prev">prev</a><a id="next">next</a></div></div></div>');
                
        // remove a todos os items
        $(this).remove();
        
        // função para mostrar as imagem
        var mostrarImagem = function(imgURL){                                
            // cria o objeto imagem
            img = new Image();            
            // inseri a imagem do loading de fundo
            $("#sg-foto").css({
                'background-image'      : 'url(img/loading.gif)',
                'background-position'   : 'center center',
                'background-repeat'     : 'no-repeat'                
            });            
            // carrega da imagem
            $(img).load(function(){
                $("#sg-foto img").remove();
                $("#sg-foto").prepend(img)
                        .css({'background-image': 'none'});               
            }).attr('src',imgURL).attr('id','currentport').addClass("img-sgaleria").fadeIn(1000);         
         };
         
        // mostra sempre a primeira imagem
        mostrarImagem( urlImg[1] );    
        
        // função que gera as Thumbs
        var gerarThumbs = function(){     
            
            var li = '';            
            var tItem = 0;
            var active = '';
            
            // calcula a quantida de item sempre completando para não faltar thumbs
            tItem = (Math.ceil(totalItem/settings.mostrar))*settings.mostrar;                       
            
            // se a quantidade de linhas for igual a 1 
            if(settings.nr_linha === 1){
                
                // monta os li com as imagens existentes
                for(x = 1 ; x <= tItem; x++){
                    
                    //coloca a classe active no primeiro elemento
                    active = x == 1 ? 'class="active"' : '';                
                    
                    // so considerá se existir imagem caso não exista 
                    // coloca uma imagem padrão representando que 
                    // não existe imagem completando a quantidade 
                    if( urlImg[x] ){
                        li += '<li ' + active + '><img data-ordem="' + x + '" src="' + urlImg[x] + '" /></li>';
                    }else{
                        li += '<li class="notfound"><img src="img/not-found.jpg" /></li>';
                    }
                }
                
                
                //########## gera a estrutura
                
                // inseri o texto 
                $("#sg-thumbs .geral-foto .bar1").append('<p id="nvtitulo">'+textoImg[1]+'</p>');
                // inseri a estrutura com as imagens
                $("#sg-thumbs .geral-foto .bar2").append('<div id="container-fotos"><ul id="sgfotos">'+li+'</ul></div>');
                
                
                //######Monta o tamanho div pai
                
                // pega o tamanho da div onde vai ficar as thums
                var widthThumbsGaleria      = $("#sg-thumbs").width(); 
                
                // tamanho da borda
                var borderActive            = settings.active_borda ? parseInt(settings.active_borda) : 0; 
                
                var widthThumbs     = $("#sgfotos li").width(); // pega a largura
                var widthActive     = $("#sgfotos li.active").width();
                var marginLeft      = ($("#sgfotos li").css('margin-left')).split('px')[0]; // pega o tamanho da margem esqueda
                var marginRight     = ($("#sgfotos li").css('margin-right')).split('px')[0]; // pega o tamanho da margem direira
                var marginLeft      = ($("#sgfotos li").css('margin-left')).split('px')[0]; // pega o tamanho da margem esqueda
                var marginRight     = ($("#sgfotos li").css('margin-right')).split('px')[0]; // pega o tamanho da margem direira
                
                // total de thumbs - sempre completando a quantidade de thumbs 
                // Ex: 13 thumbs mostrara 15 sendo duas thumbs vazia
                var totalThumbs         = (Math.ceil(totalItem/settings.mostrar))*settings.mostrar ;
                
                var totalMargin         = totalThumbs *( parseInt(marginLeft)+ parseInt(marginRight)); 
                alert(totalMargin);
                var tmhThumbs           = widthThumbsGaleria ;
                
                // largura de todas as thumbs criadas 
                var wTotalThumbs        = widthThumbsGaleria /totalThumbs ;
            
                //tamanhos da margim de todas as thumbs
                var totalMarginThumbs   = (parseInt(marginLeft) + parseInt(marginRight)) * totalThumbs;
            
                // tamanho total com todas as thumbs e suas margim
            var wTotalElemento      = wTotalThumbs + totalMarginThumbs +  widthActive;
            
            
            // calcula o tamanho da div que conterá as thumbs
            tamanhoDiv = ( (parseInt(marginLeft) + parseInt(marginRight)) * settings.mostrar ) + ( widthThumbs * settings.mostrar );
        
            //aplica o css         
            $("#container-fotos").css({'width':widthThumbsGaleria + 'px'}); 
            
            // css responsavel pela o alinhamento horizontal das thumbs
            $("#sgfotos").css({"width" : wTotalElemento + "px" });
            
            // css para cria a animação 
            $("#sgfotos").css({
                'left' : '0px',
                '-moz-transition': 'all .2s ease-in',
                '-o-transition': 'all .2s ease-in',
                '-webkit-transition': 'all .2s ease-in',
                'transition': 'all .2s ease-in'
            });            
            }
        };
        
        // chama a função para gerar as thumbs
        gerarThumbs();
        
        // função responsavel pelo movimento das imagens
        var moverImg = function(tipoMov){
            
            var imgAtual            = 0;
            
            $("#sgfotos li").each(function(){
                if( $(this).hasClass('active')){
                    imgAtual        = tipoMov == "next" ? parseInt($('img',this).attr('data-ordem')) : parseInt($('img',this).attr('data-ordem')) - 2;
                    $(this).removeClass('active');// remove a classe active 
                    $("#nvtitulo").remove();// remove o elemento
                }
            });
            
            if(imgAtual <= 0 ){ imgAtual = 0; }
            
            if(imgAtual == totalItem ){
                imgAtual = 0;
                $("#sgfotos li").removeClass('active');// remove a classe active 
                $("#nvtitulo").remove();// remove o elemento
                $("#sgfotos li").eq(0).addClass('active');// remove a classe active
            }
                
            $("#sgfotos li").eq(imgAtual).addClass('active');// remove a classe active
                
            // troca o texto 
            if(textoImg[ imgAtual + 1 ]){
                $("#sg-thumbs .geral-foto .bar1").prepend('<p id="nvtitulo">'+ textoImg[ imgAtual + 1 ]+'</p>');
            }else{
                $("#sg-thumbs .geral-foto .bar1").prepend('<p id="nvtitulo" class="notext"></p>');
            }
                        
            mostrarImagem( urlImg[imgAtual + 1] );
            
            var mThumbs = (Math.ceil( (imgAtual+1)/settings.mostrar) * tamanhoDiv ) - tamanhoDiv ;
            $("#sgfotos").css({'left' :  '-'+mThumbs + 'px'});
            
        }
        
        
        
        
        var tIMG = function() {
            moverImg('next');
            trocarImg = setTimeout(tIMG, settings.speed);
        };
        
        var trocarImg = setTimeout(tIMG, settings.speed);
        
        var abortTimer = function() { 
            clearTimeout(trocarImg);
            trocarImg = setTimeout(tIMG, settings.speed);
        };
        
       $("#sg-navege a").each(function(){
           $(this).click(function(){
               abortTimer();
               var moverTipo = $(this).attr("id");               
               moverImg(moverTipo);
           });
       });
       
        
        
        
        $("#sgfotos li img").click(function(){            
            
            abortTimer();// limpa/reset o time 
            var imgSelect = $(this).attr("data-ordem");// pega o numero da ordem da imagem
            
            $("#sgfotos li").removeClass('active');// remove a classe active 
            $("#nvtitulo").remove();// remove o elemento
            $("#sgfotos li").eq( (imgSelect - 1) ).addClass('active');// inseri a classe active na imagem selecionada
            
            // se existir conteudo texto
            if(textoImg[ imgSelect ]){
                $("#sg-thumbs .geral-foto .bar1").prepend('<p id="nvtitulo">'+ textoImg[ imgSelect  ]+'</p>');
            }else{
                $("#sg-thumbs .geral-foto .bar1").prepend('<p id="nvtitulo" class="notext"></p>');
            }
            // mostra a imagem selecionada
            mostrarImagem( urlImg[imgSelect] );
        });
     
     
    };
})(jQuery);
