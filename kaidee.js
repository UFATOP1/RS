
const firebase = require("firebase/app");
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCmMd6JeWGc6c9-J1wQ62ZfCZ2reJVPZPY",
    authDomain: "realestate-ufax.firebaseapp.com",
    databaseURL: "https://realestate-ufax-default-rtdb.firebaseio.com",
    projectId: "realestate-ufax",
    storageBucket: "realestate-ufax.appspot.com",
    messagingSenderId: "1065511723737",
    appId: "1:1065511723737:web:681001a7f7f2668df214c8",
    measurementId: "G-Y5VFC8QSW1"
  };

firebase.initializeApp(firebaseConfig);
  
require("firebase/firestore");
require("firebase/database");
require("firebase/storage");
  
const storage = firebase.storage();
const firestore = firebase.firestore();
const database = firebase.database();

const request = require('request-promise')
const cheerio = require('cheerio')
const fs = require('fs')
const chalk = require('chalk');
const superagent = require('superagent');


const mainsitename = "kaidee"
let keyword = "ลุมพินี คอนโดทาวน์ บางแค";
const url = encodeURI('https://baan.kaidee.com/c17p9-realestate-condo/bangkok?price_end=2000000&q='+keyword);
const outputFile = mainsitename+'/'+mainsitename+'_'+keyword.replace(/\s/gm,"_")+'.json';
const FirebaseDATA = mainsitename+'_'+keyword.replace(/\s/gm,"_");
let resultCount = 0;

const parsedResults = [];

(async () => {
    const response = await superagent(url);
    const $ = cheerio.load(response.text);
    const jsonRaw = $("script[type='application/ld+json']")[1].children[0].data; 
    const result = JSON.parse(jsonRaw);
    const itemListElement = result.itemListElement;
    for(let itemDetill of itemListElement) {
      const count = resultCount++
        const Nameitem = itemDetill.mainEntity.name;
        const urlitem = itemDetill.mainEntity.url;
        const addressRegion = itemDetill.mainEntity.address.addressRegion;
        const addressLocality = itemDetill.mainEntity.address.addressLocality;
        const imageitem = itemDetill.mainEntity.image;
        const priceSpecifi = itemDetill.mainEntity.offers;
        const price = priceSpecifi[0]['priceSpecification'].price;
        
        const ddDaset = {
          "id": count + "_" + mainsitename,
          "Price": price,
          "G_Title": Nameitem,
          "img": ""+imageitem,
          "email": "",
          "links": {
              "website": urlitem,
              "bed": "bed",
              "area": "allData"
          },
          "location": {
              "city": addressRegion,
              "state": addressLocality,
              "country": "Thailand"
          }
      }
        //console.log("DATA: "+Nameitem,urlitem,addressRegion,addressLocality,imageitem,price)
        parsedResults.push(ddDaset)
    }
    
    firebase.database().ref('realestate/'+FirebaseDATA).set({
      parsedResults
     });
     console.log(chalk.yellow.bgBlue(`\n ${chalk.underline.bold(parsedResults.length)} List Results exported successfully to ${chalk.underline.bold(outputFile)}\n`))
    console.log(itemListElement[0].mainEntity);
})()
