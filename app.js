"use strict";
const express = require('express')
var axios = require('axios');
var cheerio = require('cheerio');
var bodyParser = require('body-parser');
const pug = require('pug');
const app = express()
const fs = require('fs');
const chalk = require('chalk');

const {
  join
} = require('path');

var http = require('http').Server(app);
var io = require('socket.io')(http);





app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(express.static('views'))
app.set('view engine', 'pug')



app.get('/', function (req, res) {
  console.log(req.query)
  res.send('UFATOP1.NET NO1 GOOGLE SEARCH')
})


app.get('/condo', (req, res) => {
  console.log(req.query)
  res.render('condo', {})
})

//   const task = cron.schedule('*/10 * * * * *', () => {
//     connectLiveReload()
//     console.log('running a task every minute');
//   });

app.get('/rscon', (req, res) => {
  console.log("reload")
  res.render('rscon', {})
})




io.on('connection', function (socket) {
  console.log('a user connected');
});




const csvResults = [];
const parsedResults = [];
const pageLimit = 10;
let pageCounter = 0;
let resultCount = 0;

app.get('/m_keySS',async function (req, res) {
  
  var myText = req.query.m_keySS;
  await getWebsitedotproperty(myText)
  await getWebsitelivinginsider(myText)
  await getWebsitezmyhome(myText)
  await getWebsitebkkcitismart(myText)
  await getWebsitekaidee(myText)
  ccstatus()
  res.redirect('/rscon')
});

const getWebsitedotproperty = async (keyword) => {
  try {

    const url = encodeURI('https://www.dotproperty.co.th/condos-for-sale/search/' + keyword + '?max_price=2000000');
    const Baseurl = encodeURI('https://www.dotproperty.co.th/condos-for-sale/search/' + keyword + '?max_price=2000000');
    const response = await axios.get(url)
    const $ = cheerio.load(response.data)

    // New Lists
    $('#search-results .wrapper').map((i, el) => {
      const count = resultCount++
      const title = $(el).find('h3').text().replace(/\s\s+/gm, ' ').replace(/\n+/gm, ' ');
      const Link = $(el).find('a').attr('href');
      const image = $(el).find('.img-lazy').attr('data-src');
      const Price = $(el).find('.price').text().replace(/\s\s+/gm, ' ');
      const allData = $(el).find('.description-block').text().replace(/\s\s+/gm, ' ');

      const csvdata = 
      {
        count: count+'_livinginsider',
        title: title,
        Link: Link,
        image: image,
        Price: Price,
        allData: allData,
      };
      //console.log(count, title, image, Price, Link, allData)

      let condoDaTa1 = '<div class="col-md-4 p-3"><small class="text-muted">dotproperty.co.th</small><div class="card box-shadow">' + "\n";

      let condoDaTa2 = '<img class="card-img-top" src="' + image + '">' + "\n";

      let condoDaTa3 = '<div class="card-body"><p class="card-text">' + title + '</p>' + "\n";

      let condoDaTa4 = '<div class="d-flex justify-content-between align-items-center">' + "\n";

      let condoDaTa5 = ' <div class="btn-group">' + "\n";

      let condoDaTa6 = '<a href="' + Link + ' "><button type="button" class="btn btn-sm btn-outline-secondary">Link</button></a>' + "\n";

      let condoDaTa7 = '</div><h3 class="text-muted"> ' + Price + ' </h3></div></div></div></div>';

      let SSDATA = condoDaTa1 + "\n" + condoDaTa2 + "\n" + condoDaTa3 + "\n" + condoDaTa4 + "\n" + condoDaTa5 + "\n" + condoDaTa6 + "\n" + condoDaTa7;

      //console.log(condoDaTa1,condoDaTa2,condoDaTa3,condoDaTa4,condoDaTa5,condoDaTa6,condoDaTa7)
      csvResults.push(csvdata)
      parsedResults.push(SSDATA.replace(/,/gm, ''))
    })

    //console.log(parsedResults)

    const nextPageLink = $('.pagination').find('.active').next().find('a').attr('href')
    console.log(chalk.cyan(`  NextPage: ${nextPageLink}`))
    pageCounter++

    if (pageCounter === pageLimit || nextPageLink === undefined) {
      exportResults("dotproperty",parsedResults)
      ddd("dotproperty",csvResults)
      return false
    }
    console.log(Baseurl + nextPageLink)
    getWebsitedotproperty(Baseurl + nextPageLink)
  } catch (error) {
    exportResults("dotproperty",parsedResults)
    ddd("dotproperty",csvResults)
    console.error(error)
  }
}

