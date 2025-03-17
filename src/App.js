import React from 'react';
import Header from "./components/Header"
import MainBanner from "./components/MainBanner"
import Search from "./components/Search"

class App extends React.Component {
    render () {
        return (
            <div>
                <Header />
                <MainBanner />
                <Search />
            </div>
        )
    }
}

export default App