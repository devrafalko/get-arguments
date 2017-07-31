# Description
`get-arguments` package gets the `process.argv` and returns object with command and arguments passed by the user in the command line.

# Quick start

`npm install get-arguments`

Considering that there is `"bin" : { "myapp" : "./cli.js" }` in your `package.json` file:



##### If there is a limited number of valid commands, use:
```javascript
//cli.js
const args = require('get-arguments');

const commandName = "myapp"; //your CLI command name
const validCommands = ['init','config','update','list','build']; //your allowed commands

args(commandName,validCommands,function(argsObject){
  if(argsObject===null) return;
  //argsObject returns null if:
    //the incorrect command was typed by the user 
    //the arguments syntax typed by the user was incorrect
  //do your magic here
  //use argsObject.command
  //use argsObject.args
});
```

If the user types incorrect command, the following message in the command line is printed:
```
Usage: myapp <command>
where <command> is one of:
   init,
   config,
   update,
   list,
   build
```

##### If the user is allowed to type any command, use:
```javascript
//cli.js
const args = require('get-arguments');

args(function(argsObject){
  if(argsObject===null) return;
  //argsObject returns null if:
    //the arguments syntax typed by the user was incorrect
  //do your magic here
  //use argsObject.command
  //use argsObject.args
});
```

# CLI arguments syntax:

### Acceptable:

The user can pass a command with:
* no arguments
* only argument value(s)
* argument pair(s) of name and value(s)

```
> myapp command
> myapp command valA valB valC
> myapp command -p val
> myapp command --param val
> myapp command -p valueA valueB valueC --force
> myapp command --name John --age 25 --title "New Project"
```

### Unacceptable:

```
> myapp command valA valB --param
> myapp command valA valB -p
```

If the user types incorrect arguments syntax, the following message in the command line is printed:
```
Invalid arguments.
```

# Behaviour

`> myapp init`
```javascript
{
  command:'init',
  args:[]
}
```

`> myapp build a b c`
```javascript
{
  command:'build',
  args:['a','b','c']
}
```

`> myapp config --get name title age`
```javascript
{
  command:'config',
  args:{
    '--get':['name','title','age']
  }
}
```

`> myapp config --get name title age --set title "New Title"`
```javascript
{
  command:'config',
  args:{
    '--get':['name','title','age'],
    '--set':['title','New Title']
  }
}
```

`> myapp init --path ./project --async -f`
```javascript
{
  command:'init',
  args:{
    '--path':['./project'],
    '--async':[],
    '-f':[]
  }
}
```