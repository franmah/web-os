import { Component } from 'react';
import { IconContext } from 'react-icons';
import { VscSearch } from 'react-icons/vsc';
import styles from '../taskbar.module.scss';

class SearchBar extends Component {
  state = {
    searchBarActive: false,
    value: ''
  };

  componentDidMount() {
    this.setClickListeners();
  }

  setClickListeners() {
    const element = document.getElementById('searchBarContainer');
    document.addEventListener('click', this.documentEventListener);
    element?.addEventListener('click', this.searchBarEventListener);
  }

  componentWillUnmount() {
    const element = document.getElementById('searchBarContainer');
    document.removeEventListener('click', this.documentEventListener);
    element?.removeEventListener('click', this.searchBarEventListener);
  }

  documentEventListener = () => {
    this.setState({ searchBarActive: false });
    this.resetInput();
  }

  searchBarEventListener = () => {
    const searchInput = document.getElementById('searchInput');
    setTimeout(() => {
      searchInput?.focus();
      this.setState({ searchBarActive: true });
    });
  }

  resetInput = () => this.setState({ value: '' });

  handleInputChange = (event: any) => this.setState({ value: event.target.value });

  render() {
    return (
      <div id='searchBarContainer'
        className={ this.state.searchBarActive ? styles.searchBarContainerSelected :
        styles.searchBarContainer }
      >
        <div className={styles.searchBar}>

          <IconContext.Provider value={this.state.searchBarActive ? { color: 'black'} :
            { color: '#dcdcdc'} }
          >
            <VscSearch size={18}/>
            <input id='searchInput' autoComplete='off' placeholder='Type here to search' className={styles.searchInput}
              value={this.state.value} onChange={this.handleInputChange}
            >
            </input>
          </IconContext.Provider>

        </div>
      </div>
    );
  }
}

export default SearchBar;