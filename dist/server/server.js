"use strict";var __create=Object.create;var __defProp=Object.defineProperty;var __getOwnPropDesc=Object.getOwnPropertyDescriptor;var __getOwnPropNames=Object.getOwnPropertyNames;var __getProtoOf=Object.getPrototypeOf;var __hasOwnProp=Object.prototype.hasOwnProperty;var __commonJS=(cb,mod)=>function __require(){return mod||(0,cb[__getOwnPropNames(cb)[0]])((mod={exports:{}}).exports,mod),mod.exports};var __copyProps=(to,from,except,desc)=>{if(from&&typeof from==="object"||typeof from==="function"){for(let key of __getOwnPropNames(from))if(!__hasOwnProp.call(to,key)&&key!==except)__defProp(to,key,{get:()=>from[key],enumerable:!(desc=__getOwnPropDesc(from,key))||desc.enumerable})}return to};var __toESM=(mod,isNodeMode,target)=>(target=mod!=null?__create(__getProtoOf(mod)):{},__copyProps(isNodeMode||!mod||!mod.__esModule?__defProp(target,"default",{value:mod,enumerable:true}):target,mod));var require_boolean=__commonJS({"node_modules/boolean/build/lib/boolean.js"(exports2){"use strict";Object.defineProperty(exports2,"__esModule",{value:true});exports2.boolean=void 0;var boolean=function(value){switch(Object.prototype.toString.call(value)){case"[object String]":return["true","t","yes","y","on","1"].includes(value.trim().toLowerCase());case"[object Number]":return value.valueOf()===1;case"[object Boolean]":return value.valueOf();default:return false}};exports2.boolean=boolean}});var require_isBooleanable=__commonJS({"node_modules/boolean/build/lib/isBooleanable.js"(exports2){"use strict";Object.defineProperty(exports2,"__esModule",{value:true});exports2.isBooleanable=void 0;var isBooleanable=function(value){switch(Object.prototype.toString.call(value)){case"[object String]":return["true","t","yes","y","on","1","false","f","no","n","off","0"].includes(value.trim().toLowerCase());case"[object Number]":return[0,1].includes(value.valueOf());case"[object Boolean]":return true;default:return false}};exports2.isBooleanable=isBooleanable}});var require_lib=__commonJS({"node_modules/boolean/build/lib/index.js"(exports2){"use strict";Object.defineProperty(exports2,"__esModule",{value:true});exports2.isBooleanable=exports2.boolean=void 0;var boolean_1=require_boolean();Object.defineProperty(exports2,"boolean",{enumerable:true,get:function(){return boolean_1.boolean}});var isBooleanable_1=require_isBooleanable();Object.defineProperty(exports2,"isBooleanable",{enumerable:true,get:function(){return isBooleanable_1.isBooleanable}})}});var require_tokenize=__commonJS({"node_modules/fast-printf/dist/src/tokenize.js"(exports2){"use strict";Object.defineProperty(exports2,"__esModule",{value:true});exports2.tokenize=void 0;var TokenRule=/(?:%(?<flag>([+0-]|-\+))?(?<width>\d+)?(?<position>\d+\$)?(?<precision>\.\d+)?(?<conversion>[%BCESb-iosux]))|(\\%)/g;var tokenize=subject=>{let matchResult;const tokens=[];let argumentIndex=0;let lastIndex=0;let lastToken=null;while((matchResult=TokenRule.exec(subject))!==null){if(matchResult.index>lastIndex){lastToken={literal:subject.slice(lastIndex,matchResult.index),type:"literal"};tokens.push(lastToken)}const match=matchResult[0];lastIndex=matchResult.index+match.length;if(match==="\\%"||match==="%%"){if(lastToken&&lastToken.type==="literal"){lastToken.literal+="%"}else{lastToken={literal:"%",type:"literal"};tokens.push(lastToken)}}else if(matchResult.groups){lastToken={conversion:matchResult.groups.conversion,flag:matchResult.groups.flag||null,placeholder:match,position:matchResult.groups.position?Number.parseInt(matchResult.groups.position,10)-1:argumentIndex++,precision:matchResult.groups.precision?Number.parseInt(matchResult.groups.precision.slice(1),10):null,type:"placeholder",width:matchResult.groups.width?Number.parseInt(matchResult.groups.width,10):null};tokens.push(lastToken)}}if(lastIndex<=subject.length-1){if(lastToken&&lastToken.type==="literal"){lastToken.literal+=subject.slice(lastIndex)}else{tokens.push({literal:subject.slice(lastIndex),type:"literal"})}}return tokens};exports2.tokenize=tokenize}});var require_createPrintf=__commonJS({"node_modules/fast-printf/dist/src/createPrintf.js"(exports2){"use strict";Object.defineProperty(exports2,"__esModule",{value:true});exports2.createPrintf=void 0;var boolean_1=require_lib();var tokenize_1=require_tokenize();var formatDefaultUnboundExpression=(subject,token)=>{return token.placeholder};var createPrintf=configuration=>{var _a;const padValue=(value,width,flag)=>{if(flag==="-"){return value.padEnd(width," ")}else if(flag==="-+"){return((Number(value)>=0?"+":"")+value).padEnd(width," ")}else if(flag==="+"){return((Number(value)>=0?"+":"")+value).padStart(width," ")}else if(flag==="0"){return value.padStart(width,"0")}else{return value.padStart(width," ")}};const formatUnboundExpression=(_a=configuration===null||configuration===void 0?void 0:configuration.formatUnboundExpression)!==null&&_a!==void 0?_a:formatDefaultUnboundExpression;const cache2={};return(subject,...boundValues)=>{let tokens=cache2[subject];if(!tokens){tokens=cache2[subject]=tokenize_1.tokenize(subject)}let result="";for(const token of tokens){if(token.type==="literal"){result+=token.literal}else{let boundValue=boundValues[token.position];if(boundValue===void 0){result+=formatUnboundExpression(subject,token,boundValues)}else if(token.conversion==="b"){result+=boolean_1.boolean(boundValue)?"true":"false"}else if(token.conversion==="B"){result+=boolean_1.boolean(boundValue)?"TRUE":"FALSE"}else if(token.conversion==="c"){result+=boundValue}else if(token.conversion==="C"){result+=String(boundValue).toUpperCase()}else if(token.conversion==="i"||token.conversion==="d"){boundValue=String(Math.trunc(boundValue));if(token.width!==null){boundValue=padValue(boundValue,token.width,token.flag)}result+=boundValue}else if(token.conversion==="e"){result+=Number(boundValue).toExponential()}else if(token.conversion==="E"){result+=Number(boundValue).toExponential().toUpperCase()}else if(token.conversion==="f"){if(token.precision!==null){boundValue=Number(boundValue).toFixed(token.precision)}if(token.width!==null){boundValue=padValue(String(boundValue),token.width,token.flag)}result+=boundValue}else if(token.conversion==="o"){result+=(Number.parseInt(String(boundValue),10)>>>0).toString(8)}else if(token.conversion==="s"){if(token.width!==null){boundValue=padValue(String(boundValue),token.width,token.flag)}result+=boundValue}else if(token.conversion==="S"){if(token.width!==null){boundValue=padValue(String(boundValue),token.width,token.flag)}result+=String(boundValue).toUpperCase()}else if(token.conversion==="u"){result+=Number.parseInt(String(boundValue),10)>>>0}else if(token.conversion==="x"){boundValue=(Number.parseInt(String(boundValue),10)>>>0).toString(16);if(token.width!==null){boundValue=padValue(String(boundValue),token.width,token.flag)}result+=boundValue}else{throw new Error("Unknown format specifier.")}}}return result}};exports2.createPrintf=createPrintf}});var require_printf=__commonJS({"node_modules/fast-printf/dist/src/printf.js"(exports2){"use strict";Object.defineProperty(exports2,"__esModule",{value:true});exports2.printf=exports2.createPrintf=void 0;var createPrintf_1=require_createPrintf();Object.defineProperty(exports2,"createPrintf",{enumerable:true,get:function(){return createPrintf_1.createPrintf}});exports2.printf=createPrintf_1.createPrintf()}});var Delay=ms=>new Promise(res=>setTimeout(res,ms));var RandBetween=(min,max)=>{return Math.floor(Math.random()*(max-min+1)+min)};var SpawnProp=(hash,x,y,z)=>{const prop=CreateObjectNoOffset(hash,x,y,z,true,true,false);FreezeEntityPosition(prop,true);return prop};var Notify=(target,cfg)=>{emitNet("moss:client:notify",target,cfg)};var cache=new Proxy({resource:GetCurrentResourceName()},{get(target,key){const result=key?target[key]:target;if(result!==void 0)return result;AddEventHandler(`ox_lib:cache:${key}`,value=>{target[key]=value});target[key]=exports.ox_lib.cache(key)||false;return target[key]}});var import_fast_printf=__toESM(require_printf());var dict={};function flattenDict(source2,target,prefix){for(const key in source2){const fullKey=prefix?`${prefix}.${key}`:key;const value=source2[key];if(typeof value==="object")flattenDict(value,target,fullKey);else target[fullKey]=String(value)}return target}var initLocale=()=>{const lang=GetConvar("ox:locale","en");let locales=JSON.parse(LoadResourceFile(cache.resource,`locales/${lang}.json`));if(!locales){console.warn(`could not load 'locales/${lang}.json'`);if(lang!=="en"){locales=JSON.parse(LoadResourceFile(cache.resource,"locales/en.json"));if(!locales){console.warn(`could not load 'locales/en.json'`)}}if(!locales)return}const flattened=flattenDict(locales,{});for(let[k,v]of Object.entries(flattened)){if(typeof v==="string"){const regExp=new RegExp(/\$\{([^}]+)\}/g);const matches=v.match(regExp);if(matches){for(const match of matches){if(!match)break;const variable=match.substring(2,match.length-1);let locale=flattened[variable];if(locale){v=v.replace(match,locale)}}}}dict[k]=v}};initLocale();var activeEvents={};onNet(`__ox_cb_${cache.resource}`,(key,...args)=>{const resolve=activeEvents[key];return resolve&&resolve(...args)});function onClientCallback(eventName,cb){onNet(`__ox_cb_${eventName}`,async(resource,key,...args)=>{const src=source;let response;try{response=await cb(src,...args)}catch(e){console.error(`an error occurred while handling callback event ${eventName}`);console.log(`^3${e.stack}^0`)}emitNet(`__ox_cb_${resource}`,src,key,response)})}var registeredCommmands=[];var shouldSendCommands=false;setTimeout(()=>{shouldSendCommands=true;emitNet("chat:addSuggestions",-1,registeredCommmands)},1e3);on("playerJoining",source2=>{emitNet("chat:addSuggestions",source2,registeredCommmands)});var GenerateRecipe=()=>{const corn=RandBetween(2,5);return{corn,sugar:RandBetween(0,Math.floor(corn/2)),yeast:RandBetween(1,3),water:RandBetween(3,8)}};var BarrelHasValidRecipe=barrel=>{const recipe=Entity(barrel).state.recipe;return recipe.corn>=2&&recipe.yeast>=1&&recipe.water>=3};var RecipeToString=recipe=>{return`${recipe.corn}x Corn,  ${recipe.sugar}x Sugar, ${recipe.yeast}x Yeast, ${recipe.water}x Water.`};onClientCallback("moss:server:requestRecipe",src=>{const recipe=GenerateRecipe();global.exports.ox_inventory.AddItem(src,"stickynote",1,{recipe:`${RecipeToString(recipe)}`});return recipe});var BARREL_PROP="prop_barrel_02a";var BARREL_HASH=GetHashKey(BARREL_PROP);var BARREL_PROCESSING_MINS=1;onNet("moss:server:spawnBarrel",async propPos=>{const src=global.source;const[propX,propY,propZ]=propPos;const success=global.exports.ox_inventory.RemoveItem(src,"plastic_barrel",1);if(typeof success!=="boolean"){console.error("Failed removing item plastic_barrel from player.");return}const barrel=SpawnProp(BARREL_HASH,propX,propY,propZ);Entity(barrel).state.sealed=false;Entity(barrel).state.progress=0;const netId=NetworkGetNetworkIdFromEntity(barrel);global.exports.ox_inventory.RegisterStash(`barrel_${netId}`,"Barrel",4,18e3,false,null,null);emitNet("moss:client:setupBarrel",-1,netId)});onNet("moss:server:sealBarrel",netId=>{const src=global.source;const barrel=NetworkGetEntityFromNetworkId(netId);Entity(barrel).state.sealed=true;const items=["corn","sugar","yeast","water"];let recipe={corn:0,yeast:0,sugar:0,water:0};items.forEach((value,index,array)=>{recipe[value]=global.exports.ox_inventory.GetItemCount(`barrel_${netId}`,value)});Entity(barrel).state.recipe=recipe;if(!BarrelHasValidRecipe(barrel)){Notify(src,{title:"Something doesnt seem right",type:"error"});return}items.forEach((value,index,array)=>{global.exports.ox_inventory.RemoveItem(`barrel_${netId}`,value,recipe[value])});setTimeout(async()=>{while(Entity(barrel).state.progress<100){await Delay(1e3*60*BARREL_PROCESSING_MINS);let progress=Entity(barrel).state.progress;Entity(barrel).state.progress=progress+10}},0)});onNet("moss:server:dismantleBarrel",netId=>{const src=global.source;const prop=NetworkGetEntityFromNetworkId(netId);let item="plastic_barrel";let metadata=null;if(Entity(prop).state.progress>=100){item="mash";metadata={recipe_data:Entity(prop).state.recipe}}const inventory=global.exports.ox_inventory.GetInventory(`barrel_${netId}`);if(inventory.items.length>0){Notify(src,{title:"This Barrel isn't empty!",type:"error"});return}const[success,error]=global.exports.ox_inventory.AddItem(src,item,1,metadata);if(!success){return}DeleteEntity(prop);emitNet("ox_target:removeEntity",-1,netId)});var STILL_PROP="prop_still";var STILL_HASH=GetHashKey(STILL_PROP);var STILL_PROCESS_TIME=1;onNet("moss:server:dismantleStill",netId=>{const src=global.source;const prop=NetworkGetEntityFromNetworkId(netId);const inventory=global.exports.ox_inventory.GetInventory(`still_${netId}`);if(inventory.items.length>0){Notify(src,{title:"This Still isn't empty!",type:"error"});return}const[success,error]=global.exports.ox_inventory.AddItem(src,"still",1);if(!success){return}DeleteEntity(prop);emitNet("ox_target:removeEntity",-1,netId)});onNet("moss:server:spawnStill",async propPos=>{const src=global.source;const[propX,propY,propZ]=propPos;const success=global.exports.ox_inventory.RemoveItem(src,"still",1);if(typeof success!=="boolean"){console.error("Failed removing item still from player.");return}const still=SpawnProp(STILL_HASH,propX,propY,propZ);Entity(still).state.running=false;const netId=NetworkGetNetworkIdFromEntity(still);global.exports.ox_inventory.RegisterStash(`still_${netId}`,"Still",3,1e5,false,null,null);emitNet("moss:client:setupStill",-1,netId)});var ProcessStill=async netId=>{const invID=`still_${netId}`;const still=NetworkGetEntityFromNetworkId(netId);if(Entity(still).state.running){return}const mash=global.exports.ox_inventory.GetSlot(invID,1);if(!mash){return}const recipe=mash.metadata.recipe_data;const removedMash=global.exports.ox_inventory.RemoveItem(invID,"mash",1);const removedJars=global.exports.ox_inventory.RemoveItem(invID,"masonjars",1);if(typeof removedMash!=="boolean"||typeof removedJars!=="boolean"){console.error("Failed removing items from still.");return}Entity(still).state.running=true;let progress=100;while(progress>0){progress=progress-10;await Delay(1e3*60*STILL_PROCESS_TIME);global.exports.ox_inventory.AddItem(invID,"moonshine",RandBetween(1,5),{recipe:RecipeToString(recipe),recipe_data:recipe},3)}Entity(still).state.running=false};onNet("moss:server:lightStill",async netId=>{setTimeout(()=>{ProcessStill(netId)},0)});var STILL_INV_HOOK=global.exports.ox_inventory.registerHook("swapItems",payload=>{const allowed_items=["mash","masonjars","moonshine"];if(payload.toType!="stash"){return}if(allowed_items.indexOf(payload.fromSlot.name)==-1||!payload.toSlot||typeof payload.toInventory!=="string"){return false}const targetSlot=typeof payload.toSlot==="number"?payload.toSlot:payload.toSlot.slot;return targetSlot===allowed_items.indexOf(payload.fromSlot.name)+1},{inventoryFilter:["^still_[%w]+"]});console.info(`Registered Inventory Hook for Still ${STILL_INV_HOOK}`);var BARREL_INV_HOOK=global.exports.ox_inventory.registerHook("swapItems",payload=>{const allowed_items=["sugar","yeast","corn","water"];return allowed_items.indexOf(payload.fromSlot.name)!=-1},{inventoryFilter:["^barrel_[%w]+"]});console.info(`Registered Inventory Hook for Barrels ${BARREL_INV_HOOK}`);var SHINE_VALUE=10;onNet("moss:server:deliverShine",slots=>{const src=global.source;let totalShine=0;slots.forEach((value,index,array)=>{const shine=global.exports.ox_inventory.GetSlot(src,value);const removed=global.exports.ox_inventory.RemoveItem(src,"moonshine",shine.count,null,value);if(typeof removed!=="boolean"){return}totalShine+=shine.count});if(totalShine<1){return}const reward=SHINE_VALUE*totalShine;const Player=global.exports.qbx_core.GetPlayer(src);Player.Functions.AddMoney("cash",reward);emitNet("moss:client:notify",src,{title:"Thanks",description:`Your cut for this run is $${reward}`})});on("onResourceStart",res=>{if(res!==GetCurrentResourceName())return;console.log("Starting Moonshine")});on("onResourceStop",res=>{if(res!==GetCurrentResourceName())return;console.log("Stopping Moonshine")});
