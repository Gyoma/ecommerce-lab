import React, { useState } from 'react';
import ReactModal from 'react-modal';

import algoliasearch from 'algoliasearch/lite';
import {
  InstantSearch,
  Configure,
  Hits,
  SearchBox,
  DynamicWidgets,
  RefinementList,
  Pagination,
  Highlight,
} from 'react-instantsearch-dom';
import PropTypes from 'prop-types';
import './App.css';

const searchClient = algoliasearch(
  'B1G2GM9NG0',
  'aadef574be1f9252bb48d4ea09b5cfe5'
);

const BASKET_DATA = 'BASKET_DATA';
const getParsedData = (data, isParse = false) => isParse ? JSON.parse(data) || [] : JSON.stringify(data);

const addToBasket = ({ objectID, name }) => {
  const basket = getParsedData(localStorage.getItem(BASKET_DATA), true);
  const element = basket.find(elem => elem.objectID === objectID);
  if (element) {
    element.count++;
    localStorage.setItem(BASKET_DATA, getParsedData(basket));
  } else {
    const newElement = {
      objectID,
      name,
      count: 1,
    };
    localStorage.setItem(BASKET_DATA, getParsedData([...basket, newElement]));
  }
};

const buttonProps = {
  style: {
    cursor: 'pointer',
  },
};

const App = () => {
  const [isOpen, setIsOpen] = useState(false);

  const renderBasketList = getParsedData(localStorage.getItem(BASKET_DATA), true).map(item => (
    <>
      <div key={item.objectID}>
        * {item.name} - {item.objectID} - {item.count} шт.
      </div>
      <hr />
    </>
  ));

  return (
    <div>
      <ReactModal isOpen={isOpen}>
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>Корзина</div>
            <button {...buttonProps} onClick={() => setIsOpen(false)}>
              Закрыть
            </button>
          </div>
          <hr />
          {renderBasketList}
        </>
      </ReactModal>
      <header className="header">
        <h1 className="header-title">
          <a href="/">lab_2</a>
        </h1>
        <button {...buttonProps} onClick={() => setIsOpen(true)}>
          Корзина
        </button>
      </header>

      <div className="container">
        <InstantSearch searchClient={searchClient} indexName="demo_ecommerce">
          <Configure hitsPerPage={8} />
          <div className="search-panel">
            <div className="search-panel__filters">
              <DynamicWidgets fallbackWidget={RefinementList} />
            </div>

            <div className="search-panel__results">
              <SearchBox
                className="searchbox"
                translations={{
                  placeholder: '',
                }}
              />
              <Hits hitComponent={Hit} />

              <div className="pagination">
                <Pagination />
              </div>
            </div>
          </div>
        </InstantSearch>
      </div>
    </div>
  );
};

function Hit({ hit }) {
  return (
    <article>
      <h1 {...buttonProps} onClick={() => addToBasket(hit)}>
        <Highlight attribute="name" hit={hit} />
      </h1>
    </article>
  );
}

Hit.propTypes = {
  hit: PropTypes.object.isRequired,
};

export default App;
