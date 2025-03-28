import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { postApi } from "../services/api";
import { CreatePostDto } from "../types/post";
import { Button } from "@/components/ui/button";

interface PostFormProps {
  onPostCreated: () => void;
}

const PostForm = ({ onPostCreated }: PostFormProps) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const MAX_CHAR_COUNT = 280;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Post content cannot be empty",
      });
      return;
    }
    
    if (content.length > MAX_CHAR_COUNT) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Post content cannot exceed ${MAX_CHAR_COUNT} characters`,
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const postData: CreatePostDto = { content };
      await postApi.createPost(postData);
      
      toast({
        title: "Success",
        description: "Post created successfully",
      });
      
      setContent("");
      onPostCreated();
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create post. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            maxLength={MAX_CHAR_COUNT}
            disabled={isSubmitting}
          ></textarea>
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>{content.length}/{MAX_CHAR_COUNT}</span>
            {isSubmitting && <span>Posting...</span>}
          </div>
        </div>
        <div className="flex justify-end">
          <Button 
            type="submit" 
            className="bg-blue-500 hover:bg-blue-600 text-white"
            disabled={isSubmitting || !content.trim()}
          >
            Post
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;