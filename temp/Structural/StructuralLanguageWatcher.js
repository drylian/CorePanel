'use strict';const _0x6bb328=_0x4ced;(function(_0x24b757,_0x1eaac0){const _0x2dc5df=_0x4ced,_0x49c8a2=_0x24b757();while(!![]){try{const _0x49cb57=-parseInt(_0x2dc5df(0x12e))/0x1+-parseInt(_0x2dc5df(0x129))/0x2+-parseInt(_0x2dc5df(0x139))/0x3*(-parseInt(_0x2dc5df(0x13d))/0x4)+parseInt(_0x2dc5df(0x11d))/0x5*(parseInt(_0x2dc5df(0x125))/0x6)+-parseInt(_0x2dc5df(0x128))/0x7+parseInt(_0x2dc5df(0x133))/0x8+parseInt(_0x2dc5df(0x137))/0x9;if(_0x49cb57===_0x1eaac0)break;else _0x49c8a2['push'](_0x49c8a2['shift']());}catch(_0x5202f3){_0x49c8a2['push'](_0x49c8a2['shift']());}}}(_0x15b4,0x4d975));function _0x4ced(_0x390dc2,_0x497700){const _0x385673=_0x15b4();return _0x4ced=function(_0x4cf2c8,_0xe204a5){_0x4cf2c8=_0x4cf2c8-0x113;let _0x15b459=_0x385673[_0x4cf2c8];return _0x15b459;},_0x4ced(_0x390dc2,_0x497700);}var __importDefault=this&&this[_0x6bb328(0x121)]||function(_0x17bf12){const _0x48aa99=_0x6bb328;return _0x17bf12&&_0x17bf12[_0x48aa99(0x11c)]?_0x17bf12:{'default':_0x17bf12};};Object[_0x6bb328(0x12f)](exports,_0x6bb328(0x11c),{'value':!![]}),exports[_0x6bb328(0x13f)]=void 0x0;const chokidar_1=__importDefault(require('chokidar')),path_1=__importDefault(require('path')),Utils_1=require('../Utils'),Structural_1=require('../Structural'),lodash_1=__importDefault(require('lodash')),promises_1=__importDefault(require('fs/promises')),glob_1=require('glob'),loggings_1=require('loggings'),Configurations_1=require('../Configurations'),Languages_1=__importDefault(require('../Controllers/Languages'));function Core(_0x59145b,..._0x52f052){const _0x9403da=_0x6bb328;return(0x0,loggings_1[_0x9403da(0x116)])(_0x59145b,_0x9403da(0x145),..._0x52f052);}async function PreloadLangs(){const _0x785081=_0x6bb328;if(Configurations_1[_0x785081(0x119)][_0x785081(0x115)][_0x785081(0x114)][_0x785081(0x11f)](_0x785081(0x124))){const _0x36261e=await(0x0,glob_1[_0x785081(0x123)])(['Languages/**/*.json'],{'cwd':Structural_1['ResourcesPATH']});for(const _0x562e48 of _0x36261e){const _0xa67231=_0x562e48[_0x785081(0x120)]('\x5c')[_0x785081(0x117)](0x1)[_0x785081(0x136)]('/'),_0x541a68=_0xa67231[_0x785081(0x142)](_0x785081(0x13b),'')[_0x785081(0x142)](/[/\\]/g,'.'),_0xef3d16=lodash_1[_0x785081(0x13e)][_0x785081(0x12a)]({},_0x541a68,JSON[_0x785081(0x135)](await promises_1['default'][_0x785081(0x13a)](Structural_1['ResourcesPATH']+('/'+_0x562e48),_0x785081(0x141))));Languages_1[_0x785081(0x13e)][_0x785081(0x12d)]=lodash_1[_0x785081(0x13e)]['merge'](Languages_1['default']['core'],_0xef3d16);}}}exports[_0x6bb328(0x13f)]=PreloadLangs;async function StructuralLanguageWatcher(){const _0x5a3a8a=_0x6bb328,_0x1ed5a3=(function(){let _0x3c8c0e=!![];return function(_0x3989e0,_0x599ec6){const _0xb4b3eb=_0x3c8c0e?function(){const _0x3fa80a=_0x4ced;if(_0x599ec6){const _0x190ae8=_0x599ec6[_0x3fa80a(0x13c)](_0x3989e0,arguments);return _0x599ec6=null,_0x190ae8;}}:function(){};return _0x3c8c0e=![],_0xb4b3eb;};}()),_0x5bfd6=_0x1ed5a3(this,function(){const _0x10a799=_0x4ced;return _0x5bfd6[_0x10a799(0x122)]()[_0x10a799(0x12c)](_0x10a799(0x11e))['toString']()['constructor'](_0x5bfd6)['search'](_0x10a799(0x11e));});_0x5bfd6();if(Configurations_1[_0x5a3a8a(0x119)]['mode'][_0x5a3a8a(0x114)][_0x5a3a8a(0x11f)](_0x5a3a8a(0x124))){const _0x5e9d17=Structural_1[_0x5a3a8a(0x131)]+_0x5a3a8a(0x132),_0x4b1a17=chokidar_1[_0x5a3a8a(0x13e)][_0x5a3a8a(0x138)](_0x5e9d17,{'persistent':!![],'ignored':/(^|[\/\\])\../});_0x4b1a17['on'](_0x5a3a8a(0x12b),_0x1d9b71=>{const _0x57d353=_0x5a3a8a;if(path_1['default'][_0x57d353(0x118)](_0x1d9b71)===_0x57d353(0x13b)){const _0x212e0c=path_1[_0x57d353(0x13e)][_0x57d353(0x127)](_0x5e9d17,_0x1d9b71)['replace'](_0x57d353(0x13b),'')[_0x57d353(0x142)](/[/\\]/g,'.'),_0x377682=lodash_1['default'][_0x57d353(0x12a)]({},_0x212e0c[_0x57d353(0x120)]('.'),(0x0,Utils_1[_0x57d353(0x144)])(_0x1d9b71));Languages_1[_0x57d353(0x13e)][_0x57d353(0x12d)]=lodash_1[_0x57d353(0x13e)][_0x57d353(0x113)](Languages_1[_0x57d353(0x13e)][_0x57d353(0x12d)],_0x377682);}}),_0x4b1a17['on'](_0x5a3a8a(0x126),_0x3b61a5=>{const _0x40f48b=_0x5a3a8a;if(path_1['default'][_0x40f48b(0x118)](_0x3b61a5)===_0x40f48b(0x13b)){const _0x118eb9=path_1[_0x40f48b(0x13e)][_0x40f48b(0x127)](_0x5e9d17,_0x3b61a5)['replace'](_0x40f48b(0x13b),'')[_0x40f48b(0x142)](/[/\\]/g,'.'),_0x106957=lodash_1['default'][_0x40f48b(0x12a)]({},_0x118eb9[_0x40f48b(0x120)]('.'),(0x0,Utils_1[_0x40f48b(0x144)])(_0x3b61a5)),_0x11e3d0=path_1[_0x40f48b(0x13e)][_0x40f48b(0x127)](_0x5e9d17,_0x3b61a5)[_0x40f48b(0x142)](_0x40f48b(0x13b),'')[_0x40f48b(0x142)](/[/\\]/g,_0x40f48b(0x143));Languages_1[_0x40f48b(0x13e)]['core']=lodash_1[_0x40f48b(0x13e)]['merge'](Languages_1['default'][_0x40f48b(0x12d)],_0x106957),Core(_0x40f48b(0x11a),'['+_0x11e3d0+_0x40f48b(0x140));}}),_0x4b1a17['on'](_0x5a3a8a(0x11b),_0x13ab49=>{const _0x3b7ac7=_0x5a3a8a;if(path_1[_0x3b7ac7(0x13e)][_0x3b7ac7(0x118)](_0x13ab49)==='.json'){const _0x58969f=path_1['default'][_0x3b7ac7(0x127)](_0x5e9d17,_0x13ab49)['replace'](_0x3b7ac7(0x13b),'')[_0x3b7ac7(0x142)](/[/\\]/g,'.'),_0x2abf85=lodash_1[_0x3b7ac7(0x13e)][_0x3b7ac7(0x12a)]({},_0x58969f[_0x3b7ac7(0x120)]('.'),(0x0,Utils_1['json'])(_0x13ab49)),_0x4f18d7=path_1[_0x3b7ac7(0x13e)][_0x3b7ac7(0x127)](_0x5e9d17,_0x13ab49)[_0x3b7ac7(0x142)](_0x3b7ac7(0x13b),'')[_0x3b7ac7(0x142)](/[/\\]/g,_0x3b7ac7(0x143));Languages_1['default']['core']=lodash_1[_0x3b7ac7(0x13e)][_0x3b7ac7(0x113)](Languages_1[_0x3b7ac7(0x13e)][_0x3b7ac7(0x12d)],_0x2abf85),Core(_0x3b7ac7(0x11a),'['+_0x4f18d7+_0x3b7ac7(0x130));}});}else{const _0x30258f=path_1[_0x5a3a8a(0x13e)][_0x5a3a8a(0x136)](Structural_1[_0x5a3a8a(0x131)],_0x5a3a8a(0x134)),_0xf65614=await promises_1[_0x5a3a8a(0x13e)][_0x5a3a8a(0x13a)](_0x30258f,'utf8');Languages_1[_0x5a3a8a(0x13e)][_0x5a3a8a(0x12d)]=lodash_1['default'][_0x5a3a8a(0x113)](Languages_1[_0x5a3a8a(0x13e)][_0x5a3a8a(0x12d)],JSON[_0x5a3a8a(0x135)](_0xf65614));}}StructuralLanguageWatcher();function _0x15b4(){const _0x4d4f0f=['Console','slice','extname','Global','Lang','unlink','__esModule','5Hputki','(((.+)+)+)+$','startsWith','split','__importDefault','toString','glob','dev','169908ENYEwu','change','relative','3663695BjykHd','117470sMLsyX','set','add','search','core','366745tZKkYE','defineProperty','].red\x20deletado.','ResourcesPATH','/Languages','2566128nAiIIy','langs.json','parse','join','3548367mekMvk','watch','3747SuhWUZ','readFile','.json','apply','1676bBWHAC','default','PreloadLangs','].red\x20modificado.','utf-8','replace','\x20->\x20','json','magenta','merge','get','mode'];_0x15b4=function(){return _0x4d4f0f;};return _0x15b4();}