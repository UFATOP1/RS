const request = require('request-promise')
const cheerio = require('cheerio')
const axios = require("axios");
const fs = require('fs')
const chalk = require('chalk');
const superagent = require('superagent');

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

//https://zmyhome.com/ค้นหา/ขาย/คอนโด/กรุงเทพมหานคร/0/2000000/8000/1-2-8-10-9/1/0/0/0/2/0/0/0/3/0
const mainsitename = "zmyhome"
let keyword = "อีส พระราม 2";
const url = encodeURI('https://zmyhome.com/ค้นหา/ขาย/คอนโด/'+keyword+'/0/0/500/1-2-8-10-9/1/0/0/0/2/0/0/0/3/0');
const Baseurl = encodeURI('https://zmyhome.com/ค้นหา/ขาย/คอนโด/'+keyword+'/0/0/500/1-2-8-10-9/1/0/0/0/2/0/0/0/3/0');
const outputFile = mainsitename+'/'+mainsitename+'_'+keyword.replace(/\s/gm,"_")+'.json';
const FirebaseDATA = mainsitename+'_'+keyword.replace(/\s/gm,"_");
const parsedResults = [];
const pageLimit = 10;
let pageCounter = 0;
let resultCount = 0;


console.log(chalk.yellow.bgBlue(`\n  Start of ${chalk.underline.bold(url)} initiated...\n`));

const getWebsiteContent = async (url) => {
    try {
        const response = await axios.get(url)
        const $ = cheerio.load(response.data)

        // New Lists
        $('#property_unit .property-unit-list-col').map((i, el) => {
          
            const count = resultCount++
            const title = $(el).find('.property-unit-container').text().replace(/\s\s+/g, ' ');
            const website = $(el).find('div.property-unit-container a').attr('href');
            const image = $(el).find('img').attr('src');
            const Price = $(el).find('.property-price').text().replace(/\s\s+/g, ' ');
            const bed = $(el).find('.list-inline').text().replace(/\s\s+/g, ' ');
            const allData = $(el).find('.card-body').text().replace(/\s\s+/g, ' ');
            const location = $(el).find('.location').text().replace(/\s\s+/g, ' ');


            console.log(count, title, image, Price, website, bed, location, allData)

            const metadata = {
                "id": count + "_" + mainsitename,
                "Price": Price,
                "G_Title": title,
                "img": image,
                "email": "",
                "links": {
                    "website": website,
                    "bed": "bed",
                    "area": allData
                },
                "location": {
                    "city": "not",
                    "state": "not",
                    "country": "Thailand"
                }
            }
           parsedResults.push(metadata)
        })
//console.log(parsedResults)
        const nextPageLink = $('.pagination').find('.active').next().find('a').attr('href')
        //console.log(chalk.cyan(`  NextPage: ${nextPageLink}`))
        pageCounter++

        if (pageCounter === pageLimit || nextPageLink === undefined) {
            //exportResults(parsedResults)
            return false
        }
        console.log(Baseurl + nextPageLink)
        getWebsiteContent(Baseurl + nextPageLink)
    } catch (error) {
        //exportResults(parsedResults)
        console.error(error)
    }
}

const exportResults = (parsedResults) => {

    firebase.database().ref('realestate/'+FirebaseDATA).set({
        parsedResults
       });
       console.log(chalk.yellow.bgBlue(`\n ${chalk.underline.bold(parsedResults.length)} List Results exported successfully to ${chalk.underline.bold(outputFile)}\n`))
    // fs.writeFile(outputFile, JSON.stringify(parsedResults, null, 4), (err) => {
    //     if (err) {
    //         console.log(err)
    //     }
    //     console.log(chalk.yellow.bgBlue(`\n ${chalk.underline.bold(parsedResults.length)} List Results exported successfully to ${chalk.underline.bold(outputFile)}\n`))
    // })
}

getWebsiteContent(url)


// const parsedResults = [];

// (async () => {
//     const response = await superagent(url);
//     const $ = cheerio.load(response.text);
//     const jsonRaw = $("script[type='application/ld+json']")[1].children[0].data; 
//     const result = JSON.parse(jsonRaw);
//     const itemListElement = result.itemListElement;
//     for(let itemDetill of itemListElement) {
//         const Nameitem = itemDetill.mainEntity.name;
//         const urlitem = itemDetill.mainEntity.url;
//         const addressRegion = itemDetill.mainEntity.address.addressRegion;
//         const addressLocality = itemDetill.mainEntity.address.addressLocality;
//         const imageitem = itemDetill.mainEntity.image;
//         const priceSpecifi = itemDetill.mainEntity.offers;
//         const price = priceSpecifi[0]['priceSpecification'].price;
//         const ddDaset = {
//             "Nameitem": Nameitem,
//             "urlitem": urlitem,
//             "addressRegion": addressRegion,
//             "addressLocality": addressLocality,
//             "imageitem": imageitem,
//             "price": price
//         }
//         //console.log("DATA: "+Nameitem,urlitem,addressRegion,addressLocality,imageitem,price)
//         parsedResults.push(ddDaset)
//     }

    
//         fs.writeFile(outputFile, JSON.stringify(parsedResults, null, 4), (err) => {
//           if (err) {
//             console.log(err)
//           }
//           console.log(chalk.yellow.bgBlue(`\n ${chalk.underline.bold(parsedResults.length)} List Results exported successfully to ${chalk.underline.bold(outputFile)}\n`))
//         })
      

//     //console.log(itemListElement[0].mainEntity);
// })()