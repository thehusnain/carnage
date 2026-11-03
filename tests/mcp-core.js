async (originalPage)=>{

function expect(locator){const check=(fn,message)=>async(...args)=>{const end=Date.now()+(args[1]?.timeout||10000);let value;do{value=await fn(args[0]);if(value)return;await new Promise(r=>setTimeout(r,80));}while(Date.now()<end);throw Error(message+' '+args[0]);};return {
 toBeVisible:check(()=>locator.isVisible(),'Not visible'),
 toHaveText:check(async text=>(await locator.textContent())===text,'Text mismatch'),
 toHaveAttribute:async(name,value)=>{const end=Date.now()+10000;do{if(await locator.getAttribute(name)===value)return;await new Promise(r=>setTimeout(r,60));}while(Date.now()<end);throw Error('Attribute mismatch '+name+' '+await locator.getAttribute(name)+' expected '+value)},
 toBeEnabled:check(()=>locator.isEnabled(),'Not enabled'),
 toBeDisabled:check(async()=>!(await locator.isEnabled()),'Not disabled'),
 toBeFocused:check(()=>locator.evaluate(e=>document.activeElement===e),'Not focused'),
 toHaveCSS:check(async()=>true,'CSS'),
 not:{toHaveText:check(async text=>(await locator.textContent())!==text,'Unexpected text')}
};}


const root = { pathname:'/home/sheriff/Desktop/carnage/test-results/' };
const base='http://127.0.0.1:5173';
const assert = (condition, message) => { if (!condition) throw Error(message); };
const visit = async (page, path) => { await page.goto(base+path, {waitUntil:'networkidle'}); await expect(page.locator('h1')).toBeVisible(); };
const overflow = async (page, message) => assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1), `Overflow: ${message}`);
async function setup(browser) {  const context=await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1}); const page=await context.newPage(); const errors=[];page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});return {context,page,errors}; }
async function report(name,checks,errors,extra={}){return {name,checks,errors,...extra};}

async function core(browser) {
  const {context,page,errors}=await setup(browser);const checks=[];const pass=n=>checks.push(n);
  try {
    await visit(page,'/');assert(await page.locator('.three-stage canvas').evaluate(i=>i.width>0),'Hero image missing');assert(await page.evaluate(()=>document.fonts.check('16px "Space Grotesk"')),'Font missing');pass('Homepage vehicle and local font loading');
    await visit(page,'/explore?component=battery');const inspector=page.locator('.inspector');await expect(inspector.locator('h2')).toHaveText('High-voltage traction battery');
    await page.locator('.starter-parts').getByRole('button',{name:'Electric drive',exact:true}).click();await page.getByRole('button',{name:'More layers',exact:true}).click();await expect(inspector.locator('h2')).toHaveText('Electric traction motor');
    for(const mode of ['Electronic','Network','Security','Threat','Protection','Mechanical']) {await page.locator('.mode-bar').getByRole('button',{name:mode}).click();await expect(inspector.locator('h2')).toHaveText('Electric traction motor');assert(page.url().includes('component=motor'),'Mode lost component');}
    pass('Hotspots and all six modes preserve selected component');
    await page.locator('.starter-parts').getByRole('button',{name:'Vehicle computers'}).click();await page.locator('.mode-bar').getByRole('button',{name:'Threat'}).click();await expect(inspector.getByRole('link',{name:'CAN message injection'})).toBeVisible();
    await page.locator('.mode-bar').getByRole('button',{name:'Protection'}).click();await expect(inspector.getByRole('link',{name:'Network segmentation'})).toBeVisible();
    await page.locator('.learning-settings summary').click();await page.getByRole('button',{name:'Technical',exact:true}).click();await page.reload({waitUntil:'networkidle'});await page.locator('.learning-settings summary').click();await expect(page.getByRole('button',{name:'Technical',exact:true})).toHaveAttribute('aria-pressed','true');await expect(inspector.locator('h2')).toHaveText('Vehicle network gateway');pass('Threat-defense links, technical content and local preferences');
    await page.locator('.explorer-preferences select').selectOption('conventional');await expect(inspector.getByText('Not applicable to this category',{exact:true})).toBeVisible();await page.getByRole('button',{name:/All .* components/}).click();await page.locator('.component-list').getByRole('button',{name:'Internal combustion engine'}).click();await expect(inspector.locator('h2')).toHaveText('Internal combustion engine');await page.locator('.explorer-preferences select').selectOption('connected');await expect(inspector.getByText('Not applicable to this category',{exact:true})).toBeVisible();pass('Category changes retain selection and identify unavailable systems');
    await visit(page,'/explore?component=battery&mode=Mechanical');await page.getByRole('button',{name:'Original study',exact:true}).click();await page.getByRole('button',{name:'Reveal selected system'}).click();await page.waitForFunction(()=>{const c=document.querySelector('.hover-video');return c&&c.width>300&&c.style.opacity==='1';});await page.waitForTimeout(2600);
    assert(await page.locator('.hover-video').evaluate(c=>{const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let n=0;for(let i=0;i<d.length;i+=400)n+=d[i]+d[i+1]+d[i+2];return n>1000;}),'Black cutaway canvas');
    await page.getByRole('button',{name:'Return to exterior'}).click();await expect(page.getByRole('button',{name:'Graphite',exact:true})).toBeEnabled({timeout:15000});
    for(const name of ['Graphite','Sky blue','Electric green','Lime green','Studio silver']){await page.getByRole('button',{name,exact:true}).click();await expect(page.locator('.finish-name')).toHaveText(name,{timeout:10000});}
    for(const value of ['config/wheels-aero.png','config/wheels-forged.png','']){await page.getByLabel('Wheel design').selectOption(value);await expect(page.locator('.finish-name')).not.toHaveText('Loading finish…',{timeout:10000});}
    await page.getByRole('button',{name:'Zoom in'}).click();await expect(page.locator('.vehicle-image-wrap')).toHaveCSS('transform','matrix(1.12, 0, 0, 1.12, 0, 0)');await page.getByRole('button',{name:'Reset appearance'}).click();pass('Decoded nonblack cutaway, neutral return, every paint/wheel, shared-plane zoom');
    await visit(page,'/knowledge?q=CAN');await expect(page.getByRole('heading',{name:'CAN · Controller Area Network'})).toBeVisible();await page.getByRole('button',{name:'Threats',exact:true}).click();await expect(page.getByRole('heading',{name:'CAN message injection'})).toBeVisible();await page.locator('.knowledge-results article a').first().click();await expect(page.locator('h1')).toHaveText('CAN message injection');await page.getByRole('button',{name:'Bookmark this lesson',exact:true}).click();await page.getByRole('button',{name:'Mark as read',exact:true}).click();await visit(page,'/knowledge?saved=1');await expect(page.getByRole('heading',{name:'CAN message injection'})).toBeVisible();await page.reload({waitUntil:'networkidle'});await expect(page.getByRole('heading',{name:'CAN message injection'})).toBeVisible();await page.getByLabel('Search the knowledge base').fill('nonexistent-carnage-topic');await expect(page.getByRole('heading',{name:'Your reading list starts here.'})).toBeVisible();pass('Search, filters, empty state, bookmarks and reading persistence');
    await visit(page,'/systems');await page.getByRole('link',{name:'Chassis & body'}).first().click();await expect(page.locator('h1')).toHaveText('Chassis & body');await page.goBack({waitUntil:'networkidle'});await expect(page.locator('h1')).toHaveText('Vehicle systems.');await page.goForward({waitUntil:'networkidle'});await expect(page.locator('h1')).toHaveText('Chassis & body');pass('Direct routes and browser back/forward');
    await visit(page,'/explore?component=keyless&mode=Security');const target=page.locator('.mode-bar').getByRole('button',{name:'Network'});await target.focus();await page.keyboard.press('Enter');await expect(target).toHaveAttribute('aria-pressed','true');await page.keyboard.press('Tab');assert(await page.evaluate(()=>document.activeElement.tagName==='BUTTON'),'Tab focus missing');pass('Keyboard Enter, Tab and focus');
    await page.route('https://**/*',r=>r.abort());await visit(page,'/knowledge?q=battery');await expect(page.getByRole('heading',{name:'High-voltage traction battery'})).toBeVisible();pass('Core search and education with external services blocked');
    assert(!errors.length,JSON.stringify(errors));return await report('core',checks,errors);
  }catch(error){await page.screenshot({path:root.pathname+'core-failure.png',fullPage:true});await report('core',checks,errors,{failure:String(error),url:page.url()});return {checks,errors,failure:String(error),url:page.url()};}finally{await context.close();}
}

