import Node from "./node";
import CharacterData from "./character-data";
import CommentBackingData from "./backing-data/comment-backing-data";

class Comment extends CharacterData {

    constructor(val: CommentBackingData | string) {
        if (typeof val === 'string') {
            val = {comment: val};
        }
        super({
            ...(val || {}),
            type: 'comment',
        });
    }

    get nodeName(): string {
        return '#comment';
    }

    get nodeType(): number {
        return Node.COMMENT_NODE;
    }

    // To be compatible with W3C Recommendation (see https://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-1728279322),
    // we should introduce Comment derived from CharacterData. However, for the sake of the implementations of Element#text and Node#getTextValue()
    // (both of these implementations' returning contents shouldn't include comment content), the value of data of Comment should always be an empty string.

    set data(data: string) {
    }

    get data() {
        return '';
    }

    set nodeValue(val: string) {
        this.origin.comment = val || '';
    }

    get nodeValue(): string {
        return this.origin.comment || '';
    }
}

export default Comment;