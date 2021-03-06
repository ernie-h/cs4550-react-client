import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import LessonServiceClient from '../services/LessonServiceClient';
import ModuleServiceClient from '../services/ModuleServiceClient'
import LessonTabs from './LessonTabs';
import LessonEditor from './LessonEditor';

class ModuleEditor extends React.Component {
  constructor(props) {
    super(props);
    this.createLesson = this.createLesson.bind(this);
    this.deleteLesson = this.deleteLesson.bind(this);

    this.updateLesson = this.updateLesson.bind(this);
    this.editClickHandler = this.editClickHandler.bind(this);
    this.isEditLesson = this.isEditLesson.bind(this);

    this.setCourseId = this.setCourseId.bind(this);
    this.setModuleId = this.setModuleId.bind(this);
    this.setLessonTitle = this.setLessonTitle.bind(this);
    this.onClickTabHandler = this.onClickTabHandler.bind(this);
    this.moduleService = ModuleServiceClient.instance;
    this.lessonService = LessonServiceClient.instance;
    this.state = {
      courseId: '',
      moduleId: '',
      lesson: {
        title: ''
      },
      lessons: [],
      module: '',
      tabClicked: false,
      activeTabLessonId: '',
      editClicked: false,
      editLessonId: ''
    };
  }

  componentDidMount() {
    this.setCourseId(this.props.match.params.courseId);
    this.setModuleId(this.props.match.params.moduleId);
    this.findModuleById(this.props.match.params.moduleId);
    this.findAllLessonsForModule(this.props.match.params.courseId, this.props.match.params.moduleId);
  }

  componentWillReceiveProps(newProps) {
    this.setCourseId(newProps.match.params.courseId);
    this.setModuleId(newProps.match.params.moduleId);
    this.findModuleById(newProps.match.params.moduleId);
    this.findAllLessonsForModule(newProps.match.params.courseId, newProps.match.params.moduleId);
  }

  setCourseId(courseId) {
    this.setState({courseId: courseId});
  }

  setModuleId(moduleId) {
    this.setState({moduleId: moduleId});
  }

  setLessons(lessons) {
    this.setState({lessons: lessons});
  }

  setLessonTitle(event) {
    this.setState({
      lesson: {
        title: event.target.value
      }
    });
  }

  findAllLessonsForModule(courseId, moduleId) {
    this.lessonService.findAllLessonsForModule(courseId, moduleId).then((lessons) => {
      this.setLessons(lessons);
    });
  }

  findModuleById(moduleId) {
    this.moduleService.findModuleById(moduleId).then((module) => {
      this.setState({module: module});
    });
  }

  createLesson() {
    this.setState({lesson: {title: ''}});
    this.lessonService.createLesson(this.state.courseId, this.state.moduleId, this.state.lesson)
    .then(() => {this.findAllLessonsForModule(this.state.courseId, this.state.moduleId);
    });
  }

  deleteLesson(lessonId) {
    this.lessonService.deleteLesson(lessonId)
    .then(() => {this.findAllLessonsForModule(this.state.courseId, this.state.moduleId);
    });
  }

  onClickTabHandler(lessonId){
    this.setState({activeTabLessonId: lessonId});
  }
  isActiveTab(lessonId) {
    return this.state.activeTabLessonId === lessonId;
  }

  editClickHandler(lessonId) {
    this.setState({editLessonId: lessonId});
  }

  isEditLesson(lessonId) {
    return this.state.editLessonId === lessonId;
  }

  updateLesson(lessonId, lesson) {
    this.lessonService.updateLesson(lessonId, lesson)
    .then(this.setState({editLessonId: ''}))
    .then(()=> {this.findAllLessonsForModule(this.state.courseId, this.state.moduleId);
    });
  }

  renderListOfLessons() {
    let lessons = this.state.lessons.map((lesson) => {
      return <LessonTabs courseId={this.state.courseId} moduleId={this.state.moduleId}
        lesson={lesson} key={lesson.id} delete={this.deleteLesson}
        tabClick={this.onClickTabHandler} isActiveTab={this.isActiveTab(lesson.id)}
          editClick={this.editClickHandler}
        isEditLesson={this.isEditLesson(lesson.id)} updateLesson={this.updateLesson}/>;
    });
    return lessons;
  }

  render() {
    return (
      <div className="pb-5 pl-4 pr-0 mr-0 bg-dark rounded">
        <h3 className="text-light mr-5 pt-3 pb-3 mr-5">Editing module:
          <small className="text-muted pl-3">{this.state.module.title}</small>
        </h3>
      <div className="row pt-4 mr-5">
        <div className="col-md-8">
          <input onChange={this.setLessonTitle} value={this.state.lesson.title}
            className="form-control bg-light" placeholder="New lesson"/>
        </div>
        <div className="col-md-2">
          <button className="btn btn-secondary btn-block" onClick={this.createLesson}>
            <i className="fa fa-plus"></i>
          </button>
        </div>
      </div>
      <ul className="nav nav-tabs pt-3">
        {this.renderListOfLessons()}
      </ul>
      <Route path="/course/:courseId/module/:moduleId/lesson/:lessonId" component={LessonEditor}/>
    </div>);
  }
}

export default ModuleEditor;
