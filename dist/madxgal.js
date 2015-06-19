function madxgallery(divselect,tagselect,fadetime,changetime){
var interval;
var imgsrc;
var idnumber = 0;


$(divselect + ' ' + tagselect + ':gt(0)').hide();
$(divselect + ' ' + tagselect + ':last').addClass('last');
$(divselect + ' ' + tagselect + ':first').addClass('first');

var cur = $(divselect + ' ' + tagselect + ':first');
cur.find('.mntext').animate({right:'0',},3000);

interval = setInterval( function(){
cur.hide(fadetime);
cur.find('.mntext').animate({right:'-100%',});
if ( cur.attr('class') == 'last' )
cur = $(divselect + ' ' + tagselect + ':first');
else
cur = cur.next();
cur.show(fadetime);
cur.find('.mntext').animate({right:'0',},3000);
}, changetime );

}