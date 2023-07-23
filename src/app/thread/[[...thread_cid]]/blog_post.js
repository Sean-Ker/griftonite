'use client';

import { Card } from '@tremor/react';
import MDEditor from '@uiw/react-md-editor';
import { Button, Typography } from 'antd';
import { useEffect, useState } from 'react';

const BlogPost = ({ cid, client }) => {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(null);
  const [author, setAuthor] = useState(null);

  useEffect(() => {
    async function getPost() {
      // Insert code here to get the post from the IPFS by cid
      const res = await client.get(cid);
      if (!res.ok) {
        throw new Error(`failed to get ${cid}`);
      }
      const files = await res.files();
      const post = await files[0].text();
     // console.log('post: ', post);
      post && setContent(post);
      console.log('Content: ', post);
    }
    getPost();
  }, [cid, client]);

  return (
    <Card className="mt-6 p-4 md:p-10 mx-auto flex flex-col justify-left inset-0 max-w-5xl bg-gradient-to-b from-gray-100 to-gray-200 shadow-lg">
      <Typography.Title level={1}>Blog Post</Typography.Title>
          {content && <MDEditor preview="preview" value={content} height={700}/>}
      <Button type="primary" onClick={() => {}}>
        Comment
      </Button>
    </Card>
  );
};

export default BlogPost;
