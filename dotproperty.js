const axios = require("axios");
const cheerio = require("cheerio");
const fs = require('fs');
const chalk = require('chalk');

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

const mainsitename = "dotproperty"
let keyword = "Plum extra พระราม2";
const url = encodeURI('https://www.dotproperty.co.th/condos-for-sale/search/' + keyword + '?max_price=2000000');
const Baseurl = encodeURI('https://www.dotproperty.co.th/condos-for-sale/search/' + keyword + '?max_price=2000000');
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
        $('#search-results .wrapper').map((i, el) => {
            const count = resultCount++
            const title = $(el).find('h3').text().replace(/\s\s+/g, ' ');
            const website = $(el).find('a').attr('href');
            const image = $(el).find('.img-lazy').attr('data-src');
            const Price = $(el).find('.price').text().replace(/\s\s+/g, ' ');
            const bed = $(el).find('.list-inline').text().replace(/\s\s+/g, ' ');
            const allData = $(el).find('.description-block').text().replace(/\s\s+/g, ' ');
            const location = $(el).find('.location').text().replace(/\s\s+/g, ' ');


            //sconsole.log(count, title, image, Price, website, bed, location, allData)

            const metadata = {
                "id": count + "_" + mainsitename,
                "Price": Price,
                "G_Title": title,
                "img": image,
                "email": "",
                "links": {
                    "website": website,
                    "bed": bed,
                    "area": allData
                },
                "location": {
                    "city": location.split(",")[1],
                    "state": location.split(",")[0],
                    "country": "Thailand"
                }
            }
            parsedResults.push(metadata)
        })


        const nextPageLink = $('.pagination').find('.active').next().find('a').attr('href')
        console.log(chalk.cyan(`  NextPage: ${nextPageLink}`))
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

}


getWebsiteContent(url)