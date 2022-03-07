import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { WithContext as ReactTags } from "react-tag-input";
import { collecttag } from "../../actions/research/formAction";
import "../../utilis/reactTag.css";
import { suggest } from "../../utilis/research/typetag";

const suggestions = suggest.map((sug) => {
  return {
    id: sug,
    text: sug,
  };
});

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

class Tags extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tags: [],
      suggestions: suggestions,
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
  }

  handleDelete(i) {
    const { tags } = this.state;
    this.setState({
      tags: tags.filter((tag, index) => index !== i),
    });
  }

  handleAddition(tag) {
    this.setState((state) => ({ tags: [...state.tags, tag] }));
  }

  handleDrag(tag, currPos, newPos) {
    const tags = [...this.state.tags];
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    this.setState({ tags: newTags });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.tags !== this.state.tags) {
      // console.log(this.state.tags);
      this.props.collecttag(this.state.tags);
    }
  }

  render() {
    const { tags, suggestions } = this.state;
    return (
      <Fragment>
        <ReactTags
          tags={tags}
          suggestions={suggestions}
          handleDelete={this.handleDelete}
          handleAddition={this.handleAddition}
          handleDrag={this.handleDrag}
          delimiters={delimiters}
          inputFieldPosition="top"
          placeholder="โปรดกดปุ่ม Enter เพื่อเพิ่ม keyword"
        />
      </Fragment>
    );
  }
}

export default connect(null, { collecttag })(Tags);
