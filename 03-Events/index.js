const EventEmitter = require("events");
class MyEmmitter extends EventEmitter {}
const myEmmitter = new MyEmmitter();
const nomeEvento = "usuario:click";

myEmmitter.on(nomeEvento, function (click) {
  console.log("user clickeed", click);
});

/*
    myEmmitter.emit(nomeEvento, "scrollbar");
    myEmmitter.emit(nomeEvento, "ok btn");

    let count = 0;
    setInterval(() => {
    myEmmitter.emit(nomeEvento, "ok btn" + count++);
    }, 1000);
*/

const stdin = process.openStdin();
function main() {
  return new Promise(function (resolve, reject) {
    stdin.addListener("data", function (value) {
      //console.log(`Você digitou : ${value.toString().trim()}`);
      return resolve(value);
    });
  });
}
main().then(function (result) {
  console.log("result", result.toString());
});