const getWebsitelivinginsider = async (keyword) => {
  try {

    const url = encodeURI('https://www.livinginsider.com/searchword/Condo/Buysell/1/'+keyword+'.html');
const Baseurl = encodeURI('https://www.livinginsider.com/searchword/Condo/Buysell/1/'+keyword+'.html');
    const response = await axios.get(url)
    const $ = cheerio.load(response.data)

    // New Lists
    $('.istock-list').map((i, el) => {
      const count = resultCount++
      const title = $(el).find('.font-Sarabun').text().replace(/\s\s+/g, ' ');
      const Link = $(el).find('a').attr('href');
      const image = $(el).find('.img-responsive').attr('src');
      const Price = $(el).find('.listing-cost').text().replace(/\s\s+/g, ' ');
      const allData = $(el).find('.description-block').text().replace(/\s\s+/gm, ' ');

      //console.log(count, title, image, Price, Link, allData)

      const csvdata = 
      {
        count: count+'_livinginsider',
        title: title,
        Link: Link,
        image: image,
        Price: Price,
        allData: allData,
      };
      

      let condoDaTa1 = '<div class="col-md-4 p-3"><small class="text-muted">livinginsider.com</small><div class="card box-shadow">' + "\n";

      let condoDaTa2 = '<img class="card-img-top" src="' + image + '">' + "\n";

      let condoDaTa3 = '<div class="card-body"><p class="card-text">' + title + '</p>' + "\n";

      let condoDaTa4 = '<div class="d-flex justify-content-between align-items-center">' + "\n";

      let condoDaTa5 = ' <div class="btn-group">' + "\n";

      let condoDaTa6 = '<a href="' + Link + ' "><button type="button" class="btn btn-sm btn-outline-secondary">Link</button></a>' + "\n";

      let condoDaTa7 = '</div><h3 class="text-muted"> ' + Price + ' </h3></div></div></div></div>';

      let SSDATA = condoDaTa1 + "\n" + condoDaTa2 + "\n" + condoDaTa3 + "\n" + condoDaTa4 + "\n" + condoDaTa5 + "\n" + condoDaTa6 + "\n" + condoDaTa7;

      //console.log(condoDaTa1,condoDaTa2,condoDaTa3,condoDaTa4,condoDaTa5,condoDaTa6,condoDaTa7)
      csvResults.push(csvdata)
      parsedResults.push(SSDATA.replace(/,/gm, ''))
    })

    //console.log(parsedResults)

    const nextPageLink = $('.pagination').find('.active').next().find('a').attr('href')
    console.log(chalk.cyan(`  NextPage: ${nextPageLink}`))
    pageCounter++

    if (pageCounter === pageLimit || nextPageLink === undefined) {
      exportResults("livinginsider",parsedResults)
      ddd("livinginsider",csvResults)
      return false
    }
    console.log(Baseurl + nextPageLink)
    getWebsitelivinginsider(Baseurl + nextPageLink)
  } catch (error) {
    exportResults("livinginsider",parsedResults)
    ddd("livinginsider",csvResults)
    console.error(error)
  }
}

