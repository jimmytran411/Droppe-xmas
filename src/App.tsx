import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { useCart } from 'context/CartContext';
import { Header } from 'Header';
import { Overview } from 'Overview';
import { WishList } from 'WishList';
import { Landing } from 'Landing/Landing';
import { Footer } from 'Footer';

function App() {
  const { wishlists } = useCart();

  return (
    <div className="App">
      <Router>
        <Header />
        <div className="App-content">
          <Switch>
            <Route exact path="/">
              <Landing />
            </Route>
            {wishlists &&
              wishlists.map((wishlist, index) => {
                return (
                  <Route key={index} path={`/wishlist/${wishlist.id}`}>
                    <WishList {...wishlist} />
                  </Route>
                );
              })}
            <Route path="/overview">
              <Overview />
            </Route>
          </Switch>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
