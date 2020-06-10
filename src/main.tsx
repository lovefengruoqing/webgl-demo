import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import './main.less';

import expand from '@/assets/expand.png';
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

  const [toggle, setToggle] = useState(true);

  useEffect(() => {
    const curTitle = getQueryParam('title');
    const curItem = List.find(({ title }) => title === curTitle);

    if (curItem) {
      document.title = curItem.title;
      curItem.handler.render(canvasRef.current);
    }
  }, []);

  return (
    <>
      <aside className={`leftPanel ${toggle ? '' : 'asideHidden'}`}>
        <header>
          <a href="?">Webgl Demos</a>
        </header>
        <span
          style={{
            backgroundImage: `url(${expand})`,
          }}
          aria-label="toggle"
          role="button"
          tabIndex={0}
          className={`${toggle ? 'rotate-180' : ''}`}
          onClick={() => {
            setToggle(!toggle);
          }}
        />
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
