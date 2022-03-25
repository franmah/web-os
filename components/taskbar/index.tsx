import { Component } from 'react';
import Image from 'next/image';
import SearchBar from './search-bar';
import ShortcutBar from './shortcut-bar';
import styles from './taskbar.module.scss';

class Taskbar extends Component {
  NUM_FAKE_ICONS = 10;
  NUM_HOURS = 12;
  THIRTY_SECONDS_MILI = 30 * 1000;

  state = {
    date: '',
    forceSearchBar: false,
    searchBarActive: false,
    time: ''
  };

  componentDidMount() {
    this.updateDateTime();
    this.setSearchBarListeners();
  }

  setSearchBarListeners() {
    const element = document.getElementById('searchBarContainer');
    const searchInput = document.getElementById('searchInput');

    document.addEventListener('click', () => this.setState({ searchBarActive: false }));
    element?.addEventListener('click', () =>
      setTimeout(() => {
        searchInput?.focus();
        this.setState({ searchBarActive: true });

      })
    );
  }

  handleClick = () => {
    this.setState({ forceSearchBar: true });
  }

  render() {
    return (
      <div className={styles.main}>
        <div className={styles.windowIcon} onClick={this.handleClick}>
          <Image src='/taskbar/windows-logo.png' alt='menu' height={22} width={22}/>
        </div>

        <SearchBar/>

        <ShortcutBar/>

        {/* Time section */}
        <div className={styles.datetime}>
          <div>{this.state.time}</div>
          <div>{this.state.date}</div>
        </div>
      </div>
    );
  }

  updateDateTime() {
    const date = new Date();
    this.setState({
      date: this.formatDate(date),
      time: this.formatTime(date)
    });

    setInterval(() => {
      const date = new Date();
      this.setState({
        date: this.formatDate(date),
        time: this.formatTime(date)
      });
    }, this.THIRTY_SECONDS_MILI);
  }

  formatTime(date: Date): string {
    const timeOfDay = date.getHours() > this.NUM_HOURS ? 'PM' : 'AM';
    return `${date.getHours() % this.NUM_HOURS}:${String(date.getMinutes()).padStart(2, '0')} ${timeOfDay}`;
  }

  formatDate(date: Date): string {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }
}

export default Taskbar;