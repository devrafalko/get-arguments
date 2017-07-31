const cliColor = require('cli-color');
const getArgs = process.argv.slice(2);
const command = getArgs[0];
const args = getArgs.slice(1);
const error = cliColor.red;
const warn = cliColor.bgYellow.black;

module.exports = function(){
  return validParameters(...arguments)
  .then((p)=>validCommand(...p))
  .then((p)=>validArgs(p))
  .then((p)=>{p[1](p[0]);})
  .catch((p)=>{
    console.log(p[0]);
    if(p[1]) p[1](null);
  });
};

function validParameters(){
  var a = arguments;
  return new Promise(function(resolve,reject){
    var parameters, callback;
    if(a.length===1&&typeof a[0]==='function'){
      parameters = [];
      callback = a[0];
    } else if(a.length===3 
              && typeof a[0] === 'string' 
              && Array.isArray(a[1]) 
              && a[1].length 
              && a[1].every((a)=>typeof a === 'string') 
              && typeof a[2]==='function'){
      parameters = [a[0],a[1]];
      callback = a[2];
    } else {
      reject([warn('get-arguments')+': '+error('Invalid module arguments.')]);
      return;
    }
    resolve([callback,...parameters]);
  });
}

function validCommand(callback,bin,commands){
  var args = arguments;
  return new Promise(function(resolve,reject){
    if(args.length===1 || args.length===3 && commands.some((a)=>a===command)){
      resolve(callback);
    } else {
      for(var i=0;i<commands.length;i++){
        commands[i] = '\n   '+commands[i];
      }
      reject([`\nUsage: ${bin} <command>\n\nwhere <command> is one of:\n${commands.join(', ')}\n`,callback]);
    }
  });
}

function validArgs(callback){
  return new Promise(function(resolve,reject){
    const reg = /^--?([A-z0-9]*)$/;
    var first = false;
    var any = args.some((a,b)=> {
      var test = reg.exec(a);
      if(b===0) first = !!test;
      return test && test[1];
    });

    if(!first&&any){
      reject([warn('get-arguments')+': '+error("Invalid command arguments."),callback]);
    } else {
      if(any){
        var exportArguments = {};
        var lastArg = 0;
        for(var i in args){
          var test = reg.exec(args[i]);
          if(test) {
            lastArg = i;
            exportArguments[args[i]] = [];
          } else {
            exportArguments[args[lastArg]].push(args[i]);
          }
        }      
      } else {
        var exportArguments = args.slice();
      }
      resolve([{command:command,args:exportArguments},callback]);
    }
  });
}