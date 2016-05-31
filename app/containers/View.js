import { connect } from 'react-redux';
import View from '../components/View';

const mapStateToProps = state => ({
  editorState: state.editor.editorState,
});

export default connect(mapStateToProps)(View);
