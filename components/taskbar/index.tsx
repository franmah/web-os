import { Component } from 'react';
import { FcBookmark } from 'react-icons/fc';
import { RiWindowsLine} from 'react-icons/ri';
import { DragDropContext, Draggable, Droppable, resetServerContext } from 'react-beautiful-dnd';
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
          <DragDropContext>
            <Droppable droppableId="taskbarShortcutItems" direction="horizontal">
              {
                (provided: any) => (
                  <div className={styles.shortcuts} ref={provided.innerRef} {...provided.droppableProps}>
                    { this.getFakeIconList() }
                    {provided.placeholder}
                  </div>
                )
              }

            </Droppable>
          </DragDropContext>

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

  getFakeIconList = () => {
    const icons = [];
    for (let i = 0; i < this.NUM_FAKE_ICONS; i+= 1) {
      icons.push(
        <Draggable key={i} draggableId={String(i)} index={i}>
          {
            (provided: any) => (
              <TaskbarShortcut>
                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} >
                  <FcBookmark size={30}/>
                </div>
              </TaskbarShortcut>
            )
          }
        </Draggable>
      );
    }
    return icons;
  };
}

export default Taskbar;