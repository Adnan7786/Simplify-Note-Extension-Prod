// tests
// https://www.youtube.com/
// https://www.google.com/search?q=english+text&tbm=isch
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

{
  const HTMLElement = HTMLDivElement.__proto__
  const get = CustomElementRegistry.prototype.get.bind(customElements)
  const define = CustomElementRegistry.prototype.define.bind(customElements)

  if (get('ocr-container') === undefined) {
    // This document requires 'TrustedHTML' assignment
    self.trustedTypes?.createPolicy('default', {
      createHTML(s) {
        return s
      },
    })

    class OCRContainer extends HTMLElement {
      constructor() {
        super()

        const shadow = this.attachShadow({ mode: 'open' })
        shadow.innerHTML = `
          <style>
            #body {
              position: fixed;
              bottom: 10px;
              right: 30px;
              // padding: 5px;
              z-index: 10000000000;
              box-shadow: 0 0 2px #ccc;
              display: flex;
              gap: 5px;
              flex-direction: column;
              background-color: #fff;
              max-height: calc(100vh - 20px);
              color-scheme: light;
              overflow: auto;
              border-radius: 5px;
              box-shadow: 0px 0px 10px 0px rgb(0 0 0 / 75%);
            }
          </style>
          <div id="body">
            <slot></slot>
          </div>
        `
      }
    }
    // customElements.define('ocr-container', OCRContainer);
    define('ocr-container', OCRContainer)
  }

  if (get('ocr-result') === undefined) {
    class OCRResult extends HTMLElement {
      constructor() {
        super()

        this.prefs = {
          'post-method': 'POST',
          'post-href': '',
          'post-body': '',
          lang: 'eng',
          example: 'NA',
          href: 'NA',
        }

        this.locales = {
          post: `Post/GET/PUT the result to a server.

Use Shift + Click to change the server data`,
          close: `Close this result.

Use Shift + Click to close all results.
Use Ctrl + Click or Command + Click to remove local language training data`,
          tutorial: `Where do you want the data to get posted:
  Server Example:
  &page;

  Post Example:
  POST|http://127.0.0.1:8080|&content;
  POST|http://127.0.0.1:8080|{"body":"&content;"}

  Put Example:
  PUT|http://127.0.0.1:8080|&content;

  Get Example:
  GET|http://127.0.0.1:8080?data=&content;|

  Open in Browser Tab Example:
  OPEN|http://127.0.0.1:8080?data=&content;|`,
        }

        const shadow = this.attachShadow({ mode: 'open' })
        shadow.innerHTML = `
          <style>
            :host {
              --fg: #444;
              --bg: #f3f6fd;
              --bg-result: #fff;
              --accent: #7af049;
              --width: 600px;
              --height: 400px;
              --gap: 10px;
              --color-primary: #0ed095;
              --color-bgr-main : #f3f6fd;
              --color-bgr-secondary: #fff;
              -color-font:rgb(69 69 69);
            }
            :host([data-mode='expand']) {
              --height: 70vh;
            }
            #body {
              font-size: 13px;
              font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
              // padding: 10px 25px;
              display: flex;
              flex-direction: column;
              height: var(--height);
              width: min(var(--width), calc(100vw, 2rem));
              color: var(--fg);
              background-color: var(--color-bgr-secondary);
              color-scheme: light;
              accent-color: var(--accent);
              border-radius: 5px;
              box-shadow: 0px 0px 10px 0px rgb(0 0 0 / 75%);
            }
            #close {
              position: relative;
             
              padding: 5px 5px;
              font-size: 1.2rem;
              margin: 5px 5px;
              cursor: pointer;
              font-weight: bold;
              color: var(--fg);
              text-shadow: 0 1px 0 #fff;
              opacity: 0.6;
              width: 2.0rem;
              height: 2.0rem;
              text-align: center;
              background-color: transparent;
              border: none;
            }
            #close:hover {
              opacity: 0.9;
              color: red;
            }
            #close:focus {
              outline: none;

            }
            #close:active {
              opacity: 1;
              color: red;
            }
            #close::before {
              content: '*';
            }
            progress {
              color: red !important;
              background-color: white;
              border: none;
              width: 100%;
              height: 7px;
              margin: 0 0 10px 0;
              border-radius: 0;
              overflow: hidden;
            }
            progress::-webkit-progress-bar {
              background-color: #aaa;
              width: 100%;
            }
            progress#lang::-webkit-progress-bar {
              border-bottom-left-radius: 7px;
            }
            progress#recognize::-webkit-progress-bar {
              border-bottom-right-radius: 7px;
            }
            progress::-webkit-progress-value {
              background-color: var(--color-primary) !important;
              border-top-right-radius: 3.5px;
              border-bottom-right-radius: 3.5px;
            }
            progress#lang::-webkit-progress-value {
              border-bottom-left-radius: 7px;
            }
            progress[value="1"]#recognize::-webkit-progress-value {
              border-top-right-radius: 0px;
              border-bottom-right-radius: 7px;
            }
            // img {
            //   display: none;
            // }
            // button,
            // input[type=submit],
            // input[type=button] {
            //   padding: calc(var(--gap) / 2) var(--gap);
            //   color: var(--fg);
            //   background-image: linear-gradient(rgb(237, 237, 237), rgb(237, 237, 237) 38%, rgb(222, 222, 222));
            //   box-shadow: rgba(0, 0, 0, 0.08) 0 1px 0, rgba(255, 255, 255, 0.75) 0 1px 2px inset;
            //   text-shadow: rgb(240, 240, 240) 0 1px 0;
            //   border: solid 1px rgba(0, 0, 0, 0.25);
            //   cursor: pointer;
            //   font-size: inherit;
            // }
            input[type=button]:disabled {
              opacity: 0.5;
            }
            #result {
              position: relative;
              border-radius: 5px 5px 0 0;
              min-height: 40px;
              background-color: var(--color-bgr-main);
              margin: 10px 20px 0 20px;
              overflow: auto;
              flex: 1;
              padding: var(--gap);
            }           
            #result:empty::before {
              content: attr(data-msg);
            }
            #result:not(:empty)::before {
              content: '';
              position: fixed;
              width: calc(min(var(--width), calc(100vw, 2rem)) - 20px - 20px);
              height: var(--gap);
              background: var(--color-bgr-main);
              opacity: 0.8;
              transform: translate(calc(-1 * var(--gap)),calc(-1 * var(--gap)));
              border-radius: inherit;
            }
            #result .ocr_par:first-child {
              margin-top: 0;
            }
            #result .ocr_par:last-child {
              margin-bottom: 0;
            }
            .ocr_line {
              display: inline;
            }
            #progress-bar{
              position: relative;
            }
            #progress-bar::before{
              content: "";
              position: absolute;
              height: var(--gap);
              width: 100%;
              bottom: 100%;
              opacity: 0.8;
              background: var(--color-bgr-main);
            }
            .grid {
              display: grid;
              grid-template-columns: min-content 1fr;
              white-space: nowrap;
              align-items: center;
              justify-items: left;
              grid-gap: var(--gap);
            }
            .options {
              // display: grid;
              // grid-template-columns: 1fr 1fr;
              // background: rgba(0, 0, 0, 0.05);
              background-color: var(--color-bgr-main);
              // margin-bottom: var(--gap);
              // margin-left: -3px;
              // margin-right: 30px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 0 10px;
            }
            #accuracy,
            #language {
              border: 1px solid var(--color-primary);
              border-radius: 5px;
              text-overflow: ellipsis;
              background-color: transparent;
              outline: none;
              padding: 5px 0px 5px 3px;
            }
            #tools {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              grid-gap: var(--gap);
              justify-content: end;
            }
            .ocr-text-footer {
              // width: 100%;
              height: 32px;
              padding: 10px 20px;
              // background-color: var(--color-bgr-secondary);
              border-bottom-left-radius: 5px;
              border-bottom-right-radius: 5px;
              display: flex;
              align-items: flex-start;
              justify-content: space-between;
              gap: 12px;
            }
            .ocr-text-footer-save {
              width: 115px;
              height: 30px;
              font-size: 12px;
              color: var(--color-font);
              background-color: var(--color-bgr-main);
              border: none;
              cursor: pointer;
              border-radius: 3px;
              transition: color 350ms ease-in-out;
            }
            #header{
              display: flex;
              align-items: center;
            }
            #header img{
              width: 50px;
              height: 50px;
            }
            #header span{
              font-size: 16px;
              font-weight: 600;
              color: var(--color-primary);
            }
            .ocr-text-footer-save:hover {
              color: var(--color-primary);  
            }
          </style>

          <div id="body">
                <div style="display: flex; justify-content: center;">
                </div>
            <div class="options">
            <div id="header" >
              <img src="chrome-extension://mjhigpcgpfiaadanipnacbalgaaleclc/src/icons/tooltip-logo.png" alt="logo" ">
              <span>OCR Text</span>
            </div>
            <div>
              <select id="language">
                <optgroup id="frequently-used">
                  <option value="eng">English</option>
                  <option value="hin">Hindi</option>
                  <option value="urd">Urdu</option>
                  <option value="ara">Arabic</option>
                  <option value="tam">Tamil</option>
                  <option value="tel">Telugu</option>
                </optgroup>
                <optgroup>
                <option value="afr">Afrikaans</option>
                <option value="sqi">Albanian</option>
                <option value="amh">Amharic</option>
                <option value="ara">Arabic</option>
                <option value="asm">Assamese</option>
                <option value="aze">Azerbaijani</option>
                <option value="eus">Basque</option>
                <option value="bel">Belarusian</option>
                <option value="ben">Bengali</option>
                <option value="bos">Bosnian</option>
                <option value="bul">Bulgarian</option>
                <option value="mya">Burmese</option>
                <option value="cat">Catalan</option>
                <option value="ceb">Cebuano</option>
                <option value="chr">Cherokee</option>
                <option value="chi_sim">Chinese(Simp)</option>
                <option value="chi_tra">Chinese(Trad)</option>
                <option value="hrv">Croatian</option>
                <option value="ces">Czech</option>
                <option value="dan">Danish</option>
                <option value="nld">Dutch</option>
                <option value="dzo">Dzongkha</option>
                <option value="eng">English</option>
                <option value="epo">Esperanto</option>
                <option value="est">Estonian</option>
                <option value="fin">Finnish</option>
                <option value="fra">French</option>
                <option value="glg">Galician</option>
                <option value="kat">Georgian</option>
                <option value="deu">German</option>
                <option value="grc">Greek</option>
                <option value="guj">Gujarati</option>
                <option value="hat">Haitian</option>
                <option value="heb">Hebrew</option>
                <option value="hin">Hindi</option>
                <option value="hun">Hungarian</option>
                <option value="isl">Icelandic</option>
                <option value="ind">Indonesian</option>
                <option value="iku">Inuktitut</option>
                <option value="gle">Irish</option>
                <option value="ita">Italian</option>
                <option value="jpn">Japanese</option>
                <option value="jav">Javanese</option>
                <option value="kan">Kannada</option>
                <option value="kaz">Kazakh</option>
                <option value="khm">Khmer</option>
                <option value="kir">Kirghiz</option>
                <option value="kor">Korean</option>
                <option value="kur">Kurdish</option>
                <option value="lao">Lao</option>
                <option value="lat">Latin</option>
                <option value="lav">Latvian</option>
                <option value="lit">Lithuanian</option>
                <option value="mkd">Macedonian</option>
                <option value="msa">Malay</option>
                <option value="mal">Malayalam</option>
                <option value="mlt">Maltese</option>
                <option value="mar">Marathi</option>
                <option value="nep">Nepali</option>
                <option value="nor">Norwegian</option>
                <option value="ori">Oriya</option>
                <option value="pus">Pashto</option>
                <option value="fas">Persian</option>
                <option value="pol">Polish</option>
                <option value="por">Portuguese</option>
                <option value="pan">Punjabi</option>
                <option value="ron">Romanian</option>
                <option value="rus">Russian</option>
                <option value="san">Sanskrit</option>
                <option value="srp">Serbian</option>
                <option value="sin">Sinhala</option>
                <option value="slk">Slovak</option>
                <option value="slv">Slovenian</option>
                <option value="spa">Spanish</option>
                <option value="swa">Swahili</option>
                <option value="swe">Swedish</option>
                <option value="syr">Syriac</option>
                <option value="tgl">Tagalog</option>
                <option value="tgk">Tajik</option>
                <option value="tam">Tamil</option>
                <option value="tel">Telugu</option>
                <option value="tha">Thai</option>
                <option value="bod">Tibetan</option>
                <option value="tir">Tigrinya</option>
                <option value="tur">Turkish</option>
                <option value="uig">Uighur</option>
                <option value="ukr">Ukrainian</option>
                <option value="urd">Urdu</option>
                <option value="uzb">Uzbek</option>
                <option value="vie">Vietnamese</option>
                <option value="cym">Welsh</option>
                <option value="yid">Yiddish</option>
                </optgroup>
              </select>
              <select id="accuracy" style="display: none;">
                <option value='3.02'>Low Accuracy</option>
                <option value='4.0.0_fast'>Moderate Accuracy</option>
                <option value='4.0.0'>Better Accuracy</option>
                <option value='4.0.0_best'>Best Accuracy</option>
              </select>
              
              <input type="button" value="x" id="close" title="Close">
              </div>
            </div>
           

            <div id="result" data-msg="Please wait..."   ></div>

            <div id="progress-bar" style="display: flex; margin: 0px 20px;" >
              <progress id="lang" value="0" max="1"></progress>
              <progress id="recognize" value="0" max="1"></progress>
            </div>

            <div id="tools" style="display: none;">
              <input type="button" value="Expand" id="expand">
              <input type="button" value="Post Result" id="post" disabled title="${this.locales.post}">
              <input type="button" value="Copy Text" id="copy" disabled>
              <input type="button" value="Close" id="" title="${this.locales.close}">
            </div>
            <div class="ocr-text-footer">
              <button class="ocr-text-footer-save" id="ocr-text-footer-heading">Heading</button>
              <button class="ocr-text-footer-save" id="ocr-text-footer-quote">Subheading</button>
              <button class="ocr-text-footer-save" id="ocr-text-footer-list">Bullet</button>
              <button class="ocr-text-footer-save" id="ocr-text-footer-paragraph">Paragraph</button>
            </div>     
          </div>
        `
        this.events = {}
      }

      /* io */
      configure(prefs, report = false) {
        Object.assign(this.prefs, prefs)
        if (report) {
          this.dispatchEvent(
            new CustomEvent('save-preference', {
              detail: prefs,
            })
          )
        }
      }
      /* methods */
      prepare() {
        // frequently used
        // for (const lang of this.prefs['frequently-used']) {
        //   const e = this.shadowRoot
        //     .querySelector(`option[value="${lang}"]`)
        //     .cloneNode(true)
        //   this.shadowRoot.getElementById('frequently-used').appendChild(e)
        // }
        // language
        this.language(this.prefs.lang)
        // accuracy
        this.accuracy(this.prefs.accuracy)
      }
      build(html) {
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, 'text/html')
        this.clear()

        for (const child of [...doc.body.childNodes]) {
          this.shadowRoot.getElementById('result').append(child)
        }
      }
      message(value) {
        this.shadowRoot.getElementById('result').dataset.msg = capitalizeFirstLetter(value)
      }
      progress(value, type = 'recognize') {
        this.shadowRoot.getElementById(type).value = value
      }
      rename(value) {
        this.shadowRoot.querySelector('option[value=detect]').textContent =
          value
      }
      clear() {
        this.shadowRoot
          .getElementById('result')
          .removeAttribute('contenteditable')
        this.shadowRoot.getElementById('result').textContent = ''
      }
      enable() {
        this.shadowRoot.getElementById('copy').disabled = false
        this.shadowRoot.getElementById('post').disabled = false
        this.shadowRoot
          .getElementById('result')
          .setAttribute('contenteditable', true)
      }
      get result() {
        return this.shadowRoot.getElementById('result').innerText
      }
      language(value) {
        this.dataset.language = value
        this.shadowRoot.getElementById('language').value = value
      }
      accuracy(value) {
        this.dataset.accuracy = value
        this.shadowRoot.getElementById('accuracy').value = value
      }
      toast(name, messages, timeout = 2000) {
        this.shadowRoot.getElementById(name).value = messages.new
        clearTimeout(this[name + 'ID'])
        this[name + 'ID'] = setTimeout(() => {
          this.shadowRoot.getElementById(name).value = messages.old
        }, timeout)
      }
      connectedCallback() {
        // copy
        this.shadowRoot.getElementById('copy').onclick = async () => {
          try {
            await navigator.clipboard.writeText(this.result)
          } catch (e) {
            const input = document.createElement('textarea')
            input.value = this.result
            input.style.position = 'absolute'
            input.style.left = '-9999px'
            document.body.append(input)
            input.select()
            document.execCommand('copy')
            input.remove()
          }
          this.toast('copy', {
            new: 'Done',
            old: 'Copy Text',
          })
        }
        // post
        this.shadowRoot.getElementById('post').onclick = (e) => {
          if (this.prefs['post-href'] === '' || e.shiftKey) {
            const message = this.locales.tutorial.replace(
              '&page;',
              this.dataset.page
            )
            const m = prompt(
              message,
              [
                this.prefs['post-method'],
                this.prefs['post-href'],
                this.prefs['post-body'],
              ].join('|')
            )
            const [method, href, body] = (m || '').split('|')

            const prefs = {
              'post-method': (method || 'POST').toUpperCase(),
              'post-href': href || '',
              'post-body': body || '',
            }
            this.configure(prefs, true)
          }

          const value = this.result.trim()
          const options = {
            method: this.prefs['post-method'],
            mode: 'no-cors',
          }
          if (this.prefs['post-body'] && this.prefs['post-method'] !== 'GET') {
            options.body = this.prefs['post-body']
              .replaceAll('&content;', value)
              .replaceAll('&href;', location.href)
            // If this is a JSON, try builder
            if (
              this.prefs['post-body'].startsWith('{') &&
              this.prefs['post-body'].endsWith('}')
            ) {
              try {
                const o = JSON.parse(this.prefs['post-body'])
                for (const [key, holder] of Object.entries(o)) {
                  if (typeof holder === 'string') {
                    o[key] = holder
                      .replaceAll('&content;', value)
                      .replaceAll('&href;', location.href)
                  }
                }
                options.body = JSON.stringify(o)
              } catch (e) {
                console.warn('Cannot use the JSON Builder', e)
              }
            }
          }

          const t = (msg, timeout = 3000) =>
            this.toast(
              'post',
              {
                new: msg,
                old: 'Post Result',
              },
              timeout
            )

          if (this.prefs['post-href'] === '') {
            return t('Empty Server')
          }

          t('...', 1000000)

          const href = this.prefs['post-href']
            .replaceAll('&content;', encodeURIComponent(value))
            .replaceAll('&href;', encodeURIComponent(location.href))

          if (options.method === 'OPEN') {
            this.dispatchEvent(
              new CustomEvent('open-link', {
                detail: href,
              })
            )

            t('Done')
          } else {
            this.dispatchEvent(
              new CustomEvent('fetch-resource', {
                detail: {
                  href,
                  options,
                },
              })
            )
          }
        }
        // change language
        this.shadowRoot.getElementById('language').onchange = (e) => {
          this.language(e.target.value)
          const prefs = {
            lang: e.target.value,
            // 'frequently-used': this.prefs['frequently-used'],
          }
          // prefs['frequently-used'].unshift(prefs.lang)
          // prefs['frequently-used'] = prefs['frequently-used']
          //   .filter((s, i, l) => s && l.indexOf(s) === i)
          //   .slice(0, 10)
          this.configure(prefs, true)
          this.dispatchEvent(new Event('language-changed'))
        }
        // change accuracy
        this.shadowRoot.getElementById('accuracy').onchange = (e) => {
          this.accuracy(e.target.value)
          const prefs = {
            accuracy: e.target.value,
          }
          this.configure(prefs, true)
          this.dispatchEvent(new Event('accuracy-changed'))
        }
        // close
        this.shadowRoot.getElementById('close').onclick = (e) => {
          this.remove()
          this.dispatchEvent(
            new MouseEvent('closed', {
              shiftKey: e.shiftKey,
              ctrlKey: e.ctrlKey,
              metaKey: e.metaKey,
            })
          )
        }
        // expand
        this.shadowRoot.getElementById('expand').onclick = (e) => {
          this.dataset.mode =
            this.dataset.mode === 'expand' ? 'collapse' : 'expand'
          e.target.value =
            this.dataset.mode === 'expand' ? 'Collapse' : 'Expand'
        }

        // ocr-text-footer-heading
        this.shadowRoot.getElementById('ocr-text-footer-heading').onclick = (
          e
        ) => {
          // send data to response.js
          this.dispatchEvent(
            new CustomEvent('ocr-text-footer-heading-clicked', {
              detail: {
                result: this.result,
                language: 'insert_text',
                accuracy: 'heading',
              },
            })
          )
        }

        // ocr-text-footer-list
        this.shadowRoot.getElementById('ocr-text-footer-list').onclick = (
          e
        ) => {
          // send data to response.js
          this.dispatchEvent(
            new CustomEvent('ocr-text-footer-list-clicked', {
              detail: {
                result: this.result,
                language: 'insert_text',
                accuracy: 'bullet',
              },
            })
          )
        }

        // ocr-text-footer-paragraph
        this.shadowRoot.getElementById('ocr-text-footer-paragraph').onclick = (
          e
        ) => {
          // send data to responce.js
          this.dispatchEvent(
            new CustomEvent('ocr-text-footer-paragraph-clicked', {
              detail: {
                result: this.result,
                language: 'insert_text',
                accuracy: 'paragraph',
              },
            })
          )
        }

        // ocr-text-footer-quote
        this.shadowRoot.getElementById('ocr-text-footer-quote').onclick = (
          e
        ) => {
          // send data to responce.js
          this.dispatchEvent(
            new CustomEvent('ocr-text-footer-quote-clicked', {
              detail: {
                result: this.result,
                language: 'insert_text',
                accuracy: 'subheading',
              },
            })
          )
        }

        // apply commands on cross-origin
        this.addEventListener('command', (e) => {
          const { name, args } = e.detail

          this[name](...args)
        })
        // constants
        this.dataset.languages = [
          ...this.shadowRoot.querySelectorAll('#language option'),
        ]
          .map((e) => e.value)
          .filter((s) => s !== 'detect')
          .join(', ')
      }
    }

    // customElements.define('ocr-result', OCRResult);
    define('ocr-result', OCRResult)
  }
}
