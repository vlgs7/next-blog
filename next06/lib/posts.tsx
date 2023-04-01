import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

// 博客文章文件夹的路径
const postsDirectory = path.join(process.cwd(), "blogposts");

// 获取已排序的博客文章数据
export function getSortedPostsData() {
  // 获取博客文章文件名
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // 从文件名中去掉 ".md" 后缀，得到文章 ID
    const id = fileName.replace(/\.md$/, "");

    // 读取 Markdown 文件
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // 使用 gray-matter 解析文章元数据
    const matterResult = matter(fileContents);

    // 构造博客文章数据
    const blogPost = {
      id,
      title: matterResult.data.title,
      date: matterResult.data.date,
    };

    // 将数据和 ID 结合返回
    return blogPost;
  });
  // 按照日期排序文章
  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

// 获取指定文章的数据和 HTML 内容
export async function getPostData(id: string) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // 使用 gray-matter 解析文章元数据
  const matterResult = matter(fileContents);

  // 使用 remark 和 remark-html 处理文章内容
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);

  const contentHtml = processedContent.toString();

  // 构造博客文章数据，包括 ID、标题、日期和 HTML 内容
  const blogPostWithHTML = {
    id,
    title: matterResult.data.title,
    date: matterResult.data.date,
    contentHtml,
  };

  // 将数据和 ID 结合返回
  return blogPostWithHTML;
}
