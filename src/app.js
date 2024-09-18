import Viewer from 'bpmn-js/lib/NavigatedViewer';
import Modeler from 'bpmn-js/lib/Modeler';

import { layoutProcess } from 'bpmn-auto-layout';

import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';

import './app.css';

import diagram from './diagram.bpmn';

const modeler = new Modeler({
  container: '#modeler',
  keyboard: {
    bindTo: document,
  },
});

const viewer = new Viewer({
  container: '#viewer',
});

const title = document.createElement('div');

title.textContent = 'Auto layout';

title.className = 'title';

viewer.get('canvas').getContainer().appendChild(title);

const update = async () => {
  const { xml } = await modeler.saveXML({ format: true });

  const xmlWithLayout = await layoutProcess(xml);

  viewer
    .importXML(xmlWithLayout)
    .then(({ warnings }) => {
      if (warnings.length) {
        console.log(warnings);
      }

      const canvas = viewer.get('canvas');

      canvas.zoom('fit-viewport');
    })
    .catch((err) => {
      console.log(err);
    });
};

modeler.on([ 'import.done', 'elements.changed' ], update);

modeler
  .importXML(diagram)
  .then(({ warnings }) => {
    if (warnings.length) {
      console.log(warnings);
    }

    const canvas = modeler.get('canvas');

    canvas.zoom('fit-viewport');
  })
  .catch((err) => {
    console.log(err);
  });