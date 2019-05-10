//
// function executeForPromiseWithDelay(config, cb) {
//     return new Promise(function (resolve, reject){
//         function execute(){
//             var original = cb();
//             original.then(function (e) {
//                 resolve(e);
//             }, function (e) {
//                 var delay = config.delays.shift();
//
//                 if (delay && config.handleFn(e)) {
//                     setTimeout(execute, delay);
//                 } else{
//                     reject(e);
//                 }
//                 execute();
//             })
//         }
//     })
// }