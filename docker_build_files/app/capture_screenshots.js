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
    
    await puppeteer.launch({ headless:false,  
                    // executablePath:home_dir+'chromium/chrome',
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
        
        var the_interval = wait_time *1000 //in milliseconds
        var img_dir = home_dir+'screenshots/'+id
        
        /*Get screenshot whenever new tab opens and close page after 5 minutes */
        browser.on('targetcreated', async function(target){    
        
          if(target._targetInfo.type=='page'){
            var p = await target.page()                
            p.once('load',  async function(){
              console.log('page loaded')
              try{
                  try{
                      await p.waitForNavigation('networkidle2', timeout=90000)}
                  catch(e)
                  {
                    console.log('timeout!!')
                  }

                  // Check if Service worker was installed after a delay of 30 secs
                  await setTimeout(async function() {
                    const sw_found = await p.evaluate(()=> { return navigator.serviceWorker.controller} )
                    if (sw_found!= null)
                      console.log('Service Worker Found!!!')
                  }, 30000)

              }catch(e){
                console.log(e)
              } 
            })   	
          }

      })
                   
        const page = await browser.newPage();
        await page.setViewport({ width, height })
        
        // Intercept and block requests
        await page.setRequestInterception(true)

        // Log all the requests made by the page
        page.on('request', (request) => {
          console.log('>>', request.method(), request.url())
          request.continue()
        })

        // Log all the responses 
        page.on('response', (response) => {
          console.log('<<', response.status(), response.url())
        })

        var wait_interval = 5000
        count=0  
        
        // checks if the timeout has exceeded every few seconds 
        var trigger = await setInterval(async function() 
        {   
            // close the browser if the run exceeds timeout interval
            if (count >= the_interval )
            {      
              console.log(new Date(Date.now()).toLocaleString())
              
              //await browser.close();
              console.log('visit ended')    
              clearInterval(trigger);      
              await process_ended(id)
              return   
            }
            count = count+wait_interval  

        }, wait_interval);

        try{
            console.log('visiting page')
            await page.goto(url , { waitUntil: 'networkidle0', timeout: 90000});
            await page.screenshot({ path: img_dir+'_page.png', type: 'png' });
         
        }
        catch(err){
            console.log(id+" :: page load timeout")
            console.log(err)
        }
          
        console.log('page visited')
               
          
      }
      catch(e){
          console.log(e)
      }
    })
}


async function process_ended(id){
    console.log('crawl process ended :: '+id) 	
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