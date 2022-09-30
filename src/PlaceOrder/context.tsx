import React, {createContext, ReactNode, useContext} from 'react';
import {injectStores} from '@mobx-devtools/tools';

import {PlaceOrderStore} from './store/PlaceOrderStore';

const orderStore = new PlaceOrderStore();
const storeContext = createContext(orderStore);

injectStores({orderStore});

const useStore = () => {
  return useContext(storeContext);
};

const StoreProvider = ({children}: {children: ReactNode}) => (
  <storeContext.Provider value={orderStore}>{children}</storeContext.Provider>
);

export {useStore, StoreProvider};
