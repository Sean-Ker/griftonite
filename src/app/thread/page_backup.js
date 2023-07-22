import { Web3Storage } from 'web3.storage'

const filename = "blog_" + Math.floor(Math.random() * 89999999 + 10000000) + ".md"
const sample_md = `
# Sample blog post

## Each post also has a subtitle

<span class="post-meta">Posted on February 28, 2020</span> <span class="reader-time post-meta"><span class="d-none d-md-inline middot">·</span> < 1 minute read</span></div>

</div>

</div>

</div>

</div>

</header>

<div class="container-md">

<div class="row">

<div class="col-xl-8 offset-xl-2 col-lg-10 offset-lg-1">

<div id="header-gh-btns"><iframe src="https://ghbtns.com/github-btn.html?user=daattali&amp;repo=beautiful-jekyll&amp;type=star&amp;count=true" frameborder="0" scrolling="0" width="120px" height="20px"></iframe><iframe src="https://ghbtns.com/github-btn.html?user=daattali&amp;repo=beautiful-jekyll&amp;type=fork&amp;count=true" frameborder="0" scrolling="0" width="120px" height="20px"></iframe><iframe src="https://ghbtns.com/github-btn.html?user=daattali&amp;type=follow&amp;count=true" frameborder="0" scrolling="0" width="220px" height="20px"></iframe></div>

<article role="main" class="blog-post">

This is a demo post to show you how to write blog posts with markdown. I strongly encourage you to [take 5 minutes to learn how to write in markdown](https://markdowntutorial.com/) - it’ll teach you how to transform regular text into bold/italics/headings/tables/etc.

**Here is some bold text**

## Here is a secondary heading

Here’s a useless table:

<table>

<thead>

<tr>

<th style="text-align: left">Number</th>

<th style="text-align: left">Next number</th>

<th style="text-align: left">Previous number</th>

</tr>

</thead>

<tbody>

<tr>

<td style="text-align: left">Five</td>

<td style="text-align: left">Six</td>

<td style="text-align: left">Four</td>

</tr>

<tr>

<td style="text-align: left">Ten</td>

<td style="text-align: left">Eleven</td>

<td style="text-align: left">Nine</td>

</tr>

<tr>

<td style="text-align: left">Seven</td>

<td style="text-align: left">Eight</td>

<td style="text-align: left">Six</td>

</tr>

<tr>

<td style="text-align: left">Two</td>

<td style="text-align: left">Three</td>

<td style="text-align: left">One</td>

</tr>

</tbody>

</table>

How about a yummy crepe?

![Crepe](https://s3-media3.fl.yelpcdn.com/bphoto/cQ1Yoa75m2yUFFbY2xwuqw/348s.jpg)

It can also be centered!

![Crepe](https://s3-media3.fl.yelpcdn.com/bphoto/cQ1Yoa75m2yUFFbY2xwuqw/348s.jpg)

Here’s a code chunk:



"""javascript

    var foo = function(x) {
      return(x + 5);
    }
    foo(3)
"""



And here is the same code with syntax highlighting:

<div class="language-javascript highlighter-rouge">

<div class="highlight">

    var foo = function(x) {
      return(x + 5);
    }
    foo(3)

</div>

</div>
`;
// let ipfs_secret = process.env.IPFS_SECRET;
ipfs_secret = '265119bde305a521de0de1?4721de5a51';

export default async function NewPost() {
  const markdownContent = sample_md;

  // Create a Blob from the Markdown content
  const blob = new Blob([markdownContent], { type: 'text/markdown' });

  // Create a new FormData instance
  const data = new FormData();

  // Append the Blob as a file named 'file'
  data.append('file', blob, 'filename.md');
  console.log("DATA", data);

  // POST the data using fetch
  console.log("IPFS", ipfs_secret);
  const response = await fetch('https://ipfs.infura.io:5001/api/v0/add?recursive=false&quiet=false&stream-channels=true', {
  method: 'POST',
  headers: {
    'Authorization': 'Basic ' + btoa(`Paris_IPFS:${ipfs_secret}`),
  },
    body: data,
  });

  // Check the response
  if (!response.ok) {
    // Handle the error
    console.error('There was an error!', response);
  } else {
    const jsonData = await response.json();
    console.log('Success:', jsonData);
  }

    return (
        <div>
            <h1>Upload a new post</h1>
            {/* Markdown editor: */}
            <textarea
                value={markdownContent}
                // onChange={(e) => setMarkdownContent(e.target.value)}
                rows={10}
            />
        </div>
    );
}
