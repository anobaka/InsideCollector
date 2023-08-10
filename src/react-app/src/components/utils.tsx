import store from '@/store';
import ReactDOM from 'react-dom/client';
import { v4 as uuidv4 } from 'uuid';

export function isNumeric(str: any) {
  if (typeof str != 'string') return false; // we only process strings!
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str)); // ...and ensure strings of whitespace fail
}

export function buildDataSource(enumType) {
  return Object.keys(enumType).filter(a => isNumeric(a)).map(a => {
    return {
      label: enumType[a],
      value: parseInt(a, 10),
    };
  });
}

export function createPortalOfComponent(Component: React.ComponentType<any>, props: any) {
  const key = uuidv4();
  const node = document.createElement('div');
  document.body.appendChild(node);

  const root = ReactDOM.createRoot(node);

  // console.log(19282, node, props, Component);

  const unmount = () => {
    console.log('Unmounting', key);
    // console.trace(19282);
    setTimeout(() => {
      root.unmount();
      node.parentElement?.removeChild(node);
    }, 1);
  };

  console.log('Mounting', key);

  root.render(
    <store.Provider>
      <Component
        {...props}
        afterClose={() => {
          if (props.afterClose) {
            props.afterClose();
          }
          unmount();
        }}
      />,
    </store.Provider>,
  );

  return {
    key,
    close: unmount,
  };
}
