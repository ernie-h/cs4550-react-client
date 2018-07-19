import React from 'react';
import {Link} from 'react-router-dom';

class LessonTabs extends React.Component {
  constructor(props) {
    super(props);
    this.setEditLesson = this.setEditLesson.bind(this);
    this.state = {
      lesson: {
        title: ''
      }
    };
  }

  setEditLesson(event) {
    this.setState({
      lesson: {
        title: event.target.value
      }
    });
  }

  //Can wrap link around whole component instead of title
  render() {
    return (
      <div onClick={() => {
          this.props.tabClick(this.props.lesson.id);
        }}>
        <li className="nav-item">
          <span className="float-right">
            <i className="fa fa-pencil" onClick={() => this.props.editClick(this.props.lesson.id)}></i>
            <i className="fa fa-times-circle pl-2" onClick={() => {
                this.props.delete(this.props.lesson.id);
              }}></i>
          </span>
          <Link to={`/course/${this.props.courseId}/module/${this.props.moduleId}/lesson/${this.props.lesson.id}`}>
          <p className={this.props.isActiveTab
              ? 'nav-link active'
              : 'nav-link'}>
            {
              this.props.isEditLesson
                ? <div>
                    <span className="float-right">
                      <i className="fa fa-check mb-2 pr-2" onClick={() => this.props.updateLesson(this.props.lesson.id, this.state.lesson)}></i>
                    </span>
                    <input className="form-control w-50" value={this.state.lesson.title} onChange={this.setEditLesson}/>
                  </div>
                : this.props.lesson.title

            }
          </p>
          </Link>
        </li>
      </div>);
  }
}

export default LessonTabs;
