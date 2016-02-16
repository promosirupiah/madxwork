
(function(factory){if(typeof define==='function'&&define.amd){define(['jquery'],factory);}else{factory(jQuery);}}(function($){var pluses=/\+/g;function raw(s){return s;}
function decoded(s){return decodeURIComponent(s.replace(pluses,' '));}
function converted(s){if(s.indexOf('"')===0){s=s.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,'\\');}
try{return config.json?JSON.parse(s):s;}catch(er){}}
var config=$.cookie=function(key,value,options){if(value!==undefined){options=$.extend({},config.defaults,options);if(typeof options.expires==='number'){var days=options.expires,t=options.expires=new Date();t.setDate(t.getDate()+days);}
value=config.json?JSON.stringify(value):String(value);return(document.cookie=[config.raw?key:encodeURIComponent(key),'=',config.raw?value:encodeURIComponent(value),options.expires?'; expires='+options.expires.toUTCString():'',options.path?'; path='+options.path:'',options.domain?'; domain='+options.domain:'',options.secure?'; secure':''].join(''));}
var decode=config.raw?raw:decoded;var cookies=document.cookie.split('; ');var result=key?undefined:{};for(var i=0,l=cookies.length;i<l;i++){var parts=cookies[i].split('=');var name=decode(parts.shift());var cookie=decode(parts.join('='));if(key&&key===name){result=converted(cookie);break;}
if(!key){result[name]=converted(cookie);}}
return result;};config.defaults={};$.removeCookie=function(key,options){if($.cookie(key)!==undefined){$.cookie(key,'',$.extend({},options,{expires:-1}));return true;}
return false;};}));var alltitle=$('title').html();var reid=/(\[id\:)(.*?)(\])/gi;var reeid=/(\{id\:)(.*?)(\})/gi;var reen=/(\[en\:)(.*?)(\])/gi;var reeen=/(\{en\:)(.*?)(\})/gi;function langid(time){$('.en').hide(time).css({'visibility':'hidden',});$('.id').show(time).css({'visibility':'visible',});$.cookie("lang",'id',{expires:1});$('a#id').css({'color':'red',});$('a#en').css({'color':'white',});$('title').html(alltitle.replace(reid,'$2').replace(reen,''));$('a').each(function(){try{var title=$(this).attr('orititle').replace(reeid,'$2').replace(reeen,'')}catch(error){var title=$(this).attr('orititle')}
$(this).attr({'title':title,})})
$('img').each(function(){try{var title=$(this).attr('orititle').replace(reeid,'$2').replace(reeen,'')}catch(error){var title=$(this).attr('orititle')};try{var alt=$(this).attr('orialt').replace(reeid,'$2').replace(reeen,'')}catch(error){var title=$(this).attr('orialt')};try{var longdesc=$(this).attr('orilongdesc').replace(reeid,'$2').replace(reeen,'')}catch(error){var title=$(this).attr('orilongdesc')};$(this).attr({'title':title,'alt':alt,'longdesc':longdesc,})})}
function langen(time){$('.id').hide(time).css({'visibility':'hidden',});$('.en').show(time).css({'visibility':'visible',});$.cookie("lang",'en',{expires:1});$('a#en').css({'color':'red',});$('a#id').css({'color':'white',});$('title').html(alltitle.replace(reid,'').replace(reen,'$2'));$('a').each(function(){try{var title=$(this).attr('orititle').replace(reeen,'$2').replace(reeid,'')}catch(error){var title=$(this).attr('orititle')}
$(this).attr({'title':title,})})
$('img').each(function(){try{var title=$(this).attr('orititle').replace(reeen,'$2').replace(reeid,'')}catch(error){var title=$(this).attr('orititle')};try{var alt=$(this).attr('orialt').replace(reeen,'$2').replace(reeid,'')}catch(error){var title=$(this).attr('orialt')};try{var longdesc=$(this).attr('orilongdesc').replace(reeen,'$2').replace(reeid,'')}catch(error){var title=$(this).attr('orilongdesc')};$(this).attr({'title':title,'alt':alt,'longdesc':longdesc,})})}
$('a').each(function(){$(this).attr({orititle:$(this).attr('title'),})
var alink=$(this).html();$(this).html(alink.replace(reid,'<div class="id">$2</div>').replace(reen,'<div class="en">$2</div>'))})
$('img').each(function(){$(this).attr({orititle:$(this).attr('title'),orialt:$(this).attr('alt'),orilongdesc:$(this).attr('longdesc')});})
$(document).ready(function(){if($.cookie('lang')===undefined){langid()}
else if($.cookie('lang')=='id'){langid()}
else if($.cookie('lang')=='en'){langen()}
$('#en').click(function(){langen(500)})
$('#id').click(function(){langid(500)})})
if($('.en').length){document.write('<ul  class="langchoose"  id="langchoose">      <li><a  href="##"  id="en">English</a></li>      <li><a  href="##"  id="id">Indonesia</a></li>    </ul>')}