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


const mainsitename = "livinginsider"
let keyword = "เดอะนิชไอดีพระราม2";
const url = encodeURI('https://www.livinginsider.com/searchword/Condo/Buysell/1/'+keyword+'.html');
const Baseurl = encodeURI('https://www.livinginsider.com/searchword/Condo/Buysell/1/'+keyword+'.html');
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
        $('.istock-list').map((i, el) => {
            const count = resultCount++
            const title = $(el).find('.font-Sarabun').text().replace(/\s\s+/g, ' ');
            const website = $(el).find('a').attr('href');
            const image = $(el).find('.img-responsive').attr('src');
            const Price = $(el).find('.listing-cost').text().replace(/\s\s+/g, ' ');
            const bed = $(el).find('.div-ic-detail').text().replace(/\s\s+/g, ' ');
            const allData = $(el).find('.item-desc').text().replace(/\s\s+/g, ' ');
            const location = $(el).find('.ic-detail-zone').text().replace(/\s\s+/g, ' ');


            //console.log(count, title, image, Price, website, bed, location, allData)

            const metadata = {
                "id": count + "_" + mainsitename,
                "Price": Price,
                "G_Title": title,
                "img": ""+image,
                "email": "",
                "links": {
                    "website": website,
                    "bed": bed,
                    "area": allData
                },
                "location": {
                    "city": ""+location.split(",")[1],
                    "state": location.split(",")[0],
                    "country": "Thailand"
                }
            }
            parsedResults.push(metadata)
        })
console.log(parsedResults)
        const nextPageLink = $('.pagination').find('.active').next().find('a').attr('href')
        //console.log(chalk.cyan(`  NextPage: ${nextPageLink}`))
        pageCounter++

        if (pageCounter === pageLimit || nextPageLink === undefined) {
            exportResults(parsedResults)
            return false
        }
        console.log(Baseurl + nextPageLink)
        getWebsiteContent(Baseurl + nextPageLink)
    } catch (error) {
        exportResults(parsedResults)
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