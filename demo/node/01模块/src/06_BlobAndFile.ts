// #region ------------ Blob ------------
/**
 * 创建 Blob
 */
{
  const buffer = Buffer.from('hello world');
  // 从多个数据源创建 Blob
  const combinedBlob = new Blob(
    [
      'Header\n', // 字符串
      buffer, // Buffer
      new Uint8Array([1, 2, 3]), // Uint8Array
    ],
    { type: 'text/mixed' }
  );
  console.log(combinedBlob); // Blob { size: 21, type: 'text/mixed' }
}

/**
 * blob.text(): 转换为字符串
 */
{
  const blob = new Blob(['Hello, Node.js!']);
  blob.text().then((text) => {
    console.log(text); // 输出: "Hello, Node.js!"
  });
}
// #endregion
