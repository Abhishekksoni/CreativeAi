import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, CornerDownRight } from 'lucide-react';

interface CommentProps {
  id: string;
  content: string;
  author: {
    userName: string;
    profilePicture?: string;
  };
  replies: CommentType[];
  level: number;
  onReply: (commentId: string, content: string) => Promise<void>;
}

interface CommentType extends Omit<CommentProps, 'onReply'> {}

const Comment: React.FC<CommentProps> = ({
  id,
  content,
  author,
  replies,
  level,
  onReply
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const handleReply = async () => {
    if (!replyContent.trim()) return;
    await onReply(id, replyContent);
    setReplyContent('');
    setIsReplying(false);
  };

  return (
    <div className="mt-4">
      <div className={`flex items-start space-x-2 ${level > 0 ? 'ml-4' : ''}`}>
        {level > 0 && (
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
            <CornerDownRight className="h-4 w-4 text-gray-400" />
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={author.profilePicture} />
              <AvatarFallback>{author.userName[0]}</AvatarFallback>
            </Avatar>
            <span className="font-semibold text-sm">{author.userName}</span>
          </div>
          <p className="mt-1 text-sm">{content}</p>
          
          <Button
            variant="ghost"
            size="sm"
            className="mt-1 text-xs"
            onClick={() => setIsReplying(!isReplying)}
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            Reply
          </Button>

          {isReplying && (
            <div className="mt-2">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="min-h-[80px]"
              />
              <div className="mt-2 flex space-x-2">
                <Button size="sm" onClick={handleReply}>
                  Post Reply
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsReplying(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {replies?.length > 0 && (
            <div className="ml-4 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
              {replies.map((reply) => (
                <Comment
                  key={reply.id}
                  {...reply}
                  level={level + 1}
                  onReply={onReply}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const CommentSection: React.FC<{
  postId: string;
  comments: CommentType[];
  onAddComment: (content: string, parentId?: string) => Promise<void>;
}> = ({ postId, comments, onAddComment }) => {
  const [newComment, setNewComment] = useState('');

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    await onAddComment(newComment);
    setNewComment('');
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Comments</h3>
      <div className="mb-4">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="min-h-[100px]"
        />
        <Button className="mt-2" onClick={handleAddComment}>
          Post Comment
        </Button>
      </div>
      <div className="space-y-4">
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            {...comment}
            level={0}
            onReply={async (commentId, content) => {
              await onAddComment(content, commentId);
            }}
          />
        ))}
      </div>
    </div>
  );
};