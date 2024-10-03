import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgxGrapesjsModule } from 'ngx-grapesjs';
import grapesjs from 'grapesjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxEditorComponent } from 'ngx-grapesjs/lib/editor.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-components',
  standalone: true,
  imports: [NgxGrapesjsModule, RouterLink, FontAwesomeModule, CommonModule, FormsModule],
  templateUrl: './components.component.html',
  styleUrls: ['./components.component.css']
})
export class ComponentsComponent implements OnInit {
  editor: any;
  blocksVisible: boolean = false;
  stylesVisible: boolean = false;
  layersVisible: boolean = false;

  ngOnInit(): void {
    this.blocksVisible = true;
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      this.initializeGrapesJSEditor();
    }
  }

  initializeGrapesJSEditor(): void {
    this.editor = grapesjs.init({
      container: '#gjs',
      fromElement: true,
      height: '100%',
      width: 'auto',
      storageManager: true,
 
      blockManager: {
        appendTo: '#blocks',
      },
      layerManager: {
        appendTo: '.layers-container'
      },
      traitManager: {
        appendTo: '.traits-container',
      },
      selectorManager: {
        appendTo: '.styles-container'
      },
      deviceManager: {
        devices: [
          {
            name: 'Desktop',
            width: '', 
          },
          {
            name: 'Tablet',
            width: '768px',  
            widthMedia: '768px', 
          },
          {
            name: 'Mobile',
            width: '375px',  
            widthMedia: '480px', 
          },
          {
            name: 'Preview',
            width:'',
          },
        ]
      },
      styleManager: {
        appendTo: '.styles-container',
        sectors: [{
          name: 'General',
          open: false,
          buildProps: ['float', 'display', 'position', 'top', 'right', 'left', 'bottom'],
        }, {
          name: 'Dimension',
          open: false,
          buildProps: ['width', 'height', 'max-width', 'min-height', 'margin', 'padding'],
        }, {
          name: 'Typography',
          open: false,
          buildProps: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', 'text-align', 'text-decoration', 'text-shadow'],
        }, {
          name: 'Decorations',
          open: false,
          buildProps: ['opacity', 'background-color', 'border-radius', 'border', 'box-shadow', 'background'],
        }, {
          name: 'Extra',
          open: false,
          buildProps: ['transition', 'perspective', 'transform'],
        }]
      },
      panels: {
        defaults: [
          {
            id: 'panel-top',
            el: '.panel__top',
          },
          {
            id: 'basic-actions',
            el: '.panel__basic-actions',
            buttons: [
              {
                id: 'visibility',
                active: true, 
                className: 'btn-toggle-borders',
                label: '<i class="fa-solid fa-border-none"></i>',
                command: 'sw-visibility',
              },
              {
                id: 'export',
                className: 'btn-open-export',
                label: '<i class="fa-solid fa-code"></i>',
                command: 'export-template',
              },
              {
                id: 'toggle-fullscreen',
                className: 'btn-toggle-fullscreen',
                label: '<i class="fa-solid fa-expand"></i>',
                command: 'toggle-fullscreen',
              },
              {
                id: 'undo',
                className: 'btn-undo',
                label: '<i class="fa-solid fa-rotate-left"></i>',
                command: 'undo',
              },
              {
                id: 'redo',
                className: 'btn-redo',
                label: '<i class="fa-solid fa-rotate-right"></i>',
                command: 'redo',
              },
              {
                id: 'delete-page',
                className: 'btn-delete-page',
                label: '<i class="fa-solid fa-trash-can"></i>',
                command: 'delete-page',
              },
              {
                id: 'show-json',
                className: 'btn-show-json',
                label: 'JSON',
                command: "this.showJsonCommand",
              },
              {
                id: 'set-device-desktop',
                label: '<i class="fa-solid fa-display"></i>',
                command: 'set-device-desktop',
                togglable: false,
              },
              {
                id: 'set-device-tablet',
                label: '<i class="fa-solid fa-tablet-screen-button"></i>',
                command: 'set-device-tablet',
                togglable: false,
              },
              {
                id: 'set-device-mobile',
                label: '<i class="fa-solid fa-mobile-screen"></i>',
                command: 'set-device-mobile',
                togglable: false,
              },
              {
                id:'preview-template',
                label:'<i class="fa-solid fa-eye"></i>',
                command:'preview-template',
              },

            ],
          },
         
        ]
      },

    });
    this.editor.Commands.add('toggle-fullscreen', {
      run: (editor: any, sender: any) => {
        const container = document.querySelector('.editor-canvas');
        if (container) {
          if (!document.fullscreenElement) {
            container.requestFullscreen().then(() => {
              editor.refresh();
              sender.set('active');
            });
          } else {
            document.exitFullscreen().then(() => {
              editor.refresh();
              sender.set('active', 0);
            });
          }
        }
      }
    });

  
    this.editor.Commands.add('preview-template', {
      run: (editor: any) => {
        
        const html = editor.getHtml();
        const css = `<style>${editor.getCss()}</style>`;
        const previewWindow = window.open('', '_blank');

        if (previewWindow) {
          previewWindow.document.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Preview</title>
              ${css}
            </head>
            <body>
              ${html}
            </body>
            </html>
          `);
          previewWindow.document.close();
        }
      }
    });

    this.editor.Commands.add('save-content', {
      run: (editor: any) => {
        const html = editor.getHtml();
        const css = editor.getCss();
        window.localStorage.setItem('gjs-html', html);
        window.localStorage.setItem('gjs-css', css);
        alert('Content saved!');
      }
    });

    this.editor.Commands.add('undo', {
      run: (editor: any) => {
        editor.UndoManager.undo();
      }
    });

    this.editor.Commands.add('redo', {
      run: (editor: any) => {
        editor.UndoManager.redo();
      }
    });

    this.editor.Commands.add('delete-page', {
      run: (editor: any) => {
        editor.DomComponents.clear();
      }
    });

    this.editor.Commands.add('set-device-desktop', {
      run: (editor: any) => editor.setDevice('Desktop'),
    });

    this.editor.Commands.add('set-device-tablet', {
      run: (editor: any) => editor.setDevice('Tablet'),
    });

    this.editor.Commands.add('set-device-mobile', {
      run: (editor: any) => editor.setDevice('Mobile'),
    });
  
    this.addCustomBlocks();
    this.showJsonCommand;
  }
  showJsonCommand = (editor: any) => {
    editor.Modal.setTitle('Components JSON')
      .setContent(`<textarea style="width:100%; height: 250px;">
        ${JSON.stringify(editor.getComponents())}
      </textarea>`)
      .open();
  };


  addCustomBlocks(): void {
    const blockManager = this.editor.BlockManager;

    blockManager.add('section', {
      label: `<b>Section</b>  
      <svg width="50" height="50" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="6.75" y="11.75" width="56.5" height="46.5" rx="3.25" stroke="white" stroke-width="3.5"/>
</svg>`,
      content: `
        <section>
          <h1>This is a simple title</h1>
          <div>This is just a Lorem text: Lorem ipsum dolor sit amet</div>
        </section>`,
      category: 'Basics',
      attributes: { class: 'gjs-block-section' }
    });

    blockManager.add('text', {
      label: `  
        <span>Text</span>
        <svg width="50" height="50" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M37.9167 55.4167H43.75C44.5235 55.4167 45.2654 55.724 45.8124 56.2709C46.3594 56.8179 46.6667 57.5598 46.6667 58.3333C46.6667 59.1069 46.3594 59.8488 45.8124 60.3957C45.2654 60.9427 44.5235 61.25 43.75 61.25H26.25C25.4765 61.25 24.7346 60.9427 24.1876 60.3957C23.6406 59.8488 23.3333 59.1069 23.3333 58.3333C23.3333 57.5598 23.6406 56.8179 24.1876 56.2709C24.7346 55.724 25.4765 55.4167 26.25 55.4167H32.0833V14.5833H14.5833V20.4167C14.5833 21.1902 14.276 21.9321 13.7291 22.4791C13.1821 23.026 12.4402 23.3333 11.6667 23.3333C10.8931 23.3333 10.1513 23.026 9.60427 22.4791C9.05729 21.9321 8.75 21.1902 8.75 20.4167V11.6667C8.75 10.8931 9.05729 10.1513 9.60427 9.60427C10.1513 9.05729 10.8931 8.75 11.6667 8.75H58.3333C59.1069 8.75 59.8488 9.05729 60.3957 9.60427C60.9427 10.1513 61.25 10.8931 61.25 11.6667V20.4167C61.25 21.1902 60.9427 21.9321 60.3957 22.4791C59.8488 23.026 59.1069 23.3333 58.3333 23.3333C57.5598 23.3333 56.8179 23.026 56.2709 22.4791C55.724 21.9321 55.4167 21.1902 55.4167 20.4167V14.5833H37.9167V55.4167Z" fill="white"/>
</svg>
     
    `, category: 'Basics',
      content: '<div data-gjs-type="text">Insert your text here</div>',
      attributes: { class: 'gjs-block-text' }
    });

    blockManager.add('image', {
      label: `<b> Image</b>
    <svg width="50" height="50" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.3633 52.9478L10.3119 53C9.61736 51.4601 9.18006 49.7114 9 47.78C9.18006 49.6853 9.66881 51.4079 10.3633 52.9478ZM26.8778 30.4236C28.5015 30.4236 30.0587 29.7691 31.2069 28.6042C32.355 27.4392 33 25.8592 33 24.2118C33 22.5643 32.355 20.9843 31.2069 19.8194C30.0587 18.6545 28.5015 18 26.8778 18C25.2541 18 23.6969 18.6545 22.5488 19.8194C21.4006 20.9843 20.7556 22.5643 20.7556 24.2118C20.7556 25.8592 21.4006 27.4392 22.5488 28.6042C23.6969 29.7691 25.2541 30.4236 26.8778 30.4236Z" fill="white"/>
<path d="M45.894 9H24.106C14.642 9 9 14.642 9 24.106V45.894C9 48.728 9.494 51.198 10.456 53.278C12.692 58.218 17.476 61 24.106 61H45.894C55.358 61 61 55.358 61 45.894V24.106C61 14.642 55.358 9 45.894 9ZM56.762 36.3C54.734 34.558 51.458 34.558 49.43 36.3L38.614 45.582C36.586 47.324 33.31 47.324 31.282 45.582L30.398 44.854C28.552 43.242 25.614 43.086 23.534 44.49L13.81 51.016C13.238 49.56 12.9 47.87 12.9 45.894V24.106C12.9 16.774 16.774 12.9 24.106 12.9H45.894C53.226 12.9 57.1 16.774 57.1 24.106V36.586L56.762 36.3Z" fill="white"/>
</svg>`,
      select: true,
      content: { type: 'image' },
      activate: true,
      category: 'Forms',
      attributes: { class: 'gjs-block-image' }
    });

    blockManager.add('three-column', {
      label: `<b>3 section</b> 
      <svg width="50" height="50" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="11.75" y="21.25" width="14.5" height="46.5" rx="3.25" transform="rotate(-90 11.75 21.25)" stroke="white" stroke-width="3.5"/>
<rect x="11.75" y="42.25" width="14.5" height="46.5" rx="3.25" transform="rotate(-90 11.75 42.25)" stroke="white" stroke-width="3.5"/>
<rect x="11.75" y="62.25" width="14.5" height="46.5" rx="3.25" transform="rotate(-90 11.75 62.25)" stroke="white" stroke-width="3.5"/>
</svg>`,
      content: `
        <div class="row">
          <div class="column" style="width: 33.33%">Column 1</div>
          <div class="column" style="width: 33.33%">Column 2</div>
          <div class="column" style="width: 33.33%">Column 3</div>
        </div>`,
      category: 'Layout',
      attributes: { class: 'gjs-block-3column' }
    });

    blockManager.add('grid', {
      label: `<b>Grid</b> 
      <svg width="50" height="50" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M26.6225 10H15.255C13.5966 10.0018 12.0067 10.6528 10.8341 11.8102C9.66144 12.9676 9.00184 14.5368 9 16.1735V27.3915C9 30.7951 11.8064 33.565 15.255 33.565H26.6211C30.0697 33.565 32.8761 30.7951 32.8761 27.3915V16.1735C32.8746 14.5369 32.2153 12.9677 31.0429 11.8103C29.8705 10.6529 28.2807 10.0018 26.6225 10ZM28.7075 27.3929C28.7075 28.5274 27.772 29.4507 26.6225 29.4507H15.255C14.1055 29.4507 13.17 28.5274 13.17 27.3929V16.1749C13.17 15.0403 14.1055 14.117 15.255 14.117H26.6211C27.7706 14.117 28.7061 15.0403 28.7061 16.1749L28.7075 27.3929ZM54.745 10H43.3775C41.7192 10.0018 40.1293 10.6528 38.9566 11.8102C37.784 12.9676 37.1244 14.5368 37.1225 16.1735V27.3915C37.1225 30.7951 39.9289 33.565 43.3775 33.565H54.745C58.1936 33.565 61 30.7951 61 27.3915V16.1735C61 12.7699 58.195 10 54.745 10ZM56.83 27.3929C56.83 28.5274 55.8945 29.4507 54.745 29.4507H43.3775C42.228 29.4507 41.2925 28.5274 41.2925 27.3929V16.1749C41.2925 15.0403 42.228 14.117 43.3775 14.117H54.745C55.8945 14.117 56.83 15.0403 56.83 16.1749V27.3929ZM26.6225 36.435H15.255C13.5966 36.4368 12.0067 37.0878 10.8341 38.2452C9.66144 39.4026 9.00184 40.9718 9 42.6085V53.8265C9 57.2301 11.8064 60 15.255 60H26.6211C30.0697 60 32.8761 57.2301 32.8761 53.8265V42.6085C32.875 40.9718 32.2158 39.4024 31.0433 38.2449C29.8708 37.0874 28.2808 36.4365 26.6225 36.435ZM28.7075 53.8265C28.7075 54.961 27.772 55.8843 26.6225 55.8843H15.255C14.1055 55.8843 13.17 54.961 13.17 53.8265V42.6085C13.17 41.474 14.1055 40.5507 15.255 40.5507H26.6211C27.7706 40.5507 28.7061 41.474 28.7061 42.6085L28.7075 53.8265ZM54.745 36.435H43.3775C41.7192 36.4368 40.1293 37.0878 38.9566 38.2452C37.784 39.4026 37.1244 40.9718 37.1225 42.6085V53.8265C37.1225 57.2301 39.9289 60 43.3775 60H51.8705C52.4234 60 52.9538 59.7832 53.3448 59.3973C53.7358 59.0114 53.9555 58.4879 53.9555 57.9422C53.9555 57.3964 53.7358 56.873 53.3448 56.487C52.9538 56.1011 52.4234 55.8843 51.8705 55.8843H43.3775C42.228 55.8843 41.2925 54.961 41.2925 53.8265V42.6085C41.2925 41.474 42.228 40.5507 43.3775 40.5507H54.745C55.8945 40.5507 56.83 41.474 56.83 42.6085V52.0115C56.83 52.5572 57.0497 53.0807 57.4407 53.4666C57.8317 53.8525 58.362 54.0693 58.915 54.0693C59.468 54.0693 59.9983 53.8525 60.3893 53.4666C60.7803 53.0807 61 52.5572 61 52.0115V42.6085C61 39.2035 58.195 36.435 54.745 36.435Z" fill="white"/>
</svg>`,
      icon: '<i class="fa-solid fa-table-cells" style="color: #e6ebf4;"></i>',
      content: `
        <div class="grid-container">
          <div class="grid-item">1</div>
          <div class="grid-item">2</div>
          <div class="grid-item">3</div>
          <div class="grid-item">4</div>
          <div class="grid-item">5</div>
          <div class="grid-item">6</div>
        </div>`,
      category: 'Layout',
      attributes: { class: 'gjs-block-grid', title: 'Grid' }
    });

    blockManager.add('form', {
      label: `<b>Form</b> <svg width="50" height="50" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_894_53)">
<mask id="mask0_894_53" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="-3" y="-3" width="76" height="76">
<path d="M-1.25 -1.25H71.25V71.25H-1.25V-1.25Z" fill="white" stroke="black" stroke-width="3.5"/>
</mask>
<g mask="url(#mask0_894_53)">
<mask id="mask1_894_53" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="5" y="5" width="60" height="60">
<path d="M62.5585 62.5645V7.43567H7.42969V62.5645H62.5585Z" fill="white" stroke="white" stroke-width="3.5"/>
</mask>
<g mask="url(#mask1_894_53)">
<path d="M26.2942 62.0254H21.0268C17.2323 62.0254 14.1562 58.9493 14.1562 55.1548V14.8475C14.1562 11.053 17.2323 7.97698 21.0268 7.97698H49.1834C52.9779 7.97698 56.054 11.053 56.054 14.8475V28.4742" stroke="white" stroke-width="3.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M23.2969 21.7188H46.8858" stroke="white" stroke-width="3.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M23.2969 30.8789H37.7378" stroke="white" stroke-width="3.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M23.2969 40.0391H32.8139" stroke="white" stroke-width="3.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M41.8672 41.5245C41.8672 37.8565 44.8408 34.8829 48.5087 34.8829C52.1767 34.8829 55.1503 37.8565 55.1503 41.5245C55.1503 45.1926 52.1767 48.166 48.5087 48.166C44.8408 48.166 41.8672 45.1926 41.8672 41.5245Z" stroke="white" stroke-width="3.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M48.5122 48.2347C55.141 48.2347 60.6742 52.939 61.9741 59.2002V59.1698C62.2762 60.6257 61.1773 62.0254 59.6943 62.0254H37.33C35.847 62.0254 34.7481 60.6562 35.0502 59.2002C36.3501 52.939 41.8833 48.2347 48.5122 48.2347Z" stroke="white" stroke-width="3.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</g>
</g>
</g>
<defs>
<clipPath id="clip0_894_53">
<rect width="70" height="70" fill="white"/>
</clipPath>
</defs>
</svg>`,
      content: `
        <form>
          <label for="fname">First Name</label><br>
          <input type="text" id="fname" name="fname"><br>
          <label for="lname">Last Name</label><br>
          <input type="text" id="lname" name="lname"><br><br>
          <input type="submit" value="Submit">
        </form>`,
      category: 'Forms',
      attributes: { class: 'gjs-block-form' }
    });

    blockManager.add('button', {
      label: `<b>Button</b>
      <svg width="50" height="50" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="5.75" y="47.25" width="24.5" height="58.5" rx="3.25" transform="rotate(-90 5.75 47.25)" stroke="white" stroke-width="3.5"/>
<path d="M15 35H56" stroke="black" stroke-width="3.5" stroke-linecap="round"/>
</svg>
`,
      category: 'Forms',
      content: '<button class="btn">Click Me</button>',
      attributes: { class: 'gjs-block-button' },
    });


    blockManager.add('list', {
      label: ` <b>List</b>
      <svg width="50" height="50" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M24.0147 13.4707H18.6324C15.6598 13.4707 13.25 15.8805 13.25 18.8531V24.2354C13.25 27.208 15.6598 29.6178 18.6324 29.6178H24.0147C26.9873 29.6178 29.3971 27.208 29.3971 24.2354V18.8531C29.3971 15.8805 26.9873 13.4707 24.0147 13.4707Z" stroke="white" stroke-width="3.5"/>
<path d="M24.0147 40.3828H18.6324C15.6598 40.3828 13.25 42.7926 13.25 45.7652V51.1475C13.25 54.1201 15.6598 56.5299 18.6324 56.5299H24.0147C26.9873 56.5299 29.3971 54.1201 29.3971 51.1475V45.7652C29.3971 42.7926 26.9873 40.3828 24.0147 40.3828Z" stroke="white" stroke-width="3.5"/>
<path d="M37.4688 16.1621H58.9982M37.4688 43.0739H58.9982M37.4688 24.2356H48.2335M37.4688 51.1474H48.2335" stroke="white" stroke-width="3.5"/>
</svg>`,
      content: `
        <ul>
          <li>List item 1</li>
          <li>List item 2</li>
          <li>List item 3</li>
        </ul>`,
      category: 'Basic',
      attributes: { class: 'gjs-block-list' }
    });
    blockManager.add('1-2-section', {
      label: `<b>1/2 Column</b> <svg width="50" height="50" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="38.75" y="11.75" width="24.5" height="46.5" rx="3.25" stroke="white" stroke-width="3.5"/>
<rect x="6.75" y="11.75" width="24.5" height="46.5" rx="3.25" stroke="white" stroke-width="3.5"/>
</svg>`,
      category: "Basics",
      content: `
        <div class="row" style="display: flex; width: 100%;">
          <div class="column" style="flex: 1; padding: 10px; background-color: #f9f9f9;">Left Column</div>
          <div class="column" style="flex: 1; padding: 10px; background-color: #f9f9f9;">Right Column</div>
        </div>`,
      attributes: { class: 'gjs-block-1-2-section' }
    });

    // 1/3 Section Block
    blockManager.add('1-3-section', {
      label: `<b>1/3 Column</b> <svg width="50" height="50" viewBox="0 0 70 70" fill="white" xmlns="http://www.w3.org/2000/svg">
<rect x="48.75" y="11.75" width="14.5" height="46.5" rx="3.25" stroke="white" stroke-width="3.5"/>
<rect x="27.75" y="11.75" width="14.5" height="46.5" rx="3.25" stroke="white" stroke-width="3.5"/>
<rect x="6.75" y="11.75" width="14.5" height="46.5" rx="3.25" stroke="white" stroke-width="3.5"/>
</svg>`,
      content: `
        <div class="row" style="display: flex; width: 100%;">
          <div class="column" style="flex: 1; padding: 10px; background-color: #f0f0f0;">Column 1</div>
          <div class="column" style="flex: 1; padding: 10px; background-color: #e0e0e0;">Column 2</div>
          <div class="column" style="flex: 1; padding: 10px; background-color: #d0d0d0;">Column 3</div>
        </div>`,
      category: 'Basic',
      attributes: { class: 'gjs-block-1-3-section' }
    });

    // YouTube Block
    blockManager.add('youtube', {
      label: `<b>YouTube</b> <svg width="50" height="50" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M44.2011 33.5866L30.6011 25.2532C30.3438 25.0956 30.0481 25.0084 29.7447 25.0006C29.4414 24.9928 29.1414 25.0647 28.876 25.2089C28.6106 25.3532 28.3894 25.5644 28.2354 25.8207C28.0813 26.077 28.0001 26.3691 28 26.6666V43.3333C28 43.6308 28.0812 43.9229 28.2353 44.1793C28.3893 44.4356 28.6105 44.6468 28.8759 44.7911C29.1413 44.9353 29.4413 45.0072 29.7446 44.9994C30.048 44.9916 30.3437 44.9043 30.601 44.7467L44.2009 36.4133C44.4455 36.2635 44.6471 36.0552 44.7869 35.8079C44.9266 35.5607 45 35.2827 45 35C45 34.7173 44.9267 34.4393 44.7869 34.192C44.6472 33.9448 44.4456 33.7364 44.2011 33.5866ZM31.4001 40.3262V29.6736L40.0925 34.9999L31.4001 40.3262Z" fill="white"/>
<path d="M55.5039 13H14.4961C9.81135 13 6 16.7958 6 21.4615V48.5385C6 53.2042 9.81135 57 14.4961 57H55.5039C60.1887 57 64 53.2042 64 48.5385V21.4615C64 16.7958 60.1887 13 55.5039 13ZM60.6016 48.5385C60.6016 51.3379 58.3148 53.6154 55.5039 53.6154H14.4961C11.6852 53.6154 9.39844 51.3379 9.39844 48.5385V21.4615C9.39844 18.6621 11.6852 16.3846 14.4961 16.3846H55.5039C58.3148 16.3846 60.6016 18.6621 60.6016 21.4615V48.5385Z" fill="white"/>
</svg>`,
      content: `
        <div style="position: relative; padding-bottom: 56.25%; height: 0;">
          <iframe width="560" height="315" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe>
        </div>`,
      category: 'Basic',
      attributes: { class: 'gjs-block-youtube' }
    });

    // Map Block
    blockManager.add('map', {
      label: `<b>Map</b>
      <svg width="50" height="50" viewBox="0 0 70 70" fill="white" xmlns="http://www.w3.org/2000/svg">
<path d="M61.2464 31.4994C60.2804 31.4994 59.4963 32.2835 59.4963 33.2496V53.0681L45.4952 58.6685V40.2501C45.4952 39.284 44.7111 38.5 43.7451 38.5C42.779 38.5 41.9949 39.284 41.9949 40.2501V58.665L27.9938 53.0646V25.3354L36.104 28.5802C36.9895 28.9372 38.0186 28.5032 38.3791 27.6036C38.7397 26.7075 38.3021 25.689 37.4026 25.3284L26.9262 21.1351H26.9227L26.8947 21.1246C26.4782 20.9566 26.0127 20.9566 25.5961 21.1246L25.5646 21.1351H25.5611L8.09127 28.1252C7.76689 28.2552 7.48886 28.4794 7.29298 28.7689C7.0971 29.0583 6.99234 29.3998 6.99219 29.7493V61.2517C6.99219 61.8328 7.28271 62.3753 7.76225 62.7009C8.05125 62.8974 8.3928 63.0024 8.74232 63.0019C8.96284 63.0019 9.18336 62.9599 9.39338 62.8759L26.2437 56.1378L43.0625 62.8654H43.066L43.0975 62.8794C43.5141 63.0474 43.9795 63.0474 44.3961 62.8794L44.4276 62.8654H44.4311L61.901 55.8788C62.559 55.6093 62.9966 54.9688 62.9966 54.2512V33.2496C62.9966 32.2835 62.2125 31.4994 61.2464 31.4994ZM24.4936 53.0646L10.4925 58.665V30.9324L24.4936 25.3319V53.0646ZM50.7456 13.998C47.8509 13.998 45.4952 16.3537 45.4952 19.2485C45.4952 22.1432 47.8509 24.4989 50.7456 24.4989C53.6403 24.4989 55.996 22.1432 55.996 19.2485C55.996 16.3537 53.6403 13.998 50.7456 13.998ZM50.7456 20.9986C49.7795 20.9986 48.9955 20.2145 48.9955 19.2485C48.9955 18.2824 49.7795 17.4983 50.7456 17.4983C51.7117 17.4983 52.4957 18.2824 52.4957 19.2485C52.4957 20.2145 51.7117 20.9986 50.7456 20.9986Z" fill="white"/>
<path d="M50.751 6.99609C43.9954 6.99609 38.5 12.4915 38.5 19.2471C38.5 25.5335 48.3288 36.6679 49.4489 37.9175C49.7814 38.285 50.2539 38.4986 50.751 38.4986C51.248 38.4986 51.7205 38.285 52.0531 37.9175C53.1732 36.6679 63.0019 25.5335 63.0019 19.2471C63.0019 12.4915 57.5065 6.99609 50.751 6.99609ZM50.751 34.0777C46.9287 29.5449 42.0003 22.5863 42.0003 19.2471C42.0003 14.4237 45.9276 10.4964 50.751 10.4964C55.5743 10.4964 59.5016 14.4237 59.5016 19.2471C59.5016 22.5828 54.5733 29.5449 50.751 34.0777Z" fill="white"/>
</svg> 
      `,
      content: `
        <div style="width: 100%; height: 300px;">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345087284!2d144.95373631531612!3d-37.81627997975184!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f10e6b7%3A0x5045675218ce6c0!2sMelbourne%20City%20Centre!5e0!3m2!1sen!2sau!4v1622843445760!5m2!1sen!2sau"
            style="border:0; width: 100%; height: 100%;" allowfullscreen="" loading="lazy"></iframe>
        </div>`,
      category: 'Basic',
      attributes: { class: 'gjs-block-map' }
    });

    // Hero Section Block
    blockManager.add('hero-section', {
      icon: '<i class="fa-regular fa-square"></i>',
      label: `<b>Hero Section</b>
      <svg width="50" height="50" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M65.3516 10.2129H62.3891C61.7829 8.35064 60.0313 7 57.9688 7H12.0312C9.96871 7 8.21707 8.35064 7.61086 10.2129H4.64844C2.08551 10.2129 0 12.2984 0 14.8613V40.1543C0 42.7172 2.08551 44.8027 4.64844 44.8027H7.61086C8.21707 46.665 9.96871 48.0156 12.0312 48.0156H28.6196C29.3747 48.0156 29.9868 47.4035 29.9868 46.6484C29.9868 45.8933 29.3747 45.2812 28.6196 45.2812H12.0312C10.9759 45.2812 10.1172 44.4225 10.1172 43.3672V11.6484C10.1172 10.5931 10.9759 9.73438 12.0312 9.73438H57.9688C59.0241 9.73438 59.8828 10.5931 59.8828 11.6484V43.3672C59.8828 44.4225 59.0241 45.2812 57.9688 45.2812H41.5171C40.762 45.2812 40.1499 45.8933 40.1499 46.6484C40.1499 47.4035 40.762 48.0156 41.5171 48.0156H57.9688C60.0313 48.0156 61.7829 46.665 62.3891 44.8027H65.3516C67.9145 44.8027 70 42.7172 70 40.1543V14.8613C70 12.2984 67.9145 10.2129 65.3516 10.2129ZM2.73438 40.1543V14.8613C2.73438 13.806 3.59311 12.9473 4.64844 12.9473H7.38281V42.0684H4.64844C3.59311 42.0684 2.73438 41.2096 2.73438 40.1543ZM67.2656 40.1543C67.2656 41.2096 66.4069 42.0684 65.3516 42.0684H62.6172V12.9473H65.3516C66.4069 12.9473 67.2656 13.806 67.2656 14.8613V40.1543Z" fill="white"/>
<path d="M52.4306 31.4233C52.6976 31.6904 53.0475 31.8233 53.3972 31.8233C53.7469 31.8233 54.0969 31.6904 54.3638 31.4233L57.2948 28.4924C57.8289 27.9584 57.8289 27.0926 57.2948 26.5586L54.3639 23.6276C53.8299 23.0942 52.9646 23.0942 52.4307 23.6276C51.8966 24.1617 51.8966 25.0274 52.4307 25.5615L54.3943 27.5252L52.4306 29.4895C51.8966 30.0235 51.8966 30.8892 52.4306 31.4233ZM17.5695 23.6276C17.0355 23.0942 16.1702 23.0942 15.6356 23.6276L12.7053 26.5586C12.1711 27.0926 12.1711 27.9584 12.7053 28.4924L15.6356 31.4233C15.9026 31.6904 16.253 31.8239 16.6029 31.8239C16.9527 31.8239 17.3025 31.6904 17.5695 31.4233C18.103 30.8892 18.103 30.0235 17.5695 29.4895L15.6051 27.5259L17.5694 25.5617C18.1034 25.0275 18.1034 24.1618 17.5694 23.6278L17.5695 23.6276ZM17.962 53.2113C15.2479 53.2113 13.0401 55.419 13.0401 58.1331C13.0401 60.8473 15.2479 63.055 17.962 63.055C20.676 63.055 22.8839 60.8473 22.8839 58.1331C22.8839 55.419 20.676 53.2113 17.962 53.2113ZM17.962 60.3206C16.7561 60.3206 15.7745 59.339 15.7745 58.1331C15.7745 56.9273 16.7561 55.9456 17.962 55.9456C19.1684 55.9456 20.1495 56.9273 20.1495 58.1331C20.1495 59.339 19.1684 60.3206 17.962 60.3206ZM35 53.2113C32.2859 53.2113 30.0782 55.419 30.0782 58.1331C30.0782 60.8473 32.2859 63.055 35 63.055C37.7142 63.055 39.9219 60.8473 39.9219 58.1331C39.9219 55.419 37.7142 53.2113 35 53.2113ZM35 60.3206C33.7942 60.3206 32.8125 59.339 32.8125 58.1331C32.8125 56.9273 33.7942 55.9456 35 55.9456C36.2059 55.9456 37.1875 56.9273 37.1875 58.1331C37.1875 59.339 36.2059 60.3206 35 60.3206ZM52.0381 53.2113C49.3241 53.2113 47.1162 55.419 47.1162 58.1331C47.1162 60.8473 49.3241 63.055 52.0381 63.055C54.7522 63.055 56.9599 60.8473 56.9599 58.1331C56.9599 55.419 54.7522 53.2113 52.0381 53.2113ZM52.0381 60.3206C50.8317 60.3206 49.8506 59.339 49.8506 58.1331C49.8506 56.9273 50.8317 55.9456 52.0381 55.9456C53.2439 55.9456 54.2256 56.9273 54.2256 58.1331C54.2256 59.339 53.2439 60.3206 52.0381 60.3206ZM35.9666 47.6154C36.2209 47.3611 36.3672 47.0082 36.3672 46.6488C36.3672 46.2893 36.2209 45.9365 35.9666 45.6822C35.7096 45.4268 35.3624 45.2828 35 45.2816C34.6391 45.2816 34.2877 45.4279 34.0334 45.6822C33.7791 45.9365 33.6328 46.2893 33.6328 46.6488C33.6328 47.0082 33.7791 47.3611 34.0334 47.6154C34.2877 47.8697 34.6406 48.0159 35 48.0159C35.3595 48.0159 35.7123 47.8697 35.9666 47.6154Z" fill="white"/>
</svg>
`,
      content: `
        <section style="background-image: url('https://via.placeholder.com/800'); height: 400px; display: flex; align-items: center; justify-content: center; color: white; text-align: center;">
          <h1>Hero Title</h1>
          <p>Your catchy subtitle goes here.</p>
        </section>`,
      category: 'Basic',
      attributes: { class: 'gjs-block-hero-section' }
    });

    // Quote Block
    blockManager.add('quote', {
      label: `<b>Quote</b>
      <svg width="50" height="50" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18.0763 40.8164C16.8937 43.7904 15.0253 46.7357 12.5234 49.5697C12.1362 50.003 11.9019 50.5508 11.8564 51.1293C11.8109 51.7079 11.9566 52.2853 12.2714 52.7735C12.5763 53.2588 13.0326 53.6308 13.5701 53.8325C14.1076 54.0341 14.6966 54.0543 15.2467 53.8899C20.5495 52.3445 32.9207 46.856 33.2519 29.3152C33.3797 22.5415 28.4118 16.7227 21.9427 16.0658C20.1805 15.8878 18.4005 16.079 16.7168 16.627C15.033 17.175 13.4827 18.0677 12.1652 19.248C10.8552 20.4296 9.80779 21.8716 9.09043 23.4812C8.37307 25.0908 8.00163 26.8323 8 28.5936C8 34.5219 12.221 39.7072 18.0763 40.8164ZM14.5789 21.9115C16.2306 20.4106 18.3868 19.5818 20.6215 19.589C20.9383 19.589 21.2587 19.607 21.5791 19.6393C26.1996 20.1059 29.7456 24.3274 29.652 29.247C29.4234 41.3836 22.8319 46.8488 17.3743 49.2933C19.1023 46.9637 20.4577 44.5676 21.4243 42.1392C21.61 41.6726 21.691 41.1711 21.6614 40.67C21.6319 40.1689 21.4926 39.6804 21.2533 39.2387C20.9989 38.7716 20.645 38.3656 20.2165 38.0493C19.788 37.7331 19.2953 37.5142 18.7729 37.408C16.747 36.9769 14.9303 35.867 13.6252 34.2629C12.3201 32.6588 11.6054 30.6574 11.6 28.5919C11.6 26.0522 12.6854 23.6166 14.5789 21.9097V21.9115ZM41.0189 52.7735C41.3237 53.2584 41.7797 53.6302 42.3168 53.8318C42.8539 54.0335 43.4426 54.0539 43.9924 53.8899C49.2952 52.3445 61.6647 46.856 61.9977 29.3152C62.1237 22.5397 57.1557 16.7227 50.6866 16.0658C48.9246 15.8858 47.1443 16.076 45.4606 16.6241C43.7768 17.1722 42.227 18.0661 40.9109 19.248C39.6009 20.4296 38.5535 21.8716 37.8361 23.4812C37.1188 25.0908 36.7473 26.8323 36.7457 28.5936C36.7457 34.5219 40.9649 39.7072 46.8202 40.8164C45.6376 43.794 43.7692 46.7393 41.2673 49.5697C40.8801 50.0031 40.6461 50.5512 40.6012 51.1298C40.5564 51.7085 40.7031 52.2859 41.0189 52.7735ZM50.1682 42.141C50.3541 41.6745 50.4353 41.1731 50.406 40.672C50.3768 40.171 50.2379 39.6823 49.999 39.2405C49.7449 38.7728 49.3912 38.3662 48.9627 38.0493C48.5342 37.7324 48.0413 37.5129 47.5186 37.4062C45.4933 36.9753 43.6771 35.8659 42.372 34.2625C41.067 32.6592 40.3519 30.6586 40.3457 28.5936C40.3457 26.0522 41.4311 23.6184 43.3246 21.9115C44.9758 20.4108 47.1313 19.5821 49.3654 19.589C49.6822 19.589 50.0026 19.607 50.323 19.6393C54.9435 20.1059 58.4913 24.3274 58.3977 29.247C58.1691 41.3853 51.5758 46.8488 46.12 49.2933C47.8462 46.9655 49.1998 44.5694 50.1682 42.141Z" fill="white"/>
</svg>`,
      content: `<blockquote style="font-style: italic; border-left: 2px solid #ccc; padding-left: 10px;">"This is a sample quote."</blockquote>`,
      category: 'Basic',
      attributes: { class: 'gjs-block-quote' }
    });

    // Link Block
    blockManager.add('link', {
      label: `<b>Link</b>
      <svg width="50" height="50" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M39.6431 32.5473C39.3558 32.5479 39.0712 32.4915 38.8058 32.3815C38.5403 32.2715 38.2993 32.11 38.0966 31.9064C34.6852 28.495 29.1344 28.4939 25.7219 31.9064C25.5201 32.1153 25.2787 32.282 25.0118 32.3966C24.7449 32.5113 24.4579 32.5716 24.1674 32.5741C23.877 32.5766 23.5889 32.5213 23.3201 32.4113C23.0513 32.3013 22.807 32.1389 22.6016 31.9335C22.3963 31.7281 22.2338 31.4839 22.1238 31.215C22.0138 30.9462 21.9585 30.6582 21.961 30.3677C21.9635 30.0772 22.0239 29.7902 22.1385 29.5233C22.2532 29.2564 22.4198 29.0151 22.6288 28.8133C27.7464 23.6945 36.0731 23.6956 41.1897 28.8133C41.4955 29.1192 41.7038 29.5089 41.7882 29.9332C41.8725 30.3575 41.8292 30.7972 41.6637 31.1969C41.4981 31.5965 41.2178 31.9381 40.8582 32.1785C40.4985 32.4189 40.0757 32.5472 39.6431 32.5473ZM38.0966 45.0259C34.7355 45.0259 31.3744 43.7462 28.8161 41.1879C28.6072 40.9862 28.4405 40.7448 28.3259 40.4779C28.2112 40.211 28.1509 39.924 28.1484 39.6335C28.1458 39.3431 28.2012 39.055 28.3112 38.7862C28.4212 38.5173 28.5836 38.2731 28.789 38.0677C28.9944 37.8623 29.2386 37.6999 29.5074 37.5899C29.7763 37.4799 30.0643 37.4246 30.3548 37.4271C30.6452 37.4296 30.9323 37.49 31.1992 37.6046C31.4661 37.7192 31.7074 37.8859 31.9092 38.0948C35.3206 41.5062 40.8714 41.5073 44.2839 38.0948C44.4857 37.8859 44.7271 37.7192 44.994 37.6046C45.2609 37.49 45.5479 37.4296 45.8383 37.4271C46.1288 37.4246 46.4168 37.4799 46.6857 37.5899C46.9545 37.6999 47.1988 37.8623 47.4042 38.0677C47.6095 38.2731 47.772 38.5173 47.882 38.7862C47.9919 39.055 48.0473 39.3431 48.0448 39.6335C48.0422 39.924 47.9819 40.211 47.8673 40.4779C47.7526 40.7448 47.586 40.9862 47.377 41.1879C46.159 42.4072 44.7122 43.3739 43.1196 44.0325C41.527 44.6911 39.82 45.0287 38.0966 45.0259Z" fill="white"/>
<path d="M45.8261 41.8277C45.3935 41.8276 44.9707 41.6993 44.611 41.4589C44.2514 41.2185 43.9711 40.8769 43.8056 40.4773C43.64 40.0776 43.5967 39.6378 43.6811 39.2136C43.7654 38.7893 43.9737 38.3996 44.2795 38.0936L56.4989 25.8743C56.7007 25.6653 56.9421 25.4987 57.209 25.384C57.4758 25.2694 57.7629 25.2091 58.0533 25.2065C58.3438 25.204 58.6318 25.2594 58.9007 25.3693C59.1695 25.4793 59.4138 25.6418 59.6191 25.8472C59.8245 26.0525 59.987 26.2968 60.097 26.5656C60.2069 26.8345 60.2623 27.1225 60.2598 27.413C60.2572 27.7034 60.1969 27.9905 60.0823 28.2573C59.9676 28.5242 59.801 28.7656 59.592 28.9674L47.3727 41.1868C47.1699 41.3904 46.9289 41.5519 46.6635 41.6619C46.398 41.7719 46.1134 41.8282 45.8261 41.8277ZM27.4205 60.2333C26.9879 60.2332 26.5651 60.1049 26.2054 59.8645C25.8458 59.6242 25.5655 59.2825 25.3999 58.8829C25.2344 58.4832 25.1911 58.0435 25.2754 57.6192C25.3598 57.1949 25.5681 56.8052 25.8739 56.4993L32.7044 49.6688C32.9062 49.4599 33.1475 49.2932 33.4144 49.1786C33.6813 49.0639 33.9684 49.0036 34.2588 49.0011C34.5493 48.9985 34.8373 49.0539 35.1062 49.1639C35.375 49.2739 35.6192 49.4363 35.8246 49.6417C36.03 49.8471 36.1924 50.0913 36.3024 50.3601C36.4124 50.629 36.4678 50.917 36.4652 51.2075C36.4627 51.4979 36.4024 51.785 36.2877 52.0519C36.1731 52.3188 36.0064 52.5601 35.7975 52.7619L28.967 59.5924C28.7643 59.796 28.5233 59.9575 28.2578 60.0675C27.9924 60.1775 27.7078 60.2339 27.4205 60.2333ZM11.9527 44.7655C11.5201 44.7654 11.0972 44.6371 10.7376 44.3967C10.3779 44.1563 10.0976 43.8147 9.93211 43.4151C9.76658 43.0154 9.72327 42.5757 9.80763 42.1514C9.892 41.7271 10.1003 41.3374 10.4061 41.0315L22.6255 28.8132C22.8273 28.6042 23.0686 28.4376 23.3355 28.323C23.6024 28.2083 23.8895 28.148 24.1799 28.1454C24.4704 28.1429 24.7584 28.1983 25.0272 28.3083C25.2961 28.4182 25.5403 28.5807 25.7457 28.7861C25.9511 28.9915 26.1135 29.2357 26.2235 29.5045C26.3335 29.7734 26.3889 30.0614 26.3863 30.3519C26.3838 30.6423 26.3235 30.9294 26.2088 31.1962C26.0942 31.4631 25.9275 31.7045 25.7186 31.9063L13.4992 44.1246C13.0716 44.5511 12.5116 44.7655 11.9527 44.7655ZM35.7472 20.9721C35.3146 20.972 34.8918 20.8436 34.5321 20.6033C34.1725 20.3629 33.8922 20.0213 33.7266 19.6216C33.5611 19.222 33.5178 18.7822 33.6022 18.358C33.6865 17.9337 33.8948 17.5439 34.2006 17.238L41.0311 10.4065C41.4414 9.99614 41.9979 9.76562 42.5782 9.76562C43.1585 9.76562 43.715 9.99614 44.1253 10.4065C44.5356 10.8168 44.7661 11.3733 44.7661 11.9536C44.7661 12.5338 44.5356 13.0904 44.1253 13.5007L37.2948 20.3322C36.8841 20.7421 36.3275 20.9722 35.7472 20.9721Z" fill="white"/>
<path d="M19.6867 63.3656C16.3037 63.3656 12.9208 62.1078 10.4062 59.5922C5.375 54.5609 5.375 46.0614 10.4062 41.0302C10.608 40.8212 10.8494 40.6546 11.1163 40.5399C11.3832 40.4253 11.6702 40.3649 11.9607 40.3624C12.2511 40.3599 12.5392 40.4152 12.808 40.5252C13.0769 40.6352 13.3211 40.7976 13.5265 41.003C13.7319 41.2084 13.8943 41.4527 14.0043 41.7215C14.1143 41.9903 14.1696 42.2784 14.1671 42.5688C14.1646 42.8593 14.1042 43.1463 13.9896 43.4132C13.875 43.6801 13.7083 43.9215 13.4994 44.1233C10.1459 47.4767 10.1459 53.1445 13.4994 56.498C16.8528 59.8514 22.5206 59.8514 25.8741 56.498C26.0759 56.289 26.3172 56.1224 26.5841 56.0077C26.851 55.8931 27.138 55.8328 27.4285 55.8302C27.719 55.8277 28.007 55.8831 28.2758 55.993C28.5447 56.103 28.7889 56.2655 28.9943 56.4709C29.1997 56.6762 29.3621 56.9205 29.4721 57.1893C29.5821 57.4582 29.6374 57.7462 29.6349 58.0367C29.6324 58.3271 29.5721 58.6142 29.4574 58.881C29.3428 59.1479 29.1761 59.3893 28.9672 59.5911C26.4527 62.1078 23.0697 63.3656 19.6867 63.3656ZM58.0456 29.6081C57.613 29.608 57.1902 29.4797 56.8306 29.2393C56.4709 28.9989 56.1906 28.6573 56.0251 28.2577C55.8596 27.858 55.8162 27.4183 55.9006 26.994C55.985 26.5697 56.1932 26.18 56.4991 25.8741C59.8525 22.5206 59.8525 16.8528 56.4991 13.4994C53.1456 10.1459 47.4778 10.1459 44.1244 13.4994C43.9226 13.7083 43.6812 13.875 43.4143 13.9896C43.1474 14.1042 42.8604 14.1646 42.5699 14.1671C42.2795 14.1696 41.9914 14.1143 41.7226 14.0043C41.4538 13.8943 41.2095 13.7319 41.0041 13.5265C40.7987 13.3211 40.6363 13.0769 40.5263 12.808C40.4163 12.5392 40.361 12.2511 40.3635 11.9607C40.366 11.6702 40.4264 11.3832 40.541 11.1163C40.6557 10.8494 40.8223 10.608 41.0312 10.4062C46.0625 5.375 54.562 5.375 59.5933 10.4062C64.6245 15.4375 64.6245 23.937 59.5933 28.9683C59.1656 29.3948 58.6056 29.6081 58.0456 29.6081Z" fill="white"/>
</svg>`,
      content: `<a href="#" style="color: blue; text-decoration: underline;">Click Here</a>`,
      category: 'Basic',
      attributes: { class: 'gjs-block-link' }
    });

    // Text Section Block
    blockManager.add('text-section', {
      label: `<b>Text Section</b>
      <svg width="50" height="50" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M67.2656 56.3281V61.7969C67.2656 64.8171 64.8171 67.2656 61.7969 67.2656H56.3281M2.73438 56.3281V61.7969C2.73438 64.8171 5.18287 67.2656 8.20312 67.2656H13.6719M2.73438 13.6719V8.20312C2.73438 5.18287 5.18287 2.73438 8.20312 2.73438H13.6719M67.2656 13.6719V8.20312C67.2656 5.18287 64.8171 2.73438 61.7969 2.73438H56.3281M13.125 18.5938V13.125H35V18.5938M24.0625 35V13.125M18.5938 35H29.5312M13.125 45.9375H56.875M13.125 56.875H56.875M45.9375 35H56.875M45.9375 24.0625H56.875M45.9375 13.125H56.875" stroke="white" stroke-width="3" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
      content: `<div style="padding: 10px; font-size: 16px;">Insert your text here.</div>`,
      category: 'Basic',
      attributes: { class: 'gjs-block-text-section' }
    });

    blockManager.add('divider', {
      label: `<b>Divider</b> 
      <svg width="50" height="50" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="5.75" y="28.25" width="18.5" height="58.5" rx="3.25" transform="rotate(-90 5.75 28.25)" stroke="white" stroke-width="3.5"/>
<rect x="5.75" y="60.25" width="18.5" height="58.5" rx="3.25" transform="rotate(-90 5.75 60.25)" stroke="white" stroke-width="3.5"/>
<path d="M15 35H56" stroke="white" stroke-width="3.5" stroke-linecap="round"/>
</svg>
`,
      category: 'Basic',
      content: '<hr/>',
      attributes: { class: 'gjs-block-divider' },
    });


  }

  toggleBlocks(): void {
    this.blocksVisible = !this.blocksVisible;
    this.stylesVisible = false;
    this.layersVisible = false;
  }

  toggleStyles(): void {
    this.stylesVisible = !this.stylesVisible;
    this.blocksVisible = false;
    this.layersVisible = false;
  }

  toggleLayers(): void {
    this.layersVisible = !this.layersVisible;
    this.blocksVisible = false;
    this.stylesVisible = false;
  }

  previewTemplate() {
    this.editor.runCommand('preview-template');
  }

}