const getWebsitezmyhome = async (keyword) => {
  try {

    const url = encodeURI('https://zmyhome.com/ค้นหา/ขาย/คอนโด/'+keyword+'/0/0/500/1-2-8-10-9/1/0/0/0/2/0/0/0/3/0');
    const Baseurl = encodeURI('https://zmyhome.com/ค้นหา/ขาย/คอนโด/'+keyword+'/0/0/500/1-2-8-10-9/1/0/0/0/2/0/0/0/3/0');
    const response = await axios.get(url)
    const $ = cheerio.load(response.data)

    // New Lists
    $('#property_unit .property-unit-list-col').map((i, el) => {
      const count = resultCount++
      //const title = $(el).find('.property-unit-container').text().replace(/\s\s+/g, ' ');
      const Link = $(el).find('div.property-unit-container a').attr('href');
      const image = $(el).find('img').attr('src');
      const Price = $(el).find('.property-price').text().replace(/\s\s+/g, ' ');
      const allData = $(el).find('.description-block').text().replace(/\s\s+/gm, ' ');
      let eclink = decodeURI(Link).replace('https://','').replace(/\//gm,' ')
      //console.log(count, title, image, Price, Link, allData)

      const csvdata = 
      {
        count: count+'_zmyhome',
        title: eclink,
        Link: Link,
        image: image,
        Price: Price,
        allData: allData,
      };
      

      let condoDaTa1 = '<div class="col-md-4 p-3"><small class="text-muted">zmyhome.com</small><div class="card box-shadow">' + "\n";

      let condoDaTa2 = '<img class="card-img-top" src="' + image + '">' + "\n";

      let condoDaTa3 = '<div class="card-body"><p class="card-text">' + eclink + '</p>' + "\n";

      let condoDaTa4 = '<div class="d-flex justify-content-between align-items-center">' + "\n";

      let condoDaTa5 = ' <div class="btn-group">' + "\n";

      let condoDaTa6 = '<a href="' + Link + ' "><button type="button" class="btn btn-sm btn-outline-secondary">Link</button></a>' + "\n";

      let condoDaTa7 = '</div><h3 class="text-muted"> ' + Price + ' </h3></div></div></div></div>';

      let SSDATA = condoDaTa1 + "\n" + condoDaTa2 + "\n" + condoDaTa3 + "\n" + condoDaTa4 + "\n" + condoDaTa5 + "\n" + condoDaTa6 + "\n" + condoDaTa7;

      //console.log(condoDaTa1,condoDaTa2,condoDaTa3,condoDaTa4,condoDaTa5,condoDaTa6,condoDaTa7)
      csvResults.push(csvdata)
      parsedResults.push(SSDATA.replace(/,/gm, ''))
    })

    //console.log(parsedResults)

    const nextPageLink = $('.pagination .pagination-custom-lg .justify-content-center').find('.page-item .active').next().find('a').attr('href')
    console.log(chalk.cyan(`  NextPage: ${nextPageLink}`))
    pageCounter++

    if (pageCounter === pageLimit || nextPageLink === undefined) {
      exportResults("zmyhome",parsedResults)
      ddd("zmyhome",csvResults)
      return false
    }
    let bas = encodeURI(nextPageLink)
        console.log(bas)
    getWebsitezmyhome(bas)
  } catch (error) {
    exportResults("zmyhome",parsedResults)
    ddd("zmyhome",csvResults)
    console.error(error)
  }
}

const getWebsitebkkcitismart = async (keyword) => {
  try {

    const url = encodeURI('https://www.bkkcitismart.com/%E0%B8%8B%E0%B8%B7%E0%B9%89%E0%B8%AD-%E0%B9%80%E0%B8%8A%E0%B9%88%E0%B8%B2?project_code=&project_name=&command=unit_list&pagination=1&tag='+keyword);
    const Baseurl = encodeURI('https://www.bkkcitismart.com/%E0%B8%8B%E0%B8%B7%E0%B9%89%E0%B8%AD-%E0%B9%80%E0%B8%8A%E0%B9%88%E0%B8%B2?project_code=&project_name=&command=unit_list&pagination=1&tag='+keyword);
    const response = await axios.get(url)
    const $ = cheerio.load(response.data)

    // New Lists
    $('.box-project').map((i, el) => {
      const count = resultCount++
      const title = $(el).find('h3').text().replace(/\s\s+/g, ' ');
      const Link = $(el).find('.box-img').attr('href');
      const image = $(el).find('.bg-responsive').attr('src');
      const Price = $(el).find('.price-project').text().split("฿")[1]
      const allData = $(el).find('.description-block').text().replace(/\s\s+/gm, ' ');


      let condoDaTa1 = '<div class="col-md-4 p-3"><small class="text-muted">bkkcitismart.com</small><div class="card box-shadow">' + "\n";

      let condoDaTa2 = '<img class="card-img-top" src="' + image + '">' + "\n";

      let condoDaTa3 = '<div class="card-body"><p class="card-text">' + title + '</p>' + "\n";

      let condoDaTa4 = '<div class="d-flex justify-content-between align-items-center">' + "\n";

      let condoDaTa5 = ' <div class="btn-group">' + "\n";

      let condoDaTa6 = '<a href="https://www.bkkcitismart.com/' + Link + ' "><button type="button" class="btn btn-sm btn-outline-secondary">Link</button></a>' + "\n";

      let condoDaTa7 = '</div><h3 class="text-muted"> ' + Price + ' </h3></div></div></div></div>';

      let SSDATA = condoDaTa1 + "\n" + condoDaTa2 + "\n" + condoDaTa3 + "\n" + condoDaTa4 + "\n" + condoDaTa5 + "\n" + condoDaTa6 + "\n" + condoDaTa7;

      //console.log(condoDaTa1,condoDaTa2,condoDaTa3,condoDaTa4,condoDaTa5,condoDaTa6,condoDaTa7)
      const csvdata = 
      {
        count: count+'_bkkcitismart',
        title: title,
        Link: Link,
        image: image,
        Price: Price,
        allData: allData,
      };
      csvResults.push(csvdata)
      parsedResults.push(SSDATA.replace(/,/gm, ''))

    })

    //console.log(parsedResults)

    const nextPageLink = pageCounter
    console.log(chalk.cyan(`  NextPage: ${nextPageLink}`))
    pageCounter++

    if (pageCounter === pageLimit || nextPageLink === undefined) {
      exportResults("bkkcitismart",parsedResults)
      ddd("bkkcitismart",csvResults)
      return false
    }
    console.log(Baseurl + nextPageLink)
    getWebsitebkkcitismart(Baseurl + nextPageLink)
  } catch (error) {
    exportResults("bkkcitismart",parsedResults)
    ddd("bkkcitismart",csvResults)
    console.error(error)
  }
}

const getWebsitekaidee = async (keyword) => {
  
    const superagent = require('superagent');
    const url = encodeURI('https://baan.kaidee.com/c17p9-realestate-condo/bangkok?price_end=2000000&q='+keyword);
  
    // New Lists
    (async () => {
      try{
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
          
        
      let condoDaTa1 = '<div class="col-md-4 p-3"><small class="text-muted">bkkcitismart.com</small><div class="card box-shadow">' + "\n";

      let condoDaTa2 = '<img class="card-img-top" src="' + imageitem + '">' + "\n";

      let condoDaTa3 = '<div class="card-body"><p class="card-text">' + Nameitem + '</p>' + "\n";

      let condoDaTa4 = '<div class="d-flex justify-content-between align-items-center">' + "\n";

      let condoDaTa5 = ' <div class="btn-group">' + "\n";

      let condoDaTa6 = '<a href="' + urlitem + ' "><button type="button" class="btn btn-sm btn-outline-secondary">Link</button></a>' + "\n";

      let condoDaTa7 = '</div><h3 class="text-muted"> ' + price + ' </h3></div></div></div></div>';

      let SSDATA = condoDaTa1 + "\n" + condoDaTa2 + "\n" + condoDaTa3 + "\n" + condoDaTa4 + "\n" + condoDaTa5 + "\n" + condoDaTa6 + "\n" + condoDaTa7;

      //console.log(condoDaTa1,condoDaTa2,condoDaTa3,condoDaTa4,condoDaTa5,condoDaTa6,condoDaTa7)

      const csvdata = 
      {
        count: count+'_kaidee',
        title: Nameitem,
        Link: urlitem,
        image: imageitem,
        Price: price,
        allData: addressRegion+''+addressLocality,
      };
      csvResults.push(csvdata)
      parsedResults.push(SSDATA.replace(/,/gm, ''))
        
      }
      exportResults("kaidee",parsedResults)
      
      fs.writeFile("kaidee"+'.json', JSON.stringify(csvResults, null, 4), (err) => {
        if (err) {
            console.log(err)
        }
        console.log( "Results exported successfully")
    })
  } catch (error) {
    exportResults("kaidee",parsedResults)
    fs.writeFile("kaidee"+'.json', JSON.stringify(csvResults, null, 4), (err) => {
      if (err) {
          console.log(err)
      }
      console.log( "Results exported successfully")
  })
    console.error(error)
  }
       console.log(chalk.yellow.bgBlue(`\n ${chalk.underline.bold(parsedResults.length)} List Results exported successfully`))
     // console.log(itemListElement[0].mainEntity);
  })()
 
}




