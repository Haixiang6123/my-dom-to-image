const escapeXhtml = (string: string) => {
  return string.replace(/#/g, '%23').replace(/\n/g, '%0A');
}

const makeImage = (uri: string): Promise<HTMLImageElement> => {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = function () {
      resolve(image);
    }
    image.src = uri;
    return image;
  })
}

const makeCanvas = (): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 300;
  return canvas;
}

const delay = (ms: number) => {
  return (args?: any) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(args);
      }, ms)
    })
  }
}

const toSvg = async (node: Element): Promise<string> => {
  const xhtml = escapeXhtml(new XMLSerializer().serializeToString(node));
  const foreignObject = '<foreignObject x="0" y="0" width="100%" height="100%">' + xhtml + '</foreignObject>'
  const svgStr = '<svg xmlns="http://www.w3.org/2000/svg" width="' + 300 + '" height="' + 300 + '">' + foreignObject + '</svg>'
  return 'data:image/svg+xml;charset=utf-8,' + svgStr;
}

const draw = async (domNode: Element): Promise<HTMLCanvasElement> => {
  const uri = await toSvg(domNode);
  const image = await makeImage(uri);
  await delay(100)()

  const canvas = makeCanvas();
  canvas.getContext('2d').drawImage(image, 0, 0);
  return canvas;
}

const toPng = async (node: Element) => {
  const canvas: HTMLCanvasElement = await draw(node);
  return canvas.toDataURL();
}

const btnEl: HTMLButtonElement = document.querySelector('#button')
const testEl = document.querySelector('#test');
const showEl: HTMLImageElement = document.querySelector('#show');

btnEl.onclick = () => {
  if (testEl) {
    toPng(testEl).then(uri => {
      showEl.src = uri;
    })
  }
}