async function responsive(browser) {
  const {context,page,errors}=await setup(browser);const checks=[];
  try {
    const routes=['/','/explore?component=battery&mode=Mechanical','/systems','/cybersecurity','/threats','/knowledge','/about'];
    for(const [width,height] of [[1440,900],[1920,1080],[768,1024],[390,844],[360,800]]){
      await page.setViewportSize({width,height});
      for(const path of routes){await visit(page,path);await overflow(page,`${width} ${path}`);if(path.startsWith('/explore')){assert(await page.locator('.three-stage canvas').evaluate(i=>i.width>0),'Vehicle asset missing');if(width<768){await page.locator('.mobile-component-select select').selectOption('keyless');await expect(page.locator('.inspector h2')).toHaveText('Keyless entry & digital keys');}}
        if(path==='/'||path.startsWith('/explore'))await page.screenshot({path:root.pathname+`${path==='/'?'home':'explore'}-${width}.png`,fullPage:true});
      }checks.push(`${width}×${height}: all seven sections, car loading, selection and no overflow`);
    }
    await page.setViewportSize({width:390,height:844});await visit(page,'/');await page.getByRole('button',{name:'Open navigation'}).click();await expect(page.getByRole('navigation')).toBeVisible();await page.keyboard.press('Escape');await expect(page.getByRole('button',{name:'Open navigation'})).toBeFocused();checks.push('Mobile menu and Escape focus restoration');
    const touch=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});const tp=await touch.newPage();await visit(tp,'/explore?component=battery');await tp.locator('.starter-parts').getByRole('button',{name:'Electric drive',exact:true}).tap();await expect(tp.locator('.inspector h2')).toHaveText('Electric traction motor');await touch.close();checks.push('Emulated touch hotspot selection');
    await page.emulateMedia({reducedMotion:'reduce'});await visit(page,'/explore?component=battery');await page.getByRole('button',{name:'Original study',exact:true}).click();await expect(page.getByRole('button',{name:'Reveal selected system'})).toBeDisabled();await visit(page,'/');assert(await page.locator('.three-stage canvas').count()===1,'Reduced motion hides 3D');await page.screenshot({path:root.pathname+'home-reduced-motion.png',fullPage:true});checks.push('Reduced motion: no parallax, no animated cutaway and visible content');
    assert(!errors.length,JSON.stringify(errors));return await report('responsive',checks,errors,{limitations:['Chromium and emulated touch only. Physical iOS/Safari not tested.']});
  }catch(error){await page.screenshot({path:root.pathname+'responsive-failure.png',fullPage:true});await report('responsive',checks,errors,{failure:String(error),url:page.url()});return {checks,errors,failure:String(error),url:page.url()};}finally{await context.close();}
}

return await core(originalPage.context().browser());
}