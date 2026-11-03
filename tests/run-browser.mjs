import { chromium } from '@playwright/test';
import {core,responsive} from './browser-qa.mjs';
const browser=await chromium.launch({executablePath:process.env.CARNAGE_CHROMIUM||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
try{for(const run of [core,responsive]){const result=await run(browser);console.log(JSON.stringify(result,null,2));if(result.failure||result.errors.length)process.exitCode=1;}}finally{await browser.close();}
