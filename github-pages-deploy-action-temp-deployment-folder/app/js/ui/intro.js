/** @jsx h */

import { h, Component } from 'preact';

class Intro extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: true
    };
  }

  toggleOpen() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  render(props, state) {
    return <div id="overlay-dialog" className={{ opened: state.isOpen, 'overlay-dialog': true, intro: true }}>
      <div class="dialog intro">
        <div class="header">Introduction</div>
        <div class="sub-header">
        <span>
          The project is still in prototype state. Suggestions and recommendations are welcome.
          Drop me a line at <a href="mailto:aleksandrenko@gmail.com">aleksandrenko@gmail.com</a>.
        </span>
          <span>
          Secondary Development By Graph Data Lab.
          Drop me a line at <a href="yanchaoma@foxmail.com">yanchaoma@foxmail.com</a>.
        </span>
        </div>
        <div class="body">
          <iframe width="853" height="480" src="https://cn.bing.com/search?q=Graph%20Data%20Modeling" frameborder="0" allowfullscreen></iframe>
        </div>
        <div class="footer">
          <button class="close-dialog-btn" onClick={this.toggleOpen.bind(this)}>Close</button>
        </div>
      </div>
    </div>;
  }
}

export default Intro;
