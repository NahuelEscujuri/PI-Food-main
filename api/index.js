//                       _oo0oo_
//                      o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\  =  /0
//                    ___/`---'\___
//                  .' \\|     |// '.
//                 / \\|||  :  |||// \
//                / _||||| -:- |||||- \
//               |   | \\\  -  /// |   |
//               | \_|  ''\---/''  |_/ |
//               \  .-\__  '-'  ___/-. /
//             ___'. .'  /--.--\  `. .'___
//          ."" '<  `.___\_<|>_/___.' >' "".
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//         \  \ `_.   \_ __\ /__ _/   .-` /  /
//     =====`-.____`.___ \_____/___.-`___.-'=====
//                       `=---='
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const server = require('./src/app.js');
const { conn, Diet, Recipe } = require('./src/db.js');
require('dotenv').config();

let allDiets = ["gluten free","ketogenic","vegetarian","lacto-vegetarian","ovo-vegetarian","vegan","pescetarian","paleo","primal","FODMAP","whole30"] 
const preloadDiets = async ()=> allDiets.map(async r => await Diet.create({name:r}));

const {DB_PORT} = process.env

// Syncing all the models at once.
conn.sync({ force: true }).then(() => {
  server.listen(DB_PORT, () => {
    preloadDiets();
    console.log('%s listening at '+DB_PORT); // eslint-disable-line no-console
  });
});
