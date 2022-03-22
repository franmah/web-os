import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import { FcApproval, FcApprove, FcAreaChart, FcBiotech, FcBookmark, FcCamera, FcClapperboard, FcGlobe } from 'react-icons/fc';
import { Component } from 'react';
import Image from 'next/image';
import TaskbarShortcut from './shortcut';
import styles from './taskbar.module.scss';

class Taskbar extends Component {
  NUM_FAKE_ICONS = 10;
  NUM_HOURS = 12;
  THIRTY_SECONDS_MILI = 30 * 1000;

  state = {
    date: '',
    shortcutIems: [
        (<FcAreaChart size={28} key={0}/>),
        (<FcBookmark size={28} key={1}/>),
        (<FcApproval size={28} key={2}/>),
        (<FcApprove size={28} key={3}/>),
        (<FcBiotech size={28} key={4}/>),
        (<FcCamera size={28} key={5}/>),
        (<FcClapperboard size={28} key={6}/>),
        (<FcGlobe size={28} key={7}/>)
    ],
    time: ''
  };

  componentDidMount() {
    this.updateDateTime();
  }

  handleReorderShortcutItemsOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(this.state.shortcutIems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    this.setState({ shortcutIems: items });
  }

  render() {
    return (
      <div className={styles.main}>
        <div className={styles.windowIcon}>
          <Image src='/taskbar/windows-logo.png' alt='menu' height={24} width={24}/>
        </div>

          {/* User icons */}
          <DragDropContext onDragEnd={this.handleReorderShortcutItemsOnDragEnd}>
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

  getFakeIconList = () => this.state.shortcutIems.map((item: any, i) => (
      <Draggable key={i} draggableId={String(i)} index={i}>
        {
          (provided: any) => (
            <TaskbarShortcut>
              <div className={styles.shortcutItem} ref={provided.innerRef}
                {...provided.draggableProps} {...provided.dragHandleProps}
              >
                {item}
              </div>
            </TaskbarShortcut>
          )
        }
      </Draggable>
    ));
}

export default Taskbar;