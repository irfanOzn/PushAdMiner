'use strict';

const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const nexus = devices['Nexus 5'];
var fs = require('fs');
var fs_extra = require('fs-extra')


process.on('unhandledRejection', error => {
    // Prints "unhandledRejection woops!"
    console.log(site_id+' :: '+url)
      console.log('unhandledRejection', error);
  });

async function load_page(url,id,i_count,wait_time){
    var count = 0
    
    // Viewport && Window size
    const width = 650
    const height = 1020
  
    var home_dir= '/home/pptruser/'
    
    await puppeteer.launch({ headless:false,  executablePath:home_dir+'chromium/chrome',
                             userDataDir:home_dir+'chrome_user/',
                             args: [
                                    '--enable-features=NetworkService',
                                    '--no-sandbox',
                                    '--disable-setuid-sandbox',
                                    '--window-size=${ width },${ height }',
                                    //'--start-maximized',
                                    '--ignore-certificate-errors','--disable-gpu', 
                                    //'--disable-extensions-except='+home_dir+'app/adGuard',
                                    //'--load_extension = '+home_dir+'app/adGuard'                                                           
                                  ]
                           }).then(async browser => 
      {
            
      try{
        
        var img_dir = home_dir+'screenshots/'+id
       
                   
        const page = await browser.newPage();
        await page.setViewport({ width, height })
        

        try{
            console.log('visiting page')
            await page.goto(url );
            await p.screenshot({ path: img_dir+'_page.png', type: 'png' });
         
        }
        catch(err){
            console.log(id+" :: page load timeout")
        }
          
        console.log('page visited')
               
          
      }
      catch(e){
          console.log(e)
      }
    })
}

async function crawl_url(url, id, i_count,timeout){
    try{
      console.log('crawling started :: ' +id)
      await load_page(url,id, i_count,timeout)   
       
    }
    catch(error){
      console.log(error)        
    } 
}

if (process.argv[2]) {
var url = process.argv[2];
var site_id =process.argv[3];  
var i_count = process.argv[4];
var timeout = process.argv[5]; 
crawl_url(url,site_id,i_count,timeout)

}