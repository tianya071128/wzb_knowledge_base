export default function convertComments(comments) {
  for (const comment of comments) {
    comment.type = comment.type === "CommentBlock" ? "Block" : "Line";
    comment.range ||= [comment.start, comment.end];
  }
}