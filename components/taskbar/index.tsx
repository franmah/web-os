import { Component } from 'react';
import { FcBookmark } from 'react-icons/fc';
import { RiWindowsLine} from 'react-icons/ri';
import TaskbarShortcut from './shortcut';
import styles from './taskbar.module.scss';

class Taskbar extends Component {
  NUM_FAKE_ICONS = 10;
  NUM_HOURS = 12;
  THIRTY_SECONDS_MILI = 30 * 1000;

  state = {
    date: '',
    time: ''
  };

  componentDidMount() {
    this.updateDateTime();
  }

  render() {
    return (
      <div className={styles.main}>
        <div>
          <RiWindowsLine size={30} className={styles.windowIcon} />
        </div>

          {/* User icons */}
          <div className={styles.shortcuts}>{ this.getFakeIconList() }</div>

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
    return `${date.getHours() % this.NUM_HOURS}:${date.getMinutes()} ${timeOfDay}`;
  }

  formatDate(date: Date): string {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }

  getFakeIconList = () => {
    const icons = [];
    for (let i = 0; i < this.NUM_FAKE_ICONS; i+= 1) {
      icons.push(
        <TaskbarShortcut key={i} draggable={true}>
          <FcBookmark size={30}/>
        </TaskbarShortcut>
      );
    }
    return icons;
  };
}

export default Taskbar;