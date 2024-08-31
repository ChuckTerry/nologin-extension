(() => {
  const DOMAIN = location.host.split('.').reverse().slice(0, 2).reverse().join('.');
  const STYLE_ELEMENT = document.createElement('style');
  STYLE_ELEMENT.id = 'nologin';
  
  let runtimeChecks = 0;
  
  function injectStyleElement() {
    if (runtimeChecks > 10) {
      console.debug('NoLogin: Stopping Persistence Checker');
      return;
    }
    window.setTimeout(()=> {
      if (document.querySelector('#nologin') === null) {
        document.head.append(STYLE_ELEMENT);
        console.debug('NoLogin: Stylesheets injected successfully');
      }
      injectStyleElement();
    }, 1000 * runtimeChecks++);
  }
  
  async function getStylesheetFromExtension() {
    const url = chrome.runtime.getURL(`stylesheets/${DOMAIN}.css`);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Unable to find defualt stylesheet for domain "${DOMAIN}"`);
      }
      const cssString = await response.text();
      return cssString;
    } catch (error) {
      console.debug(`NoLogin: ${error.message}`);
    }
    return '';
  }
  
  async function init() {
    console.debug('NoLogin: Initializing');
    const storageDictionary = {
      enabled: true,
      userStyles: {}
    };
    chrome.storage.sync.get(storageDictionary, async (options) => {
      if (options.enabled) {
        console.debug('NoLogin: Enabled');
        const userStyles = options.userStyles?.[DOMAIN];
        if (userStyles) {
          console.debug('NoLogin: Found User Styles');
          STYLE_ELEMENT.innerText = userStyles;
        } else {
          const extentionStyles = await getStylesheetFromExtension();
          
          console.debug(`NoLogin: ${extentionStyles === '' ? 'Failed to Find' : 'Found'} Extension Styles`);
          STYLE_ELEMENT.innerText = extentionStyles;
        }
      } else {
        console.debug('NoLogin Is not Enabled.');
      }
      if (STYLE_ELEMENT.innerText !== '') {
        console.debug('NoLogin: Stylesheets Found, preparing to inject');
        injectStyleElement();
      } else {
        console.debug('NoLogin: Stylesheets Not found');
      }
    });
  }

  init();
})();
