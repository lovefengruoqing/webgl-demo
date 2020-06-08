import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import './main.less';

import examples from './examples';
import { getQueryParam } from './utils';

const App: React.FC<{
  List: Array<{
    title: string;
    handler: {
      render: (canvas: HTMLCanvasElement) => void;
    };
  }>;
}> = ({ List }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const curTitle = getQueryParam('title');
    const curItem = List.find(({ title }) => title === curTitle);

    if (curItem) {
      document.title = curItem.title;
      curItem.handler.render(canvasRef.current);
    }
  });

  return (
    <>
      <aside className="leftPanel">
        <header>
          <a href="?">Webgl Demos</a>
        </header>
        <ol>
          {List.map(({ title, handler }) => (
            <li key={title}>
              <a
                href={`?title=${title}`}
                onClick={() => {
                  const curTitle = getQueryParam('title');
                  if (title !== curTitle) {
                    handler.render(canvasRef.current);
                  }
                }}
              >
                {title}
              </a>
            </li>
          ))}
        </ol>
      </aside>
      <main className="mainContent">
        <canvas ref={canvasRef} />
      </main>
    </>
  );
};

ReactDOM.render(<App List={examples} />, document.querySelector('#root'));
