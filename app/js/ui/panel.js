'use strict';
/** @jsx h */

import {h, render, Component} from 'preact';
import DataManager from '../DataManager';
import PropertiesManager from '../PropertiesManager';
import graphql from '../utils/graphql';

import codeMirror from 'codemirror';

class SidePanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isPropertiesOpen: false,
      isSchemaOpen: false,
      isJavascriptOpen: false,
      isIndexesOpen: false,
      selectedEntry: null
    };
  }

  componentDidMount() {
    const schema = codeMirror(document.querySelector('#side-panel-schema'), {
      lineNumbers: true,
      readOnly: true,
      undoDepth: 0,
      mode: 'yaml',
      lineWrapping: true,
      value: ''
    });

    const editor = codeMirror(document.querySelector('#side-panel-editor'), {
      lineNumbers: true,
      readOnly: true,
      lineWrapping: true,
      mode: 'javascript',
      value: ''
    });

    const indexes = codeMirror(document.querySelector('#side-panel-indexes'), {
      lineNumbers: true,
      // readOnly: true,
      lineWrapping: true,
      mode: 'javascript',
      value: ''
    });

    DataManager.onChange(function (data, eventType) {
      const selectedEntry = DataManager.getSelectedEntity();
      if (eventType === 'select') {
        this.setState({ selectedEntry });

        if (selectedEntry.isNode) {
          const nodeJS = graphql.getNodeResolver(selectedEntry);
          const nodeSchema = graphql.getNodeSchema(selectedEntry);
          editor.setValue(nodeJS);
          schema.setValue(nodeSchema);
          indexes.setValue(this.getIndexesValue(selectedEntry));
        }
      }

      if (eventType === 'update') {
        let jsToSet;
        let schemaToSet;

        if (selectedEntry.isNode) {
          jsToSet = graphql.getNodeResolver(selectedEntry);
          schemaToSet = graphql.getNodeSchema(selectedEntry);
        }

        if (selectedEntry.isEdge) {
          jsToSet = graphql.getEdgeResolver(selectedEntry);
          schemaToSet = graphql.getEdgeSchema(selectedEntry);
        }

        editor.setValue(jsToSet);
        schema.setValue(schemaToSet);
        indexes.setValue(this.getIndexesValue(selectedEntry));
      }

      if (eventType === 'deselect') {
        this.setState({ selectedEntry: null });
        editor.setValue('');
        schema.setValue('');
        indexes.setValue('');
      }

      if (eventType === 'dblclick') {
        const selectedEntry = DataManager.getSelectedEntity();
        this.setState({ selectedEntry, isPropertiesOpen: true });
      }
    }.bind(this));
  }

  /**
   * @param selectedEntry 被选中的实体
   * @description 从实体的description和defaultValue字段获取创建索引的信息
   * @returns {Object}
   */
  getIndexesValue(selectedEntry) {
    const properties = selectedEntry.properties;
    const element = document.querySelector('#properties-list .selected .property .propertyName');
    if (element !== null) {
      const key = element.value;
      for (const map of properties) {
        if (map.key === key) {
          return map.description === null || map.description.trim() === '' ? map.defaultValue : map.description;
        }
      }
    } else {
      for (const map of properties) {
        if (map.key === 'schema-indexes') {
          return map.description === null || map.description.trim() === '' ? map.defaultValue : map.description;
        }
      }
    }
    return '';
  }

  togglePanelProperties() {
    this.setState({ isPropertiesOpen: !this.state.isPropertiesOpen });
  }

  togglePanelSchema() {
    this.setState({ isSchemaOpen: !this.state.isSchemaOpen });
  }

  togglePanelJs() {
    this.setState({ isJavascriptOpen: !this.state.isJavascriptOpen });
  }

  togglePanelInx() {
    this.setState({ isIndexesOpen: !this.state.isIndexesOpen });
  }

  onEntityChange(entity) {
    if (!entity) {
      return false;
    }
    if (entity.isNode) {
      DataManager.updateNode(entity);
    }

    if (entity.isEdge) {
      DataManager.updateEdge(entity);
    }
  }

  // 绑定点击事件
  _onClick() {
    const element = document.getElementById('side-panel');
    if (element !== null) {
      element.addEventListener('click', (e) => {
        closeDeleteEdgeSelectionBox();
      });
    }
  };

  render(props, state) {
    return <section id="side-panel"
                    className={{ hasOpen: state.isPropertiesOpen || state.isSchemaOpen || state.isJavascriptOpen || state.isIndexesOpen }} onClick={ this._onClick() }>
      <header className={{ open: state.isPropertiesOpen }} onClick={ this.togglePanelProperties.bind(this) }>
        Properties
      </header>
      <section id="side-panel-properties" className={{ open: state.isPropertiesOpen }}>
        <PropertiesManager entity={ state.selectedEntry } onEntityChange={ this.onEntityChange }/>
      </section>

      <header className={{ open: state.isIndexesOpen }} onClick={ this.togglePanelInx.bind(this) }>Indexes
      </header>
      <section id="side-panel-indexes" className={{ open: state.isIndexesOpen }}/>

      <header className={{ open: state.isSchemaOpen }} onClick={ this.togglePanelSchema.bind(this) }>Schema</header>
      <section id="side-panel-schema" className={{ open: state.isSchemaOpen }}/>

      <header className={{ open: state.isJavascriptOpen }} onClick={ this.togglePanelJs.bind(this) }>Javascript
      </header>
      <section id="side-panel-editor" className={{ open: state.isJavascriptOpen }}/>
    </section>;
  }
}

/**
 * @description 关闭关系删除功能选择框
 */
function closeDeleteEdgeSelectionBox() {
  const element = document.getElementById('svg_action_delete_edge');
  if (element !== null) {
    element.remove();
  }
}

export default SidePanel;
