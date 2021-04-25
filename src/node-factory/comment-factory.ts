import NodeFactory from "./node-factory";
import BackingData from "../backing-data/backing-data";
import CommentBackingData from "../backing-data/comment-backing-data";
import Node from "../node";
import Comment from "../comment";

class CommentFactory implements NodeFactory {

    parseNode(data: BackingData, mainFactory: NodeFactory, parsedNode?: Node | null): Node | null {
        return this.checkCommentData(data) ? new Comment(data.comment || '') : null;
    }

    protected checkCommentData(data: BackingData): data is CommentBackingData {
        return data.type === 'comment';
    }
}

export default CommentFactory;