const exportResults = (site,parsedResults) => {

  fs.writeFile( site+".pug", parsedResults.toString(), (err) => {
    if (err)
      console.log(err);
    else {
      console.log(chalk.yellow.bgBlue(`File written successfully\n${parsedResults.length} รายการ ${site}\n`))
      sendstatus()
    }
  });



}

function sendstatus() {
  fs.writeFile("views/rscon.pug", `<center>successfully\n\n<a href="/condo"><br/><button type="submit">ดูคอนโด</button><a></center>`, (err) => {
    if (err)
      console.log(err);
    else {
      console.log("ss")
    }
  })
}

function ccstatus() {
  fs.writeFile("views/rscon.pug", `<center>กำลังค้นหา<br/><h3>UFATOP1.NET NO1 GOOGLE SEARCH</h3><br/><br/>เริ่ม ทำการค้นหา<br/> ระยะเวลาประมาณ 2 ชั่วโมง กรุณาอย่าให้จอดับ <br/>มิเช่นนั้นต้องเริ่มใหม่<br/>ประมาณ 1 นาที รีเฟรชเพื่อดูสถานะ<center>
                <center><h2>..Start..</h2></center><br/>`, (err) => {
    if (err)
      console.log(err);
    else {
      console.log("CC")
    }
  })
}


function ddd(name,csvResults){
    // Example Node.js program to append data to file
fs.writeFile(name+'.json', JSON.stringify(csvResults, null, 4), (err) => {
      if (err) {
          console.log(err)
      }
      console.log( "Results exported successfully")
  })
}


//   task.start();
app.listen(8080, () => {
  console.log('Start server at port 8080.')
})