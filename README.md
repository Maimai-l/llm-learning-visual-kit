# fx.js

用于 Claude visualize 组件的练习卡片：翻面卡、选择题、填空题，支持 KaTeX 公式。

## 调用

```html
<script type="application/json" id="fx-data">
{"cards":[
  {"front":"正面","back":"背面"},
  {"q":"题干","options":["A","B","C","D"],"answer":0},
  {"q":"题干 ___","answer":["答案","其他写法"]}
]}
</script>
<script src="https://cdn.jsdelivr.net/gh/<用户名>/<仓库名>@<tag>/fx.js"></script>
```

## 数据规则

- 有 `front` 为翻面卡，需要 `back`。
- 有 `options` 为选择题，`answer` 是选项序号，从 0 开始，选项 2–9 个。
- 其余为填空题，`answer` 为字符串或字符串数组；比对时忽略首尾空格、大小写和连续空格。
- 公式：行内 `$...$`，独立行 `$$...$$`；JSON 中反斜杠写两次，如 `"$\\frac{1}{2}$"`。
- 普通文本中的美元符号写作 `\\$`。
- 内容中不能出现 `</script>`。

## 操作

空格或点击翻面；数字键 1–9 选择选项；填空题回车提交；作答后回车进入下一张；左右方向键切换卡片。
